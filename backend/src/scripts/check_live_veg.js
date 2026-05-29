import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function checkLiveServerRegex() {
  const serverPath = path.join(__dirname, '../server.js');
  const serverCode = fs.readFileSync(serverPath, 'utf8');
  
  // Extraer las regex directamente de server.js para que sea 100% fiel
  const meatLandMatch = serverCode.match(/const meatLand = '([^']+)';/);
  const meatSeaMatch = serverCode.match(/const meatSea = '([^']+)';/);
  const dessertTermsMatch = serverCode.match(/const dessertTerms = '([^']+)';/);
  
  const meatLand = meatLandMatch[1];
  const meatSea = meatSeaMatch[1];
  const dessertTerms = dessertTermsMatch[1];

  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });

  const notContentCheck = (regex) => `(LOWER(r.title) NOT REGEXP '${regex}' AND LOWER(CAST(r.ingredients AS CHAR)) NOT REGEXP '${regex}' AND LOWER(r.image_url) NOT REGEXP '${regex}')`;

  let conn;
  try {
    conn = await pool.getConnection();
    
    console.log("=== RECETAS QUE SALEN EN VEGETARIANO USANDO EL REGEX EXACTO DE SERVER.JS ===");
    const query = `
      SELECT id, title, image_url 
      FROM recipes r
      WHERE ${notContentCheck(meatLand)} 
        AND ${notContentCheck(meatSea)} 
        AND ${notContentCheck(dessertTerms)}
    `;
    
    const [recipes] = await conn.query(query);
    recipes.forEach(r => {
      let t = "";
      try {
        const tObj = typeof r.title === 'string' && r.title.startsWith('{') ? JSON.parse(r.title) : r.title;
        t = tObj.es || tObj.en || r.title;
      } catch(e) { t = r.title; }
      console.log(`ID: ${r.id} | ${t} | ${r.image_url.split('/').pop()}`);
    });
    
    console.log(`\nTotal vegetarianas permitidas: ${recipes.length}`);

  } catch (error) {
    console.error(error);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

checkLiveServerRegex();
