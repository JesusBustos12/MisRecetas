const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const formatDate = (isoString) => {
    if (!isoString) return null;
    return isoString.replace('T', ' ').replace('Z', '').split('.')[0];
};

async function restaurarSistemaTotal() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'recetas_admin',
        password: 'recetas123',
        database: 'MisRecetas'
    });

    console.log('=== RESTAURACIÓN DEL SISTEMA DESDE EL PUNTO DE ORO (SANITIZADO) ===');

    const backupPath = path.join(__dirname, 'BACKUP_SISTEMA_TOTAL.json');
    if (!fs.existsSync(backupPath)) {
        console.error('Error: No se encontró el archivo BACKUP_SISTEMA_TOTAL.json');
        process.exit(1);
    }

    const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

    // 1. Limpiar todo
    console.log('Limpiando tablas actuales...');
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");
    await conn.query("TRUNCATE TABLE comments");
    await conn.query("TRUNCATE TABLE favorites");
    await conn.query("TRUNCATE TABLE recipes");
    await conn.query("TRUNCATE TABLE users");
    await conn.query("SET FOREIGN_KEY_CHECKS = 1");

    // 2. Restaurar Usuarios
    console.log(`Restaurando ${backup.users.length} usuarios...`);
    for (const u of backup.users) {
        await conn.query("INSERT INTO users (id, full_name, email, password, avatar_url, created_at) VALUES (?, ?, ?, ?, ?, ?)", 
            [u.id, u.full_name, u.email, u.password || '123456', u.avatar_url, formatDate(u.created_at)]);
    }

    // 3. Restaurar Recetas
    console.log(`Restaurando ${backup.recipes.length} recetas sanitizadas...`);
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
    console.log(`Restaurando ${backup.comments.length} comentarios...`);
    for (const c of backup.comments) {
        await conn.query("INSERT INTO comments (id, recipe_id, user_id, content, rating, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            [c.id, c.recipe_id, c.user_id, c.content || c.comment_text, c.rating, formatDate(c.created_at)]);
    }

    console.log('=== SISTEMA RESTAURADO AL 100% CON LA VERSIÓN SANITIZADA ===');
    await conn.end();
}

restaurarSistemaTotal().catch(console.error);
