import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function auditSemantic() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME, ssl: { rejectUnauthorized: false }
  });
  const conn = await pool.getConnection();
  const [recipes] = await conn.query('SELECT id, title, description, category_type FROM recipes ORDER BY id');
  
  let mismatches = [];

  for (const r of recipes) {
    let titleObj, descObj;
    try { titleObj = typeof r.title === 'string' ? JSON.parse(r.title) : r.title; } catch(e) { titleObj = {es: r.title}; }
    try { descObj = typeof r.description === 'string' ? JSON.parse(r.description) : r.description; } catch(e) { descObj = {es: r.description}; }
    
    let title = typeof titleObj === 'object' && titleObj !== null ? (titleObj.es || r.title) : r.title;
    let desc = typeof descObj === 'object' && descObj !== null ? (descObj.es || r.description) : r.description;
    
    if (!desc || typeof desc !== 'string') continue;
    
    const descLower = desc.toLowerCase();
    const titleLower = title.toLowerCase();
    
    // Heurísticas de incongruencias graves
    let isSuspicious = false;
    let reason = [];

    // 1. Postres hablando de carne o salado
    if (r.category_type === 'dessert') {
      if (descLower.match(/carne|cerdo|res|pollo|pescado|langosta|camarón|marisco|ajo|cebolla|salteado/)) {
        isSuspicious = true; reason.push('Postre menciona ingredientes salados/carnes');
      }
    }
    
    // 2. Vegetarianos hablando de carne
    if (r.category_type === 'vegetarian') {
      if (descLower.match(/carne|cerdo|res|pollo|pescado|langosta|camarón|marisco|chuleta|costilla/)) {
        // Algunas veces dice "sin carne", verificamos
        if (!descLower.includes('sin carne') && !descLower.includes('reemplazo de carne')) {
          isSuspicious = true; reason.push('Vegetariano menciona carne/pescado');
        }
      }
    }

    // 3. Mariscos hablando de res o cerdo como principal (a veces mezclan, pero langosta en torta ahogada es obvio)
    if (r.category_type === 'seafood') {
      if (descLower.match(/cerdo|res|pollo|chuleta|costilla/)) {
        isSuspicious = true; reason.push('Marisco menciona carnes terrestres');
      }
    }
    
    // 4. Carnes hablando de mariscos (a menos que sea mar y tierra)
    if (r.category_type === 'meat') {
      if (descLower.match(/pescado|langosta|camarón|marisco|salmón|pulpo/)) {
        isSuspicious = true; reason.push('Carne menciona mariscos');
      }
    }

    // 5. Palabras clave específicas desfasadas
    if (titleLower.includes('torta ahogada') && descLower.includes('langosta')) {
      isSuspicious = true; reason.push('Torta ahogada tiene descripción de langosta');
    }
    if (titleLower.includes('pizza') && descLower.includes('sushi')) {
      isSuspicious = true; reason.push('Cruce obvio detectado');
    }

    if (isSuspicious) {
      mismatches.push({ id: r.id, title, category: r.category_type, desc, reason: reason.join(', ') });
    }
  }

  console.log(`\n🔍 AUDITORÍA SEMÁNTICA DE DESCRIPCIONES`);
  console.log(`Se revisaron ${recipes.length} recetas.\n`);

  if (mismatches.length > 0) {
    console.log(`⚠️ Se encontraron ${mismatches.length} posibles incongruencias:\n`);
    mismatches.forEach(m => {
      console.log(`ID ${m.id} | ${m.title} [${m.category}]`);
      console.log(`Motivo: ${m.reason}`);
      console.log(`Desc: "${m.desc.substring(0, 150)}..."\n`);
    });
  } else {
    console.log(`✅ No se detectaron incongruencias graves evidentes mediante palabras clave.`);
  }

  // Exportar todas a un archivo para lectura manual rápida si es necesario
  const fs = await import('fs/promises');
  const allDump = recipes.map(r => {
    let titleObj, descObj;
    try { titleObj = typeof r.title === 'string' ? JSON.parse(r.title) : r.title; } catch(e) { titleObj = {es: r.title}; }
    try { descObj = typeof r.description === 'string' ? JSON.parse(r.description) : r.description; } catch(e) { descObj = {es: r.description}; }
    let t = typeof titleObj === 'object' && titleObj !== null ? (titleObj.es || r.title) : r.title;
    let d = typeof descObj === 'object' && descObj !== null ? (descObj.es || r.description) : r.description;
    return `ID ${r.id}: ${t} -> ${d}`;
  }).join('\n\n');
  await fs.writeFile(path.join(__dirname, 'all_descriptions_dump.txt'), allDump);
  console.log(`📄 Se generó 'all_descriptions_dump.txt' con todas las descripciones para tu revisión manual si lo deseas.`);

  conn.release(); pool.end();
}

auditSemantic();
