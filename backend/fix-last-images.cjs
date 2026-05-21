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

  const imageMap = {
      'usa_hotdog.png': '/recipes/usa/hot_dog_ny.png',
      'usa_gumbo.png': '/recipes/usa/jambalaya.png',
      'thailand_fish.png': '/recipes/thailand/pla_goong.png',
      'thailand_laab.png': '/recipes/thailand/larb_moo.png'
  };

  let countImages = 0;
  
  for (const [bad, good] of Object.entries(imageMap)) {
      const [res] = await pool.query('UPDATE recipes SET image_url = ? WHERE image_url LIKE ?', [good, `%${bad}%`]);
      countImages += res.affectedRows;
  }
  
  console.log(`Fixed ${countImages} image URLs.`);
  process.exit(0);
}

run().catch(console.error);
