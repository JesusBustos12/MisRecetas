import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const fixes = {
  // ═══ ITALIA (15 recetas) ═══
  'gnocchi.*pesto': {
    ingredients: [
      { es: '1 kg de patatas harinosas (para los gnocchi)', en: '1 kg starchy potatoes (for gnocchi)' },
      { es: '250g de harina + 1 yema de huevo', en: '250g flour + 1 egg yolk' },
      { es: '2 tazas de hojas de albahaca fresca', en: '2 cups fresh basil leaves' },
      { es: '50g de piñones tostados', en: '50g toasted pine nuts' },
      { es: '50g de parmesano rallado', en: '50g grated Parmesan' },
      { es: '1 diente de ajo', en: '1 garlic clove' },
      { es: '100ml de aceite de oliva virgen extra', en: '100ml extra virgin olive oil' }
    ],
    steps: [
      { es: 'Hierve las patatas CON piel 40 min. Pela calientes y pasa por prensa de patatas. Mezcla con harina y yema. Amasa brevemente (no trabajes de más).', en: 'Boil potatoes WITH skin 40 min. Peel while hot and pass through ricer. Mix with flour and yolk. Knead briefly (don\'t overwork).' },
      { es: 'Forma cordones de 2cm de grosor y corta en porciones de 2cm. Marca cada uno con un tenedor para las estrías clásicas.', en: 'Form 2cm thick ropes and cut into 2cm pieces. Mark each with a fork for classic ridges.' },
      { es: 'Pesto: licúa albahaca, piñones, ajo, parmesano y aceite en frío (la licuadora calienta y oxida la albahaca, usa procesador de alimentos o mortero).', en: 'Pesto: blend basil, pine nuts, garlic, Parmesan and oil cold (blender heats and oxidizes basil, use food processor or mortar).' },
      { es: 'Hierve los gnocchi en agua con sal. Cuando floten (2-3 min), están listos. Mezcla delicadamente con el pesto frío y sirve con parmesano extra.', en: 'Boil gnocchi in salted water. When they float (2-3 min), they\'re done. Gently toss with cold pesto and serve with extra Parmesan.' }
    ],
    nutrition: { calories: 480, protein: '14g', carbs: '52g', fat: '24g', fiber: '4g' }
  },
  'cannoli': {
    ingredients: [
      { es: '250g de harina, 25g de manteca de cerdo, 30g de azúcar, 1 huevo, vino marsala', en: '250g flour, 25g lard, 30g sugar, 1 egg, marsala wine' },
      { es: '500g de ricotta fresca (escurrida 24h)', en: '500g fresh ricotta (drained 24h)' },
      { es: '150g de azúcar glass', en: '150g powdered sugar' },
      { es: '100g de pepitas de chocolate oscuro', en: '100g dark chocolate chips' },
      { es: '50g de pistachos picados', en: '50g chopped pistachios' },
      { es: 'Aceite para freír y cáscaras de naranja confitada', en: 'Oil for frying and candied orange peel' }
    ],
    steps: [
      { es: 'Masa: mezcla harina, manteca, azúcar, huevo y marsala. Amasa 10 min hasta lisa. Envuelve y refrigera 2 horas.', en: 'Dough: mix flour, lard, sugar, egg and marsala. Knead 10 min until smooth. Wrap and refrigerate 2 hours.' },
      { es: 'Estira muy fina (2mm). Corta óvalos de 12cm. Enrolla en tubos de metal y sella con huevo. Fríe a 180°C 3 min hasta dorar.', en: 'Roll very thin (2mm). Cut 12cm ovals. Wrap around metal tubes and seal with egg. Fry at 180°C 3 min until golden.' },
      { es: 'Relleno: mezcla ricotta escurrida con azúcar glass. Incorpora chocolate y naranja confitada. Refrigera 1 hora.', en: 'Filling: mix drained ricotta with powdered sugar. Fold in chocolate and candied orange. Refrigerate 1 hour.' },
      { es: 'Rellena los tubos con manga pastelera JUSTO antes de servir (si se rellenan antes, se ablandan). Decora los extremos con pistachos.', en: 'Fill tubes with piping bag JUST before serving (if filled earlier, they soften). Garnish ends with pistachios.' }
    ],
    nutrition: { calories: 380, protein: '12g', carbs: '42g', fat: '18g', fiber: '1g' }
  },
  'focaccia': {
    ingredients: [
      { es: '500g de harina de fuerza', en: '500g bread flour' },
      { es: '350ml de agua tibia', en: '350ml warm water' },
      { es: '10g de levadura seca', en: '10g dry yeast' },
      { es: '80ml de aceite de oliva virgen extra + extra para el acabado', en: '80ml extra virgin olive oil + extra for finishing' },
      { es: '10g de sal', en: '10g salt' },
      { es: 'Romero fresco y sal en escamas', en: 'Fresh rosemary and flaky salt' }
    ],
    steps: [
      { es: 'Disuelve levadura en agua tibia. Mezcla con harina, sal y aceite. Amasa 10 minutos hasta que la masa esté elástica y pase la prueba de la ventana.', en: 'Dissolve yeast in warm water. Mix with flour, salt and oil. Knead 10 minutes until elastic and passes window pane test.' },
      { es: 'Primera fermentación: cubre y deja reposar 1.5 horas hasta triplicar. Vierte en una bandeja aceitada, estira con los dedos. Deja fermentar 45 min más.', en: 'First rise: cover and rest 1.5 hours until tripled. Pour onto oiled tray, stretch with fingers. Let rise 45 more min.' },
      { es: 'Hunde los dedos creando los hoyuelos característicos. Rocía generosamente con aceite de oliva (que se acumule en los hoyuelos). Clava ramitas de romero y espolvorea sal en escamas.', en: 'Press fingers creating characteristic dimples. Drizzle generously with olive oil (let it pool in dimples). Stick rosemary sprigs and sprinkle flaky salt.' },
      { es: 'Hornea a 220°C 20-25 minutos hasta que esté dorada y crujiente por fuera, esponjosa por dentro. El aceite en los hoyuelos se habrá frito.', en: 'Bake at 220°C 20-25 minutes until golden and crispy outside, spongy inside. Oil in dimples will have fried.' }
    ],
    nutrition: { calories: 320, protein: '8g', carbs: '48g', fat: '12g', fiber: '2g' }
  },
  'arancini': {
    ingredients: [
      { es: '400g de arroz arborio cocido como risotto (al dente)', en: '400g arborio rice cooked as risotto (al dente)' },
      { es: '200g de mozzarella en cubos pequeños', en: '200g mozzarella in small cubes' },
      { es: '100g de ragú de carne (o guisantes)', en: '100g meat ragù (or peas)' },
      { es: '2 huevos batidos', en: '2 beaten eggs' },
      { es: 'Pan rallado fino', en: 'Fine breadcrumbs' },
      { es: 'Aceite para freír', en: 'Oil for frying' },
      { es: '50g de parmesano rallado', en: '50g grated Parmesan' }
    ],
    steps: [
      { es: 'Mezcla el risotto frío con parmesano y 1 huevo. Refrigera 2 horas hasta que esté firme y manejable.', en: 'Mix cold risotto with Parmesan and 1 egg. Refrigerate 2 hours until firm and manageable.' },
      { es: 'Toma una porción de arroz, haz un hueco, coloca un cubo de mozzarella y un poco de ragú. Cierra formando una bola o cono perfecto.', en: 'Take a portion of rice, make a well, place a mozzarella cube and some ragù. Close forming a perfect ball or cone.' },
      { es: 'Pasa por harina, huevo batido y pan rallado. Fríe a 180°C 4-5 minutos hasta que estén dorados y crujientes.', en: 'Coat in flour, beaten egg and breadcrumbs. Fry at 180°C 4-5 minutes until golden and crispy.' },
      { es: 'Sirve calientes. Al cortarlos, la mozzarella debe hacer hilos. Son el street food siciliano por excelencia.', en: 'Serve hot. When cut open, mozzarella should stretch into strings. Sicily\'s quintessential street food.' }
    ],
    nutrition: { calories: 420, protein: '16g', carbs: '42g', fat: '22g', fiber: '1g' }
  },
  'cacio e pepe': {
    ingredients: [
      { es: '400g de spaghetti o tonnarelli', en: '400g spaghetti or tonnarelli' },
      { es: '200g de pecorino romano rallado finamente', en: '200g finely grated pecorino romano' },
      { es: '2 cucharadas de pimienta negra en grano, machacada gruesa', en: '2 tablespoons black peppercorns, coarsely cracked' },
      { es: 'Agua de cocción de la pasta (con almidón)', en: 'Pasta cooking water (starchy)' }
    ],
    steps: [
      { es: 'Cuece la pasta en agua con sal (menos agua de lo normal para concentrar el almidón). Reserva 2 tazas de agua de cocción.', en: 'Cook pasta in salted water (less water than usual to concentrate starch). Reserve 2 cups cooking water.' },
      { es: 'Tuesta la pimienta machacada en un sartén grande 2 minutos hasta que aromatice. Agrega 1 taza de agua de pasta y reduce un poco.', en: 'Toast cracked pepper in large skillet 2 minutes until aromatic. Add 1 cup pasta water and reduce slightly.' },
      { es: 'Mezcla el pecorino con agua de pasta TIBIA (no caliente, o se hace grumos) hasta formar una crema lisa. Esta es la clave del plato.', en: 'Mix pecorino with WARM pasta water (not hot, or it clumps) until forming a smooth cream. This is the key.' },
      { es: 'Agrega la pasta al dente al sartén con la pimienta. Fuera del fuego, incorpora la crema de pecorino mezclando vigorosamente. Solo tiene 3 ingredientes pero es uno de los platos más difíciles de Roma.', en: 'Add al dente pasta to skillet with pepper. Off heat, add pecorino cream mixing vigorously. Only 3 ingredients but one of Rome\'s most difficult dishes.' }
    ],
    nutrition: { calories: 520, protein: '22g', carbs: '62g', fat: '20g', fiber: '3g' }
  },
  'bruschetta': {
    ingredients: [
      { es: '6 rebanadas de pan ciabatta o campesino', en: '6 slices ciabatta or country bread' },
      { es: '6 jitomates maduros, en cubos pequeños', en: '6 ripe tomatoes, in small cubes' },
      { es: '2 dientes de ajo (uno para frotar el pan)', en: '2 garlic cloves (one for rubbing bread)' },
      { es: 'Hojas de albahaca fresca', en: 'Fresh basil leaves' },
      { es: 'Aceite de oliva virgen extra y sal en escamas', en: 'Extra virgin olive oil and flaky salt' }
    ],
    steps: [
      { es: 'Corta los jitomates, quita las semillas, sálalos y déjalos escurrir 15 min boca abajo para eliminar el exceso de agua.', en: 'Cut tomatoes, remove seeds, salt them and let drain 15 min face down to remove excess water.' },
      { es: 'Tuesta las rebanadas de pan en parrilla o bajo el broiler hasta que tengan marcas y estén crujientes pero suaves por dentro.', en: 'Toast bread slices on grill or under broiler until they have marks and are crispy but soft inside.' },
      { es: 'Frota el diente de ajo sobre el pan caliente (el calor lo "derrite"). Rocía aceite de oliva generosamente. Corona con los jitomates, albahaca y sal en escamas. Sirve inmediatamente antes de que el pan se ablande.', en: 'Rub garlic clove on hot bread (heat "melts" it). Drizzle olive oil generously. Top with tomatoes, basil and flaky salt. Serve immediately before bread softens.' }
    ],
    nutrition: { calories: 220, protein: '6g', carbs: '28g', fat: '10g', fiber: '3g' }
  },
  'fettuccine alfredo': {
    ingredients: [
      { es: '400g de fettuccine frescos', en: '400g fresh fettuccine' },
      { es: '100g de mantequilla de buena calidad', en: '100g good quality butter' },
      { es: '200g de parmigiano reggiano rallado finamente', en: '200g finely grated parmigiano reggiano' },
      { es: 'Agua de cocción con almidón', en: 'Starchy cooking water' }
    ],
    steps: [
      { es: 'Cuece los fettuccine en agua con sal hasta al dente. Reserva 2 tazas de agua de cocción.', en: 'Cook fettuccine in salted water until al dente. Reserve 2 cups cooking water.' },
      { es: 'En un sartén grande, derrite la mantequilla a fuego bajo. Agrega ½ taza de agua de pasta y emulsiona.', en: 'In large skillet, melt butter on low heat. Add ½ cup pasta water and emulsify.' },
      { es: 'Fuera del fuego, agrega la pasta y el parmesano. Mezcla con pinzas vigorosamente añadiendo agua de pasta hasta lograr una crema sedosa que cubra cada fettuccine. El verdadero Alfredo romano NO lleva crema.', en: 'Off heat, add pasta and Parmesan. Toss vigorously with tongs adding pasta water until achieving a silky cream coating each fettuccine. The real Roman Alfredo has NO cream.' }
    ],
    nutrition: { calories: 580, protein: '22g', carbs: '58g', fat: '28g', fiber: '2g' }
  },
  'melanzane.*parmigiana|parmigiana': {
    ingredients: [
      { es: '3 berenjenas grandes, en rodajas de 5mm', en: '3 large eggplants, sliced 5mm' },
      { es: '500ml de salsa de tomate casera', en: '500ml homemade tomato sauce' },
      { es: '300g de mozzarella fior di latte, en rodajas', en: '300g fior di latte mozzarella, sliced' },
      { es: '100g de parmesano rallado', en: '100g grated Parmesan' },
      { es: 'Hojas de albahaca fresca', en: 'Fresh basil leaves' },
      { es: 'Aceite de oliva para freír', en: 'Olive oil for frying' }
    ],
    steps: [
      { es: 'Sala las rodajas de berenjena 30 min para desaguar. Seca bien. Fríe en aceite de oliva por tandas hasta que estén doradas (o asa en horno para versión ligera).', en: 'Salt eggplant slices 30 min to draw out moisture. Dry well. Fry in olive oil in batches until golden (or roast in oven for lighter version).' },
      { es: 'Arma capas en refractario: salsa de tomate, berenjenas, mozzarella, parmesano, albahaca. Repite 3-4 capas.', en: 'Build layers in baking dish: tomato sauce, eggplant, mozzarella, Parmesan, basil. Repeat 3-4 layers.' },
      { es: 'Termina con salsa, parmesano abundante y albahaca. Hornea a 180°C 35-40 minutos hasta que burbujee y se dore.', en: 'Finish with sauce, generous Parmesan and basil. Bake at 180°C 35-40 minutes until bubbly and golden.' },
      { es: 'Deja reposar 15 minutos antes de servir (se compacta y es más fácil porcionar). Sabe aún mejor al día siguiente.', en: 'Let rest 15 minutes before serving (it compacts and is easier to portion). Tastes even better the next day.' }
    ],
    nutrition: { calories: 380, protein: '18g', carbs: '20g', fat: '26g', fiber: '5g' }
  },
  'minestrone': {
    ingredients: [
      { es: '2 zanahorias, 2 papas, 2 calabacines, en cubos', en: '2 carrots, 2 potatoes, 2 zucchini, cubed' },
      { es: '1 lata de frijoles cannellini (400g)', en: '1 can cannellini beans (400g)' },
      { es: '200g de pasta corta (ditalini)', en: '200g short pasta (ditalini)' },
      { es: '1 lata de jitomate triturado', en: '1 can crushed tomatoes' },
      { es: '1 cebolla, 2 tallos de apio, 3 ajos', en: '1 onion, 2 celery stalks, 3 garlic cloves' },
      { es: '1.5L de caldo de verduras', en: '1.5L vegetable broth' },
      { es: 'Corteza de parmesano, albahaca y aceite de oliva', en: 'Parmesan rind, basil and olive oil' }
    ],
    steps: [
      { es: 'Sofríe cebolla, apio y ajo en aceite de oliva 5 min. Agrega zanahoria y papa, cocina 3 min más.', en: 'Sauté onion, celery and garlic in olive oil 5 min. Add carrot and potato, cook 3 more min.' },
      { es: 'Vierte jitomate y caldo. Agrega la corteza de parmesano (dará sabor umami). Hierve 15 minutos.', en: 'Pour tomatoes and broth. Add Parmesan rind (will give umami flavor). Boil 15 minutes.' },
      { es: 'Agrega calabacín, frijoles y pasta. Cocina 10 minutos más hasta que la pasta esté al dente. Retira la corteza.', en: 'Add zucchini, beans and pasta. Cook 10 more minutes until pasta is al dente. Remove rind.' },
      { es: 'Sirve con un hilo de aceite de oliva crudo, albahaca fresca y parmesano rallado. Cada región de Italia tiene su propia versión.', en: 'Serve with a drizzle of raw olive oil, fresh basil and grated Parmesan. Every region of Italy has its own version.' }
    ],
    nutrition: { calories: 320, protein: '14g', carbs: '48g', fat: '8g', fiber: '8g' }
  },
  'panettone': {
    ingredients: [
      { es: '500g de harina de fuerza', en: '500g bread flour' },
      { es: '150g de azúcar', en: '150g sugar' },
      { es: '4 yemas de huevo + 1 huevo', en: '4 egg yolks + 1 egg' },
      { es: '150g de mantequilla a temperatura ambiente', en: '150g butter at room temperature' },
      { es: '15g de levadura fresca', en: '15g fresh yeast' },
      { es: '100g de frutas confitadas y 80g de pasas', en: '100g candied fruit and 80g raisins' },
      { es: 'Ralladura de 1 naranja y 1 limón, extracto de vainilla', en: 'Zest of 1 orange and 1 lemon, vanilla extract' }
    ],
    steps: [
      { es: 'Primera masa (biga): mezcla ⅓ de harina, levadura y agua tibia. Fermenta 12 horas. Luego incorpora el resto de harina, azúcar y yemas una a una.', en: 'First dough (biga): mix ⅓ flour, yeast and warm water. Ferment 12 hours. Then add remaining flour, sugar and yolks one by one.' },
      { es: 'Agrega mantequilla en 3 partes amasando 20 min hasta una masa suave y elástica que se despegue de la superficie. Incorpora las frutas y ralladuras.', en: 'Add butter in 3 parts kneading 20 min until soft, elastic dough that pulls away from surface. Fold in fruits and zest.' },
      { es: 'Forma una bola, coloca en un molde de panettone con papel. Fermenta 6-8 horas hasta que la masa llegue al borde del molde.', en: 'Shape into ball, place in panettone mold with paper. Ferment 6-8 hours until dough reaches mold rim.' },
      { es: 'Haz una X en la superficie y coloca una nuez de mantequilla. Hornea a 180°C 45-50 min. Al salir, clava 2 palitos largos en la base y cuélgalo boca abajo hasta que enfríe (evita que se desinfle).', en: 'Score an X on surface and place a knob of butter. Bake at 180°C 45-50 min. Upon removal, stick 2 long skewers in base and hang upside down until cool (prevents deflating).' }
    ],
    nutrition: { calories: 380, protein: '8g', carbs: '56g', fat: '14g', fiber: '2g' }
  },
  'panna cotta': {
    ingredients: [
      { es: '500ml de crema para batir', en: '500ml heavy cream' },
      { es: '80g de azúcar', en: '80g sugar' },
      { es: '1 vaina de vainilla o 1 cdita de extracto', en: '1 vanilla bean or 1 tsp extract' },
      { es: '7g de gelatina en hojas (o sobre)', en: '7g gelatin sheets (or packet)' },
      { es: 'Coulis de frutos rojos: 200g berries + 50g azúcar', en: 'Berry coulis: 200g berries + 50g sugar' }
    ],
    steps: [
      { es: 'Hidrata la gelatina en agua fría 5 minutos. Calienta crema con azúcar y vainilla hasta que hierva. Retira del fuego.', en: 'Hydrate gelatin in cold water 5 minutes. Heat cream with sugar and vanilla until it boils. Remove from heat.' },
      { es: 'Exprime la gelatina y disuelve en la crema caliente. Cuela y vierte en moldes individuales. Refrigera mínimo 4 horas.', en: 'Squeeze gelatin and dissolve in hot cream. Strain and pour into individual molds. Refrigerate at least 4 hours.' },
      { es: 'Coulis: cocina berries con azúcar 5 min. Licúa y cuela para quitar semillas. Desmolda la panna cotta (sumerge en agua tibia 5 seg) y baña con coulis.', en: 'Coulis: cook berries with sugar 5 min. Blend and strain to remove seeds. Unmold panna cotta (dip in warm water 5 sec) and drizzle with coulis.' }
    ],
    nutrition: { calories: 380, protein: '4g', carbs: '28g', fat: '30g', fiber: '1g' }
  },
  'ravioli.*ricota': {
    ingredients: [
      { es: 'Masa: 300g harina, 3 huevos, 1 cda aceite oliva', en: 'Dough: 300g flour, 3 eggs, 1 tbsp olive oil' },
      { es: '400g de ricotta fresca escurrida', en: '400g fresh ricotta, drained' },
      { es: '100g de espinacas cocidas y exprimidas', en: '100g cooked and squeezed spinach' },
      { es: '50g de parmesano rallado', en: '50g grated Parmesan' },
      { es: 'Nuez moscada, sal y pimienta', en: 'Nutmeg, salt and pepper' },
      { es: 'Mantequilla y salvia para la salsa', en: 'Butter and sage for sauce' }
    ],
    steps: [
      { es: 'Masa: volcán de harina, huevos en el centro. Amasa 10 min hasta lisa y elástica. Envuelve y reposa 30 min.', en: 'Dough: flour volcano, eggs in center. Knead 10 min until smooth and elastic. Wrap and rest 30 min.' },
      { es: 'Relleno: mezcla ricotta, espinacas picadas, parmesano, nuez moscada. Debe ser firme (si está húmedo, romperá la pasta).', en: 'Filling: mix ricotta, chopped spinach, Parmesan, nutmeg. Must be firm (if wet, will break the pasta).' },
      { es: 'Estira la masa con máquina hasta el penúltimo grosor. Coloca cucharadas de relleno cada 5cm. Cubre con otra lámina, presiona alrededor y corta con cortapastas.', en: 'Roll dough with machine to second-thinnest setting. Place spoonfuls of filling every 5cm. Cover with another sheet, press around and cut with cutter.' },
      { es: 'Hierve 3-4 minutos. Salsa: dora mantequilla con hojas de salvia hasta que la mantequilla huela a nuez (beurre noisette). Baña los ravioli.', en: 'Boil 3-4 minutes. Sauce: brown butter with sage leaves until butter smells nutty (beurre noisette). Drizzle over ravioli.' }
    ],
    nutrition: { calories: 420, protein: '18g', carbs: '38g', fat: '22g', fiber: '2g' }
  },
  'affogato': {
    ingredients: [
      { es: '2 bolas de helado de vainilla de calidad', en: '2 scoops quality vanilla ice cream' },
      { es: '1 shot de espresso recién hecho (caliente)', en: '1 shot freshly made espresso (hot)' },
      { es: 'Opcional: 1 chorrito de amaretto o Kahlúa', en: 'Optional: 1 splash amaretto or Kahlúa' }
    ],
    steps: [
      { es: 'Enfría la copa o vaso de vidrio en el congelador 10 minutos. El contraste de temperaturas es esencial.', en: 'Chill glass in freezer 10 minutes. Temperature contrast is essential.' },
      { es: 'Coloca las bolas de helado de vainilla en la copa fría. Prepara el espresso al momento.', en: 'Place vanilla ice cream scoops in chilled glass. Prepare espresso right now.' },
      { es: 'Vierte el espresso caliente sobre el helado en la mesa, frente al comensal. El helado empezará a derretirse creando una crema irresistible. Añade licor si deseas. Se come con cuchara y se bebe el fondo.', en: 'Pour hot espresso over ice cream at the table, in front of diner. Ice cream will start melting creating irresistible cream. Add liqueur if desired. Eat with spoon and drink the bottom.' }
    ],
    nutrition: { calories: 220, protein: '4g', carbs: '26g', fat: '12g', fiber: '0g' }
  },
  'biscotti|cantucci': {
    ingredients: [
      { es: '300g de harina', en: '300g flour' },
      { es: '200g de azúcar', en: '200g sugar' },
      { es: '3 huevos', en: '3 eggs' },
      { es: '150g de almendras enteras (sin pelar)', en: '150g whole almonds (unpeeled)' },
      { es: 'Ralladura de 1 naranja', en: 'Zest of 1 orange' },
      { es: '1 cucharadita de polvo para hornear', en: '1 teaspoon baking powder' }
    ],
    steps: [
      { es: 'Mezcla harina, azúcar, polvo para hornear. Agrega huevos y ralladura. Incorpora las almendras. La masa será pegajosa.', en: 'Mix flour, sugar, baking powder. Add eggs and zest. Fold in almonds. Dough will be sticky.' },
      { es: 'Forma 2 troncos de 20cm x 6cm sobre bandeja con papel. Hornea a 180°C 25 minutos hasta que estén firmes y dorados.', en: 'Form 2 logs 20cm x 6cm on lined tray. Bake at 180°C 25 minutes until firm and golden.' },
      { es: 'Deja enfriar 10 min. Corta en diagonal en rodajas de 1.5cm con un cuchillo de sierra. Coloca las rodajas de costado en la bandeja.', en: 'Cool 10 min. Cut diagonally in 1.5cm slices with serrated knife. Place slices on their side on tray.' },
      { es: 'Hornea nuevamente a 160°C 15 minutos (segundo horneado = bis-cotti). Deben quedar secos y crujientes. Se mojan en Vin Santo o café.', en: 'Bake again at 160°C 15 minutes (second baking = bis-cotti). Should be dry and crunchy. Dipped in Vin Santo or coffee.' }
    ],
    nutrition: { calories: 280, protein: '8g', carbs: '42g', fat: '10g', fiber: '2g' }
  },
  'caprese': {
    ingredients: [
      { es: '3 bolas de mozzarella di bufala fresca', en: '3 balls fresh buffalo mozzarella' },
      { es: '4 jitomates maduros grandes (tipo corazón de buey)', en: '4 large ripe tomatoes (beefsteak type)' },
      { es: 'Hojas de albahaca fresca', en: 'Fresh basil leaves' },
      { es: 'Aceite de oliva virgen extra', en: 'Extra virgin olive oil' },
      { es: 'Sal en escamas y pimienta negra', en: 'Flaky salt and black pepper' }
    ],
    steps: [
      { es: 'Corta la mozzarella y los jitomates en rodajas de 1cm. La mozzarella debe estar a temperatura ambiente (NO fría de nevera).', en: 'Slice mozzarella and tomatoes 1cm thick. Mozzarella should be at room temperature (NOT cold from fridge).' },
      { es: 'Alterna rodajas de jitomate y mozzarella en un plato, intercalando hojas de albahaca entre cada par.', en: 'Alternate tomato and mozzarella slices on plate, tucking basil leaves between each pair.' },
      { es: 'Rocía generosamente con el mejor aceite de oliva que tengas, sal en escamas y pimienta. Sirve inmediatamente. La simplicidad de este plato exige ingredientes de primerísima calidad.', en: 'Drizzle generously with best olive oil available, flaky salt and pepper. Serve immediately. This dish\'s simplicity demands top-quality ingredients.' }
    ],
    nutrition: { calories: 280, protein: '16g', carbs: '6g', fat: '22g', fiber: '1g' }
  },
  'panzanella': {
    ingredients: [
      { es: '300g de pan toscano del día anterior, en cubos', en: '300g day-old Tuscan bread, cubed' },
      { es: '4 jitomates maduros en cubos', en: '4 ripe tomatoes, cubed' },
      { es: '1 pepino pelado y en rodajas', en: '1 cucumber, peeled and sliced' },
      { es: '½ cebolla roja en rodajas finas', en: '½ red onion, thinly sliced' },
      { es: 'Albahaca fresca, 100ml aceite de oliva, 3 cdas vinagre de vino tinto', en: 'Fresh basil, 100ml olive oil, 3 tbsp red wine vinegar' }
    ],
    steps: [
      { es: 'Remoja el pan en agua fría 10 minutos. Exprime bien para quitar el exceso de agua (debe estar húmedo pero no empapado).', en: 'Soak bread in cold water 10 minutes. Squeeze well to remove excess water (should be moist but not soggy).' },
      { es: 'Mezcla jitomates, pepino, cebolla roja y albahaca desgarrada. Agrega el pan desmenuzado.', en: 'Mix tomatoes, cucumber, red onion and torn basil. Add crumbled bread.' },
      { es: 'Aliña con aceite de oliva y vinagre. Sala bien. Refrigera mínimo 30 minutos para que los sabores se integren. La ensalada campesina toscana que transforma pan viejo en un plato genial.', en: 'Dress with olive oil and vinegar. Salt well. Refrigerate at least 30 minutes for flavors to meld. The Tuscan peasant salad that transforms old bread into a brilliant dish.' }
    ],
    nutrition: { calories: 280, protein: '6g', carbs: '32g', fat: '16g', fiber: '3g' }
  },
  'sfogliatella': {
    ingredients: [
      { es: '300g de harina, 150ml de agua, 1 pizca de sal', en: '300g flour, 150ml water, 1 pinch salt' },
      { es: '150g de manteca de cerdo (para laminar)', en: '150g lard (for laminating)' },
      { es: '250g de ricotta escurrida', en: '250g drained ricotta' },
      { es: '150g de semolina cocida en leche', en: '150g semolina cooked in milk' },
      { es: '100g de azúcar, 1 huevo, canela y cáscaras confitadas', en: '100g sugar, 1 egg, cinnamon and candied peel' }
    ],
    steps: [
      { es: 'Masa: amasa harina, agua y sal 15 min hasta muy elástica. Reposa 2 horas. Estira en rectángulo ultra fino. Unta manteca y enrolla como un tronco apretado. Refrigera 12 horas.', en: 'Dough: knead flour, water and salt 15 min until very elastic. Rest 2 hours. Stretch into ultra-thin rectangle. Spread lard and roll into tight log. Refrigerate 12 hours.' },
      { es: 'Relleno: mezcla ricotta, semolina cocida, azúcar, huevo, canela y cáscaras confitadas hasta obtener una crema.', en: 'Filling: mix ricotta, cooked semolina, sugar, egg, cinnamon and candied peel until creamy.' },
      { es: 'Corta el tronco en discos de 1cm. Con los pulgares, abre cada disco formando un cono con las capas visibles. Rellena con la crema.', en: 'Cut log into 1cm discs. With thumbs, open each disc forming a cone with visible layers. Fill with cream.' },
      { es: 'Hornea a 200°C 20-25 minutos hasta que las capas se separen y doren. Espolvorea con azúcar glass. La textura crujiente en capas es inigualable.', en: 'Bake at 200°C 20-25 minutes until layers separate and brown. Dust with powdered sugar. The layered crunchy texture is unmatched.' }
    ],
    nutrition: { calories: 340, protein: '10g', carbs: '40g', fat: '16g', fiber: '1g' }
  },
  'zabaione': {
    ingredients: [
      { es: '6 yemas de huevo', en: '6 egg yolks' },
      { es: '100g de azúcar', en: '100g sugar' },
      { es: '120ml de vino marsala dulce', en: '120ml sweet marsala wine' },
      { es: 'Frutos rojos frescos para servir', en: 'Fresh berries for serving' }
    ],
    steps: [
      { es: 'Bate las yemas con el azúcar en un tazón de cobre o vidrio (baño maría) hasta que estén pálidas y tripliquen su volumen.', en: 'Beat yolks with sugar in copper or glass bowl (double boiler) until pale and tripled in volume.' },
      { es: 'Agrega el marsala en hilo fino sin dejar de batir. Cocina a baño maría batiendo constantemente 8-10 minutos. La crema debe espesar y formar picos suaves.', en: 'Add marsala in thin stream while continuously beating. Cook in double boiler beating constantly 8-10 minutes. Cream should thicken and form soft peaks.' },
      { es: 'Sirve tibio en copas elegantes con frutos rojos frescos. Es uno de los postres italianos más sensuales y antiguos. NUNCA dejes de batir o los huevos se cuajarán.', en: 'Serve warm in elegant glasses with fresh berries. One of Italy\'s most sensual and ancient desserts. NEVER stop beating or eggs will curdle.' }
    ],
    nutrition: { calories: 260, protein: '6g', carbs: '30g', fat: '12g', fiber: '0g' }
  },
  'zeppole': {
    ingredients: [
      { es: '250ml de agua', en: '250ml water' },
      { es: '100g de mantequilla', en: '100g butter' },
      { es: '150g de harina', en: '150g flour' },
      { es: '4 huevos', en: '4 eggs' },
      { es: 'Crema pastelera y cerezas en almíbar (amarene)', en: 'Pastry cream and candied cherries (amarene)' },
      { es: 'Azúcar glass para espolvorear', en: 'Powdered sugar for dusting' }
    ],
    steps: [
      { es: 'Hierve agua con mantequilla. Agrega toda la harina de golpe y revuelve enérgicamente hasta que la masa se despegue del sartén. Enfría 5 minutos.', en: 'Boil water with butter. Add all flour at once and stir vigorously until dough pulls away from pan. Cool 5 minutes.' },
      { es: 'Agrega los huevos uno por uno, batiendo bien entre cada uno (es masa choux). Con manga pastelera, forma rosquillas de 8cm sobre papel.', en: 'Add eggs one by one, beating well between each (it\'s choux dough). With piping bag, form 8cm rings on paper.' },
      { es: 'Hornea a 190°C 25 minutos (o fríe a 170°C 4 min). No abras el horno antes de 20 min o se desinflará.', en: 'Bake at 190°C 25 minutes (or fry at 170°C 4 min). Don\'t open oven before 20 min or they\'ll deflate.' },
      { es: 'Corona cada zeppola con crema pastelera y una cereza amarena. Espolvorea azúcar glass. Son el dulce típico del Día del Padre en Italia (19 de marzo).', en: 'Top each zeppola with pastry cream and an amarena cherry. Dust with powdered sugar. Traditional Italian Father\'s Day sweet (March 19th).' }
    ],
    nutrition: { calories: 320, protein: '8g', carbs: '32g', fat: '18g', fiber: '1g' }
  },

  // ═══ INDIA (4 recetas) ═══
  'gulab jamun': {
    ingredients: [
      { es: '200g de leche en polvo (khoya)', en: '200g milk powder (khoya)' },
      { es: '50g de harina', en: '50g flour' },
      { es: '¼ cdita de bicarbonato', en: '¼ tsp baking soda' },
      { es: '2-3 cucharadas de leche para unir', en: '2-3 tablespoons milk to bind' },
      { es: 'Almíbar: 2 tazas azúcar, 2 tazas agua, cardamomo, azafrán, agua de rosas', en: 'Syrup: 2 cups sugar, 2 cups water, cardamom, saffron, rose water' },
      { es: 'Ghee o aceite para freír', en: 'Ghee or oil for frying' }
    ],
    steps: [
      { es: 'Almíbar: hierve azúcar y agua con cardamomo 5 min. Retira del fuego, agrega azafrán y agua de rosas. Reserva caliente.', en: 'Syrup: boil sugar and water with cardamom 5 min. Remove from heat, add saffron and rose water. Keep warm.' },
      { es: 'Mezcla leche en polvo, harina y bicarbonato. Agrega leche poco a poco hasta formar una masa suave (no pegajosa). Forma bolitas lisas de 2cm sin grietas.', en: 'Mix milk powder, flour and baking soda. Add milk gradually until soft dough (not sticky). Form smooth 2cm balls without cracks.' },
      { es: 'Fríe a fuego BAJO (130°C) girando constantemente 6-8 minutos. Deben dorarse lenta y uniformemente. Si el aceite está muy caliente, quedarán crudos por dentro.', en: 'Fry on LOW heat (130°C) rotating constantly 6-8 minutes. Must brown slowly and evenly. If oil is too hot, they\'ll be raw inside.' },
      { es: 'Sumerge los gulab jamun calientes en el almíbar tibio. Déjalos absorber mínimo 2 horas. Sirve tibios con pistachos picados. Son el postre más popular de India.', en: 'Submerge hot gulab jamun in warm syrup. Let absorb at least 2 hours. Serve warm with chopped pistachios. India\'s most popular dessert.' }
    ],
    nutrition: { calories: 320, protein: '6g', carbs: '48g', fat: '12g', fiber: '0g' }
  },
  'mango lassi': {
    ingredients: [
      { es: '2 mangos maduros (o 1 taza de pulpa)', en: '2 ripe mangos (or 1 cup pulp)' },
      { es: '1 taza de yogur natural espeso', en: '1 cup thick plain yogurt' },
      { es: '½ taza de leche fría', en: '½ cup cold milk' },
      { es: '2-3 cucharadas de azúcar o miel', en: '2-3 tablespoons sugar or honey' },
      { es: '¼ cdita de cardamomo molido y hielo', en: '¼ tsp ground cardamom and ice' }
    ],
    steps: [
      { es: 'Pela y corta los mangos. Reserva unas rodajas para decorar. Congela la pulpa 30 minutos para un lassi extra cremoso.', en: 'Peel and cut mangos. Reserve some slices for garnish. Freeze pulp 30 minutes for extra creamy lassi.' },
      { es: 'Licúa la pulpa de mango, yogur, leche, azúcar y cardamomo hasta que esté completamente suave y cremoso.', en: 'Blend mango pulp, yogurt, milk, sugar and cardamom until completely smooth and creamy.' },
      { es: 'Sirve en vasos altos con hielo, decorado con rodajas de mango y una pizca de cardamomo. Es la bebida ideal para acompañar comida picante india.', en: 'Serve in tall glasses with ice, garnished with mango slices and a pinch of cardamom. The ideal beverage to accompany spicy Indian food.' }
    ],
    nutrition: { calories: 220, protein: '6g', carbs: '42g', fat: '4g', fiber: '2g' }
  },
  'dal makhani': {
    ingredients: [
      { es: '1 taza de urad dal (lentejas negras) remojadas 8h', en: '1 cup urad dal (black lentils) soaked 8h' },
      { es: '¼ taza de rajma (frijoles rojos)', en: '¼ cup rajma (kidney beans)' },
      { es: '2 cucharadas de mantequilla + 2 de ghee', en: '2 tablespoons butter + 2 ghee' },
      { es: '1 lata de jitomate triturado', en: '1 can crushed tomatoes' },
      { es: '100ml de crema de leche', en: '100ml heavy cream' },
      { es: '1 cebolla, 4 ajos, jengibre, garam masala, chile en polvo', en: '1 onion, 4 garlic cloves, ginger, garam masala, chili powder' }
    ],
    steps: [
      { es: 'Hierve urad dal y rajma remojados a presión 30-40 minutos (o 2 horas sin presión) hasta que estén completamente suaves.', en: 'Pressure cook soaked urad dal and rajma 30-40 minutes (or 2 hours without pressure) until completely soft.' },
      { es: 'En ghee y mantequilla, sofríe cebolla, ajo y jengibre 8 min. Agrega garam masala y chile. Incorpora jitomate y cocina 10 min hasta que el aceite se separe.', en: 'In ghee and butter, sauté onion, garlic and ginger 8 min. Add garam masala and chili. Add tomatoes and cook 10 min until oil separates.' },
      { es: 'Agrega las lentejas cocidas a la salsa. Cocina a fuego bajo 45 minutos revolviendo frecuentemente. Las lentejas deben deshacerse y formar una salsa espesa.', en: 'Add cooked lentils to sauce. Cook on low heat 45 minutes stirring frequently. Lentils should break down and form thick sauce.' },
      { es: 'Incorpora la crema, ajusta sal y termina con un toque de mantequilla. Sirve con arroz basmati y naan. Es el plato de lentejas más lujoso de India.', en: 'Add cream, adjust salt and finish with a touch of butter. Serve with basmati rice and naan. India\'s most luxurious lentil dish.' }
    ],
    nutrition: { calories: 380, protein: '18g', carbs: '42g', fat: '16g', fiber: '10g' }
  },
  'aloo gobi': {
    ingredients: [
      { es: '1 coliflor mediana en ramilletes', en: '1 medium cauliflower in florets' },
      { es: '3 papas en cubos de 2cm', en: '3 potatoes in 2cm cubes' },
      { es: '2 jitomates picados', en: '2 tomatoes, chopped' },
      { es: '1 cebolla picada, 3 ajos, jengibre', en: '1 onion chopped, 3 garlic cloves, ginger' },
      { es: '1 cdita cúrcuma, 1 cdita comino, 1 cdita garam masala, chile', en: '1 tsp turmeric, 1 tsp cumin, 1 tsp garam masala, chili' },
      { es: 'Cilantro fresco y ghee', en: 'Fresh cilantro and ghee' }
    ],
    steps: [
      { es: 'Calienta ghee en un kadai (wok indio). Agrega semillas de comino y espera a que chisporroteen. Sofríe cebolla, ajo y jengibre 5 min.', en: 'Heat ghee in kadai (Indian wok). Add cumin seeds and wait until they sizzle. Sauté onion, garlic and ginger 5 min.' },
      { es: 'Agrega cúrcuma, garam masala y chile. Cocina 1 min. Incorpora jitomates y cocina hasta que se deshagan.', en: 'Add turmeric, garam masala and chili. Cook 1 min. Add tomatoes and cook until they break down.' },
      { es: 'Agrega papas primero (son más duras) con un poco de agua. Tapa y cocina 10 min. Luego la coliflor, tapa y cocina 10-12 min más hasta que todo esté tierno.', en: 'Add potatoes first (they\'re harder) with a little water. Cover and cook 10 min. Then cauliflower, cover and cook 10-12 more min until tender.' },
      { es: 'Destapa, sube el fuego para dorar ligeramente. Decora con cilantro. Sirve con chapati o naan.', en: 'Uncover, raise heat to lightly brown. Garnish with cilantro. Serve with chapati or naan.' }
    ],
    nutrition: { calories: 240, protein: '6g', carbs: '32g', fat: '10g', fiber: '6g' }
  },

  // ═══ GRECIA (8 recetas) ═══
  'horiatiki|ensalada griega': {
    ingredients: [
      { es: '4 jitomates maduros en trozos', en: '4 ripe tomatoes in chunks' },
      { es: '1 pepino en rodajas gruesas', en: '1 cucumber in thick slices' },
      { es: '1 pimiento verde en aros', en: '1 green pepper in rings' },
      { es: '½ cebolla roja en rodajas finas', en: '½ red onion in thin slices' },
      { es: '200g de queso feta en bloque', en: '200g feta cheese in block' },
      { es: 'Aceitunas kalamata, orégano y aceite de oliva', en: 'Kalamata olives, oregano and olive oil' }
    ],
    steps: [
      { es: 'Corta los vegetales en trozos GRANDES (no cubos pequeños como ensalada americana). Los griegos no pican fino su horiatiki.', en: 'Cut vegetables in LARGE chunks (not small cubes like American salad). Greeks don\'t chop their horiatiki finely.' },
      { es: 'Combina jitomates, pepino, pimiento y cebolla en un plato ancho. Agrega las aceitunas kalamata enteras (con hueso).', en: 'Combine tomatoes, cucumber, pepper and onion on a wide plate. Add whole kalamata olives (with pit).' },
      { es: 'Corona con el bloque entero de feta (NO desmenuzado). Espolvorea orégano generosamente y baña con aceite de oliva. La ensalada griega NUNCA lleva lechuga.', en: 'Crown with the whole block of feta (NOT crumbled). Sprinkle oregano generously and drench with olive oil. Greek salad NEVER has lettuce.' }
    ],
    nutrition: { calories: 280, protein: '12g', carbs: '14g', fat: '22g', fiber: '3g' }
  },
  'spanakopita': {
    ingredients: [
      { es: '500g de espinacas frescas (o congeladas, bien escurridas)', en: '500g fresh spinach (or frozen, well drained)' },
      { es: '200g de queso feta desmenuzado', en: '200g crumbled feta cheese' },
      { es: '1 manojo de eneldo fresco picado', en: '1 bunch fresh dill, chopped' },
      { es: '4 cebollines picados', en: '4 scallions, chopped' },
      { es: '2 huevos', en: '2 eggs' },
      { es: '12 hojas de masa filo + mantequilla derretida', en: '12 phyllo dough sheets + melted butter' }
    ],
    steps: [
      { es: 'Saltea las espinacas hasta que se marchiten. Exprime TODO el líquido (esto es crucial para que el pastel no quede húmedo).', en: 'Sauté spinach until wilted. Squeeze ALL liquid (this is crucial so pie isn\'t soggy).' },
      { es: 'Mezcla espinacas con feta, eneldo, cebollines y huevos. El feta debe quedar en trozos, no como crema.', en: 'Mix spinach with feta, dill, scallions and eggs. Feta should stay in chunks, not creamy.' },
      { es: 'Engrasa un molde. Coloca 6 hojas de filo pintando cada una con mantequilla. Vierte el relleno. Cubre con 6 hojas más, cada una con mantequilla.', en: 'Grease a pan. Layer 6 phyllo sheets brushing each with butter. Add filling. Cover with 6 more sheets, each with butter.' },
      { es: 'Marca porciones con cuchillo. Hornea a 180°C 35-40 minutos hasta que el filo esté dorado y crujiente. El sonido al cortarlo debe ser un crunch satisfactorio.', en: 'Score portions with knife. Bake at 180°C 35-40 minutes until phyllo is golden and crispy. The sound when cutting should be a satisfying crunch.' }
    ],
    nutrition: { calories: 320, protein: '14g', carbs: '22g', fat: '20g', fiber: '3g' }
  },
  'dolmades|hojas de parra': {
    ingredients: [
      { es: '30 hojas de parra (en salmuera, enjuagadas)', en: '30 grape leaves (in brine, rinsed)' },
      { es: '1 taza de arroz de grano largo', en: '1 cup long-grain rice' },
      { es: '1 cebolla finamente picada', en: '1 onion, finely chopped' },
      { es: '½ taza de piñones tostados', en: '½ cup toasted pine nuts' },
      { es: '¼ taza de eneldo, ¼ de menta y ¼ de perejil, todo fresco', en: '¼ cup dill, ¼ mint and ¼ parsley, all fresh' },
      { es: 'Jugo de 2 limones y aceite de oliva', en: 'Juice of 2 lemons and olive oil' }
    ],
    steps: [
      { es: 'Sofríe cebolla en aceite de oliva 5 min. Agrega arroz y sofríe 2 min. Vierte ½ taza de agua y cocina 5 min. Enfría y mezcla con hierbas y piñones.', en: 'Sauté onion in olive oil 5 min. Add rice and sauté 2 min. Pour ½ cup water and cook 5 min. Cool and mix with herbs and pine nuts.' },
      { es: 'Coloca una hoja de parra con las venas hacia arriba. Pon 1 cucharada de relleno en la base. Dobla los lados hacia dentro y enrolla firmemente.', en: 'Place grape leaf vein-side up. Put 1 tablespoon filling at base. Fold sides inward and roll tightly.' },
      { es: 'Acomoda los dolmades apretados en una olla con la unión hacia abajo. Vierte agua, jugo de limón y aceite hasta cubrirlos. Pon un plato encima para que no se abran.', en: 'Arrange dolmades tightly in pot seam-side down. Pour water, lemon juice and oil to cover. Place plate on top so they don\'t open.' },
      { es: 'Cocina a fuego bajo 45-50 minutos. Sirve fríos o a temperatura ambiente con yogur y limón.', en: 'Cook on low heat 45-50 minutes. Serve cold or room temperature with yogurt and lemon.' }
    ],
    nutrition: { calories: 220, protein: '4g', carbs: '30g', fat: '10g', fiber: '2g' }
  },
  'tzatziki': {
    ingredients: [
      { es: '500g de yogur griego espeso', en: '500g thick Greek yogurt' },
      { es: '1 pepino grande rallado y exprimido', en: '1 large cucumber, grated and squeezed' },
      { es: '3 dientes de ajo rallados', en: '3 garlic cloves, grated' },
      { es: '2 cucharadas de aceite de oliva', en: '2 tablespoons olive oil' },
      { es: '1 cucharada de vinagre de vino blanco', en: '1 tablespoon white wine vinegar' },
      { es: 'Eneldo fresco y sal', en: 'Fresh dill and salt' }
    ],
    steps: [
      { es: 'Ralla el pepino y colócalo en un trapo limpio. Exprime con TODA tu fuerza para eliminar todo el agua (si no, el tzatziki queda aguado).', en: 'Grate cucumber and place in clean cloth. Squeeze with ALL your strength to remove all water (otherwise tzatziki will be watery).' },
      { es: 'Mezcla el yogur con el pepino exprimido, ajo rallado, aceite, vinagre y sal. El ajo debe ser abundante.', en: 'Mix yogurt with squeezed cucumber, grated garlic, oil, vinegar and salt. Garlic should be generous.' },
      { es: 'Refrigera mínimo 2 horas (mejor toda la noche) para que los sabores se integren. Sirve con un hilo de aceite, eneldo fresco y pan pita caliente.', en: 'Refrigerate at least 2 hours (overnight is better) for flavors to meld. Serve with a drizzle of oil, fresh dill and warm pita bread.' }
    ],
    nutrition: { calories: 120, protein: '8g', carbs: '6g', fat: '8g', fiber: '0g' }
  },
  'galaktoboureko': {
    ingredients: [
      { es: '1L de leche entera', en: '1L whole milk' },
      { es: '150g de semolina fina', en: '150g fine semolina' },
      { es: '150g de azúcar', en: '150g sugar' },
      { es: '4 huevos', en: '4 eggs' },
      { es: '50g de mantequilla', en: '50g butter' },
      { es: '12 hojas de filo + mantequilla derretida', en: '12 phyllo sheets + melted butter' },
      { es: 'Almíbar: 250g azúcar, 200ml agua, limón y canela', en: 'Syrup: 250g sugar, 200ml water, lemon and cinnamon' }
    ],
    steps: [
      { es: 'Hierve leche. Agrega semolina en lluvia batiendo. Cocina 5 min. Fuera del fuego, agrega azúcar, mantequilla y huevos batidos uno a uno. La crema debe ser espesa.', en: 'Boil milk. Add semolina in rain while beating. Cook 5 min. Off heat, add sugar, butter and beaten eggs one by one. Cream should be thick.' },
      { es: 'Forra un molde con 6 hojas de filo pintadas con mantequilla. Vierte la crema caliente. Cubre con 6 hojas más con mantequilla. Marca porciones.', en: 'Line pan with 6 buttered phyllo sheets. Pour hot cream. Cover with 6 more buttered sheets. Score portions.' },
      { es: 'Hornea a 180°C 40-45 minutos hasta que el filo esté dorado oscuro y crujiente.', en: 'Bake at 180°C 40-45 minutes until phyllo is dark golden and crispy.' },
      { es: 'Prepara el almíbar: hierve azúcar, agua, limón y canela 5 min. Vierte el almíbar FRÍO sobre el galaktoboureko CALIENTE (el contraste de temperatura es la clave).', en: 'Prepare syrup: boil sugar, water, lemon and cinnamon 5 min. Pour COLD syrup over HOT galaktoboureko (temperature contrast is key).' }
    ],
    nutrition: { calories: 380, protein: '10g', carbs: '52g', fat: '16g', fiber: '1g' }
  },
  'saganaki': {
    ingredients: [
      { es: '300g de queso kefalograviera o halloumi, en lonchas de 1cm', en: '300g kefalograviera or halloumi cheese, in 1cm slices' },
      { es: 'Harina para rebozar', en: 'Flour for coating' },
      { es: 'Aceite de oliva para freír', en: 'Olive oil for frying' },
      { es: '1 limón y pimienta negra', en: '1 lemon and black pepper' }
    ],
    steps: [
      { es: 'Remoja las lonchas de queso en agua fría 10 minutos (reduce la sal). Sécalas bien y pásalas por harina sacudiendo el exceso.', en: 'Soak cheese slices in cold water 10 minutes (reduces salt). Dry well and coat in flour shaking off excess.' },
      { es: 'Calienta aceite de oliva en un sartén pequeño (tipo sagnaki/tapas). Cuando esté caliente, fríe el queso 2 minutos por lado hasta que esté dorado y crujiente por fuera pero derretido por dentro.', en: 'Heat olive oil in small skillet (saganaki/tapas type). When hot, fry cheese 2 minutes per side until golden and crispy outside but melted inside.' },
      { es: 'Sirve inmediatamente en el mismo sartén con un chorro de limón y pimienta. En los restaurantes griegos, el mesero grita "¡OPA!" al servirlo. Se come con pan.', en: 'Serve immediately in same skillet with a squeeze of lemon and pepper. In Greek restaurants, the waiter shouts "OPA!" when serving. Eaten with bread.' }
    ],
    nutrition: { calories: 350, protein: '20g', carbs: '8g', fat: '28g', fiber: '0g' }
  },
  'gemista': {
    ingredients: [
      { es: '4 jitomates grandes y 4 pimientos, vaciados', en: '4 large tomatoes and 4 peppers, hollowed' },
      { es: '1 taza de arroz de grano largo', en: '1 cup long-grain rice' },
      { es: '1 cebolla rallada', en: '1 onion, grated' },
      { es: 'Menta, perejil y eneldo frescos', en: 'Fresh mint, parsley and dill' },
      { es: '100ml de aceite de oliva', en: '100ml olive oil' },
      { es: 'Patatas en gajos para acompañar', en: 'Potato wedges for side' }
    ],
    steps: [
      { es: 'Vacía jitomates y pimientos reservando la pulpa. Mezcla la pulpa rallada con arroz crudo, cebolla, hierbas, aceite, sal y pimienta. El relleno debe ser suelto (el arroz crecerá).', en: 'Hollow tomatoes and peppers reserving pulp. Mix grated pulp with raw rice, onion, herbs, oil, salt and pepper. Filling should be loose (rice will expand).' },
      { es: 'Rellena los vegetales solo ¾ (deja espacio para el arroz). Coloca las tapitas encima. Acomoda en un refractario con patatas en gajos entre ellos.', en: 'Fill vegetables only ¾ (leave room for rice). Place caps on top. Arrange in baking dish with potato wedges between them.' },
      { es: 'Vierte ½ taza de agua y aceite de oliva abundante. Hornea a 180°C 1 hora 15 min hasta que el arroz esté cocido y las verduras caramelizadas.', en: 'Pour ½ cup water and generous olive oil. Bake at 180°C 1 hour 15 min until rice is cooked and vegetables caramelized.' }
    ],
    nutrition: { calories: 280, protein: '6g', carbs: '38g', fat: '14g', fiber: '4g' }
  },
  'fasolada': {
    ingredients: [
      { es: '500g de frijoles blancos (cannellini), remojados 12h', en: '500g white beans (cannellini), soaked 12h' },
      { es: '2 zanahorias en cubos', en: '2 carrots, cubed' },
      { es: '2 tallos de apio en cubos', en: '2 celery stalks, cubed' },
      { es: '1 cebolla grande picada', en: '1 large onion, chopped' },
      { es: '200g de jitomate triturado', en: '200g crushed tomatoes' },
      { es: '100ml de aceite de oliva, laurel y orégano', en: '100ml olive oil, bay leaf and oregano' }
    ],
    steps: [
      { es: 'Hierve los frijoles remojados en agua limpia 10 minutos a fuego fuerte. Escurre y enjuaga (esto elimina las sustancias que causan gases).', en: 'Boil soaked beans in clean water 10 minutes on high heat. Drain and rinse (this removes gas-causing substances).' },
      { es: 'En una olla, sofríe cebolla, zanahoria y apio en aceite de oliva 5 min. Agrega jitomate, frijoles, laurel y agua hasta cubrir.', en: 'In a pot, sauté onion, carrot and celery in olive oil 5 min. Add tomatoes, beans, bay leaf and water to cover.' },
      { es: 'Cocina a fuego bajo 1.5-2 horas hasta que los frijoles estén cremosos (no al dente). Agrega orégano y el resto del aceite al final. La consistencia debe ser entre sopa y guiso.', en: 'Cook on low heat 1.5-2 hours until beans are creamy (not al dente). Add oregano and remaining oil at end. Consistency should be between soup and stew.' },
      { es: 'Sirve con aceite de oliva crudo, aceitunas y pan crujiente. Es considerada el plato nacional de Grecia.', en: 'Serve with raw olive oil, olives and crusty bread. Considered the national dish of Greece.' }
    ],
    nutrition: { calories: 340, protein: '18g', carbs: '42g', fat: '12g', fiber: '14g' }
  },
  'youvetsi': {
    ingredients: [
      { es: '800g de ternera o cordero en trozos grandes', en: '800g beef or lamb in large chunks' },
      { es: '400g de pasta kritharaki (orzo griego)', en: '400g kritharaki pasta (Greek orzo)' },
      { es: '1 lata de jitomate triturado (400g)', en: '1 can crushed tomatoes (400g)' },
      { es: '1 cebolla picada, 3 dientes de ajo', en: '1 onion chopped, 3 garlic cloves' },
      { es: '1 copa de vino tinto', en: '1 glass red wine' },
      { es: '1 raja de canela, clavo y laurel', en: '1 cinnamon stick, clove and bay leaf' },
      { es: '100g de queso kefalotyri rallado', en: '100g grated kefalotyri cheese' }
    ],
    steps: [
      { es: 'Dora la carne en aceite de oliva por todos lados. Retira. Sofríe cebolla y ajo. Deglasa con vino tinto.', en: 'Brown meat in olive oil on all sides. Remove. Sauté onion and garlic. Deglaze with red wine.' },
      { es: 'Regresa la carne, agrega jitomate, canela, clavo, laurel y 2 tazas de agua. Hornea tapado a 180°C por 1.5 horas.', en: 'Return meat, add tomatoes, cinnamon, clove, bay leaf and 2 cups water. Bake covered at 180°C for 1.5 hours.' },
      { es: 'Retira del horno, agrega la pasta kritharaki y 1 taza más de agua caliente. Mezcla y regresa al horno destapado 25-30 minutos hasta que la pasta absorba el líquido.', en: 'Remove from oven, add kritharaki pasta and 1 more cup hot water. Mix and return to oven uncovered 25-30 minutes until pasta absorbs liquid.' },
      { es: 'Espolvorea queso kefalotyri y hornea 5 minutos más. Sirve en la misma cazuela de barro. Es la comida dominical griega por excelencia.', en: 'Sprinkle kefalotyri cheese and bake 5 more minutes. Serve in same clay pot. The quintessential Greek Sunday meal.' }
    ],
    nutrition: { calories: 520, protein: '35g', carbs: '48g', fat: '20g', fiber: '3g' }
  },

  // ═══ TAILANDIA (3 recetas) ═══
  'khao pad|arroz frito': {
    ingredients: [
      { es: '3 tazas de arroz jazmín cocido del día anterior (frío)', en: '3 cups day-old jasmine rice (cold)' },
      { es: '200g de camarones pelados o pollo en cubos', en: '200g peeled shrimp or chicken cubes' },
      { es: '2 huevos', en: '2 eggs' },
      { es: '3 cebollines picados', en: '3 scallions, chopped' },
      { es: '2 cucharadas de salsa de pescado', en: '2 tablespoons fish sauce' },
      { es: '1 cucharada de salsa de soya', en: '1 tablespoon soy sauce' },
      { es: 'Limón, pepino y chile para servir', en: 'Lime, cucumber and chile for serving' }
    ],
    steps: [
      { es: 'Calienta el wok hasta que humee. Saltea la proteína 2-3 min. Retira. Rompe los huevos y revuelve rápido.', en: 'Heat wok until smoking. Stir-fry protein 2-3 min. Remove. Crack eggs and scramble quickly.' },
      { es: 'Agrega el arroz frío (el arroz del día es MUY importante, el arroz recién hecho queda chicloso). Saltea a fuego alto 3-4 min.', en: 'Add cold rice (day-old rice is VERY important, fresh rice gets mushy). Stir-fry on high heat 3-4 min.' },
      { es: 'Sazona con salsa de pescado y soya. Regresa la proteína. Agrega cebollines al final.', en: 'Season with fish sauce and soy. Return protein. Add scallions at end.' },
      { es: 'Sirve en un plato con gajos de limón, rodajas de pepino y chile fresco al lado. Es la comida rápida tailandesa por excelencia.', en: 'Serve on plate with lime wedges, cucumber slices and fresh chile on side. Thailand\'s quintessential fast food.' }
    ],
    nutrition: { calories: 420, protein: '22g', carbs: '52g', fat: '14g', fiber: '1g' }
  },
  'pla goong': {
    ingredients: [
      { es: '500g de camarones grandes cocidos y pelados', en: '500g large cooked and peeled shrimp' },
      { es: '3 tallos de lemongrass, en rodajas finas', en: '3 lemongrass stalks, thinly sliced' },
      { es: '4 chalotas en rodajas', en: '4 shallots, sliced' },
      { es: '3 cucharadas de jugo de limón', en: '3 tablespoons lime juice' },
      { es: '2 cucharadas de salsa de pescado', en: '2 tablespoons fish sauce' },
      { es: 'Chile, menta, cilantro y arroz tostado molido', en: 'Chile, mint, cilantro and toasted rice powder' }
    ],
    steps: [
      { es: 'Tuesta arroz crudo en sartén seco 5 min hasta dorar. Muele en mortero. Cocina los camarones 2 minutos en agua hirviendo y enfría en hielo.', en: 'Toast raw rice in dry skillet 5 min until golden. Grind in mortar. Cook shrimp 2 minutes in boiling water and cool in ice.' },
      { es: 'Mezcla los camarones con lemongrass, chalotas, chile, jugo de limón y salsa de pescado. El balance debe ser ácido-picante-salado.', en: 'Mix shrimp with lemongrass, shallots, chile, lime juice and fish sauce. Balance should be sour-spicy-salty.' },
      { es: 'Agrega hierbas frescas y arroz tostado justo antes de servir. Sirve sobre hojas de lechuga. Es la versión tailandesa del cóctel de camarones, mucho más vibrante.', en: 'Add fresh herbs and toasted rice just before serving. Serve on lettuce leaves. Thailand\'s version of shrimp cocktail, much more vibrant.' }
    ],
    nutrition: { calories: 200, protein: '30g', carbs: '10g', fat: '4g', fiber: '1g' }
  },
  'som tum|papaya': {
    ingredients: [
      { es: '2 tazas de papaya verde rallada', en: '2 cups shredded green papaya' },
      { es: '6 ejotes, cortados en trozos', en: '6 green beans, cut in pieces' },
      { es: '8 jitomates cherry', en: '8 cherry tomatoes' },
      { es: '2 cucharadas de cacahuates tostados', en: '2 tablespoons roasted peanuts' },
      { es: '3 dientes de ajo y 3-5 chiles bird\'s eye', en: '3 garlic cloves and 3-5 bird\'s eye chiles' },
      { es: '2 cdas salsa de pescado, 2 cdas jugo de limón, 1 cda azúcar de palma', en: '2 tbsp fish sauce, 2 tbsp lime juice, 1 tbsp palm sugar' },
      { es: 'Camarones secos (opcional)', en: 'Dried shrimp (optional)' }
    ],
    steps: [
      { es: 'En un mortero grande (krok), machaca ajo y chiles. Agrega ejotes y jitomates cherry, golpeando suavemente (no hagas puré, solo libera jugos).', en: 'In a large mortar (krok), pound garlic and chiles. Add green beans and cherry tomatoes, pounding gently (don\'t purée, just release juices).' },
      { es: 'Agrega salsa de pescado, limón y azúcar de palma. Mezcla con la mano del mortero. El balance agridulce-picante-salado es la esencia del plato.', en: 'Add fish sauce, lime and palm sugar. Mix with pestle. The sweet-sour-spicy-salty balance is the dish\'s essence.' },
      { es: 'Incorpora la papaya verde rallada y los cacahuates. Mezcla con dos cucharas golpeando suavemente. Prueba y ajusta: ¿más ácido? ¿más picante? ¿más salado?', en: 'Add shredded green papaya and peanuts. Mix with two spoons gently pounding. Taste and adjust: more sour? more spicy? more salty?' },
      { es: 'Sirve sobre una hoja de col con arroz glutinoso al lado. Es la ensalada más icónica de Tailandia y cada puesto callejero tiene su versión.', en: 'Serve on cabbage leaf with sticky rice on side. Thailand\'s most iconic salad and every street stall has its own version.' }
    ],
    nutrition: { calories: 160, protein: '8g', carbs: '20g', fat: '6g', fiber: '3g' }
  },
  'satay': {
    ingredients: [
      { es: '600g de muslos de pollo en tiras', en: '600g chicken thighs in strips' },
      { es: 'Marinada: 2 cdas curry en polvo, 1 cda cúrcuma, leche de coco, salsa de pescado', en: 'Marinade: 2 tbsp curry powder, 1 tbsp turmeric, coconut milk, fish sauce' },
      { es: 'Salsa cacahuate: 200g cacahuate tostado, leche de coco, curry rojo, tamarindo, azúcar', en: 'Peanut sauce: 200g roasted peanuts, coconut milk, red curry, tamarind, sugar' },
      { es: '20 brochetas de bambú remojadas', en: '20 soaked bamboo skewers' },
      { es: 'Ajad (pepino en vinagre) para acompañar', en: 'Ajad (cucumber in vinegar) for side' }
    ],
    steps: [
      { es: 'Marina el pollo con curry, cúrcuma, leche de coco y salsa de pescado mínimo 4 horas (toda la noche ideal). El pollo se teñirá amarillo.', en: 'Marinate chicken with curry, turmeric, coconut milk and fish sauce at least 4 hours (overnight ideal). Chicken will turn yellow.' },
      { es: 'Ensarta en brochetas en zigzag (como un acordeón). Asa en parrilla de carbón a fuego alto 3-4 min por lado, barnizando con leche de coco.', en: 'Thread onto skewers in zigzag (like accordion). Grill over charcoal on high heat 3-4 min per side, basting with coconut milk.' },
      { es: 'Salsa: licúa cacahuates con leche de coco, pasta de curry rojo, tamarindo y azúcar. Cocina 5 min hasta espesar.', en: 'Sauce: blend peanuts with coconut milk, red curry paste, tamarind and sugar. Cook 5 min until thick.' },
      { es: 'Sirve las brochetas humeantes sobre la salsa con ajad (pepino + chalota en vinagre + chile). Es el street food tailandés más famoso del mundo.', en: 'Serve smoking skewers over sauce with ajad (cucumber + shallot in vinegar + chile). The world\'s most famous Thai street food.' }
    ],
    nutrition: { calories: 420, protein: '32g', carbs: '18g', fat: '26g', fiber: '2g' }
  },
  'pollo con anacardos|gai med': {
    ingredients: [
      { es: '500g de pechuga de pollo en cubos de 2cm', en: '500g chicken breast in 2cm cubes' },
      { es: '1 taza de anacardos (cashews) tostados', en: '1 cup toasted cashews' },
      { es: '6 chiles secos grandes', en: '6 large dried chiles' },
      { es: '1 cebolla en cubos grandes', en: '1 onion in large cubes' },
      { es: '3 cebollines en trozos de 3cm', en: '3 scallions in 3cm pieces' },
      { es: '2 cdas salsa de ostión, 1 cda soya, 1 cdita azúcar', en: '2 tbsp oyster sauce, 1 tbsp soy sauce, 1 tsp sugar' },
      { es: '2 dientes de ajo picados', en: '2 garlic cloves, minced' }
    ],
    steps: [
      { es: 'Saltea los chiles secos en aceite 30 seg hasta que oscurezcan. Agrega ajo y cebolla 1 min.', en: 'Stir-fry dried chiles in oil 30 sec until darkened. Add garlic and onion 1 min.' },
      { es: 'Sube el fuego al máximo. Agrega el pollo y saltea 3-4 minutos sin mover al inicio para que dore bien.', en: 'Raise heat to maximum. Add chicken and stir-fry 3-4 minutes without moving initially to brown well.' },
      { es: 'Sazona con salsa de ostión, soya y azúcar. Agrega los anacardos y cebollines. Mezcla 30 segundos más. Los anacardos deben quedar crujientes, no blandos.', en: 'Season with oyster sauce, soy and sugar. Add cashews and scallions. Toss 30 more seconds. Cashews should stay crunchy, not soft.' },
      { es: 'Sirve inmediatamente sobre arroz jazmín al vapor. Es un plato real tailandés (Gai Med Ma Muang) con el contraste perfecto de texturas.', en: 'Serve immediately over steamed jasmine rice. A Thai royal dish (Gai Med Ma Muang) with perfect texture contrast.' }
    ],
    nutrition: { calories: 440, protein: '32g', carbs: '20g', fat: '26g', fiber: '2g' }
  },

  // ═══ USA (3 recetas) ═══
  'mac.*cheese': {
    ingredients: [
      { es: '500g de pasta codo (elbow macaroni)', en: '500g elbow macaroni' },
      { es: '300g de queso cheddar fuerte rallado', en: '300g sharp cheddar, shredded' },
      { es: '100g de queso gruyère rallado', en: '100g Gruyère, shredded' },
      { es: '60g de mantequilla y 60g de harina', en: '60g butter and 60g flour' },
      { es: '700ml de leche entera', en: '700ml whole milk' },
      { es: '1 cdita de mostaza seca y pimentón', en: '1 tsp dry mustard and paprika' },
      { es: 'Pan rallado con mantequilla para la costra', en: 'Buttered breadcrumbs for crust' }
    ],
    steps: [
      { es: 'Cuece la pasta 2 minutos MENOS del tiempo indicado (terminará de cocinarse en el horno). Escurre.', en: 'Cook pasta 2 minutes LESS than indicated time (will finish cooking in oven). Drain.' },
      { es: 'Bechamel: roux de mantequilla y harina, vierte leche poco a poco. Cocina 5 min. Agrega mostaza y ¾ de los quesos revolviendo hasta fundir.', en: 'Béchamel: butter and flour roux, pour milk gradually. Cook 5 min. Add mustard and ¾ of cheeses stirring until melted.' },
      { es: 'Mezcla la pasta con la salsa de queso. Vierte en un refractario engrasado. Cubre con el queso restante y pan rallado con mantequilla.', en: 'Mix pasta with cheese sauce. Pour into greased baking dish. Top with remaining cheese and buttered breadcrumbs.' },
      { es: 'Hornea a 190°C 25-30 minutos hasta que la superficie esté dorada y burbujee. Deja reposar 10 minutos para que la salsa se asiente. El comfort food americano por excelencia.', en: 'Bake at 190°C 25-30 minutes until surface is golden and bubbly. Rest 10 minutes for sauce to set. The quintessential American comfort food.' }
    ],
    nutrition: { calories: 580, protein: '24g', carbs: '52g', fat: '30g', fiber: '2g' }
  },
  'clam chowder': {
    ingredients: [
      { es: '1 kg de almejas frescas (littleneck o cherrystone)', en: '1 kg fresh clams (littleneck or cherrystone)' },
      { es: '200g de panceta (bacon) en cubitos', en: '200g diced bacon' },
      { es: '3 papas en cubos de 1cm', en: '3 potatoes in 1cm cubes' },
      { es: '1 cebolla picada, 2 tallos de apio', en: '1 chopped onion, 2 celery stalks' },
      { es: '500ml de crema de leche', en: '500ml heavy cream' },
      { es: '2 cucharadas de harina', en: '2 tablespoons flour' },
      { es: 'Tomillo, laurel y galletas de ostión (oyster crackers)', en: 'Thyme, bay leaf and oyster crackers' }
    ],
    steps: [
      { es: 'Hierve las almejas en 2 tazas de agua hasta que se abran (5 min). Reserva el caldo (¡es oro líquido!). Retira las almejas de sus conchas y pica.', en: 'Boil clams in 2 cups water until they open (5 min). Reserve broth (liquid gold!). Remove clams from shells and chop.' },
      { es: 'Fríe la panceta hasta crujiente. En la misma grasa, sofríe cebolla y apio 5 min. Agrega harina y cocina 2 min (roux).', en: 'Fry bacon until crispy. In same fat, sauté onion and celery 5 min. Add flour and cook 2 min (roux).' },
      { es: 'Vierte el caldo de almejas colado. Agrega papas, tomillo y laurel. Cocina 15 min hasta que las papas estén tiernas.', en: 'Pour strained clam broth. Add potatoes, thyme and bay leaf. Cook 15 min until potatoes are tender.' },
      { es: 'Incorpora la crema y las almejas picadas. Calienta sin hervir (hervir endurece las almejas). Sirve en un bowl de pan o con oyster crackers. Es el sabor de Nueva Inglaterra.', en: 'Add cream and chopped clams. Heat without boiling (boiling toughens clams). Serve in bread bowl or with oyster crackers. The taste of New England.' }
    ],
    nutrition: { calories: 480, protein: '28g', carbs: '30g', fat: '28g', fiber: '2g' }
  },
  'clam bake': {
    ingredients: [
      { es: '2 kg de almejas y mejillones limpios', en: '2 kg cleaned clams and mussels' },
      { es: '1 kg de langosta o cangrejo', en: '1 kg lobster or crab' },
      { es: '8 mazorcas de maíz', en: '8 corn on the cob' },
      { es: '1 kg de papas pequeñas', en: '1 kg small potatoes' },
      { es: '500g de chorizo o salchicha andouille', en: '500g chorizo or andouille sausage' },
      { es: 'Mantequilla derretida con ajo y limón', en: 'Melted butter with garlic and lemon' },
      { es: 'Cerveza (1 botella) y Old Bay seasoning', en: 'Beer (1 bottle) and Old Bay seasoning' }
    ],
    steps: [
      { es: 'En una olla gigante, coloca capas: papas al fondo (tardan más), luego salchichas, maíz en trozos y los mariscos encima. Vierte la cerveza.', en: 'In giant pot, layer: potatoes on bottom (take longest), then sausages, corn in pieces and seafood on top. Pour beer in.' },
      { es: 'Espolvorea Old Bay generosamente. Tapa herméticamente y cocina al vapor a fuego alto 20-25 minutos hasta que las almejas se abran y la langosta esté roja.', en: 'Sprinkle Old Bay generously. Seal tightly and steam on high heat 20-25 minutes until clams open and lobster is red.' },
      { es: 'Vierte TODO sobre una mesa cubierta con papel periódico. La tradición de Nueva Inglaterra es comer directamente de la mesa con las manos, mojando en mantequilla con ajo.', en: 'Pour EVERYTHING onto newspaper-covered table. New England tradition is eating directly from table with hands, dipping in garlic butter.' }
    ],
    nutrition: { calories: 580, protein: '42g', carbs: '38g', fat: '28g', fiber: '3g' }
  }
};

async function fixBatch() {
  console.log('🌍 BATCH 8B: Italia, India, Grecia, Tailandia, USA\n');
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
    console.log(`\n🎉 Batch 8B completado: ${fixed} recetas corregidas`);
  } catch (error) { console.error('❌ Error:', error); }
  finally { if (conn) conn.release(); pool.end(); }
}
fixBatch();
