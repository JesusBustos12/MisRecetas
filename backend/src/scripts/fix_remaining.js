import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const fixes = {
  // ═══════════ INDIA 🇮🇳 ═══════════
  'butter chicken': {
    ingredients: [
      { es: '800g de muslos de pollo deshuesados, en trozos', en: '800g boneless chicken thighs, in pieces' },
      { es: '1 taza de yogur natural para marinar', en: '1 cup plain yogurt for marinating' },
      { es: '2 cucharadas de garam masala', en: '2 tablespoons garam masala' },
      { es: '1 cucharada de cúrcuma', en: '1 tablespoon turmeric' },
      { es: '1 cucharada de chile en polvo kashmiri', en: '1 tablespoon Kashmiri chili powder' },
      { es: '400g de tomate triturado (lata)', en: '400g crushed tomatoes (can)' },
      { es: '100ml de crema de leche (heavy cream)', en: '100ml heavy cream' },
      { es: '50g de mantequilla', en: '50g butter' },
      { es: '50g de anacardos remojados (para la salsa)', en: '50g cashews soaked (for sauce)' },
      { es: '2 cucharadas de jengibre-ajo en pasta', en: '2 tablespoons ginger-garlic paste' },
      { es: '1 cucharada de miel', en: '1 tablespoon honey' },
      { es: '1 cucharadita de kasoori methi (fenogreco seco)', en: '1 teaspoon kasoori methi (dried fenugreek)' },
      { es: 'Arroz basmati y naan para servir', en: 'Basmati rice and naan for serving' }
    ],
    steps: [
      { es: 'Marina el pollo con yogur, garam masala, cúrcuma, chile y sal. Refrigera mínimo 2 horas (ideal toda la noche).', en: 'Marinate chicken with yogurt, garam masala, turmeric, chili and salt. Refrigerate at least 2 hours (ideally overnight).' },
      { es: 'Asa el pollo marinado en un sartén bien caliente o bajo el broiler hasta que tenga marcas de carbón en los bordes. No necesita estar 100% cocido. Reserva.', en: 'Cook marinated chicken in a very hot skillet or under broiler until charred on edges. Doesn\'t need to be 100% cooked. Reserve.' },
      { es: 'Derrite mantequilla, sofríe la pasta de jengibre-ajo 2 minutos. Agrega tomate triturado y cocina 15 minutos hasta que el aceite se separe.', en: 'Melt butter, sauté ginger-garlic paste 2 minutes. Add crushed tomatoes and cook 15 minutes until oil separates.' },
      { es: 'Licúa los anacardos remojados con un poco de agua y agrégalos a la salsa. Incorpora la crema, miel y kasoori methi desmenuzado entre las palmas.', en: 'Blend soaked cashews with a little water and add to sauce. Add cream, honey and kasoori methi crushed between palms.' },
      { es: 'Agrega el pollo asado a la salsa y cocina 10 minutos a fuego bajo. La salsa debe ser aterciopelada y de color naranja intenso. Sirve con arroz basmati y naan.', en: 'Add grilled chicken to sauce and cook 10 minutes on low heat. Sauce should be velvety and intense orange color. Serve with basmati rice and naan.' }
    ],
    nutrition: { calories: 520, protein: '38g', carbs: '18g', fat: '34g', fiber: '3g' }
  },

  'biryani': {
    ingredients: [
      { es: '500g de pollo o cordero, en trozos', en: '500g chicken or lamb, in pieces' },
      { es: '2 tazas de arroz basmati, remojado 30 min', en: '2 cups basmati rice, soaked 30 min' },
      { es: '1 taza de yogur', en: '1 cup yogurt' },
      { es: '2 cebollas grandes en rodajas finas (para birista)', en: '2 large onions thinly sliced (for birista)' },
      { es: '1 cucharada de pasta de jengibre-ajo', en: '1 tablespoon ginger-garlic paste' },
      { es: '1 cucharadita de azafrán en 3 cucharadas de leche tibia', en: '1 teaspoon saffron in 3 tablespoons warm milk' },
      { es: '2 cucharaditas de garam masala', en: '2 teaspoons garam masala' },
      { es: '4 cardamomos verdes, 4 clavos, 1 canela, 2 hojas de laurel', en: '4 green cardamoms, 4 cloves, 1 cinnamon, 2 bay leaves' },
      { es: 'Ghee (mantequilla clarificada), menta y cilantro frescos', en: 'Ghee (clarified butter), fresh mint and cilantro' },
      { es: 'Nueces y pasas fritas para decorar', en: 'Fried nuts and raisins for garnish' }
    ],
    steps: [
      { es: 'Fríe las cebollas en ghee hasta que estén profundamente doradas y crujientes (birista). Retira la mitad para decorar. En la misma grasa, sella la carne.', en: 'Fry onions in ghee until deeply golden and crispy (birista). Remove half for garnish. In same fat, sear meat.' },
      { es: 'Marina la carne sellada con yogur, jengibre-ajo, garam masala y sal. Cocina tapado 20 minutos a fuego medio.', en: 'Marinate seared meat with yogurt, ginger-garlic, garam masala and salt. Cook covered 20 minutes over medium heat.' },
      { es: 'Hierve el arroz remojado con las especias enteras hasta que esté al 70% de cocción (5-6 minutos). Escurre.', en: 'Boil soaked rice with whole spices until 70% cooked (5-6 minutes). Drain.' },
      { es: 'Arma las capas (dum): carne en el fondo, luego arroz parcialmente cocido. Vierte la leche con azafrán, esparce menta y cilantro. Repite si sobra.', en: 'Build layers (dum): meat at bottom, then partially cooked rice. Pour saffron milk, scatter mint and cilantro. Repeat if remaining.' },
      { es: 'Sella la olla con masa de harina o aluminio doble. Cocina a fuego MUY bajo (dum pukht) durante 25 minutos. No destapes antes.', en: 'Seal pot with flour dough or double foil. Cook on VERY low heat (dum pukht) for 25 minutes. Don\'t open before.' },
      { es: 'Rompe el sello, esponja suavemente con un tenedor mezclando las capas. Decora con birista crujiente, nueces y pasas fritas.', en: 'Break seal, gently fluff with fork mixing layers. Garnish with crispy birista, fried nuts and raisins.' }
    ],
    nutrition: { calories: 580, protein: '32g', carbs: '62g', fat: '22g', fiber: '3g' }
  },

  'tikka masala': {
    ingredients: [
      { es: '600g de pechuga de pollo en cubos grandes', en: '600g chicken breast in large cubes' },
      { es: '1 taza de yogur para marinada', en: '1 cup yogurt for marinade' },
      { es: '2 cucharadas de tandoori masala', en: '2 tablespoons tandoori masala' },
      { es: '400g de tomate triturado', en: '400g crushed tomatoes' },
      { es: '200ml de crema', en: '200ml cream' },
      { es: '2 cucharadas de pasta de jengibre-ajo', en: '2 tablespoons ginger-garlic paste' },
      { es: '1 cucharadita de garam masala', en: '1 teaspoon garam masala' },
      { es: '1 cucharadita de comino', en: '1 teaspoon cumin' },
      { es: '1 cucharadita de pimentón ahumado', en: '1 teaspoon smoked paprika' },
      { es: 'Cilantro fresco y naan para servir', en: 'Fresh cilantro and naan for serving' }
    ],
    steps: [
      { es: 'Marina el pollo en yogur con tandoori masala, sal y limón. Refrigera 2 horas mínimo.', en: 'Marinate chicken in yogurt with tandoori masala, salt and lime. Refrigerate at least 2 hours.' },
      { es: 'Ensarta en brochetas y asa bajo el broiler o en sartén muy caliente hasta carbonizar los bordes (5-6 min). Reserva.', en: 'Thread on skewers and grill under broiler or in very hot skillet until edges char (5-6 min). Reserve.' },
      { es: 'Sofríe jengibre-ajo, comino y pimentón en ghee 2 minutos. Agrega tomate y cocina 10 minutos hasta espesar.', en: 'Sauté ginger-garlic, cumin and paprika in ghee 2 minutes. Add tomatoes and cook 10 minutes until thick.' },
      { es: 'Incorpora la crema y garam masala. Agrega el pollo asado y sus jugos. Cocina 8 minutos más. Sirve con cilantro y naan caliente.', en: 'Add cream and garam masala. Add grilled chicken and its juices. Cook 8 more minutes. Serve with cilantro and warm naan.' }
    ],
    nutrition: { calories: 480, protein: '35g', carbs: '15g', fat: '30g', fiber: '2g' }
  },

  'tandoori': {
    ingredients: [
      { es: '1 pollo entero cortado en 8 piezas (o 8 muslos)', en: '1 whole chicken cut into 8 pieces (or 8 thighs)' },
      { es: '1 taza de yogur espeso', en: '1 cup thick yogurt' },
      { es: '2 cucharadas de jugo de limón', en: '2 tablespoons lemon juice' },
      { es: '2 cucharadas de tandoori masala', en: '2 tablespoons tandoori masala' },
      { es: '1 cucharada de pasta de jengibre-ajo', en: '1 tablespoon ginger-garlic paste' },
      { es: '1 cucharadita de chile kashmiri en polvo', en: '1 teaspoon Kashmiri chili powder' },
      { es: 'Ghee derretido para barnizar', en: 'Melted ghee for basting' },
      { es: 'Aros de cebolla, limón y chutney de menta para servir', en: 'Onion rings, lemon and mint chutney for serving' }
    ],
    steps: [
      { es: 'Haz cortes profundos en el pollo hasta el hueso. Frota con limón y sal. Deja 15 minutos.', en: 'Make deep cuts in chicken to the bone. Rub with lemon and salt. Leave 15 minutes.' },
      { es: 'Mezcla yogur, tandoori masala, jengibre-ajo y chile. Cubre el pollo completamente. Marina 6-8 horas en refrigeración.', en: 'Mix yogurt, tandoori masala, ginger-garlic and chili. Coat chicken completely. Marinate 6-8 hours in refrigerator.' },
      { es: 'Asa en horno a 240°C (o parrilla) durante 25-30 minutos, volteando una vez y barnizando con ghee. Los bordes deben carbonizarse ligeramente.', en: 'Roast in oven at 240°C (or grill) for 25-30 minutes, flipping once and basting with ghee. Edges should char slightly.' },
      { es: 'Sirve sobre una cama de aros de cebolla con gajos de limón y chutney de menta verde al lado.', en: 'Serve on a bed of onion rings with lemon wedges and green mint chutney on the side.' }
    ],
    nutrition: { calories: 380, protein: '42g', carbs: '8g', fat: '20g', fiber: '1g' }
  },

  'samosa': {
    ingredients: [
      { es: '2 tazas de harina para la masa', en: '2 cups flour for dough' },
      { es: '3 patatas medianas hervidas y machacadas', en: '3 medium potatoes, boiled and mashed' },
      { es: '½ taza de chícharos (guisantes)', en: '½ cup green peas' },
      { es: '1 cucharadita de semillas de comino', en: '1 teaspoon cumin seeds' },
      { es: '1 cucharadita de garam masala', en: '1 teaspoon garam masala' },
      { es: '1 chile verde picado', en: '1 green chili, chopped' },
      { es: '1 trozo de jengibre rallado', en: '1 piece ginger, grated' },
      { es: 'Aceite para freír, chutney de tamarindo y menta', en: 'Oil for frying, tamarind and mint chutney' }
    ],
    steps: [
      { es: 'Prepara la masa: mezcla harina, ¼ taza de aceite y sal. Agrega agua hasta formar una masa firme. Reposa 30 minutos.', en: 'Prepare dough: mix flour, ¼ cup oil and salt. Add water to form firm dough. Rest 30 minutes.' },
      { es: 'Para el relleno: tuesta las semillas de comino en aceite, agrega jengibre y chile. Incorpora las patatas, chícharos, garam masala y sal. Mezcla bien y deja enfriar.', en: 'For filling: toast cumin seeds in oil, add ginger and chili. Add potatoes, peas, garam masala and salt. Mix well and let cool.' },
      { es: 'Divide la masa en bolas, estira en óvalos y corta por la mitad. Forma un cono con cada mitad, rellena y sella los bordes con agua, presionando con un tenedor.', en: 'Divide dough into balls, roll into ovals and cut in half. Form a cone with each half, fill and seal edges with water, pressing with fork.' },
      { es: 'Fríe en aceite a 160°C (temperatura baja) durante 8-10 minutos hasta que estén doradas y crujientes. Una temperatura baja garantiza que se cocinen por dentro.', en: 'Fry in 160°C oil (low temperature) for 8-10 minutes until golden and crispy. Low temperature ensures they cook inside.' },
      { es: 'Sirve calientes con chutney de tamarindo (dulce) y chutney de menta (picante).', en: 'Serve hot with tamarind chutney (sweet) and mint chutney (spicy).' }
    ],
    nutrition: { calories: 280, protein: '6g', carbs: '35g', fat: '14g', fiber: '3g' }
  },

  'palak paneer': {
    ingredients: [
      { es: '300g de paneer en cubos de 2cm', en: '300g paneer in 2cm cubes' },
      { es: '500g de espinacas frescas, blanqueadas', en: '500g fresh spinach, blanched' },
      { es: '2 cebollas picadas', en: '2 onions, chopped' },
      { es: '3 jitomates picados', en: '3 tomatoes, chopped' },
      { es: '1 cucharada de pasta de jengibre-ajo', en: '1 tablespoon ginger-garlic paste' },
      { es: '1 cucharadita de garam masala', en: '1 teaspoon garam masala' },
      { es: '1 cucharadita de comino', en: '1 teaspoon cumin' },
      { es: '2 cucharadas de ghee o aceite', en: '2 tablespoons ghee or oil' },
      { es: '2 cucharadas de crema (para decorar)', en: '2 tablespoons cream (for garnish)' }
    ],
    steps: [
      { es: 'Blanquea las espinacas en agua hirviendo 2 minutos, transfiere a agua helada inmediatamente. Licúa hasta obtener un puré verde brillante.', en: 'Blanch spinach in boiling water 2 minutes, transfer to ice water immediately. Blend to bright green purée.' },
      { es: 'Dora los cubos de paneer en ghee hasta que tengan costra dorada por todos los lados. Reserva en agua tibia.', en: 'Brown paneer cubes in ghee until golden crusted on all sides. Reserve in warm water.' },
      { es: 'Sofríe comino, cebolla y jengibre-ajo en ghee 5 minutos. Agrega jitomate y cocina 8 minutos hasta deshacer.', en: 'Sauté cumin, onion and ginger-garlic in ghee 5 minutes. Add tomato and cook 8 minutes until broken down.' },
      { es: 'Incorpora el puré de espinacas y garam masala. Cocina 5 minutos. Agrega el paneer dorado. Sirve con un hilo de crema y naan.', en: 'Add spinach purée and garam masala. Cook 5 minutes. Add browned paneer. Serve with a drizzle of cream and naan.' }
    ],
    nutrition: { calories: 320, protein: '18g', carbs: '14g', fat: '22g', fiber: '4g' }
  },

  'rogan josh': {
    ingredients: [
      { es: '750g de cordero (pierna o paletilla) en cubos de 4cm', en: '750g lamb (leg or shoulder) in 4cm cubes' },
      { es: '1 taza de yogur', en: '1 cup yogurt' },
      { es: '3 cebollas grandes en rodajas', en: '3 large onions, sliced' },
      { es: '4 cucharadas de aceite o ghee', en: '4 tablespoons oil or ghee' },
      { es: '2 cucharadas de chile kashmiri en polvo', en: '2 tablespoons Kashmiri chili powder' },
      { es: '1 cucharadita de jengibre en polvo', en: '1 teaspoon ground ginger' },
      { es: '1 cucharadita de hinojo en polvo', en: '1 teaspoon ground fennel' },
      { es: '4 cardamomos, 4 clavos, 1 canela', en: '4 cardamoms, 4 cloves, 1 cinnamon' },
      { es: 'Sal y arroz basmati para acompañar', en: 'Salt and basmati rice for serving' }
    ],
    steps: [
      { es: 'Sella los cubos de cordero en ghee caliente hasta dorar bien. Retira y reserva.', en: 'Sear lamb cubes in hot ghee until well browned. Remove and reserve.' },
      { es: 'En el mismo ghee, fríe las especias enteras 30 segundos. Agrega las cebollas y sofríe 12-15 minutos hasta dorar profundamente.', en: 'In same ghee, fry whole spices 30 seconds. Add onions and sauté 12-15 minutes until deeply browned.' },
      { es: 'Incorpora el chile kashmiri, jengibre e hinojo. Revuelve 1 minuto. Agrega el yogur cucharada a cucharada, revolviendo entre cada adición para que no se corte.', en: 'Add Kashmiri chili, ginger and fennel. Stir 1 minute. Add yogurt tablespoon by tablespoon, stirring between each addition to prevent splitting.' },
      { es: 'Regresa el cordero, agrega 1 taza de agua. Tapa y cocina a fuego bajo 1.5-2 horas hasta que el cordero esté extremadamente tierno y la salsa roja espesa.', en: 'Return lamb, add 1 cup water. Cover and cook on low 1.5-2 hours until lamb is extremely tender and red sauce thick.' },
      { es: 'El aceite rojo debe flotar sobre la superficie (señal de que está listo). Sirve con arroz basmati al vapor.', en: 'Red oil should float on surface (sign it\'s ready). Serve with steamed basmati rice.' }
    ],
    nutrition: { calories: 480, protein: '38g', carbs: '12g', fat: '32g', fiber: '2g' }
  },

  // ═══════════ TAILANDIA 🇹🇭 ═══════════
  'pad thai': {
    ingredients: [
      { es: '250g de fideos de arroz (pad thai noodles), remojados', en: '250g rice noodles (pad thai noodles), soaked' },
      { es: '200g de camarones medianos, pelados', en: '200g medium shrimp, peeled' },
      { es: '2 huevos', en: '2 eggs' },
      { es: '1 taza de brotes de soya', en: '1 cup bean sprouts' },
      { es: '3 cucharadas de salsa de pescado', en: '3 tablespoons fish sauce' },
      { es: '2 cucharadas de azúcar de palma (o morena)', en: '2 tablespoons palm sugar (or brown)' },
      { es: '2 cucharadas de pasta de tamarindo', en: '2 tablespoons tamarind paste' },
      { es: '3 cucharadas de cacahuates tostados machacados', en: '3 tablespoons crushed roasted peanuts' },
      { es: '2 cebollines en trozos de 3cm', en: '2 scallions, in 3cm pieces' },
      { es: 'Limón, chile seco en hojuelas y brotes extra para servir', en: 'Lime, dried chili flakes and extra sprouts for serving' }
    ],
    steps: [
      { es: 'Remoja los fideos en agua tibia 20-30 minutos hasta que estén flexibles pero firmes. Escurre.', en: 'Soak noodles in warm water 20-30 minutes until flexible but firm. Drain.' },
      { es: 'Prepara la salsa: mezcla tamarindo, salsa de pescado y azúcar de palma. Calienta brevemente hasta disolver.', en: 'Prepare sauce: mix tamarind, fish sauce and palm sugar. Heat briefly until dissolved.' },
      { es: 'Calienta un wok a fuego MUY alto. Saltea los camarones 1-2 minutos. Empújalos a un lado. Rompe los huevos directamente en el wok y revuélvelos rápidamente.', en: 'Heat wok over VERY high heat. Stir-fry shrimp 1-2 minutes. Push to one side. Crack eggs directly into wok and scramble quickly.' },
      { es: 'Agrega los fideos escurridos y la salsa. Mezcla con pinzas 2-3 minutos. Los fideos deben absorber la salsa y tornarse translúcidos.', en: 'Add drained noodles and sauce. Toss with tongs 2-3 minutes. Noodles should absorb sauce and become translucent.' },
      { es: 'Incorpora brotes de soya y cebollines. Saltea 30 segundos más. Sirve con cacahuates machacados, gajos de limón y chile en hojuelas.', en: 'Add bean sprouts and scallions. Stir-fry 30 more seconds. Serve with crushed peanuts, lime wedges and chili flakes.' }
    ],
    nutrition: { calories: 450, protein: '22g', carbs: '55g', fat: '16g', fiber: '2g' }
  },

  'tom yum': {
    ingredients: [
      { es: '500g de camarones grandes con cáscara', en: '500g large shrimp with shell' },
      { es: '1L de caldo de pollo o agua', en: '1L chicken broth or water' },
      { es: '5 rodajas de galangal fresco', en: '5 slices fresh galangal' },
      { es: '3 tallos de lemongrass, machacados y cortados', en: '3 lemongrass stalks, crushed and cut' },
      { es: '5 hojas de lima kaffir, desvenadas', en: '5 kaffir lime leaves, deveined' },
      { es: '200g de champiñones straw o botón', en: '200g straw or button mushrooms' },
      { es: '3 cucharadas de salsa de pescado', en: '3 tablespoons fish sauce' },
      { es: '3 cucharadas de jugo de limón fresco', en: '3 tablespoons fresh lime juice' },
      { es: '2 cucharadas de pasta de chile (nam prik pao)', en: '2 tablespoons chili paste (nam prik pao)' },
      { es: 'Chiles bird\'s eye frescos y cilantro', en: 'Fresh bird\'s eye chilis and cilantro' }
    ],
    steps: [
      { es: 'Hierve el caldo con galangal, lemongrass y hojas de lima kaffir durante 5 minutos para perfumar.', en: 'Boil broth with galangal, lemongrass and kaffir lime leaves for 5 minutes to infuse.' },
      { es: 'Agrega los champiñones y cocina 2 minutos. Incorpora la pasta de chile (nam prik pao).', en: 'Add mushrooms and cook 2 minutes. Add chili paste (nam prik pao).' },
      { es: 'Añade los camarones y cocina solo 2-3 minutos hasta que cambien de color. No sobrecocines.', en: 'Add shrimp and cook only 2-3 minutes until they change color. Don\'t overcook.' },
      { es: 'Retira del fuego. Sazona con salsa de pescado y jugo de limón (NO hiervas después de agregar limón). Sirve con cilantro y chiles frescos.', en: 'Remove from heat. Season with fish sauce and lime juice (do NOT boil after adding lime). Serve with cilantro and fresh chilis.' }
    ],
    nutrition: { calories: 220, protein: '28g', carbs: '12g', fat: '6g', fiber: '1g' }
  },

  'panang curry': {
    ingredients: [
      { es: '500g de carne de res en láminas finas', en: '500g beef in thin slices' },
      { es: '3 cucharadas de pasta de curry panang', en: '3 tablespoons panang curry paste' },
      { es: '400ml de leche de coco', en: '400ml coconut milk' },
      { es: '3 cucharadas de salsa de pescado', en: '3 tablespoons fish sauce' },
      { es: '2 cucharadas de azúcar de palma', en: '2 tablespoons palm sugar' },
      { es: '5 hojas de lima kaffir, en chiffonade', en: '5 kaffir lime leaves, in chiffonade' },
      { es: '¼ taza de cacahuates tostados machacados', en: '¼ cup crushed roasted peanuts' },
      { es: '1 chile rojo en juliana y albahaca thai', en: '1 red chili julienned and Thai basil' }
    ],
    steps: [
      { es: 'Calienta ½ taza de la crema espesa de la leche de coco (la parte sólida) en un wok a fuego medio. Cuando rompa el aceite, agrega la pasta de curry panang y fríe 3 minutos.', en: 'Heat ½ cup thick coconut cream (solid part) in a wok over medium heat. When oil breaks, add panang curry paste and fry 3 minutes.' },
      { es: 'Agrega la carne de res y sella 2-3 minutos. Vierte el resto de la leche de coco.', en: 'Add beef and sear 2-3 minutes. Pour remaining coconut milk.' },
      { es: 'Sazona con salsa de pescado y azúcar de palma. Cocina 8-10 minutos hasta que la carne esté tierna y la salsa espese.', en: 'Season with fish sauce and palm sugar. Cook 8-10 minutes until meat is tender and sauce thickens.' },
      { es: 'Incorpora las hojas de kaffir y cacahuates. Sirve sobre arroz jazmín decorado con albahaca thai, chile rojo y un chorrito de crema de coco.', en: 'Add kaffir leaves and peanuts. Serve over jasmine rice garnished with Thai basil, red chili and a drizzle of coconut cream.' }
    ],
    nutrition: { calories: 520, protein: '32g', carbs: '18g', fat: '38g', fiber: '2g' }
  },

  'tod mun': {
    ingredients: [
      { es: '500g de pescado blanco (tilapia o bacalao), en trozos', en: '500g white fish (tilapia or cod), in pieces' },
      { es: '2 cucharadas de pasta de curry rojo', en: '2 tablespoons red curry paste' },
      { es: '1 huevo', en: '1 egg' },
      { es: '50g de ejotes (judías verdes), en rodajas muy finas', en: '50g green beans, very thinly sliced' },
      { es: '3 hojas de lima kaffir, en chiffonade', en: '3 kaffir lime leaves, in chiffonade' },
      { es: '1 cucharada de salsa de pescado', en: '1 tablespoon fish sauce' },
      { es: 'Aceite para freír', en: 'Oil for frying' },
      { es: 'Salsa agridulce de pepino para acompañar', en: 'Sweet and sour cucumber sauce for serving' }
    ],
    steps: [
      { es: 'Procesa el pescado en un procesador hasta obtener una pasta. Agrega la pasta de curry, huevo, salsa de pescado y mezcla bien.', en: 'Process fish in food processor until a paste forms. Add curry paste, egg, fish sauce and mix well.' },
      { es: 'Incorpora los ejotes en rodajas y las hojas de kaffir. La masa debe ser elástica y pegajosa.', en: 'Add sliced green beans and kaffir leaves. Dough should be elastic and sticky.' },
      { es: 'Con las manos húmedas, forma tortas planas de 5cm. Fríe en aceite a 170°C durante 3-4 minutos por lado hasta dorar.', en: 'With wet hands, form 5cm flat patties. Fry in 170°C oil for 3-4 minutes per side until golden.' },
      { es: 'Sirve calientes con salsa agridulce de pepino y cacahuates.', en: 'Serve hot with sweet and sour cucumber sauce and peanuts.' }
    ],
    nutrition: { calories: 280, protein: '28g', carbs: '10g', fat: '14g', fiber: '1g' }
  },

  'yam nua': {
    ingredients: [
      { es: '400g de lomo de res, asado al punto', en: '400g beef tenderloin, grilled medium-rare' },
      { es: '2 jitomates en gajos', en: '2 tomatoes in wedges' },
      { es: '1 cebolla morada en rodajas finas', en: '1 red onion, thinly sliced' },
      { es: '2 tallos de apio en rodajas', en: '2 celery stalks, sliced' },
      { es: '1 puñado de menta y cilantro frescos', en: '1 handful fresh mint and cilantro' },
      { es: '3 cucharadas de jugo de limón', en: '3 tablespoons lime juice' },
      { es: '2 cucharadas de salsa de pescado', en: '2 tablespoons fish sauce' },
      { es: '1 cucharada de azúcar', en: '1 tablespoon sugar' },
      { es: '3-5 chiles bird\'s eye machacados', en: '3-5 bird\'s eye chilis, crushed' }
    ],
    steps: [
      { es: 'Asa el lomo de res a fuego alto 3-4 minutos por lado (debe quedar rosado por dentro). Deja reposar 5 minutos y rebana finamente contra la fibra.', en: 'Grill beef tenderloin over high heat 3-4 minutes per side (should be pink inside). Rest 5 minutes and slice thinly against the grain.' },
      { es: 'Prepara el aderezo: mezcla jugo de limón, salsa de pescado, azúcar y chiles machacados. Revuelve hasta disolver.', en: 'Prepare dressing: mix lime juice, fish sauce, sugar and crushed chilis. Stir until dissolved.' },
      { es: 'En un tazón, combina la carne rebanada con cebolla, jitomate, apio y el aderezo. Mezcla con las manos.', en: 'In a bowl, combine sliced meat with onion, tomato, celery and dressing. Toss with hands.' },
      { es: 'Agrega las hierbas frescas al final. Sirve inmediatamente sobre hojas de lechuga. La ensalada no debe reposar o se ablanda.', en: 'Add fresh herbs at the end. Serve immediately over lettuce leaves. Salad should not sit or it softens.' }
    ],
    nutrition: { calories: 320, protein: '35g', carbs: '12g', fat: '14g', fiber: '2g' }
  },

  // ═══════════ GRECIA 🇬🇷 ═══════════
  'kleftiko': {
    ingredients: [
      { es: '1.5 kg de pierna de cordero en trozos grandes', en: '1.5 kg leg of lamb in large chunks' },
      { es: '4 patatas medianas en cuartos', en: '4 medium potatoes, quartered' },
      { es: '200g de queso feta en trozos', en: '200g feta cheese in chunks' },
      { es: '4 dientes de ajo laminados', en: '4 garlic cloves, sliced' },
      { es: '2 limones (jugo y ralladura)', en: '2 lemons (juice and zest)' },
      { es: 'Orégano griego seco abundante', en: 'Plenty of dried Greek oregano' },
      { es: '100ml de aceite de oliva extra virgen', en: '100ml extra virgin olive oil' },
      { es: 'Sal, pimienta y papel aluminio', en: 'Salt, pepper and aluminum foil' }
    ],
    steps: [
      { es: 'Haz incisiones en el cordero e introduce láminas de ajo. Sazona con orégano, sal, pimienta, limón y aceite de oliva. Marina 2 horas.', en: 'Make incisions in lamb and insert garlic slices. Season with oregano, salt, pepper, lemon and olive oil. Marinate 2 hours.' },
      { es: 'Coloca las patatas en el fondo de una bandeja honda. Pon el cordero encima. Distribuye el feta alrededor.', en: 'Place potatoes at bottom of a deep roasting pan. Place lamb on top. Distribute feta around.' },
      { es: 'Sella herméticamente con doble capa de aluminio. El sellado es crucial: el nombre "kleftiko" viene de los bandidos que cocinaban bajo tierra para que no se viera el humo.', en: 'Seal tightly with double layer of foil. Sealing is crucial: the name "kleftiko" comes from bandits who cooked underground so smoke wouldn\'t be seen.' },
      { es: 'Hornea a 160°C durante 3-4 horas sin destapar. Al abrir, la carne caerá del hueso y las patatas estarán impregnadas de los jugos del cordero y el feta derretido.', en: 'Bake at 160°C for 3-4 hours without uncovering. Upon opening, meat will fall off bone and potatoes will be infused with lamb juices and melted feta.' }
    ],
    nutrition: { calories: 580, protein: '42g', carbs: '28g', fat: '34g', fiber: '3g' }
  },

  'taramosalata': {
    ingredients: [
      { es: '100g de tarama (huevas de bacalao curadas)', en: '100g tarama (cured cod roe)' },
      { es: '3 rebanadas de pan blanco sin corteza, remojadas en leche', en: '3 white bread slices without crust, soaked in milk' },
      { es: '1 cebolla pequeña rallada', en: '1 small onion, grated' },
      { es: '½ taza de aceite de oliva', en: '½ cup olive oil' },
      { es: '3 cucharadas de jugo de limón', en: '3 tablespoons lemon juice' },
      { es: 'Pan pita caliente para mojar', en: 'Warm pita bread for dipping' }
    ],
    steps: [
      { es: 'Exprime el pan remojado eliminando el exceso de leche. Coloca en un procesador con la tarama y la cebolla.', en: 'Squeeze soaked bread removing excess milk. Place in processor with tarama and onion.' },
      { es: 'Procesa mientras agregas el aceite de oliva en un hilo fino, como si hicieras mayonesa. La emulsión debe ser cremosa y rosada.', en: 'Process while adding olive oil in a thin stream, as if making mayonnaise. Emulsion should be creamy and pink.' },
      { es: 'Agrega jugo de limón al gusto. Refrigera 1 hora. Sirve en un plato con un chorrito de aceite de oliva y pan pita caliente.', en: 'Add lemon juice to taste. Refrigerate 1 hour. Serve on a plate with a drizzle of olive oil and warm pita bread.' }
    ],
    nutrition: { calories: 280, protein: '8g', carbs: '18g', fat: '20g', fiber: '1g' }
  },

  'loukoumades': {
    ingredients: [
      { es: '2 tazas de harina', en: '2 cups flour' },
      { es: '1 sobre de levadura activa', en: '1 packet active dry yeast' },
      { es: '1 taza de agua tibia', en: '1 cup warm water' },
      { es: '1 cucharada de azúcar', en: '1 tablespoon sugar' },
      { es: '½ cucharadita de sal', en: '½ teaspoon salt' },
      { es: 'Aceite para freír', en: 'Oil for frying' },
      { es: 'Miel, canela en polvo y nueces picadas para servir', en: 'Honey, ground cinnamon and chopped walnuts for serving' }
    ],
    steps: [
      { es: 'Disuelve la levadura y azúcar en agua tibia. Espera 10 minutos hasta que espume. Agrega harina y sal. Mezcla hasta obtener una masa pegajosa y elástica. Cubre y deja reposar 1 hora hasta que duplique.', en: 'Dissolve yeast and sugar in warm water. Wait 10 minutes until frothy. Add flour and salt. Mix until sticky, elastic dough. Cover and let rise 1 hour until doubled.' },
      { es: 'Calienta aceite a 170°C. Con las manos húmedas o dos cucharas, toma porciones de masa y déjalas caer al aceite formando bolas irregulares.', en: 'Heat oil to 170°C. With wet hands or two spoons, grab dough portions and drop into oil forming irregular balls.' },
      { es: 'Fríe 3-4 minutos volteando hasta que estén doradas y huecas por dentro. Escurre.', en: 'Fry 3-4 minutes turning until golden and hollow inside. Drain.' },
      { es: 'Sirve inmediatamente en una torre, bañados generosamente con miel caliente, espolvoreados con canela y nueces. En Grecia se comen recién hechos en las calles.', en: 'Serve immediately in a tower, generously drizzled with warm honey, dusted with cinnamon and walnuts. In Greece they\'re eaten fresh from street vendors.' }
    ],
    nutrition: { calories: 320, protein: '5g', carbs: '45g', fat: '14g', fiber: '1g' }
  },

  // ═══════════ CHINA 🇨🇳 ═══════════
  'wonton': {
    ingredients: [
      { es: '250g de carne de cerdo molida', en: '250g ground pork' },
      { es: '200g de camarones, picados grueso', en: '200g shrimp, coarsely chopped' },
      { es: '1 paquete de wrappers para wonton', en: '1 package wonton wrappers' },
      { es: '2 cucharadas de salsa de soya', en: '2 tablespoons soy sauce' },
      { es: '1 cucharada de aceite de sésamo', en: '1 tablespoon sesame oil' },
      { es: '1 cucharada de jengibre rallado', en: '1 tablespoon grated ginger' },
      { es: '2 cebollines picados', en: '2 scallions, chopped' },
      { es: '1L de caldo de pollo para la sopa', en: '1L chicken broth for soup' },
      { es: 'Bok choy y aceite de chile para servir', en: 'Bok choy and chili oil for serving' }
    ],
    steps: [
      { es: 'Mezcla el cerdo, camarones, soya, aceite de sésamo, jengibre y cebollines. Revuelve en una dirección hasta que la mezcla esté elástica y pegajosa.', en: 'Mix pork, shrimp, soy sauce, sesame oil, ginger and scallions. Stir in one direction until mixture is elastic and sticky.' },
      { es: 'Coloca 1 cucharadita de relleno en el centro de cada wrapper. Humedece los bordes con agua, dobla en triángulo y une las dos puntas inferiores formando la clásica forma de wonton.', en: 'Place 1 teaspoon filling in center of each wrapper. Wet edges with water, fold into triangle and join two bottom points forming classic wonton shape.' },
      { es: 'Hierve el caldo de pollo con un trozo de jengibre. Cocina los wontons en tandas durante 4-5 minutos (flotan cuando están listos). Agrega bok choy en los últimos 30 segundos.', en: 'Boil chicken broth with a ginger piece. Cook wontons in batches for 4-5 minutes (they float when done). Add bok choy in last 30 seconds.' },
      { es: 'Sirve en tazones con caldo, los wontons y el bok choy. Rocía con aceite de sésamo, salsa de soya y unas gotas de aceite de chile al gusto.', en: 'Serve in bowls with broth, wontons and bok choy. Drizzle with sesame oil, soy sauce and drops of chili oil to taste.' }
    ],
    nutrition: { calories: 380, protein: '25g', carbs: '35g', fat: '16g', fiber: '2g' }
  },

  'mooncake': {
    ingredients: [
      { es: '300g de harina', en: '300g flour' },
      { es: '200g de jarabe dorado (golden syrup)', en: '200g golden syrup' },
      { es: '60ml de aceite vegetal', en: '60ml vegetable oil' },
      { es: '1 cucharadita de agua de kansui (lejía alcalina)', en: '1 teaspoon kansui water (alkaline solution)' },
      { es: '500g de pasta de semilla de loto (o frijol rojo)', en: '500g lotus seed paste (or red bean paste)' },
      { es: '8 yemas de huevo de pato saladas', en: '8 salted duck egg yolks' },
      { es: '1 huevo batido para barnizar', en: '1 beaten egg for glazing' }
    ],
    steps: [
      { es: 'Prepara la masa: mezcla jarabe dorado, aceite y kansui. Agrega harina y forma una bola suave. Envuelve en plástico y reposa 2 horas.', en: 'Prepare dough: mix golden syrup, oil and kansui. Add flour and form a smooth ball. Wrap in plastic and rest 2 hours.' },
      { es: 'Hornea las yemas de pato saladas a 160°C durante 5 minutos rociadas con licor de arroz.', en: 'Bake salted duck egg yolks at 160°C for 5 minutes sprinkled with rice wine.' },
      { es: 'Divide la pasta de loto en 8 porciones de 60g. Envuelve cada yema con pasta de loto formando una bola.', en: 'Divide lotus paste into 8 portions of 60g. Wrap each yolk with lotus paste forming a ball.' },
      { es: 'Divide la masa en 8 porciones. Aplana cada una y envuelve una bola de relleno. Presiona en un molde decorativo para mooncake.', en: 'Divide dough into 8 portions. Flatten each and wrap a filling ball. Press into decorative mooncake mold.' },
      { es: 'Barniza con huevo, espera 5 minutos, barniza de nuevo. Hornea a 180°C durante 20-25 minutos. Deja reposar 2-3 DÍAS en un recipiente cerrado para que la masa se suavice (回油 hui you).', en: 'Glaze with egg, wait 5 minutes, glaze again. Bake at 180°C for 20-25 minutes. Rest 2-3 DAYS in sealed container for dough to soften (回油 hui you).' }
    ],
    nutrition: { calories: 450, protein: '8g', carbs: '58g', fat: '22g', fiber: '2g' }
  },

  'galletas de lim': {
    ingredients: [
      { es: '2 tazas de harina', en: '2 cups flour' },
      { es: '¾ de taza de azúcar', en: '¾ cup sugar' },
      { es: '½ taza de mantequilla a temperatura ambiente', en: '½ cup butter at room temperature' },
      { es: '1 huevo grande', en: '1 large egg' },
      { es: 'Ralladura de 3 limones', en: 'Zest of 3 lemons' },
      { es: '3 cucharadas de jugo de limón fresco', en: '3 tablespoons fresh lemon juice' },
      { es: '1 cucharadita de polvo para hornear', en: '1 teaspoon baking powder' },
      { es: '½ taza de azúcar glass para decorar', en: '½ cup powdered sugar for decorating' }
    ],
    steps: [
      { es: 'Acriema la mantequilla con el azúcar hasta que esté pálida y esponjosa (5 minutos con batidora). Agrega el huevo, ralladura y jugo de limón.', en: 'Cream butter with sugar until pale and fluffy (5 minutes with mixer). Add egg, lemon zest and juice.' },
      { es: 'Incorpora harina y polvo para hornear. Mezcla hasta unir. La masa será suave y un poco pegajosa. Refrigera 1 hora envuelta en plástico.', en: 'Add flour and baking powder. Mix until combined. Dough will be soft and slightly sticky. Refrigerate 1 hour wrapped in plastic.' },
      { es: 'Forma bolitas de 2cm y ruédalas en azúcar glass. Coloca en charola con separación de 5cm. Hornea a 175°C por 10-12 minutos. Deben verse pálidas y agrietadas (se firmarán al enfriar).', en: 'Form 2cm balls and roll in powdered sugar. Place on sheet with 5cm spacing. Bake at 175°C for 10-12 minutes. Should look pale and cracked (they\'ll firm when cooled).' },
      { es: 'Deja enfriar completamente en la charola. Espolvorea una segunda capa de azúcar glass antes de servir.', en: 'Cool completely on sheet. Dust with a second coat of powdered sugar before serving.' }
    ],
    nutrition: { calories: 160, protein: '2g', carbs: '24g', fat: '6g', fiber: '0g' }
  }
};

async function fixBatch() {
  console.log('🌏 BATCH 6: India 🇮🇳 + Tailandia 🇹🇭 + Grecia 🇬🇷 + China 🇨🇳 + Misc\n');
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
    console.log(`\n🎉 Batch 6 completado: ${fixed} recetas corregidas`);
  } catch (error) { console.error('❌ Error:', error); }
  finally { if (conn) conn.release(); pool.end(); }
}
fixBatch();
