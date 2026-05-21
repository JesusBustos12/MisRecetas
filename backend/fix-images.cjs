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

  const [rows] = await pool.query('SELECT id, title, image_url, category_country FROM recipes');
  
  const publicDir = path.join(__dirname, '../public/recipes');
  let updated = 0;

  for (const row of rows) {
    let country = '';
    try {
        const cParsed = typeof row.category_country === 'string' && row.category_country.startsWith('{') ? JSON.parse(row.category_country) : row.category_country;
        country = (cParsed.en || cParsed.es || cParsed || '').toLowerCase();
    } catch(e) { country = row.category_country.toLowerCase(); }

    if (!country) continue;
    // normalize country
    if (country === 'méxico') country = 'mexico';
    if (country === 'españa') country = 'spain';
    if (country === 'japón') country = 'japan';
    if (country === 'tailandia') country = 'thailand';
    if (country === 'ee.uu.') country = 'usa';
    if (country === 'francia') country = 'france';
    if (country === 'italia') country = 'italy';
    if (country === 'grecia') country = 'greece';

    let currentUrl = row.image_url;
    if (!currentUrl) continue;

    // extract filename
    let filename = path.basename(currentUrl);
    
    // search in public/recipes/<country>
    const countryDir = path.join(publicDir, country);
    if (!fs.existsSync(countryDir)) {
        console.log(`Directory not found for country: ${country}`);
        continue;
    }

    const files = fs.readdirSync(countryDir);
    let matchedFile = null;
    
    // Try exact match
    if (files.includes(filename)) {
        matchedFile = filename;
    } else {
        // Try removing prefix/suffix
        let baseName = filename.replace('.png', '').replace('.jpg', '').replace('.jpeg', '').replace('.svg', '').replace(country + '_', '');
        
        // Find best match
        for (const file of files) {
            if (file.includes(baseName) || file.replace(country + '_', '').includes(baseName)) {
                matchedFile = file;
                // Prefer .png over .svg if multiple found (like italy_gelato)
                if (matchedFile.endsWith('.png')) break;
            }
        }
        
        // Specific fallbacks if base logic failed
        if (!matchedFile) {
            if (baseName.includes('boeuf')) matchedFile = files.find(f => f.includes('bourguignon'));
            if (baseName.includes('burger')) matchedFile = files.find(f => f.includes('hamburguesa'));
            if (baseName.includes('bravas')) matchedFile = files.find(f => f.includes('bravas'));
            if (baseName.includes('pulpo')) matchedFile = files.find(f => f.includes('pulpo'));
            if (baseName.includes('croquetas')) matchedFile = files.find(f => f.includes('croquetas'));
            if (baseName.includes('gambas')) matchedFile = files.find(f => f.includes('gambas'));
            if (baseName.includes('pad_thai')) matchedFile = files.find(f => f.includes('pad_thai'));
            if (baseName.includes('lasagna')) matchedFile = files.find(f => f.includes('lasagna'));
            if (baseName.includes('ramen')) matchedFile = files.find(f => f.includes('ramen'));
        }
    }

    if (matchedFile) {
        const newUrl = `/recipes/${country}/${matchedFile}`;
        if (newUrl !== currentUrl) {
            console.log(`[${country}] Updating recipe ${row.id}: ${currentUrl} -> ${newUrl}`);
            await pool.query('UPDATE recipes SET image_url = ? WHERE id = ?', [newUrl, row.id]);
            updated++;
        }
    } else {
        console.log(`Could not find match for ${currentUrl} in ${country}`);
    }
  }
  console.log(`Successfully updated ${updated} recipes in the database!`);
  process.exit(0);
}

run().catch(console.error);
