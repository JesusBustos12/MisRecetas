const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const categoryAndDietUpdates = [
  { id: 1, category_type: 'vegetarian', diet_type: 'Vegetariano' },
  { id: 3, category_type: 'vegetarian', diet_type: 'Vegetariano' },
  { id: 6, category_type: 'desserts', diet_type: 'Vegetariano' },
  { id: 9, category_type: 'vegetarian', diet_type: 'Vegetariano' },
  { id: 13, category_type: 'vegetarian', diet_type: 'Vegano' },
  { id: 20, category_type: 'meat', diet_type: 'Omnívoro' },
  { id: 28, category_type: 'meat', diet_type: 'Omnívoro' },
  { id: 30, category_type: 'meat', diet_type: 'Omnívoro' },
  { id: 32, category_type: 'seafood', diet_type: 'Omnívoro' },
  { id: 33, category_type: 'seafood', diet_type: 'Omnívoro' },
  { id: 36, category_type: 'vegetarian', diet_type: 'Vegano' },
  { id: 39, category_type: 'seafood', diet_type: 'Omnívoro' },
  { id: 44, category_type: 'seafood', diet_type: 'Omnívoro' },
  { id: 64, category_type: 'vegetarian', diet_type: 'Vegetariano' },
  { id: 71, category_type: 'vegetarian', diet_type: 'Vegetariano' },
  { id: 76, category_type: 'vegetarian', diet_type: 'Vegano' },
  { id: 77, category_type: 'meat', diet_type: 'Omnívoro' },
  { id: 78, category_type: 'vegetarian', diet_type: 'Vegetariano' },
  { id: 80, category_type: 'meat', diet_type: 'Omnívoro' },
  { id: 82, category_type: 'desserts', diet_type: 'Vegetariano' },
  { id: 87, category_type: 'desserts', diet_type: 'Vegetariano' },
  { id: 89, category_type: 'seafood', diet_type: 'Omnívoro' },
  { id: 94, category_type: 'desserts', diet_type: 'Vegano' },
  { id: 95, category_type: 'vegetarian', diet_type: 'Vegetariano' },
  { id: 100, category_type: 'meat', diet_type: 'Omnívoro' },
  { id: 103, category_type: 'desserts', diet_type: 'Vegano' },
  { id: 111, category_type: 'vegetarian', diet_type: 'Vegetariano' },
  { id: 117, category_type: 'vegetarian', diet_type: 'Vegetariano' },
  { id: 118, category_type: 'vegetarian', diet_type: 'Vegetariano' }
];

const imageUpdates = [
  { id: 29, image_url: '/recipes/mexico/mexico_camarones_diabla.png' },
  { id: 53, image_url: '/recipes/spain/churros_chocolate.png' },
  { id: 57, image_url: '/recipes/spain/pescado_frito.png' },
  { id: 59, image_url: '/recipes/spain/jamon_iberico.png' },
  { id: 60, image_url: '/recipes/spain/tarta_santiago.png' },
  { id: 78, image_url: '/recipes/france/soupe_oignon.png' },
  { id: 94, image_url: '/recipes/thailand/mango_sticky_rice.png' },
  { id: 102, image_url: '/recipes/thailand/panang_curry.png' },
  { id: 103, image_url: '/recipes/thailand/thailand_bananas.png' },
  { id: 104, image_url: '/recipes/thailand/khao_soi.png' },
  { id: 118, image_url: '/recipes/greece/gemista.png' },
  { id: 119, image_url: '/recipes/greece/fasolada.png' },
  { id: 120, image_url: '/recipes/greece/revithada.png' }
];

async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });

  const connection = await pool.getConnection();
  try {
    console.log("Starting transaction...");
    await connection.beginTransaction();

    console.log("Applying category and diet type updates...");
    for (const update of categoryAndDietUpdates) {
      await connection.query(
        'UPDATE recipes SET category_type = ?, diet_type = ? WHERE id = ?',
        [update.category_type, update.diet_type, update.id]
      );
      console.log(`  Updated recipe ID ${update.id} -> Category: ${update.category_type}, Diet: ${update.diet_type}`);
    }

    console.log("Applying image updates...");
    for (const update of imageUpdates) {
      await connection.query(
        'UPDATE recipes SET image_url = ? WHERE id = ?',
        [update.image_url, update.id]
      );
      console.log(`  Updated recipe ID ${update.id} -> Image URL: ${update.image_url}`);
    }

    await connection.commit();
    console.log("Transaction successfully committed! Database is updated.");
  } catch (error) {
    console.error("Error encountered, rolling back transaction...", error);
    await connection.rollback();
  } finally {
    connection.release();
    process.exit(0);
  }
}

run();
