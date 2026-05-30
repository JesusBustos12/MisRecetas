import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const fixes = {
  // ═══════ JAPÓN FALTANTES (no matchearon en batch 1) ═══════
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
      { es: 'Hierve los huesos de cerdo en abundante agua durante 12 horas a fuego medio-bajo, removiendo cada hora, hasta obtener un caldo blanco y cremoso.', en: 'Boil pork bones in plenty of water for 12 hours over medium-low heat, stirring every hour, until you get a white, creamy broth.' },
      { es: 'Prepara el chashu: enrolla la panceta, átala y séllala. Cocina en soya, mirin, sake y azúcar a fuego bajo 2.5 horas.', en: 'Prepare chashu: roll belly, tie and sear. Cook in soy, mirin, sake and sugar on low heat 2.5 hours.' },
      { es: 'Cuece los huevos 6 min 30 seg para yema cremosa. Enfría en agua helada, pela y sumerge en la salsa del chashu mínimo 4 horas.', en: 'Boil eggs 6 min 30 sec for creamy yolk. Cool in ice water, peel and submerge in chashu sauce at least 4 hours.' },
      { es: 'Cocina los fideos ramen en agua hirviendo sin sal 2 minutos. Escurre bien.', en: 'Cook ramen noodles in unsalted boiling water 2 minutes. Drain well.' },
      { es: 'En cada tazón, disuelve miso con caldo caliente. Llena con caldo tonkotsu hirviendo.', en: 'In each bowl, dissolve miso with hot broth. Fill with boiling tonkotsu broth.' },
      { es: 'Corona con chashu, medio huevo, cebollines, menma, nori y un toque de rayu.', en: 'Top with chashu, half egg, scallions, menma, nori and a touch of rayu.' }
    ],
    nutrition: { calories: 720, protein: '40g', carbs: '62g', fat: '34g', fiber: '3g' }
  },
  'gyoza': {
    ingredients: [
      { es: '300g de carne de cerdo molida', en: '300g ground pork' },
      { es: '2 tazas de col finamente picada y exprimida', en: '2 cups finely chopped and squeezed cabbage' },
      { es: '3 cebollines, picados', en: '3 scallions, chopped' },
      { es: '2 dientes de ajo rallados', en: '2 garlic cloves, grated' },
      { es: '1 cucharada de jengibre fresco rallado', en: '1 tablespoon fresh ginger, grated' },
      { es: '2 cucharadas de salsa de soya', en: '2 tablespoons soy sauce' },
      { es: '1 cucharada de aceite de sésamo', en: '1 tablespoon sesame oil' },
      { es: '30 discos de masa para gyoza', en: '30 gyoza wrappers' },
      { es: '2 cucharadas de aceite vegetal', en: '2 tablespoons vegetable oil' }
    ],
    steps: [
      { es: 'Sala la col, exprime todo el líquido. Mezcla con cerdo, cebollines, ajo, jengibre, soya y sésamo revolviendo en una dirección.', en: 'Salt cabbage, squeeze all liquid. Mix with pork, scallions, garlic, ginger, soy and sesame stirring in one direction.' },
      { es: 'Coloca 1 cucharada de relleno en cada disco. Humedece bordes, dobla y haz 5-6 pliegues decorativos sellando.', en: 'Place 1 tablespoon filling on each wrapper. Wet edges, fold and make 5-6 decorative pleats sealing.' },
      { es: 'Dora la base en sartén con aceite 2 minutos. Agrega ¼ taza de agua, tapa y cocina al vapor 4 minutos.', en: 'Brown base in skillet with oil 2 minutes. Add ¼ cup water, cover and steam 4 minutes.' },
      { es: 'Destapa y evapora el agua. La base quedará crujiente. Sirve con ponzu o vinagre de arroz con soya y rayu.', en: 'Uncover and evaporate water. Base will be crispy. Serve with ponzu or rice vinegar with soy and rayu.' }
    ],
    nutrition: { calories: 420, protein: '22g', carbs: '38g', fat: '20g', fiber: '2g' }
  },
  'katsudon': {
    ingredients: [
      { es: '2 chuletas de cerdo de 150g', en: '2 pork loin cutlets, 150g each' },
      { es: '2 tazas de arroz japonés cocido', en: '2 cups steamed Japanese rice' },
      { es: '3 huevos', en: '3 eggs' },
      { es: '1 cebolla en rodajas finas', en: '1 onion, thinly sliced' },
      { es: '1 taza de panko', en: '1 cup panko breadcrumbs' },
      { es: '200ml de dashi', en: '200ml dashi stock' },
      { es: '3 cucharadas de salsa de soya', en: '3 tablespoons soy sauce' },
      { es: '2 cucharadas de mirin', en: '2 tablespoons mirin' },
      { es: 'Aceite vegetal para freír', en: 'Vegetable oil for deep frying' }
    ],
    steps: [
      { es: 'Aplana las chuletas, empaniza en harina, huevo y panko. Fríe a 170°C 4-5 min por lado. Corta en tiras.', en: 'Pound cutlets, bread in flour, egg and panko. Fry at 170°C 4-5 min per side. Cut into strips.' },
      { es: 'Calienta dashi, soya y mirin. Agrega cebolla y cocina 3 minutos.', en: 'Heat dashi, soy and mirin. Add onion and cook 3 minutes.' },
      { es: 'Coloca el tonkatsu sobre la cebolla. Vierte 2 huevos ligeramente batidos en espiral. Tapa 30-40 segundos (huevo semicuajado).', en: 'Place tonkatsu over onion. Pour 2 lightly beaten eggs in spiral. Cover 30-40 seconds (semi-set egg).' },
      { es: 'Desliza sobre arroz caliente en un tazón donburi.', en: 'Slide over hot rice in a donburi bowl.' }
    ],
    nutrition: { calories: 780, protein: '42g', carbs: '72g', fat: '32g', fiber: '2g' }
  },
  'omurice': {
    ingredients: [
      { es: '4 huevos grandes', en: '4 large eggs' },
      { es: '2 tazas de arroz japonés cocido', en: '2 cups cooked Japanese rice' },
      { es: '150g de pechuga de pollo en cubos', en: '150g chicken breast in cubes' },
      { es: '4 cucharadas de ketchup', en: '4 tablespoons ketchup' },
      { es: '2 cucharadas de mantequilla', en: '2 tablespoons butter' },
      { es: '1 cucharada de salsa de soya', en: '1 tablespoon soy sauce' },
      { es: 'Ketchup extra para decorar', en: 'Extra ketchup for garnish' }
    ],
    steps: [
      { es: 'Saltea pollo en mantequilla. Agrega arroz, ketchup y soya. Forma un óvalo en el plato.', en: 'Sauté chicken in butter. Add rice, ketchup and soy. Shape into oval on plate.' },
      { es: 'Bate huevos con leche. En sartén con mantequilla, vierte y revuelve con palillos hasta que la superficie esté cremosa pero el fondo firme.', en: 'Beat eggs with milk. In skillet with butter, pour and stir with chopsticks until surface is creamy but bottom firm.' },
      { es: 'Desliza la tortilla sobre el arroz, envolviéndolo. Moldea con papel de cocina. Dibuja ketchup encima.', en: 'Slide omelette over rice, wrapping it. Shape with kitchen paper. Draw ketchup on top.' }
    ],
    nutrition: { calories: 520, protein: '28g', carbs: '55g', fat: '20g', fiber: '1g' }
  },
  'katsu curry': {
    ingredients: [
      { es: '2 chuletas de cerdo de 180g', en: '2 pork loin cutlets, 180g each' },
      { es: '1 taza de panko y ½ de harina', en: '1 cup panko and ½ flour' },
      { es: '2 huevos batidos', en: '2 beaten eggs' },
      { es: '1 bloque de roux de curry japonés', en: '1 block Japanese curry roux' },
      { es: '2 papas y 2 zanahorias en cubos', en: '2 potatoes and 2 carrots, cubed' },
      { es: '1 cebolla grande en gajos', en: '1 large onion in wedges' },
      { es: '1 manzana rallada', en: '1 grated apple' },
      { es: '600ml de agua', en: '600ml water' },
      { es: '3 tazas de arroz japonés cocido', en: '3 cups cooked Japanese rice' },
      { es: 'Aceite para freír y fukujinzuke', en: 'Oil for frying and fukujinzuke' }
    ],
    steps: [
      { es: 'Saltea cebolla 5 min, agrega zanahoria y papa 2 min más. Vierte agua y manzana rallada. Hierve 15 min.', en: 'Sauté onion 5 min, add carrot and potato 2 min more. Pour water and grated apple. Boil 15 min.' },
      { es: 'Retira del fuego, disuelve el roux. Regresa al fuego bajo 10 min revolviendo.', en: 'Remove from heat, dissolve roux. Return to low heat 10 min stirring.' },
      { es: 'Empaniza chuletas: harina → huevo → panko. Fríe a 170°C 5-6 min. Reposa sobre rejilla.', en: 'Bread cutlets: flour → egg → panko. Fry at 170°C 5-6 min. Rest on rack.' },
      { es: 'Corta el katsu en tiras. Sirve arroz a un lado, katsu al otro y vierte curry caliente. Acompaña con fukujinzuke.', en: 'Cut katsu into strips. Serve rice on one side, katsu on other and pour hot curry. Serve with fukujinzuke.' }
    ],
    nutrition: { calories: 850, protein: '38g', carbs: '90g', fat: '36g', fiber: '6g' }
  },
  'shabu': {
    ingredients: [
      { es: '400g de carne de res en láminas ultra finas', en: '400g paper-thin sliced beef' },
      { es: '200g de tofu firme en cubos', en: '200g firm tofu, cubed' },
      { es: '200g de fideos udon', en: '200g udon noodles' },
      { es: '¼ de col napa, 200g enoki, espinacas', en: '¼ napa cabbage, 200g enoki, spinach' },
      { es: '1 trozo de kombu + 1.5L de agua', en: '1 piece kombu + 1.5L water' },
      { es: 'Salsa ponzu y gomadare para mojar', en: 'Ponzu and gomadare sauce for dipping' }
    ],
    steps: [
      { es: 'Remoja kombu en agua fría 30 min. Calienta y retira justo antes de hervir.', en: 'Soak kombu in cold water 30 min. Heat and remove just before boiling.' },
      { es: 'Dispón carne, tofu, verduras y fideos en platos. Prepara las salsas en tazones individuales.', en: 'Arrange meat, tofu, vegetables and noodles on plates. Prepare sauces in individual bowls.' },
      { es: 'Cada comensal sumerge la carne en el caldo agitando ("shabu shabu") 5-10 segundos y moja en su salsa preferida.', en: 'Each diner dips meat in broth swishing ("shabu shabu") 5-10 seconds and dips in preferred sauce.' },
      { es: 'Verduras y tofu se cocinan en el caldo 2-3 min. Los fideos al final. El caldo enriquecido se bebe como sopa.', en: 'Vegetables and tofu cook in broth 2-3 min. Noodles at end. Enriched broth is drunk as soup.' }
    ],
    nutrition: { calories: 480, protein: '40g', carbs: '32g', fat: '20g', fiber: '4g' }
  },
  'sukiyaki': {
    ingredients: [
      { es: '400g de carne de res en láminas finas', en: '400g thinly sliced beef' },
      { es: '1 bloque de tofu firme, 200g shirataki', en: '1 block firm tofu, 200g shirataki noodles' },
      { es: '1 col napa pequeña, 200g shiitake', en: '1 small napa cabbage, 200g shiitake' },
      { es: '2 puerros japoneses (negi)', en: '2 Japanese leeks (negi)' },
      { es: '100ml soya, 100ml mirin, 50ml sake, 3 cdas azúcar', en: '100ml soy, 100ml mirin, 50ml sake, 3 tbsp sugar' },
      { es: '4 huevos crudos frescos', en: '4 very fresh raw eggs' },
      { es: '1 trozo de grasa de res (sebo)', en: '1 piece beef fat (suet)' }
    ],
    steps: [
      { es: 'Prepara la salsa warishita: mezcla soya, mirin, sake y azúcar hasta disolver.', en: 'Prepare warishita sauce: mix soy, mirin, sake and sugar until dissolved.' },
      { es: 'Calienta nabe de hierro. Frota con grasa de res. Dora unas láminas de carne.', en: 'Heat cast iron nabe. Rub with beef fat. Brown some meat slices.' },
      { es: 'Vierte warishita. Agrega verduras, tofu y fideos en secciones separadas. Cocina 5-7 min tapado.', en: 'Pour warishita. Add vegetables, tofu and noodles in separate sections. Cook 5-7 min covered.' },
      { es: 'Cada comensal bate un huevo crudo en su tazón. Sumerge los ingredientes en el huevo antes de comer.', en: 'Each diner beats a raw egg in their bowl. Dips ingredients in egg before eating.' }
    ],
    nutrition: { calories: 580, protein: '42g', carbs: '35g', fat: '28g', fiber: '3g' }
  },
  'yakisoba': {
    ingredients: [
      { es: '400g de fideos yakisoba', en: '400g yakisoba noodles' },
      { es: '200g de panceta de cerdo en tiras', en: '200g pork belly, sliced' },
      { es: '2 tazas de col en tiras, 2 zanahorias en juliana', en: '2 cups shredded cabbage, 2 carrots julienned' },
      { es: '4 cebollines', en: '4 scallions' },
      { es: '4 cucharadas de salsa yakisoba', en: '4 tablespoons yakisoba sauce' },
      { es: 'Aonori, beni shoga y katsuobushi', en: 'Aonori, beni shoga and bonito flakes' }
    ],
    steps: [
      { es: 'Saltea la panceta en wok a fuego alto hasta dorar. Agrega col y zanahoria 2 min manteniendo crujientes.', en: 'Stir-fry pork belly in wok over high heat until browned. Add cabbage and carrot 2 min keeping crispy.' },
      { es: 'Incorpora fideos y salsa. Mezcla con pinzas 2-3 min hasta que brillen.', en: 'Add noodles and sauce. Toss with tongs 2-3 min until glossy.' },
      { es: 'Sirve con cebollines, aonori, beni shoga y katsuobushi que "bailará" con el calor.', en: 'Serve with scallions, aonori, beni shoga and bonito flakes that will "dance" with heat.' }
    ],
    nutrition: { calories: 520, protein: '22g', carbs: '58g', fat: '22g', fiber: '4g' }
  },

  // ═══════ CHINA FALTANTES ═══════
  'kung pao': {
    ingredients: [
      { es: '500g de pechuga de pollo en cubos de 2cm', en: '500g chicken breast in 2cm cubes' },
      { es: '½ taza de cacahuates tostados', en: '½ cup roasted peanuts' },
      { es: '8-10 chiles secos de árbol', en: '8-10 dried árbol chiles' },
      { es: '1 cucharada de granos de pimienta de Sichuan', en: '1 tablespoon Sichuan peppercorns' },
      { es: '3 cebollines en trozos de 2cm', en: '3 scallions in 2cm pieces' },
      { es: '3 dientes de ajo y 1 trozo jengibre, picados', en: '3 garlic cloves and 1 piece ginger, minced' },
      { es: 'Salsa: 2 cdas soya, 1 cda vinagre Chinkiang, 1 cda azúcar, 1 cdita fécula', en: 'Sauce: 2 tbsp soy, 1 tbsp Chinkiang vinegar, 1 tbsp sugar, 1 tsp starch' },
      { es: 'Marinada: 1 cda soya, 1 cda fécula, 1 cda vino shaoxing', en: 'Marinade: 1 tbsp soy, 1 tbsp starch, 1 tbsp shaoxing wine' }
    ],
    steps: [
      { es: 'Marina el pollo con soya, fécula y vino shaoxing 15 minutos. Prepara la salsa mezclando todos los ingredientes líquidos con el azúcar y fécula.', en: 'Marinate chicken with soy, starch and shaoxing wine 15 minutes. Prepare sauce mixing all liquid ingredients with sugar and starch.' },
      { es: 'Calienta wok hasta humear. Saltea los chiles secos y pimienta de Sichuan 30 segundos hasta que aromaticen (cuidado de no quemar).', en: 'Heat wok until smoking. Stir-fry dried chiles and Sichuan peppercorns 30 seconds until aromatic (careful not to burn).' },
      { es: 'Agrega el pollo marinado y saltea 3-4 minutos sin mover al inicio para que dore. Agrega ajo y jengibre.', en: 'Add marinated chicken and stir-fry 3-4 minutes without moving initially to brown. Add garlic and ginger.' },
      { es: 'Vierte la salsa preparada, agrega cacahuates y cebollines. Mezcla 1 minuto hasta que la salsa espese y cubra todo. Sirve sobre arroz al vapor.', en: 'Pour prepared sauce, add peanuts and scallions. Toss 1 minute until sauce thickens and coats everything. Serve over steamed rice.' }
    ],
    nutrition: { calories: 420, protein: '35g', carbs: '22g', fat: '22g', fiber: '2g' }
  },
  'mapo tofu': {
    ingredients: [
      { es: '400g de tofu sedoso firme, en cubos de 2cm', en: '400g firm silken tofu, in 2cm cubes' },
      { es: '150g de carne de cerdo molida', en: '150g ground pork' },
      { es: '2 cucharadas de doubanjiang (pasta de chile fermentado)', en: '2 tablespoons doubanjiang (fermented chili paste)' },
      { es: '1 cucharada de frijol negro fermentado (douchi)', en: '1 tablespoon fermented black beans (douchi)' },
      { es: '1 cucharadita de pimienta de Sichuan molida', en: '1 teaspoon ground Sichuan pepper' },
      { es: '2 dientes de ajo y 1 trozo de jengibre, picados', en: '2 garlic cloves and 1 piece ginger, minced' },
      { es: '1 taza de caldo de pollo', en: '1 cup chicken broth' },
      { es: '1 cucharada de fécula de maíz disuelta en agua', en: '1 tablespoon cornstarch dissolved in water' },
      { es: 'Cebollines y aceite de chile para servir', en: 'Scallions and chili oil for serving' }
    ],
    steps: [
      { es: 'Blanquea el tofu en agua con sal 2 minutos para que no se rompa al cocinar. Escurre con cuidado.', en: 'Blanch tofu in salted water 2 minutes so it doesn\'t break during cooking. Drain carefully.' },
      { es: 'Saltea el cerdo molido en wok a fuego alto hasta que esté bien dorado y seco. Agrega doubanjiang y douchi, fríe 2 minutos hasta que el aceite se ponga rojo.', en: 'Stir-fry ground pork in wok over high heat until well browned and dry. Add doubanjiang and douchi, fry 2 minutes until oil turns red.' },
      { es: 'Agrega ajo, jengibre y el caldo. Incorpora el tofu con delicadeza. Cocina 5 minutos a fuego medio.', en: 'Add garlic, ginger and broth. Gently add tofu. Cook 5 minutes over medium heat.' },
      { es: 'Vierte la fécula disuelta para espesar. Espolvorea pimienta de Sichuan molida (el efecto adormecedor "ma"). Sirve con cebollines y aceite de chile sobre arroz.', en: 'Pour dissolved starch to thicken. Sprinkle ground Sichuan pepper (the numbing "ma" effect). Serve with scallions and chili oil over rice.' }
    ],
    nutrition: { calories: 320, protein: '22g', carbs: '12g', fat: '22g', fiber: '1g' }
  },
  'jiaozi': {
    ingredients: [
      { es: '300g de harina + agua para la masa', en: '300g flour + water for dough' },
      { es: '250g de carne de cerdo molida', en: '250g ground pork' },
      { es: '200g de col china picada y exprimida', en: '200g Chinese cabbage, chopped and squeezed' },
      { es: '2 cebollines picados', en: '2 scallions, chopped' },
      { es: '1 cucharada de jengibre rallado', en: '1 tablespoon grated ginger' },
      { es: '2 cucharadas de salsa de soya', en: '2 tablespoons soy sauce' },
      { es: '1 cucharada de aceite de sésamo', en: '1 tablespoon sesame oil' },
      { es: 'Vinagre negro y salsa de soya para mojar', en: 'Black vinegar and soy sauce for dipping' }
    ],
    steps: [
      { es: 'Prepara la masa: vierte agua hirviendo sobre la harina, amasa 10 min hasta obtener una masa lisa. Reposa 30 minutos cubierta.', en: 'Prepare dough: pour boiling water over flour, knead 10 min until smooth. Rest 30 minutes covered.' },
      { es: 'Mezcla cerdo, col, cebollines, jengibre, soya y sésamo en una dirección hasta que esté pegajoso y elástico.', en: 'Mix pork, cabbage, scallions, ginger, soy and sesame in one direction until sticky and elastic.' },
      { es: 'Divide la masa en 30 porciones. Estira cada una en un disco de 8cm. Coloca relleno y sella haciendo pliegues en media luna.', en: 'Divide dough into 30 portions. Roll each into 8cm disc. Add filling and seal making pleated half-moon.' },
      { es: 'Hierve en agua abundante 6-8 min (flotan cuando están listos). O fríe: dora la base 2 min, agrega agua, tapa y cocina al vapor.', en: 'Boil in plenty of water 6-8 min (they float when done). Or pan-fry: brown base 2 min, add water, cover and steam.' },
      { es: 'Sirve con salsa de vinagre negro, soya y aceite de chile.', en: 'Serve with black vinegar, soy sauce and chili oil dipping sauce.' }
    ],
    nutrition: { calories: 380, protein: '20g', carbs: '42g', fat: '14g', fiber: '2g' }
  },
  'cerdo agridulce': {
    ingredients: [
      { es: '500g de lomo de cerdo en cubos de 3cm', en: '500g pork loin in 3cm cubes' },
      { es: '1 pimiento rojo y 1 verde, en trozos', en: '1 red and 1 green pepper, in chunks' },
      { es: '1 taza de piña en cubos (fresca)', en: '1 cup pineapple cubes (fresh)' },
      { es: '½ taza de ketchup, 3 cdas vinagre de arroz, 3 cdas azúcar, 2 cdas soya', en: '½ cup ketchup, 3 tbsp rice vinegar, 3 tbsp sugar, 2 tbsp soy sauce' },
      { es: '½ taza de fécula de maíz para empanizar', en: '½ cup cornstarch for coating' },
      { es: '1 huevo batido', en: '1 beaten egg' },
      { es: 'Aceite para freír', en: 'Oil for frying' }
    ],
    steps: [
      { es: 'Marina el cerdo con soya 10 min. Pasa por huevo batido y luego por fécula de maíz cubriendo completamente.', en: 'Marinate pork with soy 10 min. Dip in beaten egg then coat completely in cornstarch.' },
      { es: 'Fríe en aceite a 170°C en tandas 4-5 min hasta dorar. Escurre sobre rejilla.', en: 'Fry in 170°C oil in batches 4-5 min until golden. Drain on rack.' },
      { es: 'Prepara la salsa agridulce: mezcla ketchup, vinagre, azúcar, soya y ½ taza de agua. Hierve 2 min hasta espesar ligeramente.', en: 'Prepare sweet and sour sauce: mix ketchup, vinegar, sugar, soy and ½ cup water. Boil 2 min until slightly thick.' },
      { es: 'Saltea los pimientos 2 min en wok. Agrega la piña y la salsa. Incorpora el cerdo frito y mezcla rápidamente para que se cubra sin ablandar. Sirve sobre arroz.', en: 'Stir-fry peppers 2 min in wok. Add pineapple and sauce. Add fried pork and toss quickly to coat without softening. Serve over rice.' }
    ],
    nutrition: { calories: 480, protein: '28g', carbs: '48g', fat: '20g', fiber: '2g' }
  },

  // ═══════ TAILANDIA FALTANTES ═══════
  'pad kra pao': {
    ingredients: [
      { es: '500g de carne de cerdo o pollo molida', en: '500g ground pork or chicken' },
      { es: '1 taza de hojas de albahaca thai santa (holy basil)', en: '1 cup Thai holy basil leaves' },
      { es: '4-6 chiles bird\'s eye, machacados', en: '4-6 bird\'s eye chiles, crushed' },
      { es: '4 dientes de ajo machacados', en: '4 garlic cloves, crushed' },
      { es: '2 cucharadas de salsa de pescado', en: '2 tablespoons fish sauce' },
      { es: '1 cucharada de salsa de ostión', en: '1 tablespoon oyster sauce' },
      { es: '1 cucharadita de azúcar', en: '1 teaspoon sugar' },
      { es: '1 huevo frito y arroz jazmín para servir', en: '1 fried egg and jasmine rice for serving' }
    ],
    steps: [
      { es: 'Calienta wok a fuego alto. Saltea ajo y chiles en aceite 30 segundos hasta que aromaticen.', en: 'Heat wok over high heat. Stir-fry garlic and chiles in oil 30 seconds until aromatic.' },
      { es: 'Agrega la carne molida y cocina 4-5 minutos rompiendo con la espátula hasta que esté bien cocida y dorada.', en: 'Add ground meat and cook 4-5 minutes breaking with spatula until well cooked and browned.' },
      { es: 'Sazona con salsa de pescado, ostión y azúcar. Mezcla bien. Incorpora las hojas de albahaca santa al final y revuelve solo 10 segundos (se marchitan al instante).', en: 'Season with fish sauce, oyster sauce and sugar. Mix well. Add holy basil leaves at the end and stir only 10 seconds (they wilt instantly).' },
      { es: 'Sirve sobre arroz jazmín al vapor con un huevo frito encima con bordes crujientes (kai dao).', en: 'Serve over steamed jasmine rice with a fried egg on top with crispy edges (kai dao).' }
    ],
    nutrition: { calories: 420, protein: '30g', carbs: '35g', fat: '18g', fiber: '1g' }
  },
  'tom kha': {
    ingredients: [
      { es: '400g de pechuga de pollo en rodajas finas', en: '400g chicken breast, thinly sliced' },
      { es: '400ml de leche de coco', en: '400ml coconut milk' },
      { es: '2 tazas de caldo de pollo', en: '2 cups chicken broth' },
      { es: '5 rodajas de galangal', en: '5 slices galangal' },
      { es: '3 tallos de lemongrass machacados', en: '3 lemongrass stalks, crushed' },
      { es: '5 hojas de lima kaffir', en: '5 kaffir lime leaves' },
      { es: '200g de champiñones en rodajas', en: '200g mushrooms, sliced' },
      { es: '3 cdas salsa de pescado, 3 cdas jugo limón', en: '3 tbsp fish sauce, 3 tbsp lime juice' },
      { es: 'Chile y cilantro fresco', en: 'Chile and fresh cilantro' }
    ],
    steps: [
      { es: 'Hierve el caldo con leche de coco, galangal, lemongrass y hojas de kaffir 5 minutos.', en: 'Boil broth with coconut milk, galangal, lemongrass and kaffir leaves 5 minutes.' },
      { es: 'Agrega champiñones 2 minutos. Luego el pollo y cocina 3-4 minutos más.', en: 'Add mushrooms 2 minutes. Then chicken and cook 3-4 more minutes.' },
      { es: 'Retira del fuego. Sazona con salsa de pescado y limón. Sirve con cilantro y chile. La diferencia con Tom Yum es que esta es cremosa por la leche de coco.', en: 'Remove from heat. Season with fish sauce and lime. Serve with cilantro and chile. The difference from Tom Yum is this is creamy from coconut milk.' }
    ],
    nutrition: { calories: 380, protein: '30g', carbs: '10g', fat: '26g', fiber: '1g' }
  },
  'khao soi': {
    ingredients: [
      { es: '500g de muslos de pollo', en: '500g chicken thighs' },
      { es: '400ml de leche de coco', en: '400ml coconut milk' },
      { es: '3 cucharadas de pasta de curry rojo', en: '3 tablespoons red curry paste' },
      { es: '300g de fideos de huevo (egg noodles)', en: '300g egg noodles' },
      { es: '2 cucharadas de salsa de pescado', en: '2 tablespoons fish sauce' },
      { es: '1 cucharada de cúrcuma', en: '1 tablespoon turmeric' },
      { es: 'Chalotas fritas, limón, chile en aceite y cilantro', en: 'Fried shallots, lime, chili in oil and cilantro' }
    ],
    steps: [
      { es: 'Fríe la pasta de curry en la crema de coco (parte espesa) 3 min hasta que el aceite se separe y aromatice.', en: 'Fry curry paste in coconut cream (thick part) 3 min until oil separates and becomes aromatic.' },
      { es: 'Agrega pollo, cúrcuma y el resto de leche de coco. Cocina 20 min hasta que el pollo esté tierno. Sazona con salsa de pescado.', en: 'Add chicken, turmeric and remaining coconut milk. Cook 20 min until chicken is tender. Season with fish sauce.' },
      { es: 'Cocina los fideos según paquete. Reserva un puñado y fríelos hasta crujientes para decorar.', en: 'Cook noodles per package. Reserve a handful and fry until crispy for garnish.' },
      { es: 'Sirve fideos en tazón, vierte el curry de pollo. Corona con fideos fritos crujientes, chalotas fritas, cilantro y limón.', en: 'Serve noodles in bowl, pour chicken curry over. Top with crispy fried noodles, fried shallots, cilantro and lime.' }
    ],
    nutrition: { calories: 550, protein: '32g', carbs: '45g', fat: '28g', fiber: '2g' }
  },
  'pad see ew': {
    ingredients: [
      { es: '400g de fideos de arroz anchos (sen yai)', en: '400g wide rice noodles (sen yai)' },
      { es: '300g de pollo o cerdo en tiras', en: '300g chicken or pork, sliced' },
      { es: '2 tazas de brócoli chino (kai lan) en trozos', en: '2 cups Chinese broccoli (kai lan), chopped' },
      { es: '2 huevos', en: '2 eggs' },
      { es: '3 cucharadas de salsa de soya oscura', en: '3 tablespoons dark soy sauce' },
      { es: '1 cucharada de salsa de soya clara', en: '1 tablespoon light soy sauce' },
      { es: '1 cucharada de salsa de ostión', en: '1 tablespoon oyster sauce' },
      { es: '2 dientes de ajo picados', en: '2 garlic cloves, minced' }
    ],
    steps: [
      { es: 'Calienta wok a fuego MUY alto (debe humear). Saltea el ajo 10 seg, luego la proteína hasta dorar.', en: 'Heat wok over VERY high heat (should smoke). Stir-fry garlic 10 sec, then protein until browned.' },
      { es: 'Empuja a un lado. Rompe los huevos directamente en el wok y revuelve rápidamente.', en: 'Push to one side. Crack eggs directly into wok and scramble quickly.' },
      { es: 'Agrega fideos, soya oscura, soya clara y salsa de ostión. Mezcla con movimientos amplios 2 min. Los fideos deben tener marcas de chamusque (wok hei).', en: 'Add noodles, dark soy, light soy and oyster sauce. Toss with wide movements 2 min. Noodles should have char marks (wok hei).' },
      { es: 'Incorpora el brócoli chino los últimos 30 segundos. Sirve inmediatamente.', en: 'Add Chinese broccoli in last 30 seconds. Serve immediately.' }
    ],
    nutrition: { calories: 480, protein: '28g', carbs: '55g', fat: '16g', fiber: '3g' }
  },
  'larb': {
    ingredients: [
      { es: '500g de carne de cerdo molida', en: '500g ground pork' },
      { es: '4 cucharadas de jugo de limón fresco', en: '4 tablespoons fresh lime juice' },
      { es: '3 cucharadas de salsa de pescado', en: '3 tablespoons fish sauce' },
      { es: '2 cucharadas de arroz tostado molido (khao khua)', en: '2 tablespoons toasted rice powder (khao khua)' },
      { es: '4 chalotas en rodajas finas', en: '4 shallots, thinly sliced' },
      { es: 'Menta, cilantro fresco y chile en hojuelas', en: 'Fresh mint, cilantro and chili flakes' },
      { es: 'Hojas de lechuga para servir', en: 'Lettuce leaves for serving' }
    ],
    steps: [
      { es: 'Tuesta arroz crudo en sartén seco a fuego medio hasta dorar (5 min). Muele en mortero hasta obtener un polvo grueso.', en: 'Toast raw rice in dry skillet over medium heat until golden (5 min). Grind in mortar to coarse powder.' },
      { es: 'Cocina la carne molida en sartén SIN aceite, desmenuzando con espátula. Cocina hasta que esté completamente hecha. Retira del fuego.', en: 'Cook ground meat in skillet WITHOUT oil, crumbling with spatula. Cook until fully done. Remove from heat.' },
      { es: 'Mezcla la carne caliente con limón, salsa de pescado, arroz tostado, chalotas y chile. El arroz tostado da la textura crujiente y terrosa característica.', en: 'Mix hot meat with lime, fish sauce, toasted rice, shallots and chili. Toasted rice gives the characteristic crunchy, earthy texture.' },
      { es: 'Agrega menta y cilantro. Sirve sobre hojas de lechuga como taco. Se come envolviendo.', en: 'Add mint and cilantro. Serve over lettuce leaves like a taco. Eaten by wrapping.' }
    ],
    nutrition: { calories: 340, protein: '30g', carbs: '10g', fat: '20g', fiber: '1g' }
  },

  // ═══════ GRECIA FALTANTES ═══════
  'moussaka': {
    ingredients: [
      { es: '3 berenjenas grandes, en rodajas de 1cm', en: '3 large eggplants, sliced 1cm thick' },
      { es: '500g de carne de cordero o res molida', en: '500g ground lamb or beef' },
      { es: '1 lata de jitomate triturado (400g)', en: '1 can crushed tomatoes (400g)' },
      { es: '1 cebolla grande picada', en: '1 large onion, chopped' },
      { es: '2 dientes de ajo', en: '2 garlic cloves' },
      { es: '1 cucharadita de canela', en: '1 teaspoon cinnamon' },
      { es: 'Bechamel: 60g mantequilla, 60g harina, 600ml leche, 2 yemas, nuez moscada', en: 'Béchamel: 60g butter, 60g flour, 600ml milk, 2 yolks, nutmeg' },
      { es: '100g de queso kefalotyri o parmesano rallado', en: '100g grated kefalotyri or Parmesan cheese' }
    ],
    steps: [
      { es: 'Sala las berenjenas 30 min para desaguar. Seca y asa en horno a 200°C con aceite de oliva 20 min hasta dorar.', en: 'Salt eggplants 30 min to draw out moisture. Dry and roast in oven at 200°C with olive oil 20 min until golden.' },
      { es: 'Sofríe cebolla y ajo. Agrega la carne y dora bien. Incorpora jitomate, canela, sal y pimienta. Cocina 15 min.', en: 'Sauté onion and garlic. Add meat and brown well. Add tomatoes, cinnamon, salt and pepper. Cook 15 min.' },
      { es: 'Prepara la bechamel: roux de mantequilla y harina, vierte leche poco a poco. Fuera del fuego agrega yemas y queso. Sazona con nuez moscada.', en: 'Prepare béchamel: butter and flour roux, pour milk gradually. Off heat add yolks and cheese. Season with nutmeg.' },
      { es: 'Arma capas en un refractario engrasado: berenjenas, carne, berenjenas, carne. Corona con la bechamel espesa. Espolvorea queso.', en: 'Build layers in greased baking dish: eggplant, meat, eggplant, meat. Top with thick béchamel. Sprinkle cheese.' },
      { es: 'Hornea a 180°C 45 minutos hasta que la superficie esté dorada e inflada. Deja reposar 20 minutos antes de cortar (esto es crucial).', en: 'Bake at 180°C 45 minutes until surface is golden and puffed. Let rest 20 minutes before cutting (this is crucial).' }
    ],
    nutrition: { calories: 520, protein: '28g', carbs: '30g', fat: '32g', fiber: '5g' }
  },
  'gyros': {
    ingredients: [
      { es: '700g de muslos de pollo deshuesados', en: '700g boneless chicken thighs' },
      { es: '2 cucharadas de yogur griego', en: '2 tablespoons Greek yogurt' },
      { es: '2 cucharadas de aceite de oliva', en: '2 tablespoons olive oil' },
      { es: '2 dientes de ajo rallados', en: '2 garlic cloves, grated' },
      { es: '1 cucharadita de orégano, pimentón y comino', en: '1 teaspoon oregano, paprika and cumin' },
      { es: '4 panes pita redondos', en: '4 round pita breads' },
      { es: 'Tzatziki: yogur, pepino, ajo, eneldo', en: 'Tzatziki: yogurt, cucumber, garlic, dill' },
      { es: 'Jitomate, cebolla, lechuga y papas fritas para servir', en: 'Tomato, onion, lettuce and fries for serving' }
    ],
    steps: [
      { es: 'Marina el pollo con yogur, aceite, ajo, orégano, pimentón, comino y sal. Refrigera mínimo 2 horas.', en: 'Marinate chicken with yogurt, oil, garlic, oregano, paprika, cumin and salt. Refrigerate at least 2 hours.' },
      { es: 'Asa el pollo en sartén de hierro o parrilla muy caliente 5-6 min por lado hasta carbonizar los bordes. Deja reposar 5 min y rebana en tiras.', en: 'Grill chicken in cast iron or very hot grill 5-6 min per side until edges char. Rest 5 min and slice into strips.' },
      { es: 'Prepara el tzatziki: ralla pepino, exprime toda el agua, mezcla con yogur griego, ajo rallado, eneldo fresco, limón y sal.', en: 'Prepare tzatziki: grate cucumber, squeeze all water, mix with Greek yogurt, grated garlic, fresh dill, lemon and salt.' },
      { es: 'Calienta los pitas. Unta tzatziki, rellena con pollo, jitomate, cebolla, lechuga y papas fritas dentro. Enrolla en papel aluminio para mantener la forma.', en: 'Warm pitas. Spread tzatziki, fill with chicken, tomato, onion, lettuce and fries inside. Wrap in foil to hold shape.' }
    ],
    nutrition: { calories: 520, protein: '38g', carbs: '42g', fat: '22g', fiber: '3g' }
  },
  'souvlaki': {
    ingredients: [
      { es: '600g de lomo de cerdo en cubos de 3cm', en: '600g pork loin in 3cm cubes' },
      { es: '4 cucharadas de aceite de oliva', en: '4 tablespoons olive oil' },
      { es: '2 cucharadas de jugo de limón', en: '2 tablespoons lemon juice' },
      { es: '2 dientes de ajo machacados', en: '2 garlic cloves, crushed' },
      { es: '1 cucharadita de orégano griego seco', en: '1 teaspoon dried Greek oregano' },
      { es: 'Panes pita, tzatziki, jitomate y cebolla', en: 'Pita breads, tzatziki, tomato and onion' },
      { es: '8 brochetas de madera remojadas', en: '8 wooden skewers, soaked' }
    ],
    steps: [
      { es: 'Marina el cerdo en aceite de oliva, limón, ajo, orégano, sal y pimienta mínimo 2 horas.', en: 'Marinate pork in olive oil, lemon, garlic, oregano, salt and pepper at least 2 hours.' },
      { es: 'Ensarta los cubos en las brochetas dejando un espacio mínimo entre cada uno.', en: 'Thread cubes onto skewers leaving minimal space between each.' },
      { es: 'Asa en parrilla o sartén de hierro bien caliente 3-4 minutos por cada lado (4 lados). Debe tener marcas de carbón.', en: 'Grill on very hot grill or cast iron 3-4 minutes per side (4 sides). Should have char marks.' },
      { es: 'Sirve las brochetas sobre pan pita con tzatziki, jitomate fresco, cebolla y un chorro de limón. La versión callejera griega por excelencia.', en: 'Serve skewers over pita bread with tzatziki, fresh tomato, onion and a squeeze of lemon. The quintessential Greek street food.' }
    ],
    nutrition: { calories: 420, protein: '35g', carbs: '28g', fat: '20g', fiber: '2g' }
  },
  'pastitsio': {
    ingredients: [
      { es: '400g de pasta tubular (penne o bucatini)', en: '400g tubular pasta (penne or bucatini)' },
      { es: '500g de carne de res molida', en: '500g ground beef' },
      { es: '1 lata de jitomate triturado (400g)', en: '1 can crushed tomatoes (400g)' },
      { es: '1 cebolla picada, 2 ajos', en: '1 chopped onion, 2 garlic cloves' },
      { es: '1 cucharadita de canela y orégano', en: '1 teaspoon cinnamon and oregano' },
      { es: 'Bechamel: 80g mantequilla, 80g harina, 700ml leche, 2 yemas, queso', en: 'Béchamel: 80g butter, 80g flour, 700ml milk, 2 yolks, cheese' },
      { es: '100g de queso kefalotyri rallado', en: '100g grated kefalotyri cheese' }
    ],
    steps: [
      { es: 'Cocina la pasta al dente. Sofríe cebolla y ajo, agrega carne y dora. Incorpora jitomate, canela y orégano. Cocina 15 min.', en: 'Cook pasta al dente. Sauté onion and garlic, add meat and brown. Add tomatoes, cinnamon and oregano. Cook 15 min.' },
      { es: 'Prepara bechamel espesa: roux de mantequilla/harina, leche gradualmente. Fuera del fuego agrega yemas y queso.', en: 'Prepare thick béchamel: butter/flour roux, milk gradually. Off heat add yolks and cheese.' },
      { es: 'Arma: capa de pasta mezclada con un poco de bechamel, capa de carne, otra capa de pasta, y corona todo con bechamel generosa.', en: 'Build: layer of pasta mixed with some béchamel, meat layer, another pasta layer, and top everything with generous béchamel.' },
      { es: 'Espolvorea queso y hornea a 180°C 40 minutos hasta dorar. Reposa 15 min para cortar en cuadros limpios.', en: 'Sprinkle cheese and bake at 180°C 40 minutes until golden. Rest 15 min to cut into clean squares.' }
    ],
    nutrition: { calories: 560, protein: '30g', carbs: '48g', fat: '28g', fiber: '3g' }
  },
  'keftedes': {
    ingredients: [
      { es: '500g de carne de res y cerdo molida (mixta)', en: '500g mixed ground beef and pork' },
      { es: '1 cebolla rallada', en: '1 onion, grated' },
      { es: '2 rebanadas de pan remojadas en leche', en: '2 bread slices soaked in milk' },
      { es: '1 huevo', en: '1 egg' },
      { es: '2 cucharadas de menta fresca picada', en: '2 tablespoons fresh mint, chopped' },
      { es: '1 cucharadita de comino y orégano', en: '1 teaspoon cumin and oregano' },
      { es: 'Harina para rebozar y aceite de oliva para freír', en: 'Flour for coating and olive oil for frying' },
      { es: 'Tzatziki y limón para servir', en: 'Tzatziki and lemon for serving' }
    ],
    steps: [
      { es: 'Exprime el pan remojado. Mezcla con la carne, cebolla rallada, huevo, menta, comino, orégano, sal y pimienta. Refrigera 1 hora.', en: 'Squeeze soaked bread. Mix with meat, grated onion, egg, mint, cumin, oregano, salt and pepper. Refrigerate 1 hour.' },
      { es: 'Forma albóndigas aplanadas (como discos gruesos de 5cm). Pasa ligeramente por harina.', en: 'Form flattened meatballs (like thick 5cm discs). Lightly coat in flour.' },
      { es: 'Fríe en aceite de oliva abundante a fuego medio 4 minutos por lado hasta que estén doradas y crujientes.', en: 'Fry in generous olive oil over medium heat 4 minutes per side until golden and crispy.' },
      { es: 'Sirve calientes con tzatziki, gajos de limón y ensalada griega al lado.', en: 'Serve hot with tzatziki, lemon wedges and Greek salad on the side.' }
    ],
    nutrition: { calories: 380, protein: '25g', carbs: '15g', fat: '26g', fiber: '1g' }
  },
  'quiche lorraine': {
    ingredients: [
      { es: '1 masa quebrada (pâte brisée) de 25cm', en: '1 shortcrust pastry (pâte brisée) 25cm' },
      { es: '200g de lardons (panceta en cubitos)', en: '200g lardons (diced bacon)' },
      { es: '200g de queso gruyère rallado', en: '200g grated Gruyère cheese' },
      { es: '4 huevos', en: '4 eggs' },
      { es: '300ml de crema de leche', en: '300ml heavy cream' },
      { es: '1 pizca de nuez moscada', en: '1 pinch nutmeg' },
      { es: 'Sal y pimienta', en: 'Salt and pepper' }
    ],
    steps: [
      { es: 'Hornea la masa en blanco: forra un molde de tarta, pincha con tenedor, cubre con papel y pesos. Hornea 15 min a 190°C. Retira pesos y hornea 5 min más.', en: 'Blind bake crust: line tart pan, prick with fork, cover with paper and weights. Bake 15 min at 190°C. Remove weights and bake 5 more min.' },
      { es: 'Dora los lardons en un sartén sin aceite hasta que estén crujientes. Escurre sobre papel.', en: 'Brown lardons in skillet without oil until crispy. Drain on paper.' },
      { es: 'Bate los huevos con la crema, nuez moscada, sal y pimienta. Distribuye los lardons y ¾ del queso sobre la masa. Vierte la mezcla de huevo. Cubre con el queso restante.', en: 'Beat eggs with cream, nutmeg, salt and pepper. Distribute lardons and ¾ of cheese over crust. Pour egg mixture. Top with remaining cheese.' },
      { es: 'Hornea a 180°C 30-35 minutos hasta que esté dorada, inflada y ligeramente temblorosa en el centro. Deja reposar 10 minutos antes de cortar.', en: 'Bake at 180°C 30-35 minutes until golden, puffed and slightly wobbly in center. Let rest 10 minutes before cutting.' }
    ],
    nutrition: { calories: 450, protein: '18g', carbs: '20g', fat: '34g', fiber: '1g' }
  }
};

async function fixBatch() {
  console.log('🌍 BATCH 7: Recetas faltantes (Japón, China, Tailandia, Grecia, Francia)\n');
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
      let matchedFix = null;
      for (const [key, fix] of Object.entries(fixes)) {
        const regex = new RegExp(key, 'i');
        if (regex.test(titleSearch)) { matchedFix = fix; break; }
      }
      if (matchedFix) {
        await conn.query('UPDATE recipes SET ingredients = ?, steps = ?, nutrition = ? WHERE id = ?',
          [JSON.stringify(matchedFix.ingredients), JSON.stringify(matchedFix.steps), JSON.stringify(matchedFix.nutrition), r.id]);
        console.log(`✅ ID ${r.id}: ${titleEs || titleEn} [${matchedFix.ingredients.length} ings, ${matchedFix.steps.length} pasos]`);
        fixed++;
      }
    }
    console.log(`\n🎉 Batch 7 completado: ${fixed} recetas corregidas`);
  } catch (error) { console.error('❌ Error:', error); }
  finally { if (conn) conn.release(); pool.end(); }
}
fixBatch();
