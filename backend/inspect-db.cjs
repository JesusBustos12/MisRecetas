const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log("Querying database recipes...");
    const [recipes] = await pool.query('SELECT id, title, category_country, category_type, image_url FROM recipes ORDER BY id');
    
    // Parse titles if they are JSON strings
    const formatted = recipes.map(r => {
      let parsedTitle = r.title;
      try {
        if (typeof r.title === 'string' && r.title.startsWith('{')) {
          parsedTitle = JSON.parse(r.title);
        }
      } catch (e) {}
      return {
        id: r.id,
        title: parsedTitle,
        category_country: r.category_country,
        category_type: r.category_type,
        image_url: r.image_url
      };
    });

    const outputPath = path.join(__dirname, 'db-recipes.json');
    fs.writeFileSync(outputPath, JSON.stringify(formatted, null, 2));
    console.log(`Successfully wrote ${formatted.length} recipes to ${outputPath}`);
  } catch (error) {
    console.error("Error inspecting database:", error);
  } finally {
    process.exit(0);
  }
}

run();
