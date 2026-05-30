import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// ═══════════════════════════════════════════════
// DESCRIPCIÓN MANUAL para CADA receta
// Formato: id → { es, en }
// ═══════════════════════════════════════════════
const descriptions = {
  // ═══ CHINA ═══
  1: {
    es: 'Trozos de pollo crujientes salteados al wok con chiles secos, cacahuates tostados y la clásica salsa agridulce-picante de Sichuan. Un plato explosivo con el adictivo sabor del málà.',
    en: 'Crispy chicken pieces wok-tossed with dried chiles, toasted peanuts and the classic sweet-sour-spicy Sichuan sauce. An explosive dish with the addictive málà flavor.'
  },
  2: {
    es: 'Cubos de tofu sedoso nadando en una salsa roja y ardiente de doubanjiang, carne de cerdo picada y pimienta de Sichuan que adormece la lengua. Comida reconfortante picante de Chengdu.',
    en: 'Silky tofu cubes swimming in a fiery red doubanjiang sauce with minced pork and tongue-numbing Sichuan peppercorn. Spicy comfort food from Chengdu.'
  },
  3: {
    es: 'Pato entero lacado con miel y especias, asado hasta obtener una piel ultra crujiente y carne tierna. Se trincha en la mesa y se sirve en crepas finas con cebollín y salsa hoisin.',
    en: 'Whole duck glazed with honey and spices, roasted until the skin is ultra-crispy and the meat is tender. Carved tableside and served in thin crepes with scallion and hoisin sauce.'
  },
  4: {
    es: 'Empanadillas chinas rellenas de verduras y cerdo, envueltas a mano con masa delgada. Se pueden hervir, freír o cocer al vapor — el dumpling perfecto para compartir.',
    en: 'Chinese dumplings filled with vegetables and pork, hand-wrapped in thin dough. Boiled, pan-fried or steamed — the perfect dumpling to share.'
  },
  5: {
    es: 'Trozos de cerdo rebozados y fritos hasta quedar crujientes, bañados en una salsa agridulce vibrante con piña, pimiento y cebolla. El clásico cantonés que todos aman.',
    en: 'Battered and fried pork pieces coated in a vibrant sweet and sour sauce with pineapple, bell pepper and onion. The Cantonese classic everyone loves.'
  },
  6: {
    es: 'Fideos de trigo salteados al wok con vegetales crujientes, proteína y una salsa oscura de soya y aceite de sésamo. Street food chino en su máxima expresión.',
    en: 'Wheat noodles wok-tossed with crispy vegetables, protein and a dark soy and sesame oil sauce. Chinese street food at its finest.'
  },
  7: {
    es: 'Arroz salteado al wok a fuego alto con huevo, camarones, jamón chino (char siu), chícharos y cebollín. El arroz frito original de la ciudad de Yangzhou.',
    en: 'Rice wok-fried over high heat with egg, shrimp, Chinese ham (char siu), peas and scallions. The original fried rice from the city of Yangzhou.'
  },
  8: {
    es: 'Pequeñas cestas abiertas de masa wonton rellenas de cerdo y camarón, coronadas con una gamba. Cocidas al vapor en vaporera de bambú — el rey del dim sum cantonés.',
    en: 'Small open wonton baskets filled with pork and shrimp, topped with a prawn. Steamed in a bamboo steamer — the king of Cantonese dim sum.'
  },
  10: {
    es: 'Berenjenas fritas y salteadas en la salsa Yu Xiang de Sichuan: una mezcla adictiva de pasta de chile, vinagre, soya y azúcar con cerdo picado. Sabor agridulce-picante irresistible.',
    en: 'Fried eggplants stir-fried in Sichuan Yu Xiang sauce: an addictive blend of chili paste, vinegar, soy and sugar with minced pork. Irresistible sweet-sour-spicy flavor.'
  },
  11: {
    es: 'Selección de bocados al vapor en vaporeras de bambú: har gow de camarón, siu mai de cerdo y dumplings de verduras. Una experiencia compartida de la tradición cantonesa.',
    en: 'Selection of steamed bites in bamboo baskets: shrimp har gow, pork siu mai and vegetable dumplings. A shared experience from Cantonese tradition.'
  },
  12: {
    es: 'Rollitos rellenos de col, zanahoria y champiñones en juliana fina, envueltos en masa crujiente y fritos hasta quedar dorados y crocantes. Se sirven con salsa agridulce.',
    en: 'Rolls filled with finely julienned cabbage, carrot and mushrooms, wrapped in crispy dough and fried until golden and crunchy. Served with sweet and sour sauce.'
  },
  13: {
    es: 'Rollitos de masa crujiente rellenos de plátano maduro con canela y azúcar morena. Fritos y espolvoreados con azúcar glass — el postre callejero asiático más adictivo.',
    en: 'Crispy dough rolls filled with ripe banana, cinnamon and brown sugar. Fried and dusted with powdered sugar — the most addictive Asian street dessert.'
  },
  // ═══ JAPAN ═══
  14: {
    es: 'Rollos de sushi con arroz sazonado con vinagre, alga nori y rellenos frescos como salmón, aguacate y pepino. El arte japonés de la perfección en cada bocado.',
    en: 'Sushi rolls with vinegared rice, nori seaweed and fresh fillings like salmon, avocado and cucumber. The Japanese art of perfection in every bite.'
  },
  15: {
    es: 'Caldo de huesos de cerdo hervido durante horas hasta obtener un broth cremoso y lechoso. Servido con fideos ramen, chashu de cerdo, huevo marinado y nori.',
    en: 'Pork bone broth simmered for hours until creamy and milky. Served with ramen noodles, pork chashu, marinated egg and nori.'
  },
  16: {
    es: 'Bol de arroz cubierto con tonkatsu — chuleta de cerdo empanizada y frita — bañada en salsa de huevo semicuajado. Comida reconfortante japonesa por excelencia.',
    en: 'Rice bowl topped with tonkatsu — breaded and fried pork cutlet — bathed in a semi-set egg sauce. The ultimate Japanese comfort food.'
  },
  17: {
    es: 'Tortilla espesa de masa con col rallada, panceta de cerdo, salsa okonomiyaki, mayonesa japonesa, bonito danzante y alga aonori. El "pancake salado" de Osaka.',
    en: 'Thick batter pancake loaded with shredded cabbage, pork belly, okonomiyaki sauce, Japanese mayo, dancing bonito and aonori seaweed. Osaka\'s famous savory pancake.'
  },
  18: {
    es: 'Filete de salmón marinado en miso blanco durante 48 horas, asado al horno hasta que caramelice. La técnica que transforma el pescado en mantequilla.',
    en: 'Salmon fillet marinated in white miso for 48 hours, roasted until caramelized. The technique that turns fish into butter.'
  },
  19: {
    es: 'Bol de arroz cubierto con ternera cortada en láminas finas, cocida en un caldo dulce de dashi, soya y mirin con cebolla caramelizada. Fast food japonés desde 1899.',
    en: 'Rice bowl topped with thinly sliced beef simmered in sweet dashi, soy and mirin broth with caramelized onion. Japanese fast food since 1899.'
  },
  20: {
    es: 'Bolitas crujientes de masa rellenas de pulpo tierno, cubiertas con salsa takoyaki, mayonesa, bonito y aonori. El snack callejero icónico de Osaka.',
    en: 'Crispy batter balls filled with tender octopus, topped with takoyaki sauce, mayo, bonito flakes and aonori. Osaka\'s iconic street snack.'
  },
  21: {
    es: 'Arroz al vinagre prensado a mano con una lámina de pescado fresco encima: atún, salmón, hamachi o camarón. La forma más pura del sushi, donde brilla el producto.',
    en: 'Hand-pressed vinegared rice topped with a slice of fresh fish: tuna, salmon, hamachi or shrimp. The purest form of sushi, where the product shines.'
  },
  22: {
    es: 'Fideos de trigo sarraceno servidos fríos sobre una estera de bambú con salsa tsuyu para mojar, wasabi y cebollín. Refrescante y elegante — ideal para el verano japonés.',
    en: 'Buckwheat noodles served cold on a bamboo mat with tsuyu dipping sauce, wasabi and scallions. Refreshing and elegant — ideal for Japanese summer.'
  },
  23: {
    es: 'Arroz frito con ketchup envuelto en una tortilla de huevo cremosa y sedosa. Se abre en la mesa para cubrir el arroz. Comfort food japonés con influencia occidental.',
    en: 'Ketchup fried rice wrapped in a creamy, silky egg omelette. Split open at the table to cover the rice. Japanese comfort food with Western influence.'
  },
  24: {
    es: 'Vegetales y mariscos rebozados en una masa ligera y helada, fritos en aceite caliente hasta quedar crujientes y aireados. Se sirve con tentsuyu y daikon rallado.',
    en: 'Vegetables and seafood dipped in a light, ice-cold batter, fried in hot oil until crispy and airy. Served with tentsuyu and grated daikon.'
  },
  25: {
    es: 'Brochetas de pollo asadas sobre carbón binchotan, bañadas en tare dulce de soya o simplemente con sal. El izakaya japonés en su forma más pura.',
    en: 'Chicken skewers grilled over binchotan charcoal, basted with sweet soy tare or simply with salt. The Japanese izakaya at its purest.'
  },
  26: {
    es: 'Láminas ultrafinas de salmón y atún crudos de grado sashimi, servidas sobre hielo con daikon rallado, shiso y wasabi fresco. Frescura japonesa en su máxima expresión.',
    en: 'Ultra-thin slices of raw sashimi-grade salmon and tuna, served over ice with shredded daikon, shiso and fresh wasabi. Japanese freshness at its peak.'
  },
  27: {
    es: 'Fideos finos de trigo sarraceno en un caldo caliente de dashi con soya y mirin, coronados con tempura de camarón crujiente. El bol reconfortante de Tokio.',
    en: 'Thin buckwheat noodles in a hot dashi broth with soy and mirin, topped with crispy shrimp tempura. Tokyo\'s comforting bowl.'
  },
  28: {
    es: 'Chuleta de cerdo gruesa empanizada con panko y frita hasta dorar, servida con col rallada, arroz y salsa tonkatsu espesa. Crujiente por fuera, jugoso por dentro.',
    en: 'Thick pork cutlet breaded with panko and deep-fried until golden, served with shredded cabbage, rice and thick tonkatsu sauce. Crispy outside, juicy inside.'
  },
  29: {
    es: 'Curry japonés espeso y dulce con trozos de carne, papas y zanahoria, servido sobre arroz blanco. Más suave que el curry indio — comfort food de todo Japón.',
    en: 'Thick, sweet Japanese curry with chunks of meat, potatoes and carrot, served over white rice. Milder than Indian curry — comfort food across Japan.'
  },
  30: {
    es: 'Anguila de agua dulce fileteada, glaseada con tare de soya dulce y asada a la parrilla sobre carbón. Servida sobre arroz caliente con sansho. Delicadeza japonesa de verano.',
    en: 'Freshwater eel filleted, glazed with sweet soy tare and charcoal-grilled. Served over hot rice with sansho pepper. A Japanese summer delicacy.'
  },
  31: {
    es: 'Caldo claro de dashi con tofu sedoso, wakame y pasta de miso disuelta. La sopa que acompaña cada comida japonesa — umami en su forma más simple.',
    en: 'Clear dashi broth with silky tofu, wakame and dissolved miso paste. The soup that accompanies every Japanese meal — umami in its simplest form.'
  },
  32: {
    es: 'Trozos de muslo de pollo marinados en soya, sake y jengibre, rebozados en fécula de papa y doble-fritos al estilo japonés. Extra crujientes con mayonesa Kewpie.',
    en: 'Chicken thigh pieces marinated in soy, sake and ginger, coated in potato starch and double-fried Japanese style. Extra crispy with Kewpie mayo.'
  },
  33: {
    es: 'Bolitas de mochi elástico hechas con harina de arroz glutinoso y polvo de matcha, rellenas de pasta dulce de frijol rojo (anko). Postre japonés verde y elegante.',
    en: 'Chewy mochi balls made with glutinous rice flour and matcha powder, filled with sweet red bean paste (anko). An elegant green Japanese dessert.'
  },
  34: {
    es: 'Dos esponjosos pancakes japoneses rellenos de anko (pasta de frijol rojo dulce). El snack favorito del gato cósmico Doraemon — dulce, suave y reconfortante.',
    en: 'Two fluffy Japanese pancakes filled with anko (sweet red bean paste). The favorite snack of cosmic cat Doraemon — sweet, soft and comforting.'
  },
  // ═══ MEXICO ═══
  35: {
    es: 'Tortillas de maíz rellenas de carne al pastor marinada en achiote y chiles, asada en trompo vertical. Servidos con piña, cilantro, cebolla y salsa verde.',
    en: 'Corn tortillas filled with al pastor meat marinated in achiote and chiles, roasted on a vertical spit. Served with pineapple, cilantro, onion and green salsa.'
  },
  36: {
    es: 'Tortillas de maíz bañadas en salsa de chile guajillo y ancho, rellenas de pollo deshebrado, cubiertas con crema, queso fresco y cebolla. Tradición mexicana en cada capa.',
    en: 'Corn tortillas bathed in guajillo and ancho chile sauce, filled with shredded chicken, topped with cream, fresh cheese and onion. Mexican tradition in every layer.'
  },
  37: {
    es: 'Masa de maíz nixtamalizado rellena de diversos guisados, envuelta en hoja de plátano o maíz y cocida al vapor. El regalo envuelto de la cocina mexicana.',
    en: 'Nixtamalized corn dough filled with various stews, wrapped in banana or corn husk and steamed. The wrapped gift of Mexican cuisine.'
  },
  38: {
    es: 'Chile poblano relleno de picadillo de carne con frutas, capeado en huevo batido y frito. Bañado en salsa de nogada (nuez de castilla) y granada. Los colores de México.',
    en: 'Poblano chile stuffed with meat picadillo and fruits, coated in whipped egg batter and fried. Bathed in nogada (walnut cream) sauce and pomegranate. The colors of Mexico.'
  },
  39: {
    es: 'Salsa espesa y compleja hecha con más de 20 ingredientes: chiles secos, chocolate, especias y semillas. Bañando piezas de pollo o guajolote — el plato barroco de Puebla.',
    en: 'Thick, complex sauce made with over 20 ingredients: dried chiles, chocolate, spices and seeds. Bathing chicken or turkey pieces — the baroque dish of Puebla.'
  },
  40: {
    es: 'Trozos de cerdo cocidos lentamente en su propia grasa con naranja y especias hasta quedar dorados y crujientes. El rey de la taquería mexicana.',
    en: 'Pork pieces slow-cooked in their own fat with orange and spices until golden and crispy. The king of the Mexican taquería.'
  },
  41: {
    es: 'Tortilla de maíz crujiente cubierta con frijoles refritos, lechuga, pollo o res deshebrada, crema, queso y salsa. El antojito mexicano más versátil.',
    en: 'Crispy corn tortilla topped with refried beans, lettuce, shredded chicken or beef, cream, cheese and salsa. The most versatile Mexican antojito.'
  },
  42: {
    es: 'Caldo rojo intenso con chiles guajillo y ancho, res cocida hasta deshebrarse, garbanzos, col, rábano y orégano. La sopa que cura todo en México.',
    en: 'Deep red broth with guajillo and ancho chiles, beef cooked until shreddable, chickpeas, cabbage, radish and oregano. The soup that cures everything in Mexico.'
  },
  43: {
    es: 'Masa de maíz gruesa pellizcada con bordes levantados, cubierta con frijoles, crema, lechuga, queso y salsa. Antojito callejero del centro de México.',
    en: 'Thick pinched corn masa with raised edges, topped with beans, cream, lettuce, cheese and salsa. Street food snack from central Mexico.'
  },
  44: {
    es: 'Aguacate machacado con trozos, mezclado con tomate, cebolla, chile serrano, cilantro y limón. Preparado en molcajete — la salsa mexicana más famosa del mundo.',
    en: 'Mashed avocado with chunks, mixed with tomato, onion, serrano chile, cilantro and lime. Made in a molcajete — the most famous Mexican salsa in the world.'
  },
  45: {
    es: 'Arroz cocido lentamente en leche con canela, vainilla y azúcar hasta quedar cremoso y perfumado. Postre casero mexicano que sabe a hogar y abuela.',
    en: 'Rice slowly simmered in milk with cinnamon, vanilla and sugar until creamy and fragrant. Homestyle Mexican dessert that tastes like home.'
  },
  46: {
    es: 'Flan cremoso de huevo bañado en cajeta (dulce de leche de cabra) con caramelo dorado. La textura sedosa y el sabor acaramelado lo hacen irresistible.',
    en: 'Creamy egg flan bathed in cajeta (goat milk caramel) with golden caramel. The silky texture and caramel flavor make it irresistible.'
  },
  47: {
    es: 'Pan dulce esponjoso con forma de domo y decoración en forma de huesos, aromatizado con azahar y anís. Se prepara para honrar a los difuntos el 1 y 2 de noviembre.',
    en: 'Fluffy sweet bread shaped as a dome with bone-shaped decorations, flavored with orange blossom and anise. Made to honor the deceased on November 1st and 2nd.'
  },
  48: {
    es: 'Tortillas crujientes cubiertas con frijoles negros, tinga de pollo en chipotle, crema, queso Oaxaca y aguacate. Capas de sabor mexicano apiladas.',
    en: 'Crispy tortillas layered with black beans, chipotle chicken tinga, cream, Oaxaca cheese and avocado. Layers of Mexican flavor stacked up.'
  },
  49: {
    es: 'Camarones crudos "cocidos" en jugo de limón con chile serrano, pepino, cebolla morada y cilantro. Picante, ácido y refrescante — ceviche sinaloense con actitud.',
    en: 'Raw shrimp "cooked" in lime juice with serrano chile, cucumber, red onion and cilantro. Spicy, tangy and refreshing — Sinaloan ceviche with attitude.'
  },
  // ═══ USA ═══
  50: {
    es: 'La hamburguesa americana clásica: carne de res jugosa a la parrilla, queso cheddar derretido, lechuga, tomate, cebolla y pickles en un pan brioche tostado.',
    en: 'The classic American burger: juicy grilled beef patty, melted cheddar cheese, lettuce, tomato, onion and pickles on a toasted brioche bun.'
  },
  51: {
    es: 'Costillas de cerdo ahumadas lentamente durante horas con madera de nogal, bañadas en salsa BBQ dulce y ahumada. La carne se despega del hueso con un tirón.',
    en: 'Pork ribs slow-smoked for hours over hickory wood, basted in sweet and smoky BBQ sauce. The meat pulls clean off the bone.'
  },
  52: {
    es: 'Tiras de pechuga de res (brisket) ahumada durante 12-14 horas a baja temperatura hasta que la grasa se derrite y la carne se corta como mantequilla. BBQ texano puro.',
    en: 'Beef brisket smoked for 12-14 hours at low temperature until the fat renders and the meat cuts like butter. Pure Texas BBQ.'
  },
  53: {
    es: 'Costillas de cerdo cocidas a fuego bajo y lento, glaseadas con salsa barbacoa espesa, dulce y con un toque de humo. Se caen del hueso — así de tiernas.',
    en: 'Pork ribs cooked low and slow, glazed with thick, sweet and smoky barbecue sauce. Fall-off-the-bone tender.'
  },
  54: {
    es: 'Langosta de Maine entera, hervida en agua de mar y servida con mantequilla clarificada derretida, mazorca de maíz y papas rojas. Lujo sencillo de Nueva Inglaterra.',
    en: 'Whole Maine lobster boiled in seawater and served with drawn melted butter, corn on the cob and red potatoes. Simple New England luxury.'
  },
  55: {
    es: 'Hot dog estilo Chicago: salchicha de res en pan de semillas de amapola con mostaza, relish verde, cebolla, tomate, pepinillo, sal de apio y chile deportivo. ¡Nunca con ketchup!',
    en: 'Chicago-style hot dog: beef frankfurter in a poppy seed bun with mustard, green relish, onion, tomato, pickle, celery salt and sport pepper. Never with ketchup!'
  },
  56: {
    es: 'Pollo marinado en buttermilk y empanizado con harina especiada, frito dos veces hasta quedar extra crujiente por fuera y jugosísimo por dentro. El soul food del sur americano.',
    en: 'Chicken marinated in buttermilk and coated in seasoned flour, double-fried until extra crispy outside and incredibly juicy inside. Southern American soul food.'
  },
  57: {
    es: 'Sándwich de cerdo deshebrado ahumado lentamente, bañado en salsa vinagreta de Carolina y coronado con coleslaw cremoso. Servido en pan brioche suave.',
    en: 'Pulled pork sandwich slowly smoked, dressed in Carolina vinegar sauce and topped with creamy coleslaw. Served on a soft brioche bun.'
  },
  58: {
    es: 'Pasta de codo horneada en una salsa cremosa de tres quesos (cheddar, gruyère y parmesano) con costra dorada de pan rallado. El comfort food americano definitivo.',
    en: 'Elbow pasta baked in a creamy three-cheese sauce (cheddar, gruyère and parmesan) with a golden breadcrumb crust. The definitive American comfort food.'
  },
  59: {
    es: 'Cheesecake denso y cremoso de queso crema sobre base de galleta graham, horneado en baño maría. La textura aterciopelada que hizo famosa a Nueva York.',
    en: 'Dense, creamy cream cheese cheesecake on a graham cracker crust, baked in a water bath. The velvety texture that made New York famous.'
  },
  60: {
    es: 'Steak grueso de res sazonado solo con sal y pimienta, asado a la parrilla a fuego alto hasta crear una costra caramelizada. El ritual americano de la carne perfecta.',
    en: 'Thick beef steak seasoned with just salt and pepper, grilled over high heat until a caramelized crust forms. The American ritual of perfect meat.'
  },
  61: {
    es: 'Filete de salmón salvaje de Alaska asado al horno con limón y eneldo, con piel crujiente y centro rosado. Saludable, elegante y lleno de omega-3.',
    en: 'Wild Alaskan salmon fillet oven-roasted with lemon and dill, with crispy skin and pink center. Healthy, elegant and full of omega-3.'
  },
  62: {
    es: 'Sopa espesa de almejas con papas, tocino, cebolla y crema en un bol de pan sourdough. El clásico que calienta los inviernos de Nueva Inglaterra desde 1800.',
    en: 'Thick clam chowder with potatoes, bacon, onion and cream in a sourdough bread bowl. The classic that has warmed New England winters since 1800.'
  },
  63: {
    es: 'Tacos de pescado blanco rebozado con cerveza, coronados con pico de gallo, crema de chipotle y col morada. Frescura de Baja California en cada mordida.',
    en: 'Beer-battered white fish tacos topped with pico de gallo, chipotle cream and purple cabbage. Baja California freshness in every bite.'
  },
  64: {
    es: 'Pancakes esponjosos y gruesos apilados en torre, bañados en maple syrup real y coronados con mantequilla y blueberries frescos. El desayuno americano por excelencia.',
    en: 'Thick fluffy pancakes stacked high, drizzled with real maple syrup and topped with butter and fresh blueberries. The quintessential American breakfast.'
  },
  65: {
    es: 'Sándwich de carne en conserva (corned beef) y chucrut con queso suizo derretido y aderezo ruso, prensado en pan de centeno tostado. El deli de Nueva York.',
    en: 'Corned beef and sauerkraut sandwich with melted Swiss cheese and Russian dressing, pressed on toasted rye bread. The New York deli classic.'
  },
  66: {
    es: 'Jambalaya cajún con arroz, salchicha andouille, camarones, pollo y la santísima trinidad (apio, pimiento, cebolla). Un solo sartén con todo el sabor de Louisiana.',
    en: 'Cajun jambalaya with rice, andouille sausage, shrimp, chicken and the holy trinity (celery, bell pepper, onion). One pan with all the flavor of Louisiana.'
  },
  67: {
    es: 'Panecillo tostado en mantequilla relleno de carne de langosta de Maine fresca, mezclada con un toque de mayonesa, limón y cebollín. Lujo simple del noreste americano.',
    en: 'Butter-toasted roll stuffed with fresh Maine lobster meat, tossed with a touch of mayo, lemon and chives. Simple luxury from the American northeast.'
  },
  68: {
    es: 'Brownie denso y fudgy con chocolate oscuro, centro húmedo y costra crackelada. No es un pastel — es una experiencia de chocolate concentrado.',
    en: 'Dense, fudgy brownie with dark chocolate, moist center and crackled crust. Not a cake — it\'s a concentrated chocolate experience.'
  },
  69: {
    es: 'Rebanada generosa de apple pie con manzanas Granny Smith especiadas con canela y nuez moscada, entre dos capas de masa mantequillosa y dorada. América en un plato.',
    en: 'Generous slice of apple pie with Granny Smith apples spiced with cinnamon and nutmeg, between two layers of buttery golden crust. America on a plate.'
  },
  70: {
    es: 'Alitas de pollo fritas ultra crujientes bañadas en salsa de mantequilla y cayena picante. Servidas con apio y aderezo blue cheese. Nacidas en Buffalo, NY en 1964.',
    en: 'Ultra-crispy fried chicken wings tossed in spicy cayenne butter sauce. Served with celery and blue cheese dressing. Born in Buffalo, NY in 1964.'
  },
  71: {
    es: 'Pay de calabaza especiada con canela, nuez moscada y jengibre sobre base de masa crujiente. El postre obligatorio de Thanksgiving en cada mesa americana.',
    en: 'Spiced pumpkin pie with cinnamon, nutmeg and ginger on a crispy pie crust. The mandatory Thanksgiving dessert on every American table.'
  },
  72: {
    es: 'Sándwich de queso derretido entre dos rebanadas de pan tostado en mantequilla. Simple, indulgente y perfecto — especialmente acompañado de sopa de tomate.',
    en: 'Melted cheese between two butter-toasted bread slices. Simple, indulgent and perfect — especially paired with tomato soup.'
  },
  73: {
    es: 'Festín costero cocinado en un hoyo en la playa con algas: langosta, almejas, mejillones, maíz, papas y salchichas. La tradición veraniega de Nueva Inglaterra.',
    en: 'Coastal feast cooked in a beachside pit with seaweed: lobster, clams, mussels, corn, potatoes and sausages. New England\'s summer tradition.'
  },
};

// Continúa en parte 2...
// Por ahora, actualicemos las primeras recetas y veamos el resultado

async function updateDescriptions() {
  console.log('📝 ACTUALIZANDO DESCRIPCIONES (Parte 1: China, Japón, México, USA)\n');
  const pool = mysql.createPool({
    host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME, ssl: { rejectUnauthorized: false }
  });
  const conn = await pool.getConnection();
  
  // Primero verificar el formato actual del campo description
  const [sample] = await conn.query('SELECT id, description FROM recipes WHERE id = 1');
  let descField = sample[0].description;
  let isJson = false;
  try {
    if (typeof descField === 'string') {
      JSON.parse(descField);
      isJson = true;
    } else if (typeof descField === 'object') {
      isJson = true;
    }
  } catch(e) {}
  console.log(`Formato: ${isJson ? 'JSON {es, en}' : 'String plano'}\n`);

  let count = 0;
  for (const [id, desc] of Object.entries(descriptions)) {
    const value = JSON.stringify(desc);
    await conn.query('UPDATE recipes SET description = ? WHERE id = ?', [value, parseInt(id)]);
    console.log(`  ✅ ID ${id}: ${desc.es.substring(0, 70)}...`);
    count++;
  }

  console.log(`\n🎉 Parte 1 completada: ${count} descripciones actualizadas`);
  conn.release(); pool.end();
}
updateDescriptions();
