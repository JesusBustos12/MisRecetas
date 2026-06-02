import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function analyze() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME, ssl: { rejectUnauthorized: false }
  });
  
  const conn = await pool.getConnection();
  const [recipes] = await conn.query('SELECT id, title FROM recipes');
  const [comments] = await conn.query('SELECT id, recipe_id, content FROM comments');
  
  const recipeMap = {};
  recipes.forEach(r => {
    let title;
    try { title = typeof r.title === 'string' && r.title.startsWith('{') ? JSON.parse(r.title) : r.title; } catch(e) { title = r.title; }
    recipeMap[r.id] = (typeof title === 'object' ? title.es : title) || '';
  });

  const contentMap = {};
  let out = "🔍 ANÁLISIS DE COMENTARIOS\n=================================\n\n";

  // Encontrar duplicados exactos
  comments.forEach(c => {
    if (!contentMap[c.content]) contentMap[c.content] = [];
    contentMap[c.content].push(c);
  });

  out += "🔴 COMENTARIOS REPETIDOS EXACTAMENTE MÁS DE 3 VECES:\n";
  const duplicates = Object.entries(contentMap).filter(([k, v]) => v.length > 3).sort((a, b) => b[1].length - a[1].length);
  for (const [content, occ] of duplicates) {
    out += `\n- "${content}" (Aparece ${occ.length} veces)\n`;
    const uniqueRecipes = new Set(occ.map(c => recipeMap[c.recipe_id]));
    out += `  Se usa en: ${Array.from(uniqueRecipes).slice(0, 5).join(', ')}${uniqueRecipes.size > 5 ? ' ...' : ''}\n`;
  }

  out += "\n\n🔴 ANÁLISIS DE POSIBLES INCONGRUENCIAS (Palabras clave en recetas no compatibles):\n";
  
  const rules = [
    { 
      keyword: 'caldo', 
      exclude: ['sopa', 'ramen', 'pozole', 'menudo', 'consomé', 'brodo', 'stew', 'birria', 'tom yum', 'tom kha', 'shabu'], 
      name: "Habla de 'caldo' pero no es sopa" 
    },
    { 
      keyword: 'horno', 
      exclude: ['pizza', 'lasaña', 'lasagna', 'pan', 'pastel', 'cake', 'galleta', 'cookie', 'asado', 'horneado', 'horno', 'pie', 'tarta', 'bizcocho', 'brownie', 'soufflé', 'quiche', 'empanada', 'macaron'], 
      name: "Habla de 'horno' en receta de sartén/fría" 
    },
    { 
      keyword: 'picante', 
      exclude: ['chile', 'chilaquiles', 'tacos', 'enchiladas', 'curry', 'pad thai', 'som tum', 'kra pao', 'tikka', 'kung pao', 'mapo tofu', 'salsa', 'mole', 'aguachile', 'ceviche', 'rogan josh', 'chana masala'], 
      name: "Habla de 'picante' en receta dulce o no picante" 
    },
    { 
      keyword: 'wok', 
      exclude: ['lo mein', 'pad thai', 'arroz frito', 'khao pad', 'pad see ew', 'kung pao', 'yakisoba'], 
      name: "Habla de 'wok' en receta occidental" 
    },
    { 
      keyword: 'agua', 
      exclude: ['sopa', 'ramen', 'caldo', 'bebida', 'limonada', 'horchata', 'jamaica', 'te', 'café', 'smoothie', 'jugo', 'lassi'], 
      name: "Habla de rebajar con 'agua' en recetas secas" 
    },
    { 
      keyword: 'dulce', 
      exclude: ['postre', 'pastel', 'helado', 'crepa', 'hotcakes', 'pancakes', 'waffles', 'churros', 'flan', 'tarta', 'galleta', 'mango', 'sticky rice', 'jamun', 'mooncakes', 'sweet'], 
      name: "Habla de 'dulce' en receta salada" 
    }
  ];

  let incongruenciesFound = 0;
  for (const c of comments) {
    const rName = (recipeMap[c.recipe_id] || '').toLowerCase();
    const content = c.content.toLowerCase();
    
    for (const rule of rules) {
      if (content.includes(rule.keyword)) {
        // Verificar si la receta NO tiene las palabras de exclusión
        const isExcluded = rule.exclude.some(ex => rName.includes(ex));
        if (!isExcluded) {
           out += `- ⚠️ REGLA: ${rule.name}\n`;
           out += `  Receta: ${recipeMap[c.recipe_id]}\n`;
           out += `  Comentario: "${c.content}"\n\n`;
           incongruenciesFound++;
        }
      }
    }
  }
  
  if (incongruenciesFound === 0) {
    out += "No se encontraron incongruencias obvias con las reglas actuales.\n";
  } else {
    out += `\nTotal de posibles incongruencias detectadas: ${incongruenciesFound}\n`;
  }
  
  fs.writeFileSync('analisis_comentarios.txt', out);
  console.log('Análisis exportado a analisis_comentarios.txt');
  
  conn.release(); pool.end();
}
analyze();
