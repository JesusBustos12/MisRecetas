const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

async function testQuery() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });

  const meatLand = 'pollo|carne|\\\\bres\\\\b|cerdo|beef|pork|cordero|steak|ternera|chuleta|tocino|bacon|jamon|jamón|salchicha|pepperoni|salami|pavo|turkey|duck|\\\\bpato\\\\b|meatball|albóndiga|brisket|wings|prosciutto|guanciale|pancetta|chorizo|carnitas|cochinita|pastrami|veal|lamb|ribs|costillas|ossobuco|bolognese|boloñesa|katsu|tonkotsu|sukiyaki|okonomiyaki|gyoza|omurice|tamales|pozole|menudo|barbacoa|hot dog|perrito|hamburguesa|burger|bistecca|fiorentina|meatloaf|wonton|jambalaya|ahogada|cocido|fabada|mapo tofu|jiaozi|dumpling|dim sum|mole poblano|nogada|gravy|carbonara|ragu|ragú|cochinillo|coq|boeuf|bourguignon|cassoulet|rogan josh|gai\\\\b|larb|moo\\\\b|moussaka|tlayuda|shabu|pastitsio|escargot|brodo';
  const meatSea = 'pescado|fish|camaron|camarón|shrimp|marisco|seafood|salmon|salmón|atun|atún|pulpo|octopus|calamar|squid|bacalao|\\\\bcod\\\\b|tuna|lobster|langosta|crab|cangrejo|mussels|mejillones|clams|almejas|ostras|oysters|vieiras|scallops|prawns|gambas|langostinos|aguachile|ceviche|takoyaki|unagi|paella|anchoa|anchovy|pissaladiere|pissaladière|clam\\\\b|chowder|bouillabaisse|pla\\\\b|goong|nicoise|niçoise|chawanmushi|coquilles|saint-jacques';
  const dessertTerms = 'postre|dulce|tarta|pastel|cake|dessert|chocolate|helado|flan|galleta|cookie|brownie|muffin|cupcake|mermelada|mousse|creme brulee|pudding|pudin|pay|pie|caramelo|tiramisu|tiramisú|gelato|cannoli|panettone|panna cotta|crepe|crêpe|macaron|baklava|dorayaki|mochi|profiteroles|churros|sfogliatella|zabaione|zeppole|loukoumades|mooncakes';
  
  const castTitle = 'LOWER(CAST(r.title AS CHAR))';
  const castIng = 'LOWER(CAST(r.ingredients AS CHAR))';

  let q = `SELECT r.id FROM recipes r WHERE 1=1 AND (r.diet_type IN ('Vegetariano', 'Vegano') OR ${castTitle} REGEXP 'vegetariano|vegetarian|vegano|vegan') AND ${castTitle} NOT REGEXP '${meatLand}|${meatSea}|${dessertTerms}' AND ${castIng} NOT REGEXP '${meatLand}|${meatSea}|${dessertTerms}' LIMIT 1`;

  try {
    const [rows] = await pool.query(q);
    console.log("Query success! Found:", rows.length);
  } catch (e) {
    console.error("Query failed:");
    console.error(e.message);
  }
  process.exit(0);
}

testQuery();
