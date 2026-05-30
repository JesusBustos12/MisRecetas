import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// ═══════════════════════════════════════════════════════════════
// BATCH 2: MÉXICO 🇲🇽 — Datos auténticos por receta
// Búsqueda por título (no por país) para no perder ninguna.
// ═══════════════════════════════════════════════════════════════

const mexicoFixes = {
  'tacos al pastor': {
    ingredients: [
      { es: '1 kg de carne de cerdo (pierna o lomo), en láminas finas', en: '1 kg pork (leg or loin), thinly sliced' },
      { es: '4 chiles guajillo desvenados y remojados', en: '4 guajillo chiles, deveined and soaked' },
      { es: '2 chiles ancho desvenados y remojados', en: '2 ancho chiles, deveined and soaked' },
      { es: '½ piña madura, en rodajas de 1cm', en: '½ ripe pineapple, sliced 1cm thick' },
      { es: '1 cebolla blanca mediana', en: '1 medium white onion' },
      { es: '3 dientes de ajo', en: '3 garlic cloves' },
      { es: '2 cucharadas de achiote (pasta)', en: '2 tablespoons achiote paste' },
      { es: '1 cucharadita de comino', en: '1 teaspoon cumin' },
      { es: '½ taza de jugo de piña', en: '½ cup pineapple juice' },
      { es: '¼ de taza de vinagre blanco', en: '¼ cup white vinegar' },
      { es: '20 tortillas de maíz pequeñas', en: '20 small corn tortillas' },
      { es: 'Cilantro, cebolla picada, limones y salsa verde para servir', en: 'Cilantro, chopped onion, limes and salsa verde for serving' }
    ],
    steps: [
      { es: 'Licúa los chiles remojados con ajo, achiote, comino, jugo de piña y vinagre hasta obtener una salsa tersa y roja.', en: 'Blend soaked chiles with garlic, achiote, cumin, pineapple juice and vinegar until you get a smooth red sauce.' },
      { es: 'Marina las láminas de cerdo en la salsa durante mínimo 4 horas (ideal toda la noche) en refrigeración.', en: 'Marinate pork slices in sauce for at least 4 hours (ideally overnight) in refrigerator.' },
      { es: 'Asa las rodajas de piña en un comal o sartén bien caliente hasta que se caramelicen con marcas doradas. Pica en cubos pequeños.', en: 'Grill pineapple slices on a hot comal or skillet until caramelized with golden marks. Dice into small cubes.' },
      { es: 'Cocina la carne marinada en un comal o sartén de hierro a fuego alto. Voltea cuando los bordes se caramelicen (3-4 minutos por lado). Pica finamente con cuchillos.', en: 'Cook marinated meat on a hot comal or cast iron skillet over high heat. Flip when edges caramelize (3-4 minutes per side). Finely chop with knives.' },
      { es: 'Calienta las tortillas directamente sobre la flama o en un comal seco hasta que se inflen ligeramente.', en: 'Heat tortillas directly over flame or on a dry comal until they puff slightly.' },
      { es: 'Arma los tacos: doble tortilla, carne picada al pastor, cubos de piña asada, cilantro, cebolla picada y un apretón de limón. Acompaña con salsa verde.', en: 'Assemble tacos: double tortilla, chopped al pastor meat, grilled pineapple cubes, cilantro, chopped onion and a lime squeeze. Serve with salsa verde.' }
    ],
    nutrition: { calories: 420, protein: '28g', carbs: '38g', fat: '18g', fiber: '4g' }
  },

  'mole poblano': {
    ingredients: [
      { es: '8 piezas de pollo (muslos y piernas)', en: '8 chicken pieces (thighs and drumsticks)' },
      { es: '6 chiles mulato desvenados', en: '6 mulato chiles, deveined' },
      { es: '4 chiles ancho desvenados', en: '4 ancho chiles, deveined' },
      { es: '3 chiles pasilla desvenados', en: '3 pasilla chiles, deveined' },
      { es: '2 jitomates asados', en: '2 roasted tomatoes' },
      { es: '1 plátano macho maduro, frito', en: '1 ripe plantain, fried' },
      { es: '¼ de taza de almendras tostadas', en: '¼ cup toasted almonds' },
      { es: '¼ de taza de cacahuates tostados', en: '¼ cup toasted peanuts' },
      { es: '3 cucharadas de ajonjolí tostado', en: '3 tablespoons toasted sesame seeds' },
      { es: '1 tablilla de chocolate mexicano (90g)', en: '1 Mexican chocolate tablet (90g)' },
      { es: '½ bolillo (pan) frito y dorado', en: '½ bolillo roll, fried and golden' },
      { es: '1 tortilla de maíz frita', en: '1 fried corn tortilla' },
      { es: '1 raja de canela, 3 clavos, 5 pimientas negras', en: '1 cinnamon stick, 3 cloves, 5 black peppercorns' },
      { es: '4 cucharadas de manteca de cerdo', en: '4 tablespoons lard' },
      { es: '1L de caldo de pollo', en: '1L chicken broth' },
      { es: 'Sal y azúcar al gusto', en: 'Salt and sugar to taste' }
    ],
    steps: [
      { es: 'Cuece el pollo en agua con sal, cebolla y ajo durante 35 minutos. Reserva el caldo y las piezas por separado.', en: 'Simmer chicken in salted water with onion and garlic for 35 minutes. Reserve broth and pieces separately.' },
      { es: 'Tuesta los chiles en un comal seco cuidando que no se quemen (30 segundos por lado). Remójalos en agua caliente 20 minutos.', en: 'Toast chiles on a dry comal being careful not to burn (30 seconds per side). Soak in hot water 20 minutes.' },
      { es: 'En la misma manteca, fríe por separado: almendras, cacahuates, ajonjolí, plátano, bolillo, tortilla y las especias. Cada uno debe dorarse ligeramente.', en: 'In the same lard, fry separately: almonds, peanuts, sesame, plantain, bread, tortilla and spices. Each should brown slightly.' },
      { es: 'Licúa los chiles escurridos con los jitomates, todos los ingredientes fritos y 2 tazas de caldo. Procesa en tandas hasta obtener una pasta muy fina.', en: 'Blend drained chiles with tomatoes, all fried ingredients and 2 cups broth. Process in batches until very smooth.' },
      { es: 'Fríe la pasta de mole en 2 cucharadas de manteca a fuego medio durante 20 minutos, revolviendo constantemente para que no se pegue.', en: 'Fry mole paste in 2 tablespoons lard over medium heat for 20 minutes, stirring constantly to prevent sticking.' },
      { es: 'Agrega el caldo restante, el chocolate partido en trozos y sazona con sal y una pizca de azúcar. Cocina 30 minutos más a fuego bajo hasta que espese y la grasa flote.', en: 'Add remaining broth, chocolate broken into pieces and season with salt and a pinch of sugar. Cook 30 more minutes on low until thick and fat floats.' },
      { es: 'Incorpora las piezas de pollo al mole y calienta 10 minutos. Sirve bañado generosamente con mole y espolvoreado con ajonjolí tostado. Acompaña con arroz rojo y tortillas.', en: 'Add chicken pieces to mole and heat 10 minutes. Serve generously covered in mole and sprinkled with toasted sesame. Serve with red rice and tortillas.' }
    ],
    nutrition: { calories: 650, protein: '35g', carbs: '42g', fat: '38g', fiber: '6g' }
  },

  'pozole rojo': {
    ingredients: [
      { es: '500g de carne de cerdo (espinazo y maciza), en trozos', en: '500g pork (spine and loin), in chunks' },
      { es: '1 cabeza de cerdo pequeña o 500g de cabeza (opcional)', en: '1 small pork head or 500g head meat (optional)' },
      { es: '1 lata grande de maíz pozolero (hominy), escurrido', en: '1 large can hominy corn, drained' },
      { es: '5 chiles guajillo desvenados y remojados', en: '5 guajillo chiles, deveined and soaked' },
      { es: '2 chiles ancho desvenados y remojados', en: '2 ancho chiles, deveined and soaked' },
      { es: '3 dientes de ajo', en: '3 garlic cloves' },
      { es: '½ cebolla blanca', en: '½ white onion' },
      { es: '1 cucharadita de orégano mexicano', en: '1 teaspoon Mexican oregano' },
      { es: 'Sal al gusto', en: 'Salt to taste' },
      { es: 'Para servir: lechuga picada, rábanos, tostadas, orégano, chile piquín, limones, cebolla y crema', en: 'For serving: shredded lettuce, radishes, tostadas, oregano, chile piquín, limes, onion and cream' }
    ],
    steps: [
      { es: 'Cuece la carne de cerdo en una olla grande con agua, sal, ¼ de cebolla y 2 dientes de ajo. Hierve y espuma. Cocina a fuego medio 1.5 horas hasta que esté tierna.', en: 'Cook pork in a large pot with water, salt, ¼ onion and 2 garlic cloves. Boil and skim foam. Cook over medium heat 1.5 hours until tender.' },
      { es: 'Licúa los chiles remojados con el ajo restante, cebolla y una taza del caldo de cerdo. Cuela la salsa presionando bien.', en: 'Blend soaked chiles with remaining garlic, onion and one cup of pork broth. Strain sauce pressing well.' },
      { es: 'Agrega el maíz pozolero a la olla con la carne. Incorpora la salsa de chile colada. Revuelve bien.', en: 'Add hominy to pot with meat. Add strained chile sauce. Stir well.' },
      { es: 'Cocina todo junto a fuego medio-bajo durante 30 minutos para que los sabores se integren. El maíz debe estar completamente abierto "florecido". Rectifica sal y agrega orégano.', en: 'Cook everything together over medium-low heat for 30 minutes so flavors meld. Corn should be fully opened "bloomed". Adjust salt and add oregano.' },
      { es: 'Sirve en platos hondos con abundante caldo. Acompaña con un plato de guarniciones: lechuga, rábano, orégano, chile piquín, limón, cebolla y tostadas.', en: 'Serve in deep bowls with plenty of broth. Accompany with a garnish plate: lettuce, radish, oregano, chile piquín, lime, onion and tostadas.' }
    ],
    nutrition: { calories: 520, protein: '38g', carbs: '45g', fat: '20g', fiber: '7g' }
  },

  'cochinita pibil': {
    ingredients: [
      { es: '1.5 kg de carne de cerdo (pierna), en trozos grandes', en: '1.5 kg pork (leg), in large chunks' },
      { es: '100g de pasta de achiote', en: '100g achiote paste' },
      { es: '1 taza de jugo de naranja agria (o mezcla de naranja y limón)', en: '1 cup sour orange juice (or mix of orange and lime)' },
      { es: '4 dientes de ajo', en: '4 garlic cloves' },
      { es: '1 cucharadita de comino', en: '1 teaspoon cumin' },
      { es: '1 cucharadita de pimienta negra', en: '1 teaspoon black pepper' },
      { es: '½ cucharadita de orégano yucateco', en: '½ teaspoon Yucatecan oregano' },
      { es: 'Hojas de plátano para envolver', en: 'Banana leaves for wrapping' },
      { es: 'Sal al gusto', en: 'Salt to taste' },
      { es: 'Cebolla morada encurtida en limón y habanero para servir', en: 'Red onion pickled in lime and habanero for serving' },
      { es: 'Tortillas de maíz', en: 'Corn tortillas' }
    ],
    steps: [
      { es: 'Disuelve la pasta de achiote en el jugo de naranja agria. Licúa con ajo, comino, pimienta, orégano y sal hasta obtener un adobo terso y rojo intenso.', en: 'Dissolve achiote paste in sour orange juice. Blend with garlic, cumin, pepper, oregano and salt until you get a smooth, intense red marinade.' },
      { es: 'Barniza generosamente la carne con el adobo, masajeando para que penetre. Marina en refrigeración mínimo 4 horas, idealmente toda la noche.', en: 'Generously coat meat with marinade, massaging so it penetrates. Marinate in refrigerator at least 4 hours, ideally overnight.' },
      { es: 'Pasa las hojas de plátano por la flama para suavizarlas. Forra una charola honda o cacerola con las hojas, dejando exceso para cubrir.', en: 'Pass banana leaves over flame to soften. Line a deep baking dish with leaves, leaving excess to cover.' },
      { es: 'Coloca la carne marinada sobre las hojas. Vierte el adobo sobrante encima. Cubre con las hojas de plátano y sella con papel aluminio.', en: 'Place marinated meat on leaves. Pour remaining marinade on top. Cover with banana leaves and seal with foil.' },
      { es: 'Hornea a 160°C durante 3.5-4 horas hasta que la carne se deshaga con un tenedor.', en: 'Bake at 160°C for 3.5-4 hours until meat shreds easily with a fork.' },
      { es: 'Deshebra la carne con dos tenedores y mézclala con sus jugos. Sirve en tortillas con cebolla morada encurtida en limón y habanero.', en: 'Shred meat with two forks and mix with its juices. Serve on tortillas with red onion pickled in lime and habanero.' }
    ],
    nutrition: { calories: 480, protein: '42g', carbs: '15g', fat: '28g', fiber: '2g' }
  },

  'chiles en nogada': {
    ingredients: [
      { es: '8 chiles poblanos grandes, asados y pelados', en: '8 large poblano chiles, roasted and peeled' },
      { es: '500g de carne de cerdo y res molida (mixta)', en: '500g mixed ground pork and beef' },
      { es: '1 manzana panochera, pelada y en cubitos', en: '1 panochera apple, peeled and diced' },
      { es: '1 pera, pelada y en cubitos', en: '1 pear, peeled and diced' },
      { es: '1 durazno, pelado y en cubitos', en: '1 peach, peeled and diced' },
      { es: '½ taza de pasas', en: '½ cup raisins' },
      { es: '¼ de taza de almendras picadas', en: '¼ cup chopped almonds' },
      { es: '2 jitomates picados', en: '2 chopped tomatoes' },
      { es: '1 cebolla picada', en: '1 chopped onion' },
      { es: '200g de nuez de castilla fresca, pelada', en: '200g fresh walnuts, peeled' },
      { es: '150g de queso de cabra', en: '150g goat cheese' },
      { es: '¾ de taza de leche', en: '¾ cup milk' },
      { es: '½ taza de crema', en: '½ cup cream' },
      { es: 'Granos de granada roja para decorar', en: 'Red pomegranate seeds for garnish' },
      { es: 'Perejil fresco', en: 'Fresh parsley' }
    ],
    steps: [
      { es: 'Prepara el picadillo: sofríe cebolla y jitomate. Agrega la carne molida y cocina 10 minutos. Incorpora las frutas en cubitos, pasas y almendras. Cocina 15 minutos más hasta que todo esté suave y jugoso.', en: 'Prepare picadillo: sauté onion and tomato. Add ground meat and cook 10 minutes. Add diced fruits, raisins and almonds. Cook 15 more minutes until soft and juicy.' },
      { es: 'Rellena cada chile poblano con el picadillo, cuidando de no romperlos. Cierra con un palillo si es necesario.', en: 'Stuff each poblano chile with picadillo, being careful not to tear them. Close with a toothpick if needed.' },
      { es: 'Prepara la nogada: licúa las nueces peladas con queso de cabra, leche, crema y una pizca de sal hasta obtener una salsa blanca y cremosa.', en: 'Prepare nogada: blend peeled walnuts with goat cheese, milk, cream and a pinch of salt until you get a white, creamy sauce.' },
      { es: 'Baña cada chile relleno generosamente con la nogada fría. Decora con granos de granada y hojas de perejil, formando los colores de la bandera mexicana: verde, blanco y rojo.', en: 'Generously drizzle each stuffed chile with cold nogada. Decorate with pomegranate seeds and parsley leaves, forming the colors of the Mexican flag: green, white and red.' }
    ],
    nutrition: { calories: 580, protein: '30g', carbs: '35g', fat: '38g', fiber: '5g' }
  },

  'tamales oaxaque': {
    ingredients: [
      { es: '1 kg de masa de maíz para tamales', en: '1 kg corn masa for tamales' },
      { es: '250g de manteca de cerdo, batida hasta esponjar', en: '250g lard, beaten until fluffy' },
      { es: '500g de carne de cerdo en trozos, cocida y deshebrada', en: '500g pork chunks, cooked and shredded' },
      { es: '200g de mole negro oaxaqueño', en: '200g Oaxacan black mole' },
      { es: '1 taza de caldo de cerdo tibio', en: '1 cup warm pork broth' },
      { es: '1 cucharadita de polvo para hornear', en: '1 teaspoon baking powder' },
      { es: 'Hojas de plátano, pasadas por la flama', en: 'Banana leaves, passed over flame' },
      { es: 'Sal al gusto', en: 'Salt to taste' }
    ],
    steps: [
      { es: 'Bate la manteca con sal y polvo para hornear durante 10 minutos hasta que esté blanca y esponjosa (una bolita debe flotar en agua).', en: 'Beat lard with salt and baking powder for 10 minutes until white and fluffy (a small ball should float in water).' },
      { es: 'Incorpora la masa poco a poco a la manteca batida, alternando con caldo tibio. La consistencia debe ser como de un betún suave.', en: 'Gradually add masa to beaten lard, alternating with warm broth. Consistency should be like soft frosting.' },
      { es: 'Mezcla la carne deshebrada con el mole negro hasta cubrirla bien.', en: 'Mix shredded meat with black mole until well coated.' },
      { es: 'Corta las hojas de plátano en rectángulos de 25x30cm. Unta una capa de masa (5mm) en el centro. Coloca una porción de carne con mole.', en: 'Cut banana leaves into 25x30cm rectangles. Spread a layer of masa (5mm) in center. Place a portion of meat with mole.' },
      { es: 'Dobla la hoja: primero los lados largos, luego los extremos. Ata con una tira de hoja de plátano.', en: 'Fold leaf: first the long sides, then the ends. Tie with a strip of banana leaf.' },
      { es: 'Acomoda los tamales verticalmente en una vaporera. Cocina al vapor durante 1 hora 15 minutos. Están listos cuando la masa se despega fácilmente de la hoja.', en: 'Arrange tamales vertically in a steamer. Steam for 1 hour 15 minutes. They\'re ready when masa peels easily from the leaf.' }
    ],
    nutrition: { calories: 450, protein: '22g', carbs: '38g', fat: '24g', fiber: '3g' }
  },

  'carnitas': {
    ingredients: [
      { es: '1.5 kg de carne de cerdo (maciza, costilla y cuero)', en: '1.5 kg pork (loin, ribs and skin)' },
      { es: '500g de manteca de cerdo', en: '500g lard' },
      { es: '1 naranja cortada en cuartos', en: '1 orange, quartered' },
      { es: '1 taza de leche evaporada', en: '1 cup evaporated milk' },
      { es: '½ taza de refresco de cola', en: '½ cup cola soda' },
      { es: '1 cebolla en cuartos', en: '1 onion, quartered' },
      { es: '4 dientes de ajo enteros', en: '4 whole garlic cloves' },
      { es: '2 hojas de laurel', en: '2 bay leaves' },
      { es: 'Sal al gusto', en: 'Salt to taste' },
      { es: 'Tortillas, cilantro, cebolla, salsa y limones para servir', en: 'Tortillas, cilantro, onion, salsa and limes for serving' }
    ],
    steps: [
      { es: 'Corta la carne en trozos grandes (8-10cm). Sazona generosamente con sal.', en: 'Cut meat into large chunks (8-10cm). Season generously with salt.' },
      { es: 'Derrite la manteca en una olla gruesa (de cobre si es posible) a fuego medio. Cuando esté caliente, sumerge la carne cuidadosamente.', en: 'Melt lard in a heavy pot (copper if possible) over medium heat. When hot, carefully submerge the meat.' },
      { es: 'Agrega la naranja, leche evaporada, cola, cebolla, ajo y laurel. La carne debe quedar cubierta por la manteca.', en: 'Add orange, evaporated milk, cola, onion, garlic and bay leaves. Meat should be covered by lard.' },
      { es: 'Cocina a fuego medio-bajo durante 2-2.5 horas sin tapar, volteando ocasionalmente. La carne estará lista cuando se pueda desmenuzar fácilmente.', en: 'Cook over medium-low heat for 2-2.5 hours uncovered, turning occasionally. Meat is ready when it shreds easily.' },
      { es: 'Sube el fuego los últimos 10 minutos para dorar y crear los bordes crujientes característicos.', en: 'Raise heat for the last 10 minutes to brown and create the characteristic crispy edges.' },
      { es: 'Desmenuza y sirve en tortillas dobles con cilantro, cebolla picada, salsa de tu elección y un buen chorro de limón.', en: 'Shred and serve on double tortillas with cilantro, chopped onion, salsa of your choice and a good squeeze of lime.' }
    ],
    nutrition: { calories: 550, protein: '35g', carbs: '28g', fat: '34g', fiber: '2g' }
  },

  'sopa de tortilla': {
    ingredients: [
      { es: '8 tortillas de maíz cortadas en tiras y fritas', en: '8 corn tortillas cut into strips and fried' },
      { es: '4 jitomates maduros, asados', en: '4 ripe tomatoes, roasted' },
      { es: '1 chile pasilla desvenado y frito (para decorar)', en: '1 pasilla chile, deveined and fried (for garnish)' },
      { es: '2 chiles guajillo desvenados', en: '2 guajillo chiles, deveined' },
      { es: '½ cebolla blanca asada', en: '½ white onion, roasted' },
      { es: '2 dientes de ajo asados', en: '2 garlic cloves, roasted' },
      { es: '1.5L de caldo de pollo', en: '1.5L chicken broth' },
      { es: '1 rama de epazote fresco', en: '1 sprig fresh epazote' },
      { es: 'Aguacate, crema, queso fresco y chicharrón para servir', en: 'Avocado, cream, fresh cheese and chicharrón for serving' }
    ],
    steps: [
      { es: 'Asa los jitomates, cebolla y ajo directamente en un comal seco hasta que se manchen de negro. Licúa con los chiles guajillo remojados.', en: 'Roast tomatoes, onion and garlic directly on a dry comal until charred. Blend with soaked guajillo chiles.' },
      { es: 'Fríe la salsa en 2 cucharadas de aceite durante 5 minutos a fuego medio. Agrega el caldo de pollo y el epazote. Hierve 15 minutos.', en: 'Fry sauce in 2 tablespoons oil for 5 minutes over medium heat. Add chicken broth and epazote. Simmer 15 minutes.' },
      { es: 'Distribuye las tiras de tortilla frita en tazones. Vierte el caldo caliente encima.', en: 'Distribute fried tortilla strips into bowls. Pour hot broth over them.' },
      { es: 'Decora con cubos de aguacate, crema, queso fresco desmoronado, chile pasilla frito en trozos y un poco de chicharrón. Sirve inmediatamente antes de que las tiras se ablanden.', en: 'Garnish with avocado cubes, cream, crumbled fresh cheese, fried pasilla chile pieces and some chicharrón. Serve immediately before strips soften.' }
    ],
    nutrition: { calories: 320, protein: '14g', carbs: '28g', fat: '18g', fiber: '5g' }
  },

  'chilaquiles': {
    ingredients: [
      { es: '12 tortillas de maíz cortadas en triángulos y fritas', en: '12 corn tortillas cut into triangles and fried' },
      { es: '500g de tomate verde (tomatillo), sin cáscara', en: '500g green tomatillos, husked' },
      { es: '2-3 chiles serranos (al gusto)', en: '2-3 serrano chiles (to taste)' },
      { es: '¼ de cebolla blanca', en: '¼ white onion' },
      { es: '1 diente de ajo', en: '1 garlic clove' },
      { es: '2 cucharadas de aceite', en: '2 tablespoons oil' },
      { es: 'Crema ácida, queso fresco y cebolla en aros para decorar', en: 'Sour cream, fresh cheese and onion rings for garnish' },
      { es: 'Huevos estrellados o pollo deshebrado (opcional)', en: 'Fried eggs or shredded chicken (optional)' }
    ],
    steps: [
      { es: 'Hierve los tomatillos con los chiles serranos durante 8 minutos hasta suavizar. Licúa con cebolla, ajo y sal.', en: 'Boil tomatillos with serrano chiles for 8 minutes until soft. Blend with onion, garlic and salt.' },
      { es: 'Fríe la salsa en aceite caliente por 5 minutos hasta que cambie de color y se concentre.', en: 'Fry sauce in hot oil for 5 minutes until it changes color and concentrates.' },
      { es: 'Agrega los totopos (triángulos fritos) a la salsa. Mezcla con cuidado para no romperlos. Cocina 2 minutos; deben absorber salsa pero mantener algo de textura crujiente.', en: 'Add totopos (fried triangles) to sauce. Mix carefully to avoid breaking. Cook 2 minutes; they should absorb sauce but keep some crunch.' },
      { es: 'Sirve inmediatamente coronando con crema en zigzag, queso fresco desmoronado, aros de cebolla y, si gustas, un huevo estrellado encima.', en: 'Serve immediately topping with zigzag cream, crumbled fresh cheese, onion rings and, if desired, a fried egg on top.' }
    ],
    nutrition: { calories: 380, protein: '12g', carbs: '35g', fat: '22g', fiber: '4g' }
  },

  'enchiladas suizas': {
    ingredients: [
      { es: '12 tortillas de maíz', en: '12 corn tortillas' },
      { es: '3 tazas de pollo cocido y deshebrado', en: '3 cups cooked shredded chicken' },
      { es: '500g de tomate verde, hervido', en: '500g green tomatillos, boiled' },
      { es: '2 chiles poblanos asados y pelados', en: '2 poblano chiles, roasted and peeled' },
      { es: '1 taza de crema ácida', en: '1 cup sour cream' },
      { es: '200g de queso Chihuahua o Oaxaca rallado', en: '200g Chihuahua or Oaxaca cheese, shredded' },
      { es: '½ cebolla', en: '½ onion' },
      { es: '2 dientes de ajo', en: '2 garlic cloves' },
      { es: '1 manojo de cilantro', en: '1 bunch cilantro' },
      { es: 'Aceite para freír las tortillas', en: 'Oil for frying tortillas' }
    ],
    steps: [
      { es: 'Licúa el tomate verde hervido con los chiles poblanos, cebolla, ajo, cilantro y ½ taza de crema. Sazona con sal.', en: 'Blend boiled tomatillos with poblano chiles, onion, garlic, cilantro and ½ cup cream. Season with salt.' },
      { es: 'Pasa las tortillas brevemente por aceite caliente (5 segundos por lado) para suavizarlas.', en: 'Pass tortillas briefly through hot oil (5 seconds per side) to soften them.' },
      { es: 'Rellena cada tortilla con pollo deshebrado y enrolla. Acomoda con la abertura hacia abajo en un refractario engrasado.', en: 'Fill each tortilla with shredded chicken and roll. Place seam-side down in a greased baking dish.' },
      { es: 'Baña las enchiladas con la salsa verde cremosa. Cubre con el queso rallado y la crema restante en hilos.', en: 'Pour creamy green sauce over enchiladas. Top with shredded cheese and remaining cream in drizzles.' },
      { es: 'Gratina en el horno a 200°C durante 15 minutos hasta que el queso burbujee y se dore ligeramente. Sirve de inmediato.', en: 'Broil in oven at 200°C for 15 minutes until cheese bubbles and browns slightly. Serve immediately.' }
    ],
    nutrition: { calories: 520, protein: '32g', carbs: '35g', fat: '28g', fiber: '4g' }
  },

  'torta ahogada': {
    ingredients: [
      { es: '4 birotes (bolillos duros de Guadalajara)', en: '4 birotes (hard Guadalajara-style rolls)' },
      { es: '500g de carnitas de cerdo deshebradas', en: '500g shredded pork carnitas' },
      { es: '400g de jitomate', en: '400g tomatoes' },
      { es: '6 chiles de árbol secos', en: '6 dried árbol chiles' },
      { es: '2 dientes de ajo', en: '2 garlic cloves' },
      { es: '½ taza de vinagre blanco', en: '½ cup white vinegar' },
      { es: 'Cebolla morada en rebanadas', en: 'Red onion slices' },
      { es: 'Limones y frijoles refritos al lado', en: 'Limes and refried beans on the side' }
    ],
    steps: [
      { es: 'Prepara la salsa roja: hierve los jitomates con los chiles de árbol 10 minutos. Licúa con ajo, vinagre y sal. Debe quedar muy líquida y picosa.', en: 'Prepare red sauce: boil tomatoes with árbol chiles 10 minutes. Blend with garlic, vinegar and salt. Should be very liquid and spicy.' },
      { es: 'Abre cada birote por la mitad sin separar completamente. Rellena generosamente con las carnitas.', en: 'Open each birote in half without fully separating. Fill generously with carnitas.' },
      { es: 'Sumerge cada torta completamente en la salsa roja caliente ("ahogándola") durante 10-15 segundos. La salsa debe empapar el pan.', en: 'Submerge each torta completely in hot red sauce ("drowning it") for 10-15 seconds. Sauce should soak the bread.' },
      { es: 'Sirve en un plato hondo con salsa extra encima, cebolla morada y acompañada de frijoles refritos y limones.', en: 'Serve in a deep plate with extra sauce on top, red onion and accompanied by refried beans and limes.' }
    ],
    nutrition: { calories: 580, protein: '30g', carbs: '48g', fat: '28g', fiber: '3g' }
  },

  'barbacoa': {
    ingredients: [
      { es: '2 kg de carne de borrego (pierna o costillar)', en: '2 kg lamb (leg or ribs)' },
      { es: '8 chiles guajillo desvenados', en: '8 guajillo chiles, deveined' },
      { es: '4 chiles ancho desvenados', en: '4 ancho chiles, deveined' },
      { es: '6 dientes de ajo', en: '6 garlic cloves' },
      { es: '4 hojas de aguacate (o laurel)', en: '4 avocado leaves (or bay leaves)' },
      { es: '½ cebolla', en: '½ onion' },
      { es: '1 cucharadita de comino', en: '1 teaspoon cumin' },
      { es: '1 cucharadita de pimienta negra', en: '1 teaspoon black pepper' },
      { es: '3 clavos de olor', en: '3 whole cloves' },
      { es: 'Pencas de maguey para envolver (o papel aluminio)', en: 'Maguey leaves for wrapping (or foil)' },
      { es: 'Tortillas, cilantro, cebolla, salsa y consomé para servir', en: 'Tortillas, cilantro, onion, salsa and consommé for serving' }
    ],
    steps: [
      { es: 'Tuesta y remoja los chiles. Licúa con ajo, cebolla, comino, pimienta, clavos y sal hasta obtener un adobo espeso.', en: 'Toast and soak chiles. Blend with garlic, onion, cumin, pepper, cloves and salt until you get a thick marinade.' },
      { es: 'Unta la carne de borrego generosamente con el adobo. Marina mínimo 2 horas.', en: 'Coat lamb generously with marinade. Marinate at least 2 hours.' },
      { es: 'Envuelve la carne en pencas de maguey (o papel aluminio doble). Coloca hojas de aguacate entre la carne para aromatizar.', en: 'Wrap meat in maguey leaves (or double foil). Place avocado leaves between meat for aroma.' },
      { es: 'Cocina en horno a 150°C durante 5-6 horas (o en olla de presión 2 horas). La carne debe desmenuzarse al tocarla.', en: 'Cook in oven at 150°C for 5-6 hours (or pressure cooker 2 hours). Meat should fall apart when touched.' },
      { es: 'Deshebra, reserva los jugos como consomé. Sirve en tortillas con cilantro, cebolla y salsa. El consomé se toma aparte con garbanzos y chile.', en: 'Shred, reserve juices as consommé. Serve on tortillas with cilantro, onion and salsa. Consommé is drunk separately with chickpeas and chile.' }
    ],
    nutrition: { calories: 490, protein: '45g', carbs: '12g', fat: '30g', fiber: '2g' }
  },

  'flautas': {
    ingredients: [
      { es: '12 tortillas de maíz', en: '12 corn tortillas' },
      { es: '3 tazas de pollo cocido y deshebrado', en: '3 cups cooked shredded chicken' },
      { es: '2 chiles chipotles adobados, picados', en: '2 chipotle chiles in adobo, chopped' },
      { es: 'Aceite vegetal para freír', en: 'Vegetable oil for frying' },
      { es: 'Crema ácida, lechuga picada, queso fresco y salsa verde', en: 'Sour cream, shredded lettuce, fresh cheese and green salsa' }
    ],
    steps: [
      { es: 'Mezcla el pollo deshebrado con los chipotles picados y sal al gusto.', en: 'Mix shredded chicken with chopped chipotles and salt to taste.' },
      { es: 'Calienta las tortillas en un comal para suavizarlas. Coloca 2-3 cucharadas de relleno en cada una y enrolla bien apretado. Sujeta con un palillo.', en: 'Heat tortillas on a comal to soften. Place 2-3 tablespoons filling on each and roll tightly. Secure with a toothpick.' },
      { es: 'Fríe en aceite caliente (180°C) con la abertura hacia abajo. Voltea para dorar parejo, unos 3-4 minutos total. Escurre sobre papel.', en: 'Fry in hot oil (180°C) seam-side down. Turn to brown evenly, about 3-4 minutes total. Drain on paper.' },
      { es: 'Sirve las flautas sobre una cama de lechuga. Baña con crema y salsa verde. Espolvorea queso fresco desmoronado encima.', en: 'Serve flautas on a bed of lettuce. Drizzle with cream and green salsa. Sprinkle crumbled fresh cheese on top.' }
    ],
    nutrition: { calories: 380, protein: '24g', carbs: '30g', fat: '18g', fiber: '3g' }
  },

  'huevos rancheros': {
    ingredients: [
      { es: '4 huevos', en: '4 eggs' },
      { es: '4 tortillas de maíz', en: '4 corn tortillas' },
      { es: '4 jitomates maduros', en: '4 ripe tomatoes' },
      { es: '2 chiles serranos', en: '2 serrano chiles' },
      { es: '¼ de cebolla blanca', en: '¼ white onion' },
      { es: '1 diente de ajo', en: '1 garlic clove' },
      { es: '2 cucharadas de aceite', en: '2 tablespoons oil' },
      { es: 'Frijoles refritos y aguacate para acompañar', en: 'Refried beans and avocado for serving' }
    ],
    steps: [
      { es: 'Asa los jitomates, chiles, cebolla y ajo en un comal hasta que se manchen de negro. Licúa hasta obtener una salsa rústica (no completamente tersa).', en: 'Roast tomatoes, chiles, onion and garlic on a comal until charred. Blend to get a rustic sauce (not completely smooth).' },
      { es: 'Fríe la salsa en aceite caliente 5 minutos. Sazona con sal. Mantén caliente.', en: 'Fry sauce in hot oil 5 minutes. Season with salt. Keep warm.' },
      { es: 'Fríe las tortillas en un poco de aceite hasta que estén ligeramente doradas pero flexibles. Coloca una en cada plato.', en: 'Fry tortillas in a little oil until slightly golden but flexible. Place one on each plate.' },
      { es: 'Fríe los huevos estrellados en aceite, rociando aceite caliente sobre la clara para cocinarla sin voltear. La yema debe quedar líquida.', en: 'Fry eggs sunny-side up in oil, spooning hot oil over the whites to cook without flipping. Yolk should be runny.' },
      { es: 'Coloca un huevo sobre cada tortilla, baña con la salsa roja y acompaña con frijoles refritos y rebanadas de aguacate.', en: 'Place an egg on each tortilla, pour red sauce over and serve with refried beans and avocado slices.' }
    ],
    nutrition: { calories: 340, protein: '16g', carbs: '24g', fat: '20g', fiber: '4g' }
  },

  'menudo': {
    ingredients: [
      { es: '1 kg de panza de res (mondongo), limpia y en trozos de 3cm', en: '1 kg beef tripe (honeycomb), clean and cut into 3cm pieces' },
      { es: '1 pata de res, limpia y en trozos', en: '1 beef foot, clean and in pieces' },
      { es: '8 chiles guajillo desvenados', en: '8 guajillo chiles, deveined' },
      { es: '3 chiles ancho desvenados', en: '3 ancho chiles, deveined' },
      { es: '6 dientes de ajo', en: '6 garlic cloves' },
      { es: '1 cebolla blanca grande', en: '1 large white onion' },
      { es: '1 lata de maíz pozolero', en: '1 can hominy corn' },
      { es: '1 cucharada de orégano mexicano', en: '1 tablespoon Mexican oregano' },
      { es: 'Sal al gusto', en: 'Salt to taste' },
      { es: 'Para servir: limón, orégano, cebolla picada, chile piquín y tortillas', en: 'For serving: lime, oregano, chopped onion, chile piquín and tortillas' }
    ],
    steps: [
      { es: 'Lava la panza y la pata con cal y vinagre, enjuaga varias veces. Coloca en una olla de presión con agua, sal, ½ cebolla y 3 ajos. Cocina 1.5 horas a presión.', en: 'Wash tripe and foot with lime and vinegar, rinse several times. Place in pressure cooker with water, salt, ½ onion and 3 garlic cloves. Cook 1.5 hours under pressure.' },
      { es: 'Tuesta y remoja los chiles. Licúa con el ajo y cebolla restantes. Cuela la salsa.', en: 'Toast and soak chiles. Blend with remaining garlic and onion. Strain sauce.' },
      { es: 'Agrega la salsa de chile colada y el maíz pozolero a la olla con la panza cocida. Cocina 30 minutos más a fuego medio.', en: 'Add strained chile sauce and hominy to pot with cooked tripe. Cook 30 more minutes over medium heat.' },
      { es: 'Rectifica sal y espolvorea orégano. Sirve muy caliente en platos hondos con abundante caldo. Acompaña con limones, cebolla picada, orégano extra y chile piquín.', en: 'Adjust salt and sprinkle oregano. Serve very hot in deep bowls with plenty of broth. Accompany with limes, chopped onion, extra oregano and chile piquín.' }
    ],
    nutrition: { calories: 380, protein: '32g', carbs: '35g', fat: '14g', fiber: '5g' }
  },

  'quesadilla': {
    ingredients: [
      { es: '8 tortillas de maíz grandes (hechas a mano si es posible)', en: '8 large corn tortillas (handmade if possible)' },
      { es: '300g de queso Oaxaca deshebrado', en: '300g Oaxaca cheese, shredded' },
      { es: '200g de flor de calabaza, limpia y picada (o champiñones)', en: '200g squash blossoms, cleaned and chopped (or mushrooms)' },
      { es: '2 cucharadas de epazote fresco picado', en: '2 tablespoons fresh epazote, chopped' },
      { es: '1 chile poblano asado, pelado y en rajas', en: '1 poblano chile, roasted, peeled and in strips' },
      { es: 'Aceite o manteca para el comal', en: 'Oil or lard for the comal' },
      { es: 'Salsa verde y crema para acompañar', en: 'Green salsa and cream for serving' }
    ],
    steps: [
      { es: 'Si preparas la masa, haz bolitas de 50g y aplana en una prensa para tortillas. Cocina en comal caliente 1 minuto por lado.', en: 'If making masa, form 50g balls and flatten in a tortilla press. Cook on hot comal 1 minute per side.' },
      { es: 'Saltea la flor de calabaza con epazote y rajas de poblano durante 3 minutos. Sazona con sal.', en: 'Sauté squash blossoms with epazote and poblano strips for 3 minutes. Season with salt.' },
      { es: 'Sobre la tortilla caliente, coloca queso Oaxaca y una porción del relleno. Dobla por la mitad presionando suavemente.', en: 'On the hot tortilla, place Oaxaca cheese and a portion of filling. Fold in half pressing gently.' },
      { es: 'Cocina en comal engrasado 2-3 minutos por lado hasta que el queso funda y la tortilla tenga puntos dorados crujientes. Sirve con salsa verde y crema.', en: 'Cook on greased comal 2-3 minutes per side until cheese melts and tortilla has crispy golden spots. Serve with green salsa and cream.' }
    ],
    nutrition: { calories: 360, protein: '18g', carbs: '30g', fat: '20g', fiber: '2g' }
  },

  'tlayuda': {
    ingredients: [
      { es: '4 tlayudas (tortillas de maíz grandes y crujientes de Oaxaca)', en: '4 tlayudas (large crispy Oaxacan corn tortillas)' },
      { es: '1 taza de asiento (manteca de cerdo con residuos)', en: '1 cup asiento (lard with pork residue)' },
      { es: '2 tazas de frijoles negros refritos oaxaqueños', en: '2 cups Oaxacan refried black beans' },
      { es: '200g de tasajo (cecina oaxaqueña), asado', en: '200g tasajo (Oaxacan dried beef), grilled' },
      { es: '200g de quesillo (queso Oaxaca) deshebrado', en: '200g quesillo (Oaxaca cheese), shredded' },
      { es: '1 aguacate maduro en rebanadas', en: '1 ripe avocado, sliced' },
      { es: 'Salsa de chile pasilla oaxaqueño', en: 'Oaxacan pasilla chile sauce' },
      { es: 'Lechuga o col picada', en: 'Shredded lettuce or cabbage' }
    ],
    steps: [
      { es: 'Calienta la tlayuda sobre un comal o parrilla hasta que esté crujiente pero flexible en el centro.', en: 'Heat tlayuda on a comal or grill until crispy but flexible in the center.' },
      { es: 'Unta una capa de asiento y luego frijoles negros refritos cubriendo toda la superficie.', en: 'Spread a layer of asiento then refried black beans covering the entire surface.' },
      { es: 'Distribuye el quesillo, las tiras de tasajo asado y las rebanadas de aguacate. Dobla por la mitad como una quesadilla gigante.', en: 'Distribute quesillo, grilled tasajo strips and avocado slices. Fold in half like a giant quesadilla.' },
      { es: 'Regresa al comal 2 minutos por lado para que el queso funda. Sirve abierta o doblada con salsa de pasilla y lechuga.', en: 'Return to comal 2 minutes per side for cheese to melt. Serve open or folded with pasilla sauce and lettuce.' }
    ],
    nutrition: { calories: 620, protein: '32g', carbs: '45g', fat: '35g', fiber: '8g' }
  },

  'esquites': {
    ingredients: [
      { es: '4 tazas de granos de elote (maíz tierno)', en: '4 cups corn kernels (fresh sweet corn)' },
      { es: '2 cucharadas de mantequilla', en: '2 tablespoons butter' },
      { es: '1 rama de epazote', en: '1 sprig epazote' },
      { es: '1 chile serrano picado', en: '1 serrano chile, chopped' },
      { es: '¼ de taza de caldo de pollo o agua', en: '¼ cup chicken broth or water' },
      { es: 'Mayonesa, chile en polvo, limón y queso cotija para servir', en: 'Mayonnaise, chili powder, lime and cotija cheese for serving' }
    ],
    steps: [
      { es: 'Derrite la mantequilla en un sartén grande a fuego medio-alto. Agrega los granos de elote y cocina sin mover 3 minutos para que doren.', en: 'Melt butter in a large skillet over medium-high heat. Add corn kernels and cook without stirring 3 minutes to brown.' },
      { es: 'Agrega el epazote, chile serrano y el caldo. Cocina 10 minutos más revolviendo ocasionalmente hasta que los granos estén tiernos y el líquido se haya evaporado.', en: 'Add epazote, serrano chile and broth. Cook 10 more minutes stirring occasionally until kernels are tender and liquid has evaporated.' },
      { es: 'Sirve en vasos o tazas. Agrega mayonesa al gusto, un chorro de limón, chile en polvo (tajín o valentina) y queso cotija desmoronado encima.', en: 'Serve in cups or glasses. Add mayonnaise to taste, a squeeze of lime, chili powder (tajín or valentina) and crumbled cotija cheese on top.' }
    ],
    nutrition: { calories: 280, protein: '8g', carbs: '32g', fat: '16g', fiber: '3g' }
  },

  'onigiri': {
    ingredients: [
      { es: '2 tazas de arroz japonés cocido (aún caliente)', en: '2 cups cooked Japanese rice (still warm)' },
      { es: '100g de salmón cocido y desmenuzado', en: '100g cooked salmon, flaked' },
      { es: '1 cucharada de sal', en: '1 tablespoon salt' },
      { es: '2 hojas de nori, cortadas en tiras', en: '2 nori sheets, cut into strips' },
      { es: '1 cucharadita de furikake (opcional)', en: '1 teaspoon furikake (optional)' }
    ],
    steps: [
      { es: 'Humedece tus manos con agua y frótalas con sal para evitar que el arroz se pegue y para sazonar.', en: 'Wet your hands with water and rub with salt to prevent rice sticking and to season.' },
      { es: 'Toma una porción de arroz caliente (½ taza aprox). Haz un hueco en el centro y coloca una cucharada de salmón. Cierra el arroz sobre el relleno.', en: 'Take a portion of warm rice (about ½ cup). Make a well in center and place a tablespoon of salmon. Close rice over filling.' },
      { es: 'Presiona firmemente con ambas manos formando un triángulo. Gira y presiona 3-4 veces hasta que quede compacto pero sin apretar demasiado.', en: 'Press firmly with both hands forming a triangle. Rotate and press 3-4 times until compact but not over-squeezed.' },
      { es: 'Envuelve la base del triángulo con una tira de nori. Si gustas, espolvorea furikake antes de servir. Se comen a temperatura ambiente.', en: 'Wrap the base of the triangle with a nori strip. If desired, sprinkle furikake before serving. Eaten at room temperature.' }
    ],
    nutrition: { calories: 210, protein: '10g', carbs: '35g', fat: '3g', fiber: '0g' }
  }
};

async function fixMexico() {
  console.log('🇲🇽 BATCH 2: Corrigiendo recetas de México + Onigiri 🇯🇵\n');
  
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
    // Buscar TODAS las recetas (no filtrar por país)
    const [recipes] = await conn.query('SELECT id, title FROM recipes ORDER BY id');
    
    let fixed = 0, skipped = 0;
    
    for (const r of recipes) {
      let title;
      try { title = typeof r.title === 'string' && r.title.startsWith('{') ? JSON.parse(r.title) : r.title; } catch(e) { title = r.title; }
      
      const titleEs = (typeof title === 'object' ? title.es : title) || '';
      const titleEn = (typeof title === 'object' ? title.en : title) || '';
      const titleSearch = `${titleEs} ${titleEn}`.toLowerCase();
      
      let matchedFix = null, matchedKey = null;
      for (const [key, fix] of Object.entries(mexicoFixes)) {
        if (titleSearch.includes(key)) {
          matchedFix = fix; matchedKey = key; break;
        }
      }
      
      if (matchedFix) {
        await conn.query(
          'UPDATE recipes SET ingredients = ?, steps = ?, nutrition = ? WHERE id = ?',
          [JSON.stringify(matchedFix.ingredients), JSON.stringify(matchedFix.steps), JSON.stringify(matchedFix.nutrition), r.id]
        );
        console.log(`✅ ID ${r.id}: ${titleEs || titleEn} [${matchedFix.ingredients.length} ings, ${matchedFix.steps.length} pasos]`);
        fixed++;
      }
    }
    
    console.log(`\n🎉 Batch 2 completado: ${fixed} recetas corregidas`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

fixMexico();
