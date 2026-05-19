const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

// Cargar variables de entorno del archivo .env local en backend/
dotenv.config({ path: path.join(__dirname, '.env') });

async function run() {
  console.log('🚀 Iniciando inicialización de la base de datos en la nube TiDB...');
  console.log(`Host: ${process.env.DB_HOST}`);
  console.log(`Usuario: ${process.env.DB_USER}`);
  console.log(`Base de datos: ${process.env.DB_NAME || 'MisRecetas'}`);

  const dbName = process.env.DB_NAME || 'MisRecetas';

  // 1. Conexión inicial sin base de datos específica para asegurar su creación
  let initialConnection;
  try {
    initialConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || process.env.DB_PASS || '',
      ssl: process.env.DB_HOST && process.env.DB_HOST !== 'localhost'
        ? { rejectUnauthorized: false }
        : undefined
    });

    console.log('📡 Conexión temporal establecida con el servidor TiDB Cloud.');
    await initialConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbName};`);
    console.log(`✅ Base de datos "${dbName}" asegurada.`);
  } catch (error) {
    console.error('❌ Error asegurando la base de datos:', error.message);
    process.exit(1);
  } finally {
    if (initialConnection) await initialConnection.end();
  }

  // 2. Conexión principal utilizando un pool local para ejecutar el esquema de tablas y datos
  let pool;
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || process.env.DB_PASS || '',
      database: dbName,
      ssl: process.env.DB_HOST && process.env.DB_HOST !== 'localhost'
        ? { rejectUnauthorized: false }
        : undefined,
      connectionLimit: 5,
      waitForConnections: true,
      queueLimit: 0
    });

    // Leer el archivo setup_mysql.sql ubicado en scratch/
    const sqlPath = path.join(__dirname, '../scratch/setup_mysql.sql');
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`No se encontró el archivo SQL en: ${sqlPath}`);
    }

    console.log('📖 Leyendo el archivo SQL de inicialización...');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Separar consultas por punto y coma
    const rawQueries = sqlContent.split(';');
    const queriesToExecute = [];

    for (let query of rawQueries) {
      let cleaned = query
        .split('\n')
        // Eliminar comentarios de línea de SQL
        .filter(line => !line.trim().startsWith('--') && !line.trim().startsWith('#'))
        .join('\n')
        .trim();

      if (!cleaned) continue;

      // Filtrar comandos incompatibles o redundantes en la nube
      const upperCleaned = cleaned.toUpperCase();
      const isForbidden = 
        upperCleaned.startsWith('CREATE USER') ||
        upperCleaned.startsWith('GRANT') ||
        upperCleaned.startsWith('FLUSH') ||
        upperCleaned.startsWith('CREATE DATABASE') ||
        upperCleaned.startsWith('USE ');

      if (isForbidden) {
        console.log(`🔍 Saltando consulta redundante o no compatible con la nube: ${cleaned.substring(0, 50)}...`);
        continue;
      }

      queriesToExecute.push(cleaned);
    }

    console.log(`📦 Encontradas ${queriesToExecute.length} consultas compatibles para ejecutar.`);

    for (let i = 0; i < queriesToExecute.length; i++) {
      const q = queriesToExecute[i];
      console.log(`⚙️ Ejecutando consulta ${i + 1}/${queriesToExecute.length}...`);
      await pool.query(q);
    }

    console.log('🎉 ¡Base de datos inicializada correctamente en la nube con todas sus tablas y registros!');
  } catch (error) {
    console.error('❌ Error ejecutando las consultas del esquema:', error.message);
  } finally {
    if (pool) {
      await pool.end();
      console.log('🔌 Conexión cerrada.');
    }
    process.exit(0);
  }
}

run();
