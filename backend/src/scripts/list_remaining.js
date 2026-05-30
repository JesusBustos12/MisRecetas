import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const ids = [17, 20, 30, 34, 45, 47, 49, 58, 73, 79, 81, 82, 85, 86, 87, 89, 91, 92, 93, 94, 95, 100, 103, 105, 108, 113, 114, 115, 116, 117, 118, 119, 124, 129, 132, 134, 136, 143, 144, 148, 149, 154, 156, 158, 163, 164, 169, 170, 171, 173, 175, 176, 177, 178, 181, 194, 200, 201, 202, 203, 205, 209, 210, 218];

async function listRemaining() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME, ssl: { rejectUnauthorized: false }
  });
  const conn = await pool.getConnection();
  const [rows] = await conn.query(`SELECT id, title, category_type, category_country FROM recipes WHERE id IN (${ids.join(',')}) ORDER BY category_country, id`);
  
  let currentCountry = '';
  for (const r of rows) {
    let t;
    try { t = typeof r.title === 'string' && r.title.startsWith('{') ? JSON.parse(r.title) : r.title; } catch(e) { t = r.title; }
    const name = typeof t === 'object' ? t.es : t;
    if (r.category_country !== currentCountry) {
      currentCountry = r.category_country;
      console.log(`\n═══ ${currentCountry?.toUpperCase()} ═══`);
    }
    console.log(`  ID ${r.id}: ${name} [${r.category_type}]`);
  }
  console.log(`\nTotal: ${rows.length} recetas pendientes`);
  conn.release(); pool.end();
}
listRemaining();
