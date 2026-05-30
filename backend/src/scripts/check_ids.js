import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const targetIds = [54, 67, 73]; // IDs we assigned Lobster to

async function checkIds() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME, ssl: { rejectUnauthorized: false }
  });
  const conn = await pool.getConnection();
  
  const [rows] = await conn.query('SELECT id, title FROM recipes WHERE id IN (54, 67, 73, 24)');
  for (const row of rows) {
    let title;
    try { title = typeof row.title === 'string' ? JSON.parse(row.title).es : row.title; } catch(e) { title = row.title; }
    console.log(`ID ${row.id} in DB has title: ${title}`);
  }
  
  conn.release(); pool.end();
}
checkIds();
