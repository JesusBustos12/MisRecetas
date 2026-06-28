import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function fixAvatarColumn() {
    console.log('🔌 Conectando a la base de datos TiDB Cloud...');
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 4000,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('ALTER TABLE users MODIFY COLUMN avatar_url LONGTEXT');
        await pool.query('ALTER TABLE users MODIFY COLUMN avatar_url LONGTEXT');
        console.log('✅ Columna avatar_url en users actualizada a LONGTEXT con éxito.');
        
        console.log('ALTER TABLE recipes MODIFY COLUMN image_url LONGTEXT');
        await pool.query('ALTER TABLE recipes MODIFY COLUMN image_url LONGTEXT');
        console.log('✅ Columna image_url en recipes actualizada a LONGTEXT con éxito.');
        
    } catch (error) {
        console.error('❌ Error al actualizar columnas:', error);
    } finally {
        pool.end();
    }
}

fixAvatarColumn();
