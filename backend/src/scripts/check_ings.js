import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function checkIngs() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT id, ingredients, category_type FROM recipes WHERE id IN (176, 170, 118)');
    for (const r of rows) {
      console.log(`\nID: ${r.id} | CAT: ${r.category_type}`);
      const ings = typeof r.ingredients === 'string' ? JSON.parse(r.ingredients) : r.ingredients;
      console.log(ings);
    }
    conn.release();
  } catch(e) { console.error(e); }
  pool.end();
}
checkIngs();
