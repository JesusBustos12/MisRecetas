import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function checkVegetarianCategory() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });

  const meatLand = 'pollo|chicken|carne|cerdo|beef|pork|cordero|steak|ternera|chuleta|tocino|bacon|jamon|jamón|ham|salchicha|sausage|pepperoni|salami|pavo|turkey|duck|pato|meatball|albóndiga|brisket|wings|prosciutto|guanciale|pancetta|chorizo|carnitas|cochinita|pastrami|veal|lamb|ribs|costillas|ossobuco|bolognese|boloñesa|tonkotsu|menudo|barbacoa|hot dog|perrito|hamburguesa|burger|bistecca|meatloaf|cochinillo|coq|boeuf|escargot|katsudon|shabu shabu|sukiyaki|yakisoba|nogada|torta ahogada|gravy|arancini|calzone|fabada|cocido|cassoulet|croque monsieur|rogan josh|kra pao|larb|pastitsio|jambalaya|wonton';
  const meatSea = 'pescado|fish|camaron|camarón|shrimp|marisco|seafood|salmon|salmón|atun|atún|pulpo|octopus|calamar|squid|bacalao|lobster|langosta|crab|cangrejo|mussels|mejillones|clams|almejas|ostras|oysters|vieiras|scallops|prawns|gambas|langostinos|unagi|anchoa|anchovy|takoyaki|aguachile|clam|bouillabaisse|paella';
  const dessertTerms = 'postre|dessert|helado|flan|galleta|cookie|brownie|muffin|cupcake|mermelada|mousse|creme brulee|pudding|pudin|tiramisu|tiramisú|gelato|cannoli|panettone|panna cotta|macaron|baklava|dorayaki|mochi|profiteroles|churros|sfogliatella|zabaione|zeppole|loukoumades|mooncakes|bizcocho|cheesecake|tartaleta|gelatina|sorbete|sorbet|pumpkin pie|crema catalana|tarta santiago|tarte tatin|crepes suzette|gulab jamun|mango lassi|mango sticky|galaktoboureko|pancakes|souffle|pan de muerto|alfajor|apple pie|crepe|crêpe';

  const notContentCheck = (regex) => `(LOWER(r.title) NOT REGEXP '${regex}' AND LOWER(CAST(r.ingredients AS CHAR)) NOT REGEXP '${regex}' AND LOWER(r.image_url) NOT REGEXP '${regex}')`;

  let conn;
  try {
    conn = await pool.getConnection();
    
    console.log("=== RECETAS QUE SALEN EN VEGETARIANO CON EL NUEVO CÓDIGO ===");
    const query = `
      SELECT id, title, image_url 
      FROM recipes r
      WHERE ${notContentCheck(meatLand)} 
        AND ${notContentCheck(meatSea)} 
        AND ${notContentCheck(dessertTerms)}
    `;
    
    const [recipes] = await conn.query(query);
    recipes.forEach(r => {
      let t = "";
      try {
        const tObj = typeof r.title === 'string' && r.title.startsWith('{') ? JSON.parse(r.title) : r.title;
        t = tObj.es || tObj.en || r.title;
      } catch(e) { t = r.title; }
      console.log(`ID: ${r.id} | ${t} | ${r.image_url.split('/').pop()}`);
    });
    
    console.log(`\nTotal vegetarianas permitidas: ${recipes.length}`);

  } catch (error) {
    console.error(error);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

checkVegetarianCategory();
