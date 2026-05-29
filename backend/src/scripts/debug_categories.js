import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function checkCategories() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });

  const meatLand = 'pollo|chicken|carne|cerdo|beef|pork|cordero|steak|ternera|chuleta|tocino|bacon|jamon|jamón|ham|salchicha|sausage|pepperoni|salami|pavo|turkey|duck|pato|meatball|albóndiga|brisket|wings|prosciutto|guanciale|pancetta|chorizo|carnitas|cochinita|pastrami|veal|lamb|ribs|costillas|ossobuco|bolognese|boloñesa|tonkotsu|menudo|barbacoa|hot dog|perrito|hamburguesa|burger|bistecca|meatloaf|cochinillo|coq|boeuf|escargot';
  const meatSea = 'pescado|fish|camaron|camarón|shrimp|marisco|seafood|salmon|salmón|atun|atún|pulpo|octopus|calamar|squid|bacalao|lobster|langosta|crab|cangrejo|mussels|mejillones|clams|almejas|ostras|oysters|vieiras|scallops|prawns|gambas|langostinos|unagi|anchoa|anchovy';
  const dessertTerms = 'postre|dessert|helado|flan|galleta|cookie|brownie|muffin|cupcake|mermelada|mousse|creme brulee|pudding|pudin|tiramisu|tiramisú|gelato|cannoli|panettone|panna cotta|macaron|baklava|dorayaki|mochi|profiteroles|churros|sfogliatella|zabaione|zeppole|loukoumades|mooncakes|bizcocho|cheesecake|tartaleta|gelatina|sorbete|sorbet';

  let conn;
  try {
    conn = await pool.getConnection();
    
    // Test Vegetarian
    console.log("=== RECETAS VEGETARIANAS (QUE PODRÍAN TENER CARNE OCULTA) ===");
    const [veg] = await conn.query(`
      SELECT id, title, image_url, category_type 
      FROM recipes 
      WHERE (LOWER(title) NOT REGEXP '${meatLand}' AND LOWER(CAST(ingredients AS CHAR)) NOT REGEXP '${meatLand}' AND LOWER(image_url) NOT REGEXP '${meatLand}')
        AND (LOWER(title) NOT REGEXP '${meatSea}' AND LOWER(CAST(ingredients AS CHAR)) NOT REGEXP '${meatSea}' AND LOWER(image_url) NOT REGEXP '${meatSea}')
        AND (LOWER(title) NOT REGEXP '${dessertTerms}' AND LOWER(CAST(ingredients AS CHAR)) NOT REGEXP '${dessertTerms}' AND LOWER(image_url) NOT REGEXP '${dessertTerms}')
    `);
    veg.forEach(r => console.log(`ID: ${r.id} | ${r.title} | ${r.image_url}`));

    console.log("\n=== RECETAS DE MARISCOS (QUE PODRÍAN SER DE CARNE PERO TIENEN SALSA DE OSTRAS/PESCADO) ===");
    const [sea] = await conn.query(`
      SELECT id, title, image_url 
      FROM recipes 
      WHERE (LOWER(title) REGEXP '${meatSea}' OR LOWER(CAST(ingredients AS CHAR)) REGEXP '${meatSea}' OR LOWER(image_url) REGEXP '${meatSea}')
        AND (LOWER(title) REGEXP '${meatLand}' OR LOWER(CAST(ingredients AS CHAR)) REGEXP '${meatLand}' OR LOWER(image_url) REGEXP '${meatLand}')
    `);
    sea.forEach(r => console.log(`ID: ${r.id} | ${r.title} | ${r.image_url}`));

  } catch (error) {
    console.error(error);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

checkCategories();
