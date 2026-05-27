import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const formatDate = (dateObj) => {
    if (!dateObj) return null;
    const d = new Date(dateObj);
    return d.toISOString().replace('T', ' ').replace('Z', '').split('.')[0];
};

async function migrateDirect() {
    console.log('🔌 Conectando a la base de datos LOCAL (Origen)...');
    const localPool = mysql.createPool({
        host: 'localhost',
        user: 'recetas_admin',
        password: 'recetas123',
        database: 'MisRecetas'
    });

    console.log('🔌 Conectando a la base de datos TiDB Cloud (Destino)...');
    const remotePool = mysql.createPool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 4000,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD || process.env.DB_PASS,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false }
    });

    let localConn, remoteConn;
    try {
        localConn = await localPool.getConnection();
        remoteConn = await remotePool.getConnection();
        console.log('✅ Ambas conexiones establecidas exitosamente.');

        // 1. Extraer datos locales
        console.log('📥 Extrayendo datos de la base de datos local...');
        const [users] = await localConn.query("SELECT * FROM users");
        const [recipes] = await localConn.query("SELECT * FROM recipes");
        const [comments] = await localConn.query("SELECT * FROM comments");
        const [favorites] = await localConn.query("SELECT * FROM favorites");
        console.log(`📊 Se encontraron: ${users.length} usuarios, ${recipes.length} recetas, ${comments.length} comentarios, ${favorites.length} favoritos.`);

        // 2. Limpiar base de datos destino (TiDB)
        console.log('🧹 Limpiando la base de datos de TiDB...');
        await remoteConn.query("SET FOREIGN_KEY_CHECKS = 0");
        await remoteConn.query("TRUNCATE TABLE favorites");
        await remoteConn.query("TRUNCATE TABLE comments");
        await remoteConn.query("TRUNCATE TABLE recipes");
        await remoteConn.query("TRUNCATE TABLE users");
        await remoteConn.query("SET FOREIGN_KEY_CHECKS = 1");
        console.log('✅ Base de datos TiDB limpia y lista.');

        // 3. Insertar Usuarios
        if (users.length > 0) {
            console.log(`🚀 Insertando ${users.length} usuarios en TiDB...`);
            const placeholders = users.map(() => "(?, ?, ?, ?, ?, ?)").join(", ");
            const values = users.flatMap(u => [u.id, u.full_name, u.email, u.password, u.avatar_url, formatDate(u.created_at)]);
            await remoteConn.query(`INSERT INTO users (id, full_name, email, password, avatar_url, created_at) VALUES ${placeholders}`, values);
            console.log('✅ Usuarios migrados.');
        }

        // 4. Insertar Recetas en Lotes
        if (recipes.length > 0) {
            console.log(`🚀 Insertando ${recipes.length} recetas en TiDB (por lotes)...`);
            const batchSize = 50;
            for (let i = 0; i < recipes.length; i += batchSize) {
                const batch = recipes.slice(i, i + batchSize);
                const placeholders = batch.map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").join(", ");
                const values = batch.flatMap(r => [
                    r.id, 
                    r.user_id, 
                    typeof r.title === 'object' ? JSON.stringify(r.title) : r.title, 
                    typeof r.description === 'object' ? JSON.stringify(r.description) : r.description, 
                    r.category_country, 
                    r.diet_type, 
                    r.prep_time, 
                    r.cook_time, 
                    r.servings, 
                    r.image_url, 
                    typeof r.ingredients === 'object' ? JSON.stringify(r.ingredients) : r.ingredients, 
                    typeof r.steps === 'object' ? JSON.stringify(r.steps) : r.steps, 
                    typeof r.nutrition === 'object' ? JSON.stringify(r.nutrition) : r.nutrition, 
                    r.category_type, 
                    formatDate(r.created_at)
                ]);
                await remoteConn.query(`INSERT INTO recipes (id, user_id, title, description, category_country, diet_type, prep_time, cook_time, servings, image_url, ingredients, steps, nutrition, category_type, created_at) VALUES ${placeholders}`, values);
            }
            console.log('✅ Recetas migradas.');
        }

        // 5. Insertar Comentarios en Lotes
        if (comments.length > 0) {
            console.log(`🚀 Insertando ${comments.length} comentarios en TiDB (por lotes)...`);
            const batchSize = 200;
            for (let i = 0; i < comments.length; i += batchSize) {
                const batch = comments.slice(i, i + batchSize);
                const placeholders = batch.map(() => "(?, ?, ?, ?, ?, ?)").join(", ");
                const values = batch.flatMap(c => [c.id, c.recipe_id, c.user_id, c.content, c.rating, formatDate(c.created_at)]);
                await remoteConn.query(`INSERT INTO comments (id, recipe_id, user_id, content, rating, created_at) VALUES ${placeholders}`, values);
            }
            console.log('✅ Comentarios migrados.');
        }

        // 6. Insertar Favoritos en Lotes
        if (favorites.length > 0) {
            console.log(`🚀 Insertando ${favorites.length} favoritos en TiDB (por lotes)...`);
            const batchSize = 200;
            for (let i = 0; i < favorites.length; i += batchSize) {
                const batch = favorites.slice(i, i + batchSize);
                const placeholders = batch.map(() => "(?, ?)").join(", ");
                const values = batch.flatMap(f => [f.user_id, f.recipe_id]);
                await remoteConn.query(`INSERT INTO favorites (user_id, recipe_id) VALUES ${placeholders}`, values);
            }
            console.log('✅ Favoritos migrados.');
        }

        console.log('\n🎉 ======================================================== 🎉');
        console.log('   ¡MIGRACIÓN DIRECTA COMPLETADA CON ÉXITO!');
        console.log('   La base de datos de TiDB Cloud es ahora un clon exacto de tu local.');
        console.log('🎉 ======================================================== 🎉');

    } catch (error) {
        console.error('❌ Error crítico durante la migración directa:', error);
    } finally {
        if (localConn) localConn.release();
        if (remoteConn) remoteConn.release();
        localPool.end();
        remotePool.end();
    }
}

migrateDirect();
