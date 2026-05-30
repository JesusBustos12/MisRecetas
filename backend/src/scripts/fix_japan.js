import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// ═══════════════════════════════════════════════════════════════
// BATCH 1: JAPÓN 🇯🇵 — Datos auténticos con variación natural
// Cada receta tiene diferente cantidad de pasos e ingredientes
// según su complejidad real.
// ═══════════════════════════════════════════════════════════════

const japanFixes = {
  'tonkotsu ramen': {
    ingredients: [
      { es: '400g de fideos ramen frescos', en: '400g fresh ramen noodles' },
      { es: '1.5L de caldo tonkotsu (huesos de cerdo hervidos 12h)', en: '1.5L tonkotsu broth (pork bones simmered 12h)' },
      { es: '300g de panceta de cerdo chashu, en lonchas', en: '300g chashu pork belly, sliced' },
      { es: '4 huevos ajitsuke (marinados en soya y mirin)', en: '4 ajitsuke eggs (marinated in soy and mirin)' },
      { es: '4 cucharadas de pasta de miso blanco', en: '4 tablespoons white miso paste' },
      { es: '2 cucharadas de aceite de sésamo tostado', en: '2 tablespoons toasted sesame oil' },
      { es: '100ml de salsa de soya', en: '100ml soy sauce' },
      { es: '50ml de mirin', en: '50ml mirin' },
      { es: 'Cebollines picados y hojas de nori', en: 'Chopped scallions and nori sheets' },
      { es: 'Brotes de bambú (menma)', en: 'Bamboo shoots (menma)' },
      { es: 'Semillas de sésamo tostadas', en: 'Toasted sesame seeds' },
      { es: 'Aceite de chile (rayu) al gusto', en: 'Chili oil (rayu) to taste' }
    ],
    steps: [
      { es: 'Hierve los huesos de cerdo en abundante agua durante 12 horas a fuego medio-bajo, removiendo cada hora y reponiendo agua, hasta obtener un caldo blanco, espeso y cremoso.', en: 'Boil pork bones in plenty of water for 12 hours over medium-low heat, stirring every hour and replenishing water, until you get a white, thick, creamy broth.' },
      { es: 'Prepara el chashu: enrolla la panceta, átala con hilo y séllala en un sartén caliente. Transfiérela a una olla con 200ml de soya, 100ml de mirin, 100ml de sake y 50g de azúcar. Cocina a fuego bajo 2.5 horas.', en: 'Prepare chashu: roll the belly, tie with string and sear in a hot pan. Transfer to a pot with 200ml soy, 100ml mirin, 100ml sake and 50g sugar. Cook on low heat 2.5 hours.' },
      { es: 'Cuece los huevos exactamente 6 minutos 30 segundos para una yema cremosa y anaranjada. Enfría en agua helada, pela y sumerge en la salsa del chashu por mínimo 4 horas.', en: 'Boil eggs for exactly 6 minutes 30 seconds for a creamy, orange yolk. Cool in ice water, peel and submerge in chashu sauce for at least 4 hours.' },
      { es: 'Cocina los fideos ramen en agua hirviendo sin sal durante 2 minutos. Escurre bien, agitando el colador.', en: 'Cook ramen noodles in unsalted boiling water for 2 minutes. Drain well, shaking the strainer.' },
      { es: 'En cada tazón, disuelve 1 cucharada de miso con un poco de caldo caliente. Llena con el caldo tonkotsu hirviendo.', en: 'In each bowl, dissolve 1 tablespoon miso with a little hot broth. Fill with boiling tonkotsu broth.' },
      { es: 'Coloca los fideos en el caldo. Corona con lonchas de chashu, medio huevo ajitsuke, cebollines, menma, nori y un toque de aceite de sésamo y rayu.', en: 'Place noodles in broth. Top with chashu slices, half an ajitsuke egg, scallions, menma, nori and a touch of sesame oil and rayu.' }
    ],
    nutrition: { calories: 720, protein: '40g', carbs: '62g', fat: '34g', fiber: '3g' }
  },

  'gyoza': {
    ingredients: [
      { es: '300g de carne de cerdo molida', en: '300g ground pork' },
      { es: '2 tazas de col (repollo) finamente picada y exprimida', en: '2 cups finely chopped and squeezed cabbage' },
      { es: '3 cebollines, picados', en: '3 scallions, chopped' },
      { es: '2 dientes de ajo rallados', en: '2 garlic cloves, grated' },
      { es: '1 cucharada de jengibre fresco rallado', en: '1 tablespoon fresh ginger, grated' },
      { es: '2 cucharadas de salsa de soya', en: '2 tablespoons soy sauce' },
      { es: '1 cucharada de aceite de sésamo', en: '1 tablespoon sesame oil' },
      { es: '30 discos de masa para gyoza', en: '30 gyoza wrappers' },
      { es: '2 cucharadas de aceite vegetal', en: '2 tablespoons vegetable oil' }
    ],
    steps: [
      { es: 'Sala la col picada, déjala reposar 10 minutos y exprime todo el líquido con las manos. Esto es clave para que el relleno no quede aguado.', en: 'Salt chopped cabbage, let rest 10 minutes and squeeze out all liquid by hand. This is key so filling isn\'t watery.' },
      { es: 'Mezcla la carne de cerdo con la col, cebollines, ajo, jengibre, soya y aceite de sésamo. Revuelve en una sola dirección para crear textura.', en: 'Mix ground pork with cabbage, scallions, garlic, ginger, soy sauce and sesame oil. Stir in one direction to create texture.' },
      { es: 'Coloca 1 cucharada de relleno en cada disco. Humedece los bordes con agua, dobla por la mitad y haz 5-6 pliegues decorativos sellando firmemente.', en: 'Place 1 tablespoon filling on each wrapper. Wet edges with water, fold in half and make 5-6 decorative pleats sealing firmly.' },
      { es: 'Calienta aceite en un sartén antiadherente a fuego medio-alto. Acomoda las gyozas con la base plana hacia abajo y fríe 2 minutos hasta dorar.', en: 'Heat oil in a non-stick skillet over medium-high heat. Arrange gyoza with flat base down and fry 2 minutes until golden.' },
      { es: 'Agrega ¼ taza de agua al sartén, tapa inmediatamente y cocina al vapor 4 minutos.', en: 'Add ¼ cup water to skillet, cover immediately and steam 4 minutes.' },
      { es: 'Destapa y deja que el agua se evapore por completo. La base quedará crujiente y dorada. Sirve con salsa ponzu o vinagre de arroz con soya y rayu.', en: 'Uncover and let water evaporate completely. Base will be crispy and golden. Serve with ponzu or rice vinegar with soy and rayu.' }
    ],
    nutrition: { calories: 420, protein: '22g', carbs: '38g', fat: '20g', fiber: '2g' }
  },

  'katsudon': {
    ingredients: [
      { es: '2 chuletas de cerdo (tonkatsu) de 150g', en: '2 pork loin cutlets (tonkatsu), 150g each' },
      { es: '2 tazas de arroz japonés cocido', en: '2 cups steamed Japanese rice' },
      { es: '3 huevos', en: '3 eggs' },
      { es: '1 cebolla mediana en rodajas finas', en: '1 medium onion, thinly sliced' },
      { es: '1 taza de panko', en: '1 cup panko breadcrumbs' },
      { es: '½ taza de harina', en: '½ cup flour' },
      { es: '200ml de dashi', en: '200ml dashi stock' },
      { es: '3 cucharadas de salsa de soya', en: '3 tablespoons soy sauce' },
      { es: '2 cucharadas de mirin', en: '2 tablespoons mirin' },
      { es: '1 cucharada de azúcar', en: '1 tablespoon sugar' },
      { es: 'Aceite vegetal para freír', en: 'Vegetable oil for deep frying' }
    ],
    steps: [
      { es: 'Aplana las chuletas con un mazo hasta 1cm de grosor. Haz pequeños cortes en los bordes para evitar que se curven. Sazona con sal y pimienta.', en: 'Pound cutlets with a mallet to 1cm thickness. Make small cuts on edges to prevent curling. Season with salt and pepper.' },
      { es: 'Empaniza en orden: harina, huevo batido (1 huevo) y panko presionando firmemente para adherir.', en: 'Bread in order: flour, beaten egg (1 egg) and panko pressing firmly to adhere.' },
      { es: 'Fríe en aceite a 170°C por 4-5 minutos por lado hasta un dorado uniforme. Escurre sobre rejilla y corta en tiras gruesas.', en: 'Fry in 170°C oil for 4-5 minutes per side until evenly golden. Drain on a rack and cut into thick strips.' },
      { es: 'En un sartén oyakodon (o sartén pequeño), calienta el dashi con soya, mirin y azúcar. Agrega la cebolla y cocina 3 minutos hasta suavizar.', en: 'In an oyakodon pan (or small skillet), heat dashi with soy, mirin and sugar. Add onion and cook 3 minutes until soft.' },
      { es: 'Coloca el tonkatsu cortado sobre la cebolla. Bate ligeramente 2 huevos (no mezcles en exceso) y viértelos en espiral.', en: 'Place sliced tonkatsu over onion. Lightly beat 2 eggs (don\'t overmix) and pour in a spiral.' },
      { es: 'Tapa y cocina a fuego bajo 30-40 segundos. El huevo debe quedar semicuajado (toro-toro). Desliza sobre el arroz caliente.', en: 'Cover and cook on low heat 30-40 seconds. Egg should be semi-set (toro-toro). Slide over hot rice.' }
    ],
    nutrition: { calories: 780, protein: '42g', carbs: '72g', fat: '32g', fiber: '2g' }
  },

  'yakitori': {
    ingredients: [
      { es: '600g de muslos de pollo deshuesados, en cubos de 3cm', en: '600g boneless chicken thighs, cut into 3cm cubes' },
      { es: '8 cebollines largos japoneses (negi), en trozos de 3cm', en: '8 Japanese long scallions (negi), cut into 3cm pieces' },
      { es: '100ml de salsa de soya', en: '100ml soy sauce' },
      { es: '100ml de mirin', en: '100ml mirin' },
      { es: '50ml de sake', en: '50ml sake' },
      { es: '2 cucharadas de azúcar', en: '2 tablespoons sugar' },
      { es: 'Shichimi togarashi al gusto', en: 'Shichimi togarashi to taste' },
      { es: '12 palitos de bambú, remojados 30 minutos', en: '12 bamboo skewers, soaked 30 minutes' }
    ],
    steps: [
      { es: 'Prepara la salsa tare: hierve soya, mirin, sake y azúcar a fuego medio hasta reducir a la mitad y que adquiera consistencia de jarabe ligero (unos 12 minutos).', en: 'Prepare tare sauce: simmer soy, mirin, sake and sugar over medium heat until reduced by half and reaching a light syrup consistency (about 12 minutes).' },
      { es: 'Ensarta los cubos de pollo alternando con trozos de negi. Deja un espacio de 1cm al final para agarrar.', en: 'Thread chicken cubes alternating with negi pieces. Leave 1cm space at the end for gripping.' },
      { es: 'Asa las brochetas en una parrilla (o sartén de hierro) bien caliente. Cocina 3 minutos por cada lado sin mover para conseguir buen sello.', en: 'Grill skewers on a very hot grill (or cast iron skillet). Cook 3 minutes per side without moving to get a good sear.' },
      { es: 'En los últimos 2 minutos, barniza generosamente con la salsa tare, girando y aplicando 3-4 capas. Sirve con shichimi togarashi.', en: 'In the last 2 minutes, generously glaze with tare sauce, turning and applying 3-4 coats. Serve with shichimi togarashi.' }
    ],
    nutrition: { calories: 380, protein: '35g', carbs: '18g', fat: '16g', fiber: '1g' }
  },

  'omurice': {
    ingredients: [
      { es: '4 huevos grandes', en: '4 large eggs' },
      { es: '2 tazas de arroz japonés cocido (preferiblemente del día anterior)', en: '2 cups cooked Japanese rice (preferably day-old)' },
      { es: '150g de pechuga de pollo en cubos pequeños', en: '150g chicken breast in small cubes' },
      { es: '½ cebolla picada finamente', en: '½ onion, finely chopped' },
      { es: '4 cucharadas de ketchup', en: '4 tablespoons ketchup' },
      { es: '2 cucharadas de mantequilla', en: '2 tablespoons butter' },
      { es: '1 cucharada de salsa de soya', en: '1 tablespoon soy sauce' },
      { es: '2 cucharadas de leche', en: '2 tablespoons milk' },
      { es: 'Ketchup extra y perejil para decorar', en: 'Extra ketchup and parsley for garnish' }
    ],
    steps: [
      { es: 'Saltea el pollo en 1 cucharada de mantequilla hasta dorar. Agrega la cebolla y sofríe 2 minutos hasta transparentar.', en: 'Sauté chicken in 1 tablespoon butter until golden. Add onion and cook 2 minutes until translucent.' },
      { es: 'Incorpora el arroz, ketchup y soya. Saltea a fuego alto 3 minutos mezclando bien. El arroz debe quedar suelto y de color naranja uniforme. Forma un óvalo compacto en el plato.', en: 'Add rice, ketchup and soy. Stir-fry over high heat 3 minutes mixing well. Rice should be loose and uniformly orange. Shape into a compact oval on the plate.' },
      { es: 'Bate los huevos con la leche y una pizca de sal. No batas en exceso; deben quedar algunas vetas visibles.', en: 'Beat eggs with milk and a pinch of salt. Don\'t overbeat; some visible streaks should remain.' },
      { es: 'En un sartén antiadherente a fuego medio-alto, derrite la mantequilla restante. Vierte los huevos y revuelve suavemente con palillos japoneses. Cuando la superficie esté cremosa pero el fondo firme (unos 30 segundos), detente.', en: 'In a non-stick skillet over medium-high heat, melt remaining butter. Pour eggs and gently stir with Japanese chopsticks. When surface is creamy but bottom is firm (about 30 seconds), stop.' },
      { es: 'Desliza la tortilla cremosa sobre el montículo de arroz, envolviéndolo. Con papel de cocina, moldea la forma ovalada. Dibuja una línea de ketchup encima con un gesto elegante.', en: 'Slide the creamy omelette over the rice mound, wrapping it. With kitchen paper, shape the oval form. Draw a line of ketchup on top with an elegant gesture.' }
    ],
    nutrition: { calories: 520, protein: '28g', carbs: '55g', fat: '20g', fiber: '1g' }
  },

  'katsu curry': {
    ingredients: [
      { es: '2 chuletas de cerdo de 180g', en: '2 pork loin cutlets, 180g each' },
      { es: '1 taza de panko', en: '1 cup panko breadcrumbs' },
      { es: '½ taza de harina', en: '½ cup flour' },
      { es: '2 huevos batidos', en: '2 beaten eggs' },
      { es: '1 bloque de roux de curry japonés (S&B Golden)', en: '1 block Japanese curry roux (S&B Golden)' },
      { es: '2 papas medianas peladas y en cubos de 2cm', en: '2 medium potatoes, peeled and cut into 2cm cubes' },
      { es: '2 zanahorias en medias lunas gruesas', en: '2 carrots in thick half-moons' },
      { es: '1 cebolla grande en gajos', en: '1 large onion in wedges' },
      { es: '1 manzana rallada (ingrediente secreto)', en: '1 grated apple (secret ingredient)' },
      { es: '600ml de agua', en: '600ml water' },
      { es: '3 tazas de arroz japonés cocido', en: '3 cups cooked Japanese rice' },
      { es: 'Aceite vegetal para freír', en: 'Vegetable oil for deep frying' },
      { es: 'Encurtido de fukujinzuke para acompañar', en: 'Fukujinzuke pickles for serving' }
    ],
    steps: [
      { es: 'Saltea la cebolla en aceite 5 minutos hasta dorar. Agrega zanahoria y papa, revuelve 2 minutos.', en: 'Sauté onion in oil 5 minutes until golden. Add carrot and potato, stir 2 minutes.' },
      { es: 'Vierte 600ml de agua y la manzana rallada. Hierve y luego reduce a fuego medio. Cocina 15 minutos hasta que las verduras estén tiernas.', en: 'Pour in 600ml water and grated apple. Boil then reduce to medium heat. Cook 15 minutes until vegetables are tender.' },
      { es: 'Retira del fuego. Parte el roux en trozos y disuélvelo en el caldo revolviendo. Regresa al fuego bajo y cocina 10 minutos hasta espesar, revolviendo frecuentemente para que no se pegue.', en: 'Remove from heat. Break roux into pieces and dissolve in broth stirring. Return to low heat and cook 10 minutes until thickened, stirring frequently to prevent sticking.' },
      { es: 'Mientras tanto, aplana las chuletas y sazona. Empaniza: harina → huevo → panko, presionando bien.', en: 'Meanwhile, pound cutlets and season. Bread: flour → egg → panko, pressing well.' },
      { es: 'Fríe en aceite a 170°C durante 5-6 minutos girando una vez, hasta dorar uniformemente. Deja reposar 2 minutos sobre rejilla.', en: 'Fry in 170°C oil for 5-6 minutes turning once, until evenly golden. Rest 2 minutes on a rack.' },
      { es: 'Corta el katsu en tiras de 2cm. Sirve el arroz en un lado del plato, el katsu al lado y vierte la salsa curry caliente. Acompaña con fukujinzuke.', en: 'Cut katsu into 2cm strips. Serve rice on one side of plate, katsu alongside and pour hot curry sauce. Serve with fukujinzuke.' }
    ],
    nutrition: { calories: 850, protein: '38g', carbs: '90g', fat: '36g', fiber: '6g' }
  },

  'shabu-shabu': {
    ingredients: [
      { es: '400g de carne de res en láminas ultra finas', en: '400g paper-thin sliced beef' },
      { es: '200g de tofu firme en cubos', en: '200g firm tofu, cubed' },
      { es: '1 manojo de espinacas lavadas', en: '1 bunch spinach, washed' },
      { es: '200g de champiñones enoki', en: '200g enoki mushrooms' },
      { es: '¼ de col napa en trozos', en: '¼ napa cabbage in pieces' },
      { es: '200g de fideos udon', en: '200g udon noodles' },
      { es: '1 trozo de kombu de 10cm', en: '1 piece kombu, 10cm' },
      { es: '1.5L de agua', en: '1.5L water' },
      { es: 'Salsa ponzu para mojar', en: 'Ponzu sauce for dipping' },
      { es: 'Salsa de sésamo gomadare para mojar', en: 'Gomadare sesame sauce for dipping' },
      { es: 'Cebollines picados y rábano daikon rallado', en: 'Chopped scallions and grated daikon radish' }
    ],
    steps: [
      { es: 'Remoja el kombu en 1.5L de agua fría durante 30 minutos. Calienta a fuego medio y retira el kombu justo antes de que hierva.', en: 'Soak kombu in 1.5L cold water for 30 minutes. Heat over medium and remove kombu just before it boils.' },
      { es: 'Dispón la carne, tofu, verduras y fideos en platos separados de forma elegante. Prepara las salsas ponzu y gomadare en tazones individuales.', en: 'Arrange meat, tofu, vegetables and noodles on separate plates elegantly. Prepare ponzu and gomadare sauces in individual bowls.' },
      { es: 'Coloca la olla de caldo en el centro de la mesa sobre un quemador portátil. Cada comensal toma una lámina de carne con palillos, la sumerge en el caldo agitando suavemente ("shabu shabu") durante 5-10 segundos y la moja en la salsa de su preferencia.', en: 'Place broth pot at center of table on a portable burner. Each diner picks a meat slice with chopsticks, dips in broth swishing gently ("shabu shabu") for 5-10 seconds and dips in their preferred sauce.' },
      { es: 'Las verduras y el tofu se cocinan directamente en el caldo (2-3 minutos). Los fideos se agregan al final.', en: 'Vegetables and tofu cook directly in the broth (2-3 minutes). Noodles are added at the end.' },
      { es: 'Retira la espuma que se forme en la superficie del caldo con un cucharón. Al final de la comida, el caldo enriquecido se bebe como sopa.', en: 'Skim any foam that forms on the broth surface. At the end of the meal, the enriched broth is drunk as soup.' }
    ],
    nutrition: { calories: 480, protein: '40g', carbs: '32g', fat: '20g', fiber: '4g' }
  },

  'sukiyaki': {
    ingredients: [
      { es: '400g de carne de res en láminas finas (rib eye)', en: '400g thinly sliced beef (rib eye)' },
      { es: '1 bloque de tofu firme en cubos gruesos', en: '1 block firm tofu in thick cubes' },
      { es: '200g de fideos shirataki, enjuagados y escurridos', en: '200g shirataki noodles, rinsed and drained' },
      { es: '1 col napa pequeña en trozos', en: '1 small napa cabbage in pieces' },
      { es: '200g de champiñones shiitake sin tallo', en: '200g shiitake mushrooms, stems removed' },
      { es: '2 puerros japoneses (negi) en rodajas diagonales', en: '2 Japanese leeks (negi), diagonally sliced' },
      { es: '100ml de salsa de soya', en: '100ml soy sauce' },
      { es: '100ml de mirin', en: '100ml mirin' },
      { es: '50ml de sake', en: '50ml sake' },
      { es: '3 cucharadas de azúcar', en: '3 tablespoons sugar' },
      { es: '4 huevos crudos muy frescos', en: '4 very fresh raw eggs' },
      { es: '1 trozo de grasa de res (sebo) para engrasar', en: '1 piece beef fat (suet) for greasing' }
    ],
    steps: [
      { es: 'Prepara la salsa warishita mezclando soya, mirin, sake y azúcar. Revuelve hasta disolver el azúcar.', en: 'Prepare warishita sauce by mixing soy, mirin, sake and sugar. Stir until sugar dissolves.' },
      { es: 'Corta y dispón todos los ingredientes en una bandeja grande de forma decorativa, agrupando por tipo.', en: 'Cut and arrange all ingredients on a large platter decoratively, grouping by type.' },
      { es: 'Calienta un sartén de hierro o nabe sukiyaki. Frota el trozo de grasa de res por toda la superficie para engrasarla.', en: 'Heat a cast iron skillet or sukiyaki nabe. Rub the beef fat piece across the entire surface to grease it.' },
      { es: 'Dora unas láminas de carne en el sartén caliente. Cuando cambien de color, empújalas a un lado y vierte la salsa warishita.', en: 'Brown some meat slices in the hot pan. When they change color, push to one side and pour in warishita sauce.' },
      { es: 'Agrega las verduras, tofu y fideos en secciones separadas. Cocina 5-7 minutos tapado, dejando que todo absorba el sabor de la salsa.', en: 'Add vegetables, tofu and noodles in separate sections. Cook 5-7 minutes covered, letting everything absorb the sauce flavor.' },
      { es: 'Cada comensal bate un huevo crudo en su tazón. Los ingredientes cocidos se sacan del nabe y se sumergen en el huevo antes de comer. Ve añadiendo más ingredientes según se consuman.', en: 'Each diner beats a raw egg in their bowl. Cooked ingredients are taken from the nabe and dipped in egg before eating. Add more ingredients as they are consumed.' }
    ],
    nutrition: { calories: 580, protein: '42g', carbs: '35g', fat: '28g', fiber: '3g' }
  },

  'yakisoba': {
    ingredients: [
      { es: '400g de fideos yakisoba', en: '400g yakisoba noodles' },
      { es: '200g de panceta de cerdo en tiras finas', en: '200g pork belly, thinly sliced' },
      { es: '2 tazas de col en tiras', en: '2 cups shredded cabbage' },
      { es: '2 zanahorias en juliana', en: '2 carrots, julienned' },
      { es: '4 cebollines en trozos de 3cm', en: '4 scallions, cut into 3cm pieces' },
      { es: '4 cucharadas de salsa yakisoba', en: '4 tablespoons yakisoba sauce' },
      { es: '2 cucharadas de aceite vegetal', en: '2 tablespoons vegetable oil' },
      { es: 'Aonori, beni shoga y katsuobushi para decorar', en: 'Aonori, beni shoga and bonito flakes for garnish' }
    ],
    steps: [
      { es: 'Separa los fideos con las manos si son frescos. Si son secos, cocina según el paquete, escurre y reserva.', en: 'Separate noodles by hand if fresh. If dried, cook per package, drain and set aside.' },
      { es: 'Calienta aceite en un wok a fuego alto hasta que humee. Saltea la panceta 2-3 minutos hasta que suelte su grasa y dore.', en: 'Heat oil in a wok over high heat until smoking. Stir-fry pork belly 2-3 minutes until it renders fat and browns.' },
      { es: 'Agrega la col y zanahoria. Saltea 2 minutos sin dejar de mover, manteniendo las verduras crujientes.', en: 'Add cabbage and carrot. Stir-fry 2 minutes continuously, keeping vegetables crispy.' },
      { es: 'Incorpora los fideos y vierte la salsa. Mezcla con pinzas usando movimientos amplios 2-3 minutos hasta que todo esté bien integrado y los fideos brillen.', en: 'Add noodles and pour sauce. Toss with tongs using wide movements 2-3 minutes until everything is well combined and noodles are glossy.' },
      { es: 'Sirve en platos y corona con cebollines, aonori, beni shoga rosa y una lluvia de katsuobushi (las hojuelas de bonito "bailarán" con el calor).', en: 'Serve on plates and top with scallions, aonori, pink beni shoga and a shower of bonito flakes (the flakes will "dance" with the heat).' }
    ],
    nutrition: { calories: 520, protein: '22g', carbs: '58g', fat: '22g', fiber: '4g' }
  },

  'karaage': {
    ingredients: [
      { es: '600g de muslos de pollo deshuesados, en trozos de 4cm', en: '600g boneless chicken thighs, cut into 4cm pieces' },
      { es: '3 cucharadas de salsa de soya', en: '3 tablespoons soy sauce' },
      { es: '1 cucharada de sake', en: '1 tablespoon sake' },
      { es: '1 cucharada de jengibre rallado', en: '1 tablespoon grated ginger' },
      { es: '2 dientes de ajo rallados', en: '2 garlic cloves, grated' },
      { es: '½ taza de fécula de papa (katakuriko)', en: '½ cup potato starch (katakuriko)' },
      { es: 'Aceite vegetal abundante para freír', en: 'Plenty of vegetable oil for frying' },
      { es: 'Gajos de limón y mayonesa Kewpie', en: 'Lemon wedges and Kewpie mayonnaise' }
    ],
    steps: [
      { es: 'Marina el pollo con soya, sake, jengibre y ajo. Masajea bien para que penetre. Refrigera mínimo 30 minutos, idealmente 2 horas.', en: 'Marinate chicken with soy, sake, ginger and garlic. Massage well to penetrate. Refrigerate at least 30 minutes, ideally 2 hours.' },
      { es: 'Escurre el exceso de marinada. Cubre cada trozo generosamente con fécula de papa, sacudiendo suavemente el exceso.', en: 'Drain excess marinade. Coat each piece generously with potato starch, gently shaking off excess.' },
      { es: 'Primera fritura: calienta aceite a 170°C. Fríe en tandas pequeñas durante 3-4 minutos. Retira y deja reposar sobre rejilla 4 minutos.', en: 'First fry: heat oil to 170°C. Fry in small batches for 3-4 minutes. Remove and rest on a rack 4 minutes.' },
      { es: 'Segunda fritura (nidoage): sube el aceite a 190°C. Regresa el pollo y fríe 1-2 minutos extra. Esta técnica crea una costra extraordinariamente crujiente por fuera manteniendo la jugosidad interior.', en: 'Second fry (nidoage): raise oil to 190°C. Return chicken and fry 1-2 extra minutes. This technique creates an extraordinarily crispy crust outside while maintaining interior juiciness.' },
      { es: 'Sirve inmediatamente acompañado de gajos de limón y un generoso punto de mayonesa Kewpie.', en: 'Serve immediately accompanied by lemon wedges and a generous dollop of Kewpie mayonnaise.' }
    ],
    nutrition: { calories: 450, protein: '32g', carbs: '28g', fat: '22g', fiber: '0g' }
  },

  'udon': {
    ingredients: [
      { es: '400g de fideos udon gruesos', en: '400g thick udon noodles' },
      { es: '1L de caldo dashi', en: '1L dashi broth' },
      { es: '3 cucharadas de salsa de soya clara (usukuchi)', en: '3 tablespoons light soy sauce (usukuchi)' },
      { es: '2 cucharadas de mirin', en: '2 tablespoons mirin' },
      { es: '2 cebollines finamente picados', en: '2 scallions, finely chopped' },
      { es: '1 hoja de nori en tiras', en: '1 nori sheet, cut into strips' },
      { es: 'Shichimi togarashi al gusto', en: 'Shichimi togarashi to taste' }
    ],
    steps: [
      { es: 'Prepara el caldo: remoja kombu en agua fría 30 minutos, calienta y retira antes de hervir. Agrega katsuobushi, apaga el fuego y cuela tras 5 minutos.', en: 'Prepare broth: soak kombu in cold water 30 minutes, heat and remove before boiling. Add katsuobushi, turn off heat and strain after 5 minutes.' },
      { es: 'Sazona el dashi con soya clara y mirin. Mantén caliente sin hervir.', en: 'Season dashi with light soy sauce and mirin. Keep warm without boiling.' },
      { es: 'Cocina los fideos según instrucciones (frescos: 1-2 min, congelados: 3 min). Enjuaga bajo agua fría y escurre.', en: 'Cook noodles per instructions (fresh: 1-2 min, frozen: 3 min). Rinse under cold water and drain.' },
      { es: 'Recalienta los fideos sumergiéndolos brevemente en agua caliente. Distribúyelos en tazones grandes y vierte el caldo hirviendo.', en: 'Reheat noodles by briefly dipping in hot water. Distribute in large bowls and pour boiling broth.' },
      { es: 'Decora con cebollines y nori. Sirve con shichimi al lado.', en: 'Garnish with scallions and nori. Serve with shichimi on the side.' }
    ],
    nutrition: { calories: 360, protein: '12g', carbs: '65g', fat: '4g', fiber: '3g' }
  },

  'sopa de miso': {
    ingredients: [
      { es: '4 tazas de caldo dashi', en: '4 cups dashi broth' },
      { es: '3 cucharadas de pasta de miso', en: '3 tablespoons miso paste' },
      { es: '150g de tofu sedoso en cubos de 1.5cm', en: '150g silken tofu, cut into 1.5cm cubes' },
      { es: '2 cucharadas de wakame seco', en: '2 tablespoons dried wakame seaweed' },
      { es: '2 cebollines picados finamente', en: '2 scallions, finely chopped' }
    ],
    steps: [
      { es: 'Remoja el wakame en agua fría 5 minutos hasta que se expanda. Escurre y reserva.', en: 'Soak wakame in cold water 5 minutes until expanded. Drain and set aside.' },
      { es: 'Calienta el dashi a fuego medio sin dejar que hierva fuerte.', en: 'Heat dashi over medium heat without letting it boil vigorously.' },
      { es: 'Coloca la pasta de miso en un colador fino o cucharón. Sumérgelo parcialmente en el dashi caliente y disuelve el miso revolviendo con palillos. Esto previene grumos.', en: 'Place miso paste in a fine strainer or ladle. Partially submerge in hot dashi and dissolve miso by stirring with chopsticks. This prevents lumps.' },
      { es: 'Agrega el tofu y wakame. Calienta 1 minuto SIN hervir (hervir destruye las enzimas y el sabor delicado del miso). Sirve en tazones pequeños con cebollines encima.', en: 'Add tofu and wakame. Heat 1 minute WITHOUT boiling (boiling destroys enzymes and the delicate miso flavor). Serve in small bowls with scallions on top.' }
    ],
    nutrition: { calories: 85, protein: '6g', carbs: '8g', fat: '3g', fiber: '2g' }
  },

  'tamagoyaki': {
    ingredients: [
      { es: '4 huevos grandes', en: '4 large eggs' },
      { es: '2 cucharadas de dashi', en: '2 tablespoons dashi' },
      { es: '1 cucharada de azúcar', en: '1 tablespoon sugar' },
      { es: '1 cucharadita de soya clara', en: '1 teaspoon light soy sauce' },
      { es: '½ cucharadita de mirin', en: '½ teaspoon mirin' },
      { es: 'Aceite vegetal para engrasar', en: 'Vegetable oil for greasing' }
    ],
    steps: [
      { es: 'Bate los huevos suavemente con dashi, azúcar, soya y mirin. Cuela para eliminar hilos de clara.', en: 'Gently beat eggs with dashi, sugar, soy and mirin. Strain to remove egg white strands.' },
      { es: 'Calienta un sartén rectangular (tamagoyaki-ki) a fuego medio-bajo. Engrasa con un papel doblado humedecido en aceite.', en: 'Heat a rectangular pan (tamagoyaki-ki) over medium-low heat. Grease with folded paper moistened with oil.' },
      { es: 'Vierte una capa fina de huevo (¼ de la mezcla). Revienta las burbujas con palillos. Cuando cuaje parcialmente, enrolla desde el extremo lejano hacia ti.', en: 'Pour a thin layer of egg (¼ of mixture). Pop bubbles with chopsticks. When partially set, roll from far end toward you.' },
      { es: 'Empuja el rollo al fondo, engrasa el sartén y vierte otra capa. Levanta el rollo existente para que el huevo crudo fluya debajo. Cuando cuaje, enrolla sobre el rollo anterior. Repite 2 veces más.', en: 'Push roll to the back, grease pan and pour another layer. Lift existing roll so raw egg flows underneath. When set, roll over the previous roll. Repeat 2 more times.' },
      { es: 'Envuelve en una esterilla de bambú (makisu) y presiona suavemente para dar forma rectangular. Deja reposar 2 minutos.', en: 'Wrap in bamboo mat (makisu) and gently press to shape into a rectangle. Let rest 2 minutes.' },
      { es: 'Corta en rodajas de 2cm con un cuchillo húmedo. Sirve como acompañamiento o dentro de un bento.', en: 'Cut into 2cm slices with a wet knife. Serve as a side dish or inside a bento box.' }
    ],
    nutrition: { calories: 190, protein: '14g', carbs: '6g', fat: '12g', fiber: '0g' }
  },

  'chawanmushi': {
    ingredients: [
      { es: '3 huevos grandes', en: '3 large eggs' },
      { es: '2 tazas de caldo dashi frío', en: '2 cups cold dashi broth' },
      { es: '1 cucharadita de salsa de soya clara', en: '1 teaspoon light soy sauce' },
      { es: '½ cucharadita de mirin', en: '½ teaspoon mirin' },
      { es: '½ cucharadita de sal', en: '½ teaspoon salt' },
      { es: '4 camarones medianos pelados', en: '4 medium shrimp, peeled' },
      { es: '4 champiñones shiitake en láminas', en: '4 shiitake mushrooms, sliced' },
      { es: '50g de pechuga de pollo en cubos pequeños', en: '50g chicken breast, in small cubes' },
      { es: '4 hojas de mitsuba o perejil', en: '4 mitsuba or parsley leaves' },
      { es: '4 rodajas finas de kamaboko (opcional)', en: '4 thin slices kamaboko (optional)' }
    ],
    steps: [
      { es: 'Bate los huevos suavemente sin hacer espuma. Incorpora el dashi frío, soya, mirin y sal. Cuela la mezcla por un colador fino dos veces para una textura sedosa.', en: 'Gently beat eggs without creating foam. Mix in cold dashi, soy, mirin and salt. Strain mixture through a fine sieve twice for silky texture.' },
      { es: 'Reparte los camarones, pollo, champiñones y kamaboko en 4 tazas resistentes al calor.', en: 'Distribute shrimp, chicken, mushrooms and kamaboko into 4 heat-resistant cups.' },
      { es: 'Vierte la mezcla de huevo lentamente hasta llenar ¾ de cada taza. Elimina cualquier burbuja de la superficie con un palillo o cuchara.', en: 'Pour egg mixture slowly until filling ¾ of each cup. Remove any surface bubbles with a toothpick or spoon.' },
      { es: 'Cubre cada taza con papel aluminio. Coloca en una vaporera con agua hirviendo. Cocina 3 minutos a fuego alto, luego reduce a fuego bajo y continúa 12 minutos más.', en: 'Cover each cup with foil. Place in a steamer with boiling water. Cook 3 minutes on high heat, then reduce to low and continue 12 more minutes.' },
      { es: 'Verifica insertando un palillo: si sale limpio, está listo. La textura debe ser como un flan suave y tembloroso.', en: 'Check by inserting a toothpick: if it comes out clean, it\'s ready. Texture should be like a soft, wobbly flan.' },
      { es: 'Retira el aluminio, decora con mitsuba y sirve caliente en la misma taza.', en: 'Remove foil, garnish with mitsuba and serve warm in the same cup.' }
    ],
    nutrition: { calories: 145, protein: '16g', carbs: '3g', fat: '7g', fiber: '0g' }
  }
};

async function fixJapan() {
  console.log('🇯🇵 BATCH 1: Corrigiendo recetas de Japón...\n');
  
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
    const [recipes] = await conn.query(
      "SELECT id, title FROM recipes WHERE category_country = 'Japan' ORDER BY id"
    );
    
    console.log(`Total recetas japonesas en BD: ${recipes.length}\n`);
    
    let fixed = 0, skipped = 0;
    
    for (const r of recipes) {
      let title;
      try { title = typeof r.title === 'string' && r.title.startsWith('{') ? JSON.parse(r.title) : r.title; } catch(e) { title = r.title; }
      
      const titleEs = (typeof title === 'object' ? title.es : title) || '';
      const titleEn = (typeof title === 'object' ? title.en : title) || '';
      const titleSearch = `${titleEs} ${titleEn}`.toLowerCase();
      
      let matchedFix = null, matchedKey = null;
      for (const [key, fix] of Object.entries(japanFixes)) {
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
      } else {
        console.log(`⏭️  ID ${r.id}: ${titleEs || titleEn} → Sin corrección definida`);
        skipped++;
      }
    }
    
    console.log(`\n🎉 Japón completado: ${fixed} corregidas, ${skipped} sin cambios`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

fixJapan();
