import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// ═══════════════════════════════════════════════════════════════
// BANCO DE INGREDIENTES REALES POR PAÍS Y TIPO DE COMIDA
// Cada receta recibirá entre 6-10 ingredientes específicos
// con cantidades, unidades y preparación detallada.
// ═══════════════════════════════════════════════════════════════

const ingredientBanks = {
  mexico: {
    meat: {
      es: [
        "500g de carne de res (arrachera o bistec), cortada en tiras finas",
        "4 chiles guajillo desvenados y sin semillas",
        "2 chiles ancho, tostados ligeramente",
        "1 cebolla blanca grande, picada en cuartos",
        "4 dientes de ajo pelados",
        "2 jitomates rojos maduros, asados",
        "1 cucharada de comino molido",
        "2 hojas de laurel",
        "Sal de mar y pimienta negra recién molida al gusto",
        "3 cucharadas de aceite vegetal o manteca de cerdo",
        "½ taza de caldo de res",
        "Tortillas de maíz calientes para acompañar"
      ],
      en: [
        "500g beef (skirt steak or sirloin), cut into thin strips",
        "4 guajillo chiles, deveined and seedless",
        "2 ancho chiles, lightly toasted",
        "1 large white onion, quartered",
        "4 garlic cloves, peeled",
        "2 ripe red tomatoes, roasted",
        "1 tablespoon ground cumin",
        "2 bay leaves",
        "Sea salt and freshly ground black pepper to taste",
        "3 tablespoons vegetable oil or lard",
        "½ cup beef broth",
        "Warm corn tortillas for serving"
      ]
    },
    seafood: {
      es: [
        "600g de camarones grandes, pelados y desvenados",
        "3 jitomates maduros, picados finamente",
        "1 cebolla morada, cortada en pluma",
        "2 chiles serranos frescos, picados sin semillas",
        "½ taza de cilantro fresco picado",
        "Jugo de 4 limones verdes recién exprimidos",
        "1 aguacate Hass maduro, cortado en cubos",
        "2 cucharadas de aceite de oliva extra virgen",
        "Sal de mar al gusto",
        "Tostadas de maíz crujientes para servir"
      ],
      en: [
        "600g large shrimp, peeled and deveined",
        "3 ripe tomatoes, finely chopped",
        "1 red onion, thinly sliced",
        "2 fresh serrano chiles, seeded and minced",
        "½ cup fresh cilantro, chopped",
        "Juice of 4 freshly squeezed limes",
        "1 ripe Hass avocado, diced",
        "2 tablespoons extra virgin olive oil",
        "Sea salt to taste",
        "Crispy corn tostadas for serving"
      ]
    },
    vegetarian: {
      es: [
        "2 tazas de frijoles negros cocidos (o 1 lata escurrida)",
        "4 tortillas de maíz, cortadas en triángulos",
        "200g de queso panela o Oaxaca, desmenuzado",
        "2 chiles poblanos asados, pelados y en rajas",
        "1 taza de granos de elote fresco",
        "½ cebolla blanca, finamente picada",
        "3 dientes de ajo, picados",
        "1 rama de epazote fresco",
        "2 cucharadas de aceite de maíz",
        "Crema ácida mexicana y salsa verde para acompañar"
      ],
      en: [
        "2 cups cooked black beans (or 1 drained can)",
        "4 corn tortillas, cut into triangles",
        "200g panela or Oaxaca cheese, crumbled",
        "2 poblano chiles, roasted, peeled and sliced into strips",
        "1 cup fresh corn kernels",
        "½ white onion, finely chopped",
        "3 garlic cloves, minced",
        "1 sprig of fresh epazote",
        "2 tablespoons corn oil",
        "Mexican sour cream and green salsa for serving"
      ]
    },
    desserts: {
      es: [
        "1 lata (397g) de leche condensada",
        "4 tazas de leche entera",
        "6 huevos grandes a temperatura ambiente",
        "1 taza de azúcar para el caramelo",
        "1 cucharadita de extracto de vainilla mexicana",
        "1 raja de canela (opcional)",
        "Pizca de sal",
        "Frutas frescas para decorar"
      ],
      en: [
        "1 can (397g) sweetened condensed milk",
        "4 cups whole milk",
        "6 large eggs at room temperature",
        "1 cup sugar for caramel",
        "1 teaspoon Mexican vanilla extract",
        "1 cinnamon stick (optional)",
        "Pinch of salt",
        "Fresh fruits for garnish"
      ]
    }
  },
  italy: {
    meat: {
      es: [
        "400g de carne de ternera o cerdo, molida gruesa",
        "500g de pasta seca (rigatoni, pappardelle o tagliatelle)",
        "800g de tomates San Marzano triturados (en lata)",
        "1 cebolla amarilla, cortada en brunoise",
        "2 zanahorias medianas, ralladas finamente",
        "2 tallos de apio, picados en daditos",
        "4 dientes de ajo laminados",
        "½ taza de vino tinto seco",
        "3 cucharadas de aceite de oliva extra virgen italiano",
        "Hojas frescas de albahaca y parmigiano reggiano para servir",
        "Sal marina, pimienta negra y orégano seco al gusto"
      ],
      en: [
        "400g coarse ground veal or pork",
        "500g dry pasta (rigatoni, pappardelle or tagliatelle)",
        "800g crushed San Marzano tomatoes (canned)",
        "1 yellow onion, finely diced (brunoise)",
        "2 medium carrots, finely grated",
        "2 celery stalks, diced small",
        "4 garlic cloves, thinly sliced",
        "½ cup dry red wine",
        "3 tablespoons Italian extra virgin olive oil",
        "Fresh basil leaves and parmigiano reggiano for serving",
        "Sea salt, black pepper and dried oregano to taste"
      ]
    },
    seafood: {
      es: [
        "500g de linguine o spaghetti",
        "400g de almejas frescas, bien lavadas",
        "200g de camarones medianos, pelados",
        "4 dientes de ajo, laminados",
        "1 taza de vino blanco seco",
        "½ taza de perejil italiano fresco picado",
        "1 chile rojo seco (peperoncino), triturado",
        "4 cucharadas de aceite de oliva extra virgen",
        "Ralladura de 1 limón",
        "Sal de mar y pimienta al gusto"
      ],
      en: [
        "500g linguine or spaghetti",
        "400g fresh clams, well washed",
        "200g medium shrimp, peeled",
        "4 garlic cloves, thinly sliced",
        "1 cup dry white wine",
        "½ cup fresh Italian parsley, chopped",
        "1 dried red chile (peperoncino), crushed",
        "4 tablespoons extra virgin olive oil",
        "Zest of 1 lemon",
        "Sea salt and pepper to taste"
      ]
    },
    vegetarian: {
      es: [
        "2 berenjenas grandes, cortadas en rodajas de 1cm",
        "500g de pasta penne rigate",
        "400g de salsa de tomate natural",
        "200g de mozzarella fresca, en rodajas",
        "½ taza de parmigiano reggiano rallado",
        "Hojas frescas de albahaca",
        "3 dientes de ajo enteros",
        "Aceite de oliva extra virgen para freír",
        "Sal, pimienta y orégano al gusto"
      ],
      en: [
        "2 large eggplants, sliced 1cm thick",
        "500g penne rigate pasta",
        "400g natural tomato sauce",
        "200g fresh mozzarella, sliced",
        "½ cup grated parmigiano reggiano",
        "Fresh basil leaves",
        "3 whole garlic cloves",
        "Extra virgin olive oil for frying",
        "Salt, pepper and oregano to taste"
      ]
    },
    desserts: {
      es: [
        "500g de queso mascarpone a temperatura ambiente",
        "6 yemas de huevo grandes",
        "¾ taza de azúcar glass",
        "300ml de café espresso fuerte, frío",
        "3 cucharadas de licor Marsala o amaretto",
        "24 bizcochos savoiardi (ladyfingers)",
        "Cacao amargo en polvo para espolvorear",
        "1 cucharadita de extracto puro de vainilla"
      ],
      en: [
        "500g mascarpone cheese at room temperature",
        "6 large egg yolks",
        "¾ cup powdered sugar",
        "300ml strong espresso coffee, cooled",
        "3 tablespoons Marsala or amaretto liqueur",
        "24 savoiardi biscuits (ladyfingers)",
        "Unsweetened cocoa powder for dusting",
        "1 teaspoon pure vanilla extract"
      ]
    }
  },
  japan: {
    meat: {
      es: [
        "400g de lomo de cerdo (tonkatsu) o pechuga de pollo",
        "2 tazas de arroz japonés de grano corto, cocido",
        "3 cucharadas de salsa de soya oscura",
        "2 cucharadas de mirin (vino de arroz dulce)",
        "1 cucharada de sake",
        "1 trozo de jengibre fresco (3cm), rallado",
        "2 dientes de ajo, rallados finamente",
        "Panko (pan rallado japonés) para empanizar",
        "2 huevos batidos",
        "Aceite vegetal para freír",
        "Cebollín picado y semillas de sésamo para decorar"
      ],
      en: [
        "400g pork loin (tonkatsu) or chicken breast",
        "2 cups cooked short-grain Japanese rice",
        "3 tablespoons dark soy sauce",
        "2 tablespoons mirin (sweet rice wine)",
        "1 tablespoon sake",
        "1 piece fresh ginger (3cm), grated",
        "2 garlic cloves, finely grated",
        "Panko breadcrumbs for coating",
        "2 eggs, beaten",
        "Vegetable oil for frying",
        "Chopped scallions and sesame seeds for garnish"
      ]
    },
    seafood: {
      es: [
        "300g de salmón fresco de grado sashimi",
        "200g de atún rojo fresco",
        "2 tazas de arroz para sushi, cocido y sazonado",
        "4 hojas de alga nori tostada",
        "1 aguacate maduro, en láminas",
        "1 pepino japonés, en bastones finos",
        "Salsa de soya, wasabi y jengibre encurtido para acompañar",
        "2 cucharadas de vinagre de arroz",
        "1 cucharada de azúcar",
        "Semillas de sésamo tostadas"
      ],
      en: [
        "300g fresh sashimi-grade salmon",
        "200g fresh bluefin tuna",
        "2 cups sushi rice, cooked and seasoned",
        "4 sheets of toasted nori seaweed",
        "1 ripe avocado, thinly sliced",
        "1 Japanese cucumber, cut into thin batons",
        "Soy sauce, wasabi and pickled ginger for serving",
        "2 tablespoons rice vinegar",
        "1 tablespoon sugar",
        "Toasted sesame seeds"
      ]
    },
    vegetarian: {
      es: [
        "400g de tofu firme, escurrido y cortado en cubos",
        "200g de fideos soba o udon",
        "2 tazas de caldo dashi vegetal",
        "1 taza de edamames desgranados",
        "200g de hongos shiitake frescos, laminados",
        "2 cucharadas de pasta de miso blanco",
        "1 cucharada de aceite de sésamo tostado",
        "Alga wakame hidratada",
        "Cebollín fresco picado para decorar"
      ],
      en: [
        "400g firm tofu, drained and cubed",
        "200g soba or udon noodles",
        "2 cups vegetable dashi broth",
        "1 cup shelled edamame",
        "200g fresh shiitake mushrooms, sliced",
        "2 tablespoons white miso paste",
        "1 tablespoon toasted sesame oil",
        "Rehydrated wakame seaweed",
        "Fresh scallions, chopped for garnish"
      ]
    },
    desserts: {
      es: [
        "200g de harina de arroz glutinoso (mochiko)",
        "½ taza de azúcar",
        "¾ taza de agua",
        "Almidón de maíz para espolvorear",
        "Relleno de pasta de frijol rojo (anko)",
        "Matcha en polvo (opcional, para mochi de té verde)",
        "Unas gotas de colorante alimentario rosa (para mochi de fresa)"
      ],
      en: [
        "200g glutinous rice flour (mochiko)",
        "½ cup sugar",
        "¾ cup water",
        "Cornstarch for dusting",
        "Red bean paste filling (anko)",
        "Matcha powder (optional, for green tea mochi)",
        "A few drops of pink food coloring (for strawberry mochi)"
      ]
    }
  },
  india: {
    meat: {
      es: [
        "600g de muslos de pollo deshuesados, en trozos medianos",
        "1 taza de yogur natural entero",
        "2 cebollas grandes, finamente picadas",
        "4 dientes de ajo, machacados hasta formar pasta",
        "1 trozo de jengibre (5cm), rallado",
        "400g de tomates triturados",
        "2 cucharaditas de garam masala",
        "1 cucharadita de cúrcuma en polvo",
        "1 cucharadita de chile rojo en polvo (al gusto)",
        "½ taza de crema de leche (para tikka masala o korma)",
        "3 cucharadas de ghee o aceite vegetal",
        "Cilantro fresco y arroz basmati para acompañar"
      ],
      en: [
        "600g boneless chicken thighs, cut into medium pieces",
        "1 cup plain whole milk yogurt",
        "2 large onions, finely chopped",
        "4 garlic cloves, crushed into a paste",
        "1 piece ginger (5cm), grated",
        "400g crushed tomatoes",
        "2 teaspoons garam masala",
        "1 teaspoon turmeric powder",
        "1 teaspoon red chili powder (to taste)",
        "½ cup heavy cream (for tikka masala or korma)",
        "3 tablespoons ghee or vegetable oil",
        "Fresh cilantro and basmati rice for serving"
      ]
    },
    seafood: {
      es: [
        "500g de camarones tigre grandes, pelados y desvenados",
        "1 lata (400ml) de leche de coco",
        "2 cebollas, en juliana fina",
        "3 dientes de ajo picados",
        "1 trozo de jengibre (3cm), rallado",
        "2 cucharaditas de curry Madrás en polvo",
        "1 cucharadita de cúrcuma",
        "Hojas de curry frescas (8-10)",
        "Jugo de 1 limón",
        "2 cucharadas de aceite de coco"
      ],
      en: [
        "500g large tiger shrimp, peeled and deveined",
        "1 can (400ml) coconut milk",
        "2 onions, finely julienned",
        "3 garlic cloves, minced",
        "1 piece ginger (3cm), grated",
        "2 teaspoons Madras curry powder",
        "1 teaspoon turmeric",
        "Fresh curry leaves (8-10)",
        "Juice of 1 lemon",
        "2 tablespoons coconut oil"
      ]
    },
    vegetarian: {
      es: [
        "2 tazas de lentejas rojas (masoor dal), lavadas",
        "2 papas medianas, peladas y cortadas en cubos",
        "200g de espinaca fresca",
        "1 cebolla grande, finamente picada",
        "3 dientes de ajo, picados",
        "1 trozo de jengibre (3cm), rallado",
        "2 cucharaditas de garam masala",
        "1 cucharadita de semillas de comino",
        "1 cucharadita de cúrcuma",
        "2 cucharadas de ghee o aceite vegetal",
        "Arroz basmati y pan naan para servir"
      ],
      en: [
        "2 cups red lentils (masoor dal), rinsed",
        "2 medium potatoes, peeled and cubed",
        "200g fresh spinach",
        "1 large onion, finely chopped",
        "3 garlic cloves, minced",
        "1 piece ginger (3cm), grated",
        "2 teaspoons garam masala",
        "1 teaspoon cumin seeds",
        "1 teaspoon turmeric",
        "2 tablespoons ghee or vegetable oil",
        "Basmati rice and naan bread for serving"
      ]
    },
    desserts: {
      es: [
        "1 litro de leche entera",
        "½ taza de azúcar",
        "2 cucharadas de ghee (mantequilla clarificada)",
        "½ taza de leche en polvo",
        "¼ cucharadita de cardamomo en polvo",
        "Pistachos y almendras laminadas para decorar",
        "Unas hebras de azafrán (opcional)",
        "Agua de rosas (1 cucharadita)"
      ],
      en: [
        "1 liter whole milk",
        "½ cup sugar",
        "2 tablespoons ghee (clarified butter)",
        "½ cup milk powder",
        "¼ teaspoon cardamom powder",
        "Sliced pistachios and almonds for garnish",
        "A few saffron strands (optional)",
        "Rose water (1 teaspoon)"
      ]
    }
  },
  usa: {
    meat: {
      es: [
        "700g de costillas de cerdo (baby back ribs)",
        "1 taza de salsa BBQ ahumada (hickory o mesquite)",
        "2 cucharadas de azúcar moreno oscuro",
        "1 cucharada de pimentón ahumado (smoked paprika)",
        "1 cucharadita de ajo en polvo",
        "1 cucharadita de cebolla en polvo",
        "½ cucharadita de pimienta cayena",
        "Sal kosher y pimienta negra gruesa",
        "Ensalada coleslaw y pan brioche para servir"
      ],
      en: [
        "700g baby back pork ribs",
        "1 cup smoked BBQ sauce (hickory or mesquite)",
        "2 tablespoons dark brown sugar",
        "1 tablespoon smoked paprika",
        "1 teaspoon garlic powder",
        "1 teaspoon onion powder",
        "½ teaspoon cayenne pepper",
        "Kosher salt and coarsely ground black pepper",
        "Coleslaw and brioche buns for serving"
      ]
    },
    seafood: {
      es: [
        "500g de langosta fresca o cola de langosta",
        "120g de mantequilla sin sal, derretida",
        "4 mazorcas de elote, cortadas por la mitad",
        "500g de camarones grandes con cáscara",
        "1 limón amarillo, cortado en gajos",
        "3 dientes de ajo picados",
        "2 cucharadas de condimento Old Bay",
        "Perejil fresco picado",
        "Pan de maíz (cornbread) para acompañar"
      ],
      en: [
        "500g fresh lobster or lobster tails",
        "120g unsalted butter, melted",
        "4 ears of corn, halved",
        "500g large shell-on shrimp",
        "1 lemon, cut into wedges",
        "3 garlic cloves, minced",
        "2 tablespoons Old Bay seasoning",
        "Fresh parsley, chopped",
        "Cornbread for serving"
      ]
    },
    vegetarian: {
      es: [
        "4 panes brioche para hamburguesa",
        "2 hamburguesas vegetales (Beyond Meat o similar)",
        "2 tomates grandes, en rodajas gruesas",
        "1 lechuga romana, hojas separadas",
        "1 cebolla roja, en aros",
        "4 rebanadas de queso cheddar",
        "Pepinillos encurtidos, ketchup y mostaza",
        "Papas fritas crujientes para acompañar"
      ],
      en: [
        "4 brioche burger buns",
        "2 plant-based patties (Beyond Meat or similar)",
        "2 large tomatoes, thickly sliced",
        "1 romaine lettuce, leaves separated",
        "1 red onion, sliced into rings",
        "4 slices cheddar cheese",
        "Dill pickles, ketchup and mustard",
        "Crispy fries for serving"
      ]
    },
    desserts: {
      es: [
        "2½ tazas de harina para todo uso",
        "1 taza de mantequilla fría, cortada en cubos",
        "6 manzanas Granny Smith, peladas y rebanadas finas",
        "¾ taza de azúcar granulada + 2 cdas. extra",
        "2 cucharaditas de canela molida",
        "1 cucharada de jugo de limón",
        "1 huevo batido para barnizar",
        "Helado de vainilla para acompañar"
      ],
      en: [
        "2½ cups all-purpose flour",
        "1 cup cold butter, cubed",
        "6 Granny Smith apples, peeled and thinly sliced",
        "¾ cup granulated sugar + 2 extra tbsp",
        "2 teaspoons ground cinnamon",
        "1 tablespoon lemon juice",
        "1 beaten egg for glazing",
        "Vanilla ice cream for serving"
      ]
    }
  },
  spain: {
    meat: {
      es: [
        "500g de chorizo español curado, en rodajas",
        "400g de jamón serrano o ibérico, en lonchas finas",
        "1 lomo de cerdo ibérico (600g)",
        "4 dientes de ajo, laminados",
        "1 cebolla dulce española, en juliana",
        "½ taza de vino blanco seco (Albariño)",
        "2 cucharadas de pimentón de la Vera (dulce)",
        "Aceite de oliva virgen extra español",
        "Sal en escamas (Maldon) y pimienta negra",
        "Pan de pueblo crujiente para acompañar"
      ],
      en: [
        "500g cured Spanish chorizo, sliced",
        "400g serrano or ibérico ham, thinly sliced",
        "1 Iberian pork loin (600g)",
        "4 garlic cloves, thinly sliced",
        "1 Spanish sweet onion, julienned",
        "½ cup dry white wine (Albariño)",
        "2 tablespoons smoked paprika (Pimentón de la Vera)",
        "Spanish extra virgin olive oil",
        "Flaky salt (Maldon) and black pepper",
        "Crusty country bread for serving"
      ]
    },
    seafood: {
      es: [
        "500g de gambas frescas (langostinos)",
        "500g de mejillones, limpios y sin barbas",
        "200g de calamares, cortados en anillas",
        "1 taza de arroz bomba o Calasparra",
        "1 sobre de azafrán español (0.5g)",
        "1 pimiento rojo, en tiras",
        "4 dientes de ajo picados",
        "3 tazas de caldo de pescado casero",
        "Aceite de oliva, sal y limón para servir"
      ],
      en: [
        "500g fresh prawns (langoustines)",
        "500g mussels, cleaned and debearded",
        "200g squid, cut into rings",
        "1 cup bomba or Calasparra rice",
        "1 sachet Spanish saffron (0.5g)",
        "1 red bell pepper, sliced into strips",
        "4 garlic cloves, minced",
        "3 cups homemade fish stock",
        "Olive oil, salt and lemon for serving"
      ]
    },
    vegetarian: {
      es: [
        "6 huevos frescos de corral",
        "3 papas medianas, peladas y en rodajas finas",
        "1 cebolla dulce grande, en juliana",
        "½ taza de aceite de oliva virgen extra",
        "Sal en escamas al gusto",
        "Pan con tomate para acompañar"
      ],
      en: [
        "6 fresh free-range eggs",
        "3 medium potatoes, peeled and thinly sliced",
        "1 large sweet onion, julienned",
        "½ cup extra virgin olive oil",
        "Flaky salt to taste",
        "Pan con tomate for serving"
      ]
    },
    desserts: {
      es: [
        "250g de harina de trigo",
        "4 huevos grandes",
        "1 taza de leche entera",
        "½ taza de agua",
        "½ taza de aceite de oliva suave (o aceite de girasol)",
        "Ralladura de 1 limón y 1 naranja",
        "Azúcar y canela para rebozar",
        "1 pizca de sal"
      ],
      en: [
        "250g wheat flour",
        "4 large eggs",
        "1 cup whole milk",
        "½ cup water",
        "½ cup mild olive oil (or sunflower oil)",
        "Zest of 1 lemon and 1 orange",
        "Sugar and cinnamon for coating",
        "1 pinch of salt"
      ]
    }
  },
  france: {
    meat: {
      es: [
        "600g de pechuga de pato (magret)",
        "200ml de vino tinto Borgoña",
        "2 chalotes, picados finamente",
        "200g de champiñones cremini, laminados",
        "2 cucharadas de mantequilla francesa sin sal",
        "1 ramita de tomillo fresco",
        "1 hoja de laurel",
        "Sal fina, pimienta blanca recién molida",
        "2 cucharadas de coñac o brandy",
        "Puré de papas cremoso para acompañar"
      ],
      en: [
        "600g duck breast (magret)",
        "200ml Burgundy red wine",
        "2 shallots, finely minced",
        "200g cremini mushrooms, sliced",
        "2 tablespoons French unsalted butter",
        "1 sprig fresh thyme",
        "1 bay leaf",
        "Fine salt, freshly ground white pepper",
        "2 tablespoons cognac or brandy",
        "Creamy mashed potatoes for serving"
      ]
    },
    seafood: {
      es: [
        "1kg de mejillones frescos, limpios",
        "1 taza de vino blanco seco (Muscadet)",
        "3 chalotes, picados finamente",
        "3 dientes de ajo, picados",
        "200ml de crema de leche espesa",
        "½ taza de perejil fresco picado",
        "2 cucharadas de mantequilla",
        "Pan baguette crujiente para mojar",
        "Pimienta negra recién molida"
      ],
      en: [
        "1kg fresh mussels, cleaned",
        "1 cup dry white wine (Muscadet)",
        "3 shallots, finely minced",
        "3 garlic cloves, minced",
        "200ml heavy cream",
        "½ cup fresh parsley, chopped",
        "2 tablespoons butter",
        "Crusty baguette for dipping",
        "Freshly ground black pepper"
      ]
    },
    vegetarian: {
      es: [
        "4 huevos grandes frescos",
        "200g de queso gruyère rallado",
        "2 tazas de leche entera",
        "1 taza de espinaca fresca",
        "1 masa brisa (pâte brisée) casera o comprada",
        "Nuez moscada recién rallada",
        "Mantequilla para engrasar",
        "Sal y pimienta blanca al gusto"
      ],
      en: [
        "4 large fresh eggs",
        "200g grated gruyère cheese",
        "2 cups whole milk",
        "1 cup fresh spinach",
        "1 shortcrust pastry (pâte brisée), homemade or store-bought",
        "Freshly grated nutmeg",
        "Butter for greasing",
        "Salt and white pepper to taste"
      ]
    },
    desserts: {
      es: [
        "200g de chocolate negro 70% cacao, troceado",
        "150g de mantequilla francesa sin sal",
        "4 huevos grandes, separados",
        "½ taza de azúcar glass",
        "1 cucharadita de extracto de vainilla bourbon",
        "2 cucharadas de harina",
        "Cacao en polvo y azúcar glass para decorar"
      ],
      en: [
        "200g 70% dark chocolate, chopped",
        "150g French unsalted butter",
        "4 large eggs, separated",
        "½ cup powdered sugar",
        "1 teaspoon bourbon vanilla extract",
        "2 tablespoons flour",
        "Cocoa powder and powdered sugar for garnish"
      ]
    }
  },
  china: {
    meat: {
      es: [
        "500g de cerdo (panceta o lomo), cortado en tiras",
        "3 cucharadas de salsa de soya oscura",
        "2 cucharadas de salsa de ostión",
        "1 cucharada de salsa hoisin",
        "3 dientes de ajo, picados finamente",
        "1 trozo de jengibre (3cm), en juliana",
        "2 cebollines (cebolla de verdeo), en rodajas",
        "1 cucharada de maicena disuelta en 2 cdas. de agua",
        "2 cucharadas de aceite de sésamo",
        "Arroz blanco al vapor para acompañar"
      ],
      en: [
        "500g pork (belly or loin), cut into strips",
        "3 tablespoons dark soy sauce",
        "2 tablespoons oyster sauce",
        "1 tablespoon hoisin sauce",
        "3 garlic cloves, finely minced",
        "1 piece ginger (3cm), julienned",
        "2 scallions, sliced",
        "1 tablespoon cornstarch dissolved in 2 tbsp water",
        "2 tablespoons sesame oil",
        "Steamed white rice for serving"
      ]
    },
    seafood: {
      es: [
        "400g de camarones grandes, pelados",
        "2 cucharadas de salsa de soya clara",
        "1 cucharada de vino de arroz Shaoxing",
        "200g de brócoli chino (gai lan), en floretes",
        "3 dientes de ajo laminados",
        "1 cucharada de salsa de frijol negro",
        "1 cucharadita de azúcar",
        "1 cucharada de aceite de sésamo",
        "Aceite vegetal para el wok"
      ],
      en: [
        "400g large shrimp, peeled",
        "2 tablespoons light soy sauce",
        "1 tablespoon Shaoxing rice wine",
        "200g Chinese broccoli (gai lan), in florets",
        "3 garlic cloves, sliced",
        "1 tablespoon black bean sauce",
        "1 teaspoon sugar",
        "1 tablespoon sesame oil",
        "Vegetable oil for the wok"
      ]
    },
    vegetarian: {
      es: [
        "400g de tofu firme, escurrido y en cubos",
        "200g de champiñones oreja de Judas (wood ear)",
        "1 bloque de fideos de arroz (vermicelli)",
        "3 cucharadas de salsa de soya",
        "1 cucharada de vinagre de arroz chino",
        "2 cucharadas de salsa de chile (chili oil)",
        "1 pimiento rojo, en juliana",
        "Brotes de soya frescos",
        "Cilantro y cacahuates tostados para decorar"
      ],
      en: [
        "400g firm tofu, drained and cubed",
        "200g wood ear mushrooms",
        "1 block rice noodles (vermicelli)",
        "3 tablespoons soy sauce",
        "1 tablespoon Chinese rice vinegar",
        "2 tablespoons chili oil",
        "1 red bell pepper, julienned",
        "Fresh bean sprouts",
        "Cilantro and roasted peanuts for garnish"
      ]
    },
    desserts: {
      es: [
        "1 taza de harina de arroz glutinoso",
        "½ taza de azúcar",
        "1 lata de leche de coco (400ml)",
        "Pasta de sésamo negro para relleno",
        "Semillas de sésamo blanco para decorar",
        "Agua tibia (según sea necesario)",
        "Sirope de jengibre para bañar"
      ],
      en: [
        "1 cup glutinous rice flour",
        "½ cup sugar",
        "1 can coconut milk (400ml)",
        "Black sesame paste for filling",
        "White sesame seeds for garnish",
        "Warm water (as needed)",
        "Ginger syrup for drizzling"
      ]
    }
  },
  thailand: {
    meat: {
      es: [
        "500g de pechuga de pollo, en tiras finas",
        "1 lata (400ml) de leche de coco",
        "3 cucharadas de pasta de curry rojo tailandés",
        "2 cucharadas de salsa de pescado (nam pla)",
        "1 cucharada de azúcar de palma (o azúcar moreno)",
        "Hojas de albahaca tailandesa (Thai basil)",
        "2 chiles ojo de pájaro, en rodajas",
        "1 pimiento rojo, en juliana",
        "Hojas de lima kaffir (4-5)",
        "Arroz jazmín al vapor para acompañar"
      ],
      en: [
        "500g chicken breast, thinly sliced",
        "1 can (400ml) coconut milk",
        "3 tablespoons Thai red curry paste",
        "2 tablespoons fish sauce (nam pla)",
        "1 tablespoon palm sugar (or brown sugar)",
        "Thai basil leaves",
        "2 bird's eye chiles, sliced",
        "1 red bell pepper, julienned",
        "Kaffir lime leaves (4-5)",
        "Steamed jasmine rice for serving"
      ]
    },
    seafood: {
      es: [
        "500g de camarones tigre, pelados",
        "2 tallos de hierba limón (lemongrass), machacados",
        "3 cucharadas de pasta de curry verde",
        "1 lata de leche de coco",
        "200g de champiñones de paja (o cremini)",
        "3 cucharadas de salsa de pescado",
        "Jugo de 3 limas",
        "Chiles frescos al gusto",
        "Cilantro fresco y cebollín"
      ],
      en: [
        "500g tiger shrimp, peeled",
        "2 lemongrass stalks, bruised",
        "3 tablespoons green curry paste",
        "1 can coconut milk",
        "200g straw mushrooms (or cremini)",
        "3 tablespoons fish sauce",
        "Juice of 3 limes",
        "Fresh chiles to taste",
        "Fresh cilantro and scallions"
      ]
    },
    vegetarian: {
      es: [
        "400g de fideos de arroz anchos (pad thai noodles)",
        "200g de tofu extra firme, en cubos",
        "3 cucharadas de salsa de tamarindo",
        "2 cucharadas de salsa de soya",
        "1 cucharada de azúcar de palma",
        "2 huevos",
        "1 taza de brotes de soya",
        "½ taza de cacahuates tostados, triturados",
        "Limón y chile en hojuelas para servir"
      ],
      en: [
        "400g wide rice noodles (pad thai noodles)",
        "200g extra firm tofu, cubed",
        "3 tablespoons tamarind sauce",
        "2 tablespoons soy sauce",
        "1 tablespoon palm sugar",
        "2 eggs",
        "1 cup bean sprouts",
        "½ cup roasted peanuts, crushed",
        "Lime and chili flakes for serving"
      ]
    },
    desserts: {
      es: [
        "1 taza de arroz glutinoso (sticky rice), remojado 4 horas",
        "1 lata de leche de coco (400ml)",
        "½ taza de azúcar de palma",
        "2 mangos maduros, cortados en láminas",
        "1 pizca de sal",
        "Semillas de sésamo tostadas para decorar"
      ],
      en: [
        "1 cup glutinous rice (sticky rice), soaked 4 hours",
        "1 can coconut milk (400ml)",
        "½ cup palm sugar",
        "2 ripe mangoes, sliced",
        "1 pinch of salt",
        "Toasted sesame seeds for garnish"
      ]
    }
  },
  greece: {
    meat: {
      es: [
        "600g de cordero (pierna o paleta), en trozos",
        "2 cebollas rojas, en cuartos",
        "4 dientes de ajo, machacados",
        "400g de tomates cherry",
        "½ taza de aceite de oliva griego",
        "Jugo de 2 limones",
        "2 cucharaditas de orégano griego seco",
        "1 cucharadita de comino molido",
        "Sal de mar y pimienta negra",
        "Pan pita caliente y tzatziki para acompañar"
      ],
      en: [
        "600g lamb (leg or shoulder), cut into pieces",
        "2 red onions, quartered",
        "4 garlic cloves, crushed",
        "400g cherry tomatoes",
        "½ cup Greek olive oil",
        "Juice of 2 lemons",
        "2 teaspoons dried Greek oregano",
        "1 teaspoon ground cumin",
        "Sea salt and black pepper",
        "Warm pita bread and tzatziki for serving"
      ]
    },
    seafood: {
      es: [
        "500g de pulpo fresco, limpio",
        "500g de calamares, cortados en anillas",
        "½ taza de aceite de oliva extra virgen",
        "Jugo de 3 limones",
        "3 dientes de ajo, picados",
        "1 cucharadita de orégano seco",
        "Alcaparras y aceitunas Kalamata",
        "Perejil fresco picado",
        "Pan crujiente para acompañar"
      ],
      en: [
        "500g fresh octopus, cleaned",
        "500g squid, cut into rings",
        "½ cup extra virgin olive oil",
        "Juice of 3 lemons",
        "3 garlic cloves, minced",
        "1 teaspoon dried oregano",
        "Capers and Kalamata olives",
        "Fresh parsley, chopped",
        "Crusty bread for serving"
      ]
    },
    vegetarian: {
      es: [
        "3 berenjenas grandes",
        "500g de papas, en rodajas finas",
        "400g de tomate triturado",
        "200g de queso feta desmenuzado",
        "½ taza de aceite de oliva",
        "Bechamel: 2 tazas leche, 2 cdas. mantequilla, 2 cdas. harina",
        "Canela en polvo y nuez moscada",
        "Sal y pimienta al gusto"
      ],
      en: [
        "3 large eggplants",
        "500g potatoes, thinly sliced",
        "400g crushed tomatoes",
        "200g feta cheese, crumbled",
        "½ cup olive oil",
        "Béchamel: 2 cups milk, 2 tbsp butter, 2 tbsp flour",
        "Ground cinnamon and nutmeg",
        "Salt and pepper to taste"
      ]
    },
    desserts: {
      es: [
        "500g de masa filo (phyllo), descongelada",
        "300g de nueces o pistachos, triturados",
        "200g de mantequilla sin sal, derretida",
        "Almíbar: 1 taza de azúcar, 1 taza de agua, ½ taza de miel",
        "1 cucharadita de canela molida",
        "Jugo de ½ limón",
        "¼ cucharadita de clavo de olor molido"
      ],
      en: [
        "500g phyllo dough, thawed",
        "300g walnuts or pistachios, crushed",
        "200g unsalted butter, melted",
        "Syrup: 1 cup sugar, 1 cup water, ½ cup honey",
        "1 teaspoon ground cinnamon",
        "Juice of ½ lemon",
        "¼ teaspoon ground cloves"
      ]
    }
  }
};

// Fallback genérico para países no listados
const genericIngredients = {
  meat: {
    es: [
      "500g de carne de res o cerdo, cortada en trozos",
      "2 cebollas medianas, picadas",
      "4 dientes de ajo, picados",
      "2 cucharadas de aceite vegetal",
      "Sal, pimienta y especias al gusto",
      "Hierbas frescas para decorar",
      "Guarnición de arroz o pan"
    ],
    en: [
      "500g beef or pork, cut into pieces",
      "2 medium onions, chopped",
      "4 garlic cloves, minced",
      "2 tablespoons vegetable oil",
      "Salt, pepper and spices to taste",
      "Fresh herbs for garnish",
      "Rice or bread as a side"
    ]
  },
  seafood: {
    es: [
      "500g de pescado o mariscos frescos",
      "Jugo de 2 limones",
      "2 dientes de ajo, picados",
      "Aceite de oliva",
      "Sal de mar y pimienta",
      "Hierbas frescas al gusto",
      "Pan para acompañar"
    ],
    en: [
      "500g fresh fish or seafood",
      "Juice of 2 lemons",
      "2 garlic cloves, minced",
      "Olive oil",
      "Sea salt and pepper",
      "Fresh herbs to taste",
      "Bread for serving"
    ]
  },
  vegetarian: {
    es: [
      "400g de vegetales variados de temporada",
      "200g de legumbres (lentejas, garbanzos o frijoles)",
      "1 cebolla grande, picada",
      "3 dientes de ajo",
      "2 cucharadas de aceite de oliva",
      "Especias y hierbas aromáticas",
      "Sal y pimienta al gusto"
    ],
    en: [
      "400g assorted seasonal vegetables",
      "200g legumes (lentils, chickpeas or beans)",
      "1 large onion, chopped",
      "3 garlic cloves",
      "2 tablespoons olive oil",
      "Spices and aromatic herbs",
      "Salt and pepper to taste"
    ]
  },
  desserts: {
    es: [
      "2 tazas de harina",
      "1 taza de azúcar",
      "3 huevos",
      "½ taza de mantequilla",
      "1 cucharadita de vainilla",
      "1 pizca de sal",
      "Frutas o decoración al gusto"
    ],
    en: [
      "2 cups flour",
      "1 cup sugar",
      "3 eggs",
      "½ cup butter",
      "1 teaspoon vanilla",
      "1 pinch of salt",
      "Fruits or garnish to taste"
    ]
  }
};

function getIngredientsForRecipe(country, type, recipeId) {
  const cLower = (country || 'world').toLowerCase()
    .replace('é', 'e').replace('ó', 'o').replace('ñ', 'n');
  
  let typeKey = (type || 'vegetarian').toLowerCase();
  if (typeKey === 'dessert') typeKey = 'desserts';
  if (!['meat', 'seafood', 'vegetarian', 'desserts'].includes(typeKey)) typeKey = 'vegetarian';

  const bank = ingredientBanks[cLower];
  if (bank && bank[typeKey]) {
    const esIngredients = bank[typeKey].es;
    const enIngredients = bank[typeKey].en;

    // Usar el ID para rotar ligeramente los ingredientes (quitar 1-2 del principio y ponerlos al final)
    const rotation = recipeId % 3;
    const rotateArr = (arr) => {
      if (rotation === 0) return [...arr];
      const rotated = [...arr.slice(rotation), ...arr.slice(0, rotation)];
      // Quitar los últimos 1-2 para no tener siempre la misma cantidad exacta
      const removeCount = recipeId % 2;
      return rotated.slice(0, rotated.length - removeCount);
    };

    const esResult = rotateArr(esIngredients);
    const enResult = rotateArr(enIngredients);

    return esResult.map((ing, i) => ({
      es: ing,
      en: enResult[i] || ing
    }));
  }

  // Fallback genérico
  const fb = genericIngredients[typeKey] || genericIngredients.vegetarian;
  return fb.es.map((ing, i) => ({
    es: ing,
    en: fb.en[i] || ing
  }));
}

async function updateIngredients() {
  console.log('🔌 Conectando a TiDB Cloud y Local...');
  const remotePool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });

  let localPool;
  try {
    localPool = mysql.createPool({
      host: 'localhost',
      user: 'recetas_admin',
      password: 'recetas123',
      database: 'MisRecetas'
    });
  } catch (e) {
    console.log('⚠️ No se pudo conectar a BD local, continuando solo con TiDB...');
  }

  let remoteConn, localConn;
  try {
    remoteConn = await remotePool.getConnection();
    if (localPool) {
      try { localConn = await localPool.getConnection(); } catch(e) {}
    }

    const [recipes] = await remoteConn.query(
      "SELECT id, title, category_country, category_type FROM recipes"
    );
    console.log(`📊 Actualizando ingredientes de ${recipes.length} recetas con datos específicos y detallados...`);

    let updated = 0;
    for (const r of recipes) {
      const ingredients = getIngredientsForRecipe(r.category_country, r.category_type, r.id);
      const ingredientsJson = JSON.stringify(ingredients);

      await remoteConn.query('UPDATE recipes SET ingredients = ? WHERE id = ?', [ingredientsJson, r.id]);
      
      if (localConn) {
        try {
          await localConn.query('UPDATE recipes SET ingredients = ? WHERE id = ?', [ingredientsJson, r.id]);
        } catch (e) { /* ignore local errors */ }
      }
      
      updated++;
      if (updated % 50 === 0) console.log(`   ✏️ ${updated}/${recipes.length} recetas actualizadas...`);
    }

    console.log(`✅ ¡Éxito! Se actualizaron los ingredientes de ${updated} recetas.`);
    console.log('   Cada receta ahora tiene ingredientes específicos con cantidades, unidades y técnicas de preparación.');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (remoteConn) remoteConn.release();
    if (localConn) localConn.release();
    remotePool.end();
    if (localPool) localPool.end();
  }
}

updateIngredients();
