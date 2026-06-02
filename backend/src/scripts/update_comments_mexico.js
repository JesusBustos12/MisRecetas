import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const mexicoComments = {
  general: [
    { content: "¡Me encantó esta receta! El paso a paso es muy claro.", rating: 5 },
    { content: "El resultado final es exactamente como se ve en la foto.", rating: 5 },
    { content: "¡Delicioso! Definitivamente lo volveré a preparar.", rating: 5 },
    { content: "Muy buena explicación, me quedó riquísimo.", rating: 4 },
    { content: "A mi familia le fascinó, 100% recomendado.", rating: 5 },
    { content: "Excelente aporte. Ya lo guardé en mis favoritos.", rating: 4 }
  ],
  'tacos al pastor': [
    { content: "¡Increíbles! El adobo de achiote quedó perfecto y la piña asada le da el toque dulce exacto a la carne. 100% recomendados.", rating: 5 },
    { content: "These al pastor tacos are phenomenal! The marinade is spot on and they taste just like a street cart in Mexico City.", rating: 5 },
    { content: "Muy buena receta, aunque me costó un poco asar la carne sin que se secara. El sabor final es muy auténtico.", rating: 4 },
    { content: "La salsa quedó deliciosa. Hice la receta completa para mi familia y no quedó ni un taco.", rating: 5 },
    { content: "Good recipe, but make sure to marinate overnight! The flavor is much better if you let it sit.", rating: 4 }
  ],
  'mole poblano': [
    { content: "Es una receta laboriosa pero vale cada segundo. El balance entre el chocolate y los chiles secos es de restaurante.", rating: 5 },
    { content: "A true masterpiece! Making mole from scratch is intimidating but these instructions were very clear. Loved it.", rating: 5 },
    { content: "Me encantó el sabor, aunque me pasé un poco de dulce con el chocolate. Definitivamente la volveré a hacer ajustando el azúcar.", rating: 4 },
    { content: "Nunca pensé que podría hacer mole en casa. ¡Quedó espeso, brillante y con un sabor espectacular!", rating: 5 },
    { content: "Tosté un poco de más los chiles y amargó un poco, pero la textura de la salsa con las almendras y ajonjolí es perfecta.", rating: 3 }
  ],
  'pozole rojo': [
    { content: "This pozole is authentic and comforting. Reminds me of my grandmother's cooking in Jalisco!", rating: 5 },
    { content: "¡Delicioso! El secreto definitivamente es dejar que el maíz reviente bien y que la carne quede muy suavecita.", rating: 5 },
    { content: "Muy buen sabor. Solo sugiero agregar más rábano y lechuga fresca al momento de servir, le da mucha frescura.", rating: 4 },
    { content: "Excelente receta para las fiestas patrias. El caldo quedó con un color rojo intenso hermoso y un sabor profundo.", rating: 5 },
    { content: "It takes a while to cook the pork until tender, but the wait is totally worth it. Great weekend project.", rating: 4 }
  ],
  'cochinita pibil': [
    { content: "¡La mejor cochinita que he preparado! La naranja agria hace toda la diferencia. Se deshace en la boca.", rating: 5 },
    { content: "Absolutely delicious. Wrapping it in banana leaves really seals in the moisture and flavor.", rating: 5 },
    { content: "La cebolla morada curtida con habanero es el complemento perfecto para esta receta. Pica rico.", rating: 5 },
    { content: "Muy rica, aunque no conseguí hojas de plátano y usé aluminio. Aún así el adobo quedó riquísimo.", rating: 4 },
    { content: "Great flavor, though finding authentic Yucatecan oregano was tough. Substituted with regular and it was still a 4/5.", rating: 4 }
  ],
  'chiles en nogada': [
    { content: "¡Una obra de arte! La nogada quedó cremosa y el relleno de frutas con carne es una explosión de sabores patrios.", rating: 5 },
    { content: "The contrast between the sweet, creamy walnut sauce and the savory stuffed poblano is incredible. So elegant.", rating: 5 },
    { content: "Es bastante trabajo pelar la nuez de castilla fresca, pero el color blanco impecable de la salsa lo vale por completo.", rating: 4 },
    { content: "Me quedó deliciosa. Mi único consejo es asar los poblanos con cuidado para que no se rompan al rellenarlos.", rating: 4 },
    { content: "Una receta de lujo para septiembre. Los granos de granada roja le dan ese toque ácido perfecto al final.", rating: 5 }
  ],
  'tamales oaxaque': [
    { content: "La masa quedó ultra esponjosa, el tip de batir la manteca hasta que flote en agua es oro puro.", rating: 5 },
    { content: "These Oaxacan tamales wrapped in banana leaves are so moist. The black mole filling is rich and savory.", rating: 5 },
    { content: "Muy buena receta, aunque me tomó tiempo agarrarle el truco a cómo doblar la hoja de plátano para que no se salga la masa.", rating: 4 },
    { content: "Deliciosos. El sabor que le aporta la hoja de plátano cocida al vapor no se compara con la de maíz.", rating: 5 },
    { content: "Me quedaron un poquito secos por no hidratar bien la masa con el caldo, pero el sabor del mole lo salvó.", rating: 3 }
  ],
  'carnitas': [
    { content: "¡Crujientes por fuera y jugosas por dentro! Hervirlas en su propia manteca con naranja y cola es el secreto de Michoacán.", rating: 5 },
    { content: "Unbelievable texture! Frying them hard at the very end gave them those perfect crispy edges.", rating: 5 },
    { content: "Muy ricas, hice tacos toda la semana. Solo recomiendo usar una olla de cobre gruesa para que la temperatura no baje.", rating: 4 },
    { content: "Quedaron perfectas. El toque de leche evaporada hace que doren hermoso.", rating: 5 },
    { content: "It's a heavy meal but entirely worth the calories. Best Sunday family feast recipe.", rating: 4 }
  ],
  'sopa de tortilla': [
    { content: "Super reconfortante. El caldo de jitomate con el ligero picor del chile pasilla frito es celestial.", rating: 5 },
    { content: "This tortilla soup is exactly what I needed. The crispy fried strips on top of the hot broth are magical.", rating: 5 },
    { content: "Muy rica, pero te aconsejo poner las tortillas frito justo en el último segundo para que no se aguaden.", rating: 4 },
    { content: "Excelente receta. Le puse extra chicharrón, aguacate y queso panela. ¡Un plato completo!", rating: 5 },
    { content: "Good recipe, the epazote really gives it that authentic Mexican herbal note that you can't get with cilantro.", rating: 4 }
  ],
  'chilaquiles': [
    { content: "¡El mejor desayuno dominguero! La salsa verde quedó en su punto exacto, ni muy ácida ni muy picante.", rating: 5 },
    { content: "Perfect hangover cure! The totopos stayed slightly crunchy which is exactly how I like them.", rating: 5 },
    { content: "Riquísimos, los acompañé con dos huevos estrellados y muchísima crema y queso fresco. 10/10.", rating: 5 },
    { content: "Muy buena salsa, aunque sugiero hervir menos los tomatillos para que no amarguen. Fuera de eso, excelentes.", rating: 4 },
    { content: "Easy, quick, and delicious. Adding some shredded chicken makes it a full meal.", rating: 4 }
  ],
  'enchiladas suizas': [
    { content: "La crema con el tomate verde es una delicia. Y el queso gratinado burbujeando del horno es un espectáculo.", rating: 5 },
    { content: "These creamy green enchiladas are to die for! Much milder than regular ones, perfect for my kids.", rating: 5 },
    { content: "Muy buenas. Solo un tip: pasen las tortillas rápido por el aceite para que no se rompan al enrollarlas con el pollo.", rating: 4 },
    { content: "El sabor del cilantro en la salsa le da una frescura increíble. Totalmente de restaurante tipo Sanborns.", rating: 5 },
    { content: "Great dish. Make sure to use a good melting cheese like Chihuahua or Monterey Jack for the best crust.", rating: 4 }
  ],
  'torta ahogada': [
    { content: "¡Sabe a Guadalajara puro! La salsa está picosísima, pero no puedes dejar de comerla. El birote aguantó perfecto.", rating: 5 },
    { content: "Wow! Very spicy but incredibly flavorful. Drowning the sandwich in that hot sauce is an experience.", rating: 4 },
    { content: "Excelente receta, solo que si no consigues el birote salado auténtico, un bolillo de masa madre muy horneado sirve bien.", rating: 4 },
    { content: "¡Riquísimas! Las carnitas quedaron súper jugosas y la salsa de árbol es adictiva. Limón y cebolla obligatorios.", rating: 5 },
    { content: "Delicious, though eating it is super messy! Make sure you have a lot of napkins ready.", rating: 4 }
  ],
  'barbacoa': [
    { content: "La carne se deshacía sola. La hoja de maguey y las hojas de aguacate le dieron ese olor a humo de tierra inolvidable.", rating: 5 },
    { content: "Amazing Sunday tradition. Slow cooking the lamb makes it melt in your mouth. The consommé on the side is a must.", rating: 5 },
    { content: "No conseguí pencas de maguey y usé aluminio con hojas de plátano. No es 100% igual pero quedó de lujo.", rating: 4 },
    { content: "El consomé que suelta la carne abajo es oro líquido. Unos tacos con salsa borracha y listo.", rating: 5 },
    { content: "Takes patience to cook for 6 hours, but the flavor is deep and earthy. Fantastic recipe.", rating: 4 }
  ],
  'flautas': [
    { content: "Super crujientes y no quedaron aceitosas. El pollo con un toque de chipotle por dentro les dio un sabor genial.", rating: 5 },
    { content: "These rolled tacos are awesome. Frying them seam-side down first keeps them perfectly closed.", rating: 5 },
    { content: "Muy ricas, me gustaron mucho con la lechuga, queso fresco y la salsa verde bien picosa encima.", rating: 4 },
    { content: "Quedaron muy buenas, pero aconsejo no rellenarlas demasiado o explotan al freír.", rating: 3 },
    { content: "Perfect crunchy bite. The contrast between the hot fried tortilla and the cold sour cream is everything.", rating: 5 }
  ],
  'huevos rancheros': [
    { content: "Desayuno de campeones. La salsa rústica asada en comal le da un sabor a rancho espectacular.", rating: 5 },
    { content: "Classic and hearty! The runny yolk mixing with the spicy charred tomato salsa and beans is heaven.", rating: 5 },
    { content: "Muy ricos y rápidos de hacer. El truco es freír la tortilla lo suficiente para que aguante la salsa sin romperse.", rating: 4 },
    { content: "Excelente para un domingo. Usé chiles jalapeños en vez de serranos para que picaran menos y quedaron geniales.", rating: 4 },
    { content: "Such a comforting brunch dish. Frying the egg in plenty of oil makes the edges deliciously crispy.", rating: 4 }
  ],
  'menudo': [
    { content: "El mejor cura crudas. El caldo quedó rojito, espeso y con un aroma espectacular a orégano y chile guajillo.", rating: 5 },
    { content: "Cleaning the tripe takes time, but cooking it with lime and vinegar really removes the strong smell. Delicious!", rating: 4 },
    { content: "La textura de la panza quedó suavecita después de la hora y media en la olla express. Muy buena receta.", rating: 5 },
    { content: "Rico, aunque me hubiera gustado que quedara más picoso. La próxima vez le agregaré chile de árbol a la mezcla.", rating: 3 },
    { content: "Authentic and hearty! Serving it with a side of fresh onions, lime, and crushed oregano makes the flavor pop.", rating: 5 }
  ],
  'quesadilla': [
    { content: "La masa hecha a mano hace TODA la diferencia. La flor de calabaza con epazote quedó con un sabor prehispánico increíble.", rating: 5 },
    { content: "So simple but so good! The Oaxaca cheese melts perfectly and stretching it is so satisfying.", rating: 5 },
    { content: "Muy buenas. No conseguí flor de calabaza así que usé champiñones al ajillo y el resultado fue maravilloso.", rating: 4 },
    { content: "Las rajas de poblano asado le dan un sabor ahumado espectacular al queso fundido. 10 de 10.", rating: 5 },
    { content: "Great street food style. Just make sure the comal is hot enough so the masa cooks through without getting soggy.", rating: 4 }
  ],
  'tlayuda': [
    { content: "¡Como estar en el mercado de Oaxaca! El asiento le da un sabor profundo y la tlayuda tostada es un manjar.", rating: 5 },
    { content: "This is like a giant, crispy, delicious Mexican pizza. The tasajo and quesillo are the perfect toppings.", rating: 5 },
    { content: "Excelente receta. El único problema es encontrar las tlayudas grandes originales, pero el relleno es auténtico.", rating: 4 },
    { content: "La mezcla de frijoles refritos con la col y la salsa pasilla hacen de esto un plato inolvidable. Super llenador.", rating: 5 },
    { content: "A bit hard to eat gracefully, but the smoky flavor of the grilled meat and melted cheese is worth the mess.", rating: 4 }
  ],
  'esquites': [
    { content: "El antojito callejero perfecto en casa. Hervir el maíz con epazote le da ese aroma único e inconfundible de México.", rating: 5 },
    { content: "These street corn cups are amazing! Browning the kernels in butter first adds a great nutty flavor.", rating: 5 },
    { content: "Riquísimos. Los bañé en mayonesa, limón y mucho tajín. A mis amigos les encantaron como botana.", rating: 5 },
    { content: "Muy buena receta base. Sugiero agregar un poquito de tuétano al caldo si quieren llevarlos a un nivel superior.", rating: 4 },
    { content: "Super easy and much less messy to eat than corn on the cob. The cotija cheese is salty and balances the sweet corn.", rating: 4 }
  ]
};

async function updateMexicoComments() {
  console.log('🌮 INICIANDO ACTUALIZACIÓN DE COMENTARIOS: MÉXICO 🇲🇽\n');
  
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
      // Parsear título
      let title;
      try { title = typeof r.title === 'string' && r.title.startsWith('{') ? JSON.parse(r.title) : r.title; } catch(e) { title = r.title; }
      const titleEs = (typeof title === 'object' ? title.es : title) || '';
      const titleEn = (typeof title === 'object' ? title.en : title) || '';
      const titleSearch = `${titleEs} ${titleEn}`.toLowerCase();
      
      let matchedComments = null;
      for (const [key, comments] of Object.entries(mexicoComments)) {
        if (titleSearch.includes(key)) {
          matchedComments = comments;
          break;
        }
      }
      
      if (matchedComments) {
        // Encontramos la receta de México
        // 1. Eliminar comentarios viejos de esta receta
        await conn.query('DELETE FROM comments WHERE recipe_id = ?', [r.id]);
        
        // 2. Insertar una cantidad aleatoria de comentarios (entre 3 y 7)
        const numComments = Math.floor(Math.random() * 5) + 3; // 3, 4, 5, 6, o 7
        
        // Mezclar los comentarios específicos y tomar hasta 5
        let selectedComments = [...matchedComments].sort(() => 0.5 - Math.random());
        
        // Si se requieren más comentarios que los específicos disponibles, rellenar con genéricos
        if (numComments > selectedComments.length) {
          const genericPool = [...mexicoComments.general].sort(() => 0.5 - Math.random());
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
        
        console.log(`✅ ID ${r.id}: ${titleEs || titleEn} -> Insertados ${matchedComments.length} comentarios reales.`);
        recipesUpdated++;
      }
    }
    
    console.log(`\n🎉 COMPLETADO: ${recipesUpdated} recetas mexicanas actualizadas con ${commentsInserted} comentarios de calidad.`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

updateMexicoComments();
