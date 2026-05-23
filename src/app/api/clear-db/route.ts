import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');

  // Validar parámetro de seguridad para evitar vaciados accidentales o maliciosos
  if (secret !== 'mR3c3t4s_S3cr3t_K3y_2026_pr0d_x7!q9zW') {
    return NextResponse.json({ error: 'Acceso denegado: Token de seguridad incorrecto' }, { status: 403 });
  }

  const dbHost = process.env.DB_HOST;
  const dbName = process.env.DB_NAME || 'MisRecetas';

  console.log('📡 [API TEMP] Iniciando vaciado de base de datos desde endpoint de Next.js...');
  
  if (!dbHost) {
    return NextResponse.json({ error: 'DB_HOST no configurado en variables de entorno' }, { status: 500 });
  }

  let conn;
  try {
    conn = await mysql.createConnection({
      host: dbHost,
      port: parseInt(process.env.DB_PORT || '4000', 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || process.env.DB_PASS,
      database: dbName,
      ssl: dbHost && dbHost !== 'localhost'
        ? { rejectUnauthorized: false }
        : undefined
    });

    console.log('✅ [API TEMP] Conectado a TiDB Cloud. Ejecutando vaciado...');

    // Desactivar temporalmente claves foráneas
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // TRUNCATE de las tablas
    await conn.query('TRUNCATE TABLE comments');
    await conn.query('TRUNCATE TABLE favorites');
    await conn.query('TRUNCATE TABLE recipes');
    await conn.query('TRUNCATE TABLE users');

    // Reactivar claves foráneas
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('🎉 [API TEMP] ¡Base de datos vaciada con éxito!');

    return NextResponse.json({ 
      success: true, 
      message: 'Base de datos en TiDB Cloud vaciada correctamente (Truncate completado). Contadores reiniciados a 1.' 
    });

  } catch (error: any) {
    console.error('❌ [API TEMP] Error durante el vaciado:', error);
    return NextResponse.json({ error: error.message || 'Error en el servidor de base de datos' }, { status: 500 });
  } finally {
    if (conn) {
      await conn.end();
    }
  }
}
