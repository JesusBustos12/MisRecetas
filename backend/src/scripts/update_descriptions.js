import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const countryAdjectives = {
  mexico: { es: 'mexicana', en: 'Mexican' },
  italy: { es: 'italiana', en: 'Italian' },
  japan: { es: 'japonesa', en: 'Japanese' },
  china: { es: 'china', en: 'Chinese' },
  thailand: { es: 'tailandesa', en: 'Thai' },
  greece: { es: 'griega', en: 'Greek' },
  spain: { es: 'española', en: 'Spanish' },
  usa: { es: 'americana', en: 'American' },
  france: { es: 'francesa', en: 'French' },
  india: { es: 'india', en: 'Indian' }
};

const generators = {
  meat: {
    es: [
      "Un festín carnívoro inigualable. {TITLE} destaca por su carne tierna y jugosa, sazonada con las mejores especias de la cocina {ADJ}.",
      "Para los amantes de la buena carne, {TITLE} es una elección segura. Esta preparación {ADJ} logra un punto de cocción perfecto que se deshace en la boca.",
      "Disfruta de {TITLE}, un plato contundente y lleno de carácter. La técnica {ADJ} resalta los jugos naturales de la carne, creando una experiencia reconfortante.",
      "Rica en proteínas y sabor intenso, {TITLE} es un clásico de la gastronomía {ADJ}. El marinado profundo garantiza que cada bocado sea memorable."
    ],
    en: [
      "An unmatched carnivorous feast. {TITLE} stands out for its tender and juicy meat, seasoned with the best spices of {ADJ} cuisine.",
      "For meat lovers, {TITLE} is a sure choice. This {ADJ} preparation achieves a perfect cook that melts in your mouth.",
      "Enjoy {TITLE}, a hearty dish full of character. The {ADJ} technique highlights the natural juices of the meat, creating a comforting experience.",
      "Rich in protein and intense flavor, {TITLE} is a classic of {ADJ} gastronomy. The deep marinade ensures every bite is memorable."
    ]
  },
  seafood: {
    es: [
      "Toda la frescura del mar en tu plato. {TITLE} es una joya {ADJ} que respeta la delicadeza de los mariscos y pescados con toques cítricos y aromáticos.",
      "Ligero, fresco y elegante. Así es {TITLE}, donde los ingredientes marinos se fusionan con la tradición {ADJ} para ofrecerte una explosión de sabor oceánico.",
      "Perfecto para los días de calor. {TITLE} rescata los sabores costeros de la cocina {ADJ}, entregando un plato vibrante y lleno de matices.",
      "Los frutos del mar son los protagonistas en {TITLE}. Esta receta {ADJ} es ideal para quienes buscan una comida sofisticada y saludable."
    ],
    en: [
      "All the freshness of the sea on your plate. {TITLE} is a {ADJ} jewel that respects the delicacy of seafood and fish with citrus and aromatic touches.",
      "Light, fresh, and elegant. That is {TITLE}, where marine ingredients merge with {ADJ} tradition to offer an explosion of oceanic flavor.",
      "Perfect for warm days. {TITLE} rescues the coastal flavors of {ADJ} cuisine, delivering a vibrant dish full of nuances.",
      "Seafood is the star in {TITLE}. This {ADJ} recipe is ideal for those seeking a sophisticated and healthy meal."
    ]
  },
  vegetarian: {
    es: [
      "Una celebración de los vegetales. {TITLE} demuestra que la comida sin carne en la tradición {ADJ} puede ser increíblemente sabrosa y nutritiva.",
      "Colores vibrantes y texturas sorprendentes. {TITLE} es un plato {ADJ} 100% plant-based que enamorará incluso a los paladares más exigentes.",
      "Saludable, ético y delicioso. Al preparar {TITLE}, disfrutarás de los mejores ingredientes de la huerta combinados con la sazón {ADJ} auténtica.",
      "La opción vegetariana por excelencia de la gastronomía {ADJ}. {TITLE} está repleto de fibra, vitaminas y un sabor reconfortante que no olvidarás."
    ],
    en: [
      "A celebration of vegetables. {TITLE} proves that meatless food in the {ADJ} tradition can be incredibly tasty and nutritious.",
      "Vibrant colors and surprising textures. {TITLE} is a 100% plant-based {ADJ} dish that will make even the most demanding palates fall in love.",
      "Healthy, ethical, and delicious. By preparing {TITLE}, you will enjoy the best garden ingredients combined with authentic {ADJ} seasoning.",
      "The quintessential vegetarian option of {ADJ} gastronomy. {TITLE} is packed with fiber, vitamins, and a comforting flavor you won't forget."
    ]
  },
  desserts: {
    es: [
      "El final perfecto para cualquier comida. {TITLE} es un postre emblemático de la repostería {ADJ}, con el nivel exacto de dulzor y cremosidad.",
      "Endulza tu día con {TITLE}. Esta maravillosa creación {ADJ} combina texturas crujientes y suaves para derretirse en tu paladar.",
      "Una auténtica caricia para el alma. {TITLE} representa lo mejor de los dulces de la cocina {ADJ}, ideal para acompañar con un buen café o té.",
      "Nadie puede resistirse a {TITLE}. Un pecado dulce con herencia {ADJ} que encantará tanto a niños como a adultos por igual."
    ],
    en: [
      "The perfect ending to any meal. {TITLE} is an emblematic dessert of {ADJ} pastry, with the exact level of sweetness and creaminess.",
      "Sweeten your day with {TITLE}. This wonderful {ADJ} creation combines crispy and soft textures to melt on your palate.",
      "A true caress for the soul. {TITLE} represents the best of {ADJ} sweets, ideal to accompany with a good coffee or tea.",
      "No one can resist {TITLE}. A sweet sin with {ADJ} heritage that will enchant both children and adults alike."
    ]
  }
};

const intros = {
  es: [
    "Anímate a descubrir los secretos de este platillo.",
    "Una receta que ha pasado de generación en generación.",
    "Sorprende a tus invitados con este clásico internacional.",
    "Prepararlo en casa es más fácil de lo que imaginas.",
    "Un bocado te transportará directamente a su lugar de origen."
  ],
  en: [
    "Dare to discover the secrets of this dish.",
    "A recipe passed down from generation to generation.",
    "Surprise your guests with this international classic.",
    "Preparing it at home is easier than you imagine.",
    "One bite will transport you directly to its place of origin."
  ]
};

function generateDescription(titleObj, country, type, id) {
  const cLower = (country || 'mexico').toLowerCase().replace('é', 'e').replace('ó', 'o');
  let typeKey = (type || 'vegetarian').toLowerCase();
  if (typeKey === 'dessert') typeKey = 'desserts';
  if (!generators[typeKey]) typeKey = 'vegetarian';

  const adjs = countryAdjectives[cLower] || { es: 'internacional', en: 'international' };
  
  // Use ID to make selection pseudo-random but deterministic for the same recipe
  const genIndex = id % generators[typeKey].es.length;
  const introIndex = id % intros.es.length;

  const tEs = titleObj.es || titleObj.en || 'este plato';
  const tEn = titleObj.en || titleObj.es || 'this dish';

  const descEs = generators[typeKey].es[genIndex].replace('{TITLE}', tEs).replace('{ADJ}', adjs.es) + ' ' + intros.es[introIndex];
  const descEn = generators[typeKey].en[genIndex].replace('{TITLE}', tEn).replace('{ADJ}', adjs.en) + ' ' + intros.en[introIndex];

  return { en: descEn, es: descEs };
}

async function updateDescriptions() {
    console.log('🔌 Conectando a TiDB Cloud y Local...');
    const remotePool = mysql.createPool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 4000,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD || process.env.DB_PASS,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false }
    });

    const localPool = mysql.createPool({
        host: 'localhost',
        user: 'recetas_admin',
        password: 'recetas123',
        database: 'MisRecetas'
    });

    let remoteConn, localConn;
    try {
        remoteConn = await remotePool.getConnection();
        localConn = await localPool.getConnection();

        const [recipes] = await remoteConn.query("SELECT id, title, category_country, category_type FROM recipes");
        console.log(`📊 Actualizando ${recipes.length} recetas con descripciones ricas y dinámicas...`);

        let updated = 0;
        for (const r of recipes) {
            let titleObj = r.title;
            if (typeof titleObj === 'string' && titleObj.startsWith('{')) {
                titleObj = JSON.parse(titleObj);
            } else if (typeof titleObj === 'string') {
                titleObj = { es: titleObj, en: titleObj };
            }

            const newDesc = generateDescription(titleObj, r.category_country, r.category_type, r.id);
            const descJson = JSON.stringify(newDesc);

            await remoteConn.query('UPDATE recipes SET description = ? WHERE id = ?', [descJson, r.id]);
            try {
                await localConn.query('UPDATE recipes SET description = ? WHERE id = ?', [descJson, r.id]);
            } catch (e) {
                // Ignore local errors if local DB is down
            }
            updated++;
        }

        console.log(`✅ ¡Éxito! Se actualizaron las descripciones de ${updated} recetas en ambas bases de datos.`);
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        if (remoteConn) remoteConn.release();
        if (localConn) localConn.release();
        remotePool.end();
        localPool.end();
    }
}

updateDescriptions();
