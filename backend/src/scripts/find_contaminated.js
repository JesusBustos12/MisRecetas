import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// ═══════════════════════════════════════════════════════════════
// Este script identifica recetas que DEBERÍAN ser vegetarianas
// (por su título e imagen) pero cuyos ingredientes contienen
// palabras de carne/marisco, contaminando el filtro REGEXP.
// ═══════════════════════════════════════════════════════════════

const meatWords = /pollo|chicken|carne|cerdo|beef|pork|cordero|lamb|steak|ternera|chuleta|tocino|bacon|jamon|jamón|ham|salchicha|sausage|pepperoni|salami|pavo|turkey|duck|pato|prosciutto|guanciale|pancetta|chorizo|carnitas|cochinita|pastrami|veal|ribs|costillas|ossobuco|meatball|albóndiga|brisket|wings|hot.dog|hamburguesa|burger|bistecca|meatloaf|cochinillo/i;

const seaWords = /pescado|fish|camaron|camarón|shrimp|marisco|seafood|salmon|salmón|atun|atún|pulpo|octopus|calamar|squid|bacalao|lobster|langosta|crab|cangrejo|mussels|mejillones|clams|almejas|ostras|oysters|vieiras|scallops|prawns|gambas|langostinos|unagi|anchoa|anchovy/i;

// Recetas que por su TÍTULO son claramente vegetarianas
// (no contienen ninguna palabra de carne en el nombre)
// pero sus INGREDIENTES sí contienen carne.
async function findContaminatedVegetarians() {
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
    const [recipes] = await conn.query(`SELECT id, title, ingredients, image_url, category_type FROM recipes`);
    
    console.log("=== RECETAS CON INGREDIENTES CONTAMINADOS ===");
    console.log("(El título NO tiene carne, pero los ingredientes SÍ)\n");
    
    const contaminated = [];
    
    for (const r of recipes) {
      let titleEs = '', titleEn = '';
      try {
        const tObj = typeof r.title === 'string' && r.title.startsWith('{') ? JSON.parse(r.title) : r.title;
        titleEs = (tObj.es || '').toLowerCase();
        titleEn = (tObj.en || '').toLowerCase();
      } catch(e) { titleEs = String(r.title).toLowerCase(); titleEn = titleEs; }
      
      const fullTitle = titleEs + ' ' + titleEn;
      
      // Si el TÍTULO ya contiene carne, es un plato de carne legítimo
      if (meatWords.test(fullTitle)) continue;
      
      // Revisar los ingredientes
      const ingStr = typeof r.ingredients === 'string' ? r.ingredients : JSON.stringify(r.ingredients);
      const ingLower = ingStr.toLowerCase();
      
      const hasMeat = meatWords.test(ingLower);
      const hasSea = seaWords.test(ingLower);
      
      if (hasMeat || hasSea) {
        // Encontrar las palabras específicas que contaminan
        const meatMatches = ingLower.match(meatWords) || [];
        const seaMatches = ingLower.match(seaWords) || [];
        const allMatches = [...new Set([...meatMatches, ...seaMatches])];
        
        contaminated.push({
          id: r.id,
          titleEs,
          image: r.image_url ? r.image_url.split('/').pop() : 'N/A',
          category: r.category_type,
          contaminants: allMatches.join(', ')
        });
        
        console.log(`ID: ${r.id} | ${titleEs}`);
        console.log(`   Imagen: ${r.image_url ? r.image_url.split('/').pop() : 'N/A'} | BD: ${r.category_type}`);
        console.log(`   Contaminante(s): ${allMatches.join(', ')}`);
        console.log(`   Ingrediente: ${ingLower.substring(0, 200)}...`);
        console.log('');
      }
    }
    
    console.log(`\n=== TOTAL: ${contaminated.length} recetas contaminadas ===`);

  } catch (error) {
    console.error(error);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

findContaminatedVegetarians();
