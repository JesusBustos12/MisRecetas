import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import crypto from 'crypto';

dotenv.config(); // Carga el .env desde el directorio raíz donde se ejecuta (Recetas de comida)

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 4000,
  ssl: { rejectUnauthorized: true },
});

async function uploadToCloudinary(base64Image, folder) {
  const timestamp = Math.round((new Date).getTime() / 1000);
  // String to sign: folder=recipes&timestamp=123...<API_SECRET>
  const signatureStr = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(signatureStr).digest('hex');

  const formData = new URLSearchParams();
  formData.append('file', base64Image);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  formData.append('api_key', apiKey);
  formData.append('folder', folder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Error uploading to Cloudinary');
  }
  return data.secure_url;
}

async function migrateImages() {
  console.log('Iniciando migración de imágenes a Cloudinary (Sin SDK)...');
  
  try {
    // 1. Migrar Avatares de Usuarios
    const [users] = await pool.query("SELECT id, avatar_url FROM users WHERE avatar_url LIKE 'data:image/%'");
    console.log(`Encontrados ${users.length} usuarios con avatares en Base64.`);
    
    for (const user of users) {
      try {
        console.log(`Subiendo avatar del usuario ${user.id}...`);
        const secure_url = await uploadToCloudinary(user.avatar_url, 'avatars');
        await pool.query('UPDATE users SET avatar_url = ? WHERE id = ?', [secure_url, user.id]);
        console.log(`✅ Usuario ${user.id} migrado: ${secure_url}`);
      } catch (err) {
        console.error(`❌ Error migrando usuario ${user.id}:`, err.message);
      }
    }

    // 2. Migrar Imágenes de Recetas
    const [recipes] = await pool.query("SELECT id, image_url FROM recipes WHERE image_url LIKE 'data:image/%'");
    console.log(`\nEncontradas ${recipes.length} recetas con imágenes en Base64.`);

    for (const recipe of recipes) {
      try {
        console.log(`Subiendo imagen de receta ${recipe.id}...`);
        const secure_url = await uploadToCloudinary(recipe.image_url, 'recipes');
        await pool.query('UPDATE recipes SET image_url = ? WHERE id = ?', [secure_url, recipe.id]);
        console.log(`✅ Receta ${recipe.id} migrada: ${secure_url}`);
      } catch (err) {
        console.error(`❌ Error migrando receta ${recipe.id}:`, err.message);
      }
    }

    console.log('\n🎉 Migración completada exitosamente.');
  } catch (error) {
    console.error('Error general durante la migración:', error);
  } finally {
    pool.end();
  }
}

migrateImages();
