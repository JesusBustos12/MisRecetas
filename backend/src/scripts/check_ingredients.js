import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function check() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 4000,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD || process.env.DB_PASS,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false }
    });

    const [recipes] = await pool.query(
        "SELECT id, title, category_country, category_type, ingredients, steps, nutrition FROM recipes LIMIT 5"
    );

    for (const r of recipes) {
        console.log('---');
        console.log('ID:', r.id);
        console.log('Title:', r.title);
        console.log('Country:', r.category_country);
        console.log('Type:', r.category_type);
        console.log('Ingredients (type):', typeof r.ingredients);
        console.log('Ingredients (raw):', r.ingredients?.substring?.(0, 300) || r.ingredients);
        console.log('Steps (type):', typeof r.steps);
        console.log('Steps (raw):', r.steps?.substring?.(0, 300) || r.steps);
        console.log('Nutrition (type):', typeof r.nutrition);
        console.log('Nutrition (raw):', r.nutrition?.substring?.(0, 300) || r.nutrition);
    }

    await pool.end();
}

check();
