import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env relative to the project root
dotenv.config({ path: path.join(__dirname, '../../../.env') });

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

    // Path to the backup file
    const backupPath = 'c:\\IDEs - Lenguajes de Programacion\\IDEs\\(Portafolio)\\(Curso de Vide Coding)\\(Vercion superior)\\Recetas de comida-s - copia\\Recetas\\BACKUP_SISTEMA_TOTAL.json';
    
    console.log(`Reading backup file from: ${backupPath}`);
    const data = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    
    if (!data.recipes || !Array.isArray(data.recipes)) {
      throw new Error('Invalid JSON format: Missing recipes array');
    }

    console.log(`Found ${data.recipes.length} recipes to migrate.`);

    // Disable foreign key checks to avoid errors with missing users
    await connection.query('SET FOREIGN_KEY_CHECKS=0;');

    let successCount = 0;
    let errorCount = 0;

    for (const recipe of data.recipes) {
      try {
        const query = `
          INSERT IGNORE INTO recipes 
          (id, user_id, title, description, category_country, prep_time, cook_time, servings, image_url, ingredients, steps, category_type, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        // Handle dates
        const createdAt = recipe.created_at ? new Date(recipe.created_at) : new Date();

        await connection.execute(query, [
          recipe.id,
          recipe.user_id,
          JSON.stringify(recipe.title),
          JSON.stringify(recipe.description),
          recipe.category_country || null,
          recipe.prep_time || 0,
          recipe.cook_time || 0,
          recipe.servings || 1,
          recipe.image_url || null,
          JSON.stringify(recipe.ingredients),
          JSON.stringify(recipe.steps),
          recipe.category_type || null,
          createdAt
        ]);
        successCount++;
      } catch (err) {
        console.error(`Error inserting recipe ID ${recipe.id}:`, err.message);
        errorCount++;
      }
    }

    // Re-enable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS=1;');

    console.log(`Migration completed: ${successCount} inserted, ${errorCount} errors.`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    if (connection) connection.release();
    pool.end();
  }
}

migrate();
