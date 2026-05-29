import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function checkOrphans() {
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
    
    // Orphans are recipes that do NOT match Meat, do NOT match Sea, do NOT match Desserts,
    // AND they are somehow failing the Vegetarian check.
    // Wait, the Vegetarian check is EXACTLY "not meat AND not sea AND not dessert".
    // Therefore, EVERY recipe is either Meat, Sea, Dessert, OR Vegetarian!
    // There can be no orphans mathematically!
    
    // So what does the user mean?
    // Maybe they mean: "If a recipe has a meat image, it shouldn't show in vegetarian" -> we fixed that.
    // "If a recipe has a seafood image, it shouldn't show in meat" -> Wait, Surf & Turf is both!
    // But what if the user wants strict MUTUAL EXCLUSION for ALL categories?
    // User: "apliques la solucion para la categoria de carnes, mariscos y postres en sus debidos contextos"
    // "Lo que te funcionó" was the strict exclusion:
    // Vegetarian = NOT Meat AND NOT Sea AND NOT Dessert
    // Dessert = Dessert AND NOT Meat AND NOT Sea (we already did this)
    // Carnes = Meat AND NOT Sea AND NOT Dessert ???
    // Mariscos = Sea AND NOT Meat AND NOT Dessert ???
    // If we do that, we FORCE categories to be mutually exclusive!
    // A recipe with Meat AND Sea (Paella) won't show in Carnes OR Mariscos! That's bad.
    
    console.log("=== RECETAS DE CARNE QUE TAMBIÉN SON MARISCOS (SURF & TURF) ===");
    const [meatAndSea] = await conn.query(`
      SELECT id, title, image_url FROM recipes r
      WHERE ${contentCheck(meatLand)} AND ${contentCheck(meatSea)}
    `);
    meatAndSea.forEach(r => console.log(`ID: ${r.id} | ${r.title} | ${r.image_url.split('/').pop()}`));
    
    console.log("\n=== RECETAS DE CARNE QUE TAMBIÉN SON POSTRES ===");
    const [meatAndDessert] = await conn.query(`
      SELECT id, title, image_url FROM recipes r
      WHERE ${contentCheck(meatLand)} AND ${contentCheck(dessertTerms)}
    `);
    meatAndDessert.forEach(r => console.log(`ID: ${r.id} | ${r.title} | ${r.image_url.split('/').pop()}`));

    console.log("\n=== RECETAS DE MARISCOS QUE TAMBIÉN SON POSTRES ===");
    const [seaAndDessert] = await conn.query(`
      SELECT id, title, image_url FROM recipes r
      WHERE ${contentCheck(meatSea)} AND ${contentCheck(dessertTerms)}
    `);
    seaAndDessert.forEach(r => console.log(`ID: ${r.id} | ${r.title} | ${r.image_url.split('/').pop()}`));

  } catch (error) {
    console.error(error);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

checkOrphans();
