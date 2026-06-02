import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function deleteUser() {
  const userName = "Test User";
  console.log(`🗑️ INICIANDO ELIMINACIÓN DEL USUARIO: ${userName}...\n`);
  
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
    
    // 1. Buscar al usuario
    const [users] = await conn.query('SELECT id, full_name FROM users WHERE full_name = ?', [userName]);
    
    if (users.length === 0) {
      console.log(`⚠️ No se encontró ningún usuario con el nombre "${userName}".`);
      return;
    }
    
    const userId = users[0].id;
    console.log(`✅ Usuario encontrado: ID ${userId}`);

    // 2. Eliminar todas sus interacciones (comentarios)
    const [deletedComments] = await conn.query('DELETE FROM comments WHERE user_id = ?', [userId]);
    console.log(`🗑️ Se han eliminado ${deletedComments.affectedRows} interacciones (comentarios) del usuario.`);

    // 3. Eliminar al usuario (si hay likes, favoritos u otras tablas, borrarlas también)
    // Borramos de favorite_recipes si existe
    try {
      const [deletedFavs] = await conn.query('DELETE FROM favorite_recipes WHERE user_id = ?', [userId]);
      console.log(`🗑️ Se han eliminado ${deletedFavs.affectedRows} favoritos del usuario.`);
    } catch(e) {
      // Ignorar si la tabla no existe
    }

    const [deletedUser] = await conn.query('DELETE FROM users WHERE id = ?', [userId]);
    console.log(`🗑️ Usuario "${userName}" eliminado permanentemente de la base de datos.`);

    console.log(`\n🎉 PROCESO COMPLETADO EXITOSAMENTE.`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

deleteUser();
