import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function check() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME, ssl: { rejectUnauthorized: false }
  });
  
  const conn = await pool.getConnection();
  const [recipes] = await conn.query('SELECT id, title FROM recipes LIMIT 60');
  
  for (const r of recipes) {
    const [comments] = await conn.query('SELECT content FROM comments WHERE recipe_id = ?', [r.id]);
    if (comments.length > 0) {
       console.log('---');
       console.log('ID:', r.id, 'Title:', r.title);
       for (const c of comments) {
          console.log(' -', c.content);
       }
    }
  }
  
  conn.release(); pool.end();
}
check();
