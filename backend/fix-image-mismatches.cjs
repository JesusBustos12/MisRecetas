const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const mismatchUpdates = [
  { id: 12, image_url: '/recipes/italy/italy_chicken_parm.png' },
  { id: 15, image_url: '/recipes/italy/italy_saltimbocca.png' },
  { id: 24, image_url: '/recipes/mexico/mexico_tostadas.png' },
  { id: 26, image_url: '/recipes/mexico/mexico_sopa_lima.png' },
  { id: 32, image_url: '/recipes/japan/japan_sushi_nigiri.png' },
  { id: 60, image_url: '/recipes/spain/spain_torrijas.png' },
  { id: 70, image_url: '/recipes/usa/usa_hotdog_chicago.png' },
  { id: 72, image_url: '/recipes/usa/usa_cookies.png' },
  { id: 74, image_url: '/recipes/usa/usa_gumbo.png' },
  { id: 90, image_url: '/recipes/france/souffle_fromage.png' },
  { id: 104, image_url: '/recipes/thailand/thailand_noodles.png' },
  { id: 105, image_url: '/recipes/thailand/thailand_fish.png' },
  { id: 118, image_url: '/recipes/greece/greece_horiatiki.png' },
  { id: 119, image_url: '/recipes/greece/greece_fakes.png' }
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
    console.log("Starting transaction to fix image mismatches...");
    await connection.beginTransaction();

    for (const update of mismatchUpdates) {
      await connection.query(
        'UPDATE recipes SET image_url = ? WHERE id = ?',
        [update.image_url, update.id]
      );
      console.log(`  Updated recipe ID ${update.id} -> Image: ${update.image_url}`);
    }

    await connection.commit();
    console.log("Transaction successfully committed! Mismatched images are fixed.");
  } catch (error) {
    console.error("Error during transaction, rolling back...", error);
    await connection.rollback();
  } finally {
    connection.release();
    process.exit(0);
  }
}

run();
