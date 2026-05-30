import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const fixes = {
  // ═══════════ ESPAÑA 🇪🇸 ═══════════
  'fabada': {
    ingredients: [
      { es: '500g de fabes de la Granja (judías blancas), remojadas 12h', en: '500g fabes de la Granja (white beans), soaked 12h' },
      { es: '200g de chorizo asturiano', en: '200g Asturian chorizo' },
      { es: '200g de morcilla asturiana', en: '200g Asturian blood sausage' },
      { es: '150g de tocino o lacón', en: '150g bacon or lacón' },
      { es: '1 cebolla entera', en: '1 whole onion' },
      { es: '2 dientes de ajo', en: '2 garlic cloves' },
      { es: '1 pizca de azafrán', en: '1 pinch saffron' },
      { es: '1 hoja de laurel', en: '1 bay leaf' },
      { es: 'Sal al gusto', en: 'Salt to taste' }
    ],
    steps: [
      { es: 'Remoja las fabes en agua fría durante 12 horas. Escurre y coloca en una olla grande cubiertas con agua fría (3 dedos por encima).', en: 'Soak fabes in cold water for 12 hours. Drain and place in a large pot covered with cold water (3 fingers above).' },
      { es: 'Agrega el chorizo, morcilla, tocino, cebolla, ajo, laurel y azafrán. Lleva a ebullición y "asusta" las fabes añadiendo un vaso de agua fría.', en: 'Add chorizo, blood sausage, bacon, onion, garlic, bay leaf and saffron. Bring to boil and "scare" fabes by adding a glass of cold water.' },
      { es: 'Cocina a fuego MUY bajo durante 2-3 horas. Las fabes deben burbujear apenas. Agita la olla con movimientos circulares (nunca revuelvas con cuchara, romperías las fabes).', en: 'Cook on VERY low heat for 2-3 hours. Fabes should barely bubble. Shake pot with circular movements (never stir with spoon, you\'d break the fabes).' },
      { es: 'Las fabes están listas cuando estén cremosas y el caldo espeso. Rectifica sal. Deja reposar 30 minutos antes de servir; como todos los guisos, mejora con el reposo.', en: 'Fabes are ready when creamy and broth thick. Adjust salt. Rest 30 minutes before serving; like all stews, improves with resting.' }
    ],
    nutrition: { calories: 620, protein: '35g', carbs: '42g', fat: '34g', fiber: '12g' }
  },

  'cocido madrile': {
    ingredients: [
      { es: '300g de garbanzos, remojados toda la noche', en: '300g chickpeas, soaked overnight' },
      { es: '300g de jarrete de ternera', en: '300g veal shank' },
      { es: '200g de tocino ibérico', en: '200g Iberian bacon' },
      { es: '1 hueso de tuétano (caña)', en: '1 marrow bone' },
      { es: '2 chorizos', en: '2 chorizos' },
      { es: '1 morcilla de cebolla', en: '1 onion blood sausage' },
      { es: '3 patatas medianas, peladas y en trozos', en: '3 medium potatoes, peeled and in chunks' },
      { es: '½ repollo pequeño', en: '½ small cabbage' },
      { es: '2 zanahorias', en: '2 carrots' },
      { es: '100g de fideos finos (para la sopa)', en: '100g thin vermicelli (for soup)' },
      { es: 'Sal al gusto', en: 'Salt to taste' }
    ],
    steps: [
      { es: 'Pon los garbanzos remojados, la carne, hueso y tocino en una olla grande con agua fría. Lleva a ebullición, espuma y baja el fuego. Cocina 1.5 horas.', en: 'Place soaked chickpeas, meat, bone and bacon in a large pot with cold water. Bring to boil, skim and lower heat. Cook 1.5 hours.' },
      { es: 'Agrega el chorizo, morcilla, patatas, zanahoria y repollo. Cocina 30-40 minutos más hasta que todo esté tierno.', en: 'Add chorizo, blood sausage, potatoes, carrot and cabbage. Cook 30-40 more minutes until everything is tender.' },
      { es: 'Cuela el caldo y cuece los fideos en él durante 3 minutos. Este es el "primer vuelco": la sopa de fideos.', en: 'Strain broth and cook vermicelli in it for 3 minutes. This is the "first course": the noodle soup.' },
      { es: 'El "segundo vuelco" son los garbanzos con las verduras. El "tercer vuelco" son las carnes cortadas y embutidos. Se sirven los tres platos en orden, de forma tradicional madrileña.', en: 'The "second course" is chickpeas with vegetables. The "third course" is sliced meats and sausages. All three courses are served in order, traditional Madrid-style.' }
    ],
    nutrition: { calories: 680, protein: '42g', carbs: '52g', fat: '32g', fiber: '10g' }
  },

  'cochinillo': {
    ingredients: [
      { es: '1 cochinillo de 4-5 kg, limpio y abierto por la mitad', en: '1 suckling pig 4-5 kg, cleaned and halved' },
      { es: '4 dientes de ajo', en: '4 garlic cloves' },
      { es: '100ml de manteca de cerdo derretida', en: '100ml melted lard' },
      { es: '1 ramita de tomillo y romero', en: '1 sprig thyme and rosemary' },
      { es: '1 vaso de agua', en: '1 glass of water' },
      { es: 'Sal gruesa de mar', en: 'Coarse sea salt' }
    ],
    steps: [
      { es: 'Precalienta el horno a 180°C. Frota el cochinillo por todos lados con ajo machacado, sal gruesa y manteca derretida.', en: 'Preheat oven to 180°C. Rub suckling pig all over with crushed garlic, coarse salt and melted lard.' },
      { es: 'Coloca el cochinillo con la piel hacia abajo en una bandeja de barro con el vaso de agua y las hierbas. Hornea 1 hora.', en: 'Place pig skin-side down in a clay roasting dish with glass of water and herbs. Roast 1 hour.' },
      { es: 'Voltea el cochinillo con la piel hacia arriba. Pinta con manteca derretida. Sube el horno a 220°C y hornea 30-40 minutos más hasta que la piel esté crujiente, dorada y se rompa al tocarla.', en: 'Flip pig skin-side up. Brush with melted lard. Raise oven to 220°C and roast 30-40 more minutes until skin is crispy, golden and cracks when touched.' },
      { es: 'En Segovia, el cochinillo se corta con el borde de un plato de cerámica (para demostrar su ternura) y luego se rompe el plato. Sirve con ensalada verde.', en: 'In Segovia, suckling pig is carved with the edge of a ceramic plate (to demonstrate its tenderness) and then the plate is smashed. Serve with green salad.' }
    ],
    nutrition: { calories: 450, protein: '38g', carbs: '0g', fat: '32g', fiber: '0g' }
  },

  'cordero asado': {
    ingredients: [
      { es: '1.5 kg de pierna o paletilla de cordero lechal', en: '1.5 kg leg or shoulder of suckling lamb' },
      { es: '4 dientes de ajo, laminados', en: '4 garlic cloves, sliced' },
      { es: '1 vaso de vino blanco', en: '1 glass white wine' },
      { es: '1 vaso de agua', en: '1 glass of water' },
      { es: '100g de manteca de cerdo', en: '100g lard' },
      { es: 'Romero y tomillo frescos', en: 'Fresh rosemary and thyme' },
      { es: 'Sal gruesa', en: 'Coarse salt' }
    ],
    steps: [
      { es: 'Precalienta el horno a 200°C. Haz incisiones en la carne e introduce láminas de ajo y ramitas de romero.', en: 'Preheat oven to 200°C. Make incisions in meat and insert garlic slices and rosemary sprigs.' },
      { es: 'Sazona generosamente con sal gruesa. Unta con manteca. Coloca en una cazuela de barro con el agua y el vino.', en: 'Season generously with coarse salt. Rub with lard. Place in clay pot with water and wine.' },
      { es: 'Hornea 30 minutos a 200°C, luego baja a 170°C y cocina 1.5 horas más, rociando con los jugos cada 20 minutos.', en: 'Roast 30 minutes at 200°C, then lower to 170°C and cook 1.5 more hours, basting with juices every 20 minutes.' },
      { es: 'Sube a 220°C los últimos 15 minutos para dorar la piel. El cordero está listo cuando se separa del hueso sin esfuerzo.', en: 'Raise to 220°C the last 15 minutes to brown the skin. Lamb is ready when it separates from bone effortlessly.' },
      { es: 'Deja reposar 10 minutos cubierto con aluminio. Sirve con las patatas asadas en los jugos del cordero y ensalada.', en: 'Rest 10 minutes covered with foil. Serve with potatoes roasted in lamb juices and salad.' }
    ],
    nutrition: { calories: 520, protein: '45g', carbs: '2g', fat: '36g', fiber: '0g' }
  },

  'croquetas de jam': {
    ingredients: [
      { es: '150g de jamón ibérico picado muy fino', en: '150g finely chopped Iberian ham' },
      { es: '75g de mantequilla', en: '75g butter' },
      { es: '75g de harina', en: '75g flour' },
      { es: '500ml de leche entera', en: '500ml whole milk' },
      { es: 'Nuez moscada rallada', en: 'Grated nutmeg' },
      { es: '2 huevos batidos (para empanizar)', en: '2 beaten eggs (for breading)' },
      { es: 'Pan rallado fino', en: 'Fine breadcrumbs' },
      { es: 'Aceite de oliva suave para freír', en: 'Mild olive oil for frying' }
    ],
    steps: [
      { es: 'Prepara la bechamel: derrite la mantequilla, agrega la harina y cocina 2 minutos revolviendo (roux). Vierte la leche en 3 tandas, batiendo sin parar entre cada adición. Cocina 10 minutos hasta espesar mucho.', en: 'Prepare béchamel: melt butter, add flour and cook 2 minutes stirring (roux). Pour milk in 3 additions, whisking non-stop between each. Cook 10 minutes until very thick.' },
      { es: 'Incorpora el jamón ibérico y la nuez moscada. La masa debe ser muy espesa y despegarse de las paredes. Vierte en un plato, cubre con film en contacto y refrigera mínimo 4 horas.', en: 'Add Iberian ham and nutmeg. Dough should be very thick and pull away from walls. Pour onto a plate, cover with contact film and refrigerate at least 4 hours.' },
      { es: 'Con las manos ligeramente engrasadas, forma cilindros de 5cm. Pasa por harina, huevo batido y pan rallado. Refrigera 30 minutos más.', en: 'With lightly greased hands, form 5cm cylinders. Coat in flour, beaten egg and breadcrumbs. Refrigerate 30 more minutes.' },
      { es: 'Fríe en aceite a 180°C durante 2-3 minutos hasta que estén doradas uniformemente. Escurre y sirve calientes. El interior debe ser cremoso y fluido.', en: 'Fry in 180°C oil for 2-3 minutes until evenly golden. Drain and serve hot. Interior should be creamy and fluid.' }
    ],
    nutrition: { calories: 280, protein: '12g', carbs: '18g', fat: '18g', fiber: '0g' }
  },

  // ═══════════ FRANCIA 🇫🇷 ═══════════
  'coq au vin': {
    ingredients: [
      { es: '1 pollo entero cortado en 8 piezas', en: '1 whole chicken cut into 8 pieces' },
      { es: '1 botella de vino tinto Borgoña (750ml)', en: '1 bottle Burgundy red wine (750ml)' },
      { es: '200g de champiñones botón, en mitades', en: '200g button mushrooms, halved' },
      { es: '150g de lardons (panceta en cubitos)', en: '150g lardons (diced bacon)' },
      { es: '12 cebollitas perla', en: '12 pearl onions' },
      { es: '2 cucharadas de cognac', en: '2 tablespoons cognac' },
      { es: '2 cucharadas de harina', en: '2 tablespoons flour' },
      { es: '2 cucharadas de mantequilla', en: '2 tablespoons butter' },
      { es: '2 dientes de ajo, bouquet garni (tomillo, laurel, perejil)', en: '2 garlic cloves, bouquet garni (thyme, bay, parsley)' },
      { es: 'Pan crujiente para servir', en: 'Crusty bread for serving' }
    ],
    steps: [
      { es: 'Marina el pollo en el vino tinto con ajo y bouquet garni durante mínimo 4 horas en refrigeración.', en: 'Marinate chicken in red wine with garlic and bouquet garni for at least 4 hours in refrigerator.' },
      { es: 'Retira el pollo de la marinada (resérvalos por separado). Seca bien las piezas. Dora en mantequilla a fuego alto, 4 min por lado. Retira.', en: 'Remove chicken from marinade (reserve separately). Pat pieces dry. Brown in butter over high heat, 4 min per side. Remove.' },
      { es: 'En la misma cacerola, dora los lardons 5 minutos. Agrega las cebollitas perla y champiñones, saltea 5 minutos más. Flamea con cognac.', en: 'In same pot, brown lardons 5 minutes. Add pearl onions and mushrooms, sauté 5 more minutes. Flambé with cognac.' },
      { es: 'Espolvorea harina, revuelve 1 minuto. Vierte toda la marinada de vino. Regresa el pollo, que quede semisumergido. Hierve, baja el fuego, tapa y cocina 1.5 horas.', en: 'Sprinkle flour, stir 1 minute. Pour all wine marinade. Return chicken, semi-submerged. Boil, lower heat, cover and cook 1.5 hours.' },
      { es: 'La salsa debe reducirse a una consistencia sedosa que cubra el dorso de una cuchara. Sirve con pan crujiente para mojar en la salsa.', en: 'Sauce should reduce to a silky consistency that coats the back of a spoon. Serve with crusty bread for dipping in sauce.' }
    ],
    nutrition: { calories: 520, protein: '38g', carbs: '12g', fat: '28g', fiber: '2g' }
  },

  'boeuf bourguignon': {
    ingredients: [
      { es: '1 kg de carne de res para guisar (chuck), en cubos de 5cm', en: '1 kg beef stew meat (chuck), in 5cm cubes' },
      { es: '1 botella de vino tinto Borgoña', en: '1 bottle Burgundy red wine' },
      { es: '200g de lardons (panceta)', en: '200g lardons (bacon)' },
      { es: '200g de champiñones', en: '200g mushrooms' },
      { es: '12 cebollitas perla', en: '12 pearl onions' },
      { es: '2 zanahorias en rodajas gruesas', en: '2 carrots in thick slices' },
      { es: '2 cucharadas de concentrado de tomate', en: '2 tablespoons tomato paste' },
      { es: '2 cucharadas de harina', en: '2 tablespoons flour' },
      { es: '3 cucharadas de mantequilla', en: '3 tablespoons butter' },
      { es: '2 dientes de ajo, bouquet garni', en: '2 garlic cloves, bouquet garni' },
      { es: 'Pan tostado con ajo (croûtons) para servir', en: 'Garlic toast (croûtons) for serving' }
    ],
    steps: [
      { es: 'Marina la carne en el vino con las zanahorias, ajo y bouquet garni toda la noche en refrigeración.', en: 'Marinate meat in wine with carrots, garlic and bouquet garni overnight in refrigerator.' },
      { es: 'Escurre la carne y sécala (el secado es clave para el dorado). Reserva la marinada. Sella los cubos en mantequilla en tandas pequeñas hasta dorar bien por todos los lados. Retira.', en: 'Drain meat and pat dry (drying is key for browning). Reserve marinade. Sear cubes in butter in small batches until well browned on all sides. Remove.' },
      { es: 'Dora los lardons. Agrega concentrado de tomate y harina, revuelve 2 minutos. Vierte toda la marinada de vino. Regresa la carne.', en: 'Brown lardons. Add tomato paste and flour, stir 2 minutes. Pour all wine marinade. Return meat.' },
      { es: 'Tapa y cocina en horno a 160°C durante 2.5-3 horas hasta que la carne se deshaga con un tenedor.', en: 'Cover and cook in oven at 160°C for 2.5-3 hours until meat falls apart with a fork.' },
      { es: 'En los últimos 30 minutos, saltea las cebollitas y champiñones en mantequilla y agrégalos al guiso. Sirve con croûtons.', en: 'In the last 30 minutes, sauté pearl onions and mushrooms in butter and add to stew. Serve with croûtons.' }
    ],
    nutrition: { calories: 580, protein: '42g', carbs: '18g', fat: '32g', fiber: '3g' }
  },

  'confit de canard': {
    ingredients: [
      { es: '4 piernas de pato (muslo + contramuslo)', en: '4 duck legs (thigh + drumstick)' },
      { es: '1 kg de grasa de pato', en: '1 kg duck fat' },
      { es: '4 cucharadas de sal gruesa', en: '4 tablespoons coarse salt' },
      { es: '4 dientes de ajo machacados', en: '4 garlic cloves, crushed' },
      { es: '4 ramitas de tomillo', en: '4 thyme sprigs' },
      { es: '2 hojas de laurel', en: '2 bay leaves' },
      { es: '1 cucharadita de pimienta negra machacada', en: '1 teaspoon crushed black pepper' }
    ],
    steps: [
      { es: 'Frota las piernas de pato con sal gruesa, ajo, tomillo, laurel y pimienta. Coloca en un recipiente, cubre y refrigera 24-48 horas (la cura).', en: 'Rub duck legs with coarse salt, garlic, thyme, bay and pepper. Place in container, cover and refrigerate 24-48 hours (the cure).' },
      { es: 'Enjuaga la sal del pato y seca con papel. Precalienta el horno a 135°C.', en: 'Rinse salt from duck and pat dry. Preheat oven to 135°C.' },
      { es: 'Derrite la grasa de pato y sumerge completamente las piernas. Lleva al horno y cocina 3-4 horas tapado. La carne estará lista cuando un cuchillo penetre sin resistencia.', en: 'Melt duck fat and fully submerge legs. Place in oven and cook 3-4 hours covered. Meat is ready when a knife penetrates without resistance.' },
      { es: 'Para servir, retira del confit y calienta en un sartén a fuego medio-alto con la piel hacia abajo durante 8 minutos hasta que la piel esté extraordinariamente crujiente.', en: 'To serve, remove from confit and heat in a skillet over medium-high skin-side down for 8 minutes until skin is extraordinarily crispy.' },
      { es: 'Sirve con patatas sarladaises (fritas en grasa de pato) y una ensalada de rúcula con vinagreta.', en: 'Serve with pommes sarladaises (fried in duck fat) and arugula salad with vinaigrette.' }
    ],
    nutrition: { calories: 620, protein: '35g', carbs: '0g', fat: '52g', fiber: '0g' }
  },

  'cassoulet': {
    ingredients: [
      { es: '500g de judías blancas (tipo lingot), remojadas 12h', en: '500g white beans (lingot type), soaked 12h' },
      { es: '4 salchichas de Toulouse', en: '4 Toulouse sausages' },
      { es: '4 piezas de confit de pato', en: '4 pieces duck confit' },
      { es: '200g de panceta curada', en: '200g cured bacon' },
      { es: '2 jitomates, pelados y picados', en: '2 tomatoes, peeled and chopped' },
      { es: '1 cebolla picada, 4 dientes de ajo', en: '1 chopped onion, 4 garlic cloves' },
      { es: 'Bouquet garni, pan rallado para la costra', en: 'Bouquet garni, breadcrumbs for crust' },
      { es: 'Grasa de pato', en: 'Duck fat' }
    ],
    steps: [
      { es: 'Cuece las judías con la panceta, cebolla, ajo, jitomates y bouquet garni durante 1 hora a fuego bajo. Deben quedar tiernas pero firmes.', en: 'Cook beans with bacon, onion, garlic, tomatoes and bouquet garni for 1 hour on low heat. Should be tender but firm.' },
      { es: 'Dora las salchichas y el confit de pato en un sartén hasta que estén bien sellados.', en: 'Brown sausages and duck confit in a skillet until well seared.' },
      { es: 'En una cazuela de barro, arma capas: judías, salchichas cortadas, confit de pato. Repite. Vierte el caldo de las judías hasta cubrir. Espolvorea pan rallado y grasa de pato.', en: 'In a clay casserole, build layers: beans, sliced sausages, duck confit. Repeat. Pour bean broth to cover. Sprinkle breadcrumbs and duck fat.' },
      { es: 'Hornea a 150°C durante 2 horas. Cada 30 minutos, rompe la costra de pan rallado que se forma y empújala hacia abajo. Se deben formar y romper al menos 4 costras (tradición del Languedoc).', en: 'Bake at 150°C for 2 hours. Every 30 minutes, break the breadcrumb crust that forms and push it down. At least 4 crusts should form and be broken (Languedoc tradition).' },
      { es: 'La última costra se deja intacta, dorada y crujiente. Deja reposar 15 minutos. Es el plato de confort francés por excelencia.', en: 'The last crust is left intact, golden and crispy. Let rest 15 minutes. The quintessential French comfort dish.' }
    ],
    nutrition: { calories: 720, protein: '45g', carbs: '48g', fat: '38g', fiber: '14g' }
  },

  'steak frites': {
    ingredients: [
      { es: '4 bistecs de res (entrecôte) de 250g y 2.5cm de grosor', en: '4 beef steaks (entrecôte) 250g and 2.5cm thick' },
      { es: '1 kg de patatas para freír (tipo agria), en bastones de 1cm', en: '1 kg frying potatoes (Russet type), cut into 1cm batons' },
      { es: 'Aceite de cacahuate para freír', en: 'Peanut oil for frying' },
      { es: '60g de mantequilla', en: '60g butter' },
      { es: 'Sal de mar en escamas y pimienta negra', en: 'Flaky sea salt and black pepper' },
      { es: 'Mostaza Dijon y salsa béarnaise para acompañar', en: 'Dijon mustard and béarnaise sauce for serving' }
    ],
    steps: [
      { es: 'Corta las patatas en bastones de 1cm. Enjuaga en agua fría para quitar almidón. Seca MUY bien con paño de cocina.', en: 'Cut potatoes into 1cm batons. Rinse in cold water to remove starch. Dry VERY well with kitchen towel.' },
      { es: 'Primera fritura: fríe a 140°C durante 6-8 minutos (sin dorar, solo cocinar por dentro). Escurre sobre rejilla. Se pueden preparar con antelación.', en: 'First fry: fry at 140°C for 6-8 minutes (no browning, just cooking inside). Drain on rack. Can be prepared ahead.' },
      { es: 'Saca los bistecs del refrigerador 30 minutos antes. Sazona SOLO con sal y pimienta. Sella en un sartén de hierro humeante con mantequilla, 3 min por lado para término medio-rojo.', en: 'Remove steaks from fridge 30 minutes before. Season ONLY with salt and pepper. Sear in smoking hot cast iron with butter, 3 min per side for medium-rare.' },
      { es: 'Mientras reposa el bistec (5 min cubierto), segunda fritura de las patatas: 190°C durante 2-3 minutos hasta que estén doradas y crujientes. Sala inmediatamente.', en: 'While steak rests (5 min covered), second fry potatoes: 190°C for 2-3 minutes until golden and crispy. Salt immediately.' },
      { es: 'Sirve el bistec entero con un montón generoso de frites al lado, mostaza Dijon y salsa béarnaise.', en: 'Serve whole steak with a generous pile of frites alongside, Dijon mustard and béarnaise sauce.' }
    ],
    nutrition: { calories: 750, protein: '48g', carbs: '52g', fat: '38g', fiber: '4g' }
  },

  'croque monsieur': {
    ingredients: [
      { es: '8 rebanadas de pan de molde blanco', en: '8 slices white sandwich bread' },
      { es: '8 lonchas de jamón de París (jambon blanc)', en: '8 slices Paris ham (jambon blanc)' },
      { es: '200g de queso gruyère rallado', en: '200g grated Gruyère cheese' },
      { es: '2 cucharadas de mantequilla + extra para el pan', en: '2 tablespoons butter + extra for bread' },
      { es: '2 cucharadas de harina', en: '2 tablespoons flour' },
      { es: '250ml de leche', en: '250ml milk' },
      { es: 'Nuez moscada, sal y pimienta', en: 'Nutmeg, salt and pepper' }
    ],
    steps: [
      { es: 'Prepara la bechamel: derrite mantequilla, agrega harina y cocina 1 minuto. Vierte leche batiendo sin parar hasta espesar. Sazona con nuez moscada.', en: 'Prepare béchamel: melt butter, add flour and cook 1 minute. Pour milk whisking non-stop until thick. Season with nutmeg.' },
      { es: 'Unta mantequilla en cada rebanada de pan. Arma: pan, bechamel, jamón, gruyère, otro pan. Presiona suavemente.', en: 'Butter each bread slice. Build: bread, béchamel, ham, Gruyère, another bread. Press gently.' },
      { es: 'Cubre la parte superior con bechamel y más gruyère rallado. Hornea a 200°C durante 10 minutos, luego gratina 3-5 minutos hasta que la superficie burbujee y se dore.', en: 'Cover top with béchamel and more grated Gruyère. Bake at 200°C for 10 minutes, then broil 3-5 minutes until surface bubbles and browns.' },
      { es: 'Sirve inmediatamente. Para hacer un Croque Madame, corona con un huevo poché o frito encima.', en: 'Serve immediately. To make a Croque Madame, top with a poached or fried egg on top.' }
    ],
    nutrition: { calories: 520, protein: '28g', carbs: '32g', fat: '30g', fiber: '1g' }
  },

  'escargots': {
    ingredients: [
      { es: '24 caracoles de Borgoña (en lata, preparados)', en: '24 Burgundy snails (canned, prepared)' },
      { es: '150g de mantequilla a temperatura ambiente', en: '150g butter at room temperature' },
      { es: '4 dientes de ajo, finamente picados', en: '4 garlic cloves, finely minced' },
      { es: '3 cucharadas de perejil fresco picado', en: '3 tablespoons fresh parsley, chopped' },
      { es: '1 cucharada de chalote picado', en: '1 tablespoon minced shallot' },
      { es: 'Sal, pimienta y una pizca de Pernod (opcional)', en: 'Salt, pepper and a splash of Pernod (optional)' },
      { es: 'Pan baguette crujiente para mojar', en: 'Crusty baguette bread for dipping' }
    ],
    steps: [
      { es: 'Prepara la mantequilla de caracol: mezcla la mantequilla blanda con ajo, perejil, chalote, sal, pimienta y un toque de Pernod. Amasa con un tenedor hasta integrar.', en: 'Prepare snail butter: mix soft butter with garlic, parsley, shallot, salt, pepper and a touch of Pernod. Work with a fork until combined.' },
      { es: 'Coloca un poco de mantequilla en el fondo de cada cavidad del plato para escargots (o un refractario). Introduce un caracol en cada una y cubre con más mantequilla de ajo.', en: 'Place some butter at the bottom of each cavity of the escargot plate (or baking dish). Place a snail in each and cover with more garlic butter.' },
      { es: 'Hornea a 200°C durante 10-12 minutos hasta que la mantequilla burbujee y se dore ligeramente. Los aromas de ajo y perejil deben llenar la cocina.', en: 'Bake at 200°C for 10-12 minutes until butter bubbles and browns slightly. Aromas of garlic and parsley should fill the kitchen.' },
      { es: 'Sirve inmediatamente en el mismo plato con las pinzas para escargots y un tenedor especial. Acompaña con abundante baguette para absorber la mantequilla de ajo.', en: 'Serve immediately in same plate with escargot tongs and special fork. Accompany with plenty of baguette to soak up garlic butter.' }
    ],
    nutrition: { calories: 380, protein: '14g', carbs: '8g', fat: '34g', fiber: '0g' }
  },

  'soupe.*oignon': {
    ingredients: [
      { es: '6 cebollas grandes, en rodajas finas', en: '6 large onions, thinly sliced' },
      { es: '60g de mantequilla', en: '60g butter' },
      { es: '1 cucharada de azúcar', en: '1 tablespoon sugar' },
      { es: '1 taza de vino blanco seco', en: '1 cup dry white wine' },
      { es: '1.5L de caldo de res', en: '1.5L beef broth' },
      { es: '1 baguette en rebanadas de 2cm', en: '1 baguette in 2cm slices' },
      { es: '200g de queso gruyère rallado', en: '200g grated Gruyère cheese' },
      { es: 'Tomillo fresco, 1 hoja de laurel', en: 'Fresh thyme, 1 bay leaf' }
    ],
    steps: [
      { es: 'Derrite la mantequilla a fuego medio-bajo. Agrega las cebollas rebanadas y una pizca de sal. Cocina revolviendo cada 5 minutos durante 45-60 MINUTOS hasta que estén profundamente caramelizadas y color ámbar oscuro. NO apresures este paso.', en: 'Melt butter over medium-low heat. Add sliced onions and a pinch of salt. Cook stirring every 5 minutes for 45-60 MINUTES until deeply caramelized and dark amber. Do NOT rush this step.' },
      { es: 'Espolvorea el azúcar para ayudar a la caramelización. Desglasa con vino blanco raspando los fondos. Cocina hasta evaporar.', en: 'Sprinkle sugar to help caramelization. Deglaze with white wine scraping the bottoms. Cook until evaporated.' },
      { es: 'Agrega el caldo, tomillo y laurel. Hierve y luego cocina a fuego bajo 20 minutos.', en: 'Add broth, thyme and bay leaf. Boil then simmer on low 20 minutes.' },
      { es: 'Sirve en tazones aptos para horno (cocottes). Coloca rebanadas de baguette tostado cubriendo la superficie. Cubre generosamente con gruyère rallado.', en: 'Serve in oven-safe bowls (cocottes). Place toasted baguette slices covering surface. Cover generously with grated Gruyère.' },
      { es: 'Gratina bajo el broiler 3-5 minutos hasta que el queso burbujee, se dore y cuelgue por los bordes del tazón. ¡Cuidado al servir, estará muy caliente!', en: 'Broil 3-5 minutes until cheese bubbles, browns and drapes over bowl edges. Careful when serving, it will be very hot!' }
    ],
    nutrition: { calories: 420, protein: '18g', carbs: '38g', fat: '22g', fiber: '3g' }
  },

  'souffl.*fromage': {
    ingredients: [
      { es: '4 huevos (yemas y claras separadas)', en: '4 eggs (yolks and whites separated)' },
      { es: '150g de queso gruyère rallado', en: '150g grated Gruyère cheese' },
      { es: '40g de mantequilla + extra para engrasar', en: '40g butter + extra for greasing' },
      { es: '40g de harina', en: '40g flour' },
      { es: '300ml de leche', en: '300ml milk' },
      { es: '1 pizca de nuez moscada y cayena', en: '1 pinch nutmeg and cayenne' },
      { es: 'Parmesano rallado para el molde', en: 'Grated Parmesan for the mold' }
    ],
    steps: [
      { es: 'Precalienta el horno a 190°C. Engrasa un molde para soufflé con mantequilla y espolvorea parmesano (esto ayuda a que suba recto).', en: 'Preheat oven to 190°C. Grease a soufflé mold with butter and dust with Parmesan (this helps it rise straight).' },
      { es: 'Prepara la bechamel: derrite mantequilla, agrega harina (roux), cocina 1 minuto. Vierte la leche poco a poco. Cocina hasta espesar. Retira del fuego e incorpora las yemas una a una y el gruyère.', en: 'Prepare béchamel: melt butter, add flour (roux), cook 1 minute. Pour milk gradually. Cook until thick. Remove from heat and add yolks one at a time and Gruyère.' },
      { es: 'Bate las claras a punto de nieve firme con una pizca de sal. Incorpora ⅓ de las claras a la base para aligerar. Luego envuelve el resto con movimientos suaves y envolventes de abajo hacia arriba. NO mezcles en exceso.', en: 'Beat whites to stiff peaks with a pinch of salt. Fold ⅓ of whites into base to lighten. Then fold in rest with gentle, lifting movements from bottom to top. Do NOT over-mix.' },
      { es: 'Vierte en el molde hasta ¾. Pasa un dedo limpio por el borde interior creando un surco (esto forma la "corona" al subir). Hornea 25-30 minutos SIN abrir el horno. Sirve inmediatamente, se desinfla en 5 minutos.', en: 'Pour into mold to ¾. Run clean finger around inner edge creating a groove (this forms the "crown" when rising). Bake 25-30 minutes WITHOUT opening oven. Serve immediately, it deflates in 5 minutes.' }
    ],
    nutrition: { calories: 380, protein: '22g', carbs: '14g', fat: '26g', fiber: '0g' }
  },

  'souffl.*chocolat': {
    ingredients: [
      { es: '200g de chocolate negro 70%, picado', en: '200g dark chocolate 70%, chopped' },
      { es: '4 huevos grandes (yemas y claras separadas)', en: '4 large eggs (yolks and whites separated)' },
      { es: '50g de mantequilla', en: '50g butter' },
      { es: '3 cucharadas de azúcar + extra para el molde', en: '3 tablespoons sugar + extra for mold' },
      { es: '1 cucharadita de extracto de vainilla', en: '1 teaspoon vanilla extract' },
      { es: '1 pizca de sal', en: '1 pinch of salt' },
      { es: 'Azúcar glass y crema batida para servir', en: 'Powdered sugar and whipped cream for serving' }
    ],
    steps: [
      { es: 'Precalienta el horno a 190°C. Engrasa ramequines individuales con mantequilla y espolvorea con azúcar (gira para cubrir las paredes).', en: 'Preheat oven to 190°C. Grease individual ramekins with butter and dust with sugar (rotate to coat walls).' },
      { es: 'Derrite el chocolate con la mantequilla a baño maría, revolviendo suavemente. Retira del fuego e incorpora las yemas una a una y la vainilla.', en: 'Melt chocolate with butter in a double boiler, stirring gently. Remove from heat and add yolks one at a time and vanilla.' },
      { es: 'Bate las claras con la sal a punto de nieve. Agrega el azúcar gradualmente y bate hasta que estén brillantes y formen picos firmes.', en: 'Beat whites with salt to soft peaks. Add sugar gradually and beat until glossy and forming stiff peaks.' },
      { es: 'Incorpora ⅓ de las claras al chocolate para aligerar. Luego envuelve el resto con movimientos suaves. Vierte en los ramequines hasta el borde.', en: 'Fold ⅓ of whites into chocolate to lighten. Then fold in rest with gentle movements. Pour into ramekins to the rim.' },
      { es: 'Hornea 12-14 minutos. El soufflé debe subir 3-4cm por encima del borde y estar ligeramente tembloroso en el centro. Espolvorea azúcar glass y sirve AL INSTANTE con crema batida al lado.', en: 'Bake 12-14 minutes. Soufflé should rise 3-4cm above rim and be slightly wobbly in center. Dust with powdered sugar and serve INSTANTLY with whipped cream on side.' }
    ],
    nutrition: { calories: 350, protein: '8g', carbs: '28g', fat: '24g', fiber: '2g' }
  },

  'salade ni': {
    ingredients: [
      { es: '200g de atún en lata (en aceite de oliva), escurrido', en: '200g canned tuna (in olive oil), drained' },
      { es: '4 huevos duros, en cuartos', en: '4 hard-boiled eggs, quartered' },
      { es: '200g de ejotes (judías verdes), blanqueados', en: '200g green beans, blanched' },
      { es: '200g de patatas cocidas, en rodajas', en: '200g boiled potatoes, sliced' },
      { es: '12 aceitunas negras de Niza', en: '12 Nice black olives' },
      { es: '8 anchoas en aceite', en: '8 anchovies in oil' },
      { es: '2 jitomates maduros en gajos', en: '2 ripe tomatoes in wedges' },
      { es: 'Lechuga de hoja, cebolleta, albahaca fresca', en: 'Leaf lettuce, scallion, fresh basil' },
      { es: 'Vinagreta: aceite de oliva, vinagre de vino tinto, mostaza Dijon', en: 'Vinaigrette: olive oil, red wine vinegar, Dijon mustard' }
    ],
    steps: [
      { es: 'Prepara la vinagreta: bate 1 cucharadita de mostaza Dijon con 2 cucharadas de vinagre. Agrega 6 cucharadas de aceite de oliva en hilo fino batiendo hasta emulsionar.', en: 'Prepare vinaigrette: whisk 1 teaspoon Dijon mustard with 2 tablespoons vinegar. Add 6 tablespoons olive oil in a thin stream whisking until emulsified.' },
      { es: 'Dispón hojas de lechuga como base en un platón grande. Acomoda los ingredientes en secciones separadas y estéticas: patatas, ejotes, jitomate, huevos, atún desmenuzado.', en: 'Arrange lettuce leaves as base on a large platter. Arrange ingredients in separate, aesthetic sections: potatoes, green beans, tomato, eggs, flaked tuna.' },
      { es: 'Decora con las aceitunas, anchoas y albahaca. Rocía la vinagreta sobre todo justo antes de servir. No se mezcla, se come tomando de cada sección.', en: 'Garnish with olives, anchovies and basil. Drizzle vinaigrette over everything just before serving. Don\'t toss, eat by taking from each section.' }
    ],
    nutrition: { calories: 380, protein: '28g', carbs: '22g', fat: '20g', fiber: '4g' }
  },

  'pissaladi': {
    ingredients: [
      { es: '500g de masa de pan (harina, agua, levadura, sal, aceite de oliva)', en: '500g bread dough (flour, water, yeast, salt, olive oil)' },
      { es: '1 kg de cebollas, en rodajas muy finas', en: '1 kg onions, very thinly sliced' },
      { es: '12 filetes de anchoa en aceite', en: '12 anchovy fillets in oil' },
      { es: '24 aceitunas negras de Niza', en: '24 Nice black olives' },
      { es: '4 cucharadas de aceite de oliva', en: '4 tablespoons olive oil' },
      { es: '2 dientes de ajo', en: '2 garlic cloves' },
      { es: 'Tomillo fresco y hierbas de Provenza', en: 'Fresh thyme and herbes de Provence' }
    ],
    steps: [
      { es: 'Cocina las cebollas a fuego muy bajo en aceite de oliva con ajo y tomillo durante 45 minutos, revolviendo ocasionalmente, hasta que estén completamente blandas, dulces y transparentes. No deben dorarse.', en: 'Cook onions over very low heat in olive oil with garlic and thyme for 45 minutes, stirring occasionally, until completely soft, sweet and translucent. They should not brown.' },
      { es: 'Estira la masa en un rectángulo de 1cm de grosor. Coloca en una bandeja engrasada. Deja reposar 20 minutos.', en: 'Stretch dough into a 1cm thick rectangle. Place on greased baking sheet. Let rest 20 minutes.' },
      { es: 'Extiende la mermelada de cebolla sobre la masa. Forma un patrón de rombos con las anchoas y coloca una aceituna en el centro de cada rombo.', en: 'Spread onion jam over dough. Form a diamond pattern with anchovies and place an olive in center of each diamond.' },
      { es: 'Hornea a 220°C durante 20-25 minutos hasta que los bordes estén dorados y crujientes. Corta en rectángulos y sirve tibia como aperitivo.', en: 'Bake at 220°C for 20-25 minutes until edges are golden and crispy. Cut into rectangles and serve warm as appetizer.' }
    ],
    nutrition: { calories: 320, protein: '10g', carbs: '40g', fat: '14g', fiber: '3g' }
  }
};

async function fixBatch() {
  console.log('🇪🇸🇫🇷 BATCH 5: España + Francia\n');
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
      for (const [key, fix] of Object.entries(fixes)) {
        // Support regex keys (e.g. 'souffl.*fromage')
        const regex = new RegExp(key, 'i');
        if (regex.test(titleSearch)) { matchedFix = fix; matchedKey = key; break; }
      }
      if (matchedFix) {
        await conn.query('UPDATE recipes SET ingredients = ?, steps = ?, nutrition = ? WHERE id = ?',
          [JSON.stringify(matchedFix.ingredients), JSON.stringify(matchedFix.steps), JSON.stringify(matchedFix.nutrition), r.id]);
        console.log(`✅ ID ${r.id}: ${titleEs || titleEn} [${matchedFix.ingredients.length} ings, ${matchedFix.steps.length} pasos]`);
        fixed++;
      }
    }
    console.log(`\n🎉 Batch 5 completado: ${fixed} recetas corregidas`);
  } catch (error) { console.error('❌ Error:', error); }
  finally { if (conn) conn.release(); pool.end(); }
}
fixBatch();
