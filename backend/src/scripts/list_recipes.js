import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function listRecipes() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 4000,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD || process.env.DB_PASS,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false }
    });

    const [recipes] = await pool.query(
        "SELECT id, title, category_country, category_type FROM recipes ORDER BY category_country, category_type, id"
    );

    const grouped = {};
    for (const r of recipes) {
        let titleObj = r.title;
        if (typeof titleObj === 'string') {
            try { titleObj = JSON.parse(titleObj); } catch(e) { titleObj = { es: titleObj, en: titleObj }; }
        }
        const key = `${r.category_country}|${r.category_type}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push({ id: r.id, titleEs: titleObj.es || titleObj.en, titleEn: titleObj.en || titleObj.es });
    }

    for (const [key, recipes] of Object.entries(grouped)) {
        console.log(`\n=== ${key} (${recipes.length} recetas) ===`);
        for (const r of recipes) {
            console.log(`  ID ${r.id}: ${r.titleEn} / ${r.titleEs}`);
        }
    }

    console.log(`\nTotal: ${recipes.length} recetas`);
    await pool.end();
}

listRecipes();
