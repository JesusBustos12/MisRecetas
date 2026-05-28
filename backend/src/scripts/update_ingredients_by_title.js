import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// ═══════════════════════════════════════════════════════════════
// BANCO DE INGREDIENTES INTELIGENTE BASADO EN EL TÍTULO
// Cada receta recibe ingredientes que realmente corresponden
// al platillo descrito en su título.
// ═══════════════════════════════════════════════════════════════

const ingredientsByKeyword = {

  // ══════════════ JAPONESAS ══════════════
  omurice: {
    es: [
      "2 tazas de arroz japonés cocido (preferiblemente del día anterior)",
      "4 huevos grandes",
      "150g de pechuga de pollo, cortada en cubos pequeños",
      "½ cebolla blanca, picada finamente",
      "3 cucharadas de ketchup + extra para decorar",
      "1 cucharada de mantequilla",
      "1 cucharada de aceite vegetal",
      "Sal y pimienta al gusto",
      "1 cucharada de salsa de soya (opcional)",
      "1 chorrito de leche (para los huevos)"
    ],
    en: [
      "2 cups cooked Japanese rice (preferably day-old)",
      "4 large eggs",
      "150g chicken breast, diced small",
      "½ white onion, finely chopped",
      "3 tablespoons ketchup + extra for topping",
      "1 tablespoon butter",
      "1 tablespoon vegetable oil",
      "Salt and pepper to taste",
      "1 tablespoon soy sauce (optional)",
      "A splash of milk (for the eggs)"
    ]
  },
  ramen: {
    es: [
      "200g de fideos ramen frescos o secos",
      "1 litro de caldo de cerdo o pollo concentrado",
      "200g de panceta de cerdo (chashu), en lonchas",
      "2 huevos para marinar (ajitsuke tamago)",
      "3 cucharadas de salsa de soya oscura",
      "2 cucharadas de mirin",
      "1 trozo de jengibre fresco (3cm), rebanado",
      "2 dientes de ajo, machacados",
      "2 cebollines, picados finamente",
      "1 hoja de alga nori tostada por porción",
      "1 cucharada de aceite de sésamo",
      "Brotes de bambú (menma) al gusto"
    ],
    en: [
      "200g fresh or dried ramen noodles",
      "1 liter concentrated pork or chicken broth",
      "200g pork belly (chashu), sliced",
      "2 eggs for marinating (ajitsuke tamago)",
      "3 tablespoons dark soy sauce",
      "2 tablespoons mirin",
      "1 piece fresh ginger (3cm), sliced",
      "2 garlic cloves, crushed",
      "2 scallions, finely chopped",
      "1 sheet toasted nori seaweed per serving",
      "1 tablespoon sesame oil",
      "Bamboo shoots (menma) to taste"
    ]
  },
  sushi: {
    es: [
      "2 tazas de arroz para sushi (grano corto japonés)",
      "3 cucharadas de vinagre de arroz",
      "1 cucharada de azúcar",
      "½ cucharadita de sal",
      "200g de salmón fresco grado sashimi",
      "200g de atún fresco grado sashimi",
      "1 aguacate maduro",
      "1 pepino japonés",
      "4-6 hojas de alga nori tostada",
      "Wasabi, jengibre encurtido y salsa de soya para servir",
      "Semillas de sésamo tostadas"
    ],
    en: [
      "2 cups sushi rice (Japanese short grain)",
      "3 tablespoons rice vinegar",
      "1 tablespoon sugar",
      "½ teaspoon salt",
      "200g fresh sashimi-grade salmon",
      "200g fresh sashimi-grade tuna",
      "1 ripe avocado",
      "1 Japanese cucumber",
      "4-6 sheets toasted nori seaweed",
      "Wasabi, pickled ginger and soy sauce for serving",
      "Toasted sesame seeds"
    ]
  },
  tonkatsu: {
    es: [
      "4 chuletas de cerdo de 1.5cm de grosor (lomo)",
      "1 taza de panko (pan rallado japonés)",
      "½ taza de harina de trigo",
      "2 huevos batidos",
      "Aceite vegetal para freír (abundante)",
      "Sal y pimienta negra",
      "Salsa tonkatsu para acompañar",
      "Repollo finamente cortado en juliana",
      "Arroz blanco japonés al vapor",
      "Rodajas de limón"
    ],
    en: [
      "4 pork loin chops, 1.5cm thick",
      "1 cup panko breadcrumbs",
      "½ cup all-purpose flour",
      "2 eggs, beaten",
      "Vegetable oil for deep frying",
      "Salt and black pepper",
      "Tonkatsu sauce for serving",
      "Cabbage, finely shredded",
      "Steamed Japanese white rice",
      "Lemon wedges"
    ]
  },
  teriyaki: {
    es: [
      "500g de pechuga de pollo (o salmón), en filetes",
      "4 cucharadas de salsa de soya",
      "3 cucharadas de mirin",
      "2 cucharadas de sake",
      "1 cucharada de azúcar",
      "1 cucharada de aceite vegetal",
      "1 trozo de jengibre fresco, rallado",
      "Semillas de sésamo tostadas para decorar",
      "Cebollín fresco picado",
      "Arroz japonés al vapor para acompañar"
    ],
    en: [
      "500g chicken breast (or salmon), filleted",
      "4 tablespoons soy sauce",
      "3 tablespoons mirin",
      "2 tablespoons sake",
      "1 tablespoon sugar",
      "1 tablespoon vegetable oil",
      "1 piece fresh ginger, grated",
      "Toasted sesame seeds for garnish",
      "Fresh scallions, chopped",
      "Steamed Japanese rice for serving"
    ]
  },
  tempura: {
    es: [
      "200g de camarones grandes, pelados y desvenados",
      "1 camote, cortado en rodajas finas",
      "1 berenjena japonesa, en rodajas",
      "100g de ejotes (judías verdes)",
      "1 taza de harina de trigo para tempura",
      "1 huevo",
      "1 taza de agua helada con hielos",
      "Aceite vegetal para freír",
      "Salsa tentsuyu (caldo dashi, soya y mirin)",
      "Rábano daikon rallado para acompañar"
    ],
    en: [
      "200g large shrimp, peeled and deveined",
      "1 sweet potato, thinly sliced",
      "1 Japanese eggplant, sliced",
      "100g green beans",
      "1 cup tempura flour",
      "1 egg",
      "1 cup ice-cold water with ice cubes",
      "Vegetable oil for deep frying",
      "Tentsuyu sauce (dashi broth, soy and mirin)",
      "Grated daikon radish for serving"
    ]
  },
  mochi: {
    es: [
      "200g de harina de arroz glutinoso (mochiko)",
      "½ taza de azúcar",
      "¾ taza de agua",
      "Almidón de maíz para espolvorear",
      "Relleno de pasta de frijol rojo dulce (anko)",
      "Colorante alimentario (opcional)"
    ],
    en: [
      "200g glutinous rice flour (mochiko)",
      "½ cup sugar",
      "¾ cup water",
      "Cornstarch for dusting",
      "Sweet red bean paste filling (anko)",
      "Food coloring (optional)"
    ]
  },
  gyoza: {
    es: [
      "200g de carne de cerdo molida",
      "1 taza de col (repollo) picada finamente",
      "2 cebollines, picados",
      "1 trozo de jengibre (2cm), rallado",
      "2 dientes de ajo, rallados",
      "1 cucharada de salsa de soya",
      "1 cucharadita de aceite de sésamo",
      "30 discos para gyoza (wrappers)",
      "Agua para sellar",
      "Aceite vegetal para cocinar",
      "Salsa: soya, vinagre de arroz y aceite de chile"
    ],
    en: [
      "200g ground pork",
      "1 cup cabbage, finely chopped",
      "2 scallions, chopped",
      "1 piece ginger (2cm), grated",
      "2 garlic cloves, grated",
      "1 tablespoon soy sauce",
      "1 teaspoon sesame oil",
      "30 gyoza wrappers",
      "Water for sealing",
      "Vegetable oil for cooking",
      "Dipping sauce: soy, rice vinegar and chili oil"
    ]
  },

  // ══════════════ MEXICANAS ══════════════
  taco: {
    es: [
      "500g de carne (res, cerdo al pastor o pollo, según el taco)",
      "12 tortillas de maíz",
      "1 cebolla blanca, picada finamente",
      "½ taza de cilantro fresco picado",
      "3 limones verdes, cortados en gajos",
      "Salsa roja o verde al gusto",
      "Rábanos en rodajas para adornar",
      "Sal al gusto"
    ],
    en: [
      "500g meat (beef, al pastor pork or chicken, depending on taco type)",
      "12 corn tortillas",
      "1 white onion, finely chopped",
      "½ cup fresh cilantro, chopped",
      "3 limes, cut into wedges",
      "Red or green salsa to taste",
      "Sliced radishes for garnish",
      "Salt to taste"
    ]
  },
  enchilada: {
    es: [
      "12 tortillas de maíz",
      "500g de pechuga de pollo cocida y desmenuzada",
      "2 tazas de salsa roja o verde (de chile guajillo o tomatillo)",
      "200g de queso fresco o Oaxaca, desmenuzado",
      "1 cebolla blanca, en aros finos",
      "½ taza de crema ácida mexicana",
      "Aceite vegetal para freír ligeramente las tortillas",
      "Hojas de lechuga y rábanos para adornar"
    ],
    en: [
      "12 corn tortillas",
      "500g cooked chicken breast, shredded",
      "2 cups red or green sauce (guajillo chile or tomatillo)",
      "200g queso fresco or Oaxaca cheese, crumbled",
      "1 white onion, thinly sliced into rings",
      "½ cup Mexican sour cream",
      "Vegetable oil for lightly frying tortillas",
      "Lettuce leaves and radishes for garnish"
    ]
  },
  mole: {
    es: [
      "8 piezas de pollo (muslos y piernas)",
      "6 chiles mulato, desvenados",
      "4 chiles ancho, desvenados",
      "3 chiles pasilla, desvenados",
      "2 jitomates asados",
      "¼ de taza de almendras",
      "¼ de taza de cacahuates",
      "50g de chocolate mexicano de mesa",
      "2 tortillas tostadas",
      "1 raja de canela, clavo y pimienta gorda",
      "3 cucharadas de manteca o aceite",
      "Ajonjolí tostado para decorar"
    ],
    en: [
      "8 chicken pieces (thighs and drumsticks)",
      "6 mulato chiles, deveined",
      "4 ancho chiles, deveined",
      "3 pasilla chiles, deveined",
      "2 roasted tomatoes",
      "¼ cup almonds",
      "¼ cup peanuts",
      "50g Mexican chocolate",
      "2 toasted tortillas",
      "1 cinnamon stick, cloves and allspice",
      "3 tablespoons lard or oil",
      "Toasted sesame seeds for garnish"
    ]
  },
  guacamole: {
    es: [
      "3 aguacates Hass maduros",
      "1 jitomate mediano, picado en cubitos",
      "½ cebolla blanca, picada finamente",
      "1-2 chiles serranos, picados sin semillas",
      "¼ taza de cilantro fresco picado",
      "Jugo de 2 limones verdes",
      "Sal de mar al gusto",
      "Totopos de maíz para acompañar"
    ],
    en: [
      "3 ripe Hass avocados",
      "1 medium tomato, diced",
      "½ white onion, finely chopped",
      "1-2 serrano chiles, seeded and minced",
      "¼ cup fresh cilantro, chopped",
      "Juice of 2 limes",
      "Sea salt to taste",
      "Corn tortilla chips for serving"
    ]
  },
  pozole: {
    es: [
      "500g de carne de cerdo (espinazo o maciza), en trozos",
      "1 lata grande de maíz pozolero (hominy), escurrido",
      "5 chiles guajillo, desvenados y sin semillas",
      "2 chiles ancho, desvenados",
      "3 dientes de ajo",
      "½ cebolla blanca",
      "1 cucharadita de orégano seco",
      "Sal al gusto",
      "Para servir: lechuga, rábanos, orégano, tostadas, limón y chile piquín"
    ],
    en: [
      "500g pork (spine or loin), cut into chunks",
      "1 large can hominy corn, drained",
      "5 guajillo chiles, deveined and seedless",
      "2 ancho chiles, deveined",
      "3 garlic cloves",
      "½ white onion",
      "1 teaspoon dried oregano",
      "Salt to taste",
      "For serving: lettuce, radishes, oregano, tostadas, lime and chili flakes"
    ]
  },
  tamale: {
    es: [
      "1 kg de masa de maíz para tamales",
      "250g de manteca de cerdo, batida hasta esponjar",
      "500g de carne de cerdo o pollo, cocida y desmenuzada",
      "2 tazas de salsa roja o verde",
      "Hojas de maíz secas, remojadas en agua caliente",
      "1 cucharadita de polvo para hornear",
      "Sal al gusto",
      "Caldo de cocción de la carne"
    ],
    en: [
      "1 kg corn masa for tamales",
      "250g lard, beaten until fluffy",
      "500g pork or chicken, cooked and shredded",
      "2 cups red or green salsa",
      "Dried corn husks, soaked in hot water",
      "1 teaspoon baking powder",
      "Salt to taste",
      "Meat cooking broth"
    ]
  },
  ceviche: {
    es: [
      "500g de pescado blanco fresco (sierra, robalo), en cubos",
      "Jugo de 8-10 limones verdes",
      "2 jitomates maduros, picados en cubos",
      "½ cebolla morada, picada finamente",
      "1-2 chiles serranos, picados",
      "½ taza de cilantro fresco picado",
      "1 aguacate maduro, en cubos",
      "Sal de mar al gusto",
      "Tostadas de maíz para servir"
    ],
    en: [
      "500g fresh white fish (sierra, sea bass), cubed",
      "Juice of 8-10 limes",
      "2 ripe tomatoes, diced",
      "½ red onion, finely chopped",
      "1-2 serrano chiles, minced",
      "½ cup fresh cilantro, chopped",
      "1 ripe avocado, cubed",
      "Sea salt to taste",
      "Corn tostadas for serving"
    ]
  },
  churro: {
    es: [
      "1 taza de agua",
      "½ taza de mantequilla sin sal",
      "1 taza de harina de trigo",
      "3 huevos",
      "¼ cucharadita de sal",
      "1 cucharadita de extracto de vainilla",
      "Aceite vegetal para freír",
      "½ taza de azúcar mezclada con 2 cucharaditas de canela",
      "Chocolate caliente o cajeta para acompañar"
    ],
    en: [
      "1 cup water",
      "½ cup unsalted butter",
      "1 cup all-purpose flour",
      "3 eggs",
      "¼ teaspoon salt",
      "1 teaspoon vanilla extract",
      "Vegetable oil for frying",
      "½ cup sugar mixed with 2 teaspoons cinnamon",
      "Hot chocolate or caramel sauce for dipping"
    ]
  },
  flan: {
    es: [
      "1 lata (397g) de leche condensada",
      "1 lata (360ml) de leche evaporada",
      "5 huevos grandes",
      "1 cucharadita de extracto de vainilla",
      "1 taza de azúcar para el caramelo",
      "Pizca de sal"
    ],
    en: [
      "1 can (397g) sweetened condensed milk",
      "1 can (360ml) evaporated milk",
      "5 large eggs",
      "1 teaspoon vanilla extract",
      "1 cup sugar for caramel",
      "Pinch of salt"
    ]
  },

  // ══════════════ ITALIANAS ══════════════
  pizza: {
    es: [
      "500g de harina 00 o de fuerza",
      "7g de levadura seca activa",
      "1 cucharadita de sal",
      "1 cucharadita de azúcar",
      "1½ tazas de agua tibia",
      "2 cucharadas de aceite de oliva",
      "1 taza de salsa de tomate (passata)",
      "250g de mozzarella fresca, en rodajas o rallada",
      "Hojas de albahaca fresca",
      "Toppings al gusto (pepperoni, champiñones, aceitunas)"
    ],
    en: [
      "500g 00 or bread flour",
      "7g active dry yeast",
      "1 teaspoon salt",
      "1 teaspoon sugar",
      "1½ cups warm water",
      "2 tablespoons olive oil",
      "1 cup tomato sauce (passata)",
      "250g fresh mozzarella, sliced or shredded",
      "Fresh basil leaves",
      "Toppings of choice (pepperoni, mushrooms, olives)"
    ]
  },
  risotto: {
    es: [
      "300g de arroz arborio o carnaroli",
      "1 litro de caldo de pollo o vegetal, caliente",
      "1 cebolla pequeña, picada finamente",
      "½ taza de vino blanco seco",
      "50g de mantequilla",
      "½ taza de parmigiano reggiano rallado",
      "2 cucharadas de aceite de oliva",
      "Sal y pimienta al gusto",
      "Ingrediente principal (champiñones, azafrán, mariscos, etc.)"
    ],
    en: [
      "300g arborio or carnaroli rice",
      "1 liter chicken or vegetable broth, hot",
      "1 small onion, finely chopped",
      "½ cup dry white wine",
      "50g butter",
      "½ cup grated parmigiano reggiano",
      "2 tablespoons olive oil",
      "Salt and pepper to taste",
      "Main ingredient (mushrooms, saffron, seafood, etc.)"
    ]
  },
  lasagna: {
    es: [
      "12 láminas de pasta para lasaña",
      "500g de carne de res molida",
      "800g de tomates San Marzano triturados",
      "500g de queso ricotta",
      "300g de mozzarella rallada",
      "½ taza de parmesano rallado",
      "1 cebolla, picada",
      "3 dientes de ajo, picados",
      "Hojas de albahaca fresca",
      "Sal, pimienta y orégano al gusto",
      "Aceite de oliva"
    ],
    en: [
      "12 lasagna noodle sheets",
      "500g ground beef",
      "800g crushed San Marzano tomatoes",
      "500g ricotta cheese",
      "300g shredded mozzarella",
      "½ cup grated parmesan",
      "1 onion, chopped",
      "3 garlic cloves, minced",
      "Fresh basil leaves",
      "Salt, pepper and oregano to taste",
      "Olive oil"
    ]
  },
  tiramisu: {
    es: [
      "500g de queso mascarpone",
      "6 yemas de huevo",
      "¾ taza de azúcar glass",
      "300ml de café espresso fuerte, frío",
      "3 cucharadas de licor Marsala o amaretto",
      "24 bizcochos savoiardi (ladyfingers)",
      "Cacao amargo en polvo para espolvorear",
      "1 cucharadita de extracto de vainilla"
    ],
    en: [
      "500g mascarpone cheese",
      "6 egg yolks",
      "¾ cup powdered sugar",
      "300ml strong espresso coffee, cooled",
      "3 tablespoons Marsala or amaretto liqueur",
      "24 savoiardi biscuits (ladyfingers)",
      "Unsweetened cocoa powder for dusting",
      "1 teaspoon vanilla extract"
    ]
  },
  carbonara: {
    es: [
      "400g de spaghetti o rigatoni",
      "200g de guanciale o panceta, en tiras",
      "4 yemas de huevo + 1 huevo entero",
      "100g de pecorino romano rallado",
      "Pimienta negra recién molida (abundante)",
      "Sal para el agua de la pasta"
    ],
    en: [
      "400g spaghetti or rigatoni",
      "200g guanciale or pancetta, cut into strips",
      "4 egg yolks + 1 whole egg",
      "100g grated pecorino romano",
      "Freshly ground black pepper (generous)",
      "Salt for pasta water"
    ]
  },
  gelato: {
    es: [
      "2 tazas de leche entera",
      "1 taza de crema para batir",
      "¾ taza de azúcar",
      "4 yemas de huevo",
      "1 cucharadita de extracto de vainilla",
      "Pizca de sal",
      "Saborizante al gusto (chocolate, fresa, pistacho)"
    ],
    en: [
      "2 cups whole milk",
      "1 cup heavy cream",
      "¾ cup sugar",
      "4 egg yolks",
      "1 teaspoon vanilla extract",
      "Pinch of salt",
      "Flavoring of choice (chocolate, strawberry, pistachio)"
    ]
  },

  // ══════════════ CHINAS ══════════════
  dumpling: {
    es: [
      "300g de carne de cerdo molida",
      "1 taza de col napa, picada finamente",
      "3 cebollines, picados",
      "1 trozo de jengibre (2cm), rallado",
      "2 cucharadas de salsa de soya",
      "1 cucharadita de aceite de sésamo",
      "40 discos de masa para dumplings",
      "Agua para sellar y cocinar al vapor",
      "Salsa para mojar: soya, vinagre y chile"
    ],
    en: [
      "300g ground pork",
      "1 cup napa cabbage, finely chopped",
      "3 scallions, chopped",
      "1 piece ginger (2cm), grated",
      "2 tablespoons soy sauce",
      "1 teaspoon sesame oil",
      "40 dumpling wrappers",
      "Water for sealing and steaming",
      "Dipping sauce: soy, vinegar and chili"
    ]
  },
  "kung pao": {
    es: [
      "500g de pechuga de pollo, en cubos de 2cm",
      "½ taza de cacahuates tostados",
      "8-10 chiles secos de árbol (o tien tsin)",
      "3 cucharadas de salsa de soya oscura",
      "1 cucharada de vinagre de arroz chino",
      "1 cucharada de azúcar",
      "2 cucharadas de salsa hoisin",
      "3 dientes de ajo, picados",
      "1 trozo de jengibre (2cm), picado",
      "1 cucharada de maicena + 2 cdas de agua",
      "2 cucharadas de aceite vegetal",
      "Cebollines picados para decorar"
    ],
    en: [
      "500g chicken breast, cut into 2cm cubes",
      "½ cup roasted peanuts",
      "8-10 dried chili peppers (tien tsin)",
      "3 tablespoons dark soy sauce",
      "1 tablespoon Chinese rice vinegar",
      "1 tablespoon sugar",
      "2 tablespoons hoisin sauce",
      "3 garlic cloves, minced",
      "1 piece ginger (2cm), minced",
      "1 tablespoon cornstarch + 2 tbsp water",
      "2 tablespoons vegetable oil",
      "Chopped scallions for garnish"
    ]
  },
  "pato": {
    es: [
      "1 pato entero (2-2.5 kg), limpio",
      "3 cucharadas de miel",
      "2 cucharadas de salsa de soya oscura",
      "1 cucharada de vinagre de arroz",
      "1 cucharadita de polvo cinco especias chinas",
      "Tortillas finas de trigo (para Pekín)",
      "Pepino en bastones finos",
      "Cebollines cortados en tiras largas",
      "Salsa hoisin para untar"
    ],
    en: [
      "1 whole duck (2-2.5 kg), cleaned",
      "3 tablespoons honey",
      "2 tablespoons dark soy sauce",
      "1 tablespoon rice vinegar",
      "1 teaspoon Chinese five-spice powder",
      "Thin wheat pancakes (for Peking style)",
      "Cucumber, cut into thin batons",
      "Scallions, cut into long strips",
      "Hoisin sauce for spreading"
    ]
  },
  "dim sum": {
    es: [
      "300g de carne de cerdo molida",
      "100g de camarones, pelados y picados",
      "2 cucharadas de salsa de soya",
      "1 cucharadita de aceite de sésamo",
      "1 cucharadita de jengibre rallado",
      "Discos de masa wonton",
      "Zanahorias ralladas y guisantes para decorar",
      "Salsa de soya con vinagre para mojar"
    ],
    en: [
      "300g ground pork",
      "100g shrimp, peeled and chopped",
      "2 tablespoons soy sauce",
      "1 teaspoon sesame oil",
      "1 teaspoon grated ginger",
      "Wonton wrappers",
      "Grated carrots and peas for garnish",
      "Soy and vinegar dipping sauce"
    ]
  },
  "lo mein": {
    es: [
      "300g de fideos lo mein (o spaghetti)",
      "200g de pollo, cerdo o camarones, en tiras",
      "1 taza de vegetales mixtos (brócoli, zanahoria, pimiento)",
      "3 cucharadas de salsa de soya",
      "1 cucharada de salsa de ostión",
      "1 cucharadita de aceite de sésamo",
      "2 dientes de ajo, picados",
      "2 cucharadas de aceite vegetal"
    ],
    en: [
      "300g lo mein noodles (or spaghetti)",
      "200g chicken, pork or shrimp, sliced",
      "1 cup mixed vegetables (broccoli, carrot, bell pepper)",
      "3 tablespoons soy sauce",
      "1 tablespoon oyster sauce",
      "1 teaspoon sesame oil",
      "2 garlic cloves, minced",
      "2 tablespoons vegetable oil"
    ]
  },
  "agridulce": {
    es: [
      "500g de lomo de cerdo, cortado en cubos de 3cm",
      "1 pimiento rojo, en trozos",
      "1 pimiento verde, en trozos",
      "1 taza de piña en trozos (fresca o en lata)",
      "½ taza de ketchup",
      "3 cucharadas de vinagre de arroz",
      "3 cucharadas de azúcar",
      "2 cucharadas de salsa de soya",
      "1 cucharada de maicena + agua para espesar",
      "Aceite vegetal para freír",
      "Arroz blanco al vapor"
    ],
    en: [
      "500g pork loin, cut into 3cm cubes",
      "1 red bell pepper, chunked",
      "1 green bell pepper, chunked",
      "1 cup pineapple chunks (fresh or canned)",
      "½ cup ketchup",
      "3 tablespoons rice vinegar",
      "3 tablespoons sugar",
      "2 tablespoons soy sauce",
      "1 tablespoon cornstarch + water to thicken",
      "Vegetable oil for frying",
      "Steamed white rice"
    ]
  },
  "arroz frito": {
    es: [
      "3 tazas de arroz cocido (del día anterior, frío)",
      "3 huevos, batidos",
      "200g de camarones o pollo, en trozos pequeños",
      "1 taza de vegetales mixtos (chícharos, zanahoria, elote)",
      "3 cucharadas de salsa de soya",
      "2 cebollines, picados",
      "2 dientes de ajo, picados",
      "2 cucharadas de aceite vegetal",
      "1 cucharadita de aceite de sésamo",
      "Pimienta blanca al gusto"
    ],
    en: [
      "3 cups cooked rice (day-old, cold)",
      "3 eggs, beaten",
      "200g shrimp or chicken, diced",
      "1 cup mixed vegetables (peas, carrot, corn)",
      "3 tablespoons soy sauce",
      "2 scallions, chopped",
      "2 garlic cloves, minced",
      "2 tablespoons vegetable oil",
      "1 teaspoon sesame oil",
      "White pepper to taste"
    ]
  },
  "rollito": {
    es: [
      "20 hojas de masa para rollitos (spring roll wrappers)",
      "200g de carne de cerdo molida o camarones picados",
      "2 tazas de col napa, picada finamente",
      "1 zanahoria, rallada",
      "100g de fideos de vidrio (glass noodles), remojados",
      "2 cucharadas de salsa de soya",
      "1 cucharadita de aceite de sésamo",
      "Aceite vegetal para freír",
      "Salsa agridulce para acompañar"
    ],
    en: [
      "20 spring roll wrappers",
      "200g ground pork or chopped shrimp",
      "2 cups napa cabbage, finely chopped",
      "1 carrot, grated",
      "100g glass noodles, soaked",
      "2 tablespoons soy sauce",
      "1 teaspoon sesame oil",
      "Vegetable oil for deep frying",
      "Sweet and sour sauce for dipping"
    ]
  },
  mapo: {
    es: [
      "400g de tofu sedoso, cortado en cubos de 2cm",
      "150g de carne de cerdo molida",
      "2 cucharadas de pasta de frijol picante (doubanjiang)",
      "1 cucharada de frijol negro fermentado (douchi)",
      "3 dientes de ajo, picados",
      "1 trozo de jengibre (2cm), picado",
      "2 cebollines, picados",
      "1 cucharada de maicena disuelta en agua",
      "½ cucharadita de pimienta de Sichuan, molida",
      "Aceite vegetal y aceite de chile"
    ],
    en: [
      "400g silken tofu, cut into 2cm cubes",
      "150g ground pork",
      "2 tablespoons spicy bean paste (doubanjiang)",
      "1 tablespoon fermented black beans (douchi)",
      "3 garlic cloves, minced",
      "1 piece ginger (2cm), minced",
      "2 scallions, chopped",
      "1 tablespoon cornstarch dissolved in water",
      "½ teaspoon Sichuan peppercorn, ground",
      "Vegetable oil and chili oil"
    ]
  },
  berenjena: {
    es: [
      "3 berenjenas medianas, cortadas en tiras",
      "3 cucharadas de salsa de soya",
      "1 cucharada de vinagre de arroz",
      "1 cucharada de azúcar",
      "1 cucharada de pasta de chile (doubanjiang)",
      "3 dientes de ajo, picados",
      "1 trozo de jengibre, picado",
      "2 cebollines, picados",
      "1 cucharada de maicena + agua",
      "Aceite vegetal para freír"
    ],
    en: [
      "3 medium eggplants, cut into strips",
      "3 tablespoons soy sauce",
      "1 tablespoon rice vinegar",
      "1 tablespoon sugar",
      "1 tablespoon chili paste (doubanjiang)",
      "3 garlic cloves, minced",
      "1 piece ginger, minced",
      "2 scallions, chopped",
      "1 tablespoon cornstarch + water",
      "Vegetable oil for frying"
    ]
  },

  // ══════════════ INDIAS ══════════════
  curry: {
    es: [
      "500g de pollo, cordero o garbanzos (según variante)",
      "1 lata (400ml) de tomates triturados o leche de coco",
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
      "500g chicken, lamb or chickpeas (depending on variant)",
      "1 can (400ml) crushed tomatoes or coconut milk",
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
  naan: {
    es: [
      "2 tazas de harina de trigo",
      "½ taza de yogur natural",
      "1 cucharadita de levadura seca",
      "1 cucharadita de azúcar",
      "½ cucharadita de sal",
      "2 cucharadas de ghee o mantequilla derretida",
      "¼ taza de agua tibia",
      "Ajo picado y cilantro para naan con ajo (opcional)"
    ],
    en: [
      "2 cups all-purpose flour",
      "½ cup plain yogurt",
      "1 teaspoon dry yeast",
      "1 teaspoon sugar",
      "½ teaspoon salt",
      "2 tablespoons ghee or melted butter",
      "¼ cup warm water",
      "Minced garlic and cilantro for garlic naan (optional)"
    ]
  },
  biryani: {
    es: [
      "2 tazas de arroz basmati, lavado y remojado 30 minutos",
      "500g de pollo o cordero, en trozos",
      "1 taza de yogur natural",
      "2 cebollas grandes, en juliana fina y fritas hasta doradas",
      "4 dientes de ajo, en pasta",
      "1 trozo de jengibre (3cm), en pasta",
      "½ cucharadita de azafrán en leche tibia",
      "Especias enteras: canela, cardamomo, clavo, laurel",
      "2 cucharaditas de garam masala",
      "3 cucharadas de ghee",
      "Cilantro y menta fresca para capas",
      "Frutos secos (almendras, pasas) para decorar"
    ],
    en: [
      "2 cups basmati rice, washed and soaked 30 minutes",
      "500g chicken or lamb, cut into pieces",
      "1 cup plain yogurt",
      "2 large onions, julienned and fried until golden",
      "4 garlic cloves, made into paste",
      "1 piece ginger (3cm), made into paste",
      "½ teaspoon saffron in warm milk",
      "Whole spices: cinnamon, cardamom, cloves, bay leaf",
      "2 teaspoons garam masala",
      "3 tablespoons ghee",
      "Fresh cilantro and mint for layering",
      "Nuts (almonds, raisins) for garnish"
    ]
  },
  samosa: {
    es: [
      "Para la masa: 2 tazas de harina, ¼ taza de ghee, agua, sal",
      "3 papas medianas, cocidas y machacadas",
      "½ taza de chícharos (guisantes) cocidos",
      "1 cebolla, picada finamente",
      "1 trozo de jengibre (2cm), rallado",
      "2 chiles verdes, picados",
      "1 cucharadita de comino",
      "1 cucharadita de garam masala",
      "Aceite para freír",
      "Chutney de menta o tamarindo para servir"
    ],
    en: [
      "For dough: 2 cups flour, ¼ cup ghee, water, salt",
      "3 medium potatoes, boiled and mashed",
      "½ cup cooked green peas",
      "1 onion, finely chopped",
      "1 piece ginger (2cm), grated",
      "2 green chiles, minced",
      "1 teaspoon cumin",
      "1 teaspoon garam masala",
      "Oil for deep frying",
      "Mint or tamarind chutney for serving"
    ]
  },

  // ══════════════ TAILANDESAS ══════════════
  "pad thai": {
    es: [
      "200g de fideos de arroz planos (pad thai noodles)",
      "200g de camarones o tofu firme",
      "2 huevos",
      "3 cucharadas de salsa de tamarindo",
      "2 cucharadas de salsa de pescado (nam pla)",
      "1 cucharada de azúcar de palma",
      "1 taza de brotes de soya",
      "½ taza de cacahuates tostados, triturados",
      "3 cebollines, cortados en trozos de 3cm",
      "1 limón, en gajos",
      "Chile en hojuelas al gusto"
    ],
    en: [
      "200g flat rice noodles (pad thai noodles)",
      "200g shrimp or firm tofu",
      "2 eggs",
      "3 tablespoons tamarind sauce",
      "2 tablespoons fish sauce (nam pla)",
      "1 tablespoon palm sugar",
      "1 cup bean sprouts",
      "½ cup roasted peanuts, crushed",
      "3 scallions, cut into 3cm pieces",
      "1 lime, cut into wedges",
      "Chili flakes to taste"
    ]
  },
  "tom yum": {
    es: [
      "500g de camarones o pollo",
      "4 tazas de caldo de pollo",
      "3 tallos de hierba limón (lemongrass), machacados",
      "5 hojas de lima kaffir",
      "3 rodajas de galanga (o jengibre)",
      "200g de champiñones, rebanados",
      "3 cucharadas de salsa de pescado",
      "2 cucharadas de pasta de chile (nam prik pao)",
      "Jugo de 3 limas",
      "Chiles ojo de pájaro al gusto",
      "Cilantro fresco"
    ],
    en: [
      "500g shrimp or chicken",
      "4 cups chicken broth",
      "3 lemongrass stalks, bruised",
      "5 kaffir lime leaves",
      "3 slices galangal (or ginger)",
      "200g mushrooms, sliced",
      "3 tablespoons fish sauce",
      "2 tablespoons chili paste (nam prik pao)",
      "Juice of 3 limes",
      "Bird's eye chiles to taste",
      "Fresh cilantro"
    ]
  },
  "mango sticky": {
    es: [
      "1 taza de arroz glutinoso, remojado al menos 4 horas",
      "1 lata (400ml) de leche de coco",
      "½ taza de azúcar de palma o azúcar blanca",
      "¼ cucharadita de sal",
      "2 mangos maduros, pelados y rebanados",
      "Semillas de sésamo tostadas para decorar"
    ],
    en: [
      "1 cup glutinous rice, soaked at least 4 hours",
      "1 can (400ml) coconut milk",
      "½ cup palm sugar or white sugar",
      "¼ teaspoon salt",
      "2 ripe mangoes, peeled and sliced",
      "Toasted sesame seeds for garnish"
    ]
  },

  // ══════════════ ESPAÑOLAS ══════════════
  paella: {
    es: [
      "2 tazas de arroz bomba o Calasparra",
      "500g de mariscos mixtos (gambas, mejillones, calamares)",
      "200g de pollo, en trozos (para paella mixta)",
      "1 pimiento rojo, en tiras",
      "1 tomate rallado",
      "4 dientes de ajo, picados",
      "1 sobre de azafrán (0.5g)",
      "4 tazas de caldo de pescado o pollo, caliente",
      "½ taza de aceite de oliva",
      "Sal al gusto",
      "Limón en gajos para servir"
    ],
    en: [
      "2 cups bomba or Calasparra rice",
      "500g mixed seafood (shrimp, mussels, squid)",
      "200g chicken, cut into pieces (for mixed paella)",
      "1 red bell pepper, sliced",
      "1 grated tomato",
      "4 garlic cloves, minced",
      "1 sachet saffron (0.5g)",
      "4 cups fish or chicken broth, hot",
      "½ cup olive oil",
      "Salt to taste",
      "Lemon wedges for serving"
    ]
  },
  tortilla: {
    es: [
      "6 huevos grandes",
      "4 papas medianas, peladas y en rodajas finas",
      "1 cebolla grande, en juliana (opcional)",
      "1 taza de aceite de oliva para freír",
      "Sal al gusto"
    ],
    en: [
      "6 large eggs",
      "4 medium potatoes, peeled and thinly sliced",
      "1 large onion, julienned (optional)",
      "1 cup olive oil for frying",
      "Salt to taste"
    ]
  },
  gazpacho: {
    es: [
      "1 kg de tomates maduros",
      "1 pepino, pelado",
      "1 pimiento verde",
      "1 diente de ajo",
      "100g de pan del día anterior, remojado",
      "4 cucharadas de aceite de oliva virgen extra",
      "2 cucharadas de vinagre de Jerez",
      "Sal al gusto",
      "Agua fría para ajustar la textura"
    ],
    en: [
      "1 kg ripe tomatoes",
      "1 cucumber, peeled",
      "1 green bell pepper",
      "1 garlic clove",
      "100g day-old bread, soaked",
      "4 tablespoons extra virgin olive oil",
      "2 tablespoons sherry vinegar",
      "Salt to taste",
      "Cold water to adjust texture"
    ]
  },
  croqueta: {
    es: [
      "500ml de leche entera",
      "60g de mantequilla",
      "60g de harina de trigo",
      "200g de jamón serrano, picado muy fino",
      "Nuez moscada rallada",
      "Sal y pimienta",
      "2 huevos batidos para empanizar",
      "Pan rallado fino",
      "Aceite de oliva para freír"
    ],
    en: [
      "500ml whole milk",
      "60g butter",
      "60g all-purpose flour",
      "200g serrano ham, very finely diced",
      "Grated nutmeg",
      "Salt and pepper",
      "2 beaten eggs for breading",
      "Fine breadcrumbs",
      "Olive oil for frying"
    ]
  },

  // ══════════════ FRANCESAS ══════════════
  croissant: {
    es: [
      "500g de harina de fuerza",
      "10g de sal",
      "80g de azúcar",
      "10g de levadura fresca",
      "300ml de leche fría",
      "280g de mantequilla fría (para laminar)",
      "1 huevo batido para barnizar"
    ],
    en: [
      "500g bread flour",
      "10g salt",
      "80g sugar",
      "10g fresh yeast",
      "300ml cold milk",
      "280g cold butter (for laminating)",
      "1 beaten egg for glazing"
    ]
  },
  crepe: {
    es: [
      "1 taza de harina de trigo",
      "2 huevos",
      "1 taza de leche",
      "2 cucharadas de mantequilla derretida",
      "1 cucharada de azúcar (para dulces)",
      "Pizca de sal",
      "Relleno al gusto: Nutella, fresas, jamón y queso, etc."
    ],
    en: [
      "1 cup all-purpose flour",
      "2 eggs",
      "1 cup milk",
      "2 tablespoons melted butter",
      "1 tablespoon sugar (for sweet crepes)",
      "Pinch of salt",
      "Filling of choice: Nutella, strawberries, ham and cheese, etc."
    ]
  },
  quiche: {
    es: [
      "1 masa brisa (pâte brisée)",
      "200g de tocino o jamón, en cubitos",
      "200g de queso gruyère, rallado",
      "4 huevos",
      "200ml de crema de leche",
      "200ml de leche",
      "Nuez moscada, sal y pimienta"
    ],
    en: [
      "1 shortcrust pastry (pâte brisée)",
      "200g bacon or ham, diced",
      "200g gruyère cheese, grated",
      "4 eggs",
      "200ml heavy cream",
      "200ml milk",
      "Nutmeg, salt and pepper"
    ]
  },
  macaron: {
    es: [
      "100g de harina de almendras fina",
      "100g de azúcar glass",
      "2 claras de huevo (75g aprox.)",
      "75g de azúcar granulada",
      "Colorante en gel al gusto",
      "Relleno: ganache de chocolate, buttercream o mermelada"
    ],
    en: [
      "100g fine almond flour",
      "100g powdered sugar",
      "2 egg whites (about 75g)",
      "75g granulated sugar",
      "Gel food coloring of choice",
      "Filling: chocolate ganache, buttercream or jam"
    ]
  },
  "souffle": {
    es: [
      "200g de chocolate negro 70%, troceado",
      "100g de mantequilla",
      "4 huevos, separados",
      "50g de azúcar",
      "Mantequilla y azúcar para los moldes",
      "Azúcar glass para decorar",
      "Crema batida o helado para acompañar"
    ],
    en: [
      "200g 70% dark chocolate, chopped",
      "100g butter",
      "4 eggs, separated",
      "50g sugar",
      "Butter and sugar for the ramekins",
      "Powdered sugar for dusting",
      "Whipped cream or ice cream for serving"
    ]
  },

  // ══════════════ AMERICANAS (USA) ══════════════
  burger: {
    es: [
      "500g de carne de res molida (80/20)",
      "4 panes brioche para hamburguesa",
      "4 rebanadas de queso cheddar o americano",
      "Lechuga, tomate en rodajas, cebolla en aros",
      "Pepinillos encurtidos",
      "Ketchup, mostaza y mayonesa",
      "Sal y pimienta negra gruesa",
      "Papas fritas como acompañamiento"
    ],
    en: [
      "500g ground beef (80/20)",
      "4 brioche burger buns",
      "4 slices cheddar or American cheese",
      "Lettuce, sliced tomato, onion rings",
      "Dill pickles",
      "Ketchup, mustard and mayonnaise",
      "Salt and coarsely ground black pepper",
      "French fries as a side"
    ]
  },
  "mac and cheese": {
    es: [
      "400g de macarrones (elbow pasta)",
      "3 tazas de queso cheddar rallado",
      "2 tazas de leche entera",
      "3 cucharadas de mantequilla",
      "3 cucharadas de harina",
      "½ cucharadita de mostaza en polvo",
      "Sal, pimienta y nuez moscada",
      "Pan rallado y mantequilla para la costra (opcional)"
    ],
    en: [
      "400g elbow macaroni",
      "3 cups shredded cheddar cheese",
      "2 cups whole milk",
      "3 tablespoons butter",
      "3 tablespoons flour",
      "½ teaspoon mustard powder",
      "Salt, pepper and nutmeg",
      "Breadcrumbs and butter for topping (optional)"
    ]
  },
  pancake: {
    es: [
      "1½ tazas de harina de trigo",
      "3 cucharadas de azúcar",
      "1½ cucharaditas de polvo para hornear",
      "1 huevo grande",
      "1¼ tazas de leche",
      "3 cucharadas de mantequilla derretida",
      "1 cucharadita de vainilla",
      "Pizca de sal",
      "Miel de maple y mantequilla para servir"
    ],
    en: [
      "1½ cups all-purpose flour",
      "3 tablespoons sugar",
      "1½ teaspoons baking powder",
      "1 large egg",
      "1¼ cups milk",
      "3 tablespoons melted butter",
      "1 teaspoon vanilla",
      "Pinch of salt",
      "Maple syrup and butter for serving"
    ]
  },
  brownie: {
    es: [
      "200g de chocolate negro, troceado",
      "150g de mantequilla sin sal",
      "3 huevos grandes",
      "1 taza de azúcar",
      "½ taza de harina de trigo",
      "¼ cucharadita de sal",
      "1 cucharadita de vainilla",
      "½ taza de nueces picadas (opcional)"
    ],
    en: [
      "200g dark chocolate, chopped",
      "150g unsalted butter",
      "3 large eggs",
      "1 cup sugar",
      "½ cup all-purpose flour",
      "¼ teaspoon salt",
      "1 teaspoon vanilla",
      "½ cup chopped walnuts (optional)"
    ]
  },

  // ══════════════ GRIEGAS ══════════════
  moussaka: {
    es: [
      "3 berenjenas grandes, en rodajas",
      "500g de carne de cordero o res molida",
      "400g de tomate triturado",
      "1 cebolla, picada",
      "3 dientes de ajo",
      "Bechamel: 2 tazas leche, 2 cdas mantequilla, 2 cdas harina, nuez moscada",
      "½ taza de vino tinto",
      "Canela molida, sal, pimienta",
      "Aceite de oliva",
      "Queso parmesano rallado"
    ],
    en: [
      "3 large eggplants, sliced",
      "500g ground lamb or beef",
      "400g crushed tomatoes",
      "1 onion, chopped",
      "3 garlic cloves",
      "Béchamel: 2 cups milk, 2 tbsp butter, 2 tbsp flour, nutmeg",
      "½ cup red wine",
      "Ground cinnamon, salt, pepper",
      "Olive oil",
      "Grated parmesan cheese"
    ]
  },
  gyros: {
    es: [
      "500g de carne de cerdo o pollo, en tiras finas",
      "4 panes pita",
      "2 tomates, en rodajas",
      "1 cebolla roja, en aros",
      "Salsa tzatziki: yogur griego, pepino rallado, ajo, aceite de oliva",
      "Papas fritas (para servir dentro del gyro)",
      "Orégano, pimentón, ajo en polvo",
      "Aceite de oliva, sal y pimienta"
    ],
    en: [
      "500g pork or chicken, thinly sliced",
      "4 pita breads",
      "2 tomatoes, sliced",
      "1 red onion, sliced into rings",
      "Tzatziki sauce: Greek yogurt, grated cucumber, garlic, olive oil",
      "French fries (for serving inside the gyro)",
      "Oregano, paprika, garlic powder",
      "Olive oil, salt and pepper"
    ]
  },
  baklava: {
    es: [
      "500g de masa filo (phyllo)",
      "300g de nueces o pistachos, triturados",
      "200g de mantequilla sin sal, derretida",
      "Almíbar: 1 taza de azúcar, 1 taza de agua, ½ taza de miel",
      "1 cucharadita de canela",
      "Jugo de ½ limón",
      "¼ cucharadita de clavo molido"
    ],
    en: [
      "500g phyllo dough",
      "300g walnuts or pistachios, crushed",
      "200g unsalted butter, melted",
      "Syrup: 1 cup sugar, 1 cup water, ½ cup honey",
      "1 teaspoon cinnamon",
      "Juice of ½ lemon",
      "¼ teaspoon ground cloves"
    ]
  },
  souvlaki: {
    es: [
      "600g de pollo o cerdo, en cubos de 3cm",
      "Jugo de 2 limones",
      "3 cucharadas de aceite de oliva",
      "2 dientes de ajo, picados",
      "1 cucharadita de orégano seco",
      "Sal y pimienta",
      "Pan pita para servir",
      "Tzatziki, tomate y cebolla para acompañar",
      "Brochetas de madera o metal"
    ],
    en: [
      "600g chicken or pork, cut into 3cm cubes",
      "Juice of 2 lemons",
      "3 tablespoons olive oil",
      "2 garlic cloves, minced",
      "1 teaspoon dried oregano",
      "Salt and pepper",
      "Pita bread for serving",
      "Tzatziki, tomato and onion for serving",
      "Wooden or metal skewers"
    ]
  }
};

// ═══════════════════════════════════════════════════════════════
// FALLBACKS GENÉRICOS POR TIPO
// ═══════════════════════════════════════════════════════════════
const genericIngredients = {
  meat: {
    es: ["500g de carne (res, cerdo o pollo), en trozos", "1 cebolla grande, picada", "4 dientes de ajo, picados", "2 cucharadas de aceite", "Especias y hierbas aromáticas según la tradición del país", "Sal y pimienta al gusto", "Guarnición de arroz, pan o papas"],
    en: ["500g meat (beef, pork or chicken), cut into pieces", "1 large onion, chopped", "4 garlic cloves, minced", "2 tablespoons oil", "Spices and aromatic herbs from the country's tradition", "Salt and pepper to taste", "Rice, bread or potatoes as a side"]
  },
  seafood: {
    es: ["500g de pescado o mariscos frescos", "Jugo de 2 limones o limas", "2 dientes de ajo, picados", "Aceite de oliva", "Hierbas frescas (cilantro, perejil o eneldo)", "Sal de mar y pimienta", "Pan o arroz para acompañar"],
    en: ["500g fresh fish or seafood", "Juice of 2 lemons or limes", "2 garlic cloves, minced", "Olive oil", "Fresh herbs (cilantro, parsley or dill)", "Sea salt and pepper", "Bread or rice for serving"]
  },
  vegetarian: {
    es: ["400g de vegetales variados de temporada", "200g de legumbres o tofu", "1 cebolla grande, picada", "3 dientes de ajo", "2 cucharadas de aceite de oliva", "Especias y hierbas aromáticas", "Sal y pimienta al gusto"],
    en: ["400g assorted seasonal vegetables", "200g legumes or tofu", "1 large onion, chopped", "3 garlic cloves", "2 tablespoons olive oil", "Spices and aromatic herbs", "Salt and pepper to taste"]
  },
  desserts: {
    es: ["2 tazas de harina", "1 taza de azúcar", "3 huevos", "½ taza de mantequilla", "1 cucharadita de vainilla", "1 pizca de sal", "Frutas o decoración al gusto"],
    en: ["2 cups flour", "1 cup sugar", "3 eggs", "½ cup butter", "1 teaspoon vanilla", "1 pinch of salt", "Fruits or garnish to taste"]
  }
};

function getIngredientsBasedOnTitle(titleStr, categoryType) {
  const title = String(titleStr || '').toLowerCase();

  // Buscar keywords en orden de especificidad (más específicos primero)
  const keywordOrder = [
    "kung pao", "pad thai", "tom yum", "mango sticky", "mac and cheese",
    "dim sum", "lo mein", "arroz frito",
    "omurice", "ramen", "sushi", "tonkatsu", "teriyaki", "tempura", "mochi", "gyoza",
    "taco", "enchilada", "mole", "guacamole", "pozole", "tamale", "ceviche", "churro", "flan",
    "pizza", "risotto", "lasagna", "tiramisu", "carbonara", "gelato",
    "dumpling", "jiaozi", "pato", "agridulce", "rollito", "mapo", "berenjena",
    "curry", "tikka", "masala", "naan", "biryani", "samosa",
    "paella", "tortilla española", "gazpacho", "croqueta",
    "croissant", "crepe", "quiche", "macaron", "souffle",
    "burger", "hamburguesa", "pancake", "brownie",
    "moussaka", "gyros", "baklava", "souvlaki",
    "pasta", "spaghetti", "fideo", "salad", "ensalada"
  ];

  for (const keyword of keywordOrder) {
    if (title.includes(keyword)) {
      // Mapear keywords alternativos al banco correcto
      let bankKey = keyword;
      if (keyword === 'jiaozi') bankKey = 'dumpling';
      if (keyword === 'tikka' || keyword === 'masala') bankKey = 'curry';
      if (keyword === 'hamburguesa') bankKey = 'burger';
      if (keyword === 'spaghetti' || keyword === 'fideo') bankKey = 'pasta';
      if (keyword === 'ensalada') bankKey = 'salad';
      if (keyword === 'tortilla española') bankKey = 'tortilla';
      
      // Para "pasta" y "salad", usar los pasos genéricos del script de steps
      // ya que están definidos ahí
      
      if (ingredientsByKeyword[bankKey]) {
        return ingredientsByKeyword[bankKey];
      }
    }
  }

  // Fallback por tipo
  let typeKey = (categoryType || 'vegetarian').toLowerCase();
  if (typeKey === 'dessert') typeKey = 'desserts';
  return genericIngredients[typeKey] || genericIngredients.vegetarian;
}

async function updateIngredientsIntelligently() {
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
    console.log(`📊 Analizando los títulos de ${recipes.length} recetas para asignar ingredientes precisos...`);

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

      const ingData = getIngredientsBasedOnTitle(titleStr, r.category_type);
      
      // Verificar si se encontró un match específico
      const isGeneric = ingData === genericIngredients.meat || ingData === genericIngredients.seafood || 
                        ingData === genericIngredients.vegetarian || ingData === genericIngredients.desserts;
      if (!isGeneric) matched++;

      const formattedIngredients = ingData.es.map((ingEs, index) => ({
        es: ingEs,
        en: ingData.en[index] || ingEs
      }));

      const ingredientsJson = JSON.stringify(formattedIngredients);
      await remoteConn.query('UPDATE recipes SET ingredients = ? WHERE id = ?', [ingredientsJson, r.id]);
      
      updated++;
    }

    console.log(`✅ ¡Éxito! Se actualizaron los ingredientes de ${updated} recetas.`);
    console.log(`   📌 ${matched} recetas con ingredientes específicos por título.`);
    console.log(`   📌 ${updated - matched} recetas con ingredientes genéricos por tipo de comida.`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (remoteConn) remoteConn.release();
    remotePool.end();
  }
}

updateIngredientsIntelligently();
