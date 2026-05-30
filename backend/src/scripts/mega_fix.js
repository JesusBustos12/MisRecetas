import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// ═══════════════════════════════════════════════════════════
// RECETAS CON PASOS GENÉRICOS "VEGETALES" — necesitan pasos reales
// ═══════════════════════════════════════════════════════════
const vegTemplateFixes = [
  {
    id: 10, name: 'Berenjenas Yu Xiang',
    steps: [
      { es: 'Corta las berenjenas en bastones gruesos. Fríe en aceite caliente (190°C) por 3-4 min hasta dorar. Escurre en papel absorbente.', en: 'Cut eggplants into thick batons. Deep-fry in hot oil (375°F) for 3-4 min until golden. Drain on paper towels.' },
      { es: 'Prepara la salsa Yu Xiang: mezcla pasta de chile doubanjiang, vinagre de arroz, salsa de soya, azúcar y un poco de caldo. Reserva.', en: 'Prepare Yu Xiang sauce: mix doubanjiang chili paste, rice vinegar, soy sauce, sugar and a bit of broth. Set aside.' },
      { es: 'Saltea ajo, jengibre y cebollín en un wok caliente con aceite. Agrega la carne de cerdo picada y cocina 2 minutos.', en: 'Stir-fry garlic, ginger and scallions in a hot wok with oil. Add minced pork and cook 2 minutes.' },
      { es: 'Incorpora las berenjenas fritas y vierte la salsa Yu Xiang. Mezcla a fuego alto 1 minuto. Espesa con fécula de maíz disuelta en agua. Sirve con arroz blanco.', en: 'Add fried eggplants and pour in the Yu Xiang sauce. Toss on high heat 1 minute. Thicken with cornstarch slurry. Serve over white rice.' },
    ],
  },
  {
    id: 11, name: 'Dim Sum al Vapor',
    steps: [
      { es: 'Prepara la masa: mezcla harina de trigo con agua caliente hasta formar una masa suave. Amasa 5 minutos, cubre con plástico y reposa 20 min.', en: 'Make the dough: mix wheat flour with hot water until a soft dough forms. Knead 5 minutes, cover with plastic and rest 20 min.' },
      { es: 'Para el relleno: pica camarones y cerdo finamente. Mezcla con salsa de soya, aceite de sésamo, jengibre rallado, pimienta blanca y un poco de fécula.', en: 'For the filling: finely chop shrimp and pork. Mix with soy sauce, sesame oil, grated ginger, white pepper and a bit of starch.' },
      { es: 'Divide la masa en 20 bolitas. Aplana cada una en un disco fino. Coloca una cucharada de relleno y pliega en forma de bolsita con pliegues decorativos.', en: 'Divide dough into 20 balls. Flatten each into a thin disc. Place a tablespoon of filling and fold into a dumpling shape with decorative pleats.' },
      { es: 'Coloca los dim sum en una vaporera de bambú forrada con papel perforado. Cocina al vapor 8-10 minutos. Sirve con salsa de soya y chili oil.', en: 'Place dim sum in a bamboo steamer lined with perforated paper. Steam for 8-10 minutes. Serve with soy sauce and chili oil.' },
    ],
  },
  {
    id: 12, name: 'Rollitos de Primavera Crujientes',
    steps: [
      { es: 'Corta en juliana fina: col, zanahoria, champiñones y brotes de soya. Saltea en wok con aceite de sésamo por 2 minutos. Sazona con salsa de soya y pimienta. Enfría completamente.', en: 'Julienne finely: cabbage, carrot, mushrooms and bean sprouts. Stir-fry in a wok with sesame oil for 2 minutes. Season with soy sauce and pepper. Cool completely.' },
      { es: 'Coloca una lámina de masa spring roll en diagonal. Pon 2 cucharadas de relleno en el tercio inferior. Dobla la esquina inferior, luego los lados, y enrolla apretando bien. Sella la punta con agua.', en: 'Place a spring roll wrapper diagonally. Put 2 tablespoons of filling on the lower third. Fold the bottom corner, then the sides, and roll tightly. Seal the tip with water.' },
      { es: 'Calienta aceite a 180°C. Fríe los rollitos en tandas de 3-4 por 3-4 min, girándolos, hasta dorar parejo. Escurre en rejilla.', en: 'Heat oil to 350°F. Fry the rolls in batches of 3-4 for 3-4 min, turning them, until evenly golden. Drain on a rack.' },
      { es: 'Sirve inmediatamente con salsa agridulce o salsa de ciruela para dipping.', en: 'Serve immediately with sweet and sour sauce or plum sauce for dipping.' },
    ],
  },
  {
    id: 13, name: 'Rollitos Dulces de Primavera',
    steps: [
      { es: 'Pela y corta plátanos maduros en bastones. Espolvorea con canela y azúcar morena. Opcional: agrega trocitos de chocolate.', en: 'Peel and cut ripe bananas into batons. Sprinkle with cinnamon and brown sugar. Optional: add chocolate chips.' },
      { es: 'Envuelve cada bastón de plátano en una lámina de masa spring roll, doblando los lados y enrollando firme. Sella con agua.', en: 'Wrap each banana baton in a spring roll wrapper, folding the sides and rolling tightly. Seal with water.' },
      { es: 'Fríe en aceite caliente (170°C) por 2-3 minutos hasta dorar. Escurre en papel absorbente.', en: 'Fry in hot oil (340°F) for 2-3 minutes until golden. Drain on paper towels.' },
      { es: 'Espolvorea con azúcar glass y canela extra. Sirve con helado de vainilla o salsa de chocolate caliente.', en: 'Dust with powdered sugar and extra cinnamon. Serve with vanilla ice cream or warm chocolate sauce.' },
    ],
  },
  {
    id: 24, name: 'Tempura Mixto',
    steps: [
      { es: 'Prepara los vegetales y camarones: corta berenjena, camote y calabacín en rodajas finas. Limpia los camarones dejando la cola. Seca todo con papel.', en: 'Prepare vegetables and shrimp: slice eggplant, sweet potato and zucchini thin. Clean shrimp leaving tails. Pat everything dry.' },
      { es: 'Prepara la masa tempura: mezcla harina, fécula de maíz, un huevo y agua helada con gas. Revuelve apenas — los grumos son deseables para una textura crujiente.', en: 'Make tempura batter: mix flour, cornstarch, one egg and ice-cold sparkling water. Stir barely — lumps are desirable for a crispy texture.' },
      { es: 'Calienta aceite a 180°C. Sumerge cada pieza en la masa y fríe en tandas sin sobrellenar. Cocina 2-3 min por lado hasta dorar ligeramente.', en: 'Heat oil to 350°F. Dip each piece in batter and fry in batches without overcrowding. Cook 2-3 min per side until lightly golden.' },
      { es: 'Escurre en rejilla. Sirve de inmediato con tentsuyu (salsa de dashi, soya y mirin) y rábano daikon rallado.', en: 'Drain on a rack. Serve immediately with tentsuyu (dashi, soy and mirin sauce) and grated daikon radish.' },
    ],
  },
  {
    id: 44, name: 'Guacamole Tradicional',
    steps: [
      { es: 'Corta los aguacates por la mitad, retira el hueso y extrae la pulpa con cuchara. Coloca en un molcajete o bowl.', en: 'Cut avocados in half, remove the pit and scoop out the flesh. Place in a molcajete or bowl.' },
      { es: 'Machaca con tenedor dejando trozos irregulares (no debe quedar liso). Exprime el jugo de limón inmediatamente para evitar oxidación.', en: 'Mash with a fork leaving irregular chunks (it shouldn\'t be smooth). Squeeze lime juice immediately to prevent browning.' },
      { es: 'Incorpora tomate picado en cubos pequeños, cebolla blanca finamente picada, chile serrano al gusto y cilantro fresco picado.', en: 'Fold in diced tomato, finely chopped white onion, serrano chile to taste and fresh chopped cilantro.' },
      { es: 'Sazona con sal al gusto. Sirve inmediatamente con totopos de maíz. Cubre con plástico al ras de la superficie si necesitas guardar.', en: 'Season with salt to taste. Serve immediately with corn tortilla chips. Press plastic wrap directly on the surface if storing.' },
    ],
  },
  {
    id: 77, name: 'Risotto Porcini',
    steps: [
      { es: 'Remoja los hongos porcini secos en 2 tazas de agua caliente por 20 minutos. Cuela y reserva el líquido (oro líquido). Pica los hongos.', en: 'Soak dried porcini mushrooms in 2 cups hot water for 20 minutes. Strain and reserve the liquid (liquid gold). Chop the mushrooms.' },
      { es: 'En olla amplia, sofríe cebolla en mantequilla 3 min. Agrega arroz arborio y tuesta 2 min revolviendo hasta que los bordes se vean translúcidos.', en: 'In a wide pot, sauté onion in butter 3 min. Add arborio rice and toast 2 min stirring until edges look translucent.' },
      { es: 'Agrega vino blanco y revuelve hasta absorber. Luego añade cucharones de caldo caliente uno a uno, esperando que se absorba antes de agregar más. Incorpora los porcini y su líquido colado a la mitad del proceso. Total: 18-20 min.', en: 'Add white wine and stir until absorbed. Then add ladles of hot broth one at a time, waiting for each to absorb before adding more. Add porcini and their strained liquid halfway through. Total: 18-20 min.' },
      { es: 'Retira del fuego. Agrega mantequilla fría y parmesano rallado. Revuelve vigorosamente (mantecatura). Debe quedar cremoso y fluido. Sirve inmediatamente con parmesano extra.', en: 'Remove from heat. Add cold butter and grated parmesan. Stir vigorously (mantecatura). It should be creamy and flowing. Serve immediately with extra parmesan.' },
    ],
  },
  {
    id: 78, name: 'Tiramisú',
    steps: [
      { es: 'Separa las yemas de las claras. Bate las yemas con el azúcar hasta obtener una crema pálida y esponjosa. Incorpora el mascarpone mezclando suavemente.', en: 'Separate egg yolks from whites. Beat yolks with sugar until a pale, fluffy cream forms. Fold in mascarpone gently.' },
      { es: 'Bate las claras a punto de nieve firme. Incorpora al mascarpone con movimientos envolventes para mantener el aire.', en: 'Beat egg whites to stiff peaks. Fold into the mascarpone mixture with gentle folding motions to keep the air.' },
      { es: 'Prepara café espresso bien fuerte y déjalo enfriar. Sumerge cada savoiardi (bizcocho) brevemente — no empapar — y coloca una capa en el molde. Alterna con crema de mascarpone.', en: 'Brew strong espresso and let it cool. Briefly dip each ladyfinger — don\'t soak — and arrange a layer in the dish. Alternate with mascarpone cream.' },
      { es: 'Termina con una capa de crema. Refrigera mínimo 6 horas (idealmente toda la noche). Antes de servir, espolvorea generosamente con cacao amargo en polvo.', en: 'Finish with a cream layer. Refrigerate at least 6 hours (ideally overnight). Before serving, dust generously with unsweetened cocoa powder.' },
    ],
  },
  {
    id: 80, name: 'Gelato Artesanal',
    steps: [
      { es: 'Calienta la leche entera con la crema en una olla a fuego medio hasta que empiece a humear (no hervir). Retira del fuego.', en: 'Heat whole milk with cream in a pot over medium heat until it starts steaming (don\'t boil). Remove from heat.' },
      { es: 'Bate las yemas con el azúcar hasta que dupliquen volumen y estén pálidas. Vierte la leche caliente en hilo fino batiendo constantemente (temperar).', en: 'Beat yolks with sugar until doubled in volume and pale. Pour the hot milk in a thin stream while whisking constantly (tempering).' },
      { es: 'Regresa la mezcla a fuego bajo. Cocina revolviendo sin parar con cuchara de madera hasta que cubra el dorso (82°C). Cuela y enfría en baño de hielo.', en: 'Return the mixture to low heat. Cook stirring constantly with a wooden spoon until it coats the back (180°F). Strain and cool in an ice bath.' },
      { es: 'Refrigera la base 8 horas. Vierte en máquina de helado y procesa según instrucciones. Congela 2 horas más para textura firme pero cremosa.', en: 'Refrigerate the base 8 hours. Pour into ice cream machine and process per instructions. Freeze 2 more hours for firm yet creamy texture.' },
    ],
  },
  {
    id: 99, name: 'Paella Valenciana',
    steps: [
      { es: 'En paellera amplia, dora el pollo y el conejo troceados en aceite de oliva a fuego alto. Retira y reserva.', en: 'In a wide paella pan, brown the chopped chicken and rabbit in olive oil over high heat. Remove and set aside.' },
      { es: 'En la misma grasa, sofríe judía verde y garrofón 5 min. Agrega tomate rallado y cocina hasta que oscurezca. Añade pimentón, remueve 10 seg y agrega agua inmediatamente.', en: 'In the same fat, sauté green beans and lima beans 5 min. Add grated tomato and cook until dark. Add paprika, stir 10 sec and add water immediately.' },
      { es: 'Vuelve la carne, sube el fuego y hierve 20 min. Agrega azafrán y sal. Distribuye el arroz en forma de cruz para medirlo. Sube el fuego al máximo los primeros 7 min, luego baja a medio por 13 min más.', en: 'Return the meat, raise heat and boil 20 min. Add saffron and salt. Spread the rice in a cross shape to measure. High heat for the first 7 min, then medium for 13 more min.' },
      { es: 'Sube el fuego 30 segundos al final para crear el socarrat. Retira del fuego, cubre con un paño y reposa 5 minutos antes de servir con limón.', en: 'Raise heat 30 seconds at the end to create the socarrat. Remove from heat, cover with a cloth and rest 5 minutes before serving with lemon.' },
    ],
  },
  {
    id: 101, name: 'Gazpacho Andaluz',
    steps: [
      { es: 'Corta los tomates maduros, pepino, pimiento verde y cebolla en trozos gruesos. Remoja la miga de pan duro en agua.', en: 'Roughly chop ripe tomatoes, cucumber, green pepper and onion. Soak stale bread crumb in water.' },
      { es: 'Coloca todo en la licuadora con ajo, vinagre de Jerez, aceite de oliva virgen extra y sal. Tritura a máxima velocidad durante 2 minutos hasta obtener una textura completamente lisa.', en: 'Place everything in the blender with garlic, sherry vinegar, extra virgin olive oil and salt. Blend at max speed for 2 minutes until completely smooth.' },
      { es: 'Pasa por un colador fino para una textura sedosa (opcional). Ajusta sal y vinagre. Refrigera mínimo 2 horas — se sirve muy frío.', en: 'Pass through a fine strainer for silky texture (optional). Adjust salt and vinegar. Refrigerate at least 2 hours — serve very cold.' },
      { es: 'Sirve en boles fríos con guarnición picada: cubos de tomate, pepino, pimiento, huevo duro y un buen chorro de aceite de oliva.', en: 'Serve in chilled bowls with diced garnish: tomato, cucumber, pepper, hard-boiled egg and a generous drizzle of olive oil.' },
    ],
  },
  {
    id: 126, name: 'Croissants de Mantequilla',
    steps: [
      { es: 'Prepara la masa: mezcla harina, azúcar, sal, levadura y leche tibia. Amasa 5 min hasta formar una masa lisa. Refrigera 1 hora envuelta en plástico.', en: 'Make the dough: mix flour, sugar, salt, yeast and warm milk. Knead 5 min until smooth. Refrigerate 1 hour wrapped in plastic.' },
      { es: 'Lamina la mantequilla fría entre papel en un cuadrado de 15cm. Envuelve la mantequilla con la masa y haz el primer pliegue triple. Refrigera 30 min. Repite 2 pliegues más con reposos.', en: 'Roll cold butter between paper into a 15cm square. Encase the butter with the dough and do the first triple fold. Refrigerate 30 min. Repeat 2 more folds with rests.' },
      { es: 'Estira la masa a 5mm de grosor. Corta triángulos alargados (base 9cm). Enrolla desde la base hacia la punta con tensión suave, curvando las puntas en forma de media luna.', en: 'Roll dough to 5mm thick. Cut elongated triangles (9cm base). Roll from base to tip with gentle tension, curving ends into a crescent shape.' },
      { es: 'Coloca en charola con papel. Pinta con huevo batido. Fermenta 2 horas a temperatura ambiente hasta doblar tamaño. Hornea a 200°C por 15-18 min hasta dorar intensamente.', en: 'Place on a lined baking sheet. Brush with beaten egg. Proof 2 hours at room temp until doubled. Bake at 400°F for 15-18 min until deeply golden.' },
    ],
  },
  {
    id: 147, name: 'Chana Masala',
    steps: [
      { es: 'Remoja los garbanzos secos toda la noche. Cuece en olla exprés con sal y una pizca de bicarbonato por 20 min hasta que estén tiernos pero firmes.', en: 'Soak dried chickpeas overnight. Pressure cook with salt and a pinch of baking soda for 20 min until tender but firm.' },
      { es: 'En una sartén amplia, calienta aceite y fríe comino, cardamomo y clavo 30 segundos. Agrega cebolla picada y cocina hasta dorar profundamente (8-10 min).', en: 'In a wide pan, heat oil and fry cumin, cardamom and cloves 30 seconds. Add chopped onion and cook until deeply golden (8-10 min).' },
      { es: 'Añade pasta de jengibre-ajo, tomate picado, cúrcuma, garam masala, chile en polvo y amchur (mango seco en polvo). Cocina hasta que el tomate se deshaga y el aceite se separe.', en: 'Add ginger-garlic paste, diced tomato, turmeric, garam masala, chili powder and amchur (dried mango powder). Cook until tomato breaks down and oil separates.' },
      { es: 'Incorpora los garbanzos escurridos con un poco de su agua de cocción. Cocina 10 min a fuego medio. Aplasta algunos garbanzos para espesar. Sirve con cilantro fresco y arroz basmati.', en: 'Add drained chickpeas with some of their cooking water. Simmer 10 min on medium heat. Mash a few chickpeas to thicken. Serve with fresh cilantro and basmati rice.' },
    ],
  },
  {
    id: 153, name: 'Mango Sticky Rice',
    steps: [
      { es: 'Remoja el arroz glutinoso en agua fría mínimo 4 horas (idealmente toda la noche). Escurre bien.', en: 'Soak glutinous rice in cold water at least 4 hours (ideally overnight). Drain well.' },
      { es: 'Cocina el arroz al vapor en una vaporera de bambú forrada con manta, durante 25-30 minutos hasta que esté translúcido y tierno.', en: 'Steam the rice in a bamboo steamer lined with cheesecloth for 25-30 minutes until translucent and tender.' },
      { es: 'Calienta leche de coco con azúcar y una pizca de sal hasta disolver. Vierte ¾ de esta mezcla sobre el arroz caliente. Mezcla suavemente y deja absorber 30 min tapado.', en: 'Heat coconut milk with sugar and a pinch of salt until dissolved. Pour ¾ of this mixture over the hot rice. Fold gently and let absorb 30 min covered.' },
      { es: 'Pela y corta mango maduro en láminas. Sirve el arroz en un plato con el mango al lado. Vierte la leche de coco restante y espolvorea con semillas de sésamo tostadas.', en: 'Peel and slice ripe mango. Serve the rice on a plate with mango on the side. Drizzle remaining coconut milk and sprinkle with toasted sesame seeds.' },
    ],
  },
  {
    id: 168, name: 'Baklava de Pistacho',
    steps: [
      { es: 'Pica los pistachos y nueces groseramente (no polvo). Mezcla con canela y un poco de azúcar. Derrite mantequilla clarificada.', en: 'Roughly chop pistachios and walnuts (not powder). Mix with cinnamon and a little sugar. Melt clarified butter.' },
      { es: 'Pinta un molde con mantequilla. Coloca 8 láminas de masa filo una por una, pintando cada una con mantequilla. Esparce una capa de frutos secos. Repite: 4 hojas de filo + nueces, hasta terminar con 8 hojas arriba.', en: 'Brush a baking dish with butter. Layer 8 phyllo sheets one by one, brushing each with butter. Spread a layer of nuts. Repeat: 4 phyllo sheets + nuts, ending with 8 sheets on top.' },
      { es: 'Con cuchillo afilado, corta en rombos antes de hornear. Hornea a 160°C por 45-50 min hasta que esté dorada y crujiente.', en: 'With a sharp knife, cut into diamond shapes before baking. Bake at 325°F for 45-50 min until golden and crispy.' },
      { es: 'Mientras hornea, prepara el almíbar: hierve agua, azúcar, miel y un toque de agua de rosas 10 min. Al sacar del horno, vierte el almíbar frío sobre el baklava caliente. Deja reposar mínimo 4 horas.', en: 'While baking, make the syrup: boil water, sugar, honey and a touch of rose water 10 min. When out of the oven, pour cold syrup over hot baklava. Rest at least 4 hours.' },
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// RECETAS CON PASOS E INGREDIENTES GENÉRICOS "PASTEL"
// ═══════════════════════════════════════════════════════════
const cakeTemplateFixes = [
  {
    id: 46, name: 'Flan de Cajeta',
    ingredients: [
      { es: '1 lata de leche condensada', en: '1 can sweetened condensed milk' },
      { es: '1 lata de leche evaporada', en: '1 can evaporated milk' },
      { es: '4 huevos grandes', en: '4 large eggs' },
      { es: '1 cucharadita de extracto de vainilla', en: '1 teaspoon vanilla extract' },
      { es: '1 taza de cajeta (dulce de leche mexicano)', en: '1 cup cajeta (Mexican caramel)' },
      { es: '¾ taza de azúcar para caramelo', en: '¾ cup sugar for caramel' },
    ],
    steps: [
      { es: 'Derrite el azúcar en una olla a fuego medio sin revolver, solo girando la olla, hasta obtener un caramelo ámbar oscuro. Vierte en el fondo de un molde para flan. Gira para cubrir.', en: 'Melt sugar in a pot over medium heat without stirring, just swirling the pot, until a dark amber caramel forms. Pour into the bottom of a flan mold. Swirl to coat.' },
      { es: 'Licúa la leche condensada, evaporada, huevos, vainilla y cajeta por 1 minuto hasta integrar. Cuela sobre el molde caramelizado.', en: 'Blend condensed milk, evaporated milk, eggs, vanilla and cajeta for 1 minute until smooth. Strain over the caramel-coated mold.' },
      { es: 'Cubre con aluminio. Hornea en baño maría a 160°C por 50-60 min hasta que al insertar un cuchillo salga limpio. El centro debe temblar ligeramente.', en: 'Cover with foil. Bake in a water bath at 325°F for 50-60 min until a knife inserted comes out clean. Center should jiggle slightly.' },
      { es: 'Enfría a temperatura ambiente, luego refrigera mínimo 4 horas. Para desmoldar, pasa un cuchillo por los bordes y voltea sobre un plato. El caramelo cubrirá el flan.', en: 'Cool to room temp, then refrigerate at least 4 hours. To unmold, run a knife around the edges and flip onto a plate. The caramel will coat the flan.' },
    ],
    nutrition: { calories: 320, protein: 9, carbs: 48, fat: 10, fiber: 0, sugar: 42 },
  },
  {
    id: 71, name: 'Pumpkin Pie',
    ingredients: [
      { es: '1 lata (425g) de puré de calabaza', en: '1 can (15oz) pumpkin purée' },
      { es: '1 lata de leche evaporada', en: '1 can evaporated milk' },
      { es: '2 huevos grandes', en: '2 large eggs' },
      { es: '¾ taza de azúcar morena', en: '¾ cup brown sugar' },
      { es: '1 cucharadita de canela + ½ nuez moscada + ¼ jengibre molido', en: '1 tsp cinnamon + ½ tsp nutmeg + ¼ tsp ground ginger' },
      { es: '1 base de masa para pay (comprada o casera)', en: '1 pie crust (store-bought or homemade)' },
      { es: 'Crema batida para servir', en: 'Whipped cream for serving' },
    ],
    steps: [
      { es: 'Precalienta el horno a 220°C. Coloca la base de masa en un molde para pay de 23cm. Pica el fondo con un tenedor y refrigera 15 min.', en: 'Preheat oven to 425°F. Place pie crust in a 9-inch pie dish. Prick the bottom with a fork and refrigerate 15 min.' },
      { es: 'Bate los huevos con el azúcar morena y las especias. Incorpora el puré de calabaza y mezcla bien. Agrega la leche evaporada poco a poco hasta integrar.', en: 'Beat eggs with brown sugar and spices. Mix in pumpkin purée well. Gradually add evaporated milk until combined.' },
      { es: 'Vierte el relleno sobre la base de masa. Hornea a 220°C por 15 min, luego baja a 175°C y hornea 40-50 min más hasta que el relleno cuaje en los bordes pero el centro tiemble suavemente.', en: 'Pour filling over pie crust. Bake at 425°F for 15 min, then reduce to 350°F and bake 40-50 more min until filling is set at edges but center jiggles gently.' },
      { es: 'Enfría completamente a temperatura ambiente (2 horas). Refrigera mínimo 2 horas. Sirve fría con crema batida y una pizca de canela.', en: 'Cool completely at room temp (2 hours). Refrigerate at least 2 hours. Serve chilled with whipped cream and a pinch of cinnamon.' },
    ],
    nutrition: { calories: 290, protein: 5, carbs: 42, fat: 11, fiber: 2, sugar: 28 },
  },
  {
    id: 109, name: 'Churros con Chocolate',
    ingredients: [
      { es: '1 taza de agua', en: '1 cup water' },
      { es: '2 cucharadas de azúcar', en: '2 tablespoons sugar' },
      { es: '½ cucharadita de sal', en: '½ teaspoon salt' },
      { es: '2 cucharadas de aceite vegetal', en: '2 tablespoons vegetable oil' },
      { es: '1 taza de harina de trigo', en: '1 cup all-purpose flour' },
      { es: 'Aceite para freír', en: 'Oil for frying' },
      { es: 'Azúcar con canela para rebozar', en: 'Cinnamon sugar for coating' },
      { es: '200g de chocolate negro + 1 taza de leche (para la salsa)', en: '200g dark chocolate + 1 cup milk (for the sauce)' },
    ],
    steps: [
      { es: 'Hierve agua con azúcar, sal y aceite. Retira del fuego y agrega toda la harina de golpe. Revuelve vigorosamente con cuchara de madera hasta formar una masa que se despegue de las paredes.', en: 'Boil water with sugar, salt and oil. Remove from heat and add all the flour at once. Stir vigorously with a wooden spoon until a dough forms that pulls away from the sides.' },
      { es: 'Deja entibiar. Coloca la masa en churrera o manga con boquilla de estrella. Calienta aceite a 180°C.', en: 'Let cool slightly. Place dough in a churro maker or piping bag with a star tip. Heat oil to 350°F.' },
      { es: 'Presiona tiras de 12-15cm directo al aceite caliente. Fríe 3-4 minutos girándolos hasta dorar parejo. Escurre y reboza inmediatamente en azúcar con canela.', en: 'Pipe 5-6 inch strips directly into hot oil. Fry 3-4 minutes turning them until evenly golden. Drain and immediately coat in cinnamon sugar.' },
      { es: 'Para el chocolate: calienta la leche y vierte sobre el chocolate picado. Revuelve hasta derretir. Sirve los churros calientes con el chocolate espeso para mojar.', en: 'For the chocolate: heat milk and pour over chopped chocolate. Stir until melted. Serve hot churros with thick chocolate for dipping.' },
    ],
    nutrition: { calories: 280, protein: 4, carbs: 35, fat: 14, fiber: 2, sugar: 18 },
  },
  {
    id: 110, name: 'Tarta de Santiago',
    ingredients: [
      { es: '250g de almendras molidas', en: '250g ground almonds' },
      { es: '250g de azúcar', en: '250g sugar' },
      { es: '4 huevos grandes', en: '4 large eggs' },
      { es: 'Ralladura de 1 limón', en: 'Zest of 1 lemon' },
      { es: '1 cucharadita de canela molida', en: '1 teaspoon ground cinnamon' },
      { es: 'Azúcar glass para decorar', en: 'Powdered sugar for decorating' },
    ],
    steps: [
      { es: 'Precalienta el horno a 175°C. Engrasa y enharina un molde redondo de 24cm. Opcionalmente forra el fondo con papel.', en: 'Preheat oven to 350°F. Grease and flour a 9.5-inch round pan. Optionally line the bottom with parchment.' },
      { es: 'Bate los huevos con el azúcar por 5 minutos hasta obtener una mezcla pálida y esponjosa que triplique su volumen.', en: 'Beat eggs with sugar for 5 minutes until a pale, fluffy mixture that triples in volume.' },
      { es: 'Incorpora las almendras molidas, ralladura de limón y canela con movimientos envolventes suaves para no perder el aire.', en: 'Fold in ground almonds, lemon zest and cinnamon with gentle folding motions to keep the air.' },
      { es: 'Vierte en el molde. Hornea 35-40 min hasta que esté dorada y firme al tacto. Enfría completamente. Decora con la Cruz de Santiago usando una plantilla y azúcar glass.', en: 'Pour into the mold. Bake 35-40 min until golden and firm to touch. Cool completely. Decorate with the Cross of Santiago using a stencil and powdered sugar.' },
    ],
    nutrition: { calories: 350, protein: 9, carbs: 38, fat: 18, fiber: 3, sugar: 30 },
  },
  {
    id: 128, name: 'Mousse de Chocolate',
    ingredients: [
      { es: '200g de chocolate negro (70% cacao)', en: '200g dark chocolate (70% cacao)' },
      { es: '4 huevos (separar claras y yemas)', en: '4 eggs (separate whites and yolks)' },
      { es: '2 cucharadas de azúcar', en: '2 tablespoons sugar' },
      { es: '1 pizca de sal', en: '1 pinch of salt' },
      { es: '1 cucharadita de extracto de vainilla', en: '1 teaspoon vanilla extract' },
    ],
    steps: [
      { es: 'Derrite el chocolate a baño maría revolviendo constantemente. Retira del fuego y deja entibiar 5 minutos. Incorpora las yemas una a una batiendo rápidamente.', en: 'Melt chocolate in a double boiler stirring constantly. Remove from heat and let cool 5 minutes. Incorporate yolks one at a time, whisking quickly.' },
      { es: 'Bate las claras con la sal a punto de nieve. Agrega el azúcar en lluvia y bate hasta obtener un merengue suave y brillante con picos firmes.', en: 'Beat egg whites with salt to soft peaks. Add sugar gradually and beat until a smooth, glossy meringue with firm peaks.' },
      { es: 'Incorpora un tercio del merengue al chocolate para aligerar la mezcla. Luego agrega el resto con movimientos envolventes suaves, sin perder el aire. Añade vainilla.', en: 'Fold one third of the meringue into the chocolate to lighten it. Then add the rest with gentle folding motions, without deflating. Add vanilla.' },
      { es: 'Vierte en copas individuales o un bowl grande. Refrigera mínimo 4 horas (mejor toda la noche). Sirve con crema batida o virutas de chocolate.', en: 'Pour into individual glasses or a large bowl. Refrigerate at least 4 hours (overnight is better). Serve with whipped cream or chocolate shavings.' },
    ],
    nutrition: { calories: 280, protein: 6, carbs: 24, fat: 18, fiber: 3, sugar: 18 },
  },
  {
    id: 135, name: 'Profiteroles con Chocolate',
    ingredients: [
      { es: '½ taza de mantequilla', en: '½ cup butter' },
      { es: '1 taza de agua', en: '1 cup water' },
      { es: '1 taza de harina de trigo', en: '1 cup all-purpose flour' },
      { es: '4 huevos grandes', en: '4 large eggs' },
      { es: '1 pizca de sal y 1 cucharada de azúcar', en: '1 pinch salt and 1 tablespoon sugar' },
      { es: 'Helado de vainilla para rellenar', en: 'Vanilla ice cream for filling' },
      { es: '200g de chocolate negro + ½ taza de crema para ganache', en: '200g dark chocolate + ½ cup cream for ganache' },
    ],
    steps: [
      { es: 'Hierve agua con mantequilla, sal y azúcar. Agrega la harina de golpe y revuelve con cuchara de madera a fuego bajo hasta que la masa se despegue y forme una bola (masa choux).', en: 'Boil water with butter, salt and sugar. Add flour all at once and stir with a wooden spoon over low heat until dough pulls away and forms a ball (choux pastry).' },
      { es: 'Transfiere a un bowl y deja entibiar 5 min. Incorpora los huevos uno a uno batiendo vigorosamente. La masa debe ser brillante y caer en cinta al levantar la cuchara.', en: 'Transfer to a bowl and let cool 5 min. Add eggs one at a time, beating vigorously. Dough should be glossy and fall in a ribbon when lifting the spoon.' },
      { es: 'Con manga pastelera, forma montículos de 3cm en charola con papel. Hornea a 200°C por 25 min (no abrir el horno). Deben quedar dorados y huecos.', en: 'Using a piping bag, pipe 3cm mounds on a lined baking sheet. Bake at 400°F for 25 min (don\'t open the oven). They should be golden and hollow.' },
      { es: 'Rellena cada profiterol con helado de vainilla. Prepara ganache: calienta crema y viértela sobre chocolate picado, revuelve. Baña los profiteroles con ganache tibia.', en: 'Fill each profiterole with vanilla ice cream. Make ganache: heat cream and pour over chopped chocolate, stir. Drizzle warm ganache over profiteroles.' },
    ],
    nutrition: { calories: 310, protein: 6, carbs: 28, fat: 20, fiber: 1, sugar: 16 },
  },
  {
    id: 227, name: 'Apple Pie Clásico',
    ingredients: [
      { es: '6 manzanas Granny Smith peladas y rebanadas', en: '6 Granny Smith apples, peeled and sliced' },
      { es: '¾ taza de azúcar + 2 cucharadas de harina', en: '¾ cup sugar + 2 tablespoons flour' },
      { es: '1 cucharadita de canela + ¼ nuez moscada', en: '1 tsp cinnamon + ¼ tsp nutmeg' },
      { es: '1 cucharada de jugo de limón', en: '1 tablespoon lemon juice' },
      { es: '2 bases de masa para pay (inferior y superior)', en: '2 pie crusts (bottom and top)' },
      { es: '2 cucharadas de mantequilla fría en cubos', en: '2 tablespoons cold butter, cubed' },
      { es: '1 huevo batido para barnizar', en: '1 beaten egg for egg wash' },
    ],
    steps: [
      { es: 'Mezcla las manzanas rebanadas con azúcar, harina, canela, nuez moscada y limón. Deja macerar 15 min.', en: 'Toss sliced apples with sugar, flour, cinnamon, nutmeg and lemon. Let macerate 15 min.' },
      { es: 'Forra un molde para pay con la masa inferior. Vierte el relleno de manzana y distribuye los cubos de mantequilla encima.', en: 'Line a pie dish with the bottom crust. Pour in the apple filling and dot with butter cubes on top.' },
      { es: 'Cubre con la masa superior. Sella y ondula los bordes. Corta ventilaciones decorativas en la tapa. Pinta con huevo batido y espolvorea azúcar.', en: 'Cover with the top crust. Seal and crimp the edges. Cut decorative vents in the top. Brush with egg wash and sprinkle sugar.' },
      { es: 'Hornea a 220°C por 20 min, luego baja a 175°C y hornea 35-40 min más hasta que la corteza esté dorada y el relleno burbujee. Enfría 2 horas antes de rebanar.', en: 'Bake at 425°F for 20 min, then reduce to 350°F and bake 35-40 more min until crust is golden and filling bubbles. Cool 2 hours before slicing.' },
    ],
    nutrition: { calories: 310, protein: 3, carbs: 48, fat: 13, fiber: 3, sugar: 28 },
  },
  {
    id: 229, name: 'Brownies de Chocolate',
    ingredients: [
      { es: '200g de chocolate negro (60-70% cacao)', en: '200g dark chocolate (60-70% cacao)' },
      { es: '½ taza de mantequilla sin sal', en: '½ cup unsalted butter' },
      { es: '1 taza de azúcar', en: '1 cup sugar' },
      { es: '3 huevos grandes', en: '3 large eggs' },
      { es: '1 cucharadita de extracto de vainilla', en: '1 teaspoon vanilla extract' },
      { es: '¾ taza de harina de trigo', en: '¾ cup all-purpose flour' },
      { es: '¼ taza de cacao en polvo sin azúcar', en: '¼ cup unsweetened cocoa powder' },
    ],
    steps: [
      { es: 'Precalienta el horno a 175°C. Forra un molde cuadrado de 20cm con papel encerado dejando bordes para desmoldar fácil.', en: 'Preheat oven to 350°F. Line an 8-inch square pan with parchment paper leaving edges for easy removal.' },
      { es: 'Derrite el chocolate con la mantequilla a baño maría o en microondas en intervalos de 30 seg. Revuelve hasta que quede liso. Deja entibiar.', en: 'Melt chocolate with butter in a double boiler or microwave in 30-sec intervals. Stir until smooth. Let cool slightly.' },
      { es: 'Bate los huevos con el azúcar por 3 minutos hasta que espesen. Incorpora la mezcla de chocolate y la vainilla. Tamiza la harina y cacao, integra con espátula sin sobrebatir.', en: 'Beat eggs with sugar for 3 minutes until thickened. Mix in the chocolate mixture and vanilla. Sift flour and cocoa, fold in with spatula without overmixing.' },
      { es: 'Vierte en el molde. Hornea 25-30 min hasta que la superficie esté crackelada y un palillo salga con migajas húmedas (no limpio). Enfría completamente antes de cortar en cuadros.', en: 'Pour into the pan. Bake 25-30 min until surface is crackled and a toothpick comes out with moist crumbs (not clean). Cool completely before cutting into squares.' },
    ],
    nutrition: { calories: 290, protein: 4, carbs: 34, fat: 16, fiber: 2, sugar: 24 },
  },
];

// ═══════════════════════════════════════════════════════════
// FIXES ADICIONALES: category_type y nutrición
// ═══════════════════════════════════════════════════════════
const categoryFixes = [
  { id: 15, type: 'meat' },   // Tonkotsu Ramen = caldo de cerdo, no seafood
  { id: 242, type: 'meat' },  // Udon - si no tiene marisco, meat o vegetarian
];

const sugarFixes = [
  { id: 34, sugar: 22 },   // Dorayaki
  { id: 45, sugar: 20 },   // Arroz con Leche
  { id: 47, sugar: 15 },   // Pan de Muerto
  { id: 81, sugar: 28 },   // Cannoli
  { id: 94, sugar: 18 },   // Panettone
  { id: 95, sugar: 20 },   // Panna Cotta
  { id: 108, sugar: 26 },  // Crema Catalana
  { id: 129, sugar: 22 },  // Crème Brûlée
  { id: 134, sugar: 30 },  // Tarte Tatin
  { id: 136, sugar: 18 },  // Crêpes Suzette
  { id: 143, sugar: 35 },  // Gulab Jamun
  { id: 173, sugar: 25 },  // Galaktoboureko
  { id: 200, sugar: 14 },  // Affogato
  { id: 201, sugar: 16 },  // Biscotti
  { id: 205, sugar: 20 },  // Sfogliatella
  { id: 209, sugar: 18 },  // Zabaione
  { id: 210, sugar: 22 },  // Zeppole
];

async function megaFix() {
  console.log('🔧 MEGA FIX: Corrigiendo todas las recetas con contenido genérico\n');
  const pool = mysql.createPool({
    host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME, ssl: { rejectUnauthorized: false }
  });
  const conn = await pool.getConnection();
  let total = 0;

  // 1. Fix vegetable template (steps only)
  console.log('═══ PASO 1: Recetas con pasos genéricos de "vegetales" ═══');
  for (const fix of vegTemplateFixes) {
    await conn.query('UPDATE recipes SET steps = ? WHERE id = ?', [JSON.stringify(fix.steps), fix.id]);
    console.log(`  ✅ ID ${fix.id}: ${fix.name} [${fix.steps.length} pasos nuevos]`);
    total++;
  }

  // 2. Fix cake template (steps + ingredients + nutrition)
  console.log('\n═══ PASO 2: Recetas con plantilla genérica de "pastel" ═══');
  for (const fix of cakeTemplateFixes) {
    await conn.query('UPDATE recipes SET ingredients = ?, steps = ?, nutrition = ? WHERE id = ?',
      [JSON.stringify(fix.ingredients), JSON.stringify(fix.steps), JSON.stringify(fix.nutrition), fix.id]);
    console.log(`  ✅ ID ${fix.id}: ${fix.name} [${fix.ingredients.length} ings, ${fix.steps.length} pasos]`);
    total++;
  }

  // 3. Fix categories
  console.log('\n═══ PASO 3: Categorías incorrectas ═══');
  for (const fix of categoryFixes) {
    await conn.query('UPDATE recipes SET category_type = ? WHERE id = ?', [fix.type, fix.id]);
    console.log(`  ✅ ID ${fix.id}: → ${fix.type}`);
    total++;
  }

  // 4. Fix sugar in nutrition for desserts
  console.log('\n═══ PASO 4: Azúcar en nutrición de postres ═══');
  for (const fix of sugarFixes) {
    const [rows] = await conn.query('SELECT nutrition FROM recipes WHERE id = ?', [fix.id]);
    if (rows.length) {
      let nutr;
      try { nutr = typeof rows[0].nutrition === 'string' ? JSON.parse(rows[0].nutrition) : rows[0].nutrition; } catch(e) { nutr = {}; }
      nutr.sugar = fix.sugar;
      await conn.query('UPDATE recipes SET nutrition = ? WHERE id = ?', [JSON.stringify(nutr), fix.id]);
      console.log(`  ✅ ID ${fix.id}: sugar → ${fix.sugar}g`);
      total++;
    }
  }

  // 5. Fix steak frites (ID 131) content check
  console.log('\n═══ PASO 5: Verificando Steak Frites (ID 131) ═══');
  const [steak] = await conn.query('SELECT ingredients, steps FROM recipes WHERE id = 131');
  let steakIngs;
  try { steakIngs = JSON.parse(steak[0].ingredients); } catch(e) { steakIngs = []; }
  const steakStr = JSON.stringify(steakIngs).toLowerCase();
  if (!steakStr.includes('carne') && !steakStr.includes('steak') && !steakStr.includes('res') && !steakStr.includes('filet')) {
    // Fix steak frites ingredients
    const newIngs = [
      { es: '2 filetes de res gruesos (300g c/u, rib-eye o entrecôt)', en: '2 thick beef steaks (10oz each, rib-eye or entrecôte)' },
      { es: '4 papas grandes para freír', en: '4 large potatoes for frying' },
      { es: 'Aceite para freír', en: 'Oil for frying' },
      { es: '3 cucharadas de mantequilla', en: '3 tablespoons butter' },
      { es: 'Sal gruesa y pimienta negra recién molida', en: 'Coarse salt and freshly ground black pepper' },
      { es: 'Ramitas de tomillo fresco', en: 'Fresh thyme sprigs' },
      { es: 'Salsa béarnaise para acompañar', en: 'Béarnaise sauce for serving' },
    ];
    const newSteps = [
      { es: 'Pela y corta las papas en bastones de 1cm. Remoja en agua fría 30 min. Seca bien. Fríe a 140°C por 6-8 min (blanquear). Escurre y deja enfriar. Sube a 190°C y fríe 3 min más hasta dorar.', en: 'Peel and cut potatoes into 1cm batons. Soak in cold water 30 min. Pat dry. Fry at 285°F for 6-8 min (blanch). Drain and cool. Raise to 375°F and fry 3 more min until golden.' },
      { es: 'Saca los filetes del refri 30 min antes. Seca con papel. Sazona generosamente con sal gruesa y pimienta por ambos lados.', en: 'Take steaks out of the fridge 30 min before. Pat dry. Season generously with coarse salt and pepper on both sides.' },
      { es: 'Calienta una sartén de hierro a fuego muy alto. Añade aceite. Coloca los filetes y sella 3-4 min por lado sin mover (para costra dorada). Agrega mantequilla, tomillo y baña constantemente.', en: 'Heat a cast iron skillet on very high heat. Add oil. Place steaks and sear 3-4 min per side without moving (for golden crust). Add butter, thyme and baste constantly.' },
      { es: 'Deja reposar los filetes 5 min cubiertos con aluminio. Sirve con las papas fritas dobles y salsa béarnaise al lado.', en: 'Rest steaks 5 min covered with foil. Serve with the double-fried potatoes and béarnaise sauce on the side.' },
    ];
    await conn.query('UPDATE recipes SET ingredients = ?, steps = ? WHERE id = 131',
      [JSON.stringify(newIngs), JSON.stringify(newSteps)]);
    console.log('  ✅ ID 131: Steak Frites [ingredientes y pasos corregidos]');
    total++;
  } else {
    console.log('  ℹ️ ID 131: Steak Frites ya tiene ingredientes de carne');
  }

  console.log(`\n\n🎉 MEGA FIX completado: ${total} correcciones aplicadas`);
  conn.release(); pool.end();
}
megaFix();
