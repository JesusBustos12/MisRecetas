import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function findMismatches() {
  console.log('🔌 Conectando a TiDB Cloud para analizar incongruencias...');
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
    const [recipes] = await conn.query("SELECT id, title, image_url FROM recipes ORDER BY id ASC");
    
    console.log(`📊 Analizando ${recipes.length} recetas...\n`);

    const mismatches = [];

    // Palabras a ignorar para el cálculo de similitud (stop words)
    const stopWords = new Set(['con', 'de', 'la', 'el', 'los', 'las', 'en', 'al', 'y', 'a', 'with', 'of', 'the', 'in', 'and', 'baked', 'fried', 'spicy', 'sweet', 'sour', 'png', 'jpg', 'jpeg']);

    for (const r of recipes) {
      if (!r.image_url) continue;

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

      // Extraer nombre del archivo de la imagen (ej: /recipes/japan/sushi_roll.png -> sushi roll)
      const imageFilename = r.image_url.split('/').pop().toLowerCase().replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ');
      
      const imageWords = imageFilename.split(' ').filter(w => w.length > 2 && !stopWords.has(w));
      const titleEnWords = titleEn.split(' ').filter(w => w.length > 2 && !stopWords.has(w));
      const titleEsWords = titleEs.split(' ').filter(w => w.length > 2 && !stopWords.has(w));

      // Verificar si hay al menos una palabra clave en común
      let hasOverlap = false;
      for (const w of imageWords) {
        if (titleEn.includes(w) || titleEs.includes(w)) {
          hasOverlap = true;
          break;
        }
      }

      // Casos manuales especiales por traducciones muy distintas
      if (imageFilename.includes('beef') && (titleEs.includes('carne') || titleEs.includes('res'))) hasOverlap = true;
      if (imageFilename.includes('chicken') && titleEs.includes('pollo')) hasOverlap = true;
      if (imageFilename.includes('pork') && titleEs.includes('cerdo')) hasOverlap = true;
      if (imageFilename.includes('cheese') && titleEs.includes('queso')) hasOverlap = true;
      if (imageFilename.includes('shrimp') && titleEs.includes('camaron')) hasOverlap = true;
      if (imageFilename.includes('fish') && titleEs.includes('pescado')) hasOverlap = true;

      if (!hasOverlap) {
        mismatches.push({
          id: r.id,
          title: titleEn || titleEs,
          image: r.image_url,
          image_clean: imageFilename
        });
      }
    }

    console.log(`❌ Se encontraron ${mismatches.length} posibles incongruencias entre Título e Imagen:\n`);
    mismatches.forEach(m => {
      console.log(`ID: ${m.id}`);
      console.log(`📝 Título : ${m.title}`);
      console.log(`🖼️ Imagen : ${m.image} (detectado: '${m.image_clean}')`);
      console.log('--------------------------------------------------');
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

findMismatches();
