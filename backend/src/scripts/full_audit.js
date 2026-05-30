import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// ═══════════════════════════════════════════════════════════════
// AUDITORÍA COMPLETA DE CORRELACIÓN DE DATOS
// Analiza TODAS las recetas y detecta inconsistencias entre
// título, ingredientes, descripción, pasos y nutrición.
// ═══════════════════════════════════════════════════════════════

// Ingredientes genéricos/fallback del script update_ingredients_by_title.js
const GENERIC_MARKERS = [
  '400g assorted seasonal vegetables',
  '400g de vegetales variados de temporada',
  '200g legumes or tofu',
  '200g de legumbres o tofu',
  'spices and aromatic herbs',
  'especias y hierbas aromáticas'
];

// Pasos genéricos/fallback
const GENERIC_STEPS = [
  'wash, peel and cut vegetables into uniform pieces',
  'lava, pela y corta los vegetales en trozos uniformes',
  'heat oil in a skillet over medium heat and sauté onion and garlic',
  'calienta aceite en una sartén a fuego medio y sofríe cebolla y ajo'
];

// Mapa: qué proteína DEBE tener una receta según su título
const TITLE_PROTEIN_MAP = [
  // Pollo / Chicken
  { titleTerms: /pollo|chicken|kung.pao|tikka|tandoori|yakitori|karaage|cacciatore|coq.au|fried.chicken|buffalo.wings|flautas|satay|tom.kha.gai|gai.med/i,
    mustHave: /pollo|chicken|muslo|pierna|pechuga|thigh|breast|drumstick|wing/i,
    label: 'pollo/chicken' },
  // Cerdo / Pork
  { titleTerms: /cerdo|pork|carnitas|cochinita|cochinillo|pulled.pork|tonkotsu|pozole|tamales|chicharr[oó]n|suadero|larb.moo|katsudon|katsu[^a]/i,
    mustHave: /cerdo|pork|lomo|costilla|espinazo|tocino|bacon|lard|manteca|guanciale|pancetta|chuleta|belly|shoulder|rib/i,
    label: 'cerdo/pork' },
  // Res / Beef
  { titleTerms: /beef|brisket|steak|bistecca|cheesesteak|boeuf|sukiyaki|shabu|carpaccio|ossobuco|meatloaf|smashburger|hamburguesa|burger/i,
    mustHave: /beef|carne de res|ternera|veal|filete|sirloin|brisket|ground.beef|carne.molida|chuck|flank/i,
    label: 'res/beef' },
  // Cordero / Lamb
  { titleTerms: /cordero|lamb|kleftiko|rogan.josh|moussaka|youvetsi|biryani.de.cordero/i,
    mustHave: /cordero|lamb|borrego|oveja|sheep/i,
    label: 'cordero/lamb' },
  // Pato / Duck
  { titleTerms: /pato|duck|canard|confit.de.canard/i,
    mustHave: /pato|duck|canard/i,
    label: 'pato/duck' },
  // Mariscos genéricos
  { titleTerms: /camar[oó]n|shrimp|prawn|tom.yum.goong|pad.thai(?!.*vegetal)/i,
    mustHave: /camar[oó]n|shrimp|prawn|gamba/i,
    label: 'camarón/shrimp' },
  // Pescado
  { titleTerms: /pescado|fish|ceviche|bacalao|lobster.roll|salmon|salmón/i,
    mustHave: /pescado|fish|filete|fillet|robalo|sierra|bass|cod|bacalao|salmon|salmón|lobster|langosta/i,
    label: 'pescado/fish' },
  // Pulpo
  { titleTerms: /pulpo|octopus|gallega/i,
    mustHave: /pulpo|octopus/i,
    label: 'pulpo/octopus' },
];

// Términos de carne para detectar en recetas vegetarianas
const MEAT_TERMS = /pollo|chicken|cerdo|pork|beef|carne de res|cordero|lamb|ternera|veal|tocino|bacon|jamón|jamon|guanciale|pancetta|chorizo|salchicha|sausage|prosciutto|duck|pato|turkey|pavo|camar[oó]n|shrimp|pescado|fish|pulpo|octopus|calamar|squid|salmon|salmón|lobster|langosta|cangrejo|crab|atún|tuna/i;

function hasGenericIngredients(ingredients) {
  const ingsStr = JSON.stringify(ingredients).toLowerCase();
  return GENERIC_MARKERS.some(m => ingsStr.includes(m.toLowerCase()));
}

function hasGenericSteps(steps) {
  const stepsStr = JSON.stringify(steps).toLowerCase();
  return GENERIC_STEPS.some(m => stepsStr.includes(m.toLowerCase()));
}

function checkTitleVsIngredients(title, ingredients) {
  const titleStr = (typeof title === 'object') ? `${title.es} ${title.en}` : title;
  const ingsStr = JSON.stringify(ingredients).toLowerCase();
  const issues = [];

  for (const rule of TITLE_PROTEIN_MAP) {
    if (rule.titleTerms.test(titleStr)) {
      if (!rule.mustHave.test(ingsStr)) {
        issues.push(`Título dice "${rule.label}" pero ingredientes NO lo contienen`);
      }
    }
  }
  return issues;
}

function checkVegetarianPurity(title, ingredients, categoryType) {
  const titleStr = (typeof title === 'object') ? `${title.es} ${title.en}` : title;
  const ingsStr = JSON.stringify(ingredients).toLowerCase();
  
  // Si el título NO sugiere carne y la categoría es vegetarian...
  const titleHasMeat = MEAT_TERMS.test(titleStr.toLowerCase());
  const ingsHaveMeat = MEAT_TERMS.test(ingsStr);
  
  if (!titleHasMeat && ingsHaveMeat) {
    const match = ingsStr.match(MEAT_TERMS);
    return `Título vegetariano pero ingredientes contienen: "${match[0]}"`;
  }
  if (titleHasMeat && !ingsHaveMeat && categoryType !== 'dessert') {
    return `Título sugiere carne/marisco pero ingredientes NO la contienen`;
  }
  return null;
}

function checkDescriptionVsTitle(title, description) {
  const titleStr = (typeof title === 'object') ? (title.es || title.en || '') : title;
  const descStr = (typeof description === 'object') ? (description.es || description.en || '') : (description || '');
  
  if (!descStr || descStr.length < 20) return 'Descripción vacía o muy corta';
  
  // Verificar que la descripción mencione al menos parte del nombre del platillo
  const titleWords = titleStr.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const descLower = descStr.toLowerCase();
  const matchCount = titleWords.filter(w => descLower.includes(w)).length;
  
  if (titleWords.length > 0 && matchCount === 0) {
    return `Descripción no menciona ninguna palabra clave del título "${titleStr}"`;
  }
  return null;
}

function checkStepsVsIngredients(steps, ingredients) {
  if (!steps || !ingredients) return null;
  
  const stepsStr = JSON.stringify(steps).toLowerCase();
  const ingsStr = JSON.stringify(ingredients).toLowerCase();
  
  // Si los pasos mencionan proteínas que no están en ingredientes
  const stepsHasMeat = stepsStr.match(MEAT_TERMS);
  const ingsHasMeat = ingsStr.match(MEAT_TERMS);
  
  if (stepsHasMeat && !ingsHasMeat) {
    return `Pasos mencionan "${stepsHasMeat[0]}" pero no está en ingredientes`;
  }
  return null;
}

async function fullAudit() {
  console.log('🔍 AUDITORÍA COMPLETA DE CORRELACIÓN DE DATOS');
  console.log('='.repeat(60));
  
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
    const [recipes] = await conn.query(
      'SELECT id, title, description, ingredients, steps, nutrition, image_url, category_type, category_country FROM recipes ORDER BY id'
    );

    console.log(`Total de recetas en BD: ${recipes.length}\n`);

    const issues = {
      generic_ingredients: [],
      generic_steps: [],
      title_vs_ingredients: [],
      meat_in_vegetarian: [],
      description_mismatch: [],
      steps_mismatch: [],
      multiple_issues: []
    };

    let totalProblematic = 0;

    for (const r of recipes) {
      let title, desc, ings, steps, nutrition;
      
      try { title = typeof r.title === 'string' && r.title.startsWith('{') ? JSON.parse(r.title) : r.title; } catch(e) { title = r.title; }
      try { desc = typeof r.description === 'string' && r.description.startsWith('{') ? JSON.parse(r.description) : r.description; } catch(e) { desc = r.description; }
      try { ings = typeof r.ingredients === 'string' && r.ingredients.startsWith('[') ? JSON.parse(r.ingredients) : r.ingredients; } catch(e) { ings = r.ingredients; }
      try { steps = typeof r.steps === 'string' && r.steps.startsWith('[') ? JSON.parse(r.steps) : r.steps; } catch(e) { steps = r.steps; }
      try { nutrition = typeof r.nutrition === 'string' && r.nutrition.startsWith('{') ? JSON.parse(r.nutrition) : r.nutrition; } catch(e) { nutrition = r.nutrition; }

      const titleDisplay = typeof title === 'object' ? (title.es || title.en) : title;
      const recipeIssues = [];

      // 1. ¿Ingredientes genéricos?
      if (ings && hasGenericIngredients(ings)) {
        recipeIssues.push('🟡 INGREDIENTES GENÉRICOS (fallback)');
        issues.generic_ingredients.push(r.id);
      }

      // 2. ¿Pasos genéricos?
      if (steps && hasGenericSteps(steps)) {
        recipeIssues.push('🟡 PASOS GENÉRICOS (fallback)');
        issues.generic_steps.push(r.id);
      }

      // 3. ¿Título vs ingredientes (proteína faltante)?
      if (ings) {
        const titleIssues = checkTitleVsIngredients(title, ings);
        if (titleIssues.length > 0) {
          recipeIssues.push(...titleIssues.map(i => `🔴 ${i}`));
          issues.title_vs_ingredients.push(r.id);
        }
      }

      // 4. ¿Carne en vegetariano o viceversa?
      if (ings) {
        const purityIssue = checkVegetarianPurity(title, ings, r.category_type);
        if (purityIssue) {
          recipeIssues.push(`🔴 ${purityIssue}`);
          issues.meat_in_vegetarian.push(r.id);
        }
      }

      // 5. ¿Descripción vs título?
      const descIssue = checkDescriptionVsTitle(title, desc);
      if (descIssue) {
        recipeIssues.push(`🟠 ${descIssue}`);
        issues.description_mismatch.push(r.id);
      }

      // 6. ¿Pasos vs ingredientes?
      if (steps && ings) {
        const stepsIssue = checkStepsVsIngredients(steps, ings);
        if (stepsIssue) {
          recipeIssues.push(`🟠 ${stepsIssue}`);
          issues.steps_mismatch.push(r.id);
        }
      }

      if (recipeIssues.length > 0) {
        totalProblematic++;
        console.log(`\nID ${r.id}: ${titleDisplay} [${r.category_type}] [${r.category_country}]`);
        recipeIssues.forEach(i => console.log(`   ${i}`));
        
        if (recipeIssues.length >= 3) {
          issues.multiple_issues.push(r.id);
        }
      }
    }

    // RESUMEN
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE AUDITORÍA');
    console.log('='.repeat(60));
    console.log(`Total recetas: ${recipes.length}`);
    console.log(`Recetas con problemas: ${totalProblematic}`);
    console.log(`Recetas limpias: ${recipes.length - totalProblematic}`);
    console.log('');
    console.log(`🟡 Ingredientes genéricos (fallback): ${issues.generic_ingredients.length}`);
    console.log(`   IDs: [${issues.generic_ingredients.join(', ')}]`);
    console.log(`🟡 Pasos genéricos (fallback): ${issues.generic_steps.length}`);
    console.log(`   IDs: [${issues.generic_steps.join(', ')}]`);
    console.log(`🔴 Título ≠ Ingredientes (proteína faltante): ${issues.title_vs_ingredients.length}`);
    console.log(`   IDs: [${issues.title_vs_ingredients.join(', ')}]`);
    console.log(`🔴 Contaminación carne↔vegetariano: ${issues.meat_in_vegetarian.length}`);
    console.log(`   IDs: [${issues.meat_in_vegetarian.join(', ')}]`);
    console.log(`🟠 Descripción no correlaciona con título: ${issues.description_mismatch.length}`);
    console.log(`   IDs: [${issues.description_mismatch.join(', ')}]`);
    console.log(`🟠 Pasos mencionan proteínas ausentes: ${issues.steps_mismatch.length}`);
    console.log(`   IDs: [${issues.steps_mismatch.join(', ')}]`);
    console.log(`⚫ Recetas con 3+ problemas (críticas): ${issues.multiple_issues.length}`);
    console.log(`   IDs: [${issues.multiple_issues.join(', ')}]`);

    // Guardar reporte completo como JSON
    const reportPath = path.join(__dirname, 'audit_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(issues, null, 2));
    console.log(`\n💾 Reporte guardado en: ${reportPath}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

fullAudit();
