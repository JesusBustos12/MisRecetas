import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// Recetas que deben ser "meat" (tienen carne terrestre)
const meatIds = [
  17,   // Okonomiyaki - panceta de cerdo
  156,  // Satay de Pollo
  164,  // Pollo con Anacardos
  178,  // Youvetsi de Ternera
];

// Recetas que deben ser "seafood" (tienen pescado/marisco)
const seafoodIds = [
  20,   // Takoyaki - pulpo
  30,   // Unagi Don - anguila
  49,   // Aguachile Verde - camarones
  73,   // New England Clam Bake - almejas, langosta
  105,  // Gambas al Ajillo - gambas
  113,  // Bacalao al Pil-Pil - bacalao
  116,  // Arroz Negro - calamares
  117,  // Calamares a la Romana - calamares
  124,  // Bouillabaisse - pescados y mariscos
  132,  // Coquilles Saint-Jacques - vieiras
  158,  // Khao Pad - camarones
  163,  // Pla Goong - camarones
  181,  // Camarones a la Diabla - camarones
  218,  // Clam Chowder - almejas
];

// Recetas que deben ser "dessert"
const dessertIds = [
  34,   // Dorayaki
  45,   // Arroz con Leche
  47,   // Pan de Muerto
  81,   // Cannoli
  94,   // Panettone
  95,   // Panna Cotta
  108,  // Crema Catalana
  129,  // Crème Brûlée
  134,  // Tarte Tatin
  136,  // Crêpes Suzette
  143,  // Gulab Jamun
  173,  // Galaktoboureko
  200,  // Affogato
  201,  // Biscotti
  205,  // Sfogliatella
  209,  // Zabaione
  210,  // Zeppole
];

// Recetas que deben ser "vegetarian" (ya lo son, pero confirmemos)
const vegetarianIds = [
  58,   // Mac & Cheese (sin carne)
  79,   // Gnocchi al Pesto
  82,   // Focaccia
  85,   // Arancini (con ragú pero lo dejamos vegetarian si así estaba)
  86,   // Bruschetta
  87,   // Cacio e Pepe
  89,   // Ensalada Griega
  91,   // Fettuccine Alfredo
  92,   // Melanzane Parmigiana
  93,   // Minestrone
  100,  // Tortilla de Patatas
  103,  // Patatas Bravas
  114,  // Escalivada
  115,  // Pimientos de Padrón
  118,  // Salmorejo
  119,  // Ratatouille
  144,  // Mango Lassi
  148,  // Dal Makhani
  149,  // Aloo Gobi
  154,  // Som Tum
  169,  // Spanakopita
  170,  // Dolmades
  171,  // Tzatziki
  175,  // Saganaki
  176,  // Gemista
  177,  // Fasolada
  194,  // Ravioli de Ricota
  202,  // Caprese
  203,  // Panzanella
];

async function fixCategories() {
  console.log('🏷️  Corrigiendo category_type...\n');
  const pool = mysql.createPool({
    host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME, ssl: { rejectUnauthorized: false }
  });
  const conn = await pool.getConnection();

  let fixed = 0;

  // Fix meat
  if (meatIds.length) {
    const [result] = await conn.query(`UPDATE recipes SET category_type = 'meat' WHERE id IN (${meatIds.join(',')})`);
    console.log(`🥩 meat: ${result.affectedRows} recetas actualizadas (IDs: ${meatIds.join(', ')})`);
    fixed += result.affectedRows;
  }

  // Fix seafood
  if (seafoodIds.length) {
    const [result] = await conn.query(`UPDATE recipes SET category_type = 'seafood' WHERE id IN (${seafoodIds.join(',')})`);
    console.log(`🐟 seafood: ${result.affectedRows} recetas actualizadas (IDs: ${seafoodIds.join(', ')})`);
    fixed += result.affectedRows;
  }

  // Fix dessert
  if (dessertIds.length) {
    const [result] = await conn.query(`UPDATE recipes SET category_type = 'dessert' WHERE id IN (${dessertIds.join(',')})`);
    console.log(`🍰 dessert: ${result.affectedRows} recetas actualizadas (IDs: ${dessertIds.join(', ')})`);
    fixed += result.affectedRows;
  }

  // Verify vegetarian (just count, don't change)
  const [vegRows] = await conn.query(`SELECT COUNT(*) as c FROM recipes WHERE id IN (${vegetarianIds.join(',')}) AND category_type = 'vegetarian'`);
  console.log(`🥬 vegetarian: ${vegRows[0].c}/${vegetarianIds.length} ya están correctas`);

  console.log(`\n✅ Total: ${fixed} category_type corregidos`);

  // Verify final count - check ALL 64 IDs
  const allIds = [...meatIds, ...seafoodIds, ...dessertIds, ...vegetarianIds];
  const [verify] = await conn.query(`SELECT category_type, COUNT(*) as c FROM recipes WHERE id IN (${allIds.join(',')}) GROUP BY category_type`);
  console.log('\n📊 Distribución final:');
  for (const v of verify) {
    console.log(`   ${v.category_type}: ${v.c}`);
  }

  conn.release(); pool.end();
}
fixCategories();
