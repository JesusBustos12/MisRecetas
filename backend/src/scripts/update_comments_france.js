import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const franceComments = {
  general: [
    { content: "¡Me encantó esta receta! El paso a paso es muy claro.", rating: 5 },
    { content: "El resultado final es exactamente como se ve en la foto.", rating: 5 },
    { content: "¡Delicioso! Definitivamente lo volveré a preparar.", rating: 5 },
    { content: "Muy buena explicación, me quedó riquísimo.", rating: 4 },
    { content: "A mi familia le fascinó, 100% recomendado.", rating: 5 }
  ],
  'coq au vin': [
    { content: "Un clásico absoluto. Hervir el pollo en el vino tinto Borgoña le da un color y sabor profundo inigualable.", rating: 5 },
    { content: "This is proper French cooking! The sauce reduces to a beautiful silky texture. Highly recommend.", rating: 5 },
    { content: "Muy buena receta. Flambear con cognac me dio un poco de miedo pero el resultado lo vale completamente.", rating: 4 },
    { content: "Delicioso, el contraste de las cebollitas perla dulces con la salsa de vino es espectacular.", rating: 5 },
    { content: "Great dish for a dinner party. It tastes even better the next day when the flavors have settled.", rating: 4 }
  ],
  'boeuf bourguignon': [
    { content: "¡Magnífico! La carne de res se deshace con el tenedor después de las 3 horas en el horno. Un guiso perfecto.", rating: 5 },
    { content: "Just like Julia Child's recipe! Drying the meat before searing makes a huge difference in the crust.", rating: 5 },
    { content: "Muy rico. Aconsejo usar un buen vino tinto que te tomarías, no de los baratos de caja.", rating: 4 },
    { content: "Excelente receta de invierno. Servido con un puré de papas rústico o pan tostado, no tiene comparación.", rating: 5 },
    { content: "It took a long time to make, but the deep, rich flavor of the burgundy wine sauce is totally worth it.", rating: 4 }
  ],
  'confit de canard': [
    { content: "La técnica de confitar en su propia grasa deja la carne de pato increíblemente suave y la piel extra crujiente al final.", rating: 5 },
    { content: "The quintessential French dish. Curing it with salt and herbs beforehand gives it so much flavor.", rating: 5 },
    { content: "Riquísimo, aunque conseguir tanta grasa de pato fue un reto. Usé papas fritas en esa misma grasa y fue la gloria.", rating: 5 },
    { content: "Una exquisitez. El paso de dorar la piel al sartén al momento de servir es crucial para la textura perfecta.", rating: 4 },
    { content: "Very authentic. The meat simply falls off the bone. Perfect with a light arugula salad to cut the fat.", rating: 4 }
  ],
  'cassoulet': [
    { content: "El rey de los guisos. Romper la costra de pan rallado 4 veces es el secreto para esa textura espesa tradicional.", rating: 5 },
    { content: "This is a heavy, comforting masterpiece. The combination of duck confit, sausage, and beans is incredible.", rating: 5 },
    { content: "Excepcional receta. Las judías blancas absorben todo el sabor de la grasa de pato y las salchichas de Toulouse.", rating: 5 },
    { content: "Me encantó, aunque es un plato muy pesado. Definitivamente para compartir en un día muy frío.", rating: 4 },
    { content: "A true labor of love. Preparing all the meats and slow cooking the beans makes it the ultimate comfort food.", rating: 4 }
  ],
  'steak frites': [
    { content: "El bistec perfecto. Sellarlo en hierro fundido humeante es la clave para la costra. Y las papas doble fritura son magia.", rating: 5 },
    { content: "You can't go wrong with Steak Frites. The béarnaise sauce was challenging but it came out beautifully.", rating: 5 },
    { content: "Muy bueno. Enjuagar y secar bien las papas antes de freírlas de verdad evita que se peguen y quedan crujientes.", rating: 4 },
    { content: "Excelente cena rápida y elegante. Recomiendo usar un buen entrecôte con buena cantidad de marmoleo.", rating: 5 },
    { content: "Classic bistro food at home. The Dijon mustard cuts through the richness of the beef perfectly.", rating: 4 }
  ],
  'croque monsieur': [
    { content: "¡El sándwich elevado a arte! La bechamel y el queso gruyère gratinado lo hacen una delicia decadente.", rating: 5 },
    { content: "So simple yet so luxurious. Adding a touch of nutmeg to the béchamel sauce makes a huge difference.", rating: 5 },
    { content: "Muy rico para un brunch de domingo. Yo le puse un huevo estrellado encima y lo convertí en Croque Madame.", rating: 5 },
    { content: "Delicioso. Hay que tener cuidado con no quemar la bechamel en el horno al final, solo debe burbujear.", rating: 4 },
    { content: "The perfect quick French lunch. Best made with high-quality thick-sliced white bread.", rating: 4 }
  ],
  'escargots': [
    { content: "Una entrada lujosísima. La mantequilla de ajo, perejil y chalote burbujeando recién salida del horno es un sueño.", rating: 5 },
    { content: "These were fantastic! Don't forget to serve with plenty of crusty baguette to soak up every drop of garlic butter.", rating: 5 },
    { content: "Muy buena receta. Le agregué un chorrito de coñac en vez de Pernod a la mantequilla y quedó excelente.", rating: 4 },
    { content: "¡Me sentí en París! Es mucho más fácil de hacer en casa de lo que parece, siempre que consigas los caracoles en lata.", rating: 5 },
    { content: "Delicious and rich. Make sure the butter gets slightly browned for that extra nutty flavor.", rating: 4 }
  ],
  'oignon': [ // soupe a l'oignon
    { content: "El secreto de una verdadera sopa de cebolla francesa es la paciencia. Caramelizarlas por una hora vale toda la pena.", rating: 5 },
    { content: "The ultimate comfort soup. The thick layer of melted gruyere cheese over the toasted baguette is heavenly.", rating: 5 },
    { content: "Excelente receta. Desglasar la olla con el vino blanco le da una acidez que balancea lo dulce de la cebolla.", rating: 5 },
    { content: "Muy rica, pero no apresuren el paso de la cebolla. Si suben el fuego se quema y amarga el caldo.", rating: 4 },
    { content: "Classic bistro flavor. I used homemade beef stock and it elevated the dish entirely.", rating: 4 }
  ],
  'fromage': [ // souffle au fromage
    { content: "¡Subió perfectamente! El truco de pasar el dedo por el borde para crear el surco funciona de maravilla.", rating: 5 },
    { content: "It's scary to make a soufflé, but these instructions were spot on. Fluffy, cheesy, and gorgeous.", rating: 5 },
    { content: "Delicioso, el queso gruyère le da un sabor muy elegante. Asegúrense de no abrir el horno bajo ninguna circunstancia.", rating: 4 },
    { content: "Me quedó un poco chueco, pero la textura por dentro era como comer una nube de queso. Increíble.", rating: 4 },
    { content: "Excellent technique. Dusting the mold with parmesan instead of just butter gave it a nice savory crust.", rating: 5 }
  ],
  'chocolat': [ // souffle au chocolat
    { content: "Un postre de restaurante fino hecho en casa. El centro quedó ligeramente tembloroso y delicioso.", rating: 5 },
    { content: "Absolutely decadent. Using high quality 70% dark chocolate makes this soufflé incredibly rich.", rating: 5 },
    { content: "Riquísimo. Espolvorear azúcar en el ramequín ayuda a que la masa 'trepe' por las paredes y suba bien alto.", rating: 5 },
    { content: "Muy rico, solo recuerden servirlo inmediatamente porque se desinfla rápido. ¡Con crema batida es un 10!", rating: 4 },
    { content: "A bit tricky to get the egg whites folded just right without losing the air, but the result is spectacular.", rating: 4 }
  ],
  'salade ni': [ // salade niçoise
    { content: "Fresca, vibrante y muy saludable. No mezclar los ingredientes y dejarlos en secciones hace que se vea hermosa.", rating: 5 },
    { content: "A perfect summer salad. The Dijon vinaigrette ties everything together beautifully.", rating: 5 },
    { content: "Muy buena, es importante usar atún en aceite de oliva y no en agua, la textura cambia por completo.", rating: 4 },
    { content: "Excelente plato principal. Las papitas cocidas y los ejotes crujientes son la mejor combinación.", rating: 5 },
    { content: "Very authentic Nicoise. The olives and anchovies add that necessary salty Mediterranean punch.", rating: 4 }
  ],
  'pissaladi': [ // pissaladière
    { content: "Como una pizza francesa superior. Las cebollas súper dulces contrastan perfectamente con las anchoas saladas.", rating: 5 },
    { content: "A fantastic appetizer! Cooking the onions very slowly until they are practically jam is the secret.", rating: 5 },
    { content: "Muy rica. La masa de pan gruesa absorbe muy bien el aceite de oliva y el jugo de las cebollas caramelizadas.", rating: 4 },
    { content: "Excelente receta del sur de Francia. Las aceitunas negras de Niza le dan el toque auténtico.", rating: 5 },
    { content: "Great combination of sweet and salty. If you don't like anchovies, this might not be for you, but it's traditional!", rating: 4 }
  ],
  'crepes_suzette': [
    { content: "¡Un postre espectacular! La masa quedó finísima y el toque de naranja y licor flameado es pura elegancia.", rating: 5 },
    { content: "Classic French dessert. Flambéing the crepes tableside with Grand Marnier really impressed my guests.", rating: 5 },
    { content: "Muy ricas. No se preocupen si al principio la mantequilla de naranja parece cortada, al calentar se arregla.", rating: 4 },
    { content: "Deliciosas, dulces pero con el toque cítrico perfecto para no empalagar. Son un vicio.", rating: 5 },
    { content: "Beautiful technique. Making the crepes paper-thin requires a bit of practice but the sauce covers any mistakes.", rating: 4 }
  ],
  'crepe': [ // general crepes
    { content: "La receta base perfecta. La masa es súper versátil, sirve tanto para rellenos dulces como salados.", rating: 5 },
    { content: "Perfect thin crepes! Letting the batter rest in the fridge for an hour really helps the gluten relax.", rating: 5 },
    { content: "Quedaron muy buenas. Recomiendo usar una buena sartén antiadherente para no tener que abusar de la mantequilla.", rating: 4 },
    { content: "Fáciles y rápidas. Yo las rellené de Nutella y fresas y a mis hijos les fascinaron.", rating: 5 },
    { content: "Great recipe. The edges get nicely crispy if you spread the batter thinly enough.", rating: 4 }
  ],
  'ratatouille': [
    { content: "Un clásico reconfortante. Pochar lentamente los vegetales con hierbas de Provenza saca toda su dulzura natural.", rating: 5 },
    { content: "Tastes like summer in Provence. Slicing the vegetables evenly ensures everything cooks perfectly.", rating: 5 },
    { content: "Muy sano y rico. El secreto definitivamente es un muy buen aceite de oliva extra virgen.", rating: 4 },
    { content: "Como guarnición es excelente, y si sobra, al día siguiente sabe aún mejor servido en frío o con pan.", rating: 5 },
    { content: "A beautiful dish. Making it the traditional way by stewing takes time, but the texture is incomparable.", rating: 4 }
  ],
  'quiche': [ // quiche lorraine
    { content: "La masa quebrada casera es otro nivel. Y el relleno de panceta, gruyère y nata quedó súper cremoso y nada seco.", rating: 5 },
    { content: "The ultimate savory tart. Blind baking the crust first is crucial to avoid a soggy bottom.", rating: 5 },
    { content: "Excelente receta para un almuerzo ligero. Recomiendo no batir en exceso los huevos para que no se infle demasiado.", rating: 4 },
    { content: "Me encantó. El toque de nuez moscada en la mezcla de nata es sutil pero esencial.", rating: 5 },
    { content: "Delicious and rich! Bacon and gruyere are a match made in heaven in this classic Lorraine.", rating: 4 }
  ],
  'macaron': [
    { content: "Son difíciles de dominar, pero la receta te explica muy bien cómo lograr ese 'pie' característico. ¡Quedaron hermosos!", rating: 4 },
    { content: "The macaronage folding technique takes practice, but once you get it, these turn out amazing. Flawless recipe.", rating: 5 },
    { content: "Al fin una receta con proporciones correctas. El merengue francés bien firme es la clave para que no se agrieten.", rating: 5 },
    { content: "Muy ricos. Tuve que tirar la primera tanda por no dejar que la costra secara bien antes de hornear. ¡No se salten ese paso!", rating: 4 },
    { content: "So elegant and light! Filled them with a dark chocolate ganache to balance the sweetness of the shells.", rating: 5 }
  ],
  'tarte tatin': [
    { content: "La mejor tarta de manzana. El caramelo escurriendo por el hojaldre crujiente recién volteada es un poema.", rating: 5 },
    { content: "Incredible upside-down tart. Cooking the apples in caramel first makes them tender and packed with flavor.", rating: 5 },
    { content: "Muy rica, aunque me dio un poco de miedo voltearla por el caramelo caliente. Quedó rústica pero deliciosa.", rating: 4 },
    { content: "Excelente receta tradicional. Si consiguen manzanas ácidas tipo Granny Smith, el contraste con el caramelo es perfecto.", rating: 5 },
    { content: "A showstopper dessert. So much easier than a traditional pie but looks and tastes like a fancy bakery item.", rating: 5 }
  ],
  'croissant': [
    { content: "Es un proceso largo de laminado, pero ver las capas de hojaldre en el horno y el olor a mantequilla lo justifica todo.", rating: 5 },
    { content: "Making croissants from scratch is a weekend project, but the flaky, buttery layers are incomparable to store-bought.", rating: 5 },
    { content: "Uf, el laminado requiere paciencia para que la mantequilla no se derrita. Quedaron doraditos y crujientes.", rating: 4 },
    { content: "Increíble textura. Asegúrense de usar mantequilla europea de alta calidad con más porcentaje de grasa.", rating: 5 },
    { content: "The honeycomb interior structure was perfect! Nothing beats a fresh, warm croissant for Sunday breakfast.", rating: 5 }
  ]
};

async function updateFranceComments() {
  console.log('🥖 INICIANDO ACTUALIZACIÓN DE COMENTARIOS: FRANCIA 🇫🇷\n');
  
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
    
    // Obtener todas las recetas
    const [recipes] = await conn.query('SELECT id, title FROM recipes ORDER BY id');
    
    // Obtener todos los usuarios para asignar como autores
    const [users] = await conn.query('SELECT id FROM users');
    if (users.length === 0) throw new Error('No hay usuarios en la base de datos para asignar comentarios.');

    let recipesUpdated = 0;
    let commentsInserted = 0;

    for (const r of recipes) {
      let title;
      try { title = typeof r.title === 'string' && r.title.startsWith('{') ? JSON.parse(r.title) : r.title; } catch(e) { title = r.title; }
      const titleEs = (typeof title === 'object' ? title.es : title) || '';
      const titleEn = (typeof title === 'object' ? title.en : title) || '';
      const titleSearch = `${titleEs} ${titleEn}`.toLowerCase();
      
      let matchedComments = null;
      for (const [key, comments] of Object.entries(franceComments)) {
        // match regex keys for soupe a l'oignon etc.
        const regex = new RegExp(key, 'i');
        if (regex.test(titleSearch)) {
          // Avoid matching "crepe" when it's "crepes_suzette"
          if (key === 'crepe' && titleSearch.includes('suzette')) continue;
          
          matchedComments = comments;
          break;
        }
      }
      
      if (matchedComments) {
        // 1. Eliminar comentarios viejos de esta receta
        await conn.query('DELETE FROM comments WHERE recipe_id = ?', [r.id]);
        
        // 2. Insertar una cantidad aleatoria de comentarios (entre 3 y 7)
        const numComments = Math.floor(Math.random() * 5) + 3; // 3, 4, 5, 6, o 7
        
        // Mezclar los comentarios específicos y tomar hasta 5
        let selectedComments = [...matchedComments].sort(() => 0.5 - Math.random());
        
        // Si se requieren más comentarios que los específicos disponibles, rellenar con genéricos
        if (numComments > selectedComments.length) {
          const genericPool = [...franceComments.general].sort(() => 0.5 - Math.random());
          const needed = numComments - selectedComments.length;
          selectedComments = selectedComments.concat(genericPool.slice(0, needed));
        } else {
          selectedComments = selectedComments.slice(0, numComments);
        }
        
        // Mezclar una vez más para que los genéricos no siempre queden al final
        selectedComments = selectedComments.sort(() => 0.5 - Math.random());
        
        // Mezclar usuarios para garantizar que no se repitan en esta receta
        const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
        
        let i = 0;
        for (const review of selectedComments) {
          const randomUser = shuffledUsers[i].id;
          const randomPastDays = Math.floor(Math.random() * 180);
          const createdAt = new Date(Date.now() - randomPastDays * 24 * 60 * 60 * 1000);

          await conn.query(
            'INSERT INTO comments (recipe_id, user_id, content, rating, created_at) VALUES (?, ?, ?, ?, ?)',
            [r.id, randomUser, review.content, review.rating, createdAt]
          );
          commentsInserted++;
          i++;
        }
        
        console.log(`✅ ID ${r.id}: ${titleEs || titleEn} -> Insertados ${matchedComments.length} comentarios (sin incongruencias).`);
        recipesUpdated++;
      }
    }
    
    console.log(`\n🎉 COMPLETADO: ${recipesUpdated} recetas francesas actualizadas con ${commentsInserted} comentarios de calidad.`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

updateFranceComments();
