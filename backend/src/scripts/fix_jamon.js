import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function fixJamon() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME, ssl: { rejectUnauthorized: false }
  });
  const conn = await pool.getConnection();
  
  // ID 104: Cambiar de "Croquetas de Jamón" a "Jamón Ibérico" (tabla/plato de jamón)
  const title = JSON.stringify({ es: 'Jamón Ibérico', en: 'Iberian Ham' });
  const description = JSON.stringify({
    es: 'Jamón ibérico de bellota cortado a mano en láminas finas y translúcidas, servido en tabla con picos de pan, aceite de oliva y tomate. El rey de la charcutería española.',
    en: 'Acorn-fed Iberian ham hand-carved into thin, translucent slices, served on a board with breadsticks, olive oil and tomato. The king of Spanish charcuterie.'
  });
  const ingredients = JSON.stringify([
    { es: '1 pieza de jamón ibérico de bellota (o 200g cortado a mano)', en: '1 piece of acorn-fed Iberian ham (or 200g hand-carved)' },
    { es: 'Picos o pan crujiente para acompañar', en: 'Breadsticks or crusty bread for serving' },
    { es: 'Aceite de oliva virgen extra', en: 'Extra virgin olive oil' },
    { es: 'Tomates maduros rallados (pa amb tomàquet)', en: 'Grated ripe tomatoes (pa amb tomàquet)' },
    { es: 'Aceitunas manzanilla (opcional)', en: 'Manzanilla olives (optional)' },
    { es: 'Queso manchego curado (opcional)', en: 'Aged Manchego cheese (optional)' },
  ]);
  const steps = JSON.stringify([
    { es: 'Saca el jamón del refrigerador 30 minutos antes para que alcance temperatura ambiente. El frío anestesia el sabor — a temperatura ambiente se potencian los aromas.', en: 'Take the ham out of the refrigerator 30 minutes before so it reaches room temperature. Cold numbs the flavor — at room temp the aromas are enhanced.' },
    { es: 'Si cortas de la pieza: usa un cuchillo jamonero largo y flexible. Corta láminas ultrafinas y casi translúcidas, siempre en la misma dirección, incluyendo algo de grasa infiltrada.', en: 'If carving from the leg: use a long flexible ham knife. Cut ultra-thin, nearly translucent slices, always in the same direction, including some marbled fat.' },
    { es: 'Distribuye las láminas en un plato grande sin amontonar — cada lámina debe respirar. La grasa comenzará a brillar a temperatura ambiente.', en: 'Arrange slices on a large plate without stacking — each slice should breathe. The fat will begin to glisten at room temperature.' },
    { es: 'Sirve con picos de pan, aceite de oliva, tomate rallado y queso manchego si deseas. El jamón ibérico se come solo o con acompañamientos simples que no enmascaren su sabor.', en: 'Serve with breadsticks, olive oil, grated tomato and Manchego cheese if desired. Iberian ham is eaten alone or with simple accompaniments that don\'t mask its flavor.' },
  ]);
  const nutrition = JSON.stringify({ calories: 250, protein: 31, carbs: 1, fat: 14, fiber: 0, sugar: 0 });

  await conn.query(
    'UPDATE recipes SET title = ?, description = ?, ingredients = ?, steps = ?, nutrition = ? WHERE id = 104',
    [title, description, ingredients, steps, nutrition]
  );
  
  console.log('✅ ID 104: "Croquetas de Jamón" → "Jamón Ibérico"');
  console.log('   Imagen: jamon_iberico.png (sin cambio)');
  console.log('   Título, descripción, ingredientes, pasos y nutrición actualizados');
  
  conn.release(); pool.end();
}
fixJamon();
