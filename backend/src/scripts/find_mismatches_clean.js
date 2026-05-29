import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function findMismatches() {
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
    const [recipes] = await conn.query("SELECT id, title, image_url, category_type FROM recipes ORDER BY id ASC");
    
    const stopWords = new Set(['con', 'de', 'la', 'el', 'los', 'las', 'en', 'al', 'y', 'a', 'with', 'of', 'the', 'in', 'and', 'baked', 'fried', 'spicy', 'sweet', 'sour', 'png', 'jpg', 'jpeg']);
    const mismatches = [];

    for (const r of recipes) {
      if (!r.image_url) continue;
      // Ignorar imágenes en formato base64 (data:image...) porque no tienen nombre de archivo útil
      if (r.image_url.startsWith('data:image')) continue;

      let titleEn = "";
      let titleEs = "";
      try {
        const tObj = typeof r.title === 'string' && r.title.startsWith('{') ? JSON.parse(r.title) : r.title;
        titleEn = (tObj.en || '').toLowerCase();
        titleEs = (tObj.es || '').toLowerCase();
      } catch(e) {
        titleEn = String(r.title).toLowerCase();
        titleEs = titleEn;
      }

      const imageFilename = r.image_url.split('/').pop().toLowerCase().replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ');
      
      const imageWords = imageFilename.split(' ').filter(w => w.length > 2 && !stopWords.has(w));
      const titleEnWords = titleEn.split(' ').filter(w => w.length > 2 && !stopWords.has(w));
      const titleEsWords = titleEs.split(' ').filter(w => w.length > 2 && !stopWords.has(w));

      let hasOverlap = false;
      for (const w of imageWords) {
        if (titleEn.includes(w) || titleEs.includes(w)) {
          hasOverlap = true;
          break;
        }
      }

      // Excepciones manuales
      if (imageFilename.includes('beef') && (titleEs.includes('carne') || titleEs.includes('res'))) hasOverlap = true;
      if (imageFilename.includes('chicken') && titleEs.includes('pollo')) hasOverlap = true;
      if (imageFilename.includes('pork') && titleEs.includes('cerdo')) hasOverlap = true;
      if (imageFilename.includes('cheese') && titleEs.includes('queso')) hasOverlap = true;
      if (imageFilename.includes('shrimp') && titleEs.includes('camaron')) hasOverlap = true;
      if (imageFilename.includes('fish') && titleEs.includes('pescado')) hasOverlap = true;
      if (imageFilename.includes('duck') && titleEs.includes('pato')) hasOverlap = true;
      if (imageFilename.includes('apple') && titleEs.includes('manzana')) hasOverlap = true;

      // Imprimir directamente si es la receta 284 para depurar
      if (r.id === 284) {
        mismatches.push({ id: r.id, title: titleEs || titleEn, image: r.image_url, type: r.category_type });
        continue;
      }

      if (!hasOverlap) {
        mismatches.push({ id: r.id, title: titleEs || titleEn, image: r.image_url, type: r.category_type });
      }
    }

    console.log(`\n❌ Se encontraron ${mismatches.length} recetas incongruentes:\n`);
    mismatches.forEach(m => {
      console.log(`ID: ${m.id} | TÍTULO: ${m.title}`);
      console.log(`   └─ IMAGEN: ${m.image} (Categoría BD: ${m.type})`);
    });

  } catch (error) {
    console.error(error);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

findMismatches();
