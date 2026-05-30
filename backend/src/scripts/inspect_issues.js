import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function inspect() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME, ssl: { rejectUnauthorized: false }
  });
  const conn = await pool.getConnection();
  
  // IDs críticos + buscar macarons de Francia
  const [rows] = await conn.query(`SELECT id, title, ingredients, steps, category_country FROM recipes WHERE id IN (23, 33, 59) OR (title LIKE '%macaron%' AND category_country = 'france') ORDER BY id`);
  
  for (const r of rows) {
    let title, ingredients, steps;
    try { title = JSON.parse(r.title); } catch(e) { title = r.title; }
    try { ingredients = JSON.parse(r.ingredients); } catch(e) { ingredients = r.ingredients; }
    try { steps = JSON.parse(r.steps); } catch(e) { steps = r.steps; }
    
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`ID ${r.id}: ${typeof title === 'object' ? title.es : title} [${r.category_country}]`);
    console.log(`${'═'.repeat(60)}`);
    
    console.log('\n📦 INGREDIENTES:');
    if (Array.isArray(ingredients)) {
      ingredients.forEach((ing, i) => {
        const text = typeof ing === 'object' ? ing.es : ing;
        console.log(`  ${i+1}. ${text}`);
      });
    } else {
      console.log('  ', JSON.stringify(ingredients)?.substring(0, 200));
    }
    
    console.log('\n👨‍🍳 PASOS:');
    if (Array.isArray(steps)) {
      steps.forEach((step, i) => {
        const text = typeof step === 'object' ? step.es : step;
        console.log(`  ${i+1}. ${text}`);
      });
    } else {
      console.log('  ', JSON.stringify(steps)?.substring(0, 200));
    }
  }
  
  conn.release(); pool.end();
}
inspect();
