import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// Pasos genéricos que indican que la receta tiene un placeholder (no contenido real)
const GENERIC_STEPS_ES = [
  'lava, pela y corta los vegetales en trozos uniformes',
  'calienta aceite en una sartén a fuego medio y sofríe cebolla y ajo por 4-5 minutos',
  'añade las especias secas y tuesta por 1 minuto',
  'incorpora los vegetales, empezando por los más duros',
  'cocina tapado a fuego medio durante 15-20 minutos',
  'añade hierbas frescas, rectifica sal y pimienta y sirve caliente',
  'precalienta el horno a 180°c (350°f). engrasa el molde',
  'en un bol, mezcla los ingredientes secos (harina, azúcar, sal)',
  'en otro bol, bate los ingredientes húmedos (huevos, mantequilla, leche)',
  'incorpora los líquidos a los secos mezclando suavemente hasta integrar',
  'vierte la mezcla en el molde y hornea el tiempo indicado',
  'deja enfriar antes de desmoldar y servir',
];

const GENERIC_INGREDIENTS_ES = [
  '2 tazas de harina',
  '1 taza de azúcar',
  '3 huevos',
  '½ taza de mantequilla',
  '1 cucharadita de vainilla',
  '1 pizca de sal',
  'frutas o decoración al gusto',
];

async function deepAuditV2() {
  console.log('🔍 AUDITORÍA PROFUNDA v2: Buscando contenido genérico/copiado\n');
  
  const pool = mysql.createPool({
    host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME, ssl: { rejectUnauthorized: false }
  });
  const conn = await pool.getConnection();
  const [recipes] = await conn.query('SELECT id, title, ingredients, steps, nutrition, category_type, category_country FROM recipes ORDER BY id');
  
  const issues = [];
  const stepFingerprints = {}; // Para detectar pasos duplicados entre recetas
  
  for (const r of recipes) {
    let title, ingredients, steps, nutrition;
    try { title = typeof r.title === 'string' && r.title.startsWith('{') ? JSON.parse(r.title) : r.title; } catch(e) { title = r.title; }
    try { ingredients = typeof r.ingredients === 'string' ? JSON.parse(r.ingredients) : r.ingredients; } catch(e) { ingredients = []; }
    try { steps = typeof r.steps === 'string' ? JSON.parse(r.steps) : r.steps; } catch(e) { steps = []; }
    try { nutrition = typeof r.nutrition === 'string' ? JSON.parse(r.nutrition) : r.nutrition; } catch(e) { nutrition = null; }
    
    const titleEs = (typeof title === 'object' ? title.es : title || '').toLowerCase();
    const problems = [];
    
    // ═══ CHECK 1: Pasos genéricos "vegetales" ═══
    const stepsText = (steps || []).map(s => (typeof s === 'object' ? (s.es || '') : String(s)).toLowerCase());
    const genericVegMatches = stepsText.filter(st => 
      GENERIC_STEPS_ES.some(g => st.includes(g))
    );
    if (genericVegMatches.length >= 2) {
      problems.push(`❌ PASOS GENÉRICOS: ${genericVegMatches.length} pasos son plantilla copiada`);
    }
    
    // ═══ CHECK 2: Ingredientes genéricos de pastel ═══
    const ingsText = (ingredients || []).map(i => (typeof i === 'object' ? (i.es || '') : String(i)).toLowerCase());
    const genericIngMatches = ingsText.filter(ing => 
      GENERIC_INGREDIENTS_ES.some(g => ing.includes(g))
    );
    if (genericIngMatches.length >= 5) {
      problems.push(`❌ INGREDIENTES GENÉRICOS: ${genericIngMatches.length}/7 son plantilla de pastel`);
    }
    
    // ═══ CHECK 3: Fingerprint de pasos para detectar duplicados ═══
    const stepFP = stepsText.join('||').substring(0, 200);
    if (stepFP.length > 30) {
      if (!stepFingerprints[stepFP]) {
        stepFingerprints[stepFP] = [];
      }
      stepFingerprints[stepFP].push({ id: r.id, title: titleEs });
    }
    
    // ═══ CHECK 4: Verificar coherencia título-ingredientes ═══
    const allIngsStr = ingsText.join(' ');
    const allStepsStr = stepsText.join(' ');
    const allContent = `${allIngsStr} ${allStepsStr}`;
    
    // Recetas de mariscos sin ingrediente de mar
    const seaTerms = ['camar', 'pescado', 'fish', 'shrimp', 'almeja', 'clam', 'pulpo', 'octopus', 'calamar', 'squid', 'langost', 'lobster', 'vieira', 'scallop', 'bacalao', 'cod', 'anguila', 'eel', 'gambas', 'prawn', 'atún', 'tuna', 'salmón', 'salmon', 'cangrejo', 'crab', 'mejillon', 'mussel'];
    if (r.category_type === 'seafood') {
      const hasSea = seaTerms.some(t => allContent.includes(t));
      if (!hasSea) {
        problems.push(`⚠️ SEAFOOD sin ingrediente marino en contenido`);
      }
    }
    
    // Recetas de carne sin ingrediente de carne
    const meatTerms = ['pollo', 'chicken', 'ternera', 'beef', 'cerdo', 'pork', 'carne', 'meat', 'cordero', 'lamb', 'pato', 'duck', 'panceta', 'bacon', 'jamón', 'ham', 'chorizo', 'salchicha', 'sausage'];
    if (r.category_type === 'meat') {
      const hasMeat = meatTerms.some(t => allContent.includes(t));
      if (!hasMeat) {
        problems.push(`⚠️ MEAT sin ingrediente cárnico en contenido`);
      }
    }
    
    // ═══ CHECK 5: Nutrición sospechosa ═══
    if (nutrition) {
      const cal = nutrition.calories || 0;
      if (cal === 0 || cal > 2000) {
        problems.push(`⚠️ NUTRICIÓN: ${cal} calorías (sospechoso)`);
      }
      // Desserts should have sugar
      if (r.category_type === 'dessert' && (nutrition.sugar || 0) < 3) {
        problems.push(`⚠️ DESSERT con solo ${nutrition.sugar || 0}g de azúcar`);
      }
    }
    
    // ═══ CHECK 6: Pasos que mencionan ingredientes no listados ═══
    // Check for very specific mismatches
    const susWords = ['vegetales', 'verduras', 'vegetables'];
    const dessertTitle = ['cake', 'torta', 'pastel', 'pie', 'tart', 'cookie', 'galleta', 'mochi', 'macaron', 'brownie', 'flan', 'crème', 'crema', 'dulce', 'sweet', 'helado', 'ice cream', 'pudding', 'pudín', 'cheesecake'];
    const isDessertByTitle = dessertTitle.some(d => titleEs.includes(d));
    if (isDessertByTitle) {
      const hasSusSteps = susWords.some(w => allStepsStr.includes(w));
      if (hasSusSteps) {
        problems.push(`❌ POSTRE con pasos de "vegetales" - contenido equivocado`);
      }
    }
    
    if (problems.length > 0) {
      issues.push({ id: r.id, title: titleEs, country: r.category_country, type: r.category_type, problems });
    }
  }
  
  // ═══ CHECK duplicados ═══
  const duplicateGroups = Object.entries(stepFingerprints).filter(([_, arr]) => arr.length > 1);
  
  // Print results
  if (issues.length > 0) {
    console.log(`${'═'.repeat(60)}`);
    console.log(`🔴 RECETAS CON PROBLEMAS: ${issues.length}`);
    console.log(`${'═'.repeat(60)}`);
    for (const i of issues) {
      console.log(`\n  ID ${i.id}: ${i.title} [${i.country}] [${i.type}]`);
      for (const p of i.problems) console.log(`    ${p}`);
    }
  } else {
    console.log(`✅ No se encontraron recetas con contenido genérico o inconsistente.`);
  }
  
  if (duplicateGroups.length > 0) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`🟠 PASOS DUPLICADOS (mismos pasos en varias recetas): ${duplicateGroups.length} grupos`);
    console.log(`${'═'.repeat(60)}`);
    for (const [fp, arr] of duplicateGroups) {
      console.log(`\n  Grupo duplicado (${arr.length} recetas con los mismos pasos):`);
      for (const r of arr) {
        console.log(`    ID ${r.id}: ${r.title}`);
      }
      console.log(`    Preview: "${fp.substring(0, 100)}..."`);
    }
  } else {
    console.log(`\n✅ No se encontraron pasos duplicados entre recetas.`);
  }
  
  console.log(`\n\n📊 RESUMEN: ${recipes.length} recetas auditadas, ${issues.length} con problemas, ${duplicateGroups.length} grupos de duplicados`);
  
  conn.release(); pool.end();
}
deepAuditV2();
