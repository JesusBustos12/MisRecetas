const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno del backend o locales si existen
dotenv.config({ path: path.join(__dirname, '../backend/.env') });
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function runBackup() {
    console.log('================================================================');
    console.log('📥 EXTRACCIÓN Y COPIA DE SEGURIDAD MAESTRA (PRODUCTION READY)');
    console.log('================================================================');

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

    // Soporte para SSL
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
        process.exit(1);
    }

    try {
        console.log('📥 Extrayendo datos de la base de datos activa...');

        // 1. Obtener Recetas
        console.log('   -> Leyendo recetas y autores...');
        const [recipes] = await conn.query(`
            SELECT r.*, u.full_name as author_name 
            FROM recipes r 
            LEFT JOIN users u ON r.user_id = u.id
        `);

        // 2. Obtener Usuarios
        console.log('   -> Leyendo usuarios registrados...');
        const [users] = await conn.query("SELECT * FROM users");

        // 3. Obtener Comentarios
        console.log('   -> Leyendo comentarios e interacciones...');
        const [comments] = await conn.query("SELECT * FROM comments");

        // 4. Obtener Favoritos
        console.log('   -> Leyendo favoritos...');
        const [favorites] = await conn.query("SELECT * FROM favorites");

        // Estructurar el Backup de forma consistente
        const fullBackup = {
            recipes: recipes.map(r => ({
                ...r,
                title: typeof r.title === 'string' ? JSON.parse(r.title) : r.title,
                description: typeof r.description === 'string' ? JSON.parse(r.description) : r.description,
                ingredients: typeof r.ingredients === 'string' ? JSON.parse(r.ingredients) : r.ingredients,
                steps: typeof r.steps === 'string' ? JSON.parse(r.steps) : r.steps,
                nutrition: typeof r.nutrition === 'string' ? JSON.parse(r.nutrition) : r.nutrition
            })),
            users,
            comments,
            favorites
        };

        const backupPath = path.join(__dirname, 'BACKUP_SISTEMA_TOTAL.json');
        const sanitizedPath = path.join(__dirname, 'Recetas_Sanitizadas_Final.json');

        console.log('💾 Escribiendo ficheros de respaldo...');
        fs.writeFileSync(backupPath, JSON.stringify(fullBackup, null, 2), 'utf8');
        fs.writeFileSync(sanitizedPath, JSON.stringify(fullBackup.recipes, null, 2), 'utf8');

        console.log('================================================================');
        console.log(`🎉 ¡RESPALDO COMPLETO REALIZADO CON ÉXITO!`);
        console.log(`   -> Guardado en: ${path.basename(backupPath)} (${fullBackup.recipes.length} recetas)`);
        console.log(`   -> Guardado en: ${path.basename(sanitizedPath)} (Catálogo sanitizado)`);
        console.log('================================================================');

    } catch (err) {
        console.error('❌ Error severo durante la generación de copia de seguridad:', err);
    } finally {
        await conn.end();
    }
}

runBackup().catch(console.error);
