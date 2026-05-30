import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const italyFixes = {
  'carbonara': {
    ingredients: [
      { es: '400g de spaghetti (o rigatoni)', en: '400g spaghetti (or rigatoni)' },
      { es: '200g de guanciale, en tiras gruesas', en: '200g guanciale, in thick strips' },
      { es: '6 yemas de huevo + 2 huevos enteros', en: '6 egg yolks + 2 whole eggs' },
      { es: '100g de queso Pecorino Romano rallado finamente', en: '100g finely grated Pecorino Romano cheese' },
      { es: 'Pimienta negra recién molida (abundante)', en: 'Freshly ground black pepper (generous)' },
      { es: 'Sal para el agua de cocción', en: 'Salt for pasta water' }
    ],
    steps: [
      { es: 'Pon a hervir abundante agua con sal generosa. Mientras tanto, bate las yemas y huevos con el Pecorino rallado y mucha pimienta negra hasta obtener una crema espesa.', en: 'Bring plenty of generously salted water to boil. Meanwhile, beat yolks and eggs with grated Pecorino and lots of black pepper until a thick cream forms.' },
      { es: 'Corta el guanciale en tiras de 1cm. Cocínalo en un sartén frío a fuego medio-bajo (sin aceite, suelta su propia grasa). Cocina 8-10 minutos hasta que esté dorado y crujiente. Reserva la grasa.', en: 'Cut guanciale into 1cm strips. Cook in a cold skillet over medium-low heat (no oil, it renders its own fat). Cook 8-10 minutes until golden and crispy. Reserve the fat.' },
      { es: 'Cocina la pasta 1 minuto menos que el tiempo del paquete (al dente firme). Reserva 2 tazas del agua de cocción antes de escurrir.', en: 'Cook pasta 1 minute less than package time (firm al dente). Reserve 2 cups pasta water before draining.' },
      { es: 'Transfiere la pasta al sartén con el guanciale FUERA del fuego. Mezcla bien con la grasa. Espera 30 segundos para que baje la temperatura.', en: 'Transfer pasta to skillet with guanciale OFF the heat. Mix well with fat. Wait 30 seconds for temperature to drop.' },
      { es: 'Vierte la mezcla de huevo y Pecorino sobre la pasta tibia. Revuelve vigorosamente agregando agua de cocción poco a poco hasta lograr una salsa cremosa y sedosa que cubra cada espagueti. NUNCA debe cuajar el huevo.', en: 'Pour egg and Pecorino mixture over warm pasta. Stir vigorously adding pasta water little by little until achieving a creamy, silky sauce coating every strand. Egg should NEVER scramble.' }
    ],
    nutrition: { calories: 620, protein: '28g', carbs: '55g', fat: '32g', fiber: '2g' }
  },

  'ossobuco': {
    ingredients: [
      { es: '4 cortes de ossobuco de ternera (chamorro) de 4cm de grosor', en: '4 veal ossobuco cuts (shank) 4cm thick' },
      { es: '1 cebolla, 2 zanahorias, 2 tallos de apio (todo en brunoise)', en: '1 onion, 2 carrots, 2 celery stalks (all in brunoise)' },
      { es: '1 lata de jitomates San Marzano (400g)', en: '1 can San Marzano tomatoes (400g)' },
      { es: '1 taza de vino blanco seco', en: '1 cup dry white wine' },
      { es: '2 tazas de caldo de res', en: '2 cups beef broth' },
      { es: 'Harina para enharinar', en: 'Flour for dredging' },
      { es: '3 cucharadas de aceite de oliva + 2 de mantequilla', en: '3 tablespoons olive oil + 2 butter' },
      { es: 'Gremolata: ralladura de 1 limón, 2 dientes de ajo picados, perejil fresco', en: 'Gremolata: zest of 1 lemon, 2 minced garlic cloves, fresh parsley' },
      { es: 'Sal y pimienta', en: 'Salt and pepper' }
    ],
    steps: [
      { es: 'Ata cada ossobuco con hilo de cocina para que mantenga su forma. Sazona con sal y pimienta, enharina sacudiendo el exceso.', en: 'Tie each ossobuco with kitchen twine to maintain shape. Season with salt and pepper, dredge in flour shaking off excess.' },
      { es: 'Sella los ossobucos en aceite y mantequilla caliente, 4 minutos por lado hasta dorar profundamente. Retira y reserva.', en: 'Sear ossobuco in hot oil and butter, 4 minutes per side until deeply browned. Remove and reserve.' },
      { es: 'En la misma cacerola, sofríe el soffritto (cebolla, zanahoria, apio) 8 minutos a fuego medio. Desglasa con vino blanco raspando el fondo.', en: 'In same pot, sauté soffritto (onion, carrot, celery) 8 minutes over medium heat. Deglaze with white wine scraping bottom.' },
      { es: 'Agrega los jitomates aplastándolos con la mano, el caldo y regresa los ossobucos. El líquido debe llegar a ¾ de la carne. Tapa y hornea a 160°C durante 2-2.5 horas.', en: 'Add tomatoes crushing by hand, broth and return ossobuco. Liquid should reach ¾ up the meat. Cover and bake at 160°C for 2-2.5 hours.' },
      { es: 'La carne está lista cuando se separa del hueso al tocarla. Prepara la gremolata mezclando ralladura de limón, ajo y perejil.', en: 'Meat is ready when it separates from bone when touched. Prepare gremolata by mixing lemon zest, garlic and parsley.' },
      { es: 'Sirve cada ossobuco con su salsa, espolvoreado con gremolata fresca. Acompaña con risotto alla milanese (con azafrán). El tuétano del hueso es un manjar que se come con una cucharita.', en: 'Serve each ossobuco with sauce, sprinkled with fresh gremolata. Accompany with risotto alla milanese (with saffron). The bone marrow is a delicacy eaten with a small spoon.' }
    ],
    nutrition: { calories: 520, protein: '42g', carbs: '18g', fat: '28g', fiber: '3g' }
  },

  'calzone': {
    ingredients: [
      { es: '500g de masa para pizza (harina, agua, levadura, sal, aceite de oliva)', en: '500g pizza dough (flour, water, yeast, salt, olive oil)' },
      { es: '200g de mozzarella fresca, en cubos', en: '200g fresh mozzarella, cubed' },
      { es: '150g de ricotta', en: '150g ricotta' },
      { es: '100g de salami o prosciutto cotto', en: '100g salami or prosciutto cotto' },
      { es: '½ taza de salsa de tomate', en: '½ cup tomato sauce' },
      { es: '1 huevo batido (para barnizar)', en: '1 beaten egg (for brushing)' },
      { es: 'Albahaca fresca, orégano, sal y pimienta', en: 'Fresh basil, oregano, salt and pepper' }
    ],
    steps: [
      { es: 'Precalienta el horno a 230°C con una piedra para pizza si tienes. Divide la masa en 4 bolas iguales y estira cada una en un círculo de 25cm.', en: 'Preheat oven to 230°C with a pizza stone if you have one. Divide dough into 4 equal balls and stretch each into a 25cm circle.' },
      { es: 'En una mitad de cada círculo, unta salsa de tomate dejando 2cm de borde libre. Agrega ricotta en cucharadas, cubos de mozzarella, salami y albahaca.', en: 'On one half of each circle, spread tomato sauce leaving 2cm border. Add ricotta in dollops, mozzarella cubes, salami and basil.' },
      { es: 'Dobla la otra mitad sobre el relleno formando una media luna. Sella los bordes presionando con un tenedor.', en: 'Fold other half over filling forming a half-moon. Seal edges pressing with a fork.' },
      { es: 'Haz 2-3 pequeños cortes en la superficie para que escape el vapor. Barniza con huevo batido.', en: 'Make 2-3 small cuts on surface for steam to escape. Brush with beaten egg.' },
      { es: 'Hornea 15-18 minutos hasta que estén dorados e inflados. La masa debe sonar hueca al golpear la base. Sirve caliente con salsa marinara extra.', en: 'Bake 15-18 minutes until golden and puffed. Dough should sound hollow when tapping base. Serve hot with extra marinara sauce.' }
    ],
    nutrition: { calories: 480, protein: '22g', carbs: '45g', fat: '24g', fiber: '2g' }
  },

  'carpaccio': {
    ingredients: [
      { es: '300g de lomo de res de primera calidad, congelado 2h', en: '300g premium beef tenderloin, frozen 2h' },
      { es: '100g de queso parmigiano reggiano en lascas', en: '100g Parmigiano Reggiano cheese in shavings' },
      { es: '3 cucharadas de aceite de oliva extra virgen de calidad', en: '3 tablespoons quality extra virgin olive oil' },
      { es: 'Jugo de 1 limón', en: 'Juice of 1 lemon' },
      { es: '1 puñado de rúcula (arúgula)', en: '1 handful arugula' },
      { es: 'Alcaparras, sal de mar en escamas y pimienta negra', en: 'Capers, flaky sea salt and black pepper' }
    ],
    steps: [
      { es: 'Congela el lomo parcialmente (2 horas) para poder rebanarlo con un cuchillo muy afilado en láminas casi transparentes de 2mm.', en: 'Partially freeze tenderloin (2 hours) to slice with a very sharp knife into almost transparent 2mm slices.' },
      { es: 'Dispón las láminas en un plato frío, cubriendo toda la superficie en una sola capa. La carne debe estar a temperatura de refrigerador.', en: 'Arrange slices on a cold plate, covering entire surface in a single layer. Meat should be at refrigerator temperature.' },
      { es: 'Rocía generosamente con aceite de oliva y jugo de limón. Sazona con sal de mar en escamas y pimienta negra recién molida.', en: 'Drizzle generously with olive oil and lemon juice. Season with flaky sea salt and freshly ground black pepper.' },
      { es: 'Corona con lascas de parmigiano, un puñado de rúcula y unas alcaparras. Sirve inmediatamente como antipasto.', en: 'Top with Parmigiano shavings, a handful of arugula and some capers. Serve immediately as an antipasto.' }
    ],
    nutrition: { calories: 280, protein: '25g', carbs: '3g', fat: '20g', fiber: '0g' }
  },

  'polenta': {
    ingredients: [
      { es: '2 tazas de polenta de maíz (cocción lenta, no instantánea)', en: '2 cups corn polenta (slow-cook, not instant)' },
      { es: '6 tazas de agua o caldo', en: '6 cups water or broth' },
      { es: '500g de carne de res o cerdo para el ragú, en trozos', en: '500g beef or pork for ragú, in chunks' },
      { es: '1 lata de jitomates pelados (400g)', en: '1 can peeled tomatoes (400g)' },
      { es: '1 cebolla, 1 zanahoria, 1 tallo de apio (soffritto)', en: '1 onion, 1 carrot, 1 celery stalk (soffritto)' },
      { es: '1 taza de vino tinto', en: '1 cup red wine' },
      { es: '50g de mantequilla', en: '50g butter' },
      { es: '60g de queso parmesano rallado', en: '60g grated Parmesan cheese' },
      { es: 'Aceite de oliva, sal y pimienta', en: 'Olive oil, salt and pepper' }
    ],
    steps: [
      { es: 'Para el ragú: sella la carne en aceite caliente hasta dorar bien. Retira y en la misma olla sofríe el soffritto 5 minutos.', en: 'For ragú: sear meat in hot oil until well browned. Remove and sauté soffritto in same pot 5 minutes.' },
      { es: 'Desglasa con vino tinto. Regresa la carne, agrega jitomates aplastados. Tapa y cocina a fuego bajo 2-3 horas hasta que la carne se deshaga. Desmenuza con un tenedor.', en: 'Deglaze with red wine. Return meat, add crushed tomatoes. Cover and cook on low 2-3 hours until meat falls apart. Shred with a fork.' },
      { es: 'Para la polenta: hierve el agua con sal. Vierte la polenta en lluvia revolviendo constantemente con un batidor para evitar grumos.', en: 'For polenta: boil water with salt. Pour polenta in a stream while stirring constantly with a whisk to prevent lumps.' },
      { es: 'Cocina a fuego bajo revolviendo cada 5-10 minutos durante 40-45 minutos. La polenta está lista cuando se despega de las paredes de la olla.', en: 'Cook on low stirring every 5-10 minutes for 40-45 minutes. Polenta is ready when it pulls away from pot walls.' },
      { es: 'Retira del fuego, incorpora mantequilla y parmesano. Sirve la polenta cremosa en platos hondos, coronada con el ragú caliente.', en: 'Remove from heat, fold in butter and Parmesan. Serve creamy polenta in deep plates, topped with hot ragú.' }
    ],
    nutrition: { calories: 580, protein: '32g', carbs: '48g', fat: '28g', fiber: '3g' }
  },

  'cacciatore': {
    ingredients: [
      { es: '8 piezas de pollo (muslos y piernas) con hueso', en: '8 chicken pieces (thighs and legs) bone-in' },
      { es: '1 lata de jitomates San Marzano (400g)', en: '1 can San Marzano tomatoes (400g)' },
      { es: '200g de champiñones cremini, en cuartos', en: '200g cremini mushrooms, quartered' },
      { es: '1 pimiento rojo en tiras', en: '1 red pepper in strips' },
      { es: '1 cebolla en gajos', en: '1 onion in wedges' },
      { es: '½ taza de aceitunas negras Kalamata', en: '½ cup Kalamata black olives' },
      { es: '½ taza de vino blanco seco', en: '½ cup dry white wine' },
      { es: '4 dientes de ajo laminados', en: '4 garlic cloves, sliced' },
      { es: '2 cucharadas de alcaparras', en: '2 tablespoons capers' },
      { es: 'Romero, tomillo y orégano fresco', en: 'Fresh rosemary, thyme and oregano' },
      { es: 'Aceite de oliva, sal y pimienta', en: 'Olive oil, salt and pepper' }
    ],
    steps: [
      { es: 'Sazona el pollo con sal y pimienta. Sella en aceite de oliva caliente en una cacerola amplia, 4 minutos por lado hasta dorar la piel. Retira.', en: 'Season chicken with salt and pepper. Sear in hot olive oil in a wide casserole, 4 minutes per side until skin is golden. Remove.' },
      { es: 'Sofríe cebolla, pimiento y champiñones en la misma grasa durante 5 minutos. Agrega el ajo y cocina 1 minuto más.', en: 'Sauté onion, pepper and mushrooms in same fat for 5 minutes. Add garlic and cook 1 more minute.' },
      { es: 'Desglasa con vino blanco. Agrega los jitomates aplastados, aceitunas, alcaparras y hierbas. Regresa el pollo enterrándolo parcialmente en la salsa.', en: 'Deglaze with white wine. Add crushed tomatoes, olives, capers and herbs. Return chicken partially burying in sauce.' },
      { es: 'Tapa y cocina a fuego medio-bajo 35-40 minutos hasta que el pollo esté tierno y la salsa espesa. Sirve con pasta o pan crujiente para mojar en la salsa.', en: 'Cover and cook over medium-low 35-40 minutes until chicken is tender and sauce thick. Serve with pasta or crusty bread for dipping in sauce.' }
    ],
    nutrition: { calories: 420, protein: '35g', carbs: '15g', fat: '24g', fiber: '3g' }
  },

  'prosciutto e melone': {
    ingredients: [
      { es: '200g de prosciutto di Parma, en lonchas finas', en: '200g Prosciutto di Parma, thinly sliced' },
      { es: '1 melón cantalupo maduro', en: '1 ripe cantaloupe melon' },
      { es: 'Aceite de oliva extra virgen', en: 'Extra virgin olive oil' },
      { es: 'Pimienta negra recién molida', en: 'Freshly ground black pepper' },
      { es: 'Hojas de menta fresca (opcional)', en: 'Fresh mint leaves (optional)' }
    ],
    steps: [
      { es: 'Corta el melón en gajos finos o en bolas usando un sacabolas. Debe estar a temperatura ambiente para máximo sabor.', en: 'Cut melon into thin wedges or balls using a melon baller. Should be at room temperature for maximum flavor.' },
      { es: 'Envuelve cada gajo de melón con una loncha de prosciutto, o disponlos alternados en un plato grande de forma elegante.', en: 'Wrap each melon wedge with a prosciutto slice, or arrange alternating on a large plate elegantly.' },
      { es: 'Rocía con un hilo fino de aceite de oliva, pimienta negra y hojas de menta. Sirve como antipasto. La combinación dulce-salado es sublime.', en: 'Drizzle with a thin thread of olive oil, black pepper and mint leaves. Serve as antipasto. The sweet-salty combination is sublime.' }
    ],
    nutrition: { calories: 220, protein: '16g', carbs: '18g', fat: '10g', fiber: '1g' }
  },

  'bolognese': {
    ingredients: [
      { es: '400g de tagliatelle o pappardelle frescos', en: '400g fresh tagliatelle or pappardelle' },
      { es: '300g de carne de res molida', en: '300g ground beef' },
      { es: '150g de carne de cerdo molida', en: '150g ground pork' },
      { es: '100g de pancetta en cubitos', en: '100g pancetta, diced' },
      { es: '1 cebolla, 1 zanahoria, 1 tallo de apio (todo picado fino)', en: '1 onion, 1 carrot, 1 celery stalk (all finely chopped)' },
      { es: '1 taza de vino tinto', en: '1 cup red wine' },
      { es: '2 cucharadas de concentrado de tomate', en: '2 tablespoons tomato paste' },
      { es: '1 taza de leche entera', en: '1 cup whole milk' },
      { es: '1 taza de caldo de res', en: '1 cup beef broth' },
      { es: '2 hojas de laurel y una pizca de nuez moscada', en: '2 bay leaves and a pinch of nutmeg' },
      { es: 'Parmesano rallado para servir', en: 'Grated Parmesan for serving' }
    ],
    steps: [
      { es: 'Sofríe la pancetta a fuego medio hasta que suelte su grasa. Agrega el soffritto (cebolla, zanahoria, apio) y cocina 10 minutos hasta suavizar.', en: 'Sauté pancetta over medium heat until it renders its fat. Add soffritto (onion, carrot, celery) and cook 10 minutes until soft.' },
      { es: 'Sube el fuego, agrega ambas carnes molidas y cocina sin mover 5 minutos para que dore (no revuelvas inmediatamente, el dorado es clave).', en: 'Raise heat, add both ground meats and cook without stirring 5 minutes to brown (don\'t stir immediately, browning is key).' },
      { es: 'Vierte el vino tinto y cocina hasta que se evapore. Agrega el concentrado de tomate y revuelve 2 minutos.', en: 'Pour red wine and cook until evaporated. Add tomato paste and stir 2 minutes.' },
      { es: 'Incorpora la leche (ingrediente secreto de la auténtica boloñesa) y cocina hasta que se absorba. Esto aporta dulzura y suavidad.', en: 'Add milk (secret ingredient of authentic Bolognese) and cook until absorbed. This adds sweetness and smoothness.' },
      { es: 'Agrega caldo, laurel y nuez moscada. Baja el fuego al mínimo y cocina destapado 3-4 HORAS, agregando caldo si se seca. La paciencia es todo.', en: 'Add broth, bay leaves and nutmeg. Lower heat to minimum and cook uncovered 3-4 HOURS, adding broth if it dries. Patience is everything.' },
      { es: 'Cocina la pasta fresca 2-3 minutos. Mézclala con el ragú en el sartén. Sirve con abundante parmesano rallado.', en: 'Cook fresh pasta 2-3 minutes. Toss with ragú in the pan. Serve with abundant grated Parmesan.' }
    ],
    nutrition: { calories: 650, protein: '35g', carbs: '52g', fat: '32g', fiber: '3g' }
  },

  'tortellini': {
    ingredients: [
      { es: '500g de tortellini frescos (rellenos de carne o ricotta)', en: '500g fresh tortellini (meat or ricotta filled)' },
      { es: '2L de caldo de pollo casero (o de res), bien sazonado', en: '2L homemade chicken broth (or beef), well seasoned' },
      { es: 'Parmesano rallado para servir', en: 'Grated Parmesan for serving' },
      { es: 'Pimienta negra recién molida', en: 'Freshly ground black pepper' }
    ],
    steps: [
      { es: 'Calienta el caldo hasta hervir. El caldo debe ser de excelente calidad; esta receta depende 100% de eso.', en: 'Heat broth to a boil. Broth must be excellent quality; this recipe depends 100% on it.' },
      { es: 'Agrega los tortellini al caldo hirviendo. Cocina 3-4 minutos (frescos) hasta que floten en la superficie.', en: 'Add tortellini to boiling broth. Cook 3-4 minutes (fresh) until they float to the surface.' },
      { es: 'Sirve en platos hondos con abundante caldo. Espolvorea parmesano rallado y pimienta negra. Es uno de los platos más reconfortantes de la cocina italiana: simpleza absoluta.', en: 'Serve in deep bowls with plenty of broth. Sprinkle grated Parmesan and black pepper. One of the most comforting Italian dishes: absolute simplicity.' }
    ],
    nutrition: { calories: 380, protein: '20g', carbs: '42g', fat: '14g', fiber: '1g' }
  },

  'veal milanese': {
    ingredients: [
      { es: '4 chuletas de ternera con hueso, aplanadas a 5mm', en: '4 bone-in veal cutlets, pounded to 5mm' },
      { es: '2 tazas de pan rallado fino', en: '2 cups fine breadcrumbs' },
      { es: '3 huevos batidos', en: '3 beaten eggs' },
      { es: '1 taza de harina', en: '1 cup flour' },
      { es: '100g de mantequilla clarificada', en: '100g clarified butter' },
      { es: 'Gajos de limón, rúcula y jitomates cherry para acompañar', en: 'Lemon wedges, arugula and cherry tomatoes for serving' },
      { es: 'Sal y pimienta', en: 'Salt and pepper' }
    ],
    steps: [
      { es: 'Aplanar las chuletas entre plástico hasta 5mm con un mazo. Sazona con sal y pimienta ambos lados.', en: 'Pound cutlets between plastic to 5mm with a mallet. Season with salt and pepper on both sides.' },
      { es: 'Empaniza en orden: harina (sacude exceso), huevo batido, pan rallado presionando firmemente para adherir bien.', en: 'Bread in order: flour (shake excess), beaten egg, breadcrumbs pressing firmly to adhere well.' },
      { es: 'Calienta mantequilla clarificada en un sartén amplio a fuego medio. La mantequilla debe espumar pero NO humear.', en: 'Heat clarified butter in a wide skillet over medium heat. Butter should foam but NOT smoke.' },
      { es: 'Fríe cada chuleta 3-4 minutos por lado hasta obtener una costra dorada y crujiente uniforme. Escurre sobre rejilla.', en: 'Fry each cutlet 3-4 minutes per side until achieving a uniform golden crispy crust. Drain on rack.' },
      { es: 'Sirve de inmediato con gajos de limón. Corona con una ensalada de rúcula, jitomates cherry y lascas de parmesano aliñada con limón y aceite de oliva.', en: 'Serve immediately with lemon wedges. Top with arugula salad, cherry tomatoes and Parmesan shavings dressed with lemon and olive oil.' }
    ],
    nutrition: { calories: 520, protein: '38g', carbs: '30g', fat: '28g', fiber: '1g' }
  },

  'bistecca fiorentina': {
    ingredients: [
      { es: '1 T-bone de res de 1kg y 5cm de grosor (corte estilo Florencia)', en: '1 beef T-bone 1kg and 5cm thick (Florence-style cut)' },
      { es: 'Sal gruesa de mar', en: 'Coarse sea salt' },
      { es: 'Pimienta negra recién molida', en: 'Freshly ground black pepper' },
      { es: 'Aceite de oliva extra virgen toscano', en: 'Tuscan extra virgin olive oil' },
      { es: 'Gajos de limón y romero fresco', en: 'Lemon wedges and fresh rosemary' }
    ],
    steps: [
      { es: 'Saca la carne del refrigerador 2 horas antes para que alcance temperatura ambiente. Este paso es NON-NEGOTIABLE para una cocción uniforme.', en: 'Remove meat from fridge 2 hours before to reach room temperature. This step is NON-NEGOTIABLE for even cooking.' },
      { es: 'Calienta una parrilla de carbón a temperatura muy alta (las brasas deben estar blancas). No uses gas si puedes evitarlo.', en: 'Heat charcoal grill to very high temperature (coals should be white). Don\'t use gas if you can avoid it.' },
      { es: 'NO sazonar antes. Coloca el bistec directamente sobre las brasas. Cocina 5 minutos por lado para un término "al sangue" (raro, como mandan los florentinos). NO presiones la carne ni la pinches.', en: 'Do NOT season before. Place steak directly over coals. Cook 5 minutes per side for "al sangue" (rare, as Florentines command). Do NOT press or puncture meat.' },
      { es: 'Al voltear, espolvorea generosamente con sal gruesa de mar en el lado ya cocido.', en: 'When flipping, generously sprinkle coarse sea salt on the already cooked side.' },
      { es: 'Retira de la parrilla, sazona el segundo lado con sal y pimienta. Deja reposar 5 minutos parado sobre el hueso (verticalmente).', en: 'Remove from grill, season second side with salt and pepper. Let rest 5 minutes standing on the bone (vertically).' },
      { es: 'Corta la carne del hueso, rebana y sirve sobre una tabla de madera. Rocía con aceite de oliva y un apretón de limón. Acompaña con frijoles cannellini y rúcula.', en: 'Cut meat from bone, slice and serve on a wooden board. Drizzle with olive oil and a squeeze of lemon. Accompany with cannellini beans and arugula.' }
    ],
    nutrition: { calories: 650, protein: '55g', carbs: '0g', fat: '48g', fiber: '0g' }
  },

  'lasa': {
    ingredients: [
      { es: '12 láminas de pasta para lasaña (frescas o secas)', en: '12 lasagna pasta sheets (fresh or dried)' },
      { es: '500g de ragú boloñesa (ver receta de Bolognese)', en: '500g Bolognese ragú (see Bolognese recipe)' },
      { es: '500ml de salsa bechamel (leche, mantequilla, harina, nuez moscada)', en: '500ml béchamel sauce (milk, butter, flour, nutmeg)' },
      { es: '200g de queso parmesano rallado', en: '200g grated Parmesan cheese' },
      { es: '250g de mozzarella rallada', en: '250g shredded mozzarella' },
      { es: 'Mantequilla para engrasar', en: 'Butter for greasing' }
    ],
    steps: [
      { es: 'Prepara la bechamel: derrite 60g de mantequilla, agrega 60g de harina y cocina 2 minutos. Vierte 500ml de leche caliente poco a poco batiendo sin parar. Sazona con nuez moscada, sal y pimienta.', en: 'Prepare béchamel: melt 60g butter, add 60g flour and cook 2 minutes. Pour 500ml hot milk gradually whisking non-stop. Season with nutmeg, salt and pepper.' },
      { es: 'Si usas pasta seca, cocínala 2 minutos menos del tiempo indicado. Si es fresca, úsala directamente.', en: 'If using dried pasta, cook 2 minutes less than indicated time. If fresh, use directly.' },
      { es: 'Engrasa un refractario de 25x35cm. Arma las capas: bechamel, pasta, ragú, parmesano. Repite 4 veces. La capa final debe ser bechamel cubierta con mozzarella y parmesano.', en: 'Grease a 25x35cm baking dish. Build layers: béchamel, pasta, ragú, Parmesan. Repeat 4 times. Top layer should be béchamel covered with mozzarella and Parmesan.' },
      { es: 'Hornea a 190°C tapada con aluminio 25 minutos. Destapa y hornea 15 minutos más hasta que la superficie burbujee y se dore.', en: 'Bake at 190°C covered with foil 25 minutes. Uncover and bake 15 more minutes until surface bubbles and browns.' },
      { es: 'CRUCIAL: deja reposar 15-20 minutos antes de cortar. Esto permite que las capas se asienten y los cortes queden limpios.', en: 'CRUCIAL: let rest 15-20 minutes before cutting. This allows layers to settle and cuts to be clean.' }
    ],
    nutrition: { calories: 580, protein: '30g', carbs: '45g', fat: '32g', fiber: '2g' }
  }
};

async function fixItaly() {
  console.log('🇮🇹 BATCH 4: Corrigiendo recetas de Italia\n');
  const pool = mysql.createPool({
    host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME, ssl: { rejectUnauthorized: false }
  });
  let conn;
  try {
    conn = await pool.getConnection();
    const [recipes] = await conn.query('SELECT id, title FROM recipes ORDER BY id');
    let fixed = 0;
    for (const r of recipes) {
      let title;
      try { title = typeof r.title === 'string' && r.title.startsWith('{') ? JSON.parse(r.title) : r.title; } catch(e) { title = r.title; }
      const titleEs = (typeof title === 'object' ? title.es : title) || '';
      const titleEn = (typeof title === 'object' ? title.en : title) || '';
      const titleSearch = `${titleEs} ${titleEn}`.toLowerCase();
      let matchedFix = null, matchedKey = null;
      for (const [key, fix] of Object.entries(italyFixes)) {
        if (titleSearch.includes(key)) { matchedFix = fix; matchedKey = key; break; }
      }
      if (matchedFix) {
        await conn.query('UPDATE recipes SET ingredients = ?, steps = ?, nutrition = ? WHERE id = ?',
          [JSON.stringify(matchedFix.ingredients), JSON.stringify(matchedFix.steps), JSON.stringify(matchedFix.nutrition), r.id]);
        console.log(`✅ ID ${r.id}: ${titleEs || titleEn} [${matchedFix.ingredients.length} ings, ${matchedFix.steps.length} pasos]`);
        fixed++;
      }
    }
    console.log(`\n🎉 Batch 4 completado: ${fixed} recetas corregidas`);
  } catch (error) { console.error('❌ Error:', error); }
  finally { if (conn) conn.release(); pool.end(); }
}
fixItaly();
