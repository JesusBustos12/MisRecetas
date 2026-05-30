import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// Mapa de keywords que DEBEN aparecer en ingredientes/pasos según el título
const titleKeywords = {
  'macaron': ['almendra', 'merengue', 'almond', 'meringue', 'ganache', 'claras'],
  'croissant': ['hojaldre', 'laminar', 'mantequilla', 'butter', 'laminate'],
  'sushi': ['arroz', 'nori', 'rice', 'alga', 'vinagre de arroz'],
  'ramen': ['caldo', 'fideos', 'noodle', 'broth', 'noodles'],
  'tacos': ['tortilla', 'taco'],
  'pizza': ['masa', 'horno', 'mozzarella', 'dough'],
  'paella': ['arroz', 'azafrán', 'rice', 'saffron'],
  'curry': ['curry', 'especias', 'spice'],
  'pad thai': ['fideos', 'tamarindo', 'noodle', 'tamarind', 'cacahuate'],
  'dumpling': ['masa', 'relleno', 'dough', 'filling', 'wrapper'],
  'tikka': ['yogur', 'tandoor', 'yogurt', 'marinada'],
  'mole': ['chile', 'chocolate', 'chili'],
  'ceviche': ['limón', 'pescado', 'lime', 'fish', 'camar'],
  'empanada': ['masa', 'relleno', 'dough', 'filling'],
  'gyoza': ['masa', 'relleno', 'dough', 'filling', 'wrapper'],
  'bibimbap': ['arroz', 'gochujang', 'rice'],
  'pho': ['caldo', 'fideos', 'broth', 'noodle'],
  'baklava': ['filo', 'nuez', 'almíbar', 'phyllo', 'nut', 'syrup'],
  'fondue': ['queso', 'cheese', 'gruyère'],
  'risotto': ['arroz', 'caldo', 'rice', 'broth', 'arborio'],
  'lasagna': ['pasta', 'capas', 'layer', 'bechamel', 'ragú'],
  'tiramisu': ['mascarpone', 'café', 'coffee', 'savoiardi', 'lady'],
  'churros': ['masa', 'azúcar', 'canela', 'dough', 'sugar', 'cinnamon'],
  'falafel': ['garbanzo', 'chickpea'],
  'hummus': ['garbanzo', 'tahini', 'chickpea'],
  'samosa': ['masa', 'papa', 'dough', 'potato'],
  'naan': ['harina', 'yogur', 'flour', 'yogurt', 'tandoor'],
  'kebab': ['carne', 'brocheta', 'meat', 'skewer'],
  'tom yum': ['camar', 'lemongrass', 'galanga', 'shrimp'],
  'biryani': ['arroz', 'rice', 'basmati', 'especias'],
  'pierogi': ['masa', 'papa', 'dough', 'potato'],
  'borscht': ['betabel', 'remolacha', 'beet'],
  'couscous': ['sémola', 'semolina', 'couscous'],
  'tagine': ['tagine', 'tajine', 'especias'],
  'jerk': ['pimienta', 'allspice', 'scotch bonnet'],
  'goulash': ['pimentón', 'paprika', 'ternera', 'beef'],
  'schnitzel': ['pan rallado', 'breadcrumb', 'empanizar'],
  'crepe': ['harina', 'huevos', 'flour', 'eggs', 'sartén'],
  'quiche': ['huevo', 'crema', 'egg', 'cream', 'masa'],
  'strudel': ['manzana', 'apple', 'masa', 'dough'],
  'wonton': ['masa', 'relleno', 'wrapper', 'filling'],
  'tempura': ['reboz', 'batter', 'frit', 'fry'],
  'miso': ['miso', 'dashi', 'tofu'],
  'katsu': ['pan rallado', 'panko', 'breadcrumb', 'frit'],
  'teriyaki': ['soya', 'mirin', 'soy', 'glaze'],
  'udon': ['fideos', 'noodle', 'dashi', 'caldo'],
  'onigiri': ['arroz', 'nori', 'rice', 'alga'],
  'matcha': ['matcha', 'té verde', 'green tea'],
  'gyudon': ['ternera', 'arroz', 'beef', 'rice'],
  'okonomiyaki': ['col', 'cabbage', 'harina', 'flour'],
  'takoyaki': ['pulpo', 'octopus'],
  'unagi': ['anguila', 'eel'],
  'dorayaki': ['anko', 'judía', 'bean', 'pancake'],
  'tortilla de patatas': ['patata', 'huevo', 'potato', 'egg'],
  'gazpacho': ['tomate', 'tomato', 'frío', 'cold'],
  'paella': ['arroz', 'azafrán', 'rice', 'saffron'],
  'croqueta': ['bechamel', 'jamón', 'ham'],
  'churro': ['masa', 'azúcar', 'dough', 'sugar'],
  'gnocchi': ['papa', 'patata', 'potato'],
  'cannoli': ['ricotta', 'ricota'],
  'focaccia': ['masa', 'aceite', 'dough', 'oil', 'romero'],
  'arancini': ['arroz', 'rice', 'mozzarella'],
  'cacio e pepe': ['pecorino', 'pimienta', 'pepper'],
  'bruschetta': ['pan', 'tomate', 'bread', 'tomato'],
  'fettuccine': ['pasta', 'mantequilla', 'parmesano', 'butter'],
  'carbonara': ['guanciale', 'huevo', 'egg', 'pecorino'],
  'parmigiana': ['berenjena', 'eggplant', 'tomate'],
  'minestrone': ['verdura', 'vegetable', 'caldo', 'broth', 'pasta'],
  'panettone': ['levadura', 'yeast', 'frutas', 'fruit'],
  'panna cotta': ['crema', 'gelatina', 'cream', 'gelatin'],
  'ravioli': ['pasta', 'ricotta', 'relleno', 'filling'],
  'affogato': ['helado', 'espresso', 'ice cream', 'coffee'],
  'caprese': ['mozzarella', 'tomate', 'tomato', 'albahaca'],
  'biscotti': ['almendra', 'almond', 'harina', 'flour'],
  'gulab jamun': ['leche en polvo', 'almíbar', 'milk powder', 'syrup'],
  'lassi': ['mango', 'yogur', 'yogurt'],
  'dal': ['lenteja', 'lentil', 'dal'],
  'aloo gobi': ['papa', 'coliflor', 'potato', 'cauliflower'],
  'tzatziki': ['yogur', 'pepino', 'yogurt', 'cucumber'],
  'spanakopita': ['espinaca', 'filo', 'spinach', 'phyllo'],
  'dolmades': ['parra', 'grape', 'hoja', 'arroz'],
  'galaktoboureko': ['semolina', 'filo', 'phyllo', 'crema', 'cream'],
  'saganaki': ['queso', 'cheese', 'frit', 'fry'],
  'moussaka': ['berenjena', 'eggplant', 'carne', 'bechamel'],
  'mac.*cheese': ['pasta', 'queso', 'cheese', 'cheddar'],
  'clam': ['almeja', 'clam'],
  'burger': ['carne', 'pan', 'beef', 'bun'],
  'bbq|barbacoa': ['carne', 'ahumar', 'smoke', 'meat'],
  'brownie': ['chocolate', 'mantequilla', 'butter'],
  'cheesecake': ['queso crema', 'cream cheese', 'galleta'],
  'pancake': ['harina', 'huevo', 'flour', 'egg', 'maple'],
};

// Keywords que indican que los pasos son GENÉRICOS (copias de otra receta)
const genericStepPatterns = [
  /sazona con sal y pimienta al gusto/i,
  /sirve caliente y disfruta/i,
  /preparación tradicional/i,
  /ingredientes frescos y de calidad/i,
];

async function smartAudit() {
  console.log('🔍 AUDITORÍA INTELIGENTE: Título vs Contenido\n');
  
  const pool = mysql.createPool({
    host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME, ssl: { rejectUnauthorized: false }
  });
  const conn = await pool.getConnection();
  const [recipes] = await conn.query('SELECT id, title, ingredients, steps, nutrition, category_country FROM recipes ORDER BY id');
  
  const issues = [];
  
  for (const r of recipes) {
    let title, ingredients, steps;
    try { title = typeof r.title === 'string' && r.title.startsWith('{') ? JSON.parse(r.title) : r.title; } catch(e) { title = r.title; }
    try { ingredients = typeof r.ingredients === 'string' ? JSON.parse(r.ingredients) : r.ingredients; } catch(e) { ingredients = []; }
    try { steps = typeof r.steps === 'string' ? JSON.parse(r.steps) : r.steps; } catch(e) { steps = []; }
    
    const titleEs = (typeof title === 'object' ? title.es : title || '').toLowerCase();
    const titleEn = (typeof title === 'object' ? title.en : title || '').toLowerCase();
    const titleFull = `${titleEs} ${titleEn}`;
    
    // Flatten all content for searching
    const allIngredients = (ingredients || []).map(i => {
      if (typeof i === 'object') return `${i.es || ''} ${i.en || ''}`.toLowerCase();
      return String(i).toLowerCase();
    }).join(' ');
    
    const allSteps = (steps || []).map(s => {
      if (typeof s === 'object') return `${s.es || ''} ${s.en || ''}`.toLowerCase();
      return String(s).toLowerCase();
    }).join(' ');
    
    const allContent = `${allIngredients} ${allSteps}`;
    
    const problems = [];
    
    // 1. Check title keyword match
    for (const [keyword, expectedTerms] of Object.entries(titleKeywords)) {
      const keyRegex = new RegExp(keyword, 'i');
      if (keyRegex.test(titleFull)) {
        const found = expectedTerms.some(term => allContent.includes(term.toLowerCase()));
        if (!found) {
          problems.push(`❌ MISMATCH: Título contiene "${keyword}" pero ingredientes/pasos no mencionan ninguno de: [${expectedTerms.join(', ')}]`);
        }
        break;
      }
    }
    
    // 2. Check for generic/placeholder steps
    for (const pattern of genericStepPatterns) {
      if (pattern.test(allSteps)) {
        problems.push(`⚠️ GENÉRICO: Pasos contienen frases genéricas`);
        break;
      }
    }
    
    // 3. Check ingredients count (< 3 is suspicious)
    if (!ingredients || ingredients.length < 3) {
      problems.push(`⚠️ POCOS INGREDIENTES: Solo ${ingredients?.length || 0}`);
    }
    
    // 4. Check steps count (< 2 is suspicious)
    if (!steps || steps.length < 2) {
      problems.push(`⚠️ POCOS PASOS: Solo ${steps?.length || 0}`);
    }
    
    // 5. Check for very short steps (likely generic)
    const shortSteps = (steps || []).filter(s => {
      const text = typeof s === 'object' ? (s.es || '') : String(s);
      return text.length < 30;
    });
    if (shortSteps.length > 0 && steps?.length > 0) {
      const ratio = shortSteps.length / steps.length;
      if (ratio > 0.5) {
        problems.push(`⚠️ PASOS CORTOS: ${shortSteps.length}/${steps.length} pasos son muy cortos (<30 chars)`);
      }
    }
    
    // 6. Check for duplicate content across steps
    if (steps && steps.length >= 2) {
      const stepTexts = steps.map(s => typeof s === 'object' ? (s.es || '') : String(s));
      const uniqueSteps = new Set(stepTexts);
      if (uniqueSteps.size < stepTexts.length) {
        problems.push(`❌ DUPLICADOS: Pasos repetidos`);
      }
    }
    
    if (problems.length > 0) {
      issues.push({
        id: r.id,
        title: titleEs || titleEn,
        country: r.category_country,
        problems,
        severity: problems.some(p => p.startsWith('❌')) ? 'CRITICAL' : 'WARNING'
      });
    }
  }
  
  // Print results grouped by severity
  const critical = issues.filter(i => i.severity === 'CRITICAL');
  const warnings = issues.filter(i => i.severity === 'WARNING');
  
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`🔴 CRÍTICOS (contenido no corresponde al título): ${critical.length}`);
  console.log(`${'═'.repeat(60)}`);
  for (const i of critical) {
    console.log(`\n  ID ${i.id}: ${i.title} [${i.country}]`);
    for (const p of i.problems) console.log(`    ${p}`);
  }
  
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`🟡 ADVERTENCIAS: ${warnings.length}`);
  console.log(`${'═'.repeat(60)}`);
  for (const i of warnings) {
    console.log(`\n  ID ${i.id}: ${i.title} [${i.country}]`);
    for (const p of i.problems) console.log(`    ${p}`);
  }
  
  console.log(`\n\n📊 RESUMEN: ${recipes.length} recetas total, ${critical.length} críticas, ${warnings.length} advertencias, ${recipes.length - issues.length} perfectas`);
  
  conn.release(); pool.end();
}
smartAudit();
