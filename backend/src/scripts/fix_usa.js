import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// ═══════════════════════════════════════════════════════════════
// BATCH 3: USA 🇺🇸 + Recetas mexicanas faltantes (Gorditas, Sopes)
// ═══════════════════════════════════════════════════════════════

const usaFixes = {
  'smashburger': {
    ingredients: [
      { es: '500g de carne de res molida (80/20)', en: '500g ground beef (80/20)' },
      { es: '4 rebanadas de tocino ahumado', en: '4 slices smoked bacon' },
      { es: '4 rebanadas de queso americano o cheddar', en: '4 slices American or cheddar cheese' },
      { es: '4 panes brioche para hamburguesa', en: '4 brioche burger buns' },
      { es: '1 cebolla blanca en rodajas finas', en: '1 white onion, thinly sliced' },
      { es: 'Pepinillos encurtidos en rebanadas', en: 'Dill pickle slices' },
      { es: 'Ketchup, mostaza y mayonesa', en: 'Ketchup, mustard and mayonnaise' },
      { es: 'Lechuga y jitomate en rebanadas', en: 'Lettuce and tomato slices' },
      { es: 'Sal y pimienta negra molida', en: 'Salt and ground black pepper' }
    ],
    steps: [
      { es: 'Fríe el tocino en un sartén hasta que esté crujiente. Reserva sobre papel absorbente.', en: 'Fry bacon in a skillet until crispy. Reserve on paper towels.' },
      { es: 'Forma bolas de 100g de carne. NO las aplanes todavía. Sazona solo con sal y pimienta por fuera.', en: 'Form 100g balls of meat. Do NOT flatten yet. Season only with salt and pepper on the outside.' },
      { es: 'Calienta un sartén de hierro a fuego MUY alto (debe humear). Coloca la bola de carne y aplástala con una espátula fuerte durante 10 segundos hasta que quede ultra fina. No la toques más.', en: 'Heat a cast iron skillet over VERY high heat (should be smoking). Place meat ball and smash flat with a firm spatula for 10 seconds until paper-thin. Don\'t touch again.' },
      { es: 'Cocina 2-3 minutos sin mover. Los bordes se pondrán crujientes y oscuros (la reacción Maillard). Voltea, coloca queso inmediatamente y cocina 1 minuto más.', en: 'Cook 2-3 minutes without moving. Edges will get crispy and dark (Maillard reaction). Flip, place cheese immediately and cook 1 more minute.' },
      { es: 'Tuesta los panes brioche con mantequilla en el sartén. Arma: pan inferior, mayonesa, lechuga, jitomate, doble smash patty con queso, tocino, pepinillos, ketchup-mostaza y pan superior.', en: 'Toast brioche buns with butter in skillet. Build: bottom bun, mayo, lettuce, tomato, double smash patty with cheese, bacon, pickles, ketchup-mustard and top bun.' }
    ],
    nutrition: { calories: 720, protein: '42g', carbs: '38g', fat: '45g', fiber: '2g' }
  },

  'fried chicken': {
    ingredients: [
      { es: '8 piezas de pollo (muslos, piernas, pechugas y alas)', en: '8 chicken pieces (thighs, legs, breasts and wings)' },
      { es: '2 tazas de buttermilk (suero de leche)', en: '2 cups buttermilk' },
      { es: '2 tazas de harina para todo uso', en: '2 cups all-purpose flour' },
      { es: '2 cucharaditas de paprika', en: '2 teaspoons paprika' },
      { es: '1 cucharadita de ajo en polvo', en: '1 teaspoon garlic powder' },
      { es: '1 cucharadita de cebolla en polvo', en: '1 teaspoon onion powder' },
      { es: '½ cucharadita de cayena', en: '½ teaspoon cayenne' },
      { es: '1 cucharadita de pimienta negra', en: '1 teaspoon black pepper' },
      { es: 'Aceite vegetal o manteca para freír (cantidad generosa)', en: 'Vegetable oil or lard for frying (generous amount)' },
      { es: 'Sal al gusto', en: 'Salt to taste' }
    ],
    steps: [
      { es: 'Sazona el pollo con sal. Sumerge en buttermilk y refrigera mínimo 4 horas (la acidez del buttermilk ablanda la carne y crea una corteza increíble).', en: 'Season chicken with salt. Submerge in buttermilk and refrigerate at least 4 hours (buttermilk\'s acidity tenderizes meat and creates incredible crust).' },
      { es: 'Mezcla la harina con paprika, ajo, cebolla, cayena, pimienta y sal en un tazón grande.', en: 'Mix flour with paprika, garlic, onion, cayenne, pepper and salt in a large bowl.' },
      { es: 'Saca cada pieza del buttermilk y pásala por la harina sazonada presionando firmemente. Sacude el exceso. Deja reposar 10 minutos sobre una rejilla.', en: 'Remove each piece from buttermilk and press into seasoned flour firmly. Shake off excess. Rest 10 minutes on a rack.' },
      { es: 'Calienta aceite a 160°C en una olla profunda o freidora. Fríe en tandas sin saturar: piezas oscuras 14-16 minutos, pechugas 12-14 minutos. El pollo debe alcanzar 74°C internos.', en: 'Heat oil to 160°C in a deep pot or fryer. Fry in batches without crowding: dark pieces 14-16 minutes, breasts 12-14 minutes. Chicken should reach 74°C internal.' },
      { es: 'Escurre sobre rejilla de metal (no papel, que ablanda la costra). Deja reposar 5 minutos antes de servir.', en: 'Drain on a metal rack (not paper, which softens the crust). Let rest 5 minutes before serving.' }
    ],
    nutrition: { calories: 480, protein: '35g', carbs: '22g', fat: '28g', fiber: '1g' }
  },

  'brisket': {
    ingredients: [
      { es: '3-4 kg de pecho de res (brisket) entero con capa de grasa', en: '3-4 kg whole beef brisket with fat cap' },
      { es: '¼ de taza de pimienta negra gruesa', en: '¼ cup coarse black pepper' },
      { es: '¼ de taza de sal kosher', en: '¼ cup kosher salt' },
      { es: '2 cucharadas de ajo en polvo', en: '2 tablespoons garlic powder' },
      { es: 'Madera de mezquite o encino para ahumar', en: 'Mesquite or oak wood for smoking' },
      { es: 'Papel de carnicero rosa (pink butcher paper)', en: 'Pink butcher paper' },
      { es: 'Salsa BBQ texana para servir (opcional)', en: 'Texas BBQ sauce for serving (optional)' }
    ],
    steps: [
      { es: 'La noche anterior, aplica generosamente la mezcla de sal, pimienta y ajo por toda la superficie del brisket. Refrigera destapado toda la noche.', en: 'Night before, generously apply salt, pepper and garlic mix over entire brisket surface. Refrigerate uncovered overnight.' },
      { es: 'Precalienta el ahumador a 107°C (225°F). Agrega madera de mezquite o encino para generar humo limpio y azulado.', en: 'Preheat smoker to 107°C (225°F). Add mesquite or oak wood to generate clean, blue smoke.' },
      { es: 'Coloca el brisket con la grasa hacia arriba. Ahúma sin abrir durante 6-8 horas hasta que la temperatura interna alcance 75°C y la corteza (bark) sea oscura y firme.', en: 'Place brisket fat-side up. Smoke without opening for 6-8 hours until internal temperature reaches 75°C and bark is dark and firm.' },
      { es: 'Cuando alcance 75°C interno, envuelve en papel de carnicero rosa (Texas crutch). Regresa al ahumador.', en: 'When it reaches 75°C internal, wrap in pink butcher paper (Texas crutch). Return to smoker.' },
      { es: 'Continúa ahumando hasta que la temperatura interna alcance 96°C y la sonda entre como en mantequilla (4-6 horas más). Total: 12-14 horas.', en: 'Continue smoking until internal temperature reaches 96°C and probe slides in like butter (4-6 more hours). Total: 12-14 hours.' },
      { es: 'Envuelve en toallas y descansa en una hielera vacía mínimo 1 hora (hasta 4 horas). Rebana contra la fibra en lonchas de 6mm con un cuchillo largo y afilado.', en: 'Wrap in towels and rest in an empty cooler minimum 1 hour (up to 4 hours). Slice against the grain into 6mm slices with a long sharp knife.' }
    ],
    nutrition: { calories: 380, protein: '45g', carbs: '2g', fat: '22g', fiber: '0g' }
  },

  'buffalo wings': {
    ingredients: [
      { es: '1 kg de alitas de pollo, separadas en drummettes y flats', en: '1 kg chicken wings, separated into drummettes and flats' },
      { es: '½ taza de salsa picante Frank\'s RedHot', en: '½ cup Frank\'s RedHot sauce' },
      { es: '¼ de taza de mantequilla derretida', en: '¼ cup melted butter' },
      { es: '1 cucharada de vinagre blanco', en: '1 tablespoon white vinegar' },
      { es: '½ cucharadita de ajo en polvo', en: '½ teaspoon garlic powder' },
      { es: 'Aceite para freír', en: 'Oil for frying' },
      { es: 'Palitos de apio y zanahoria para acompañar', en: 'Celery and carrot sticks for serving' },
      { es: 'Aderezo ranch o blue cheese', en: 'Ranch or blue cheese dressing' }
    ],
    steps: [
      { es: 'Seca muy bien las alitas con papel de cocina. Este paso es crucial para que queden crujientes. Sazona con sal.', en: 'Pat wings very dry with paper towels. This step is crucial for crispiness. Season with salt.' },
      { es: 'Calienta aceite a 190°C. Fríe las alitas en tandas durante 10-12 minutos hasta que estén doradas y crujientes. Escurre sobre rejilla.', en: 'Heat oil to 190°C. Fry wings in batches for 10-12 minutes until golden and crispy. Drain on rack.' },
      { es: 'Prepara la salsa Buffalo: mezcla la salsa picante con mantequilla derretida, vinagre y ajo en polvo. Calienta brevemente.', en: 'Prepare Buffalo sauce: mix hot sauce with melted butter, vinegar and garlic powder. Heat briefly.' },
      { es: 'En un tazón grande, vierte la salsa sobre las alitas recién fritas y mezcla hasta cubrirlas uniformemente.', en: 'In a large bowl, pour sauce over freshly fried wings and toss until evenly coated.' },
      { es: 'Sirve de inmediato en una bandeja con palitos de apio, zanahoria y un tazón de aderezo ranch o blue cheese para mojar.', en: 'Serve immediately on a platter with celery sticks, carrot sticks and a bowl of ranch or blue cheese dressing for dipping.' }
    ],
    nutrition: { calories: 540, protein: '38g', carbs: '4g', fat: '42g', fiber: '0g' }
  },

  'philly cheesesteak': {
    ingredients: [
      { es: '500g de rib eye de res, congelado parcialmente y rebanado ultra fino', en: '500g beef rib eye, partially frozen and sliced paper-thin' },
      { es: '4 rollos hoagie (pan italiano largo)', en: '4 hoagie rolls (long Italian bread)' },
      { es: '8 rebanadas de Cheez Whiz o provolone', en: '8 slices Cheez Whiz or provolone' },
      { es: '2 cebollas en rodajas finas', en: '2 onions, thinly sliced' },
      { es: '1 pimiento verde en tiras (opcional, estilo "wit")', en: '1 green pepper in strips (optional, "wit" style)' },
      { es: '200g de champiñones rebanados (opcional)', en: '200g sliced mushrooms (optional)' },
      { es: '3 cucharadas de aceite vegetal', en: '3 tablespoons vegetable oil' },
      { es: 'Sal y pimienta', en: 'Salt and pepper' }
    ],
    steps: [
      { es: 'Congela la pieza de rib eye parcialmente (30 min en congelador) para poder rebanarla lo más fina posible con un cuchillo afilado.', en: 'Partially freeze rib eye piece (30 min in freezer) to slice as thin as possible with a sharp knife.' },
      { es: 'En una plancha o sartén grande a fuego alto, saltea las cebollas (y pimientos/champiñones si los usas) hasta caramelizar, unos 8 minutos. Reserva.', en: 'On a griddle or large skillet over high heat, sauté onions (and peppers/mushrooms if using) until caramelized, about 8 minutes. Set aside.' },
      { es: 'En la misma plancha bien caliente, extiende las láminas de res. Sazona con sal y pimienta. Cocina 2 minutos, voltea y pica con la espátula para desmenuzar.', en: 'On the same very hot griddle, spread beef slices. Season with salt and pepper. Cook 2 minutes, flip and chop with spatula to shred.' },
      { es: 'Forma 4 montoncitos de carne. Coloca queso encima de cada uno y las cebollas caramelizadas. Tapa con una campana o tazón de metal 1 minuto para fundir el queso.', en: 'Form 4 meat piles. Place cheese on top of each and caramelized onions. Cover with a dome or metal bowl 1 minute to melt cheese.' },
      { es: 'Abre los rollos hoagie (sin separar completamente) y con la espátula recoge cada montoncito directamente dentro del pan. Sirve inmediatamente envuelto en papel aluminio.', en: 'Open hoagie rolls (without fully separating) and with spatula scoop each pile directly into bread. Serve immediately wrapped in foil.' }
    ],
    nutrition: { calories: 680, protein: '40g', carbs: '42g', fat: '38g', fiber: '2g' }
  },

  'pulled pork': {
    ingredients: [
      { es: '2.5 kg de espaldilla de cerdo (pork shoulder/butt)', en: '2.5 kg pork shoulder/butt' },
      { es: '3 cucharadas de paprika ahumada', en: '3 tablespoons smoked paprika' },
      { es: '2 cucharadas de azúcar morena', en: '2 tablespoons brown sugar' },
      { es: '1 cucharada de ajo en polvo', en: '1 tablespoon garlic powder' },
      { es: '1 cucharada de cebolla en polvo', en: '1 tablespoon onion powder' },
      { es: '1 cucharadita de pimienta de cayena', en: '1 teaspoon cayenne pepper' },
      { es: '1 taza de salsa BBQ', en: '1 cup BBQ sauce' },
      { es: '½ taza de vinagre de manzana', en: '½ cup apple cider vinegar' },
      { es: 'Panes brioche y ensalada coleslaw para servir', en: 'Brioche buns and coleslaw for serving' },
      { es: 'Sal kosher y pimienta negra', en: 'Kosher salt and black pepper' }
    ],
    steps: [
      { es: 'Mezcla todas las especias secas (paprika, azúcar morena, ajo, cebolla, cayena, sal y pimienta) para hacer el dry rub. Aplica por toda la superficie del cerdo masajeando bien. Refrigera 8 horas.', en: 'Mix all dry spices (paprika, brown sugar, garlic, onion, cayenne, salt and pepper) to make dry rub. Apply over entire pork surface massaging well. Refrigerate 8 hours.' },
      { es: 'Precalienta el horno a 135°C. Coloca el cerdo en una charola profunda con el vinagre de manzana. Cubre herméticamente con doble capa de aluminio.', en: 'Preheat oven to 135°C. Place pork in a deep roasting pan with apple cider vinegar. Cover tightly with double layer of foil.' },
      { es: 'Hornea 8-10 horas (sí, toda la noche) hasta que la temperatura interna alcance 96°C y la carne se desmenuce sin esfuerzo.', en: 'Bake 8-10 hours (yes, overnight) until internal temperature reaches 96°C and meat shreds effortlessly.' },
      { es: 'Desmenuza con dos tenedores o garras de oso. Mezcla con los jugos del fondo de la charola y ½ taza de salsa BBQ.', en: 'Shred with two forks or bear claws. Mix with pan juices from bottom and ½ cup BBQ sauce.' },
      { es: 'Sirve generosamente en panes brioche tostados con coleslaw encima y salsa BBQ extra al lado.', en: 'Serve generously on toasted brioche buns with coleslaw on top and extra BBQ sauce on side.' }
    ],
    nutrition: { calories: 520, protein: '38g', carbs: '30g', fat: '26g', fiber: '1g' }
  },

  'biscuits': {
    ingredients: [
      { es: '2 tazas de harina para todo uso', en: '2 cups all-purpose flour' },
      { es: '1 cucharada de polvo para hornear', en: '1 tablespoon baking powder' },
      { es: '½ cucharadita de sal', en: '½ teaspoon salt' },
      { es: '6 cucharadas de mantequilla fría, en cubos', en: '6 tablespoons cold butter, cubed' },
      { es: '¾ de taza de buttermilk (suero de leche) frío', en: '¾ cup cold buttermilk' },
      { es: '500g de carne de cerdo molida (salchichas breakfast)', en: '500g ground pork (breakfast sausages)' },
      { es: '3 cucharadas de harina (para el gravy)', en: '3 tablespoons flour (for gravy)' },
      { es: '2 tazas de leche entera', en: '2 cups whole milk' },
      { es: '½ cucharadita de salvia seca', en: '½ teaspoon dried sage' },
      { es: 'Pimienta negra abundante', en: 'Plenty of black pepper' }
    ],
    steps: [
      { es: 'Para los biscuits: mezcla harina, polvo para hornear y sal. Incorpora la mantequilla fría cortándola con un tenedor o las manos hasta obtener migajas gruesas. Agrega el buttermilk y mezcla solo hasta unir.', en: 'For biscuits: mix flour, baking powder and salt. Cut in cold butter with a fork or hands until coarse crumbs form. Add buttermilk and mix just until combined.' },
      { es: 'Aplana la masa a 2cm de grosor sobre superficie enharinada. Corta con un cortador circular sin girar (girar sella los bordes y evita que suban). Hornea a 220°C durante 12-14 minutos.', en: 'Flatten dough to 2cm thick on floured surface. Cut with round cutter without twisting (twisting seals edges and prevents rising). Bake at 220°C for 12-14 minutes.' },
      { es: 'Para el gravy: desmenuza y fríe la carne de cerdo a fuego medio-alto hasta dorar completamente. NO escurras la grasa, es la base del gravy.', en: 'For gravy: crumble and fry pork over medium-high heat until fully browned. DO NOT drain fat, it\'s the gravy base.' },
      { es: 'Espolvorea las 3 cucharadas de harina sobre la carne y revuelve 1 minuto. Vierte la leche gradualmente sin dejar de revolver. Agrega salvia y mucha pimienta negra. Cocina hasta espesar (5 min).', en: 'Sprinkle 3 tablespoons flour over meat and stir 1 minute. Pour milk gradually while stirring constantly. Add sage and lots of black pepper. Cook until thickened (5 min).' },
      { es: 'Abre cada biscuit caliente por la mitad y baña generosamente con el gravy de salchicha. Es el desayuno sureño por excelencia.', en: 'Split each warm biscuit in half and smother generously with sausage gravy. The quintessential Southern breakfast.' }
    ],
    nutrition: { calories: 580, protein: '24g', carbs: '42g', fat: '36g', fiber: '1g' }
  },

  'costillas bbq': {
    ingredients: [
      { es: '2 racks de costillas baby back de cerdo', en: '2 racks baby back pork ribs' },
      { es: '3 cucharadas de paprika ahumada', en: '3 tablespoons smoked paprika' },
      { es: '2 cucharadas de azúcar morena', en: '2 tablespoons brown sugar' },
      { es: '1 cucharada de ajo en polvo', en: '1 tablespoon garlic powder' },
      { es: '1 cucharada de cebolla en polvo', en: '1 tablespoon onion powder' },
      { es: '1 cucharadita de mostaza en polvo', en: '1 teaspoon mustard powder' },
      { es: '1 taza de salsa BBQ', en: '1 cup BBQ sauce' },
      { es: '¼ taza de mostaza amarilla (como binder)', en: '¼ cup yellow mustard (as binder)' },
      { es: 'Sal y pimienta negra', en: 'Salt and black pepper' }
    ],
    steps: [
      { es: 'Retira la membrana plateada del reverso de las costillas tirando con un papel de cocina desde una esquina. Esto permite que el humo y la sazón penetren.', en: 'Remove silver membrane from back of ribs by pulling with a paper towel from one corner. This allows smoke and seasoning to penetrate.' },
      { es: 'Unta una capa fina de mostaza amarilla por todas las costillas (el binder). Aplica el dry rub (paprika, azúcar, ajo, cebolla, mostaza, sal, pimienta) generosamente por ambos lados.', en: 'Spread a thin layer of yellow mustard over all ribs (the binder). Apply dry rub (paprika, sugar, garlic, onion, mustard, salt, pepper) generously on both sides.' },
      { es: 'Envuelve en plástico y refrigera mínimo 2 horas (ideal toda la noche).', en: 'Wrap in plastic and refrigerate at least 2 hours (ideally overnight).' },
      { es: 'Hornea a 135°C envueltas en aluminio con la carne hacia arriba durante 3 horas. La carne se encogerá y expondrá los huesos.', en: 'Bake at 135°C wrapped in foil meat-side up for 3 hours. Meat will shrink and expose bones.' },
      { es: 'Desenvuelve, barniza con salsa BBQ y sube el horno a 200°C. Hornea 15-20 minutos destapadas hasta que la salsa se caramelice y burbujee.', en: 'Unwrap, glaze with BBQ sauce and raise oven to 200°C. Bake 15-20 minutes uncovered until sauce caramelizes and bubbles.' },
      { es: 'La prueba de cocción: al levantar el rack con pinzas por el centro, debe doblarse y la carne casi caerse del hueso. Corta entre cada hueso y sirve.', en: 'Doneness test: when lifting rack with tongs from center, it should bend and meat nearly fall off bone. Cut between each bone and serve.' }
    ],
    nutrition: { calories: 620, protein: '40g', carbs: '22g', fat: '42g', fiber: '0g' }
  },

  'jambalaya': {
    ingredients: [
      { es: '500g de salchicha andouille (o chorizo ahumado), en rodajas', en: '500g andouille sausage (or smoked chorizo), sliced' },
      { es: '300g de pechuga de pollo en cubos', en: '300g chicken breast, cubed' },
      { es: '300g de camarones grandes, pelados', en: '300g large shrimp, peeled' },
      { es: '2 tazas de arroz de grano largo', en: '2 cups long-grain rice' },
      { es: '1 lata de jitomates aplastados (400g)', en: '1 can crushed tomatoes (400g)' },
      { es: '3 tazas de caldo de pollo', en: '3 cups chicken broth' },
      { es: '1 cebolla, 2 tallos de apio, 1 pimiento verde (la "santa trinidad")', en: '1 onion, 2 celery stalks, 1 green pepper (the "holy trinity")' },
      { es: '4 dientes de ajo picados', en: '4 garlic cloves, minced' },
      { es: '2 cucharaditas de sazonador cajún', en: '2 teaspoons Cajun seasoning' },
      { es: '2 hojas de laurel', en: '2 bay leaves' },
      { es: '2 cucharadas de aceite vegetal', en: '2 tablespoons vegetable oil' },
      { es: 'Salsa Tabasco y cebollines para servir', en: 'Tabasco sauce and scallions for serving' }
    ],
    steps: [
      { es: 'Dora las rodajas de andouille en aceite caliente 3-4 minutos. Retira y reserva. En la misma grasa, sella el pollo hasta dorar. Reserva con la salchicha.', en: 'Brown andouille slices in hot oil 3-4 minutes. Remove and reserve. In same fat, sear chicken until golden. Reserve with sausage.' },
      { es: 'Sofríe la "santa trinidad" (cebolla, apio y pimiento verde, todo picado) durante 5 minutos. Agrega el ajo y cocina 1 minuto más.', en: 'Sauté "holy trinity" (onion, celery and green pepper, all chopped) for 5 minutes. Add garlic and cook 1 more minute.' },
      { es: 'Incorpora los jitomates, sazonador cajún y laurel. Cocina 5 minutos. Agrega el arroz y revuelve para cubrirlo con la salsa.', en: 'Add tomatoes, Cajun seasoning and bay leaves. Cook 5 minutes. Add rice and stir to coat with sauce.' },
      { es: 'Vierte el caldo, regresa el pollo y la salchicha. Hierve, tapa y reduce a fuego bajo. Cocina 20 minutos sin destapar.', en: 'Pour broth, return chicken and sausage. Boil, cover and reduce to low heat. Cook 20 minutes without uncovering.' },
      { es: 'Coloca los camarones encima del arroz, tapa de nuevo y cocina 5 minutos más hasta que estén rosados.', en: 'Place shrimp on top of rice, cover again and cook 5 more minutes until pink.' },
      { es: 'Retira del fuego y deja reposar tapado 5 minutos. Esponja con un tenedor. Sirve con Tabasco y cebollines.', en: 'Remove from heat and let rest covered 5 minutes. Fluff with fork. Serve with Tabasco and scallions.' }
    ],
    nutrition: { calories: 580, protein: '38g', carbs: '55g', fat: '22g', fiber: '3g' }
  },

  'hot dog': {
    ingredients: [
      { es: '4 salchichas de res estilo Nueva York (all-beef franks)', en: '4 New York style beef frankfurters (all-beef franks)' },
      { es: '4 panes para hot dog, ligeramente tostados', en: '4 hot dog buns, lightly toasted' },
      { es: 'Mostaza amarilla', en: 'Yellow mustard' },
      { es: 'Chucrut (sauerkraut) tibio', en: 'Warm sauerkraut' },
      { es: 'Salsa de cebolla roja caramelizada', en: 'Caramelized red onion sauce' },
      { es: 'Ketchup (opcional, los neoyorquinos lo consideran sacrilegio)', en: 'Ketchup (optional, New Yorkers consider it sacrilege)' }
    ],
    steps: [
      { es: 'Hierve agua en una olla. Agrega las salchichas y cocina a fuego medio (sin hervir fuerte) durante 5-7 minutos hasta que estén calientes y firmes.', en: 'Boil water in a pot. Add frankfurters and cook over medium heat (without hard boiling) for 5-7 minutes until hot and firm.' },
      { es: 'Para mayor sabor, termina las salchichas en una plancha o sartén caliente 1-2 minutos para marcarlas ligeramente.', en: 'For more flavor, finish frankfurters on a hot griddle or skillet 1-2 minutes to mark them slightly.' },
      { es: 'Tuesta los panes con mantequilla en un sartén. Coloca la salchicha dentro, aplica una línea de mostaza, chucrut tibio y salsa de cebolla. Sirve con papas fritas o aros de cebolla.', en: 'Toast buns with butter in a skillet. Place frankfurter inside, apply a line of mustard, warm sauerkraut and onion sauce. Serve with fries or onion rings.' }
    ],
    nutrition: { calories: 380, protein: '16g', carbs: '32g', fat: '22g', fiber: '2g' }
  },

  'ensalada cobb': {
    ingredients: [
      { es: '2 pechugas de pollo a la parrilla, en cubos', en: '2 grilled chicken breasts, cubed' },
      { es: '6 tazas de lechuga romana y mezcla de greens', en: '6 cups romaine lettuce and mixed greens' },
      { es: '4 rebanadas de tocino crujiente, desmenuzado', en: '4 crispy bacon slices, crumbled' },
      { es: '2 huevos duros, picados', en: '2 hard-boiled eggs, chopped' },
      { es: '1 aguacate maduro en cubos', en: '1 ripe avocado, cubed' },
      { es: '1 taza de jitomate cherry partido a la mitad', en: '1 cup cherry tomatoes, halved' },
      { es: '½ taza de queso blue cheese desmoronado', en: '½ cup crumbled blue cheese' },
      { es: '2 cucharadas de cebollín picado', en: '2 tablespoons chopped chives' },
      { es: 'Aderezo vinagreta de vino tinto', en: 'Red wine vinaigrette dressing' }
    ],
    steps: [
      { es: 'Asa las pechugas de pollo sazonadas con sal y pimienta hasta que alcancen 74°C interno. Deja reposar 5 minutos y corta en cubos.', en: 'Grill seasoned chicken breasts until 74°C internal. Rest 5 minutes and cut into cubes.' },
      { es: 'Distribuye la lechuga como base en un platón grande o platos individuales.', en: 'Distribute lettuce as base on a large platter or individual plates.' },
      { es: 'Acomoda los ingredientes en filas ordenadas sobre la lechuga: pollo, tocino, huevo, aguacate, jitomate y queso blue cheese. La presentación en filas es la firma de la Cobb.', en: 'Arrange ingredients in neat rows over lettuce: chicken, bacon, egg, avocado, tomato and blue cheese. The row presentation is the Cobb\'s signature.' },
      { es: 'Rocía con vinagreta de vino tinto justo antes de servir. Espolvorea cebollín picado.', en: 'Drizzle with red wine vinaigrette just before serving. Sprinkle chopped chives.' }
    ],
    nutrition: { calories: 420, protein: '35g', carbs: '12g', fat: '28g', fiber: '5g' }
  },

  'meatloaf': {
    ingredients: [
      { es: '700g de carne de res molida', en: '700g ground beef' },
      { es: '300g de carne de cerdo molida', en: '300g ground pork' },
      { es: '1 taza de pan molido o galletas saladas trituradas', en: '1 cup breadcrumbs or crushed saltines' },
      { es: '2 huevos', en: '2 eggs' },
      { es: '½ taza de leche', en: '½ cup milk' },
      { es: '1 cebolla finamente picada', en: '1 onion, finely chopped' },
      { es: '2 dientes de ajo picados', en: '2 garlic cloves, minced' },
      { es: '1 cucharada de salsa Worcestershire', en: '1 tablespoon Worcestershire sauce' },
      { es: '½ taza de ketchup + ¼ taza extra para el glaseado', en: '½ cup ketchup + ¼ cup extra for glaze' },
      { es: '2 cucharadas de azúcar morena (para el glaseado)', en: '2 tablespoons brown sugar (for glaze)' },
      { es: '1 cucharada de mostaza (para el glaseado)', en: '1 tablespoon mustard (for glaze)' }
    ],
    steps: [
      { es: 'Precalienta el horno a 180°C. Remoja el pan molido en la leche 5 minutos.', en: 'Preheat oven to 180°C. Soak breadcrumbs in milk 5 minutes.' },
      { es: 'Mezcla ambas carnes con el pan remojado, huevos, cebolla, ajo, Worcestershire, ½ taza de ketchup, sal y pimienta. Usa las manos pero no amases en exceso.', en: 'Mix both meats with soaked breadcrumbs, eggs, onion, garlic, Worcestershire, ½ cup ketchup, salt and pepper. Use hands but don\'t over-knead.' },
      { es: 'Forma un rectángulo compacto en una charola con bordes. NO uses un molde tipo pan; la forma libre permite que se dore por todos lados.', en: 'Shape a compact rectangle on a rimmed baking sheet. Do NOT use a loaf pan; free-form allows browning on all sides.' },
      { es: 'Prepara el glaseado mezclando ketchup, azúcar morena y mostaza. Unta sobre el meatloaf.', en: 'Prepare glaze by mixing ketchup, brown sugar and mustard. Spread over meatloaf.' },
      { es: 'Hornea 55-65 minutos hasta que la temperatura interna sea 72°C. Aplica más glaseado a los 40 minutos.', en: 'Bake 55-65 minutes until internal temperature is 72°C. Apply more glaze at 40 minutes.' },
      { es: 'Deja reposar 10 minutos antes de rebanar. Sirve con puré de papas y ejotes.', en: 'Let rest 10 minutes before slicing. Serve with mashed potatoes and green beans.' }
    ],
    nutrition: { calories: 480, protein: '32g', carbs: '28g', fat: '26g', fiber: '1g' }
  },

  'cornbread': {
    ingredients: [
      { es: '1 taza de harina de maíz amarilla', en: '1 cup yellow cornmeal' },
      { es: '1 taza de harina para todo uso', en: '1 cup all-purpose flour' },
      { es: '⅓ de taza de azúcar', en: '⅓ cup sugar' },
      { es: '1 cucharada de polvo para hornear', en: '1 tablespoon baking powder' },
      { es: '½ cucharadita de sal', en: '½ teaspoon salt' },
      { es: '1 taza de buttermilk', en: '1 cup buttermilk' },
      { es: '⅓ de taza de mantequilla derretida', en: '⅓ cup melted butter' },
      { es: '2 huevos', en: '2 eggs' },
      { es: '1 taza de granos de elote (opcional)', en: '1 cup corn kernels (optional)' }
    ],
    steps: [
      { es: 'Precalienta el horno a 200°C. Coloca un sartén de hierro de 25cm en el horno para que se caliente (si usas sartén de hierro).', en: 'Preheat oven to 200°C. Place a 25cm cast iron skillet in the oven to heat (if using cast iron).' },
      { es: 'Mezcla los ingredientes secos (harina de maíz, harina, azúcar, polvo para hornear, sal) en un tazón grande.', en: 'Mix dry ingredients (cornmeal, flour, sugar, baking powder, salt) in a large bowl.' },
      { es: 'En otro tazón, bate el buttermilk con la mantequilla derretida y los huevos. Vierte sobre los secos y mezcla solo hasta integrar. No batas en exceso.', en: 'In another bowl, whisk buttermilk with melted butter and eggs. Pour over dry ingredients and mix just until combined. Don\'t over-mix.' },
      { es: 'Saca el sartén caliente, agrega un trozo de mantequilla que siseará, vierte la masa y regresa al horno. Hornea 20-25 minutos hasta que esté dorado y un palillo salga limpio.', en: 'Remove hot skillet, add a pat of butter that will sizzle, pour batter and return to oven. Bake 20-25 minutes until golden and a toothpick comes out clean.' },
      { es: 'Sirve tibio cortado en triángulos con mantequilla y miel. Perfecto acompañamiento para chili o BBQ.', en: 'Serve warm cut in wedges with butter and honey. Perfect accompaniment for chili or BBQ.' }
    ],
    nutrition: { calories: 260, protein: '6g', carbs: '35g', fat: '11g', fiber: '2g' }
  },

  'pancakes': {
    ingredients: [
      { es: '1½ tazas de harina para todo uso', en: '1½ cups all-purpose flour' },
      { es: '2 cucharadas de azúcar', en: '2 tablespoons sugar' },
      { es: '2 cucharaditas de polvo para hornear', en: '2 teaspoons baking powder' },
      { es: '½ cucharadita de bicarbonato', en: '½ teaspoon baking soda' },
      { es: '1 taza de buttermilk', en: '1 cup buttermilk' },
      { es: '1 huevo', en: '1 egg' },
      { es: '3 cucharadas de mantequilla derretida', en: '3 tablespoons melted butter' },
      { es: 'Mantequilla y maple syrup para servir', en: 'Butter and maple syrup for serving' }
    ],
    steps: [
      { es: 'Mezcla los ingredientes secos. En otro tazón mezcla los líquidos. Combina ambos con movimientos suaves; los grumos están BIEN (mezclar de más produce pancakes gomosos).', en: 'Mix dry ingredients. In another bowl mix wet ingredients. Combine both with gentle folds; lumps are FINE (over-mixing makes rubbery pancakes).' },
      { es: 'Deja reposar la masa 5 minutos mientras calientas un sartén o plancha a fuego medio-bajo.', en: 'Let batter rest 5 minutes while heating a skillet or griddle over medium-low heat.' },
      { es: 'Engrasa con un poco de mantequilla. Vierte ¼ de taza de masa. Cocina hasta que aparezcan burbujas en la superficie y los bordes se vean secos (2-3 min). Voltea y cocina 1-2 min más.', en: 'Grease with a little butter. Pour ¼ cup batter. Cook until bubbles appear on surface and edges look dry (2-3 min). Flip and cook 1-2 min more.' },
      { es: 'Apila 3-4 pancakes, corona con un trozo generoso de mantequilla y un chorro abundante de maple syrup real. Acompaña con fruta fresca o tocino.', en: 'Stack 3-4 pancakes, top with generous pat of butter and abundant drizzle of real maple syrup. Serve with fresh fruit or bacon.' }
    ],
    nutrition: { calories: 350, protein: '8g', carbs: '48g', fat: '14g', fiber: '1g' }
  },

  'gorditas': {
    ingredients: [
      { es: '500g de masa de maíz', en: '500g corn masa' },
      { es: '300g de chicharrón prensado', en: '300g pressed chicharrón (pork cracklings)' },
      { es: '200g de frijoles refritos', en: '200g refried beans' },
      { es: '2 cucharadas de manteca de cerdo', en: '2 tablespoons lard' },
      { es: '1 cucharadita de sal', en: '1 teaspoon salt' },
      { es: 'Lechuga, crema, queso fresco y salsa para rellenar', en: 'Lettuce, cream, fresh cheese and salsa for filling' }
    ],
    steps: [
      { es: 'Mezcla la masa con la manteca, sal y un poco de agua tibia hasta obtener una masa suave que no se pegue. Forma bolas de 60g.', en: 'Mix masa with lard, salt and a little warm water until soft non-sticky dough. Form 60g balls.' },
      { es: 'Aplana cada bola formando un disco grueso (1cm de espesor, más grueso que una tortilla). Cocina en comal a fuego medio 3 minutos por lado hasta que se inflen.', en: 'Flatten each ball into a thick disc (1cm thick, thicker than a tortilla). Cook on comal over medium heat 3 minutes per side until they puff.' },
      { es: 'Con un cuchillo, abre cada gordita por un costado formando un bolsillo (como una pita). Rellena con chicharrón prensado mezclado con frijoles.', en: 'With a knife, open each gordita from one side forming a pocket (like a pita). Fill with pressed chicharrón mixed with beans.' },
      { es: 'Agrega lechuga picada, crema, queso fresco desmoronado y salsa al gusto.', en: 'Add shredded lettuce, cream, crumbled fresh cheese and salsa to taste.' }
    ],
    nutrition: { calories: 420, protein: '18g', carbs: '35g', fat: '24g', fiber: '4g' }
  },

  'sopes': {
    ingredients: [
      { es: '500g de masa de maíz', en: '500g corn masa' },
      { es: '300g de chorizo mexicano, desmenuzado y frito', en: '300g Mexican chorizo, crumbled and fried' },
      { es: '1 taza de frijoles refritos', en: '1 cup refried beans' },
      { es: '2 cucharadas de manteca de cerdo', en: '2 tablespoons lard' },
      { es: 'Crema, lechuga, queso fresco, cebolla y salsa roja', en: 'Cream, lettuce, fresh cheese, onion and red salsa' }
    ],
    steps: [
      { es: 'Forma bolas de masa de 50g y aplánalas en discos de 8cm y 1cm de grosor. Cocina en comal caliente 2 minutos por lado.', en: 'Form 50g masa balls and flatten into 8cm discs, 1cm thick. Cook on hot comal 2 minutes per side.' },
      { es: 'Mientras están calientes, pellizca los bordes hacia arriba formando un borde de 1cm alrededor (como un platito). Este paso hay que hacerlo rápido.', en: 'While still hot, pinch edges upward forming a 1cm rim around (like a small plate). This step must be done quickly.' },
      { es: 'Fríe cada sope en manteca caliente por ambos lados hasta dorar (1 minuto por lado).', en: 'Fry each sope in hot lard on both sides until golden (1 minute per side).' },
      { es: 'Unta frijoles refritos dentro del sope. Corona con chorizo frito, crema, lechuga, queso fresco y salsa roja.', en: 'Spread refried beans inside sope. Top with fried chorizo, cream, lettuce, fresh cheese and red salsa.' }
    ],
    nutrition: { calories: 390, protein: '18g', carbs: '32g', fat: '22g', fiber: '4g' }
  }
};

async function fixUSA() {
  console.log('🇺🇸 BATCH 3: Corrigiendo recetas de USA + faltantes MX 🇲🇽\n');
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
      for (const [key, fix] of Object.entries(usaFixes)) {
        if (titleSearch.includes(key)) { matchedFix = fix; matchedKey = key; break; }
      }
      if (matchedFix) {
        await conn.query('UPDATE recipes SET ingredients = ?, steps = ?, nutrition = ? WHERE id = ?',
          [JSON.stringify(matchedFix.ingredients), JSON.stringify(matchedFix.steps), JSON.stringify(matchedFix.nutrition), r.id]);
        console.log(`✅ ID ${r.id}: ${titleEs || titleEn} [${matchedFix.ingredients.length} ings, ${matchedFix.steps.length} pasos]`);
        fixed++;
      }
    }
    console.log(`\n🎉 Batch 3 completado: ${fixed} recetas corregidas`);
  } catch (error) { console.error('❌ Error:', error); }
  finally { if (conn) conn.release(); pool.end(); }
}
fixUSA();
