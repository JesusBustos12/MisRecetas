import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pool from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'cambiar-en-produccion';

// Security & Rate Limiting
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [process.env.CORS_ORIGIN || 'http://localhost:4000', 'http://localhost:3000'];
    if (!origin || allowedOrigins.includes(origin) || (origin && origin.endsWith('.vercel.app'))) {
        callback(null, true);
    } else {
        callback(new Error('Origen no permitido por CORS'));
    }
  },
  credentials: true
}));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  message: { error: 'Demasiados intentos desde esta IP. Por favor, intenta de nuevo en 15 minutos.' }
});

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Auth Middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API de MisRecetas (MySQL + Express)' });
});

// --- AUTHENTICATION ROUTES ---

// Endpoint para Registro
app.post('/api/auth/register', loginLimiter, async (req, res) => {
  try {
    const { full_name, email, password, avatar_url } = req.body;

    if (!full_name || !email || !password) {
      console.log('Faltan campos en el registro:', { full_name: !!full_name, email: !!email, password: !!password });
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Verificar si el usuario ya existe
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'conflict', message: 'El correo electrónico ya está registrado' });
    }

    // Insertar nuevo usuario
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, password, avatar_url) VALUES (?, ?, ?, ?)',
      [full_name, email, hashedPassword, avatar_url]
    );

    const newUser = {
      id: result.insertId,
      full_name,
      email,
      avatar_url
    };

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: newUser,
      token
    });
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({ error: 'Error interno durante el registro' });
  }
});

// Endpoint para Inicio de Sesión
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    const [rows] = await pool.query(
      'SELECT id, full_name, email, password, avatar_url FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = rows[0];

    // Verificar contraseña con bcrypt
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Eliminar password del objeto de respuesta
    delete user.password;

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Inicio de sesión exitoso',
      user,
      token
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Error interno durante el inicio de sesión' });
  }
});

// Endpoint para obtener todas las recetas (con filtrado, búsqueda y paginación)
app.get('/api/recipes', async (req, res) => {
  try {
    const { page = 1, limit = 12, search, category, type } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT r.*, u.full_name as author_name, u.avatar_url as author_avatar,
        (SELECT ROUND(AVG(c.rating), 1) FROM comments c WHERE c.recipe_id = r.id AND c.rating > 0) as rating
      FROM recipes r 
      JOIN users u ON r.user_id = u.id 
      WHERE 1=1
    `;
    const params = [];

    const getSearchFilter = async (searchTerm) => {
      if (!searchTerm) return { queryAdd: '', paramsAdd: [] };

      // 1. Obtener sinónimos
      const [synRows] = await pool.query('SELECT word, synonym FROM synonyms');
      const synMap = {};
      synRows.forEach(row => {
        const w = row.word.toLowerCase();
        if (!synMap[w]) synMap[w] = [];
        synMap[w].push(row.synonym.toLowerCase());
      });

      // 2. Dividir en palabras y expandir
      const words = searchTerm.toLowerCase().trim().split(/\s+/).filter(w => w.length > 1);
      let queryAdd = '';
      const paramsAdd = [];

      words.forEach(word => {
        const expanded = [word, ...(synMap[word] || [])];
        const group = expanded.map(() =>
          `(LOWER(r.title) LIKE ? OR LOWER(r.description) LIKE ? OR CAST(r.ingredients AS CHAR) LIKE ? OR LOWER(r.category_country) LIKE ? OR LOWER(r.category_type) LIKE ?)`
        ).join(' OR ');

        queryAdd += ` AND (${group})`;
        expanded.forEach(e => {
          const val = `%${e}%`;
          paramsAdd.push(val, val, val, val, val);
        });
      });

      return { queryAdd, paramsAdd };
    };

    const { queryAdd, paramsAdd } = await getSearchFilter(search);
    query += queryAdd;
    params.push(...paramsAdd);

    const applyCategoryFilter = (q, p, cat) => {
      const catLower = cat.toLowerCase();
      if (catLower === 'mexico' || catLower === 'méxico') {
        q += ` AND (LOWER(r.category_country) = 'mexico' OR LOWER(r.category_country) = 'méxico')`;
      } else if (catLower === 'spain' || catLower === 'españa') {
        q += ` AND (LOWER(r.category_country) = 'spain' OR LOWER(r.category_country) = 'españa')`;
      } else if (catLower === 'japan' || catLower === 'japón') {
        q += ` AND (LOWER(r.category_country) = 'japan' OR LOWER(r.category_country) = 'japón')`;
      } else if (catLower === 'thailand' || catLower === 'tailandia') {
        q += ` AND (LOWER(r.category_country) = 'thailand' OR LOWER(r.category_country) = 'tailandia')`;
      } else if (catLower === 'greece' || catLower === 'grecia') {
        q += ` AND (LOWER(r.category_country) = 'greece' OR LOWER(r.category_country) = 'grecia')`;
      } else {
        q += ` AND LOWER(r.category_country) = ?`;
        p.push(catLower);
      }
      return q;
    };

    if (!search && category && category !== 'World' && category !== 'Todas') {
      query = applyCategoryFilter(query, params, category);
    }

    const applyTypeFilter = (q, p, typeVal) => {
      // Regex for filtering based on content to bypass contaminated category_type
      const meatLand = 'pollo|carne|cerdo|beef|pork|cordero|steak|ternera|chuleta|tocino|bacon|jamon|jamón|salchicha|pepperoni|salami|pavo|turkey|duck|pato|meatball|albóndiga|brisket|wings|prosciutto|guanciale|pancetta|chorizo|carnitas|cochinita|pastrami|veal|lamb|ribs|costillas|ossobuco|bolognese|boloñesa|katsu|tonkotsu|sukiyaki|okonomiyaki|gyoza|omurice|tamales|pozole|menudo|barbacoa|hot dog|perrito|hamburguesa|burger|bistecca|fiorentina|meatloaf|wonton|jambalaya|ahogada|cocido|fabada|mapo tofu|jiaozi|dumpling|dim sum|mole poblano|nogada|gravy|carbonara|ragu|ragú|cochinillo|coq|boeuf|bourguignon|cassoulet|rogan josh|moussaka|tlayuda|shabu|pastitsio|escargot|brodo';
      const meatSea = 'pescado|fish|camaron|camarón|shrimp|marisco|seafood|salmon|salmón|atun|atún|pulpo|octopus|calamar|squid|bacalao|tuna|lobster|langosta|crab|cangrejo|mussels|mejillones|clams|almejas|ostras|oysters|vieiras|scallops|prawns|gambas|langostinos|aguachile|ceviche|takoyaki|unagi|paella|anchoa|anchovy|pissaladiere|pissaladière|chowder|bouillabaisse|nicoise|niçoise|chawanmushi|coquilles|saint-jacques';
      const dessertTerms = 'postre|dulce|tarta|pastel|cake|dessert|chocolate|helado|flan|galleta|cookie|brownie|muffin|cupcake|mermelada|mousse|creme brulee|pudding|pudin|pay|pie|caramelo|tiramisu|tiramisú|gelato|cannoli|panettone|panna cotta|crepe|crêpe|macaron|baklava|dorayaki|mochi|profiteroles|churros|sfogliatella|zabaione|zeppole|loukoumades|mooncakes';
      
      const type = typeVal ? typeVal.toLowerCase() : '';
      
      const contentCheck = (regex) => `(LOWER(r.title) REGEXP '${regex}' OR LOWER(CAST(r.ingredients AS CHAR)) REGEXP '${regex}' OR LOWER(r.image_url) REGEXP '${regex}')`;
      const notContentCheck = (regex) => `(LOWER(r.title) NOT REGEXP '${regex}' AND LOWER(CAST(r.ingredients AS CHAR)) NOT REGEXP '${regex}' AND LOWER(r.image_url) NOT REGEXP '${regex}')`;

      if (type === 'meat' || type === 'carnes' || type === 'carne') {
        q += ` AND ${contentCheck(meatLand)}`;
      } else if (type === 'seafood' || type === 'mariscos' || type === 'marisco') {
        q += ` AND ${contentCheck(meatSea)}`;
      } else if (type === 'dessert' || type === 'desserts' || type === 'postres' || type === 'postre') {
        q += ` AND ${contentCheck(dessertTerms)}`;
      } else if (type === 'vegetarian' || type === 'vegetariano') {
        q += ` AND (${notContentCheck(meatLand)} AND ${notContentCheck(meatSea)} AND ${notContentCheck(dessertTerms)})`;
      }
      return q;
    };

    if (!search && type) {
      query = applyTypeFilter(query, params, type);
    }

    query += ` ORDER BY r.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    if (!process.env.VERCEL) {
      const fs = await import('fs');
      fs.appendFileSync('query_log.txt', `\n--- NEW QUERY ---\nQUERY_PARAMS: ${JSON.stringify(req.query)}\nSEARCH: ${search}\nCATEGORY: ${category}\nQUERY: ${query}\nPARAMS: ${JSON.stringify(params)}\n`);
    }
    const [rows] = await pool.query(query, params);

    // Contar total para paginación (con los mismos filtros)
    let countQuery = `SELECT COUNT(*) as total FROM recipes r WHERE 1=1`;
    const countParams = [];

    const countFilter = await getSearchFilter(search);
    countQuery += countFilter.queryAdd;
    countParams.push(...countFilter.paramsAdd);

    if (!search && category && category !== 'World' && category !== 'Todas') {
      countQuery = applyCategoryFilter(countQuery, countParams, category);
    }
    if (!search && type) {
      countQuery = applyTypeFilter(countQuery, countParams, type);
    }

    const [countRows] = await pool.query(countQuery, countParams);
    const total = countRows[0].total;

    res.json({
      data: rows,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Error al obtener las recetas' });
  }
});

// Endpoint para obtener UNA receta individual
app.get('/api/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT r.*, u.full_name as author_name, u.avatar_url as author_avatar,
        (SELECT ROUND(AVG(c.rating), 1) FROM comments c WHERE c.recipe_id = r.id AND c.rating > 0) as rating
      FROM recipes r
      JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching single recipe:', error);
    res.status(500).json({ error: 'Error al obtener la receta' });
  }
});

// Endpoint para CREAR receta
app.post('/api/recipes', authMiddleware, async (req, res) => {
  try {
    const {
      title, description, steps, ingredients, prep_time,
      cook_time, servings, category_country, image_url, user_id
    } = req.body;

    const [result] = await pool.query(`
      INSERT INTO recipes 
      (title, description, steps, ingredients, prep_time, cook_time, servings, category_country, image_url, user_id, category_type, diet_type, nutrition)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'vegetarian', 'Omnívoro', '{}')
    `, [
      title, description, steps, ingredients, prep_time,
      cook_time, servings, category_country, image_url, user_id
    ]);

    res.status(201).json({ id: result.insertId, message: 'Receta creada exitosamente' });
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Error al crear la receta', details: error.message });
  }
});

// Endpoint para ACTUALIZAR receta
app.put('/api/recipes/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, description, steps, ingredients, prep_time,
      cook_time, servings, category_country, image_url
    } = req.body;

    // Verificar que el usuario es el dueño de la receta
    const [owner] = await pool.query('SELECT user_id FROM recipes WHERE id = ?', [id]);
    if (owner.length === 0) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }
    if (String(owner[0].user_id) !== String(req.user.id)) {
      return res.status(403).json({ error: 'No tienes permiso para editar esta receta' });
    }

    await pool.query(`
      UPDATE recipes 
      SET title = ?, description = ?, steps = ?, ingredients = ?, 
          prep_time = ?, cook_time = ?, servings = ?, 
          category_country = ?, image_url = ?
      WHERE id = ? AND user_id = ?
    `, [
      title, description, steps, ingredients, prep_time,
      cook_time, servings, category_country, image_url, id, req.user.id
    ]);

    res.json({ message: 'Receta actualizada correctamente' });
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Error al actualizar la receta', details: error.message });
  }
});

// Endpoint para BORRAR receta
app.delete('/api/recipes/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario es el dueño de la receta
    const [owner] = await pool.query('SELECT user_id FROM recipes WHERE id = ?', [id]);
    if (owner.length === 0) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }
    if (String(owner[0].user_id) !== String(req.user.id)) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta receta' });
    }

    await pool.query('DELETE FROM favorites WHERE recipe_id = ?', [id]);
    await pool.query('DELETE FROM comments WHERE recipe_id = ?', [id]);
    await pool.query('DELETE FROM recipes WHERE id = ? AND user_id = ?', [id, req.user.id]);

    res.json({ message: 'Receta eliminada correctamente' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Error al eliminar la receta' });
  }
});

// --- COMMENTS & RATINGS ---

// Obtener comentarios de una receta
app.get('/api/recipes/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT c.*, u.full_name as user_name, u.avatar_url as user_avatar
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.recipe_id = ?
      ORDER BY c.created_at DESC
    `, [id]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
});

// Agregar comentario/calificación
app.post('/api/recipes/:id/comments', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, content, rating } = req.body;

    // Verificar si ya existe una reseña de este usuario para esta receta
    const [existing] = await pool.query('SELECT id FROM comments WHERE recipe_id = ? AND user_id = ?', [id, user_id]);

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Ya has calificado esta receta.' });
    }

    await pool.query(`
      INSERT INTO comments (recipe_id, user_id, content, rating)
      VALUES (?, ?, ?, ?)
    `, [id, user_id, content, rating || 5]);

    res.status(201).json({ message: 'Comentario añadido' });
  } catch (error) {
    console.error('Error posting comment:', error);
    res.status(500).json({ error: 'Error al añadir comentario' });
  }
});

// Editar comentario/calificación
app.put('/api/comments/:commentId', authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content, rating } = req.body;

    // Verify ownership
    const [existing] = await pool.query('SELECT user_id FROM comments WHERE id = ?', [commentId]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Comentario no encontrado.' });
    }

    if (String(existing[0].user_id) !== String(req.user.id)) {
      return res.status(403).json({ error: 'No tienes permiso para editar este comentario.' });
    }

    await pool.query(`
      UPDATE comments 
      SET content = ?, rating = ?
      WHERE id = ?
    `, [content, rating || 5, commentId]);

    res.json({ message: 'Comentario actualizado' });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Error al actualizar comentario' });
  }
});

// Endpoint para obtener el perfil de un usuario
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT id, full_name, email, avatar_url, created_at FROM users WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
});

// Endpoint para obtener las RECETAS PROPIAS de un usuario
app.get('/api/users/:id/recipes', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM recipes WHERE user_id = ? ORDER BY created_at DESC', [id]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    res.status(500).json({ error: 'Error al obtener tus recetas' });
  }
});

// Endpoint para obtener las RECETAS FAVORITAS de un usuario
app.get('/api/users/:id/favorites', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT r.* 
      FROM recipes r
      JOIN favorites f ON r.id = f.recipe_id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `, [id]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching favorite recipes:', error);
    res.status(500).json({ error: 'Error al obtener tus favoritos' });
  }
});

// Endpoint para ACTUALIZAR perfil de usuario (Smarter Update)
app.put('/api/users/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario solo puede editar su propio perfil
    if (String(id) !== String(req.user.id)) {
      return res.status(403).json({ error: 'No tienes permiso para editar este perfil' });
    }

    const { full_name, avatar_url, email } = req.body;

    // Construir la consulta dinámicamente para no sobreescribir con NULL
    let query = 'UPDATE users SET ';
    const params = [];
    const updates = [];

    if (full_name !== undefined) {
      updates.push('full_name = ?');
      params.push(full_name);
    }
    if (avatar_url !== undefined) {
      updates.push('avatar_url = ?');
      params.push(avatar_url);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      params.push(email);
    }
    if (req.body.password !== undefined && req.body.password !== '') {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      updates.push('password = ?');
      params.push(hashedPassword);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
    }

    query += updates.join(', ') + ' WHERE id = ?';
    params.push(id);

    await pool.query(query, params);

    res.json({ message: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
});

// Endpoint para TOGGLE favorito
app.post('/api/favorites/toggle', authMiddleware, async (req, res) => {
  try {
    const { user_id, recipe_id } = req.body;

    // Verificar si existe
    const [existing] = await pool.query(
      'SELECT * FROM favorites WHERE user_id = ? AND recipe_id = ?',
      [user_id, recipe_id]
    );

    if (existing.length > 0) {
      await pool.query('DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?', [user_id, recipe_id]);
      res.json({ favorite: false });
    } else {
      await pool.query('INSERT INTO favorites (user_id, recipe_id) VALUES (?, ?)', [user_id, recipe_id]);
      res.json({ favorite: true });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Error al gestionar favorito' });
  }
});

// Endpoint para probar la conexión
app.get('/api/status', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    res.json({
      status: 'OK',
      database: 'Conectada exitosamente',
      test: rows[0].solution
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'No se pudo conectar a la base de datos',
      detail: error.message
    });
  }
});


// Iniciar servidor localmente (omitido en Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
  });
}

export default app;
