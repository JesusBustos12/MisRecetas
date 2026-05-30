import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function findAndFix() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME, ssl: { rejectUnauthorized: false }
  });
  const conn = await pool.getConnection();
  const [recipes] = await conn.query('SELECT id, title, description FROM recipes ORDER BY id');
  
  const genericPatterns = ['ético', 'saludable', 'sostenible', 'responsable', 'bienestar', 'nutritiv', 'equilibrad'];
  const found = [];
  
  for (const r of recipes) {
    let desc;
    try { desc = typeof r.description === 'string' && r.description.startsWith('{') ? JSON.parse(r.description) : r.description; } catch(e) { desc = r.description; }
    const descEs = typeof desc === 'object' ? (desc.es || '') : (desc || '');
    const isGeneric = genericPatterns.some(p => descEs.toLowerCase().includes(p));
    if (isGeneric) {
      let title;
      try { title = JSON.parse(r.title); } catch(e) { title = r.title; }
      const titleEs = typeof title === 'object' ? title.es : title;
      console.log(`ID ${r.id}: ${titleEs}`);
      console.log(`  → "${descEs.substring(0, 200)}"\n`);
      found.push(r.id);
    }
  }

  // Fix them
  const fixes = {
    // These will be filled based on what we find
  };

  if (found.includes(141)) fixes[141] = { es: 'Cubos de paneer (queso indio) flotando en una salsa vibrante de espinacas frescas con ajo, jengibre y garam masala. Vegetariano, nutritivo y lleno de sabor.', en: 'Paneer (Indian cheese) cubes floating in a vibrant fresh spinach sauce with garlic, ginger and garam masala. Vegetarian, nourishing and full of flavor.' };
  if (found.includes(147)) fixes[147] = { es: 'Garbanzos cocidos en salsa espesa de tomate con cebolla caramelizada, jengibre, ajo y especias como amchur y garam masala. Proteína vegetal con sabor intenso del norte de India.', en: 'Chickpeas simmered in thick tomato sauce with caramelized onion, ginger, garlic and spices like amchur and garam masala. Plant protein with intense flavor from northern India.' };
  if (found.includes(149)) fixes[149] = { es: 'Coliflor y papa cocidas en seco con cúrcuma, comino, cilantro y chile verde. Un clásico vegetariano del norte de India — sencillo, reconfortante y aromático.', en: 'Cauliflower and potato dry-cooked with turmeric, cumin, coriander and green chile. A vegetarian classic from northern India — simple, comforting and aromatic.' };

  // Generic catch-all fixes for any remaining
  for (const id of found) {
    if (!fixes[id]) {
      // Fetch the recipe to build a proper description
      const [row] = await conn.query('SELECT title, ingredients, category_country FROM recipes WHERE id = ?', [id]);
      let title, ings;
      try { title = JSON.parse(row[0].title); } catch(e) { title = row[0].title; }
      try { ings = JSON.parse(row[0].ingredients); } catch(e) { ings = []; }
      const titleEs = typeof title === 'object' ? title.es : title;
      const titleEn = typeof title === 'object' ? title.en : title;
      const mainIngs = ings.slice(0, 3).map(i => typeof i === 'object' ? i.es : i).join(', ');
      
      fixes[id] = {
        es: `${titleEs}: una receta auténtica de ${row[0].category_country} elaborada con ${mainIngs}. Sabores tradicionales en cada bocado.`,
        en: `${titleEn}: an authentic ${row[0].category_country} recipe made with the finest traditional ingredients. Traditional flavors in every bite.`
      };
    }
  }

  if (Object.keys(fixes).length > 0) {
    console.log('═══ CORRIGIENDO ═══\n');
    for (const [id, desc] of Object.entries(fixes)) {
      // Remove the problematic words
      let descEs = desc.es.replace(/nutritivo/gi, 'lleno de sabor').replace(/saludable/gi, 'reconfortante').replace(/equilibrad/gi, 'armónic');
      let descEn = desc.en.replace(/nutritious/gi, 'flavorful').replace(/healthy/gi, 'wholesome');
      const fixedDesc = { es: descEs, en: descEn };
      await conn.query('UPDATE recipes SET description = ? WHERE id = ?', [JSON.stringify(fixedDesc), parseInt(id)]);
      console.log(`  ✅ ID ${id}: "${descEs.substring(0, 80)}..."`);
    }
  }

  console.log(`\n📊 Encontradas: ${found.length}, Corregidas: ${Object.keys(fixes).length}`);
  conn.release(); pool.end();
}
findAndFix();
