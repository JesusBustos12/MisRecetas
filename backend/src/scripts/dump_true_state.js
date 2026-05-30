import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function dumpAll() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME, ssl: { rejectUnauthorized: false }
  });
  const conn = await pool.getConnection();
  
  const [rows] = await conn.query('SELECT id, title, image_url, description FROM recipes ORDER BY id');
  const fs = await import('fs/promises');
  
  const out = rows.map(r => {
    let t = r.title; try { t = typeof t === 'string' ? JSON.parse(t).es : t.es; } catch(e){}
    let d = r.description; try { d = typeof d === 'string' ? JSON.parse(d).es : d.es; } catch(e){}
    return `${r.id} | ${t} | ${r.image_url} | ${String(d).substring(0, 50)}...`;
  }).join('\n');
  
  await fs.writeFile(path.join(__dirname, 'true_db_state.txt'), out);
  console.log('Done mapping IDs to titles and image URLs!');
  
  conn.release(); pool.end();
}
dumpAll();
