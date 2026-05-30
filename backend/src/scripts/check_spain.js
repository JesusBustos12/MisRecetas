import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function checkSpain() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME, ssl: { rejectUnauthorized: false }
  });
  const conn = await pool.getConnection();
  const [rows] = await conn.query(`SELECT id, title, image_url, category_type, description FROM recipes WHERE category_country IN ('spain', 'Spain') ORDER BY id`);
  
  console.log(`═══ RECETAS ESPAÑOLAS (${rows.length}) ═══\n`);
  for (const r of rows) {
    let title, desc;
    try { title = JSON.parse(r.title); } catch(e) { title = r.title; }
    try { desc = typeof r.description === 'string' && r.description.startsWith('{') ? JSON.parse(r.description) : r.description; } catch(e) { desc = r.description; }
    const titleEs = typeof title === 'object' ? title.es : title;
    const descEs = typeof desc === 'object' ? (desc.es || '') : (desc || '');
    console.log(`ID ${r.id}: ${titleEs} [${r.category_type}]`);
    console.log(`  Imagen: ${r.image_url?.substring(0, 80)}`);
    console.log(`  Desc: ${descEs.substring(0, 100)}`);
    console.log();
  }
  conn.release(); pool.end();
}
checkSpain();
