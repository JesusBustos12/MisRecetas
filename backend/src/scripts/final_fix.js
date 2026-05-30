import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// ═══════════════════════════════════════════════════════════
// FIX 1: ID 131 Steak Frites - asegurar que ingredients contengan "carne/beef"
// FIX 2: ID 242 Udon - asegurar contenido correcto + categoría
// ═══════════════════════════════════════════════════════════

const contentFixes = [
  {
    id: 242, name: 'Udon Tradicional',
    category_type: 'vegetarian', // udon básico es vegetariano
    ingredients: [
      { es: '400g de fideos udon gruesos (frescos o secos)', en: '400g thick udon noodles (fresh or dried)' },
      { es: '4 tazas de caldo dashi (kombu + bonito)', en: '4 cups dashi broth (kombu + bonito)' },
      { es: '3 cucharadas de salsa de soya', en: '3 tablespoons soy sauce' },
      { es: '2 cucharadas de mirin', en: '2 tablespoons mirin' },
      { es: 'Cebollín (negi) rebanado', en: 'Sliced scallion (negi)' },
      { es: 'Kamaboko (pasta de pescado) rebanado', en: 'Sliced kamaboko (fish cake)' },
      { es: 'Tempura de camarón para servir (opcional)', en: 'Shrimp tempura for serving (optional)' },
    ],
    steps: [
      { es: 'Prepara el caldo: hierve agua con kombu 10 min a fuego bajo. Retira el kombu, agrega las hojuelas de bonito, apaga el fuego y deja reposar 5 min. Cuela.', en: 'Make the broth: simmer water with kombu 10 min on low heat. Remove kombu, add bonito flakes, turn off heat and steep 5 min. Strain.' },
      { es: 'Sazona el caldo dashi con soya y mirin. Prueba y ajusta — debe ser reconfortante y umami, no salado.', en: 'Season the dashi broth with soy sauce and mirin. Taste and adjust — it should be comforting and umami, not salty.' },
      { es: 'Cocina los fideos udon en agua hirviendo separada (2-3 min frescos, 8-10 min secos). Escurre y enjuaga brevemente con agua fría para quitar el exceso de almidón.', en: 'Cook udon noodles in separate boiling water (2-3 min fresh, 8-10 min dried). Drain and briefly rinse with cold water to remove excess starch.' },
      { es: 'Sirve los fideos en un bol grande, vierte el caldo caliente encima. Coloca el kamaboko, cebollín y tempura de camarón. Sirve inmediatamente.', en: 'Serve noodles in a large bowl, pour hot broth over them. Top with kamaboko, scallions and shrimp tempura. Serve immediately.' },
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// FIX DUPLICADOS: Dar pasos únicos a cada receta duplicada
// ═══════════════════════════════════════════════════════════

const duplicateFixes = [
  // --- Grupo: Pato Pekín (3) vs Dim Sum Cerdo (8) ---
  {
    id: 8, name: 'Dim Sum de Cerdo (Siu Mai)',
    steps: [
      { es: 'Pica finamente la carne de cerdo y los camarones a cuchillo (no procesador). Mezcla con salsa de soya, aceite de sésamo, pimienta blanca, jengibre rallado y fécula de maíz.', en: 'Finely mince pork and shrimp by knife (not food processor). Mix with soy sauce, sesame oil, white pepper, grated ginger and cornstarch.' },
      { es: 'Toma una lámina de wonton. Coloca una cucharada de relleno en el centro. Recoge los bordes formando una canasta abierta, aplastando la base contra la mesa para que se sostenga.', en: 'Take a wonton wrapper. Place a tablespoon of filling in the center. Gather edges forming an open basket, flattening the base against the table so it stands.' },
      { es: 'Decora cada siu mai con una gamba pequeña o un guisante verde en la parte superior. Coloca en vaporera de bambú forrada con hojas de col.', en: 'Decorate each siu mai with a small shrimp or green pea on top. Place in a bamboo steamer lined with cabbage leaves.' },
      { es: 'Cocina al vapor a fuego alto por 8-10 minutos hasta que la carne esté cocida y la masa translúcida. Sirve en la misma vaporera con salsa de soya y mostaza china.', en: 'Steam on high heat for 8-10 minutes until meat is cooked and wrapper is translucent. Serve in the same steamer with soy sauce and Chinese mustard.' },
    ],
  },
  // --- Grupo: Sashimi (26), Lobster Roll (67), Pulpo Gallega (102), Ceviche (182), Pescado Frito (258) ---
  {
    id: 26, name: 'Sashimi de Salmón y Atún',
    steps: [
      { es: 'Congela el pescado sashimi-grade a -20°C por 24h (o compra previamente congelado) para eliminar parásitos. Descongela en refrigerador toda la noche.', en: 'Freeze sashimi-grade fish at -4°F for 24h (or buy previously frozen) to eliminate parasites. Thaw in refrigerator overnight.' },
      { es: 'Afila bien el cuchillo yanagiba. Corta el salmón y atún en láminas de 5mm de grosor con un solo movimiento limpio — nunca serruchar. Limpia el cuchillo entre cortes.', en: 'Sharpen your yanagiba knife well. Slice salmon and tuna into 5mm thick slices with one clean pull — never saw. Wipe the knife between cuts.' },
      { es: 'Prepara la guarnición: ralla daikon en hilos finos, corta shiso y prepara jengibre encurtido (gari). Forma una cama de daikon en cada plato.', en: 'Prepare the garnish: grate daikon into fine threads, cut shiso and prepare pickled ginger (gari). Form a daikon bed on each plate.' },
      { es: 'Acomoda las láminas de pescado sobre el daikon alternando colores. Sirve con wasabi fresco rallado y un pocillo de salsa de soya.', en: 'Arrange fish slices on the daikon alternating colors. Serve with freshly grated wasabi and a small dish of soy sauce.' },
    ],
  },
  {
    id: 67, name: 'Maine Lobster Roll',
    steps: [
      { es: 'Hierve agua con sal y un limón. Sumerge las langostas vivas y cocina 8-10 min según tamaño. Transfiere inmediatamente a un baño de hielo.', en: 'Boil salted water with a lemon. Plunge live lobsters in and cook 8-10 min depending on size. Transfer immediately to an ice bath.' },
      { es: 'Rompe las tenazas y colas. Extrae toda la carne y córtala en trozos de 2cm. Reserva fría.', en: 'Crack claws and tails. Extract all the meat and cut into 2cm chunks. Keep chilled.' },
      { es: 'Mezcla la carne de langosta con mayonesa (solo la justa), jugo de limón, un toque de apio picado fino y cebollín. Sazona con sal y pimienta blanca.', en: 'Toss lobster meat with mayonnaise (just enough), lemon juice, a touch of finely diced celery and chives. Season with salt and white pepper.' },
      { es: 'Unta mantequilla en los lados exteriores de los panecillos top-split. Tuesta en sartén hasta dorar ambos lados. Rellena con la mezcla de langosta. Sirve con papas chips y pepinillos.', en: 'Butter the outer sides of top-split rolls. Toast in a skillet until both sides are golden. Fill with the lobster mixture. Serve with chips and pickles.' },
    ],
  },
  {
    id: 102, name: 'Pulpo a la Gallega',
    steps: [
      { es: 'Congela el pulpo 48h para ablandar las fibras (o usa pulpo previamente congelado). Descongela en refrigerador.', en: 'Freeze the octopus 48h to tenderize fibers (or use previously frozen). Thaw in refrigerator.' },
      { es: 'Hierve agua abundante con cebolla y laurel. "Asusta" el pulpo: sumérgelo y sácalo 3 veces antes de dejarlo cocinar. Cuece 35-45 min hasta que esté tierno (un tenedor debe entrar fácil).', en: 'Bring plenty of water to boil with onion and bay leaf. "Scare" the octopus: dip it in and out 3 times before letting it cook. Simmer 35-45 min until tender (a fork should pierce easily).' },
      { es: 'Saca y deja reposar 10 min. Corta las patas en rodajas de 1cm con tijeras de cocina.', en: 'Remove and let rest 10 min. Cut tentacles into 1cm slices with kitchen scissors.' },
      { es: 'Sirve en plato de madera (tradicional). Espolvorea generosamente con pimentón de la Vera (dulce y picante), sal gruesa y un buen chorro de aceite de oliva virgen extra. Acompaña con cachelos (papas cocidas).', en: 'Serve on a wooden plate (traditional). Sprinkle generously with pimentón de la Vera (sweet and hot), coarse salt and a generous drizzle of extra virgin olive oil. Serve with boiled potatoes.' },
    ],
  },
  {
    id: 182, name: 'Ceviche de Pescado',
    steps: [
      { es: 'Corta el pescado blanco fresco (corvina o lenguado) en cubos de 1.5cm. El pescado debe estar muy frío.', en: 'Cut fresh white fish (corvina or sole) into 1.5cm cubes. Fish should be very cold.' },
      { es: 'Exprime abundantes limones (necesitas ¾ taza). Mezcla el jugo con cebolla morada en plumas finas, chile rocoto o habanero picado y sal. Vierte sobre el pescado.', en: 'Squeeze plenty of limes (you need ¾ cup). Mix juice with thinly sliced red onion, chopped rocoto or habanero chile and salt. Pour over the fish.' },
      { es: 'Marina en refrigerador 15-25 minutos (no más, o el pescado se "sobrecocina"). El pescado debe estar opaco por fuera pero translúcido en el centro.', en: 'Marinate in refrigerator 15-25 minutes (no more, or the fish will "overcook"). Fish should be opaque outside but translucent in the center.' },
      { es: 'Incorpora cilantro fresco picado. Sirve inmediatamente en plato frío con camote cocido en rodajas, choclo (maíz) y cancha (maíz tostado). Decora con ají limo.', en: 'Add fresh chopped cilantro. Serve immediately on a cold plate with sliced sweet potato, choclo (corn) and cancha (toasted corn). Garnish with ají limo.' },
    ],
  },
  {
    id: 258, name: 'Pescado Frito Malagueño',
    steps: [
      { es: 'Limpia los pescados pequeños (boquerones, chanquetes o calamares). Si son boquerones, ábrelos en mariposa. Sazona con sal y un toque de limón.', en: 'Clean the small fish (anchovies, whitebait or squid). If anchovies, butterfly them. Season with salt and a squeeze of lemon.' },
      { es: 'Pasa los pescados por harina de trigo (algunos malagueños usan mezcla de harina de trigo y de garbanzo). Sacude el exceso — la capa debe ser finísima.', en: 'Dredge fish in wheat flour (some Malagueños use a mix of wheat and chickpea flour). Shake off excess — the coating should be very thin.' },
      { es: 'Calienta aceite de oliva abundante a 190°C (debe estar muy caliente). Fríe en tandas pequeñas sin sobrellenar, 2-3 minutos hasta que estén dorados y crujientes.', en: 'Heat plenty of olive oil to 375°F (it must be very hot). Fry in small batches without overcrowding, 2-3 minutes until golden and crispy.' },
      { es: 'Escurre brevemente en papel absorbente. Sirve inmediatamente en cucurucho de papel con rodajas de limón y una pizca de sal gruesa. El fritura malagueño se come caliente.', en: 'Drain briefly on paper towels. Serve immediately in a paper cone with lemon wedges and a pinch of coarse salt. Malagueño fried fish is eaten hot.' },
    ],
  },
  // --- Grupo: Curry Verde (151) vs Massaman (155) ---
  {
    id: 155, name: 'Massaman Curry',
    steps: [
      { es: 'Corta la carne de res en cubos de 3cm. En una olla, dora la carne en tandas con aceite a fuego alto. Retira y reserva.', en: 'Cut beef into 3cm cubes. In a pot, brown the meat in batches with oil over high heat. Remove and set aside.' },
      { es: 'En la misma olla, fríe la pasta de curry massaman en ½ taza de crema de leche de coco 2-3 min hasta que el aceite se separe y sea fragante.', en: 'In the same pot, fry massaman curry paste in ½ cup coconut cream 2-3 min until oil separates and it\'s fragrant.' },
      { es: 'Añade el resto de la leche de coco, la carne, papas en cubos, cebollas y cacahuates tostados. Agrega azúcar de palma, salsa de pescado y tamarindo. Hierve, luego baja a fuego lento.', en: 'Add remaining coconut milk, meat, cubed potatoes, onions and toasted peanuts. Add palm sugar, fish sauce and tamarind. Bring to boil, then reduce to low heat.' },
      { es: 'Cocina tapado a fuego bajo 1.5-2 horas hasta que la carne esté tierna y las papas suaves. El curry debe ser espeso, dulce y aromático. Sirve con arroz jazmín.', en: 'Cook covered on low heat 1.5-2 hours until meat is tender and potatoes soft. The curry should be thick, sweet and aromatic. Serve with jasmine rice.' },
    ],
  },
  // --- Grupo: Karaage (32) vs Fried Chicken (56) ---
  {
    id: 32, name: 'Pollo Karaage Frito',
    steps: [
      { es: 'Corta los muslos de pollo deshuesados en trozos de bocado (3-4cm). Marina con salsa de soya, sake, jengibre rallado y ajo rallado mínimo 30 minutos (ideal 2 horas en refri).', en: 'Cut boneless chicken thighs into bite-size pieces (3-4cm). Marinate with soy sauce, sake, grated ginger and grated garlic at least 30 minutes (ideally 2 hours in fridge).' },
      { es: 'Escurre ligeramente la marinada. Espolvorea fécula de papa (katakuriko) sobre cada pieza, envolviendo bien. La capa debe ser fina y desigual — eso crea la textura crujiente japonesa.', en: 'Lightly drain the marinade. Dust potato starch (katakuriko) over each piece, coating well. The layer should be thin and uneven — that creates the Japanese crispy texture.' },
      { es: 'Fríe en aceite a 170°C por 3-4 min hasta dorar ligeramente. Retira y reposa 2 min. Sube a 190°C y fríe una segunda vez por 1 min para máxima crocancia.', en: 'Fry in oil at 340°F for 3-4 min until lightly golden. Remove and rest 2 min. Raise to 375°F and fry a second time for 1 min for maximum crunch.' },
      { es: 'Sirve sobre papel absorbente con gajos de limón, mayonesa japonesa Kewpie y un poco de shichimi togarashi. Acompaña con arroz y ensalada de col.', en: 'Serve on paper towels with lemon wedges, Japanese Kewpie mayo and a sprinkle of shichimi togarashi. Pair with rice and coleslaw.' },
    ],
  },
  // --- Grupo: Croquetas Jamón (104) vs Croquetas Ibérico (254) ---
  {
    id: 254, name: 'Croquetas de Jamón Ibérico',
    steps: [
      { es: 'Prepara la bechamel premium: derrite mantequilla, añade harina y cocina 2 min (roux). Agrega leche caliente poco a poco batiendo sin parar. Cocina 8-10 min hasta que sea muy espesa y se despegue.', en: 'Make premium bechamel: melt butter, add flour and cook 2 min (roux). Gradually add hot milk while whisking constantly. Cook 8-10 min until very thick and pulls away.' },
      { es: 'Incorpora el jamón ibérico cortado en cubitos muy pequeños (brunoise). El jamón ibérico va crudo, no frito — su grasa perfumará la bechamel. Mezcla bien, vierte en bandeja y refrigera mínimo 4 horas.', en: 'Fold in the Iberico ham cut into very small cubes (brunoise). Iberico ham goes raw, not fried — its fat will perfume the bechamel. Mix well, pour onto a tray and refrigerate at least 4 hours.' },
      { es: 'Con manos húmedas, forma cilindros de 5cm. Pasa por harina, luego huevo batido, luego pan rallado fino. Repite huevo y pan para doble empanizado. Refrigera 30 min.', en: 'With wet hands, shape 5cm cylinders. Dredge in flour, then beaten egg, then fine breadcrumbs. Repeat egg and breadcrumbs for double coating. Refrigerate 30 min.' },
      { es: 'Fríe en aceite de oliva a 180°C en tandas de 4-5 por 2-3 min hasta dorar uniformemente. No pinchar. Escurre en rejilla. Sirve calientes — al morderlas, el interior debe ser cremoso y fluido.', en: 'Fry in olive oil at 350°F in batches of 4-5 for 2-3 min until evenly golden. Don\'t pierce. Drain on a rack. Serve hot — when bitten, the inside should be creamy and flowing.' },
    ],
  },
];

async function finalFix() {
  console.log('🔧 FIX FINAL: Duplicados + contenido restante\n');
  const pool = mysql.createPool({
    host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME, ssl: { rejectUnauthorized: false }
  });
  const conn = await pool.getConnection();
  let total = 0;

  // Fix content issues (ID 242 Udon)
  console.log('═══ Contenido incorrecto ═══');
  for (const fix of contentFixes) {
    await conn.query('UPDATE recipes SET ingredients = ?, steps = ?, category_type = ? WHERE id = ?',
      [JSON.stringify(fix.ingredients), JSON.stringify(fix.steps), fix.category_type, fix.id]);
    console.log(`  ✅ ID ${fix.id}: ${fix.name} [${fix.ingredients.length} ings, ${fix.steps.length} pasos, type=${fix.category_type}]`);
    total++;
  }

  // Fix Steak Frites (131) - ensure "carne" is in ingredients  
  console.log('\n═══ Steak Frites ═══');
  const steakIngs = [
    { es: '2 filetes de carne de res gruesos (300g c/u, rib-eye o entrecôt)', en: '2 thick beef steaks (10oz each, rib-eye or entrecôte)' },
    { es: '4 papas grandes para freír', en: '4 large potatoes for frying' },
    { es: 'Aceite para freír', en: 'Oil for frying' },
    { es: '3 cucharadas de mantequilla', en: '3 tablespoons butter' },
    { es: 'Sal gruesa y pimienta negra recién molida', en: 'Coarse salt and freshly ground black pepper' },
    { es: 'Ramitas de tomillo fresco', en: 'Fresh thyme sprigs' },
    { es: 'Salsa béarnaise para acompañar', en: 'Béarnaise sauce for serving' },
  ];
  await conn.query('UPDATE recipes SET ingredients = ? WHERE id = 131', [JSON.stringify(steakIngs)]);
  console.log('  ✅ ID 131: Steak Frites [ingredientes con "carne de res"]');
  total++;

  // Fix all duplicates
  console.log('\n═══ Pasos duplicados → únicos ═══');
  for (const fix of duplicateFixes) {
    await conn.query('UPDATE recipes SET steps = ? WHERE id = ?', [JSON.stringify(fix.steps), fix.id]);
    console.log(`  ✅ ID ${fix.id}: ${fix.name} [${fix.steps.length} pasos únicos]`);
    total++;
  }

  console.log(`\n\n🎉 Fix final completado: ${total} correcciones`);
  conn.release(); pool.end();
}
finalFix();
