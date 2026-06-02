import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function resetPassword() {
  const emailToReset = "bujesus42@gmail.com";
  const newPassword = "password123";

  console.log(`🔌 Conectando a la base de datos TiDB Cloud...`);
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    const [result] = await pool.query(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, emailToReset]
    );

    if (result.affectedRows > 0) {
      console.log(`✅ Contraseña cambiada exitosamente para ${emailToReset}`);
      console.log(`🔑 Tu nueva contraseña es: ${newPassword}`);
    } else {
      console.log(`⚠️ No se encontró al usuario con el correo: ${emailToReset}`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

resetPassword();
