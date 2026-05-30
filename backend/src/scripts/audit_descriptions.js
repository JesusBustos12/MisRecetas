import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function auditDescriptions() {
  console.log('🔍 AUDITORÍA DE DESCRIPCIONES\n');
  const pool = mysql.createPool({
    host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME, ssl: { rejectUnauthorized: false }
  });
  const conn = await pool.getConnection();
  const [recipes] = await conn.query('SELECT id, title, description, category_country FROM recipes ORDER BY id');
  
  // Agrupar descripciones repetidas
  const descMap = {};
  const genericPatterns = ['ético', 'saludable', 'sostenible', 'responsable', 'bienestar', 'nutritiv', 'equilibrad'];
  let genericCount = 0;
  
  for (const r of recipes) {
    let desc;
    try { desc = typeof r.description === 'string' && r.description.startsWith('{') ? JSON.parse(r.description) : r.description; } catch(e) { desc = r.description; }
    const descEs = typeof desc === 'object' ? (desc.es || '') : (desc || '');
    
    // Check for generic patterns
    const isGeneric = genericPatterns.some(p => descEs.toLowerCase().includes(p));
    if (isGeneric) genericCount++;
    
    // Group by description
    const key = descEs.substring(0, 80);
    if (!descMap[key]) descMap[key] = [];
    descMap[key].push(r.id);
  }
  
  // Show sample descriptions
  console.log('═══ MUESTRA DE DESCRIPCIONES ACTUALES ═══\n');
  const sample = recipes.slice(0, 10);
  for (const r of sample) {
    let title, desc;
    try { title = JSON.parse(r.title); } catch(e) { title = r.title; }
    try { desc = typeof r.description === 'string' && r.description.startsWith('{') ? JSON.parse(r.description) : r.description; } catch(e) { desc = r.description; }
    const titleEs = typeof title === 'object' ? title.es : title;
    const descEs = typeof desc === 'object' ? (desc.es || '') : (desc || '');
    console.log(`ID ${r.id}: ${titleEs}`);
    console.log(`  → "${descEs.substring(0, 150)}"`);
    console.log();
  }
  
  // Show most repeated descriptions
  console.log('═══ DESCRIPCIONES MÁS REPETIDAS ═══\n');
  const sorted = Object.entries(descMap).sort((a, b) => b[1].length - a[1].length).slice(0, 10);
  for (const [desc, ids] of sorted) {
    console.log(`  [${ids.length} recetas]: "${desc}..."`);
    console.log(`    IDs: ${ids.slice(0, 10).join(', ')}${ids.length > 10 ? '...' : ''}`);
  }
  
  // Check field structure
  console.log('\n═══ ESTRUCTURA DEL CAMPO ═══');
  const [sample2] = await conn.query('SELECT description FROM recipes LIMIT 3');
  for (const s of sample2) {
    console.log(`  Tipo: ${typeof s.description}`);
    console.log(`  Raw (100 chars): ${String(s.description).substring(0, 100)}`);
  }
  
  console.log(`\n\n📊 RESUMEN: ${recipes.length} recetas, ${genericCount} con descripciones genéricas (${Math.round(genericCount/recipes.length*100)}%)`);
  
  conn.release(); pool.end();
}
auditDescriptions();
