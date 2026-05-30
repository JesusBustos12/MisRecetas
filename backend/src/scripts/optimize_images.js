import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const PUBLIC_DIR = path.join(__dirname, '../../../public/recipes');

async function optimizeCountryImages(countryFolder, pool) {
  const dirPath = path.join(PUBLIC_DIR, countryFolder);
  
  try {
    const stat = await fs.stat(dirPath);
    if (!stat.isDirectory()) return { processed: 0, saved: 0 };
  } catch (error) {
    console.error(`❌ La carpeta '${countryFolder}' no existe en ${dirPath}`);
    return { processed: 0, saved: 0 };
  }

  const files = await fs.readdir(dirPath);
  const pngFiles = files.filter(f => f.toLowerCase().endsWith('.png'));
  
  if (pngFiles.length === 0) {
    return { processed: 0, saved: 0 };
  }

  console.log(`\n📦 Optimizando ${pngFiles.length} imágenes en '/public/recipes/${countryFolder}'...`);
  const conn = await pool.getConnection();

  let processedCount = 0;
  let totalSavedBytes = 0;

  for (const file of pngFiles) {
    const filePath = path.join(dirPath, file);
    const webpFilename = file.replace(/\.png$/i, '.webp');
    const webpFilePath = path.join(dirPath, webpFilename);
    
    try {
      const stats = await fs.stat(filePath);
      const originalSize = stats.size;
      
      // Saltar archivos corruptos o vacíos (como el de 16 bytes)
      if (originalSize < 100) continue;

      // Convertir a WebP con calidad 80
      await sharp(filePath)
        .webp({ quality: 80 })
        .toFile(webpFilePath);
        
      const newStats = await fs.stat(webpFilePath);
      const newSize = newStats.size;
      
      const savedBytes = originalSize - newSize;
      totalSavedBytes += savedBytes;
      const reduction = Math.round((savedBytes / originalSize) * 100);
      
      console.log(`  ✅ ${file} -> ${webpFilename} (-${reduction}%)`);
      
      // Actualizar la ruta en la base de datos
      const oldUrl = `/recipes/${countryFolder}/${file}`;
      const newUrl = `/recipes/${countryFolder}/${webpFilename}`;
      
      await conn.query('UPDATE recipes SET image_url = ? WHERE image_url = ?', [newUrl, oldUrl]);
      
      // Borrar la imagen .png original
      await fs.unlink(filePath);
      
      processedCount++;
    } catch (e) {
      console.error(`  ❌ Error procesando ${file}: ${e.message}`);
    }
  }
  
  conn.release();
  return { processed: processedCount, saved: totalSavedBytes };
}

async function runAll() {
  const arg = process.argv[2];
  if (!arg) {
    console.log('Uso correcto: node backend/src/scripts/optimize_images.js <pais> | all');
    console.log('Ejemplo: node backend/src/scripts/optimize_images.js all');
    process.exit(1);
  }

  const pool = mysql.createPool({
    host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME, ssl: { rejectUnauthorized: false }
  });

  if (arg === 'all') {
    console.log('🚀 Iniciando optimización masiva de TODOS los países restantes...\n');
    const folders = await fs.readdir(PUBLIC_DIR);
    let grandTotalProcessed = 0;
    let grandTotalSaved = 0;

    for (const folder of folders) {
      // Ignorar archivos sueltos y la carpeta spain (ya procesada)
      if (folder === 'spain' || folder.startsWith('.')) continue;
      
      const stat = await fs.stat(path.join(PUBLIC_DIR, folder));
      if (stat.isDirectory()) {
        const res = await optimizeCountryImages(folder, pool);
        grandTotalProcessed += res.processed;
        grandTotalSaved += res.saved;
      }
    }
    console.log('\n=======================================');
    console.log(`🎉 OPTIMIZACIÓN MASIVA COMPLETADA`);
    console.log(`   Imágenes procesadas: ${grandTotalProcessed}`);
    console.log(`   Espacio total ahorrado: ${(grandTotalSaved / (1024 * 1024)).toFixed(2)} MB`);
    console.log('=======================================');
  } else {
    const res = await optimizeCountryImages(arg, pool);
    console.log(`\n🎉 ¡Carpeta '${arg}' optimizada con éxito!`);
    console.log(`   Imágenes procesadas: ${res.processed}`);
    console.log(`   Espacio ahorrado: ${(res.saved / (1024 * 1024)).toFixed(2)} MB`);
  }
  
  pool.end();
}

runAll();
