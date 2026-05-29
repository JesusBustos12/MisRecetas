import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function check284Data() {
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
    const [recipes] = await conn.query("SELECT id, title, description, ingredients, steps, category_type FROM recipes WHERE id = 284");
    
    if (recipes.length > 0) {
      const r = recipes[0];
      console.log(`=== RECETA 284 ===`);
      console.log(`TITULO:`, r.title);
      console.log(`DESCRIPCION:`, r.description);
      console.log(`INGREDIENTES:`, r.ingredients);
      console.log(`PASOS:`, r.steps);
      console.log(`CATEGORIA:`, r.category_type);
    } else {
      console.log("No se encontró la receta 284.");
    }

  } catch (error) {
    console.error(error);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

check284Data();
