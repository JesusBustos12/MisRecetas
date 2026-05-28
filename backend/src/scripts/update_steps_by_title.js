import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// ═══════════════════════════════════════════════════════════════
// BANCO DE PASOS INTELIGENTE BASADO EN EL TÍTULO DE LA RECETA
// ═══════════════════════════════════════════════════════════════

const intelligentSteps = {
  // === JAPÓN ===
  omurice: {
    es: [
      "Pica finamente la cebolla, la zanahoria y el pollo. Calienta aceite en una sartén a fuego medio-alto.",
      "Sofríe el pollo hasta que cambie de color. Agrega la cebolla y la zanahoria y cocina por 3 minutos.",
      "Añade el arroz cocido a la sartén y mezcla bien. Incorpora ketchup, sal y pimienta. Saltea por 2 minutos. Reserva el arroz frito en un plato.",
      "Bate los huevos en un bol con una pizca de sal y un chorrito de leche para mayor esponjosidad.",
      "Calienta mantequilla en una sartén limpia a fuego medio. Vierte los huevos batidos y revuelve rápidamente con palillos. Antes de que el huevo cuaje por completo, coloca el arroz frito en el centro.",
      "Con cuidado, dobla los bordes del omelette sobre el arroz formando una forma ovalada. Voltea sobre el plato de servir.",
      "Decora la superficie con ketchup y sirve inmediatamente."
    ],
    en: [
      "Finely chop the onion, carrot and chicken. Heat oil in a skillet over medium-high heat.",
      "Sauté the chicken until it changes color. Add the onion and carrot and cook for 3 minutes.",
      "Add cooked rice to the skillet and mix well. Stir in ketchup, salt and pepper. Stir-fry for 2 minutes. Set the fried rice aside on a plate.",
      "Beat the eggs in a bowl with a pinch of salt and a splash of milk for fluffiness.",
      "Heat butter in a clean skillet over medium heat. Pour in the beaten eggs and stir quickly with chopsticks. Before the egg sets completely, place the fried rice in the center.",
      "Carefully fold the edges of the omelet over the rice into an oval shape. Flip onto a serving plate.",
      "Decorate the top with ketchup and serve immediately."
    ]
  },
  ramen: {
    es: [
      "Prepara el caldo calentando fondo de cerdo o pollo con dashi, ajo machacado, jengibre y cebolla de verdeo a fuego lento durante 30 minutos.",
      "En una olla pequeña, hierve los huevos durante exactamente 6 minutos y medio. Enfríalos en agua con hielo, pélalos y marínalos en salsa de soya y mirin.",
      "Calienta el chashu (panceta de cerdo asada) en una sartén hasta que esté ligeramente dorado.",
      "Cocina los fideos ramen en agua hirviendo sin sal durante 1 a 2 minutos (según las instrucciones del paquete) hasta que estén al dente.",
      "En un tazón hondo, coloca la base de sabor (tare de soya o miso) y vierte el caldo muy caliente. Mezcla bien.",
      "Escurre los fideos y agrégalos al caldo, doblando suavemente para que queden presentables.",
      "Decora con el chashu, el huevo cortado por la mitad, cebollín fresco picado, alga nori y unas gotas de aceite de sésamo o ají."
    ],
    en: [
      "Prepare the broth by simmering pork or chicken stock with dashi, crushed garlic, ginger and scallions on low heat for 30 minutes.",
      "In a small pot, boil the eggs for exactly 6 and a half minutes. Cool them in an ice bath, peel and marinate in soy sauce and mirin.",
      "Heat the chashu (roasted pork belly) in a skillet until slightly golden.",
      "Cook the ramen noodles in boiling unsalted water for 1 to 2 minutes (according to package instructions) until al dente.",
      "In a deep bowl, place the flavor base (soy or miso tare) and pour in the very hot broth. Mix well.",
      "Drain the noodles and add them to the broth, folding them gently to look presentable.",
      "Garnish with the chashu, the halved egg, fresh chopped scallions, nori seaweed and a few drops of sesame or chili oil."
    ]
  },
  sushi: {
    es: [
      "Lava el arroz para sushi en agua fría hasta que el agua salga clara. Cocínalo en arrocera o en olla con la cantidad de agua indicada.",
      "Mientras el arroz está caliente, sazona con la mezcla de vinagre de arroz, azúcar y sal. Abanica mientras mezclas para enfriarlo.",
      "Corta el pescado fresco en tiras delgadas con un cuchillo afilado. Corta pepino y aguacate en bastones finos.",
      "Coloca una hoja de nori sobre una esterilla de bambú. Extiende una capa fina de arroz, dejando un margen en la parte superior.",
      "Coloca el pescado y los vegetales en el centro del arroz. Enrolla firmemente usando la esterilla, presionando suavemente.",
      "Corta el rollo en 6 u 8 piezas con un cuchillo ligeramente humedecido.",
      "Sirve con wasabi, jengibre encurtido y salsa de soya."
    ],
    en: [
      "Wash the sushi rice in cold water until the water runs clear. Cook in a rice cooker or pot with the indicated amount of water.",
      "While the rice is hot, season with the rice vinegar, sugar and salt mixture. Fan while mixing to cool it down.",
      "Cut the fresh fish into thin strips with a sharp knife. Cut cucumber and avocado into thin batons.",
      "Place a nori sheet on a bamboo mat. Spread a thin layer of rice, leaving a margin at the top.",
      "Place the fish and vegetables in the center of the rice. Roll firmly using the mat, pressing gently.",
      "Cut the roll into 6 or 8 pieces with a slightly moistened knife.",
      "Serve with wasabi, pickled ginger and soy sauce."
    ]
  },
  
  // === COMIDA RÁPIDA / CASERA ===
  burger: {
    es: [
      "Forma la carne en discos de aproximadamente 2 cm de grosor. Haz una leve hendidura en el centro para evitar que se abomben al cocinar.",
      "Sazona generosamente ambos lados de la carne con sal y pimienta justo antes de cocinar.",
      "Calienta una sartén de hierro fundido o parrilla a fuego medio-alto. Unta un poco de mantequilla en los panes y tuéstalos hasta que estén dorados. Reserva.",
      "Cocina la carne durante 3-4 minutos por lado para un término medio. Si usas queso, colócalo sobre la carne durante el último minuto y tapa para que se funda.",
      "Prepara la base del pan con la salsa de tu elección (ketchup, mostaza o mayonesa). Añade la lechuga y el tomate.",
      "Coloca la carne caliente con el queso fundido sobre los vegetales.",
      "Añade pepinillos o cebolla caramelizada, cierra la hamburguesa y sirve de inmediato."
    ],
    en: [
      "Form the meat into patties about 2 cm thick. Make a slight indentation in the center to prevent them from puffing up while cooking.",
      "Generously season both sides of the meat with salt and pepper right before cooking.",
      "Heat a cast iron skillet or grill over medium-high heat. Butter the buns and toast until golden. Set aside.",
      "Cook the patties for 3-4 minutes per side for medium doneness. If using cheese, place it on the meat during the last minute and cover to melt.",
      "Prepare the bottom bun with the sauce of your choice. Add lettuce and tomato.",
      "Place the hot patty with melted cheese over the vegetables.",
      "Add pickles or caramelized onions, close the burger and serve immediately."
    ]
  },
  pizza: {
    es: [
      "Si preparas la masa, mezcla harina, levadura, sal y agua tibia. Amasa por 10 minutos y deja leudar hasta que doble su tamaño.",
      "Precalienta el horno a su máxima temperatura (250°C o más). Si tienes piedra para pizza, ponla a calentar.",
      "Estira la masa sobre una superficie enharinada hasta lograr el grosor deseado, formando un círculo.",
      "Esparce una capa fina de salsa de tomate sobre la masa, dejando los bordes libres.",
      "Distribuye uniformemente el queso mozzarella rallado y los ingredientes o toppings elegidos.",
      "Hornea la pizza durante 10-15 minutos (dependiendo de la temperatura) hasta que los bordes estén dorados y el queso burbujee.",
      "Retira del horno, deja reposar 2 minutos, corta en porciones y sirve."
    ],
    en: [
      "If making the dough, mix flour, yeast, salt and warm water. Knead for 10 minutes and let rise until doubled in size.",
      "Preheat the oven to its maximum temperature (250°C or more). If you have a pizza stone, preheat it.",
      "Stretch the dough on a floured surface to the desired thickness, forming a circle.",
      "Spread a thin layer of tomato sauce over the dough, leaving the edges clear.",
      "Evenly distribute grated mozzarella cheese and chosen toppings.",
      "Bake the pizza for 10-15 minutes (depending on temp) until the crust is golden and the cheese is bubbling.",
      "Remove from oven, let rest for 2 minutes, slice and serve."
    ]
  },
  taco: {
    es: [
      "Prepara el relleno (carne asada, pollo, al pastor, etc.) sazonando y cocinando a fuego medio-alto hasta dorar.",
      "Pica finamente la cebolla blanca y el cilantro fresco.",
      "Calienta las tortillas de maíz en un comal caliente durante unos 30 segundos por lado hasta que estén suaves y flexibles.",
      "Sirve una porción generosa del relleno caliente en el centro de cada tortilla.",
      "Agrega la cebolla picada y el cilantro por encima.",
      "Acompaña con rodajas de rábano, gajos de limón fresco y la salsa picante de tu preferencia.",
      "Sirve inmediatamente para disfrutar de las tortillas calientes."
    ],
    en: [
      "Prepare the filling (carne asada, chicken, al pastor, etc.) by seasoning and cooking over medium-high heat until browned.",
      "Finely chop the white onion and fresh cilantro.",
      "Heat the corn tortillas on a hot griddle for about 30 seconds per side until soft and pliable.",
      "Serve a generous portion of the hot filling in the center of each tortilla.",
      "Top with the chopped onion and cilantro.",
      "Accompany with radish slices, fresh lime wedges and your favorite hot sauce.",
      "Serve immediately to enjoy the warm tortillas."
    ]
  },
  curry: {
    es: [
      "Calienta aceite o ghee en una olla y sofríe cebolla picada hasta que esté dorada.",
      "Añade la pasta de curry o las especias en polvo (cúrcuma, comino, cilantro) y cocina por 1-2 minutos para liberar los aromas.",
      "Incorpora la carne, pollo, tofu o vegetales y mezcla bien para que se impregnen con las especias.",
      "Vierte el líquido (leche de coco, caldo o tomates triturados) y lleva a ebullición.",
      "Reduce el fuego, tapa y cocina a fuego lento durante 20-30 minutos hasta que la proteína esté tierna y los sabores se integren.",
      "Ajusta la sal y, si lo deseas, añade un chorrito de jugo de limón para equilibrar.",
      "Sirve muy caliente acompañado de arroz jazmín o basmati."
    ],
    en: [
      "Heat oil or ghee in a pot and sauté chopped onions until golden brown.",
      "Add the curry paste or spice powders (turmeric, cumin, coriander) and cook for 1-2 minutes to release aromas.",
      "Add the meat, chicken, tofu or vegetables and coat well with the spices.",
      "Pour in the liquid (coconut milk, broth or crushed tomatoes) and bring to a boil.",
      "Reduce heat, cover and simmer for 20-30 minutes until the protein is tender and flavors meld.",
      "Adjust salt and, if desired, add a splash of lime juice to balance.",
      "Serve very hot alongside jasmine or basmati rice."
    ]
  },
  pasta: {
    es: [
      "Hierve abundante agua en una olla grande. Cuando alcance ebullición, añade sal generosamente.",
      "Cocina la pasta según el tiempo indicado en el paquete, removiendo ocasionalmente, hasta que esté 'al dente'.",
      "Mientras tanto, en una sartén grande, prepara la salsa (calentando aceite de oliva, ajo, tomates o la base elegida).",
      "Antes de escurrir la pasta, reserva una taza del agua de cocción (el almidón ayuda a ligar la salsa).",
      "Escurre la pasta y añádela directamente a la sartén con la salsa caliente. Saltea durante 1-2 minutos.",
      "Si la salsa está muy seca, agrega poco a poco el agua de cocción reservada hasta lograr la consistencia ideal.",
      "Retira del fuego, añade queso parmesano o pecorino rallado, pimienta negra y sirve inmediatamente."
    ],
    en: [
      "Bring a large pot of generously salted water to a rolling boil.",
      "Cook the pasta according to package directions, stirring occasionally, until 'al dente'.",
      "Meanwhile, in a large skillet, prepare the sauce (heating olive oil, garlic, tomatoes or chosen base).",
      "Before draining the pasta, reserve one cup of the starchy pasta cooking water.",
      "Drain the pasta and add it directly to the skillet with the hot sauce. Toss for 1-2 minutes.",
      "If the sauce is too thick, gradually add the reserved pasta water until reaching the ideal consistency.",
      "Remove from heat, toss with grated parmesan or pecorino cheese, black pepper and serve immediately."
    ]
  },
  salad: {
    es: [
      "Lava cuidadosamente y seca todos los vegetales de hoja verde (lechugas, espinacas) para evitar que el aderezo quede aguado.",
      "Corta o trocea los vegetales base y colócalos en una ensaladera grande.",
      "Prepara el aderezo en un frasco o bol pequeño: mezcla aceite de oliva, vinagre o limón, sal, pimienta y emulsifica bien.",
      "Añade los ingredientes complementarios a la ensalada: tomates cherry, pepino, nueces, queso, crutones o frutas.",
      "Si llevas proteína (pollo a la plancha, atún, huevo duro), incorpórala encima.",
      "Vierte el aderezo sobre la ensalada justo antes de servir (nunca antes para que las hojas no se marchiten).",
      "Revuelve suavemente desde el fondo para que todos los ingredientes se cubran ligeramente y sirve fresca."
    ],
    en: [
      "Carefully wash and dry all leafy greens to prevent the dressing from becoming watered down.",
      "Chop or tear the base vegetables and place them in a large salad bowl.",
      "Prepare the dressing in a jar or small bowl: mix olive oil, vinegar or lemon, salt, pepper and emulsify well.",
      "Add the complementary ingredients to the salad: cherry tomatoes, cucumber, nuts, cheese, croutons or fruits.",
      "If using protein (grilled chicken, tuna, hard-boiled egg), place it on top.",
      "Drizzle the dressing over the salad just before serving (never earlier to prevent wilted leaves).",
      "Toss gently from the bottom so all ingredients are lightly coated and serve fresh."
    ]
  },

  // === GENERAL FALLBACKS (Mismos de antes para que no falten) ===
  generic_meat: {
    es: [
      "Sazona la carne generosamente con sal, pimienta y las especias propias de la receta. Deja reposar 15 minutos a temperatura ambiente.",
      "Calienta el aceite en una sartén grande a fuego alto. Cuando esté caliente, sella la carne sin moverla (3-4 minutos por lado).",
      "Retira la carne y sofríe las verduras aromáticas a fuego medio durante 5-7 minutos hasta que estén doradas.",
      "Añade líquidos (caldo, vino) y raspa los trozos caramelizados del fondo de la sartén.",
      "Regresa la carne, baja el fuego al mínimo, tapa y cocina lentamente durante 30-45 minutos hasta que esté tierna.",
      "Verifica la sazón con sal y pimienta. Deja reposar 5 minutos antes de servir."
    ],
    en: [
      "Season the meat generously with salt, pepper and spices. Let rest 15 minutes at room temperature.",
      "Heat oil in a large skillet over high heat. Sear the meat without moving it (3-4 minutes per side).",
      "Remove meat and sauté aromatic vegetables over medium heat for 5-7 minutes until golden.",
      "Add liquids (broth, wine) and scrape the caramelized bits from the bottom.",
      "Return meat, lower heat, cover and simmer for 30-45 minutes until tender.",
      "Check seasoning and let rest 5 minutes before serving."
    ]
  },
  generic_seafood: {
    es: [
      "Limpia el pescado o marisco, enjuaga con agua fría y seca con papel absorbente.",
      "Prepara los vegetales aromáticos y ten todo listo antes de cocinar.",
      "Calienta aceite en una sartén a fuego medio-alto y cocina el marisco 2-3 minutos por lado.",
      "Retira el marisco. En la misma sartén, sofríe ajo y hierbas, deglasa con vino blanco o limón.",
      "Regresa el marisco a la sartén solo por 1-2 minutos para mezclar los sabores sin sobrecocinar.",
      "Sirve de inmediato decorando con hierbas frescas."
    ],
    en: [
      "Clean the fish or seafood, rinse with cold water and pat dry.",
      "Prepare all aromatic vegetables and have everything ready before cooking.",
      "Heat oil in a skillet over medium-high heat and cook seafood 2-3 minutes per side.",
      "Remove seafood. In the same skillet, sauté garlic and herbs, deglaze with wine or lemon.",
      "Return seafood to the skillet for just 1-2 minutes to mix flavors without overcooking.",
      "Serve immediately garnished with fresh herbs."
    ]
  },
  generic_vegetarian: {
    es: [
      "Lava, pela y corta los vegetales en trozos uniformes.",
      "Calienta aceite en una sartén a fuego medio y sofríe cebolla y ajo por 4-5 minutos.",
      "Añade las especias secas y tuesta por 1 minuto.",
      "Incorpora los vegetales, empezando por los más duros. Agrega líquido (agua, caldo).",
      "Cocina tapado a fuego medio durante 15-20 minutos hasta lograr la textura deseada.",
      "Añade hierbas frescas, rectifica sal y pimienta y sirve caliente."
    ],
    en: [
      "Wash, peel and cut vegetables into uniform pieces.",
      "Heat oil in a skillet over medium heat and sauté onion and garlic for 4-5 minutes.",
      "Add dry spices and toast for 1 minute.",
      "Add vegetables, starting with the hardest. Pour in liquid (water, broth).",
      "Cook covered over medium heat for 15-20 minutes until desired texture.",
      "Add fresh herbs, adjust salt and pepper and serve hot."
    ]
  },
  generic_desserts: {
    es: [
      "Precalienta el horno a 180°C (350°F). Engrasa el molde.",
      "En un bol, mezcla los ingredientes secos (harina, azúcar, sal).",
      "En otro bol, bate los ingredientes húmedos (huevos, mantequilla, leche).",
      "Incorpora los líquidos a los secos mezclando suavemente hasta integrar.",
      "Vierte la mezcla en el molde y hornea el tiempo indicado hasta que al insertar un palillo salga limpio.",
      "Deja enfriar antes de desmoldar y servir."
    ],
    en: [
      "Preheat oven to 180°C (350°F). Grease the baking pan.",
      "In a bowl, mix dry ingredients (flour, sugar, salt).",
      "In another bowl, beat wet ingredients (eggs, butter, milk).",
      "Fold wet ingredients into the dry, mixing gently until combined.",
      "Pour into the pan and bake until a toothpick inserted comes out clean.",
      "Let cool before unmolding and serving."
    ]
  }
};

function getStepsBasedOnTitle(titleStr, categoryType) {
  const title = String(titleStr || '').toLowerCase();
  
  // Buscar palabras clave en el título
  if (title.includes('omurice') || title.includes('omelette')) return intelligentSteps.omurice;
  if (title.includes('ramen') || title.includes('soba') || title.includes('udon') || title.includes('pho')) return intelligentSteps.ramen;
  if (title.includes('sushi') || title.includes('maki') || title.includes('nigiri')) return intelligentSteps.sushi;
  if (title.includes('burger') || title.includes('hamburguesa')) return intelligentSteps.burger;
  if (title.includes('pizza') || title.includes('focaccia')) return intelligentSteps.pizza;
  if (title.includes('taco') || title.includes('fajita') || title.includes('enchilada')) return intelligentSteps.taco;
  if (title.includes('curry') || title.includes('tikka masala')) return intelligentSteps.curry;
  if (title.includes('pasta') || title.includes('spaghetti') || title.includes('macaroni') || title.includes('fideo')) return intelligentSteps.pasta;
  if (title.includes('salad') || title.includes('ensalada')) return intelligentSteps.salad;

  // Fallback por tipo de comida
  let typeKey = (categoryType || 'vegetarian').toLowerCase();
  if (typeKey === 'dessert') typeKey = 'desserts';
  if (typeKey === 'meat') return intelligentSteps.generic_meat;
  if (typeKey === 'seafood') return intelligentSteps.generic_seafood;
  if (typeKey === 'desserts') return intelligentSteps.generic_desserts;
  
  return intelligentSteps.generic_vegetarian;
}

async function updateStepsIntelligently() {
  console.log('🔌 Conectando a TiDB Cloud y Local...');
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
    console.log(`📊 Analizando los títulos de ${recipes.length} recetas para asignar pasos precisos...`);

    let updated = 0;
    for (const r of recipes) {
      // Extraer el título en español o inglés para el análisis
      let titleStr = "";
      if (typeof r.title === 'string') {
        if (r.title.startsWith('{')) {
          try {
            const tObj = JSON.parse(r.title);
            titleStr = tObj.en || tObj.es || '';
          } catch(e) { titleStr = r.title; }
        } else {
          titleStr = r.title;
        }
      } else if (r.title && typeof r.title === 'object') {
        titleStr = r.title.en || r.title.es || '';
      }

      const stepsData = getStepsBasedOnTitle(titleStr, r.category_type);
      
      const formattedSteps = stepsData.es.map((stepEs, index) => ({
        es: stepEs,
        en: stepsData.en[index] || stepEs
      }));

      const stepsJson = JSON.stringify(formattedSteps);
      await remoteConn.query('UPDATE recipes SET steps = ? WHERE id = ?', [stepsJson, r.id]);
      
      updated++;
    }

    console.log(`✅ ¡Éxito! Se actualizaron los pasos de ${updated} recetas usando lógica basada en el título.`);
    console.log('   El Omurice ahora tiene pasos de Omurice, el Ramen pasos de Ramen, etc.');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (remoteConn) remoteConn.release();
    remotePool.end();
  }
}

updateStepsIntelligently();
