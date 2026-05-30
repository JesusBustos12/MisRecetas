import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const fixes = {
  61: { es: 'Filete de salmón salvaje de Alaska asado al horno con limón y eneldo, con piel crujiente y centro rosado. Elegante y lleno de omega-3.', en: 'Wild Alaskan salmon fillet oven-roasted with lemon and dill, with crispy skin and pink center. Elegant and full of omega-3.' },
  141: { es: 'Cubos de paneer (queso indio) flotando en una salsa vibrante de espinacas frescas con ajo, jengibre y garam masala. Vegetariano y lleno de sabor.', en: 'Paneer (Indian cheese) cubes floating in a vibrant fresh spinach sauce with garlic, ginger and garam masala. Vegetarian and full of flavor.' },
  177: { es: 'Sopa griega rústica de judiones blancos con tomate, zanahoria, apio y aceite de oliva. El plato nacional griego — sencillo y reconfortante. Mejor al día siguiente.', en: 'Rustic Greek soup of large white beans with tomato, carrot, celery and olive oil. Greece\'s national dish — simple and comforting. Better the next day.' },
};

async function fix() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME, ssl: { rejectUnauthorized: false }
  });
  const conn = await pool.getConnection();
  for (const [id, desc] of Object.entries(fixes)) {
    await conn.query('UPDATE recipes SET description = ? WHERE id = ?', [JSON.stringify(desc), parseInt(id)]);
    console.log(`✅ ID ${id}: "${desc.es.substring(0, 80)}..."`);
  }
  conn.release(); pool.end();
}
fix();
