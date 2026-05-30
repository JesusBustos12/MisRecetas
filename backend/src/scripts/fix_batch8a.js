import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const fixes = {
  // ═══ JAPÓN ═══
  'okonomiyaki': {
    ingredients: [
      { es: '2 tazas de harina para okonomiyaki (o harina normal + nagaimo rallado)', en: '2 cups okonomiyaki flour (or regular flour + grated nagaimo)' },
      { es: '200g de col en tiras finas', en: '200g cabbage, thinly shredded' },
      { es: '150g de panceta de cerdo en láminas finas', en: '150g pork belly, thinly sliced' },
      { es: '2 huevos', en: '2 eggs' },
      { es: '¾ taza de dashi frío', en: '¾ cup cold dashi' },
      { es: 'Tenkasu (trozos de tempura crujientes)', en: 'Tenkasu (crispy tempura bits)' },
      { es: 'Salsa okonomiyaki, mayonesa japonesa, aonori y katsuobushi', en: 'Okonomiyaki sauce, Japanese mayo, aonori and bonito flakes' }
    ],
    steps: [
      { es: 'Mezcla harina, dashi y huevos hasta obtener una masa suave. Incorpora la col en tiras y tenkasu sin mezclar demasiado.', en: 'Mix flour, dashi and eggs until smooth batter. Fold in shredded cabbage and tenkasu without over-mixing.' },
      { es: 'Vierte una porción en un sartén engrasado a fuego medio. Coloca las láminas de panceta encima. Cocina 4-5 minutos hasta que la base esté dorada.', en: 'Pour a portion in greased skillet over medium heat. Place pork belly slices on top. Cook 4-5 minutes until base is golden.' },
      { es: 'Voltea con valor (¡es el momento de verdad!). Cocina 4-5 minutos más. No presiones con la espátula.', en: 'Flip with confidence (this is the moment of truth!). Cook 4-5 more minutes. Don\'t press with spatula.' },
      { es: 'Decora en orden: salsa okonomiyaki en zigzag, mayonesa japonesa en zigzag cruzado, lluvia de aonori y katsuobushi que "bailará" con el calor.', en: 'Decorate in order: okonomiyaki sauce in zigzag, Japanese mayo in crossed zigzag, shower of aonori and bonito flakes that will "dance" with heat.' }
    ],
    nutrition: { calories: 480, protein: '18g', carbs: '45g', fat: '26g', fiber: '3g' }
  },
  'takoyaki': {
    ingredients: [
      { es: '200g de pulpo cocido, en cubos de 1cm', en: '200g cooked octopus, in 1cm cubes' },
      { es: '1.5 tazas de harina', en: '1.5 cups flour' },
      { es: '2 tazas de dashi frío', en: '2 cups cold dashi' },
      { es: '2 huevos', en: '2 eggs' },
      { es: 'Tenkasu, beni shoga (jengibre rojo) y cebollines', en: 'Tenkasu, beni shoga (red pickled ginger) and scallions' },
      { es: 'Salsa takoyaki, mayonesa, aonori y katsuobushi', en: 'Takoyaki sauce, mayo, aonori and bonito flakes' }
    ],
    steps: [
      { es: 'Mezcla harina, dashi y huevos hasta una masa muy líquida (más líquida que para hotcakes).', en: 'Mix flour, dashi and eggs into a very liquid batter (more liquid than pancakes).' },
      { es: 'Calienta la sartén de takoyaki y engrasa cada cavidad. Vierte masa, coloca un cubo de pulpo, tenkasu y beni shoga en cada una.', en: 'Heat takoyaki pan and grease each cavity. Pour batter, place an octopus cube, tenkasu and beni shoga in each.' },
      { es: 'Con un palillo de bambú, gira cada bola 90° cuando los bordes cuajen (2 min). Repite hasta formar esferas doradas perfectas.', en: 'With bamboo pick, rotate each ball 90° when edges set (2 min). Repeat until forming perfect golden spheres.' },
      { es: 'Sirve en un plato con salsa takoyaki, mayonesa en zigzag, aonori y katsuobushi. El interior debe ser cremoso.', en: 'Serve on plate with takoyaki sauce, mayo in zigzag, aonori and bonito flakes. Interior should be creamy.' }
    ],
    nutrition: { calories: 320, protein: '16g', carbs: '38g', fat: '12g', fiber: '1g' }
  },
  'unagi don': {
    ingredients: [
      { es: '2 filetes de anguila unagi (kabayaki, preparada)', en: '2 unagi eel fillets (kabayaki, prepared)' },
      { es: '3 tazas de arroz japonés cocido', en: '3 cups cooked Japanese rice' },
      { es: '4 cucharadas de salsa kabayaki (soya, mirin, azúcar, sake)', en: '4 tablespoons kabayaki sauce (soy, mirin, sugar, sake)' },
      { es: 'Sansho (pimienta japonesa) al gusto', en: 'Sansho (Japanese pepper) to taste' },
      { es: 'Nori en tiras finas', en: 'Nori in thin strips' }
    ],
    steps: [
      { es: 'Prepara la salsa kabayaki: reduce soya, mirin, sake y azúcar a fuego medio hasta que espese y se vuelva brillante.', en: 'Prepare kabayaki sauce: reduce soy, mirin, sake and sugar over medium heat until thick and glossy.' },
      { es: 'Calienta la anguila: colócala con la piel hacia abajo bajo el broiler 3-4 minutos, barnizando con salsa kabayaki varias veces.', en: 'Heat eel: place skin-side down under broiler 3-4 minutes, basting with kabayaki sauce several times.' },
      { es: 'Sirve arroz caliente en un tazón donburi. Coloca la anguila glaseada encima, baña con más salsa y espolvorea sansho y tiras de nori.', en: 'Serve hot rice in donburi bowl. Place glazed eel on top, drizzle with more sauce and sprinkle sansho and nori strips.' }
    ],
    nutrition: { calories: 550, protein: '28g', carbs: '68g', fat: '18g', fiber: '1g' }
  },
  'dorayaki': {
    ingredients: [
      { es: '1.5 tazas de harina', en: '1.5 cups flour' },
      { es: '3 huevos', en: '3 eggs' },
      { es: '½ taza de azúcar', en: '½ cup sugar' },
      { es: '2 cucharadas de miel', en: '2 tablespoons honey' },
      { es: '1 cucharadita de bicarbonato', en: '1 teaspoon baking soda' },
      { es: '200g de pasta de judía roja (anko)', en: '200g red bean paste (anko)' }
    ],
    steps: [
      { es: 'Bate huevos con azúcar hasta que estén pálidos y esponjosos. Agrega miel. Incorpora harina y bicarbonato tamizados.', en: 'Beat eggs with sugar until pale and fluffy. Add honey. Fold in sifted flour and baking soda.' },
      { es: 'Reposa la masa 15 minutos. En un sartén antiadherente a fuego bajo, vierte cucharones de masa formando círculos de 8cm. Cuando aparezcan burbujas en la superficie, voltea 1 minuto.', en: 'Rest batter 15 minutes. In non-stick skillet over low heat, pour ladles of batter forming 8cm circles. When bubbles appear on surface, flip 1 minute.' },
      { es: 'Une dos pancakes con una cucharada generosa de anko en el centro. Presiona suavemente los bordes. Es el dulce favorito de Doraemon.', en: 'Join two pancakes with a generous spoonful of anko in the center. Gently press edges. It\'s Doraemon\'s favorite sweet.' }
    ],
    nutrition: { calories: 280, protein: '8g', carbs: '52g', fat: '4g', fiber: '2g' }
  },

  // ═══ MÉXICO ═══
  'arroz con leche': {
    ingredients: [
      { es: '1 taza de arroz de grano largo', en: '1 cup long-grain rice' },
      { es: '4 tazas de leche entera', en: '4 cups whole milk' },
      { es: '1 lata de leche condensada (397g)', en: '1 can condensed milk (397g)' },
      { es: '1 raja de canela', en: '1 cinnamon stick' },
      { es: '1 tira de cáscara de limón', en: '1 strip lemon peel' },
      { es: 'Canela en polvo y pasas para decorar', en: 'Ground cinnamon and raisins for garnish' }
    ],
    steps: [
      { es: 'Hierve el arroz en agua 10 minutos hasta que esté al dente. Escurre y enjuaga.', en: 'Boil rice in water 10 minutes until al dente. Drain and rinse.' },
      { es: 'Calienta la leche con la canela y cáscara de limón. Agrega el arroz y cocina a fuego bajo 25-30 minutos revolviendo frecuentemente.', en: 'Heat milk with cinnamon and lemon peel. Add rice and cook on low heat 25-30 minutes stirring frequently.' },
      { es: 'Incorpora la leche condensada. Cocina 10 minutos más hasta que espese pero siga cremoso (espesará más al enfriar).', en: 'Add condensed milk. Cook 10 more minutes until thick but still creamy (will thicken more when cool).' },
      { es: 'Sirve tibio o frío espolvoreado con canela y pasas. Se puede servir en cazuelitas individuales.', en: 'Serve warm or cold sprinkled with cinnamon and raisins. Can be served in individual clay pots.' }
    ],
    nutrition: { calories: 350, protein: '10g', carbs: '58g', fat: '10g', fiber: '0g' }
  },
  'pan de muerto': {
    ingredients: [
      { es: '4 tazas de harina de trigo', en: '4 cups wheat flour' },
      { es: '½ taza de azúcar', en: '½ cup sugar' },
      { es: '4 huevos + 2 yemas', en: '4 eggs + 2 yolks' },
      { es: '120g de mantequilla a temperatura ambiente', en: '120g butter at room temperature' },
      { es: '1 sobre de levadura', en: '1 packet yeast' },
      { es: '¼ taza de leche tibia', en: '¼ cup warm milk' },
      { es: 'Ralladura de 1 naranja y 1 cucharada de agua de azahar', en: 'Zest of 1 orange and 1 tablespoon orange blossom water' },
      { es: 'Mantequilla derretida y azúcar para cubrir', en: 'Melted butter and sugar for coating' }
    ],
    steps: [
      { es: 'Activa la levadura en leche tibia con una pizca de azúcar 10 min. Mezcla harina, azúcar y sal. Agrega los huevos uno a uno y la levadura.', en: 'Activate yeast in warm milk with a pinch of sugar 10 min. Mix flour, sugar and salt. Add eggs one by one and yeast.' },
      { es: 'Incorpora la mantequilla poco a poco amasando 15 minutos hasta una masa elástica que se despegue de las manos. Agrega ralladura y agua de azahar.', en: 'Add butter gradually kneading 15 minutes until elastic dough that pulls away from hands. Add zest and orange blossom water.' },
      { es: 'Deja fermentar tapada 2 horas hasta duplicar. Forma la esfera principal, los "huesitos" en forma de lágrima y la bolita superior. Arma el pan.', en: 'Let rise covered 2 hours until doubled. Shape main sphere, tear-drop "bones" and top ball. Assemble bread.' },
      { es: 'Deja fermentar 45 minutos más. Hornea a 180°C 25-30 minutos hasta dorar. Al salir, barniza con mantequilla derretida y rueda en azúcar.', en: 'Let rise 45 more minutes. Bake at 180°C 25-30 minutes until golden. When out, brush with melted butter and roll in sugar.' }
    ],
    nutrition: { calories: 380, protein: '10g', carbs: '52g', fat: '16g', fiber: '1g' }
  },
  'aguachile': {
    ingredients: [
      { es: '500g de camarones grandes crudos, mariposeados', en: '500g large raw shrimp, butterflied' },
      { es: '½ taza de jugo de limón fresco (unos 8 limones)', en: '½ cup fresh lime juice (about 8 limes)' },
      { es: '2-4 chiles serranos (al gusto de picor)', en: '2-4 serrano chiles (to taste for heat)' },
      { es: '½ pepino en rodajas finas', en: '½ cucumber, thinly sliced' },
      { es: '½ cebolla morada en rodajas finas', en: '½ red onion, thinly sliced' },
      { es: 'Cilantro fresco, sal y tostadas', en: 'Fresh cilantro, salt and tostadas' }
    ],
    steps: [
      { es: 'Licúa el jugo de limón con los chiles serranos y sal hasta obtener una salsa verde brillante. Prueba y ajusta el picor.', en: 'Blend lime juice with serrano chiles and salt until bright green sauce. Taste and adjust heat.' },
      { es: 'Coloca los camarones mariposeados en un plato frío. Vierte la salsa de aguachile encima cubriendo todo. El ácido del limón "cocina" el camarón.', en: 'Place butterflied shrimp on a cold plate. Pour aguachile sauce over covering everything. The lime acid "cooks" the shrimp.' },
      { es: 'Refrigera 15-20 minutos máximo (si se pasa de tiempo, el camarón se pone gomoso). Decora con pepino, cebolla y cilantro.', en: 'Refrigerate 15-20 minutes maximum (if over-time, shrimp gets rubbery). Garnish with cucumber, onion and cilantro.' },
      { es: 'Sirve inmediatamente con tostadas. Se come como ceviche: con la tostada como cuchara.', en: 'Serve immediately with tostadas. Eaten like ceviche: with tostada as a spoon.' }
    ],
    nutrition: { calories: 180, protein: '28g', carbs: '8g', fat: '3g', fiber: '1g' }
  },
  'camarones a la diabla': {
    ingredients: [
      { es: '800g de camarones grandes pelados y desvenados', en: '800g large shrimp, peeled and deveined' },
      { es: '6 chiles guajillo desvenados y remojados', en: '6 guajillo chiles, deseeded and soaked' },
      { es: '3 chiles de árbol (para el picor)', en: '3 árbol chiles (for heat)' },
      { es: '3 jitomates asados', en: '3 roasted tomatoes' },
      { es: '3 dientes de ajo asados', en: '3 roasted garlic cloves' },
      { es: '½ cebolla asada', en: '½ roasted onion' },
      { es: '2 cucharadas de aceite', en: '2 tablespoons oil' },
      { es: 'Arroz blanco, limones y cilantro', en: 'White rice, limes and cilantro' }
    ],
    steps: [
      { es: 'Asa los jitomates, ajos y cebolla en un comal hasta que se chamusquen. Licúa con los chiles remojados hasta obtener una salsa lisa.', en: 'Roast tomatoes, garlic and onion on a comal until charred. Blend with soaked chiles until smooth sauce.' },
      { es: 'Sofríe la salsa en aceite caliente 5 minutos revolviendo (cuidado con los salpicones, es picante). La salsa debe oscurecerse.', en: 'Fry sauce in hot oil 5 minutes stirring (careful with splatter, it\'s spicy). Sauce should darken.' },
      { es: 'Agrega los camarones crudos a la salsa hirviente. Cocina solo 3-4 minutos hasta que estén rosados y en forma de C (no de O, eso es sobrecocido).', en: 'Add raw shrimp to boiling sauce. Cook only 3-4 minutes until pink and C-shaped (not O-shaped, that\'s overcooked).' },
      { es: 'Sirve inmediatamente sobre arroz blanco con limón y cilantro. Prepara agua para apagar el picor.', en: 'Serve immediately over white rice with lime and cilantro. Prepare water to quench the heat.' }
    ],
    nutrition: { calories: 280, protein: '35g', carbs: '15g', fat: '10g', fiber: '3g' }
  },

  // ═══ ESPAÑA ═══
  'tortilla de patatas': {
    ingredients: [
      { es: '6 patatas medianas, peladas y en láminas de 3mm', en: '6 medium potatoes, peeled and sliced 3mm' },
      { es: '8 huevos grandes', en: '8 large eggs' },
      { es: '1 cebolla grande en rodajas finas (opcional pero recomendable)', en: '1 large onion, thinly sliced (optional but recommended)' },
      { es: '2 tazas de aceite de oliva para confitar', en: '2 cups olive oil for confiting' },
      { es: 'Sal', en: 'Salt' }
    ],
    steps: [
      { es: 'Confita las patatas (y cebolla) en aceite de oliva a fuego medio-bajo 20-25 minutos. Deben estar tiernas pero NO doradas. Escurre reservando el aceite.', en: 'Confit potatoes (and onion) in olive oil over medium-low heat 20-25 minutes. Should be tender but NOT browned. Drain reserving oil.' },
      { es: 'Bate los huevos con sal generosa. Mezcla con las patatas calientes. Deja reposar 10 minutos para que absorban.', en: 'Beat eggs with generous salt. Mix with hot potatoes. Let rest 10 minutes to absorb.' },
      { es: 'Calienta un sartén de 24cm con un poco del aceite reservado. Vierte la mezcla y cocina a fuego medio-bajo 5-6 minutos.', en: 'Heat a 24cm skillet with a bit of reserved oil. Pour mixture and cook over medium-low 5-6 minutes.' },
      { es: 'EL VOLTEO: coloca un plato encima, voltea de un golpe firme y desliza de vuelta. Cocina 3-4 minutos más. El centro debe quedar jugoso (no seco). Es el plato nacional de España.', en: 'THE FLIP: place plate on top, flip with one firm motion and slide back. Cook 3-4 more minutes. Center should be juicy (not dry). Spain\'s national dish.' }
    ],
    nutrition: { calories: 380, protein: '16g', carbs: '32g', fat: '22g', fiber: '3g' }
  },
  'patatas bravas': {
    ingredients: [
      { es: '1 kg de patatas en cubos de 3cm', en: '1 kg potatoes in 3cm cubes' },
      { es: 'Aceite de oliva para freír', en: 'Olive oil for frying' },
      { es: 'Salsa brava: 2 cdas pimentón picante, 1 cda harina, caldo, tabasco', en: 'Brava sauce: 2 tbsp hot paprika, 1 tbsp flour, broth, tabasco' },
      { es: 'Alioli: 4 dientes de ajo + 200ml aceite oliva emulsionado', en: 'Alioli: 4 garlic cloves + 200ml olive oil emulsified' },
      { es: 'Sal gruesa', en: 'Coarse salt' }
    ],
    steps: [
      { es: 'Hierve las patatas en agua con sal 8 minutos (precocidas pero firmes). Escurre y seca bien.', en: 'Boil potatoes in salted water 8 minutes (pre-cooked but firm). Drain and dry well.' },
      { es: 'Fríe en aceite de oliva abundante a 180°C hasta que estén doradas y crujientes (7-8 min). Escurre sobre papel.', en: 'Fry in generous olive oil at 180°C until golden and crispy (7-8 min). Drain on paper.' },
      { es: 'Para la salsa brava: fríe pimentón picante en aceite 30 seg, agrega harina, luego caldo. Cocina 5 min hasta espesar.', en: 'For brava sauce: fry hot paprika in oil 30 sec, add flour, then broth. Cook 5 min until thick.' },
      { es: 'Sirve las patatas en una cazuela de barro con salsa brava por encima y alioli al lado. Son la tapa más popular de España.', en: 'Serve potatoes in a clay dish with brava sauce on top and alioli on side. Spain\'s most popular tapa.' }
    ],
    nutrition: { calories: 380, protein: '6g', carbs: '42g', fat: '22g', fiber: '4g' }
  },
  'gambas al ajillo': {
    ingredients: [
      { es: '500g de gambas (camarones) con cáscara', en: '500g prawns (shrimp) with shell' },
      { es: '8 dientes de ajo laminados', en: '8 garlic cloves, sliced' },
      { es: '2 chiles guindilla secos', en: '2 dried guindilla chiles' },
      { es: '150ml de aceite de oliva virgen extra', en: '150ml extra virgin olive oil' },
      { es: 'Perejil fresco picado', en: 'Fresh parsley, chopped' },
      { es: 'Pan crujiente para mojar', en: 'Crusty bread for dipping' }
    ],
    steps: [
      { es: 'Pela las gambas dejando la cola. Calienta el aceite en una cazuela de barro a fuego medio.', en: 'Peel prawns leaving tails. Heat oil in a clay dish over medium heat.' },
      { es: 'Cuando el aceite esté caliente (no hirviendo), agrega los ajos laminados y la guindilla. Cocina 1 minuto hasta que el ajo APENAS empiece a dorarse.', en: 'When oil is hot (not boiling), add sliced garlic and guindilla. Cook 1 minute until garlic JUST begins to turn golden.' },
      { es: 'Sube el fuego y agrega las gambas. Cocina 2 minutos por lado. Deben estar rosadas y chisporrotear en el aceite. Espolvorea perejil y retira del fuego.', en: 'Raise heat and add prawns. Cook 2 minutes per side. Should be pink and sizzle in oil. Sprinkle parsley and remove from heat.' },
      { es: 'Sirve inmediatamente en la misma cazuela burbujante con pan crujiente para mojar en el aceite con ajo. Se come RÁPIDO y CALIENTE.', en: 'Serve immediately in same bubbling clay dish with crusty bread for dipping in garlic oil. Eat FAST and HOT.' }
    ],
    nutrition: { calories: 380, protein: '28g', carbs: '4g', fat: '30g', fiber: '0g' }
  },
  'crema catalana': {
    ingredients: [
      { es: '6 yemas de huevo', en: '6 egg yolks' },
      { es: '500ml de leche entera', en: '500ml whole milk' },
      { es: '120g de azúcar + extra para quemar', en: '120g sugar + extra for brûlée' },
      { es: '20g de maicena', en: '20g cornstarch' },
      { es: '1 raja de canela y cáscara de 1 limón', en: '1 cinnamon stick and peel of 1 lemon' },
      { es: '1 pizca de vainilla', en: '1 pinch of vanilla' }
    ],
    steps: [
      { es: 'Calienta la leche con la canela y cáscara de limón 10 minutos a fuego bajo. Deja infusionar 30 min. Cuela.', en: 'Heat milk with cinnamon and lemon peel 10 minutes on low. Let infuse 30 min. Strain.' },
      { es: 'Bate las yemas con el azúcar y la maicena hasta que estén pálidas. Vierte la leche tibia poco a poco batiendo.', en: 'Beat yolks with sugar and cornstarch until pale. Pour warm milk gradually while beating.' },
      { es: 'Cocina a fuego bajo revolviendo constantemente con una cuchara de madera 8-10 minutos hasta que espese y cubra el dorso de la cuchara. NO debe hervir.', en: 'Cook on low stirring constantly with wooden spoon 8-10 minutes until thick and coats back of spoon. Must NOT boil.' },
      { es: 'Vierte en cazuelitas individuales. Refrigera mínimo 4 horas. Al servir, espolvorea azúcar y quema con un soplete hasta formar una costra crujiente de caramelo.', en: 'Pour into individual clay dishes. Refrigerate at least 4 hours. To serve, sprinkle sugar and torch until forming a crunchy caramel crust.' }
    ],
    nutrition: { calories: 280, protein: '8g', carbs: '32g', fat: '14g', fiber: '0g' }
  },
  'bacalao.*pil': {
    ingredients: [
      { es: '4 lomos de bacalao desalado (remojado 48h)', en: '4 desalted cod loins (soaked 48h)' },
      { es: '200ml de aceite de oliva virgen extra', en: '200ml extra virgin olive oil' },
      { es: '6 dientes de ajo laminados', en: '6 garlic cloves, sliced' },
      { es: '1 chile guindilla seco', en: '1 dried guindilla chile' },
      { es: 'Perejil fresco', en: 'Fresh parsley' }
    ],
    steps: [
      { es: 'Calienta el aceite a fuego bajo. Agrega ajos y guindilla. Cocina 3 minutos sin dorar (el aceite debe perfumarse).', en: 'Heat oil on low. Add garlic and guindilla. Cook 3 minutes without browning (oil should become fragrant).' },
      { es: 'Coloca los lomos de bacalao con la piel hacia arriba. Cocina a fuego MUY bajo 15-20 minutos moviendo la cazuela en círculos para que la gelatina del bacalao emulsione con el aceite.', en: 'Place cod loins skin-side up. Cook on VERY low heat 15-20 minutes moving pot in circles so cod\'s gelatin emulsifies with oil.' },
      { es: 'La salsa pil-pil se forma sola: una emulsión verdosa-dorada. Si no liga, retira el bacalao y bate el aceite con una cucharada de agua fría.', en: 'Pil-pil sauce forms by itself: a greenish-golden emulsion. If it doesn\'t come together, remove cod and whisk oil with a spoonful of cold water.' },
      { es: 'Sirve el bacalao bañado en la salsa pil-pil con perejil. Es el plato más técnico y elegante de la cocina vasca.', en: 'Serve cod bathed in pil-pil sauce with parsley. The most technical and elegant Basque dish.' }
    ],
    nutrition: { calories: 420, protein: '35g', carbs: '2g', fat: '32g', fiber: '0g' }
  },
  'escalivada': {
    ingredients: [
      { es: '3 berenjenas', en: '3 eggplants' },
      { es: '3 pimientos rojos', en: '3 red peppers' },
      { es: '3 cebollas grandes', en: '3 large onions' },
      { es: '6 jitomates maduros', en: '6 ripe tomatoes' },
      { es: 'Aceite de oliva virgen extra, sal en escamas', en: 'Extra virgin olive oil, flaky salt' },
      { es: 'Anchoas en aceite (opcional)', en: 'Anchovies in oil (optional)' }
    ],
    steps: [
      { es: 'Hornea TODAS las verduras enteras a 200°C: berenjenas y pimientos 45 min, cebollas 1 hora, jitomates 30 min. No las peles ni cortes antes.', en: 'Roast ALL vegetables whole at 200°C: eggplants and peppers 45 min, onions 1 hour, tomatoes 30 min. Don\'t peel or cut before.' },
      { es: 'Saca las verduras y cúbrelas con un trapo húmedo 15 minutos. Pela con los dedos (la piel se desprenderá sola) y corta en tiras largas.', en: 'Remove vegetables and cover with damp cloth 15 minutes. Peel with fingers (skin will come off easily) and cut into long strips.' },
      { es: 'Dispón las tiras en un plato alternando colores. Rocía generosamente con aceite de oliva y sal en escamas. Sirve a temperatura ambiente con anchoas encima si deseas.', en: 'Arrange strips on plate alternating colors. Drizzle generously with olive oil and flaky salt. Serve at room temperature with anchovies on top if desired.' }
    ],
    nutrition: { calories: 180, protein: '4g', carbs: '22g', fat: '10g', fiber: '6g' }
  },
  'arroz negro': {
    ingredients: [
      { es: '400g de calamares limpios, en aros y tentáculos', en: '400g cleaned squid, in rings and tentacles' },
      { es: '300g de arroz bomba', en: '300g bomba rice' },
      { es: '4 sobres de tinta de calamar', en: '4 sachets squid ink' },
      { es: '1L de caldo de pescado', en: '1L fish broth' },
      { es: '1 cebolla y 3 dientes de ajo picados', en: '1 onion and 3 garlic cloves, chopped' },
      { es: '200g de jitomate rallado', en: '200g grated tomato' },
      { es: 'Alioli casero para servir', en: 'Homemade alioli for serving' }
    ],
    steps: [
      { es: 'Sofríe cebolla y ajo en aceite de oliva 5 min. Agrega jitomate rallado y cocina 8 min. Saltea los calamares 2 min a fuego alto.', en: 'Sauté onion and garlic in olive oil 5 min. Add grated tomato and cook 8 min. Stir-fry squid 2 min on high heat.' },
      { es: 'Agrega el arroz y sofríe 2 min. Disuelve la tinta de calamar en el caldo caliente y viértelo. El arroz se teñirá negro intenso.', en: 'Add rice and sauté 2 min. Dissolve squid ink in hot broth and pour in. Rice will turn intense black.' },
      { es: 'Cocina a fuego medio 18-20 minutos sin revolver. El arroz debe quedar suelto con un fondo ligeramente caramelizado (socarrat).', en: 'Cook on medium heat 18-20 minutes without stirring. Rice should be loose with slightly caramelized bottom (socarrat).' },
      { es: 'Sirve con una cucharada generosa de alioli casero encima. El contraste del blanco del alioli sobre el negro del arroz es icónico.', en: 'Serve with a generous spoonful of homemade alioli on top. The contrast of white alioli over black rice is iconic.' }
    ],
    nutrition: { calories: 420, protein: '22g', carbs: '55g', fat: '12g', fiber: '2g' }
  },
  'calamares.*romana': {
    ingredients: [
      { es: '500g de calamares limpios, en aros de 1cm', en: '500g cleaned squid, in 1cm rings' },
      { es: '1 taza de harina de trigo', en: '1 cup wheat flour' },
      { es: 'Aceite de oliva suave para freír', en: 'Mild olive oil for frying' },
      { es: 'Limones en gajos y sal', en: 'Lemon wedges and salt' }
    ],
    steps: [
      { es: 'Seca los aros de calamar con papel absorbente. Es CRUCIAL que estén secos para que queden crujientes.', en: 'Pat squid rings dry with paper towels. It is CRUCIAL they are dry for crispiness.' },
      { es: 'Enharina los aros sacudiendo bien el exceso. En España, la simplicidad es la clave: solo harina, nada de huevo ni pan rallado.', en: 'Flour the rings shaking off excess well. In Spain, simplicity is key: just flour, no egg or breadcrumbs.' },
      { es: 'Fríe en aceite de oliva a 190°C en tandas pequeñas (no sobrecargues la sartén) durante 2-3 minutos hasta que estén dorados y crujientes.', en: 'Fry in olive oil at 190°C in small batches (don\'t overcrowd pan) for 2-3 minutes until golden and crispy.' },
      { es: 'Escurre, sala inmediatamente y sirve con gajos de limón. Se comen recién hechos, NUNCA recalentados.', en: 'Drain, salt immediately and serve with lemon wedges. Eaten freshly made, NEVER reheated.' }
    ],
    nutrition: { calories: 320, protein: '22g', carbs: '25g', fat: '14g', fiber: '1g' }
  },
  'salmorejo': {
    ingredients: [
      { es: '1 kg de jitomates maduros', en: '1 kg ripe tomatoes' },
      { es: '200g de pan del día anterior (tipo telera)', en: '200g day-old bread (country style)' },
      { es: '100ml de aceite de oliva virgen extra', en: '100ml extra virgin olive oil' },
      { es: '1 diente de ajo', en: '1 garlic clove' },
      { es: 'Jamón serrano picado y huevo duro para decorar', en: 'Diced serrano ham and hard-boiled egg for garnish' }
    ],
    steps: [
      { es: 'Remoja el pan en agua fría 10 minutos. Exprime bien. Corta los jitomates en trozos.', en: 'Soak bread in cold water 10 minutes. Squeeze well. Cut tomatoes in pieces.' },
      { es: 'Licúa jitomates, pan, ajo y sal hasta obtener una crema completamente lisa. Vierte el aceite en hilo fino con la licuadora encendida hasta emulsionar.', en: 'Blend tomatoes, bread, garlic and salt until completely smooth cream. Pour oil in thin stream with blender running until emulsified.' },
      { es: 'Refrigera mínimo 2 horas. Sirve muy frío en tazones, decorado con jamón serrano picado y huevo duro rallado. Es el primo espeso de la gazpacho, típico de Córdoba.', en: 'Refrigerate at least 2 hours. Serve very cold in bowls, garnished with diced serrano ham and grated hard-boiled egg. The thick cousin of gazpacho, typical of Córdoba.' }
    ],
    nutrition: { calories: 280, protein: '8g', carbs: '28g', fat: '16g', fiber: '3g' }
  },
  'pimientos de padr': {
    ingredients: [
      { es: '400g de pimientos de Padrón', en: '400g Padrón peppers' },
      { es: 'Aceite de oliva para freír', en: 'Olive oil for frying' },
      { es: 'Sal gruesa de mar (sal Maldon ideal)', en: 'Coarse sea salt (Maldon salt ideal)' }
    ],
    steps: [
      { es: 'Lava y seca completamente los pimientos. La humedad hará que el aceite salpique.', en: 'Wash and completely dry peppers. Moisture will make oil splatter.' },
      { es: 'Calienta aceite de oliva abundante en un sartén a fuego alto. Cuando humee, fríe los pimientos 2-3 minutos volteando hasta que la piel se ampolle y chamusque.', en: 'Heat generous olive oil in skillet over high heat. When smoking, fry peppers 2-3 minutes turning until skin blisters and chars.' },
      { es: 'Escurre y espolvorea inmediatamente con sal gruesa. Sirve calientes. El dicho español dice: "Los pimientos de Padrón, unos pican y otros no" — es la lotería de cada bocado.', en: 'Drain and immediately sprinkle with coarse salt. Serve hot. Spanish saying: "Padrón peppers, some are hot and some are not" — it\'s the lottery of each bite.' }
    ],
    nutrition: { calories: 120, protein: '2g', carbs: '8g', fat: '10g', fiber: '2g' }
  },

  // ═══ FRANCIA ═══
  'cr.*me br.*l': {
    ingredients: [
      { es: '500ml de crema para batir (heavy cream)', en: '500ml heavy cream' },
      { es: '5 yemas de huevo', en: '5 egg yolks' },
      { es: '80g de azúcar + extra para caramelizar', en: '80g sugar + extra for caramelizing' },
      { es: '1 vaina de vainilla (abierta y raspada)', en: '1 vanilla bean (split and scraped)' }
    ],
    steps: [
      { es: 'Calienta la crema con la vainilla (vaina + semillas) hasta que hierva. Retira del fuego y reposa 15 min.', en: 'Heat cream with vanilla (pod + seeds) until it boils. Remove from heat and rest 15 min.' },
      { es: 'Bate yemas con azúcar hasta pálidas. Vierte crema en hilo fino batiendo. Cuela. Reparte en ramequines.', en: 'Beat yolks with sugar until pale. Pour cream in thin stream while beating. Strain. Divide into ramekins.' },
      { es: 'Hornea a baño maría a 150°C 40-45 minutos. El centro debe temblar como gelatina. Refrigera 4 horas.', en: 'Bake in water bath at 150°C 40-45 minutes. Center should wobble like gelatin. Refrigerate 4 hours.' },
      { es: 'Espolvorea una capa fina y uniforme de azúcar. Quema con soplete hasta caramelo crujiente ámbar. Espera 1 minuto antes de romperlo con la cuchara.', en: 'Sprinkle a thin, even sugar layer. Torch until crispy amber caramel. Wait 1 minute before cracking with spoon.' }
    ],
    nutrition: { calories: 420, protein: '6g', carbs: '28g', fat: '34g', fiber: '0g' }
  },
  'coquilles saint': {
    ingredients: [
      { es: '12 vieiras grandes frescas (con sus conchas si es posible)', en: '12 large fresh scallops (with shells if possible)' },
      { es: '200ml de vino blanco seco', en: '200ml dry white wine' },
      { es: '200ml de crema', en: '200ml cream' },
      { es: '2 chalotas picadas', en: '2 shallots, chopped' },
      { es: '100g de queso gruyère rallado', en: '100g grated Gruyère cheese' },
      { es: '30g de mantequilla y 30g de harina', en: '30g butter and 30g flour' },
      { es: 'Puré de patata para la base y borde', en: 'Mashed potato for base and border' }
    ],
    steps: [
      { es: 'Pocha las vieiras en vino blanco con chalotas 3 minutos. Retira las vieiras y reduce el líquido a la mitad.', en: 'Poach scallops in white wine with shallots 3 minutes. Remove scallops and reduce liquid by half.' },
      { es: 'Prepara una salsa: roux de mantequilla y harina, agrega el líquido reducido y la crema. Cocina hasta espesar.', en: 'Prepare sauce: butter and flour roux, add reduced liquid and cream. Cook until thick.' },
      { es: 'Pon puré de patata como base en cada concha. Coloca 2 vieiras, cubre con salsa y gruyère. Haz un borde de puré con manga.', en: 'Put mashed potato as base in each shell. Place 2 scallops, cover with sauce and Gruyère. Pipe a potato border.' },
      { es: 'Gratina bajo el broiler 5 minutos hasta que el queso burbujee y se dore. Sirve en las conchas sobre sal gruesa para estabilizarlas.', en: 'Broil 5 minutes until cheese bubbles and browns. Serve in shells over coarse salt to stabilize them.' }
    ],
    nutrition: { calories: 380, protein: '24g', carbs: '18g', fat: '24g', fiber: '1g' }
  },
  'tarte tatin': {
    ingredients: [
      { es: '6 manzanas (tipo Golden), peladas y en mitades', en: '6 apples (Golden type), peeled and halved' },
      { es: '1 disco de masa de hojaldre', en: '1 puff pastry disc' },
      { es: '100g de mantequilla', en: '100g butter' },
      { es: '150g de azúcar', en: '150g sugar' },
      { es: 'Crème fraîche o helado de vainilla para servir', en: 'Crème fraîche or vanilla ice cream for serving' }
    ],
    steps: [
      { es: 'Derrite mantequilla y azúcar en un sartén de hierro apto para horno a fuego medio. Cocina sin revolver hasta obtener un caramelo dorado oscuro (8-10 min).', en: 'Melt butter and sugar in an oven-safe cast iron skillet over medium heat. Cook without stirring until dark golden caramel (8-10 min).' },
      { es: 'Acomoda las mitades de manzana en el caramelo con la parte redonda hacia abajo, apretadas. Cocina 10 minutos más a fuego bajo.', en: 'Arrange apple halves in caramel rounded-side down, tightly packed. Cook 10 more minutes on low heat.' },
      { es: 'Cubre con el disco de hojaldre, metiendo los bordes dentro del sartén alrededor de las manzanas. Hornea a 200°C 25-30 minutos.', en: 'Cover with puff pastry disc, tucking edges inside skillet around apples. Bake at 200°C 25-30 minutes.' },
      { es: 'Deja reposar 5 minutos. Coloca un plato encima y voltea de un movimiento firme. La tarta aparecerá con las manzanas caramelizadas arriba. Sirve con crème fraîche.', en: 'Rest 5 minutes. Place plate on top and flip with one firm motion. Tart will appear with caramelized apples on top. Serve with crème fraîche.' }
    ],
    nutrition: { calories: 380, protein: '4g', carbs: '52g', fat: '18g', fiber: '3g' }
  },
  'cr.*pes suzette': {
    ingredients: [
      { es: 'Crêpes: 200g harina, 3 huevos, 500ml leche, 30g mantequilla derretida', en: 'Crêpes: 200g flour, 3 eggs, 500ml milk, 30g melted butter' },
      { es: '100g de mantequilla', en: '100g butter' },
      { es: '100g de azúcar', en: '100g sugar' },
      { es: 'Jugo y ralladura de 2 naranjas', en: 'Juice and zest of 2 oranges' },
      { es: '60ml de Grand Marnier o Cointreau', en: '60ml Grand Marnier or Cointreau' }
    ],
    steps: [
      { es: 'Prepara las crêpes: mezcla harina, huevos, leche y mantequilla. Reposa 30 min. Cocina crêpes delgadas en sartén engrasada 1 min por lado.', en: 'Prepare crêpes: mix flour, eggs, milk and butter. Rest 30 min. Cook thin crêpes in greased pan 1 min per side.' },
      { es: 'Para la salsa: carameliza el azúcar en un sartén ancho. Agrega mantequilla, jugo y ralladura de naranja. Cocina hasta que burbujee.', en: 'For sauce: caramelize sugar in wide skillet. Add butter, orange juice and zest. Cook until bubbling.' },
      { es: 'Dobla cada crêpe en cuartos y sumérgela en la salsa de naranja, volteando para empapar ambos lados.', en: 'Fold each crêpe into quarters and submerge in orange sauce, turning to soak both sides.' },
      { es: 'El flambeado: vierte Grand Marnier caliente y enciende con un fósforo largo. Las llamas son espectaculares. Agita hasta que se apaguen. Sirve 2-3 crêpes bañadas en salsa.', en: 'The flambé: pour warm Grand Marnier and ignite with a long match. Flames are spectacular. Swirl until extinguished. Serve 2-3 crêpes bathed in sauce.' }
    ],
    nutrition: { calories: 420, protein: '8g', carbs: '48g', fat: '20g', fiber: '1g' }
  },
  'ratatouille': {
    ingredients: [
      { es: '2 berenjenas en rodajas de 3mm', en: '2 eggplants sliced 3mm' },
      { es: '2 calabacines en rodajas de 3mm', en: '2 zucchini sliced 3mm' },
      { es: '4 jitomates en rodajas de 3mm', en: '4 tomatoes sliced 3mm' },
      { es: '1 pimiento rojo y 1 amarillo', en: '1 red and 1 yellow pepper' },
      { es: '1 cebolla y 4 dientes de ajo', en: '1 onion and 4 garlic cloves' },
      { es: '400g de salsa de tomate', en: '400g tomato sauce' },
      { es: 'Aceite de oliva, tomillo, romero y albahaca', en: 'Olive oil, thyme, rosemary and basil' }
    ],
    steps: [
      { es: 'Prepara la base: sofríe cebolla, pimientos y ajo 10 min. Agrega la salsa de tomate y sazona. Vierte en un refractario redondo.', en: 'Prepare base: sauté onion, peppers and garlic 10 min. Add tomato sauce and season. Pour into round baking dish.' },
      { es: 'Alterna rodajas de berenjena, calabacín y jitomate en espiral sobre la base, siguiendo el patrón del ratatouille de la película (tian provençal).', en: 'Alternate eggplant, zucchini and tomato slices in spiral over base, following the movie ratatouille pattern (tian provençal).' },
      { es: 'Rocía con aceite de oliva, agrega tomillo y romero. Cubre con aluminio y hornea a 190°C 45 minutos. Destapa y hornea 15 más.', en: 'Drizzle with olive oil, add thyme and rosemary. Cover with foil and bake at 190°C 45 minutes. Uncover and bake 15 more.' },
      { es: 'Sirve caliente con albahaca fresca. Puede acompañar carne o comerse solo con pan crujiente.', en: 'Serve hot with fresh basil. Can accompany meat or be eaten alone with crusty bread.' }
    ],
    nutrition: { calories: 180, protein: '4g', carbs: '22g', fat: '10g', fiber: '6g' }
  },
  'bouillabaisse': {
    ingredients: [
      { es: '1 kg de pescados variados (rape, lubina, dorada) en trozos', en: '1 kg assorted fish (monkfish, sea bass, bream) in chunks' },
      { es: '500g de mariscos (mejillones, camarones, calamares)', en: '500g shellfish (mussels, shrimp, squid)' },
      { es: '2 fenouils (bulbos de hinojo), 2 puerros, 4 jitomates', en: '2 fennel bulbs, 2 leeks, 4 tomatoes' },
      { es: '1 cucharada de pasta de tomate', en: '1 tablespoon tomato paste' },
      { es: '½ cucharadita de azafrán y 1 tira de cáscara de naranja', en: '½ teaspoon saffron and 1 strip orange peel' },
      { es: '2 cucharadas de Pernod (anís)', en: '2 tablespoons Pernod (anise)' },
      { es: 'Rouille (mayonesa con ajo y azafrán) y croûtons', en: 'Rouille (garlic and saffron mayo) and croûtons' }
    ],
    steps: [
      { es: 'Sofríe hinojo, puerro y jitomate en aceite de oliva 10 min. Agrega pasta de tomate, azafrán y cáscara de naranja. Vierte 1.5L de caldo de pescado.', en: 'Sauté fennel, leek and tomato in olive oil 10 min. Add tomato paste, saffron and orange peel. Pour 1.5L fish broth.' },
      { es: 'Hierve 15 minutos. Agrega primero los pescados más firmes (rape), luego los suaves. Los mariscos al final (3 min). Flamea con Pernod.', en: 'Boil 15 minutes. Add firmest fish first (monkfish), then softer ones. Shellfish last (3 min). Flambé with Pernod.' },
      { es: 'Sirve el caldo en un tazón con croûtons untados con rouille. El pescado y los mariscos se presentan en un platón aparte. Se combinan al comer.', en: 'Serve broth in bowl with rouille-spread croûtons. Fish and shellfish presented on separate platter. Combined when eating.' }
    ],
    nutrition: { calories: 420, protein: '42g', carbs: '18g', fat: '20g', fiber: '3g' }
  }
};

async function fixBatch() {
  console.log('🌍 BATCH 8A: Japón, México, España, Francia\n');
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
    console.log(`\n🎉 Batch 8A completado: ${fixed} recetas corregidas`);
  } catch (error) { console.error('❌ Error:', error); }
  finally { if (conn) conn.release(); pool.end(); }
}
fixBatch();
