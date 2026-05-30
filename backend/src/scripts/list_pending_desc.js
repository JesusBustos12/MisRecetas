import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function listAll() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME, ssl: { rejectUnauthorized: false }
  });
  const conn = await pool.getConnection();
  // Get all recipes NOT in part 1 (IDs > 73 or missing from part1)
  const [rows] = await conn.query(`SELECT id, title, category_country, category_type FROM recipes WHERE id NOT IN (1,2,3,4,5,6,7,8,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73) ORDER BY category_country, id`);
  
  let country = '';
  for (const r of rows) {
    let t; try { t = JSON.parse(r.title); } catch(e) { t = r.title; }
    const name = typeof t === 'object' ? t.es : t;
    if (r.category_country !== country) {
      country = r.category_country;
      console.log(`\n═══ ${country?.toUpperCase()} (${rows.filter(x=>x.category_country===country).length}) ═══`);
    }
    console.log(`  ${r.id}: ${name} [${r.category_type}]`);
  }
  console.log(`\nTotal pendientes: ${rows.length}`);
  conn.release(); pool.end();
}
listAll();
