const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const idsToInspect = [1, 3, 6, 9, 13, 20, 28, 30, 32, 33, 36, 39, 44, 64, 71, 76, 77, 78, 80, 82, 87, 89, 94, 95, 100, 103, 111, 117, 118];

async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });

  const [recipes] = await pool.query('SELECT id, title, description, category_country, category_type, diet_type, image_url FROM recipes WHERE id IN (?)', [idsToInspect]);
  
  recipes.forEach(r => {
    let titleStr = '';
    try {
      const tObj = typeof r.title === 'string' && r.title.startsWith('{') ? JSON.parse(r.title) : r.title;
      titleStr = tObj.es || tObj.en || String(tObj);
    } catch(e) { titleStr = String(r.title); }

    let descStr = '';
    try {
      const dObj = typeof r.description === 'string' && r.description.startsWith('{') ? JSON.parse(r.description) : r.description;
      descStr = dObj.es || dObj.en || String(dObj);
    } catch(e) { descStr = String(r.description); }

    console.log(`ID: ${r.id} | Title: ${titleStr}`);
    console.log(`  Country: ${r.category_country} | Current Cat: ${r.category_type} | Diet: ${r.diet_type}`);
    console.log(`  Image: ${r.image_url}`);
    console.log(`  Description: ${descStr.substring(0, 100)}...`);
    console.log("-----------------------------------------");
  });

  process.exit(0);
}

run().catch(console.error);
