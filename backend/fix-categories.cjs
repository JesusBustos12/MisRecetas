const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });

  console.log("Adding category_type column if it doesn't exist...");
  try {
    await pool.query('ALTER TABLE recipes ADD COLUMN category_type VARCHAR(50) DEFAULT "meat"');
    console.log("Column added.");
  } catch(e) {
    if (e.code !== 'ER_DUP_FIELDNAME') console.error(e);
  }

  const [recipes] = await pool.query('SELECT id, title, ingredients, image_url, diet_type FROM recipes');
  
  const imageMap = {
      'spain_torrijas.png': '/recipes/spain/crema_catalana.png',
      'italy_chicken_parm.png': '/recipes/italy/italy_pollo_cacciatore_1772409006303.png',
      'mexico_pescado.png': '/recipes/mexico/mexico_ceviche.png',
      'france_coq_vin.png': '/recipes/france/coq_au_vin.png',
      'usa_cookies.png': '/recipes/usa/brownie.png',
      'greece_fakes.png': '/recipes/greece/moussaka.png',
      'greece_revithia.png': '/recipes/greece/greek_salad.png',
      'mexico_sopa_lima.png': '/recipes/mexico/mexico_sopa_tortilla.png',
      'mexico_tostadas.png': '/recipes/mexico/mexico_sopes.png',
      'mexico_birria.png': '/recipes/mexico/mexico_barbacoa.png',
      'usa_ribs.png': '/recipes/usa/costillas_bbq.png',
      'italy_saltimbocca.png': '/recipes/italy/italy_veal_milanese.png'
  };

  let countImages = 0;
  let countCategories = 0;

  for (const r of recipes) {
     let newCat = 'meat';
     
     let titleStr = '';
     try {
         const tObj = typeof r.title === 'string' && r.title.startsWith('{') ? JSON.parse(r.title) : r.title;
         titleStr = tObj.es || tObj.en || String(tObj);
     } catch(e) { titleStr = String(r.title); }
     
     let ingStr = '';
     try {
         const iObj = typeof r.ingredients === 'string' && r.ingredients.startsWith('[') ? JSON.parse(r.ingredients) : r.ingredients;
         ingStr = JSON.stringify(iObj);
     } catch(e) { ingStr = String(r.ingredients); }

     const fullText = (titleStr + " " + ingStr).toLowerCase();
     
     const isDessert = /postre|dulce|tarta|pastel|cake|dessert|chocolate|helado|flan|galleta|cookie|brownie|muffin|cupcake|mermelada|mousse|creme brulee|pudding|pudin|pay|pie|caramelo|tiramisu|gelato|cannoli|panettone|panna cotta|crepe|macaron|baklava|dorayaki|mochi|profiteroles|churros|sfogliatella|zabaione|zeppole|loukoumades|torrijas/.test(fullText);
     const isSeafood = /pescado|fish|camaron|shrimp|marisco|seafood|salmon|atun|pulpo|calamar|bacalao|tuna|lobster|langosta|crab|cangrejo|mussels|mejillones|clams|almejas|ostras|oysters|vieiras|scallops|prawns|gambas|langostinos|aguachile|ceviche|takoyaki|unagi|paella|anchoa|anchovy|pissaladiere|clam|chowder|bouillabaisse|pla|goong|nicoise|chawanmushi|coquilles/.test(fullText);
     const isVegetarian = r.diet_type === 'Vegetariano' || r.diet_type === 'Vegano' || /vegetariano|vegetarian|vegano|vegan|ensalada|salad|guacamole|esquites|fakes|revithia|gazpacho|salmorejo|tortilla|patatas|pimientos/.test(fullText);
     
     if (isDessert) newCat = 'desserts';
     else if (isSeafood) newCat = 'seafood';
     else if (isVegetarian) newCat = 'vegetarian';
     
     let imageUrl = r.image_url;
     for (const [bad, good] of Object.entries(imageMap)) {
         if (imageUrl && imageUrl.includes(bad)) {
             imageUrl = good;
             countImages++;
             break;
         }
     }

     await pool.query('UPDATE recipes SET category_type = ?, image_url = ? WHERE id = ?', [newCat, imageUrl, r.id]);
     countCategories++;
  }
  
  console.log(`Done! Updated categories for ${countCategories} recipes and fixed ${countImages} image URLs.`);
  process.exit(0);
}

run().catch(console.error);
