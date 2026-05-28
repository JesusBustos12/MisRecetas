import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// ═══════════════════════════════════════════════════════════════
// BANCO DE NUTRICIÓN REALISTA BASADO EN EL TÍTULO
// Valores aproximados por porción individual.
// ═══════════════════════════════════════════════════════════════

const nutritionByKeyword = {

  // ══════════════ JAPONESAS ══════════════
  omurice:    { calories: "480 kcal", protein: "22g", fat: "18g", carbs: "55g", fiber: "2g", sodium: "820mg" },
  ramen:      { calories: "550 kcal", protein: "28g", fat: "22g", carbs: "58g", fiber: "3g", sodium: "1200mg" },
  sushi:      { calories: "350 kcal", protein: "18g", fat: "8g",  carbs: "52g", fiber: "2g", sodium: "680mg" },
  tonkatsu:   { calories: "620 kcal", protein: "32g", fat: "35g", carbs: "42g", fiber: "2g", sodium: "750mg" },
  teriyaki:   { calories: "410 kcal", protein: "35g", fat: "12g", carbs: "38g", fiber: "1g", sodium: "900mg" },
  tempura:    { calories: "450 kcal", protein: "16g", fat: "25g", carbs: "40g", fiber: "3g", sodium: "520mg" },
  mochi:      { calories: "180 kcal", protein: "3g",  fat: "1g",  carbs: "42g", fiber: "1g", sodium: "15mg" },
  gyoza:      { calories: "320 kcal", protein: "16g", fat: "14g", carbs: "32g", fiber: "2g", sodium: "680mg" },
  yakitori:   { calories: "280 kcal", protein: "26g", fat: "14g", carbs: "12g", fiber: "1g", sodium: "720mg" },
  onigiri:    { calories: "220 kcal", protein: "6g",  fat: "2g",  carbs: "45g", fiber: "1g", sodium: "380mg" },
  udon:       { calories: "420 kcal", protein: "14g", fat: "8g",  carbs: "72g", fiber: "3g", sodium: "950mg" },
  soba:       { calories: "340 kcal", protein: "14g", fat: "3g",  carbs: "68g", fiber: "4g", sodium: "780mg" },
  matcha:     { calories: "250 kcal", protein: "6g",  fat: "10g", carbs: "36g", fiber: "2g", sodium: "45mg" },
  dorayaki:   { calories: "280 kcal", protein: "6g",  fat: "4g",  carbs: "56g", fiber: "2g", sodium: "180mg" },
  katsu:      { calories: "580 kcal", protein: "30g", fat: "28g", carbs: "48g", fiber: "2g", sodium: "820mg" },

  // ══════════════ MEXICANAS ══════════════
  taco:       { calories: "320 kcal", protein: "18g", fat: "16g", carbs: "28g", fiber: "4g", sodium: "480mg" },
  enchilada:  { calories: "420 kcal", protein: "22g", fat: "20g", carbs: "38g", fiber: "5g", sodium: "750mg" },
  mole:       { calories: "520 kcal", protein: "32g", fat: "28g", carbs: "35g", fiber: "4g", sodium: "680mg" },
  guacamole:  { calories: "160 kcal", protein: "2g",  fat: "14g", carbs: "9g",  fiber: "7g", sodium: "200mg" },
  pozole:     { calories: "380 kcal", protein: "24g", fat: "12g", carbs: "42g", fiber: "6g", sodium: "920mg" },
  tamale:     { calories: "350 kcal", protein: "12g", fat: "18g", carbs: "38g", fiber: "3g", sodium: "560mg" },
  ceviche:    { calories: "180 kcal", protein: "22g", fat: "6g",  carbs: "12g", fiber: "3g", sodium: "420mg" },
  churro:     { calories: "380 kcal", protein: "5g",  fat: "22g", carbs: "42g", fiber: "1g", sodium: "280mg" },
  flan:       { calories: "320 kcal", protein: "8g",  fat: "12g", carbs: "46g", fiber: "0g", sodium: "180mg" },
  burrito:    { calories: "520 kcal", protein: "24g", fat: "20g", carbs: "58g", fiber: "8g", sodium: "980mg" },
  quesadilla: { calories: "380 kcal", protein: "18g", fat: "22g", carbs: "28g", fiber: "2g", sodium: "620mg" },
  chilaquil:  { calories: "440 kcal", protein: "18g", fat: "24g", carbs: "38g", fiber: "5g", sodium: "780mg" },
  elote:      { calories: "260 kcal", protein: "6g",  fat: "12g", carbs: "36g", fiber: "4g", sodium: "380mg" },
  chiles:     { calories: "360 kcal", protein: "14g", fat: "18g", carbs: "34g", fiber: "3g", sodium: "650mg" },
  sopa:       { calories: "280 kcal", protein: "12g", fat: "10g", carbs: "35g", fiber: "4g", sodium: "820mg" },

  // ══════════════ ITALIANAS ══════════════
  pizza:      { calories: "580 kcal", protein: "24g", fat: "22g", carbs: "68g", fiber: "3g", sodium: "1100mg" },
  risotto:    { calories: "420 kcal", protein: "12g", fat: "16g", carbs: "58g", fiber: "2g", sodium: "680mg" },
  lasagna:    { calories: "520 kcal", protein: "28g", fat: "24g", carbs: "46g", fiber: "3g", sodium: "850mg" },
  tiramisu:   { calories: "450 kcal", protein: "8g",  fat: "26g", carbs: "48g", fiber: "1g", sodium: "120mg" },
  carbonara:  { calories: "580 kcal", protein: "24g", fat: "28g", carbs: "55g", fiber: "2g", sodium: "780mg" },
  gelato:     { calories: "220 kcal", protein: "4g",  fat: "12g", carbs: "26g", fiber: "0g", sodium: "60mg" },
  panna:      { calories: "340 kcal", protein: "4g",  fat: "28g", carbs: "20g", fiber: "0g", sodium: "45mg" },
  bruschetta: { calories: "180 kcal", protein: "4g",  fat: "8g",  carbs: "24g", fiber: "2g", sodium: "320mg" },
  minestrone: { calories: "220 kcal", protein: "8g",  fat: "6g",  carbs: "35g", fiber: "7g", sodium: "680mg" },
  ossobuco:   { calories: "480 kcal", protein: "38g", fat: "22g", carbs: "28g", fiber: "3g", sodium: "720mg" },
  gnocchi:    { calories: "380 kcal", protein: "10g", fat: "14g", carbs: "55g", fiber: "3g", sodium: "580mg" },
  pesto:      { calories: "520 kcal", protein: "16g", fat: "28g", carbs: "48g", fiber: "3g", sodium: "520mg" },
  ravioli:    { calories: "440 kcal", protein: "18g", fat: "18g", carbs: "50g", fiber: "3g", sodium: "680mg" },
  focaccia:   { calories: "320 kcal", protein: "8g",  fat: "14g", carbs: "42g", fiber: "2g", sodium: "620mg" },

  // ══════════════ CHINAS ══════════════
  "kung pao": { calories: "420 kcal", protein: "30g", fat: "20g", carbs: "32g", fiber: "3g", sodium: "980mg" },
  dumpling:   { calories: "340 kcal", protein: "16g", fat: "14g", carbs: "36g", fiber: "2g", sodium: "720mg" },
  jiaozi:     { calories: "340 kcal", protein: "16g", fat: "14g", carbs: "36g", fiber: "2g", sodium: "720mg" },
  pato:       { calories: "520 kcal", protein: "28g", fat: "32g", carbs: "25g", fiber: "1g", sodium: "850mg" },
  "dim sum":  { calories: "280 kcal", protein: "14g", fat: "12g", carbs: "28g", fiber: "1g", sodium: "650mg" },
  "lo mein":  { calories: "450 kcal", protein: "18g", fat: "16g", carbs: "58g", fiber: "3g", sodium: "920mg" },
  agridulce:  { calories: "480 kcal", protein: "22g", fat: "18g", carbs: "58g", fiber: "2g", sodium: "780mg" },
  "arroz frito": { calories: "420 kcal", protein: "16g", fat: "14g", carbs: "56g", fiber: "2g", sodium: "880mg" },
  rollito:    { calories: "220 kcal", protein: "8g",  fat: "12g", carbs: "22g", fiber: "2g", sodium: "480mg" },
  mapo:       { calories: "320 kcal", protein: "20g", fat: "22g", carbs: "12g", fiber: "2g", sodium: "950mg" },
  berenjena:  { calories: "260 kcal", protein: "6g",  fat: "16g", carbs: "26g", fiber: "5g", sodium: "680mg" },
  wonton:     { calories: "300 kcal", protein: "14g", fat: "12g", carbs: "32g", fiber: "1g", sodium: "750mg" },
  chow:       { calories: "440 kcal", protein: "16g", fat: "18g", carbs: "52g", fiber: "3g", sodium: "900mg" },

  // ══════════════ INDIAS ══════════════
  curry:      { calories: "450 kcal", protein: "28g", fat: "22g", carbs: "35g", fiber: "4g", sodium: "780mg" },
  tikka:      { calories: "480 kcal", protein: "32g", fat: "24g", carbs: "30g", fiber: "3g", sodium: "820mg" },
  masala:     { calories: "480 kcal", protein: "32g", fat: "24g", carbs: "30g", fiber: "3g", sodium: "820mg" },
  naan:       { calories: "260 kcal", protein: "8g",  fat: "6g",  carbs: "44g", fiber: "2g", sodium: "480mg" },
  biryani:    { calories: "520 kcal", protein: "26g", fat: "18g", carbs: "62g", fiber: "3g", sodium: "720mg" },
  samosa:     { calories: "280 kcal", protein: "6g",  fat: "16g", carbs: "30g", fiber: "3g", sodium: "420mg" },
  dal:        { calories: "280 kcal", protein: "16g", fat: "8g",  carbs: "40g", fiber: "12g", sodium: "580mg" },
  tandoori:   { calories: "350 kcal", protein: "34g", fat: "16g", carbs: "14g", fiber: "2g", sodium: "720mg" },
  paneer:     { calories: "380 kcal", protein: "18g", fat: "24g", carbs: "22g", fiber: "3g", sodium: "650mg" },
  chutney:    { calories: "60 kcal",  protein: "1g",  fat: "0g",  carbs: "14g", fiber: "1g", sodium: "180mg" },
  gulab:      { calories: "320 kcal", protein: "4g",  fat: "10g", carbs: "56g", fiber: "1g", sodium: "80mg" },
  ladoo:      { calories: "280 kcal", protein: "5g",  fat: "14g", carbs: "36g", fiber: "2g", sodium: "60mg" },
  korma:      { calories: "460 kcal", protein: "28g", fat: "28g", carbs: "22g", fiber: "3g", sodium: "680mg" },
  vindaloo:   { calories: "420 kcal", protein: "30g", fat: "20g", carbs: "28g", fiber: "4g", sodium: "850mg" },

  // ══════════════ TAILANDESAS ══════════════
  "pad thai": { calories: "420 kcal", protein: "18g", fat: "16g", carbs: "52g", fiber: "3g", sodium: "880mg" },
  "tom yum":  { calories: "180 kcal", protein: "20g", fat: "6g",  carbs: "14g", fiber: "2g", sodium: "1050mg" },
  "tom kha":  { calories: "320 kcal", protein: "18g", fat: "22g", carbs: "14g", fiber: "1g", sodium: "880mg" },
  "mango sticky": { calories: "380 kcal", protein: "5g", fat: "14g", carbs: "62g", fiber: "2g", sodium: "120mg" },
  "green curry": { calories: "420 kcal", protein: "24g", fat: "28g", carbs: "18g", fiber: "3g", sodium: "920mg" },
  "red curry":   { calories: "440 kcal", protein: "26g", fat: "26g", carbs: "22g", fiber: "3g", sodium: "950mg" },
  satay:      { calories: "350 kcal", protein: "28g", fat: "20g", carbs: "16g", fiber: "1g", sodium: "780mg" },
  "som tam":  { calories: "120 kcal", protein: "4g",  fat: "2g",  carbs: "24g", fiber: "4g", sodium: "680mg" },
  larb:       { calories: "240 kcal", protein: "22g", fat: "14g", carbs: "8g",  fiber: "2g", sodium: "820mg" },

  // ══════════════ ESPAÑOLAS ══════════════
  paella:     { calories: "480 kcal", protein: "26g", fat: "14g", carbs: "62g", fiber: "3g", sodium: "820mg" },
  tortilla:   { calories: "320 kcal", protein: "14g", fat: "20g", carbs: "22g", fiber: "2g", sodium: "380mg" },
  gazpacho:   { calories: "120 kcal", protein: "2g",  fat: "8g",  carbs: "12g", fiber: "2g", sodium: "420mg" },
  croqueta:   { calories: "280 kcal", protein: "12g", fat: "18g", carbs: "18g", fiber: "1g", sodium: "520mg" },
  "jamon":    { calories: "240 kcal", protein: "32g", fat: "12g", carbs: "0g",  fiber: "0g", sodium: "1250mg" },
  chorizo:    { calories: "380 kcal", protein: "18g", fat: "32g", carbs: "2g",  fiber: "0g", sodium: "980mg" },
  fabada:     { calories: "520 kcal", protein: "28g", fat: "24g", carbs: "48g", fiber: "12g", sodium: "880mg" },
  patatas:    { calories: "320 kcal", protein: "4g",  fat: "18g", carbs: "38g", fiber: "3g", sodium: "420mg" },
  pimiento:   { calories: "180 kcal", protein: "4g",  fat: "12g", carbs: "16g", fiber: "3g", sodium: "280mg" },

  // ══════════════ FRANCESAS ══════════════
  croissant:  { calories: "350 kcal", protein: "6g",  fat: "20g", carbs: "38g", fiber: "1g", sodium: "320mg" },
  crepe:      { calories: "280 kcal", protein: "8g",  fat: "12g", carbs: "36g", fiber: "1g", sodium: "220mg" },
  quiche:     { calories: "380 kcal", protein: "16g", fat: "26g", carbs: "22g", fiber: "1g", sodium: "520mg" },
  macaron:    { calories: "180 kcal", protein: "3g",  fat: "8g",  carbs: "26g", fiber: "1g", sodium: "40mg" },
  souffle:    { calories: "320 kcal", protein: "8g",  fat: "20g", carbs: "30g", fiber: "2g", sodium: "120mg" },
  ratatouille:{ calories: "180 kcal", protein: "4g",  fat: "10g", carbs: "22g", fiber: "6g", sodium: "320mg" },
  bouillabaisse:{ calories: "380 kcal", protein: "32g", fat: "14g", carbs: "24g", fiber: "3g", sodium: "920mg" },
  "coq au vin":{ calories: "480 kcal", protein: "34g", fat: "24g", carbs: "18g", fiber: "2g", sodium: "680mg" },
  eclair:     { calories: "280 kcal", protein: "5g",  fat: "16g", carbs: "30g", fiber: "1g", sodium: "180mg" },
  baguette:   { calories: "260 kcal", protein: "8g",  fat: "2g",  carbs: "52g", fiber: "2g", sodium: "580mg" },
  pissaladiere:{ calories: "320 kcal", protein: "8g", fat: "16g", carbs: "36g", fiber: "3g", sodium: "720mg" },

  // ══════════════ AMERICANAS (USA) ══════════════
  burger:     { calories: "650 kcal", protein: "35g", fat: "38g", carbs: "42g", fiber: "2g", sodium: "980mg" },
  hamburguesa:{ calories: "650 kcal", protein: "35g", fat: "38g", carbs: "42g", fiber: "2g", sodium: "980mg" },
  "mac and cheese": { calories: "520 kcal", protein: "20g", fat: "28g", carbs: "48g", fiber: "2g", sodium: "820mg" },
  pancake:    { calories: "350 kcal", protein: "8g",  fat: "12g", carbs: "52g", fiber: "1g", sodium: "480mg" },
  brownie:    { calories: "380 kcal", protein: "5g",  fat: "22g", carbs: "44g", fiber: "2g", sodium: "180mg" },
  "hot dog":  { calories: "320 kcal", protein: "12g", fat: "20g", carbs: "24g", fiber: "1g", sodium: "820mg" },
  cheesecake: { calories: "420 kcal", protein: "7g",  fat: "28g", carbs: "38g", fiber: "1g", sodium: "280mg" },
  "apple pie":{ calories: "380 kcal", protein: "4g",  fat: "18g", carbs: "52g", fiber: "3g", sodium: "320mg" },
  bbq:        { calories: "520 kcal", protein: "36g", fat: "28g", carbs: "32g", fiber: "1g", sodium: "1080mg" },
  costilla:   { calories: "580 kcal", protein: "38g", fat: "38g", carbs: "22g", fiber: "1g", sodium: "920mg" },
  "fried chicken": { calories: "480 kcal", protein: "28g", fat: "28g", carbs: "28g", fiber: "1g", sodium: "880mg" },
  waffle:     { calories: "380 kcal", protein: "8g",  fat: "16g", carbs: "52g", fiber: "1g", sodium: "520mg" },
  cookie:     { calories: "220 kcal", protein: "3g",  fat: "12g", carbs: "28g", fiber: "1g", sodium: "180mg" },

  // ══════════════ GRIEGAS ══════════════
  moussaka:   { calories: "450 kcal", protein: "22g", fat: "28g", carbs: "28g", fiber: "5g", sodium: "680mg" },
  gyros:      { calories: "480 kcal", protein: "28g", fat: "22g", carbs: "42g", fiber: "3g", sodium: "820mg" },
  baklava:    { calories: "420 kcal", protein: "6g",  fat: "24g", carbs: "48g", fiber: "2g", sodium: "180mg" },
  souvlaki:   { calories: "350 kcal", protein: "30g", fat: "16g", carbs: "22g", fiber: "2g", sodium: "620mg" },
  spanakopita:{ calories: "320 kcal", protein: "12g", fat: "20g", carbs: "24g", fiber: "3g", sodium: "520mg" },
  tzatziki:   { calories: "80 kcal",  protein: "4g",  fat: "5g",  carbs: "6g",  fiber: "1g", sodium: "220mg" },
  dolma:      { calories: "240 kcal", protein: "6g",  fat: "12g", carbs: "30g", fiber: "3g", sodium: "480mg" },
  feta:       { calories: "280 kcal", protein: "14g", fat: "20g", carbs: "8g",  fiber: "2g", sodium: "620mg" },
};

// Fallbacks genéricos por tipo de comida
const genericNutrition = {
  meat:       { calories: "450 kcal", protein: "30g", fat: "22g", carbs: "28g", fiber: "2g", sodium: "680mg" },
  seafood:    { calories: "320 kcal", protein: "26g", fat: "12g", carbs: "22g", fiber: "2g", sodium: "580mg" },
  vegetarian: { calories: "280 kcal", protein: "12g", fat: "10g", carbs: "38g", fiber: "6g", sodium: "420mg" },
  desserts:   { calories: "350 kcal", protein: "5g",  fat: "16g", carbs: "48g", fiber: "1g", sodium: "180mg" },
};

function getNutritionBasedOnTitle(titleStr, categoryType) {
  const title = String(titleStr || '').toLowerCase();

  // Buscar keywords en orden de especificidad
  const keywordOrder = [
    "kung pao", "pad thai", "tom yum", "tom kha", "mango sticky",
    "mac and cheese", "dim sum", "lo mein", "arroz frito",
    "green curry", "red curry", "hot dog", "apple pie", "fried chicken",
    "coq au vin",
    "omurice", "ramen", "sushi", "tonkatsu", "teriyaki", "tempura", "mochi",
    "gyoza", "yakitori", "onigiri", "udon", "soba", "matcha", "dorayaki", "katsu",
    "taco", "enchilada", "mole", "guacamole", "pozole", "tamale", "ceviche",
    "churro", "flan", "burrito", "quesadilla", "chilaquil", "elote", "chiles", "sopa",
    "pizza", "risotto", "lasagna", "tiramisu", "carbonara", "gelato", "panna",
    "bruschetta", "minestrone", "ossobuco", "gnocchi", "pesto", "ravioli", "focaccia",
    "dumpling", "jiaozi", "pato", "agridulce", "rollito", "mapo", "berenjena", "wonton", "chow",
    "curry", "tikka", "masala", "naan", "biryani", "samosa", "dal",
    "tandoori", "paneer", "chutney", "gulab", "ladoo", "korma", "vindaloo",
    "satay", "som tam", "larb",
    "paella", "tortilla", "gazpacho", "croqueta", "jamon", "chorizo", "fabada", "patatas", "pimiento",
    "croissant", "crepe", "quiche", "macaron", "souffle", "ratatouille",
    "bouillabaisse", "eclair", "baguette", "pissaladiere",
    "burger", "hamburguesa", "pancake", "brownie", "cheesecake", "bbq",
    "costilla", "waffle", "cookie",
    "moussaka", "gyros", "baklava", "souvlaki", "spanakopita", "tzatziki", "dolma", "feta"
  ];

  for (const keyword of keywordOrder) {
    if (title.includes(keyword)) {
      return nutritionByKeyword[keyword];
    }
  }

  // Fallback por tipo
  let typeKey = (categoryType || 'vegetarian').toLowerCase();
  if (typeKey === 'dessert') typeKey = 'desserts';
  return genericNutrition[typeKey] || genericNutrition.vegetarian;
}

async function updateNutritionIntelligently() {
  console.log('🔌 Conectando a TiDB Cloud...');
  const remotePool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });

  let remoteConn;
  try {
    remoteConn = await remotePool.getConnection();
    const [recipes] = await remoteConn.query(
      "SELECT id, title, category_type FROM recipes"
    );
    console.log(`📊 Analizando los títulos de ${recipes.length} recetas para asignar nutrición precisa...`);

    let updated = 0;
    let matched = 0;
    for (const r of recipes) {
      let titleStr = "";
      if (typeof r.title === 'string') {
        if (r.title.startsWith('{')) {
          try {
            const tObj = JSON.parse(r.title);
            titleStr = (tObj.en || tObj.es || '').toLowerCase();
          } catch(e) { titleStr = r.title; }
        } else {
          titleStr = r.title;
        }
      } else if (r.title && typeof r.title === 'object') {
        titleStr = (r.title.en || r.title.es || '').toLowerCase();
      }

      const nutritionData = getNutritionBasedOnTitle(titleStr, r.category_type);
      
      // Verificar si se encontró un match específico
      const isGeneric = Object.values(genericNutrition).includes(nutritionData);
      if (!isGeneric) matched++;

      const nutritionJson = JSON.stringify(nutritionData);
      await remoteConn.query('UPDATE recipes SET nutrition = ? WHERE id = ?', [nutritionJson, r.id]);
      
      updated++;
    }

    console.log(`✅ ¡Éxito! Se actualizó la nutrición de ${updated} recetas.`);
    console.log(`   📌 ${matched} recetas con nutrición específica por título.`);
    console.log(`   📌 ${updated - matched} recetas con nutrición genérica por tipo de comida.`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (remoteConn) remoteConn.release();
    remotePool.end();
  }
}

updateNutritionIntelligently();
