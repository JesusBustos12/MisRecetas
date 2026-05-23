const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno del backend o locales si existen
dotenv.config({ path: path.join(__dirname, '../backend/.env') });
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const formatDate = (isoString) => {
    if (!isoString) return null;
    return isoString.replace('T', ' ').replace('Z', '').split('.')[0];
};

async function runRestore() {
    console.log('================================================================');
    console.log('🍽️  RESTAURACIÓN MAESTRA DE BASE DE DATOS (PRODUCTION READY)');
    console.log('================================================================');

    const backupPath = path.join(__dirname, 'BACKUP_SISTEMA_TOTAL.json');
    if (!fs.existsSync(backupPath)) {
        console.error('❌ Error crítico: No se encontró el archivo BACKUP_SISTEMA_TOTAL.json');
        process.exit(1);
    }

    const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

    // Configuración de la conexión flexible (Soporta TiDB Cloud, Local, Docker)
    let connConfig = {};

    if (process.env.DATABASE_URL) {
        console.log('📡 Conectando mediante DATABASE_URL...');
        connConfig = process.env.DATABASE_URL;
    } else {
        console.log('⚙️ Conectando mediante variables de entorno individuales...');
        connConfig = {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'recetas_admin',
            password: process.env.DB_PASS || 'recetas123',
            database: process.env.DB_NAME || 'MisRecetas',
            port: parseInt(process.env.DB_PORT || '3306')
        };
    }

    // Soporte para SSL (Requerido por TiDB Cloud y otros servidores en producción)
    const useSSL = process.env.DB_SSL === 'true' || (typeof connConfig === 'string' && connConfig.includes('ssl='));
    if (useSSL) {
        console.log('🔒 Conexión segura SSL/TLS activada.');
        if (typeof connConfig === 'object') {
            connConfig.ssl = { rejectUnauthorized: true };
        }
    }

    let conn;
    try {
        conn = await mysql.createConnection(connConfig);
        console.log('✅ Conexión establecida con éxito.');
    } catch (connError) {
        console.error('❌ Error crítico al conectar a la base de datos:', connError.message);
        console.log('\n💡 Tip para TiDB Cloud / Producción:');
        console.log('   Asegúrate de configurar DB_SSL=true o agregar los parámetros de SSL requeridos.');
        process.exit(1);
    }

    try {
        console.log('⏳ Desactivando restricciones de claves foráneas...');
        await conn.query("SET FOREIGN_KEY_CHECKS = 0");

        // 1. Limpiar todo
        console.log('🧹 Limpiando tablas actuales...');
        await conn.query("TRUNCATE TABLE comments");
        await conn.query("TRUNCATE TABLE favorites");
        await conn.query("TRUNCATE TABLE recipes");
        await conn.query("TRUNCATE TABLE users");

        // 2. Restaurar Usuarios
        console.log(`👤 Restaurando ${backup.users.length} usuarios con perfiles...`);
        for (const u of backup.users) {
            await conn.query(
                "INSERT INTO users (id, full_name, email, password, avatar_url, created_at) VALUES (?, ?, ?, ?, ?, ?)", 
                [u.id, u.full_name, u.email, u.password || '$2b$12$123456789012345678901u', u.avatar_url, formatDate(u.created_at)]
            );
        }

        // 3. Restaurar Recetas
        console.log(`🥘 Restaurando ${backup.recipes.length} recetas enriquecidas (Nivel Michelin)...`);
        for (const r of backup.recipes) {
            await conn.query(
                "INSERT INTO recipes (id, user_id, title, description, category_country, diet_type, prep_time, cook_time, servings, image_url, ingredients, steps, nutrition, category_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    r.id, r.user_id, JSON.stringify(r.title), JSON.stringify(r.description), 
                    r.category_country, r.diet_type, r.prep_time, r.cook_time, r.servings, 
                    r.image_url, JSON.stringify(r.ingredients), JSON.stringify(r.steps), 
                    r.nutrition ? JSON.stringify(r.nutrition) : null, r.category_type, formatDate(r.created_at)
                ]
            );
        }

        // 4. Restaurar Comentarios
        console.log(`💬 Restaurando ${backup.comments.length} comentarios e interacciones de usuarios...`);
        for (const c of backup.comments) {
            await conn.query(
                "INSERT INTO comments (id, recipe_id, user_id, content, rating, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                [c.id, c.recipe_id, c.user_id, c.content || c.comment_text, c.rating, formatDate(c.created_at)]
            );
        }

        // 5. Restaurar Favoritos
        if (backup.favorites && backup.favorites.length > 0) {
            console.log(`⭐ Restaurando ${backup.favorites.length} relaciones de favoritos...`);
            for (const f of backup.favorites) {
                await conn.query(
                    "INSERT INTO favorites (id, user_id, recipe_id, created_at) VALUES (?, ?, ?, ?)",
                    [f.id, f.user_id, f.recipe_id, formatDate(f.created_at)]
                );
            }
        }

        console.log('⏳ Reactivando restricciones de claves foráneas...');
        await conn.query("SET FOREIGN_KEY_CHECKS = 1");

        console.log('================================================================');
        console.log('🎉 ¡SISTEMA RESTAURADO CON ÉXITO AL 100% EN PRODUCCIÓN / LOCAL!');
        console.log('================================================================');

    } catch (err) {
        console.error('❌ Error severo durante el proceso de restauración:', err);
    } finally {
        await conn.end();
    }
}

runRestore().catch(console.error);
