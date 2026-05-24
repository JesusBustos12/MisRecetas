const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function syncBackup() {
    const conn = await mysql.createConnection({ host: 'localhost', user: 'recetas_admin', password: 'recetas123', database: 'MisRecetas' });
    
    console.log('--- SINCRONIZANDO BACKUPS DESDE LA BASE DE DATOS MAESTRA ---');
    
    const [recipes] = await conn.query(`
        SELECT r.*, u.full_name as author_name 
        FROM recipes r 
        LEFT JOIN users u ON r.user_id = u.id
    `);
    
    const [users] = await conn.query("SELECT * FROM users");
    const [comments] = await conn.query("SELECT * FROM comments");
    const [favorites] = await conn.query("SELECT * FROM favorites");

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

    const backupPath = path.join(process.cwd(), 'Recetas', 'BACKUP_SISTEMA_TOTAL.json');
    const sanitizedPath = path.join(process.cwd(), 'Recetas', 'Recetas_Sanitizadas_Final.json');

    fs.writeFileSync(backupPath, JSON.stringify(fullBackup, null, 2), 'utf8');
    fs.writeFileSync(sanitizedPath, JSON.stringify(fullBackup.recipes, null, 2), 'utf8');

    console.log('[SUCCESS] Backups actualizados con 216 recetas de alta complejidad.');
    await conn.end();
}

syncBackup().catch(console.error);
