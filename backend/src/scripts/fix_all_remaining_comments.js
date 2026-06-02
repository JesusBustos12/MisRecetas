import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// Lista exacta de todos los comentarios viejos problemáticos/spam encontrados en el análisis
const toxicComments = [
  "Sabor delicioso. La próxima vez probaré agregándole algunas hierbas frescas extra.",
  "Muy fácil de preparar y el resultado es de restaurante. La guardo en favoritos.",
  "¡Magia pura en la cocina! Quedé como un chef profesional con esta preparación.",
  "Nos gustó bastante. Una receta sólida y confiable para cualquier día.",
  "Buena explicación, la salsa quedó muy espesa así que le puse un poco de agua.",
  "Gran opción para salir de la rutina, el resultado final fue muy satisfactorio.",
  "Muy rica, pero le tuve que ajustar un poco la sal para mi gusto personal.",
  "Me convenció. No es la receta más rápida, pero vale la pena el esfuerzo.",
  "Excelente receta, las instrucciones son súper claras y precisas.",
  "Buena receta, aunque tardé un poco más de lo que indica el tiempo de preparación.",
  "Una joya de la gastronomía. Me transportó a los sabores tradicionales, 10/10.",
  "A mi familia le encantó. Definitivamente la haré seguido.",
  "¡Increíble! Nunca pensé que cocinar esto fuera tan sencillo y quedara tan rico.",
  "Quedó muy bien. Las texturas son excelentes, pero le faltó un toquecito de picante.",
  "El sabor es de otro mundo, el equilibrio de ingredientes es perfecto.",
  "¡Simplemente espectacular! La receta me quedó igual a la foto.",
  "Receta decente. Cumple su función pero no es la mejor versión que he probado.",
  "Está bien, pero le faltaba algo de intensidad en los sabores, quizás más especias.",
  "Ni fú ni fa. Se deja comer pero no creo que entre a mi menú habitual.",
  "Normal, me sirvió para salir del paso en la cena pero no sé si la repita.",
  "Pasable, tuve que improvisar un poco en algunos pasos porque no me quedaba igual.",
  "Regular. Quizás cometí algún error, pero no me deslumbró el sabor final.",
  "Bien a secas. Los ingredientes son buenos pero el método podría mejorar.",
  "Un platillo aceptable. Es una base buena, pero requiere modificaciones personales."
];

// Pool de comentarios 100% seguros y genéricos (no hablan de picante, horno, cena, caldos, etc.)
const superSafePool = [
  { content: "¡Me quedó increíble! Seguí las instrucciones al pie de la letra y fue un éxito.", rating: 5 },
  { content: "La presentación final es hermosa y de sabor está estupendo.", rating: 5 },
  { content: "Lo hice este fin de semana y a todos en casa les fascinó.", rating: 5 },
  { content: "La explicación es súper clara. Lo recomiendo totalmente.", rating: 5 },
  { content: "Muy buena receta, los tiempos de preparación fueron bastante precisos.", rating: 4 },
  { content: "Quedé sorprendido con lo rico que salió. Definitivamente lo guardo.", rating: 5 },
  { content: "Es la segunda vez que lo preparo y cada vez me queda mejor.", rating: 5 },
  { content: "¡Riquísimo! Me encantó la combinación de ingredientes.", rating: 5 },
  { content: "Fácil, rápido y súper lucidor. Una receta de diez.", rating: 5 },
  { content: "El resultado es idéntico a las fotografías. ¡Excelente aporte!", rating: 5 },
  { content: "Una preparación muy noble, no tuve complicaciones durante el proceso.", rating: 4 },
  { content: "Tiene un balance perfecto, nada pesado y muy agradable al paladar.", rating: 5 },
  { content: "A mis invitados les encantó. Sin duda lo volveré a hacer.", rating: 5 },
  { content: "Las proporciones son muy exactas, la consistencia quedó maravillosa.", rating: 5 },
  { content: "Qué delicia. Hacía tiempo que buscaba una receta así de detallada.", rating: 5 },
  { content: "Súper práctico. Se ha vuelto uno de los favoritos en mi casa.", rating: 4 },
  { content: "Lo preparé sin problemas y el sabor es sumamente auténtico.", rating: 5 },
  { content: "Vale completamente la pena intentarlo, es más fácil de lo que parece.", rating: 5 },
  { content: "Excelente receta. Muy bien explicada y el resultado habla por sí solo.", rating: 5 },
  { content: "Todo salió perfecto. Un platillo muy reconfortante.", rating: 4 }
];

async function fixAllRemaining() {
  console.log('🧹 INICIANDO LA GRAN PURGA DE COMENTARIOS INCONGRUENTES...\n');
  
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });

  let conn;
  try {
    conn = await pool.getConnection();
    
    // 1. ELIMINAR LOS COMENTARIOS TÓXICOS
    let totalDeleted = 0;
    for (const badStr of toxicComments) {
      const [result] = await conn.query('DELETE FROM comments WHERE content = ?', [badStr]);
      totalDeleted += result.affectedRows;
    }
    console.log(`🗑️ Se han eliminado exitosamente ${totalDeleted} comentarios incongruentes/repetitivos de la base de datos.`);

    // 2. IDENTIFICAR RECETAS HUÉRFANAS O CON MENOS DE 3 COMENTARIOS
    const [recipes] = await conn.query('SELECT id, title FROM recipes');
    const [users] = await conn.query('SELECT id FROM users');
    
    let recipesFixed = 0;
    let commentsInserted = 0;

    for (const r of recipes) {
      // Contar comentarios actuales de esta receta
      const [currComments] = await conn.query('SELECT count(*) as count FROM comments WHERE recipe_id = ?', [r.id]);
      const currCount = currComments[0].count;

      if (currCount < 3) {
        // La receta necesita relleno seguro
        let title;
        try { title = typeof r.title === 'string' && r.title.startsWith('{') ? JSON.parse(r.title) : r.title; } catch(e) { title = r.title; }
        const titleEs = (typeof title === 'object' ? title.es : title) || '';

        const targetCount = Math.floor(Math.random() * 5) + 3; // 3 a 7
        const needed = targetCount - currCount;
        
        // Seleccionar aleatoriamente del superSafePool
        let selected = [...superSafePool].sort(() => 0.5 - Math.random()).slice(0, needed);
        let shuffledUsers = [...users].sort(() => 0.5 - Math.random());
        
        for (let i = 0; i < selected.length; i++) {
          const review = selected[i];
          const randomUser = shuffledUsers[i].id;
          const randomPastDays = Math.floor(Math.random() * 180);
          const createdAt = new Date(Date.now() - randomPastDays * 24 * 60 * 60 * 1000);

          await conn.query(
            'INSERT INTO comments (recipe_id, user_id, content, rating, created_at) VALUES (?, ?, ?, ?, ?)',
            [r.id, randomUser, review.content, review.rating, createdAt]
          );
          commentsInserted++;
        }
        
        recipesFixed++;
      }
    }
    
    console.log(`\n🎉 LA BASE DE DATOS ESTÁ LIMPIA. Se sanearon ${recipesFixed} recetas y se inyectaron ${commentsInserted} comentarios 100% neutrales.`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

fixAllRemaining();
