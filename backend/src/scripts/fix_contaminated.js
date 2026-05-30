import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// ═══════════════════════════════════════════════════════════════
// CORRECCIÓN QUIRÚRGICA DE INGREDIENTES CONTAMINADOS
// Solo toca las recetas que DEBEN ser vegetarianas pero tienen
// palabras de carne/marisco en sus ingredientes.
// Recetas legítimamente de carne (Mole, Pozole, Carbonara, etc.)
// se DEJAN intactas.
// ═══════════════════════════════════════════════════════════════

const fixes = {
  // ID 2: Mapo Tofu → Plato con cerdo molido real. Ingredientes CORRECTOS. Debe estar en Carnes.
  // NO TOCAR.

  // ID 44: Guacamole → ¡¡Tiene ingredientes de MOLE (pollo)!! Error grave del script.
  44: {
    es: [
      "3 aguacates maduros tipo Hass",
      "1 tomate mediano, picado en cubitos",
      "¼ de cebolla blanca, picada finamente",
      "1-2 chiles serranos o jalapeños, picados",
      "Jugo de 2 limones verdes",
      "¼ de taza de cilantro fresco, picado",
      "Sal al gusto",
      "Totopos de maíz para acompañar"
    ],
    en: [
      "3 ripe Hass avocados",
      "1 medium tomato, diced",
      "¼ white onion, finely chopped",
      "1-2 serrano or jalapeño peppers, chopped",
      "Juice of 2 limes",
      "¼ cup fresh cilantro, chopped",
      "Salt to taste",
      "Corn tortilla chips for serving"
    ]
  },

  // ID 76: Pizza Margherita → Vegetariana. Tiene "pepperoni" contaminando.
  76: {
    es: [
      "500g de harina 00 o de fuerza",
      "7g de levadura seca activa",
      "1 cucharadita de sal",
      "1 cucharadita de azúcar",
      "300ml de agua tibia",
      "2 cucharadas de aceite de oliva",
      "400g de tomates San Marzano triturados",
      "250g de mozzarella fresca di bufala",
      "Hojas de albahaca fresca",
      "Aceite de oliva extra virgen para rociar"
    ],
    en: [
      "500g 00 or bread flour",
      "7g active dry yeast",
      "1 teaspoon salt",
      "1 teaspoon sugar",
      "300ml warm water",
      "2 tablespoons olive oil",
      "400g crushed San Marzano tomatoes",
      "250g fresh buffalo mozzarella",
      "Fresh basil leaves",
      "Extra virgin olive oil for drizzling"
    ]
  },

  // ID 77: Risotto Porcini → Vegetariano. Cambiar "caldo de pollo" por "caldo vegetal".
  77: {
    es: [
      "300g de arroz arborio o carnaroli",
      "1 litro de caldo vegetal caliente",
      "30g de hongos porcini deshidratados",
      "200g de champiñones frescos, laminados",
      "1 cebolla pequeña, picada finamente",
      "½ taza de vino blanco seco",
      "50g de mantequilla",
      "50g de queso parmesano rallado",
      "2 cucharadas de aceite de oliva",
      "Perejil fresco y pimienta negra"
    ],
    en: [
      "300g arborio or carnaroli rice",
      "1 liter hot vegetable broth",
      "30g dried porcini mushrooms",
      "200g fresh mushrooms, sliced",
      "1 small onion, finely chopped",
      "½ cup dry white wine",
      "50g butter",
      "50g grated Parmesan cheese",
      "2 tablespoons olive oil",
      "Fresh parsley and black pepper"
    ]
  },

  // ID 147: Chana Masala → 100% garbanzos. Sin carne.
  147: {
    es: [
      "400g de garbanzos cocidos (2 latas, escurridas)",
      "1 lata (400ml) de tomates triturados",
      "2 cebollas grandes, picadas finamente",
      "4 dientes de ajo, machacados",
      "1 trozo de jengibre (4cm), rallado",
      "2 cucharaditas de garam masala",
      "1 cucharadita de cúrcuma",
      "1 cucharadita de comino en polvo",
      "1 cucharadita de chile en polvo (al gusto)",
      "3 cucharadas de ghee o aceite vegetal",
      "Cilantro fresco para decorar",
      "Arroz basmati para acompañar"
    ],
    en: [
      "400g cooked chickpeas (2 cans, drained)",
      "1 can (400ml) crushed tomatoes",
      "2 large onions, finely chopped",
      "4 garlic cloves, crushed",
      "1 piece ginger (4cm), grated",
      "2 teaspoons garam masala",
      "1 teaspoon turmeric",
      "1 teaspoon ground cumin",
      "1 teaspoon chili powder (to taste)",
      "3 tablespoons ghee or vegetable oil",
      "Fresh cilantro for garnish",
      "Basmati rice for serving"
    ]
  },

  // ID 150: Pad Thai → versión con tofu (vegetariana)
  150: {
    es: [
      "200g de fideos de arroz planos (pad thai noodles)",
      "200g de tofu firme, en cubos",
      "2 huevos",
      "1 taza de brotes de soya",
      "3 cucharadas de salsa de tamarindo",
      "2 cucharadas de salsa de soya",
      "1 cucharada de azúcar de palma",
      "½ taza de cacahuates tostados, triturados",
      "2 cebollines, picados",
      "Limón y chile en hojuelas para servir"
    ],
    en: [
      "200g flat rice noodles (pad thai noodles)",
      "200g firm tofu, cubed",
      "2 eggs",
      "1 cup bean sprouts",
      "3 tablespoons tamarind sauce",
      "2 tablespoons soy sauce",
      "1 tablespoon palm sugar",
      "½ cup roasted peanuts, crushed",
      "2 scallions, chopped",
      "Lime and chili flakes for serving"
    ]
  },

  // ID 151: Curry Verde Tailandés → versión vegetariana con tofu y vegetales
  151: {
    es: [
      "200g de tofu firme, en cubos",
      "1 lata (400ml) de leche de coco",
      "3 cucharadas de pasta de curry verde",
      "1 berenjena tailandesa, en rodajas",
      "100g de ejotes, cortados",
      "1 pimiento rojo, en tiras",
      "5 hojas de lima kaffir",
      "1 cucharada de azúcar de palma",
      "2 cucharadas de salsa de soya",
      "Albahaca tailandesa fresca",
      "Arroz jazmín para acompañar"
    ],
    en: [
      "200g firm tofu, cubed",
      "1 can (400ml) coconut milk",
      "3 tablespoons green curry paste",
      "1 Thai eggplant, sliced",
      "100g green beans, trimmed",
      "1 red bell pepper, sliced",
      "5 kaffir lime leaves",
      "1 tablespoon palm sugar",
      "2 tablespoons soy sauce",
      "Fresh Thai basil",
      "Jasmine rice for serving"
    ]
  },

  // ID 155: Massaman Curry → versión vegetariana con papas y cacahuates
  155: {
    es: [
      "200g de tofu firme, en cubos",
      "2 papas medianas, peladas y en cubos",
      "1 lata (400ml) de leche de coco",
      "3 cucharadas de pasta de curry massaman",
      "1 cebolla, en gajos",
      "½ taza de cacahuates tostados",
      "2 cucharadas de salsa de tamarindo",
      "1 cucharada de azúcar de palma",
      "2 hojas de laurel",
      "1 rama de canela",
      "Arroz jazmín para acompañar"
    ],
    en: [
      "200g firm tofu, cubed",
      "2 medium potatoes, peeled and cubed",
      "1 can (400ml) coconut milk",
      "3 tablespoons massaman curry paste",
      "1 onion, cut into wedges",
      "½ cup roasted peanuts",
      "2 tablespoons tamarind sauce",
      "1 tablespoon palm sugar",
      "2 bay leaves",
      "1 cinnamon stick",
      "Jasmine rice for serving"
    ]
  },

  // ID 284: Tom Yum Goong → Es un plato de MARISCOS (camarones). Ingredientes correctos pero
  // necesita ser coherente: camarones sin "pollo"
  284: {
    es: [
      "500g de camarones grandes, pelados y desvenados",
      "4 tazas de caldo de verduras",
      "3 tallos de hierba limón (lemongrass), machacados",
      "5 hojas de lima kaffir",
      "3 rebanadas de galangal",
      "3-5 chiles ojo de pájaro",
      "200g de champiñones, en mitades",
      "3 cucharadas de jugo de limón",
      "2 cucharadas de salsa de soya",
      "1 cucharada de pasta de chile en aceite",
      "Cilantro fresco para decorar"
    ],
    en: [
      "500g large shrimp, peeled and deveined",
      "4 cups vegetable broth",
      "3 lemongrass stalks, bruised",
      "5 kaffir lime leaves",
      "3 slices galangal",
      "3-5 bird's eye chili peppers",
      "200g mushrooms, halved",
      "3 tablespoons lime juice",
      "2 tablespoons soy sauce",
      "1 tablespoon chili paste in oil",
      "Fresh cilantro for garnish"
    ]
  },

  // ID 289: Panang Curry → versión vegetariana
  289: {
    es: [
      "200g de tofu firme, en cubos",
      "1 lata (400ml) de leche de coco",
      "3 cucharadas de pasta de curry panang",
      "1 pimiento rojo, en tiras finas",
      "100g de ejotes, cortados",
      "5 hojas de lima kaffir, en juliana",
      "1 cucharada de azúcar de palma",
      "2 cucharadas de salsa de soya",
      "Albahaca tailandesa fresca",
      "Cacahuates triturados para decorar",
      "Arroz jazmín para acompañar"
    ],
    en: [
      "200g firm tofu, cubed",
      "1 can (400ml) coconut milk",
      "3 tablespoons panang curry paste",
      "1 red bell pepper, thinly sliced",
      "100g green beans, trimmed",
      "5 kaffir lime leaves, julienned",
      "1 tablespoon palm sugar",
      "2 tablespoons soy sauce",
      "Fresh Thai basil",
      "Crushed peanuts for garnish",
      "Jasmine rice for serving"
    ]
  }
};

async function fixContaminatedIngredients() {
  console.log('🔌 Conectando a TiDB Cloud...');
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });

  let conn;
  try {
    conn = await pool.getConnection();
    
    let fixed = 0;
    for (const [id, ingData] of Object.entries(fixes)) {
      const formattedIngredients = ingData.es.map((ingEs, index) => ({
        es: ingEs,
        en: ingData.en[index] || ingEs
      }));

      const ingredientsJson = JSON.stringify(formattedIngredients);
      await conn.query('UPDATE recipes SET ingredients = ? WHERE id = ?', [ingredientsJson, parseInt(id)]);
      
      // Obtener título para log
      const [rows] = await conn.query('SELECT title FROM recipes WHERE id = ?', [parseInt(id)]);
      let title = '';
      if (rows.length > 0) {
        try {
          const tObj = typeof rows[0].title === 'string' && rows[0].title.startsWith('{') ? JSON.parse(rows[0].title) : rows[0].title;
          title = tObj.es || tObj.en || rows[0].title;
        } catch(e) { title = rows[0].title; }
      }
      
      console.log(`✅ ID ${id}: ${title} → Ingredientes corregidos`);
      fixed++;
    }
    
    console.log(`\n🎉 ¡Se corrigieron ${fixed} recetas! Los ingredientes contaminados fueron reemplazados.`);
    console.log(`   Las recetas vegetarianas ahora tienen ingredientes 100% libres de carne.`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

fixContaminatedIngredients();
