import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const jpUsComments = {
  general: [
    { content: "¡Me encantó esta receta! El paso a paso es muy claro.", rating: 5 },
    { content: "El resultado final es exactamente como se ve en la foto.", rating: 5 },
    { content: "¡Delicioso! Definitivamente lo volveré a preparar.", rating: 5 },
    { content: "Muy buena explicación, me quedó riquísimo.", rating: 4 },
    { content: "A mi familia le fascinó, 100% recomendado.", rating: 5 },
    { content: "Excelente aporte. Ya lo guardé en mis favoritos.", rating: 4 },
    { content: "Súper fácil de seguir y el sabor es increíble.", rating: 5 }
  ],
  // 🇺🇸 USA & MX (faltantes)
  'smashburger': [
    { content: "La técnica de aplastar la carne súper caliente crea esa costra crujiente perfecta. Adiós hamburguesas gruesas.", rating: 5 },
    { content: "El secreto del éxito es usar un sartén de hierro bien caliente. Quedaron deliciosas.", rating: 5 },
    { content: "Dobles con queso y tocino... No tiene nada que envidiarle a un restaurante gringo.", rating: 5 },
    { content: "Muy buenas. El pan brioche tostado con mantequilla hace toda la diferencia.", rating: 4 },
    { content: "La costra es impresionante (reacción de Maillard en su máximo esplendor).", rating: 5 }
  ],
  'fried chicken': [
    { content: "Remojarlo en buttermilk realmente deja el pollo súper jugoso por dentro y la costra es gruesa y crujiente.", rating: 5 },
    { content: "El mejor pollo frito que he hecho. Escurrir en rejilla y no en papel es el mejor tip.", rating: 5 },
    { content: "Tarda un poco por el marinado, pero vale totalmente el tiempo. La sazón es perfecta.", rating: 4 },
    { content: "Quedó dorado y perfecto. Recomiendo no meter muchas piezas a la vez al aceite.", rating: 4 },
    { content: "Crispy perfection! The cayenne gives it just the right amount of kick.", rating: 5 }
  ],
  'brisket': [
    { content: "Ahumé esto por 14 horas y la carne quedó como mantequilla. El 'bark' oscuro es lo mejor.", rating: 5 },
    { content: "Envolverlo en papel rosa a los 75 grados salva la jugosidad. Excelente receta texana.", rating: 5 },
    { content: "Takes a whole day but the result is a masterpiece. Simple rub is all it needs.", rating: 5 },
    { content: "La paciencia premia. Dejarlo reposar en la hielera antes de cortar es obligatorio.", rating: 5 },
    { content: "The smoke ring was beautiful. Me sentí como en Texas.", rating: 4 }
  ],
  'buffalo wings': [
    { content: "Secar bien las alitas antes de freír es la clave absoluta para que crujan. ¡Súper ricas!", rating: 5 },
    { content: "La salsa Frank's con mantequilla es la auténtica receta Buffalo. No usen otra cosa.", rating: 5 },
    { content: "Fabulosas. Con aderezo blue cheese y apio es la cena perfecta para ver deportes.", rating: 5 },
    { content: "Muy crujientes. Cuidado con que el aceite no esté muy frío o absorben grasa.", rating: 4 },
    { content: "Classic and flawless. So easy to make at home.", rating: 4 }
  ],
  'philly cheesesteak': [
    { content: "El truco de congelar la carne un rato para rebanarla súper delgada es genial. Se deshace en la boca.", rating: 5 },
    { content: "Auténtico sabor a Filadelfia. Fundir el queso sobre la carne en la plancha es magia.", rating: 5 },
    { content: "Yo usé queso provolone y quedó riquísimo. Las cebollas caramelizadas le dan el toque dulce.", rating: 4 },
    { content: "Un sándwich contundente y lleno de sabor. Usen un buen pan que soporte los jugos.", rating: 5 },
    { content: "Messy but incredible. The ribeye is definitely the right cut for this.", rating: 5 }
  ],
  'pulled pork': [
    { content: "Horneado toda la noche a fuego bajo, el cerdo se desmenuzaba solo. Impresionante.", rating: 5 },
    { content: "El dry rub tiene el balance perfecto entre dulce, salado y picante. Súper tierno.", rating: 5 },
    { content: "Rinde muchísimo. Lo serví en panes brioche con coleslaw y fue un éxito total.", rating: 5 },
    { content: "El vinagre de manzana en el fondo de la charola evita que se seque y le da un sabor riquísimo.", rating: 4 },
    { content: "Better than most BBQ joints! So easy to just leave in the oven overnight.", rating: 5 }
  ],
  'biscuits': [
    { content: "Biscuits esponjosos y un gravy espeso de salchicha... El mejor desayuno reconfortante.", rating: 5 },
    { content: "No girar el cortador es el truco definitivo para que suban mucho en el horno. Quedaron altos y hermosos.", rating: 5 },
    { content: "El gravy es espectacular. No escatimen en la pimienta negra, le da todo el sabor.", rating: 4 },
    { content: "Muy buena receta sureña. La mantequilla súper fría es clave para la textura hojaldrada.", rating: 5 },
    { content: "Southern comfort food at its best. The sage in the gravy is a great touch.", rating: 4 }
  ],
  'costillas bbq': [
    { content: "Quitar la membrana hace toda la diferencia para que queden tiernas. Se caían del hueso.", rating: 5 },
    { content: "Horneadas lento y terminadas fuerte para caramelizar la salsa... Perfectas.", rating: 5 },
    { content: "Usé mostaza como binder y el dry rub se adhirió súper bien. Sabor increíble.", rating: 5 },
    { content: "No hace falta ahumador para unas buenas costillas. Esta receta de horno es de 10.", rating: 4 },
    { content: "The bend test works perfectly to know when they are done. Delicious!", rating: 5 }
  ],
  'jambalaya': [
    { content: "Un solo plato lleno de sabores intensos. La mezcla cajún con el andouille y camarones es brutal.", rating: 5 },
    { content: "Toda la esencia de Nueva Orleans. El arroz absorbe todo el jugo y queda perfecto.", rating: 5 },
    { content: "Muy rico. Cuiden de no sobrecocer los camarones poniéndolos solo al final.", rating: 4 },
    { content: "Spicy, hearty, and comforting. The 'holy trinity' base really builds the flavor.", rating: 5 },
    { content: "Excelente. Si no consiguen andouille, un buen chorizo español ahumado funciona bien.", rating: 4 }
  ],
  'hot dog': [
    { content: "Un clásico neoyorquino. La cebolla caramelizada y el chucrut elevan una salchicha normal a otro nivel.", rating: 5 },
    { content: "Simpleza total. Marcar las salchichas en la plancha después de hervirlas mejora la textura.", rating: 5 },
    { content: "Rápido y riquísimo. Un buen pan tostado es indispensable.", rating: 4 },
    { content: "Street cart style at home! The warm sauerkraut is a must.", rating: 4 },
    { content: "Me encantó. Recomiendo buscar salchichas de pura res para el sabor auténtico.", rating: 5 }
  ],
  'ensalada cobb': [
    { content: "La presentación en filas ordenadas se ve hermosa antes de mezclarla. Fresca y llenadora.", rating: 5 },
    { content: "Una ensalada que realmente es una comida completa. El blue cheese y el tocino hacen una pareja ideal.", rating: 5 },
    { content: "Muy rica y nutritiva. La vinagreta de vino tinto corta perfecto la grasa del aguacate y tocino.", rating: 5 },
    { content: "Perfect lunch. Love the contrast of the warm grilled chicken and cold crisp greens.", rating: 4 },
    { content: "Excelente combinación de texturas.", rating: 4 }
  ],
  'meatloaf': [
    { content: "Formarlo sin molde permite que se dore toda la superficie. El glaseado de ketchup es adictivo.", rating: 5 },
    { content: "Quedó súper jugoso por mezclar res y cerdo, y remojar el pan en leche. Nada seco.", rating: 5 },
    { content: "Comfort food clásico. Con puré de papas es la cena perfecta de semana.", rating: 5 },
    { content: "Muy rico. No lo amasen demasiado o queda duro.", rating: 4 },
    { content: "The glaze caramelizes beautifully in the oven. My family devoured it.", rating: 5 }
  ],
  'cornbread': [
    { content: "El borde crujiente por hornearlo en sartén de hierro precalentado es la mejor parte.", rating: 5 },
    { content: "Balance perfecto entre dulce y salado. Con un poco de miel encima es una delicia.", rating: 5 },
    { content: "Súper fácil y rápido. Quedó muy esponjoso gracias al buttermilk.", rating: 4 },
    { content: "A must-have side for chili. So moist and tender.", rating: 5 },
    { content: "Yo le agregué jalapeños picados y granos de elote. Quedó fenomenal.", rating: 5 }
  ],
  'pancakes': [
    { content: "Dejar algunos grumos en la masa es el secreto mejor guardado. Quedaron súper altos y esponjosos.", rating: 5 },
    { content: "Los domingos no son iguales sin esta receta. El buttermilk les da un sabor increíble.", rating: 5 },
    { content: "Fáciles y rápidos. Voltéenlos cuando las orillas se vean secas.", rating: 4 },
    { content: "Classic diner style! Piled high with butter and syrup, absolute perfection.", rating: 5 },
    { content: "Muy ricos. Yo les agregué arándanos a la masa y quedaron buenísimos.", rating: 4 }
  ],
  'gorditas': [
    { content: "El chicharrón prensado con frijoles es el mejor relleno. La masa quedó cocida perfecto.", rating: 5 },
    { content: "Deliciosas, abrirlas calientitas y rellenarlas es todo un arte.", rating: 5 },
    { content: "Muy buenas, el grosor de la masa es clave para que esponjen en el comal.", rating: 4 },
    { content: "Un antojito mexicano excelente para el fin de semana.", rating: 5 }
  ],
  'sopes': [
    { content: "Pellizcar los bordes en caliente quema un poquito pero valen la pena para que no se salga la salsa.", rating: 5 },
    { content: "Con chorizo y frijolitos quedan espectaculares. Una pasadita por manteca les da todo el sabor.", rating: 5 },
    { content: "Muy ricos y llenadores. La masa queda suave por dentro y dorada por fuera.", rating: 4 },
    { content: "Mis favoritos de la comida callejera, ahora hechos en casa.", rating: 5 }
  ],

  // 🇯🇵 JAPÓN
  'tonkotsu ramen': [
    { content: "Hervir los huesos 12 horas es un compromiso, pero el caldo cremoso final justifica cada segundo.", rating: 5 },
    { content: "El huevo ajitsuke marinado y el chashu casero hacen que este tazón parezca salido de Tokio.", rating: 5 },
    { content: "Increíble complejidad de sabores. La receta es laboriosa pero el resultado es espectacular.", rating: 5 },
    { content: "Worth the effort! The broth emulsifies beautifully and the chashu melts in your mouth.", rating: 5 },
    { content: "Excelente ramen, muy superior a cualquier restaurante local. Recomiendo planear con un día de anticipación.", rating: 4 }
  ],
  'gyoza': [
    { content: "Exprimir el agua de la col es el truco definitivo para que el relleno quede compacto y sabroso.", rating: 5 },
    { content: "La técnica de freír y luego poner agua para cocinar al vapor deja la base ultra crujiente. Riquísimas.", rating: 5 },
    { content: "Plegarlas requiere algo de práctica, pero el sabor de la carne de cerdo con jengibre es genial.", rating: 4 },
    { content: "Perfectly crispy bottoms and juicy insides. The soy-vinegar dip is a must.", rating: 5 },
    { content: "Muy divertidas de preparar en familia. Excelentes para acompañar ramen.", rating: 5 }
  ],
  'katsudon': [
    { content: "El tonkatsu frito absorbe el dulzor de la salsa con la cebolla, y el huevo toro-toro por encima es mágico.", rating: 5 },
    { content: "Comida reconfortante japonesa al 100%. Rápida y llena de umami.", rating: 5 },
    { content: "Súper rico. El panko deja el cerdo muy crujiente, incluso bajo el huevo jugoso.", rating: 5 },
    { content: "A bowl of comfort. Don't overcook the eggs, they should be soft and silky.", rating: 4 },
    { content: "Excelente. Si tienen un sartén oyakodon la forma queda perfecta sobre el tazón de arroz.", rating: 4 }
  ],
  'yakitori': [
    { content: "Asarlos con la salsa tare caramelizándose en las brasas les da un sabor ahumado espectacular.", rating: 5 },
    { content: "La combinación del pollo con el cebollín (negi) quemadito es deliciosa.", rating: 5 },
    { content: "Súper fáciles. Hervir la soya y el mirin para hacer la salsa espesa vale la pena.", rating: 4 },
    { content: "Great izakaya food at home! The shichimi pepper adds the perfect kick.", rating: 5 },
    { content: "Riquísimas brochetas. Recomiendo remojar bien los palillos para que no se quemen.", rating: 4 }
  ],
  'omurice': [
    { content: "Lograr que el huevo quede cremoso por arriba es un reto, pero deslizarlo sobre el arroz frito es pura satisfacción.", rating: 5 },
    { content: "A mis hijos les encantó el arroz con ketchup y la decoración. Muy divertido.", rating: 5 },
    { content: "El contraste del arroz dulce con la tortilla sedosa es increíble. Cuidado de no sobrecocer el huevo.", rating: 4 },
    { content: "Japanese cafe classic. Beautiful and tasty if you nail the egg texture.", rating: 5 },
    { content: "Muy rico. Usar arroz frío de un día antes ayuda mucho a que el salteado quede suelto.", rating: 4 }
  ],
  'katsu curry': [
    { content: "El curry japonés es espeso y reconfortante. El toque de manzana rallada le da un dulzor sutil genial.", rating: 5 },
    { content: "Cerdo crujiente, arroz humeante y salsa de curry... La mejor combinación del mundo.", rating: 5 },
    { content: "Los bloques de S&B Golden facilitan mucho la receta. Queda espeso y brilloso.", rating: 5 },
    { content: "A huge, satisfying meal. Make sure to fry the pork right before serving so it stays crispy.", rating: 4 },
    { content: "Excelente. El fukujinzuke crocante corta lo pesado del curry maravillosamente.", rating: 5 }
  ],
  'shabu-shabu': [
    { content: "Una cena súper interactiva y saludable. Pasar la carne por el caldo hirviendo es muy divertido.", rating: 5 },
    { content: "El contraste de mojar la carne caliente en salsa ponzu ácida o de sésamo es fantástico.", rating: 5 },
    { content: "Comprar carne ultra fina es obligatorio para que se cocine en 5 segundos. Muy elegante.", rating: 5 },
    { content: "Such a fun experience with friends around the table. The broth at the end is so flavorful.", rating: 4 },
    { content: "Excelente para el invierno. Las verduras quedan al dente y deliciosas.", rating: 4 }
  ],
  'sukiyaki': [
    { content: "Cocinar todo en esa salsa warishita dulce y salada hace que el tofu y los fideos sean irresistibles.", rating: 5 },
    { content: "Sumergir la carne caliente en el huevo crudo le da una suavidad y cremosidad increíble. No le tengan miedo al huevo fresco.", rating: 5 },
    { content: "Un banquete de sabor fuerte y umami intenso. El orden de agregar los ingredientes es importante.", rating: 5 },
    { content: "The ultimate Japanese winter hot pot. The beef fat really gives it that authentic taste.", rating: 4 },
    { content: "Delicioso. Los champiñones shiitake absorben la salsa como esponjas.", rating: 5 }
  ],
  'yakisoba': [
    { content: "Saltear las verduras rápido en el wok para que queden crujientes contrasta genial con los fideos suaves.", rating: 5 },
    { content: "Un plato de comida callejera delicioso. El katsuobushi moviéndose por el calor es muy vistoso.", rating: 5 },
    { content: "Rápido y lleno de sabor. La salsa agridulce impregna todo perfecto.", rating: 4 },
    { content: "Classic festival food! The aonori and pickled ginger are essential for that true flavor.", rating: 5 },
    { content: "Muy rico. Es importante desarmar bien los fideos antes de saltearlos para que no se rompan.", rating: 4 }
  ],
  'karaage': [
    { content: "La doble fritura garantiza que queden jugosos por dentro y ultra crocantes por fuera. ¡Perfectos!", rating: 5 },
    { content: "El marinado con jengibre y soya le da sabor a cada bocado. La fécula de papa es clave para esa textura.", rating: 5 },
    { content: "Mucho mejor que el pollo frito tradicional. Con mayonesa Kewpie y limón son adictivos.", rating: 5 },
    { content: "Crispy, light and flavorful. Don't skip the resting period between fries.", rating: 4 },
    { content: "Súper ricos como entrada o con cerveza. La capa de almidón queda muy fina y crujiente.", rating: 5 }
  ],
  'udon': [
    { content: "El caldo dashi claro y los fideos gruesos hacen una sopa sutil y elegante.", rating: 5 },
    { content: "Minimalista pero con mucho sabor a mar. El katsuobushi fresco hace la diferencia.", rating: 5 },
    { content: "Comforting and simple. Slurping the thick noodles is the best part.", rating: 4 },
    { content: "Muy rápida de hacer si tienes buen dashi. Ligera y reconfortante.", rating: 4 },
    { content: "Excelente sopa base. Le agregué un poco de tempura encima y fue espectacular.", rating: 5 }
  ],
  'sopa de miso': [
    { content: "No hervir el miso es el secreto para que no se corte y conserve sus probióticos. Excelente sabor.", rating: 5 },
    { content: "El acompañamiento indispensable. Disolver el miso en un colador evita los grumos.", rating: 5 },
    { content: "Muy rápida. El tofu sedoso y el alga wakame hidratada quedan súper suaves.", rating: 4 },
    { content: "Simple and authentic. Just like the ones served in traditional ryokans.", rating: 5 },
    { content: "Riquísima. Un inicio ligero perfecto para cualquier comida japonesa.", rating: 4 }
  ],
  'tamagoyaki': [
    { content: "Hacer las capas y enrollar poco a poco requiere técnica, pero queda como un flan en capas jugoso.", rating: 5 },
    { content: "El toque dulce y el dashi le dan ese sabor de sushi bar auténtico.", rating: 5 },
    { content: "Necesita paciencia y un sartén cuadrado ayuda muchísimo. Deliciosos en el bento.", rating: 4 },
    { content: "Beautiful and tasty. Pushing the roll back and adding egg underneath is brilliant.", rating: 5 },
    { content: "Muy rico. Formarlo con la esterilla al final le da una presentación impecable.", rating: 4 }
  ],
  'chawanmushi': [
    { content: "Un flan salado sedoso. Colar el huevo dos veces lo deja sin una sola burbuja. Muy sofisticado.", rating: 5 },
    { content: "Encontrar el pollo, camarón y shiitake en el fondo es una agradable sorpresa. Sabor a dashi puro.", rating: 5 },
    { content: "Cocinar al vapor suavemente es clave para que quede tembloroso y no como huevo revuelto.", rating: 4 },
    { content: "Elegant and delicate appetizer. Removing the surface bubbles makes it look like glass.", rating: 5 },
    { content: "Un plato exquisito. La textura es inigualable y caliente reconforta muchísimo.", rating: 5 }
  ]
};

async function updateJapanUsaComments() {
  console.log('🇯🇵 🇺🇸 INICIANDO ACTUALIZACIÓN DE COMENTARIOS: JAPÓN Y ESTADOS UNIDOS\n');
  
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
      for (const [key, comments] of Object.entries(jpUsComments)) {
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
          const genericPool = [...jpUsComments.general].sort(() => 0.5 - Math.random());
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
    
    console.log(`\n🎉 COMPLETADO: ${recipesUpdated} recetas actualizadas con ${commentsInserted} comentarios.`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

updateJapanUsaComments();
