const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const formatDate = (isoString) => {
    if (!isoString) return null;
    return isoString.replace('T', ' ').replace('Z', '').split('.')[0];
};

async function migrarSistemaTiDBCloud() {
    // Credenciales de TiDB Cloud extraídas del proyecto anterior
    const dbHost = 'gateway01.us-east-1.prod.aws.tidbcloud.com';
    const dbPort = 4000;
    const dbUser = '3P4gz8zxmpdpK4b.root';
    const dbPass = 'rkSv42bA8y39oOJv';
    const dbName = 'MisRecetas';
    
    console.log('📡 Iniciando conexión con la base de datos de producción TiDB Cloud...');
    console.log(`Host: ${dbHost}`);
    console.log(`Base de datos: ${dbName}`);

    // Conexión segura con soporte SSL para TiDB Cloud
    const conn = await mysql.createConnection({
        host: dbHost,
        port: dbPort,
        user: dbUser,
        password: dbPass,
        database: dbName,
        ssl: { rejectUnauthorized: false }
    });

    console.log('✅ Conexión establecida con TiDB Cloud.');
    console.log('=== RESTAURACIÓN E IMPORTACIÓN DE DATOS A LA NUBE ===');

    const backupPath = path.join(__dirname, 'BACKUP_SISTEMA_TOTAL.json');
    if (!fs.existsSync(backupPath)) {
        console.error('❌ Error: No se encontró el archivo BACKUP_SISTEMA_TOTAL.json en la misma carpeta del script.');
        await conn.end();
        process.exit(1);
    }

    const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

    // 1. Limpieza Total (Truncate/Delete) para evitar duplicados
    console.log('🧹 Vaciando tablas actuales de la base de datos de producción (TiDB)...');
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");
    await conn.query("TRUNCATE TABLE comments");
    await conn.query("TRUNCATE TABLE favorites");
    await conn.query("TRUNCATE TABLE recipes");
    await conn.query("TRUNCATE TABLE users");
    await conn.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log('✅ Tablas vaciadas correctamente y contadores reiniciados.');

    // 2. Restaurar Usuarios
    console.log(`👥 Restaurando ${backup.users.length} usuarios...`);
    for (const u of backup.users) {
        await conn.query(
            "INSERT INTO users (id, full_name, email, password, avatar_url, created_at) VALUES (?, ?, ?, ?, ?, ?)", 
            [u.id, u.full_name, u.email, u.password || '123456', u.avatar_url, formatDate(u.created_at)]
        );
    }
    console.log('✅ Usuarios restaurados.');

    // 3. Restaurar Recetas
    console.log(`🍳 Restaurando ${backup.recipes.length} recetas de alta calidad con el buen seeding...`);
    for (const r of backup.recipes) {
        await conn.query(
            `INSERT INTO recipes 
            (id, user_id, title, description, category_country, diet_type, prep_time, cook_time, servings, image_url, ingredients, steps, nutrition, category_type, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                r.id, 
                r.user_id, 
                JSON.stringify(r.title), 
                JSON.stringify(r.description), 
                r.category_country, 
                r.diet_type, 
                r.prep_time || 30, 
                r.cook_time || 20, 
                r.servings || 4, 
                r.image_url, 
                JSON.stringify(r.ingredients), 
                JSON.stringify(r.steps), 
                r.nutrition ? JSON.stringify(r.nutrition) : null, 
                r.category_type, 
                formatDate(r.created_at)
            ]
        );
    }
    console.log('✅ Recetas restauradas.');

    // 4. Restaurar Comentarios
    console.log(`💬 Restaurando ${backup.comments ? backup.comments.length : 0} comentarios...`);
    if (backup.comments && backup.comments.length > 0) {
        for (const c of backup.comments) {
            await conn.query(
                "INSERT INTO comments (id, recipe_id, user_id, content, rating, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                [c.id, c.recipe_id, c.user_id, c.content || c.comment_text || '', c.rating || 5, formatDate(c.created_at)]
            );
        }
        console.log('✅ Comentarios restaurados.');
    } else {
        console.log('⚠️ No se encontraron comentarios para restaurar.');
    }

    console.log('\n🎉 ======================================================== 🎉');
    console.log('   ¡SISTEMA MIGRADO CON ÉXITO A LA NUBE DE TiDB CLOUD!');
    console.log('   Vercel ahora leerá la versión superior de tus recetas.');
    console.log('🎉 ======================================================== 🎉');
    
    await conn.end();
}

migrarSistemaTiDBCloud().catch(async (error) => {
    console.error("❌ Error grave durante la migración:", error.message);
    process.exit(1);
});
