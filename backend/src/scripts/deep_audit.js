import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function deepAudit() {
  const serverPath = path.join(__dirname, '../server.js');
  const serverCode = fs.readFileSync(serverPath, 'utf8');
  
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

  const contentCheck = (regex) => `(LOWER(r.title) REGEXP '${regex}' OR LOWER(CAST(r.ingredients AS CHAR)) REGEXP '${regex}' OR LOWER(r.image_url) REGEXP '${regex}')`;
  const notContentCheck = (regex) => `(LOWER(r.title) NOT REGEXP '${regex}' AND LOWER(CAST(r.ingredients AS CHAR)) NOT REGEXP '${regex}' AND LOWER(r.image_url) NOT REGEXP '${regex}')`;

  let conn;
  try {
    conn = await pool.getConnection();
    
    // 1. Mostrar receta 147 completa
    console.log("========== RECETA 147 COMPLETA ==========");
    const [r147] = await conn.query('SELECT id, title, description, ingredients, steps, image_url, category_type, category_country FROM recipes WHERE id = 147');
    if (r147.length > 0) {
      const r = r147[0];
      console.log("TITULO:", r.title);
      console.log("DESCRIPCION:", typeof r.description === 'string' ? r.description.substring(0, 300) : JSON.stringify(r.description).substring(0, 300));
      console.log("INGREDIENTES:", typeof r.ingredients === 'string' ? r.ingredients.substring(0, 500) : JSON.stringify(r.ingredients).substring(0, 500));
      console.log("PASOS:", typeof r.steps === 'string' ? r.steps.substring(0, 500) : JSON.stringify(r.steps).substring(0, 500));
      console.log("IMAGEN:", r.image_url);
      console.log("CATEGORIA:", r.category_type);
      console.log("PAIS:", r.category_country);
    }
    
    // 2. Listar TODAS las recetas que caen en la categoria "carnes" con el filtro actual
    console.log("\n========== TODAS LAS RECETAS EN CATEGORÍA CARNES ==========");
    const carnesQuery = `
      SELECT id, title, image_url, category_type
      FROM recipes r
      WHERE ${contentCheck(meatLand)} AND ${notContentCheck(meatSea)} AND ${notContentCheck(dessertTerms)}
      ORDER BY r.created_at DESC, r.id DESC
    `;
    const [carnes] = await conn.query(carnesQuery);
    carnes.forEach(r => {
      let t = "";
      try {
        const tObj = typeof r.title === 'string' && r.title.startsWith('{') ? JSON.parse(r.title) : r.title;
        t = tObj.es || tObj.en || r.title;
      } catch(e) { t = r.title; }
      console.log(`ID: ${r.id} | ${t} | ${r.image_url.split('/').pop()} | BD: ${r.category_type}`);
    });
    console.log(`\nTotal en carnes: ${carnes.length}`);

  } catch (error) {
    console.error(error);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

deepAudit();
