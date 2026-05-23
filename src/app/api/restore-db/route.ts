import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const formatDate = (isoString: string) => {
  if (!isoString) return null;
  return isoString.replace('T', ' ').replace('Z', '').split('.')[0];
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');

  // Validar parámetro de seguridad
  if (secret !== 'mR3c3t4s_S3cr3t_K3y_2026_pr0d_x7!q9zW') {
    return NextResponse.json({ error: 'Acceso denegado: Token de seguridad incorrecto' }, { status: 403 });
  }

  const dbHost = process.env.DB_HOST;
  const dbName = process.env.DB_NAME || 'MisRecetas';

  console.log('📡 [API MIGRACION] Iniciando restauración masiva de base de datos desde Next.js...');
  
  if (!dbHost) {
    return NextResponse.json({ error: 'DB_HOST no configurado en variables de entorno' }, { status: 500 });
  }

  // Cargar el archivo de respaldo local
  const backupPath = path.join(process.cwd(), 'Recetas/BACKUP_SISTEMA_TOTAL.json');
  if (!fs.existsSync(backupPath)) {
    return NextResponse.json({ 
      error: 'No se encontró el archivo Recetas/BACKUP_SISTEMA_TOTAL.json en el servidor.' 
    }, { status: 400 });
  }

  const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
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

    console.log('✅ [API MIGRACION] Conectado a TiDB Cloud. Iniciando purga y restauración...');

    // 1. Limpieza Total (Truncate/Delete) para evitar duplicaciones
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");
    await conn.query("TRUNCATE TABLE comments");
    await conn.query("TRUNCATE TABLE favorites");
    await conn.query("TRUNCATE TABLE recipes");
    await conn.query("TRUNCATE TABLE users");
    await conn.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log('✅ [API MIGRACION] Tablas vaciadas y contadores reiniciados.');

    // 2. Restaurar Usuarios
    console.log(`👥 [API MIGRACION] Restaurando ${backup.users.length} usuarios...`);
    for (const u of backup.users) {
      await conn.query(
        "INSERT INTO users (id, full_name, email, password, avatar_url, created_at) VALUES (?, ?, ?, ?, ?, ?)", 
        [u.id, u.full_name, u.email, u.password || '123456', u.avatar_url, formatDate(u.created_at)]
      );
    }

    // 3. Restaurar Recetas
    console.log(`🍳 [API MIGRACION] Restaurando ${backup.recipes.length} recetas...`);
    for (const r of backup.recipes) {
      await conn.query(
        `INSERT INTO recipes 
        (id, user_id, title, description, category_country, diet_type, prep_time, cook_time, servings, image_url, ingredients, steps, nutrition, category_type, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          r.id, 
          r.user_id, 
          JSON.stringify(r.title), 
          JSON.stringify(r.description), 
          r.category_country, 
          r.diet_type, 
          r.prep_time || 30, 
          r.cook_time || 20, 
          r.servings || 4, 
          r.image_url, 
          JSON.stringify(r.ingredients), 
          JSON.stringify(r.steps), 
          r.nutrition ? JSON.stringify(r.nutrition) : null, 
          r.category_type, 
          formatDate(r.created_at)
        ]
      );
    }

    // 4. Restaurar Comentarios
    console.log(`💬 [API MIGRACION] Restaurando ${backup.comments ? backup.comments.length : 0} comentarios...`);
    if (backup.comments && backup.comments.length > 0) {
      for (const c of backup.comments) {
        await conn.query(
          "INSERT INTO comments (id, recipe_id, user_id, content, rating, created_at) VALUES (?, ?, ?, ?, ?, ?)",
          [c.id, c.recipe_id, c.user_id, c.content || c.comment_text || '', c.rating || 5, formatDate(c.created_at)]
        );
      }
    }

    console.log('🎉 [API MIGRACION] ¡Restauración masiva completada con éxito!');

    return NextResponse.json({ 
      success: true, 
      message: `¡Migración completada con éxito! Se restauraron ${backup.users.length} usuarios, ${backup.recipes.length} recetas y ${backup.comments ? backup.comments.length : 0} comentarios en TiDB Cloud. Contadores limpios e iniciados.`
    });

  } catch (error: any) {
    console.error('❌ [API MIGRACION] Error durante la migración:', error);
    return NextResponse.json({ error: error.message || 'Error en el servidor de base de datos' }, { status: 500 });
  } finally {
    if (conn) {
      await conn.end();
    }
  }
}
