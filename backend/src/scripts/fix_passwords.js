import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function fixPasswords() {
    console.log('🔌 Conectando a la base de datos TiDB Cloud...');
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 4000,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD || process.env.DB_PASS,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const [users] = await pool.query('SELECT id, email, password FROM users');
        console.log(`📊 Revisando ${users.length} usuarios...`);

        let fixedCount = 0;
        for (const user of users) {
            // Un hash de bcrypt típicamente empieza con $2a$, $2b$ o $2y$ y tiene 60 caracteres
            if (!user.password.startsWith('$2') || user.password.length !== 60) {
                console.log(`⚠️ Contraseña en texto plano detectada para el usuario ${user.email}. Hasheando...`);
                // Si está en texto plano, asumo que es la que el usuario intentó usar
                const hashedPassword = await bcrypt.hash(user.password, 10);
                await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);
                fixedCount++;
            } else {
                console.log(`✅ Contraseña correcta para ${user.email}`);
            }
        }

        if (fixedCount > 0) {
            console.log(`\n🎉 Se han corregido (hasheado) exitosamente las contraseñas de ${fixedCount} usuarios en producción.`);
            console.log('Ahora el login debería funcionar correctamente usando la misma contraseña.');
        } else {
            console.log('\nTodas las contraseñas ya están en formato bcrypt. El problema podría ser otro.');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await pool.end();
    }
}

fixPasswords();
