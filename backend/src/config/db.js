import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'recetas_admin',
  password: process.env.DB_PASSWORD || process.env.DB_PASS || 'recetas123',
  database: process.env.DB_NAME || 'MisRecetas',
  ssl: process.env.DB_HOST && process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('Pooling connections initialized for MySQL...');

export default pool;
