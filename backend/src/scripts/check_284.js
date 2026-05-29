import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function checkRecipe284() {
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
    const [recipes] = await conn.query("SELECT id, title, image_url, category_type FROM recipes WHERE id IN (284, 285, 286, 283)");
    
    for(const r of recipes) {
      console.log(`\n=== RECIPE ${r.id} ===`);
      console.log(`Title:`, r.title);
      console.log(`Image:`, r.image_url ? (r.image_url.substring(0, 50) + (r.image_url.length > 50 ? '...' : '')) : null);
      console.log(`Type:`, r.category_type);
    }
  } catch (error) {
    console.error(error);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

checkRecipe284();
