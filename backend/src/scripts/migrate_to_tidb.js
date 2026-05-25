import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const formatDate = (isoString) => {
    if (!isoString) return null;
    return isoString.replace('T', ' ').replace('Z', '').split('.')[0];
};

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 4000,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('Connected to TiDB Cloud successfully.');

    const backupPath = 'c:\\IDEs - Lenguajes de Programacion\\IDEs\\(Portafolio)\\(Curso de Vide Coding)\\(Vercion superior)\\Recetas de comida-s - copia\\Recetas\\BACKUP_SISTEMA_TOTAL.json';
    
    console.log(`Reading backup file from: ${backupPath}`);
    const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

    console.log('🧹 Vaciando tablas actuales de la base de datos de producción (TiDB)...');
    await connection.query("SET FOREIGN_KEY_CHECKS = 0");
    await connection.query("TRUNCATE TABLE comments");
    await connection.query("TRUNCATE TABLE favorites");
    await connection.query("TRUNCATE TABLE recipes");
    await connection.query("TRUNCATE TABLE users");
    await connection.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log('✅ Tablas vaciadas correctamente y contadores reiniciados.');

    if (backup.users) {
        console.log(`👥 Restaurando ${backup.users.length} usuarios...`);
        for (const u of backup.users) {
            await connection.query(
                "INSERT INTO users (id, full_name, email, password, avatar_url, created_at) VALUES (?, ?, ?, ?, ?, ?)", 
                [u.id, u.full_name, u.email, u.password || '123456', u.avatar_url, formatDate(u.created_at)]
            );
        }
        console.log('✅ Usuarios restaurados.');
    }

    if (backup.recipes) {
        console.log(`🍳 Restaurando ${backup.recipes.length} recetas de alta calidad con el buen seeding...`);
        const batchSize = 50;
        for (let i = 0; i < backup.recipes.length; i += batchSize) {
            const batch = backup.recipes.slice(i, i + batchSize);
            const placeholders = batch.map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").join(", ");
            const values = batch.flatMap(r => [
                r.id, 
                r.user_id, 
                JSON.stringify(r.title), 
                JSON.stringify(r.description), 
                r.category_country || null, 
                r.diet_type || null, 
                r.prep_time || 30, 
                r.cook_time || 20, 
                r.servings || 4, 
                r.image_url || null, 
                JSON.stringify(r.ingredients), 
                JSON.stringify(r.steps), 
                r.nutrition ? JSON.stringify(r.nutrition) : null, 
                r.category_type || null, 
                formatDate(r.created_at)
            ]);
            
            await connection.query(
                `INSERT INTO recipes 
                (id, user_id, title, description, category_country, diet_type, prep_time, cook_time, servings, image_url, ingredients, steps, nutrition, category_type, created_at) 
                VALUES ${placeholders}`,
                values
            );
        }
        console.log('✅ Recetas restauradas en lotes.');
    }

    if (backup.comments && backup.comments.length > 0) {
        console.log(`💬 Restaurando ${backup.comments.length} comentarios...`);
        const batchSize = 200;
        for (let i = 0; i < backup.comments.length; i += batchSize) {
            const batch = backup.comments.slice(i, i + batchSize);
            const placeholders = batch.map(() => "(?, ?, ?, ?, ?, ?)").join(", ");
            const values = batch.flatMap(c => [
                c.id, 
                c.recipe_id, 
                c.user_id, 
                c.content || c.comment_text || '', 
                c.rating || 5, 
                formatDate(c.created_at)
            ]);
            
            await connection.query(
                `INSERT INTO comments (id, recipe_id, user_id, content, rating, created_at) VALUES ${placeholders}`,
                values
            );
        }
        console.log('✅ Comentarios restaurados en lotes.');
    }

    console.log('🎉 Migración COMPLETADA con éxito. Todos los datos fueron sobreescritos con la versión superior.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    if (connection) connection.release();
    pool.end();
  }
}

migrate();
