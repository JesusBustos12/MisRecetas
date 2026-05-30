import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function find() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME, ssl: { rejectUnauthorized: false }
  });
  const conn = await pool.getConnection();
  
  // Buscar cualquier receta con macaron/macarron en el título
  const [rows] = await conn.query(`SELECT id, title, ingredients, steps, category_country FROM recipes WHERE title LIKE '%macaron%' OR title LIKE '%macarr%' OR title LIKE '%Macaron%'`);
  
  for (const r of rows) {
    let title, ingredients, steps;
    try { title = JSON.parse(r.title); } catch(e) { title = r.title; }
    try { ingredients = JSON.parse(r.ingredients); } catch(e) { ingredients = r.ingredients; }
    try { steps = JSON.parse(r.steps); } catch(e) { steps = r.steps; }
    
    console.log(`\nID ${r.id}: ${typeof title === 'object' ? title.es : title} [${r.category_country}]`);
    console.log('INGREDIENTES:', JSON.stringify(ingredients, null, 0).substring(0, 300));
    console.log('PASOS:', JSON.stringify(steps, null, 0).substring(0, 400));
  }
  
  if (rows.length === 0) {
    console.log('No encontré "macaron" en títulos. Buscando todas las de Francia...');
    const [fr] = await conn.query(`SELECT id, title FROM recipes WHERE category_country = 'france' ORDER BY id`);
    for (const r of fr) {
      let t; try { t = JSON.parse(r.title); } catch(e) { t = r.title; }
      console.log(`  ID ${r.id}: ${typeof t === 'object' ? t.es : t}`);
    }
  }
  
  conn.release(); pool.end();
}
find();
