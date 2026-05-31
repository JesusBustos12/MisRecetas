import pool from '../config/db.js';

async function testQuery() {
  try {
    console.log('Testing query...');
    await pool.query("SELECT LOWER(CAST(ingredients AS CHAR)) FROM recipes LIMIT 1");
    console.log('Query success!');
  } catch (e) {
    console.error('Query failed:', e.message);
  } finally {
    process.exit(0);
  }
}

testQuery();
