import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function debugMeatMatch() {
  const serverPath = path.join(__dirname, '../server.js');
  const serverCode = fs.readFileSync(serverPath, 'utf8');
  const meatLandMatch = serverCode.match(/const meatLand = '([^']+)';/);
  const meatLand = meatLandMatch[1];
  const regex = new RegExp(meatLand, 'i');

  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });

  const idsToTest = [142, 176, 170, 118, 31];

  let conn;
  try {
    conn = await pool.getConnection();
    for (const id of idsToTest) {
      const [rows] = await conn.query('SELECT title, ingredients, image_url FROM recipes WHERE id = ?', [id]);
      if (rows.length === 0) continue;
      const r = rows[0];
      
      let title = typeof r.title === 'string' ? r.title : JSON.stringify(r.title);
      let ings = typeof r.ingredients === 'string' ? r.ingredients : JSON.stringify(r.ingredients);
      let img = r.image_url;

      const fullStr = `${title} ${ings} ${img}`.toLowerCase();
      const match = fullStr.match(regex);
      
      console.log(`ID ${id} Match en Carnes:`, match ? match[0] : "NINGUNO!");
      if (match) {
        console.log(`  Encontrado en:`);
        if (regex.test(title.toLowerCase())) console.log(`  - Título (${title.match(regex)[0]})`);
        if (regex.test(ings.toLowerCase())) {
           // extract some context
           const idx = ings.toLowerCase().indexOf(match[0]);
           console.log(`  - Ingredientes: "...${ings.substring(Math.max(0, idx - 20), idx + 20)}..."`);
        }
        if (regex.test(img.toLowerCase())) console.log(`  - Imagen (${img.match(regex)[0]})`);
      }
      console.log('---');
    }
  } catch (error) {
    console.error(error);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

debugMeatMatch();
