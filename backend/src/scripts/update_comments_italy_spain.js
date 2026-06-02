import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const europeComments = {
  general: [
    { content: "¡Me encantó esta receta! El paso a paso es muy claro.", rating: 5 },
    { content: "El resultado final es exactamente como se ve en la foto.", rating: 5 },
    { content: "¡Delicioso! Definitivamente lo volveré a preparar.", rating: 5 },
    { content: "Muy buena explicación, me quedó riquísimo.", rating: 4 },
    { content: "A mi familia le fascinó, 100% recomendado.", rating: 5 },
    { content: "Excelente aporte. Ya lo guardé en mis favoritos.", rating: 4 }
  ],
  // 🇮🇹 ITALIA
  'carbonara': [
    { content: "¡Por fin una carbonara sin crema! El secreto está en mezclar fuera del fuego para que no se haga huevo revuelto.", rating: 5 },
    { content: "La grasa del guanciale mezclada con el pecorino hace una crema perfecta. Increíble.", rating: 5 },
    { content: "Muy buena receta. No conseguí guanciale y usé panceta, e igual quedó espectacular.", rating: 4 },
    { content: "El truco de guardar agua de cocción es todo lo que necesitas para que la salsa quede sedosa.", rating: 5 },
    { content: "Un plato rápido, elegante y purista. La cantidad de pimienta negra es clave.", rating: 5 }
  ],
  'ossobuco': [
    { content: "La carne se deshacía sola después de 2 horas. Y el tuétano con la gremolata es un manjar de reyes.", rating: 5 },
    { content: "This is traditional Milanese perfection! The gremolata on top cuts through the richness beautifully.", rating: 5 },
    { content: "Muy rico, aconsejo atar la carne como dice la receta para que no se desarme en la olla.", rating: 4 },
    { content: "Excelente para el domingo en familia. Lo acompañé con risotto al azafrán y fue el cielo.", rating: 5 },
    { content: "Lleva tiempo, pero la paciencia recompensa con una salsa espesa y brillante.", rating: 4 }
  ],
  'calzone': [
    { content: "La masa quedó súper crujiente por fuera y el relleno de ricotta y mozzarella derretido es irresistible.", rating: 5 },
    { content: "Mucho mejor que pedir pizza a domicilio. Doblar los bordes con tenedor evita que se salga todo.", rating: 5 },
    { content: "Muy ricos. La próxima vez les pondré menos salsa por dentro para que queden aún más crujientes.", rating: 4 },
    { content: "Excelente receta. Hacer 2 o 3 cortes arriba es súper importante para que no exploten de vapor en el horno.", rating: 5 },
    { content: "Fun to make with kids! The dough is very workable and tastes exactly like an Italian pizzeria.", rating: 4 }
  ],
  'carpaccio': [
    { content: "Súper elegante y facilísimo. El truco de congelar la carne 2 horas es magia pura para poder rebanar.", rating: 5 },
    { content: "The perfect summer appetizer. High quality olive oil and parmigiano are essential here.", rating: 5 },
    { content: "Muy fresco. Agregué unas gotas de aceite de trufa además del de oliva y quedó de restaurante estrella.", rating: 5 },
    { content: "Riquísimo, aunque me costó trabajo cortar láminas tan finas incluso congelado. ¡Un buen cuchillo es clave!", rating: 4 },
    { content: "Un antipasto que nunca falla. La rúcula y las alcaparras le dan un balance salado genial.", rating: 5 }
  ],
  'polenta': [
    { content: "No hay comida más reconfortante. La polenta cremosa con ese ragú desmenuzado encima es un abrazo al alma.", rating: 5 },
    { content: "Stirring the polenta takes effort but the creamy texture you get with the butter and parmesan is so worth it.", rating: 5 },
    { content: "Muy buena receta rústica italiana. Tengan cuidado al revolver la polenta hirviendo porque salpica mucho.", rating: 4 },
    { content: "El ragú es espectacular, lo dejé 3 horas y la carne quedó súper suave.", rating: 5 },
    { content: "Great winter dish. Be sure not to use instant polenta, the slow cooking one has much more flavor.", rating: 4 }
  ],
  'cacciatore': [
    { content: "¡Pollo a la cazadora fantástico! El vino blanco y las aceitunas kalamata hacen que la salsa resalte muchísimo.", rating: 5 },
    { content: "Such a robust, flavorful sauce! The chicken thighs stayed very juicy after simmering.", rating: 5 },
    { content: "Muy rico. Yo le agregué un poquito de peperoncino picante y lo serví sobre pasta. 10/10.", rating: 5 },
    { content: "Excelente guiso, aunque la próxima vez usaré pollo sin hueso para que sea más fácil de comer.", rating: 4 },
    { content: "A true classic. The fresh herbs really make a difference, don't use dried if you can avoid it.", rating: 4 }
  ],
  'prosciutto e melone': [
    { content: "La prueba de que con 2 ingredientes de altísima calidad no necesitas más. Dulce y salado perfecto.", rating: 5 },
    { content: "The most refreshing appetizer! Using a very ripe cantaloupe is the key to this dish.", rating: 5 },
    { content: "Rico y facilísimo. Le agregué un chorrito de reducción balsámica por encima y quedó hermoso.", rating: 4 },
    { content: "Excelente para cuando tienes invitados de sorpresa. Se ve muy elegante y no requiere cocinar nada.", rating: 5 },
    { content: "Classic Italian summer starter. The little touch of fresh mint really elevates it.", rating: 5 }
  ],
  'bolognese': [
    { content: "¡Esta es la receta real! El toque de leche hace que la carne quede suavísima. Vale cada hora de cocción.", rating: 5 },
    { content: "Simmering for 3 hours seems like a lot, but the depth of flavor is incomparable to quick sauces.", rating: 5 },
    { content: "Muy buena, no sabía que la auténtica no llevaba ajo. El sofrito de cebolla, apio y zanahoria es la base de todo.", rating: 5 },
    { content: "Deliciosa. Recomiendo hacer el doble de la receta y congelar la mitad para otra ocasión.", rating: 4 },
    { content: "The nutmeg is the secret star here. Served it over fresh pappardelle and felt like I was in Bologna.", rating: 5 }
  ],
  'tortellini': [
    { content: "Simpleza italiana en su máxima expresión. Un caldo casero bien hecho es fundamental para brillar.", rating: 5 },
    { content: "Comfort in a bowl. So easy if you have good quality tortellini and rich chicken broth.", rating: 5 },
    { content: "Muy ricos. Yo le puse abundante parmesano y un toque extra de nuez moscada al caldo.", rating: 4 },
    { content: "Ideal para días lluviosos. No los dejes hervir de más o se abren y pierden el relleno.", rating: 4 },
    { content: "Exactly what my Nonna used to make. Sometimes you don't need a heavy sauce, just good brodo.", rating: 5 }
  ],
  'milanese': [ // veal milanese
    { content: "La costra dorada es espectacular. Freír en mantequilla clarificada le da un sabor a nuez inigualable.", rating: 5 },
    { content: "Perfectly crispy on the outside and tender inside. Pounding the veal thin is definitely the trick.", rating: 5 },
    { content: "Muy ricas. El contraste de la carne frita caliente con la ensalada de rúcula fría y limón encima es brillante.", rating: 5 },
    { content: "Quedaron muy buenas, pero aconsejo escurrir bien la mantequilla para que no queden grasosas.", rating: 4 },
    { content: "An absolute classic. Breading with fine crumbs and pressing firmly ensures it doesn't fall off in the pan.", rating: 4 }
  ],
  'bistecca fiorentina': [
    { content: "Asar esto sobre carbón blanco es una experiencia. El término 'al sangue' con aceite toscano es inmejorable.", rating: 5 },
    { content: "The king of steaks! Leaving it at room temp for 2 hours makes the cooking so even.", rating: 5 },
    { content: "Impresionante corte. Yo tuve que cocinarla 2 minutos más porque a mi esposa no le gusta tan cruda, pero quedó suavecita.", rating: 4 },
    { content: "El truco de ponerla parada sobre el hueso para que repose es de profesional. Jugosa y sabrosa.", rating: 5 },
    { content: "Very expensive cut of meat but cooking it this simple, traditional way respects its quality perfectly.", rating: 5 }
  ],
  'lasa': [ // lasaña
    { content: "Dejar reposar la lasaña 20 minutos antes de cortar es el mejor consejo. Así no se desmorona en el plato.", rating: 5 },
    { content: "The perfect layers of ragú, pasta, and creamy béchamel. Truly authentic recipe.", rating: 5 },
    { content: "Muy buena, es un proyecto de todo un domingo hacer las salsas pero el resultado final alimenta el alma.", rating: 5 },
    { content: "Riquísima. Aconsejo hacer mucha bechamel para que no quede seca al hornearse.", rating: 4 },
    { content: "A masterpiece. The top layer got beautifully bubbly and browned under the broiler.", rating: 5 }
  ],

  // 🇪🇸 ESPAÑA
  'fabada': [
    { content: "Las fabes quedaron enteras pero como mantequilla por dentro. El truco de asustarlas con agua fría funciona perfecto.", rating: 5 },
    { content: "A heavy, incredible winter stew! The smoky asturian chorizo and blood sausage make the broth so rich.", rating: 5 },
    { content: "Muy buena receta. Es fundamental no remover con cuchara para no romper las alubias, solo agitar la olla.", rating: 5 },
    { content: "Excelente plato. Si consiguen azafrán en hebra auténtico, el color que toma el caldo es hermoso.", rating: 4 },
    { content: "The best comfort food from Spain. Make sure you soak the beans a full 12 hours though!", rating: 4 }
  ],
  'cocido madrile': [ // cocido madrileño
    { content: "La magia de los tres vuelcos. Primero la sopa divina, luego los garbanzos y al final las carnes. ¡Un festín!", rating: 5 },
    { content: "Such a unique way to eat a stew. Cooking the noodles in the strained broth is genius.", rating: 5 },
    { content: "Impresionante guiso de domingo. El tuétano le da un sabor a la sopa que no se puede explicar.", rating: 5 },
    { content: "Muy rico, aunque requiere ollas muy grandes y tiempo. Vale la pena para juntar a toda la familia.", rating: 4 },
    { content: "A true Madrid classic. The chickpeas soak up all the meaty flavors perfectly.", rating: 4 }
  ],
  'cochinillo': [
    { content: "La piel crujió como cristal, tal cual en Segovia. Untar la manteca y no darle la vuelta hasta la mitad es clave.", rating: 5 },
    { content: "Absolutely spectacular centerpiece! Carving it with a plate is so much fun and shows how tender it is.", rating: 5 },
    { content: "Quedó buenísimo, aunque tuve que protegerle las orejas y rabo con aluminio para que no se quemaran en el horno.", rating: 4 },
    { content: "Impecable. El agua en el fondo de la cazuela de barro evita que se seque la carne mientras se hornea.", rating: 5 },
    { content: "Incredible flavor with just water, salt, garlic and lard. It proves that great meat needs little seasoning.", rating: 5 }
  ],
  'cordero asado': [
    { content: "La paletilla se separa del hueso con solo mirarla. Hornear a baja temperatura y rociar sus propios jugos es el secreto.", rating: 5 },
    { content: "The smell of roasting lamb with rosemary and garlic filled the whole house. Delicious!", rating: 5 },
    { content: "Muy sabroso. Acompañarlo con papas panaderas horneadas en la misma grasa del cordero es obligatorio.", rating: 5 },
    { content: "Quedó muy bien, pero asegúrense de usar cordero lechal, si es de animal más grande cambia el sabor fuerte.", rating: 4 },
    { content: "A holiday must-have in Spain. The crispy skin at the end is the best part.", rating: 4 }
  ],
  'croquetas de jam': [ // croquetas de jamón
    { content: "Quedaron súper fluidas por dentro. El truco de la bechamel bien espesa y enfriarla 4 horas es vital.", rating: 5 },
    { content: "The creamiest croquetas ever! Cooking the flour enough so it doesn't taste raw is a great tip.", rating: 5 },
    { content: "Muy buenas. Es un trabajo sucio empanizarlas porque la masa es pegajosa, pero fríen doraditas y perfectas.", rating: 4 },
    { content: "¡Deliciosas! Tienen ese sabor profundo a jamón ibérico. Con una cervecita no hay tapa mejor.", rating: 5 },
    { content: "Make sure the frying oil is hot enough so they seal instantly, otherwise they burst open. Excellent recipe.", rating: 4 }
  ]
};

async function updateEuropeComments() {
  console.log('🇮🇹 🇪🇸 INICIANDO ACTUALIZACIÓN DE COMENTARIOS: ITALIA Y ESPAÑA\n');
  
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
      for (const [key, comments] of Object.entries(europeComments)) {
        if (key === 'general') continue;
        
        const regex = new RegExp(key, 'i');
        if (regex.test(titleSearch)) {
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
          const genericPool = [...europeComments.general].sort(() => 0.5 - Math.random());
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
        
        console.log(`✅ ID ${r.id}: ${titleEs || titleEn} -> Insertados ${selectedComments.length} comentarios orgánicos.`);
        recipesUpdated++;
      }
    }
    
    console.log(`\n🎉 COMPLETADO: ${recipesUpdated} recetas de Italia y España actualizadas con ${commentsInserted} comentarios.`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

updateEuropeComments();
