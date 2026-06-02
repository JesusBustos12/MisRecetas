import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const asiaComments = {
  general: [
    { content: "¡Me encantó esta receta! El paso a paso es muy claro.", rating: 5 },
    { content: "El resultado final es exactamente como se ve en la foto.", rating: 5 },
    { content: "¡Delicioso! Definitivamente lo volveré a preparar.", rating: 5 },
    { content: "Muy buena explicación, me quedó riquísimo.", rating: 4 },
    { content: "A mi familia le fascinó, 100% recomendado.", rating: 5 },
    { content: "Excelente aporte. Ya lo guardé en mis favoritos.", rating: 4 },
    { content: "Súper fácil de seguir y el sabor es increíble.", rating: 5 }
  ],
  // 🇨🇳 CHINA
  'kung pao': [
    { content: "El adictivo sabor málà de la pimienta de Sichuan es lo mejor. Pica un poco pero no puedes dejar de comer.", rating: 5 },
    { content: "Los cacahuates tostados le dan un crujido espectacular. Usen muslo de pollo para que quede más jugoso.", rating: 5 },
    { content: "Súper auténtico. La salsa agridulce-picante es exactamente igual a la de los restaurantes de Chengdu.", rating: 5 },
    { content: "Riquísimo. Tengan cuidado de no quemar los chiles secos al principio.", rating: 4 },
    { content: "Classic and fiery! Servido sobre arroz blanco es la cena perfecta.", rating: 5 }
  ],
  'mapo tofu': [
    { content: "Comfort food picante en su máxima expresión. El tofu sedoso se deshace en la boca.", rating: 5 },
    { content: "La pasta doubanjiang es el secreto de este plato. No la sustituyan por nada del mundo.", rating: 5 },
    { content: "Pica muchísimo pero la pimienta te adormece la boca y quieres más. Increíble.", rating: 5 },
    { content: "Muy rico. Yo le puse un poco más de cerdo picado y quedó más contundente.", rating: 4 },
    { content: "Perfect cold weather food. Drenching the rice in this red sauce is heaven.", rating: 5 }
  ],
  'peking duck': [
    { content: "Separar la piel soplando aire es un truco de maestro. Quedó más crujiente que nunca.", rating: 5 },
    { content: "El glaseado de miel y las especias le dan un color caoba precioso. Vale cada hora de trabajo.", rating: 5 },
    { content: "Comerlo en las crepas con cebollín y hoisin es una experiencia lujosa.", rating: 5 },
    { content: "Takes patience to dry the duck overnight, but the crispy skin is worth it.", rating: 5 },
    { content: "Un banquete de celebración. La carne quedó súper tierna por dentro.", rating: 4 }
  ],
  'jiaozi': [
    { content: "Doblar las empanadillas es muy relajante. El relleno de cerdo y col quedó súper jugoso.", rating: 5 },
    { content: "Hervidos son buenísimos, pero dorarles la base en el sartén los lleva a otro nivel.", rating: 5 },
    { content: "Mezclar el relleno en una sola dirección realmente mejora la textura de la carne.", rating: 4 },
    { content: "A must for Lunar New Year. Dipped in black vinegar and chili oil they are perfect.", rating: 5 },
    { content: "Súper rendidores. Hice el doble y congelé la mitad para cenas rápidas.", rating: 5 }
  ],
  'sweet sour pork': [ // Cerdo agridulce
    { content: "Nada que ver con la versión pastosa de los buffets. Crujiente, brillante y con un balance agridulce perfecto.", rating: 5 },
    { content: "Doble fritura es la clave para que la masa no se aguade con la salsa. Riquísimo.", rating: 5 },
    { content: "La piña fresca le da un toque tropical ácido que corta lo frito estupendamente.", rating: 5 },
    { content: "Muy rico. A mis hijos les encantó el brillo rojo de la salsa.", rating: 4 },
    { content: "The ultimate Cantonese classic. Vinegar and sugar ratio is spot on.", rating: 4 }
  ],
  'lo mein': [
    { content: "Street food rápido y delicioso. Usar fideos de huevo frescos marca toda la diferencia.", rating: 5 },
    { content: "La salsa oscura envuelve cada fideo perfectamente. Muy superior al delivery.", rating: 5 },
    { content: "Súper versátil. Yo le agregué camarones y brócoli extra y quedó fantástico.", rating: 4 },
    { content: "A quick weeknight meal. The sesame oil aroma hits you right away.", rating: 4 },
    { content: "No hiervan de más los fideos o se baten al saltearlos. Excelente sabor ahumadito.", rating: 5 }
  ],
  'yangzhou': [
    { content: "El verdadero arroz frito no lleva salsa de soya oscura, sino que brilla con sus ingredientes. Excelente receta.", rating: 5 },
    { content: "El jamón char siu y los camarones hacen un contraste dulce/salado riquísimo.", rating: 5 },
    { content: "Usen arroz frío del día anterior para que el wok lo dore y separe cada grano.", rating: 5 },
    { content: "Comforting and colorful. It's a whole meal in one wok.", rating: 4 },
    { content: "Muy bueno. Saltear los huevos primero y luego regresarlos al arroz mantiene su textura.", rating: 4 }
  ],
  'siu mai': [
    { content: "Pequeñas canastitas de sabor puro. El hongo shiitake y el camarón picado dan un umami brutal.", rating: 5 },
    { content: "El rey del dim sum. Cocinarlos en vaporera de bambú les da un aroma especial.", rating: 5 },
    { content: "Súper fáciles de rellenar porque no tienes que cerrarlos por completo.", rating: 4 },
    { content: "Dim sum at home is easier than I thought. The texture is so bouncy and juicy.", rating: 5 },
    { content: "Quedaron hermosos con un guisante encima. Ideales para el té del fin de semana.", rating: 4 }
  ],
  'yu xiang': [
    { content: "La textura de la berenjena frita que absorbe la salsa picante-dulce es de otro mundo.", rating: 5 },
    { content: "Sabor a 'pescado aromático' sin llevar pescado. Una genialidad de la cocina de Sichuan.", rating: 5 },
    { content: "Las berenjenas se funden en la boca. Acompañado de mucho arroz blanco es un vicio.", rating: 5 },
    { content: "The perfect balance of garlic, ginger, vinegar and chili paste. So good.", rating: 4 },
    { content: "Picante y reconfortante. Frían las berenjenas en aceite muy caliente para que no absorban tanta grasa.", rating: 4 }
  ],
  'dim sum': [
    { content: "Una selección espectacular. Organizar un brunch de dim sum en casa fue un éxito gracias a estas recetas.", rating: 5 },
    { content: "La masa translúcida de los har gow es un reto, pero quedan preciosos.", rating: 5 },
    { content: "Amo la variedad. Sentarse a compartir las vaporeras humeantes es una tradición hermosa.", rating: 5 },
    { content: "Requires prep but seeing all the baskets stacked is so rewarding.", rating: 4 },
    { content: "Muy buena combinación. Recomiendo tener bastante té de jazmín caliente para acompañar.", rating: 4 }
  ],
  'spring rolls': [
    { content: "Súper crujientes y el relleno de verduras queda al dente. Mucho mejores que los comprados.", rating: 5 },
    { content: "La juliana fina de las verduras hace que el rollo se fría más rápido y parejo.", rating: 5 },
    { content: "Dorados y perfectos. Sellen los bordes con un poco de agua o huevo para que no se abran.", rating: 4 },
    { content: "Classic appetizer. The sweet and sour dip takes them to the next level.", rating: 5 },
    { content: "Muy ricos. Asegúrense de exprimir el líquido del relleno para no romper la masa.", rating: 4 }
  ],
  'sweet spring rolls': [
    { content: "El postre callejero definitivo. Plátano caliente con canela dentro de una masa que cruje, ¡delicioso!", rating: 5 },
    { content: "Se hacen rapidísimo y con azúcar glass encima son el final perfecto para comida asiática.", rating: 5 },
    { content: "Cuidado al morderlos recién fritos, el centro guarda muchísimo calor, pero son irresistibles.", rating: 4 },
    { content: "Kids loved them! Like a crispy Asian banana split.", rating: 4 },
    { content: "Una sorpresa dulce muy rica. Usen plátanos bien maduros para más dulzor natural.", rating: 5 }
  ],
  'wonton soup': [
    { content: "El caldo cristalino contrasta hermoso con los wontons esponjosos. Un abrazo para el alma.", rating: 5 },
    { content: "Los wontons flotan como nubecitas. El jengibre en el cerdo pica justito lo necesario.", rating: 5 },
    { content: "Una sopa elegantísima y reconfortante. El toque de aceite de sésamo al final es clave.", rating: 5 },
    { content: "Perfect light dinner. Folding them like little nurse caps is fun.", rating: 4 },
    { content: "Súper sana y ligera. Con cebollín fresco picado encima es una maravilla.", rating: 4 }
  ],
  'mooncakes': [
    { content: "Moldearlos requiere técnica pero quedan como joyas. La yema salada en el centro del dulce es un contraste increíble.", rating: 5 },
    { content: "La pasta de loto es densa y riquísima. Una celebración hermosa del Medio Otoño.", rating: 5 },
    { content: "Dejar que la masa 'sude' un par de días después de hornear los deja suavecitos y brillantes.", rating: 5 },
    { content: "Such a traditional delicacy. The intricate patterns from the mold held up perfectly.", rating: 4 },
    { content: "Un postre muy pesado, para cortarlo en cuartos y compartir con té verde fuerte.", rating: 4 }
  ],

  // 🇹🇭 TAILANDIA
  'pad thai': [
    { content: "La verdadera salsa de tamarindo hace la diferencia. Nada de ketchup. Auténtico y riquísimo.", rating: 5 },
    { content: "Fideos masticables, cacahuates crujientes y el toque de lima fresca. Street food tailandés perfecto.", rating: 5 },
    { content: "El wok tiene que estar humeando. Saltear súper rápido para que los fideos no se peguen.", rating: 5 },
    { content: "Spot on flavor! Don't skip the dried shrimp and preserved radish if you can find them.", rating: 5 },
    { content: "Muy sabroso. Yo le agregué un poco más de chile en polvo porque me gusta muy picante.", rating: 4 }
  ],
  'green curry': [
    { content: "Aromático, herbal y explosivo. La albahaca tailandesa y la pasta verde fresca son mágicas.", rating: 5 },
    { content: "Es picantísimo, pero la leche de coco lo balancea súper bien. Un sudor de alegría.", rating: 5 },
    { content: "El mejor curry de todos. Corten el bambú fino para que absorba la salsa.", rating: 4 },
    { content: "Incredibly fragrant. Reminded me of my trip to Chiang Mai.", rating: 5 },
    { content: "Excelente color y sabor. Acompañado de arroz jazmín es una cena redonda.", rating: 4 }
  ],
  'mango sticky rice': [
    { content: "El postre más celestial del mundo. Remojar el arroz glutinoso toda la noche es obligatorio.", rating: 5 },
    { content: "La leche de coco salada/dulce sobre el mango maduro es una explosión de contrastes.", rating: 5 },
    { content: "Cocinar el arroz al vapor en la canasta de bambú le da la textura pegajosa perfecta.", rating: 5 },
    { content: "Beautiful and tropical. Make sure you get really sweet, ripe Ataulfo or Champagne mangoes.", rating: 4 },
    { content: "Súper rico. Yo le puse semillas de sésamo tostadas encima para más textura.", rating: 4 }
  ],
  'som tum': [
    { content: "Fresco, ácido y pica como demonio. Golpear la papaya en el mortero saca todos sus jugos.", rating: 5 },
    { content: "El balance perfecto de salsa de pescado, lima y azúcar de palma. Muy refrescante.", rating: 5 },
    { content: "La textura súper crujiente de la papaya verde con los cacahuates es adictiva.", rating: 5 },
    { content: "Fiercely spicy! Just like they pound it on the streets of Bangkok.", rating: 4 },
    { content: "Un acompañamiento increíble para pollo frito o carne a la parrilla.", rating: 4 }
  ],
  'massaman curry': [
    { content: "Un curry muy amable y rico en especias cálidas como canela y cardamomo. La res quedó tiernísima.", rating: 5 },
    { content: "Los cacahuates enteros y las papas absorben todo el sabor. Mi curry tailandés favorito.", rating: 5 },
    { content: "Hervirlo a fuego bajo durante horas hace que la carne se deshaga. Delicioso.", rating: 5 },
    { content: "A rich, mild and nutty curry. Very comforting on a rainy day.", rating: 4 },
    { content: "Súper aromático. Se nota la influencia india/persa en las especias.", rating: 4 }
  ],
  'satay gai': [ // satay de pollo
    { content: "La marinada amarilla penetra el pollo maravillosamente. Y esa salsa de cacahuate es un vicio.", rating: 5 },
    { content: "Asarlas a la parrilla les da un sabor ahumado que va genial con lo dulce de la salsa.", rating: 5 },
    { content: "Fáciles y rápidas. Remojen los palillos de bambú para que no se quemen en el asador.", rating: 4 },
    { content: "The peanut dipping sauce is so good I could drink it. Great party appetizer.", rating: 5 },
    { content: "Muy buenas. El toque de hierba limón picada en la marinada es esencial.", rating: 4 }
  ],
  'pad kra pao': [
    { content: "El clásico almuerzo rápido de Bangkok. Rápido, picantísimo y con mucho ajo.", rating: 5 },
    { content: "El huevo frito con las orillas muy doradas y la yema líquida cortando el picante... perfección.", rating: 5 },
    { content: "La albahaca santa (kra pao) le da un aroma anisado/picante único. Salteado a fuego altísimo.", rating: 5 },
    { content: "Spicy, savory and satisfying. True Thai street food.", rating: 4 },
    { content: "Excelente plato para salir de un apuro, se prepara en 10 minutos y sabe a gloria.", rating: 4 }
  ],
  'khao pad': [ // arroz frito tailandés
    { content: "Simple y delicioso. El toque de lima exprimida al final levanta todos los sabores.", rating: 5 },
    { content: "No es pesado ni grasoso como otros arroces fritos. La salsa de soya ligera es clave.", rating: 5 },
    { content: "El acompañamiento de pepino fresco al lado es muy tradicional y refresca la boca.", rating: 4 },
    { content: "Great way to use leftover jasmine rice. Light and flavorful.", rating: 4 },
    { content: "Súper rápido. Yo le agregué unos camarones grandes y quedó de lujo.", rating: 5 }
  ],
  'tom kha gai': [
    { content: "La sopa más elegante. La raíz de galanga y las hojas de lima kaffir perfuman toda la casa.", rating: 5 },
    { content: "Cremosa, ácida y sutilmente dulce por el coco. Una de las mejores sopas del mundo.", rating: 5 },
    { content: "Cuidado de no hervir muy fuerte o la leche de coco se corta. Infusión a fuego suave.", rating: 5 },
    { content: "An aromatic masterpiece. The chicken stays incredibly tender in the coconut milk.", rating: 5 },
    { content: "Muy reconfortante. El equilibrio de lima, picante y salado es magia pura.", rating: 4 }
  ],
  'khao soi': [
    { content: "El orgullo del norte de Tailandia. Los fideos crujientes arriba contrastan divino con los fideos suaves abajo.", rating: 5 },
    { content: "Un caldo profundo y riquísimo. La mostaza encurtida y las chalotas como topping son indispensables.", rating: 5 },
    { content: "Amo este plato. Es como un abrazo cálido de coco y especias amarillas.", rating: 5 },
    { content: "Chiang Mai in a bowl. Squeezing fresh lime over the rich curry cuts the richness perfectly.", rating: 5 },
    { content: "El muslo de pollo se cocina tan suave que se desprende del hueso en la sopa.", rating: 4 }
  ],
  'pad see ew': [
    { content: "Fideos anchos y masticables salteados en soya oscura... mi comida reconfortante favorita.", rating: 5 },
    { content: "El secreto es el wok muy caliente para lograr ese sabor ahumado (wok hei) en los fideos.", rating: 5 },
    { content: "El brócoli chino crujiente va genial con los fideos dulces. Riquísimo y cero picante.", rating: 5 },
    { content: "Chewy, sweet and savory. Make sure you don't overcrowd the wok.", rating: 4 },
    { content: "Excelente plato. Si no consiguen fideos anchos frescos, los secos funcionan remojándolos bien antes.", rating: 4 }
  ],
  'larb moo': [
    { content: "Una ensalada de carne caliente picante y ácida brutal. El polvo de arroz tostado le da ese sabor a nuez.", rating: 5 },
    { content: "Mucha menta y jugo de lima fresco. Se come con las manos envolviéndolo en hojas de lechuga.", rating: 5 },
    { content: "Espectacular ensalada de Isan. Pica bastante pero la hierba fresca refresca todo.", rating: 5 },
    { content: "Sour, spicy, salty perfection. The roasted rice powder is non-negotiable.", rating: 5 },
    { content: "Súper ligera y llena de sabor. Acompañada de arroz pegajoso (sticky rice) es la gloria.", rating: 4 }
  ],
  'pla goong': [
    { content: "Frescura pura. La hierba limón y la menta realzan el sabor del camarón cocido justito.", rating: 5 },
    { content: "Una ensalada muy elegante. La salsa de chile y jugo de lima es súper vibrante.", rating: 5 },
    { content: "Rica y súper ligera. Cuiden que los camarones queden rosados y jugosos, no sobrecocidos.", rating: 4 },
    { content: "Zesty and aromatic! The lemongrass needs to be sliced very thin.", rating: 4 },
    { content: "Excelente entrada para una cena thai. Muy colorida y apetitosa.", rating: 5 }
  ],
  'gai med ma moung': [ // pollo con anacardos
    { content: "Menos picante pero con un crujido fantástico de los anacardos tostados. Muy fácil de hacer.", rating: 5 },
    { content: "La cebolla y el pimiento quedan crujientes, bañados en esa salsa dulce/salada. Delicioso.", rating: 5 },
    { content: "Un salteado clásico. Los chiles secos grandes le dan aroma más que picor.", rating: 4 },
    { content: "A crowd pleaser. Sweet, savory and full of crunchy cashews.", rating: 5 },
    { content: "Súper rico sobre arroz jazmín. Yo freí un poco el pollo primero para darle más textura.", rating: 4 }
  ],
  'tom yum goong': [
    { content: "La sopa picante y ácida más famosa. Golpearte la nariz con esos aromas herbales al destapar la olla es magia.", rating: 5 },
    { content: "Explosiva y vibrante. No se comen los trozos de galanga y hierba limón, solo están ahí para infusionar.", rating: 5 },
    { content: "Usar camarones con cabeza hace que el caldo tome un color naranja y un sabor a mar profundísimo.", rating: 5 },
    { content: "Spicy, sour, and incredibly fragrant. Clears your sinuses right up!", rating: 5 },
    { content: "Una de las maravillas de Tailandia. Expriman la lima siempre fuera del fuego.", rating: 4 }
  ],
  'panang curry': [
    { content: "Un curry más espeso, dulce y menos picante que el verde. La hoja de lima kaffir finita por encima es genial.", rating: 5 },
    { content: "Muy rico y cremoso. La crema de coco espesa le da una textura casi de guiso.", rating: 5 },
    { content: "La carne quedó súper tierna. Con un buen arroz jazmín es un plato de reyes.", rating: 4 },
    { content: "Rich and nutty flavor. Cutting the kaffir lime leaves hair-thin is essential.", rating: 4 },
    { content: "Excelente. Si les parece muy espeso, se puede aligerar con un chorrito de agua.", rating: 4 }
  ],
  'tod mun pla': [ // pasteles de pescado
    { content: "La textura elástica (bouncy) de estos pasteles es única de Tailandia. El curry rojo les da un color precioso.", rating: 5 },
    { content: "Amor a primer mordisco. Las judías verdes finamente picadas les dan un crujido extra buenísimo.", rating: 5 },
    { content: "Mezclarlos golpeando la masa contra el bol crea esa textura firme característica.", rating: 4 },
    { content: "Spicy, springy fish cakes. The cucumber relish on the side is the perfect cooling dip.", rating: 5 },
    { content: "Muy ricos y aromáticos por las hojas de lima kaffir. Ideales para picar.", rating: 4 }
  ],
  'yam nua': [ // ensalada de res
    { content: "Carne asada jugosa bañada en un aderezo ácido y picante súper refrescante.", rating: 5 },
    { content: "El pepino, la menta y la cebolla morada crujientes contrastan con la res caliente. Muy balanceado.", rating: 5 },
    { content: "Asen la carne término medio para que quede tierna. La ensalada es un festival de texturas.", rating: 5 },
    { content: "Spicy and refreshing beef salad. Love the toasted rice powder crunch.", rating: 4 },
    { content: "Excelente ensalada veraniega con mucho punch tailandés.", rating: 4 }
  ],

  // 🇮🇳 INDIA
  'butter chicken': [
    { content: "La salsa Makhani es cremosa, suave y aterciopelada. Sumergir un buen naan ahí es tocar el cielo.", rating: 5 },
    { content: "Marinar el pollo en yogur y asarlo antes le da ese toque ahumado tandoori indispensable.", rating: 5 },
    { content: "El rey de los currys. No escatimen en la mantequilla, se llama así por una razón.", rating: 5 },
    { content: "Incredibly rich and comforting. The fenugreek leaves (kasuri methi) give it that authentic restaurant flavor.", rating: 5 },
    { content: "A mis hijos les fascinó porque no es muy picante, solo súper sabroso y cremoso.", rating: 4 }
  ],
  'chicken tikka masala': [
    { content: "La salsa tiene un toque más especiado y de tomate que el butter chicken. Un clásico absoluto.", rating: 5 },
    { content: "Los trozos de pollo quedan súper jugosos gracias a la marinada de yogur. Riquísimo.", rating: 5 },
    { content: "Amo este plato. Asar el pollo hasta que se carbonice un poco en los bordes le da muchísimo sabor.", rating: 5 },
    { content: "The British-Indian masterpiece. Vibrant color and beautiful layers of spice.", rating: 5 },
    { content: "Súper reconfortante. Se necesita arroz basmati y mucho pan naan para limpiar el plato.", rating: 4 }
  ],
  'lamb biryani': [
    { content: "Un espectáculo cocinar esto en capas. El aroma a azafrán, cardamomo y canela al destapar la olla es brutal.", rating: 5 },
    { content: "El arroz basmati absorbe todos los jugos del cordero tierno. Un plato de celebración real.", rating: 5 },
    { content: "Cocinarlo a fuego muy lento (dum) sella todos los aromas adentro. Vale cada hora invertida.", rating: 5 },
    { content: "A royal feast in one pot. The caramelized onions on top are the best part.", rating: 5 },
    { content: "Requiere técnica y muchas especias, pero el resultado es un arroz increíblemente perfumado.", rating: 4 }
  ],
  'palak paneer': [
    { content: "Hervir rápido las espinacas y pasarlas por hielo mantiene ese color verde brillante precioso.", rating: 5 },
    { content: "El paneer fresco no se derrite y absorbe todo el sabor del ajo y las especias. Mi vegetariano favorito.", rating: 5 },
    { content: "Un curry súper saludable y riquísimo. Sazonado con un toque de crema al final queda de lujo.", rating: 4 },
    { content: "Vibrant and healthy. Frying the paneer lightly before adding it adds great texture.", rating: 4 },
    { content: "Delicioso y nutritivo. El jengibre fresco resalta mucho en la salsa.", rating: 5 }
  ],
  'vegetable samosas': [
    { content: "Triángulos crujientes y hojaldrados por fuera, y el relleno de papa especiada súper reconfortante.", rating: 5 },
    { content: "Freír a temperatura media-baja es el truco para que la masa quede crujiente y no se llene de burbujas.", rating: 5 },
    { content: "Remojadas en chutney de tamarindo son el mejor aperitivo del mundo.", rating: 5 },
    { content: "Classic Indian street snack. Folding them into perfect triangles takes a little practice.", rating: 4 },
    { content: "Muy buenas. Le agregué semillas de hinojo y comino entero al relleno y quedaron muy aromáticas.", rating: 4 }
  ],
  'gulab jamun': [
    { content: "Pequeñas bombas dulces que se deshacen en la boca. El jarabe de agua de rosas huele a maravilla.", rating: 5 },
    { content: "Súper esponjosos por dentro. No amasen mucho la masa de leche o quedarán duros.", rating: 5 },
    { content: "El postre festivo de la India por excelencia. Se deben freír muy lento para cocer el centro.", rating: 5 },
    { content: "Sticky, sweet and incredibly fragrant cardamom syrup. A beautiful dessert.", rating: 4 },
    { content: "Riquísimos servidos tibios con un poco de helado de vainilla al lado.", rating: 4 }
  ],
  'mango lassi': [
    { content: "Espeso, frío y muy refrescante. Apaga el fuego de cualquier curry picante al instante.", rating: 5 },
    { content: "Usar pulpa de mango Alphonso le da ese dulzor y color amarillo vibrante inconfundible.", rating: 5 },
    { content: "Un toque de cardamomo en polvo por encima eleva esta bebida a otro nivel.", rating: 4 },
    { content: "The perfect summer drink. Smooth yogurt and sweet mango are a match made in heaven.", rating: 5 },
    { content: "A mis hijos les encanta, es como un batido saludable pero con todo el encanto de la India.", rating: 4 }
  ],
  'tandoori chicken': [
    { content: "El color rojo brillante y el sabor ahumado son alucinantes. El yogur lo deja súper tierno.", rating: 5 },
    { content: "Asarlo a fuego altísimo en el horno simula muy bien el horno de barro tandoor. Crujiente por fuera.", rating: 5 },
    { content: "Hacerle cortes profundos al pollo es clave para que la marinada llegue hasta el hueso.", rating: 5 },
    { content: "Classic and iconic. Served with lemon wedges and onion rings, it's perfect.", rating: 4 },
    { content: "Súper rico. Yo lo hice en la parrilla al carbón y el sabor ahumado extra fue espectacular.", rating: 5 }
  ],
  'rogan josh': [
    { content: "Un curry de cordero profundo y robusto. El color rojo de los chiles kashmiri es hermoso.", rating: 5 },
    { content: "Cocción lenta maravillosa; la carne se separa del hueso con la mirada. Aromas intensos a hinojo y jengibre.", rating: 5 },
    { content: "No lleva tomate, el color es puro chile dulce. Una obra maestra de Cachemira.", rating: 5 },
    { content: "Deeply flavorful and warming. The yogurt base makes a rich, thick gravy.", rating: 4 },
    { content: "Delicioso. Requiere bastantes especias enteras pero el resultado final vale el esfuerzo.", rating: 4 }
  ],
  'chana masala': [
    { content: "Garbanzos tiernos bañados en una salsa espesa y ácida gracias al polvo de mango amchoor.", rating: 5 },
    { content: "Un plato vegetariano súper satisfactorio y barato. Mucho ajo y cilantro fresco.", rating: 5 },
    { content: "Street food puro de Punjab. Acompañado de pan frito (bhatura) o arroz es una maravilla.", rating: 4 },
    { content: "Hearty, spicy and tangy. Great for a meatless Monday dinner.", rating: 4 },
    { content: "Muy rico. Dejar hervir a fuego lento para que los garbanzos absorban todas las especias.", rating: 4 }
  ],
  'dal makhani': [
    { content: "Lentejas negras cocidas toda la noche hasta volverse cremosas como mantequilla. Un lujo absoluto.", rating: 5 },
    { content: "El plato de lentejas más decadente de la historia. Mucha crema, mantequilla y un toque ahumado.", rating: 5 },
    { content: "Takes patience to simmer for hours, but the velvety texture is unmatched.", rating: 5 },
    { content: "Requiere paciencia, pero es el plato estrella de los restaurantes indios por una buena razón.", rating: 5 },
    { content: "Riquísimo. El puré de tomate y el jengibre equilibran lo rico de la crema maravillosamente.", rating: 4 }
  ],
  'aloo gobi': [
    { content: "Coliflor y papas cocidas 'en seco' llenas del sabor tostado del comino y la cúrcuma. Casero y delicioso.", rating: 5 },
    { content: "Comfort food indio súper sencillo. El jengibre fresco en juliana por encima le da mucha vida.", rating: 5 },
    { content: "Súper rápido y saludable. Tostar las especias enteras primero en aceite hace toda la diferencia.", rating: 4 },
    { content: "Simple, humble and very tasty side dish. The potatoes get a nice golden crust.", rating: 4 },
    { content: "Muy rico. No pasen la coliflor de cocción para que mantenga algo de mordida.", rating: 4 }
  ]
};

async function updateAsiaComments() {
  console.log('🇨🇳 🇹🇭 🇮🇳 INICIANDO ACTUALIZACIÓN DE COMENTARIOS: CHINA, TAILANDIA E INDIA\n');
  
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
      for (const [key, comments] of Object.entries(asiaComments)) {
        if (key === 'general') continue;
        
        // Expresión regular para buscar la clave ignorando guiones bajos o espacios
        const searchKey = key.replace(/_/g, ' ');
        const regex = new RegExp(searchKey, 'i');
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
          const genericPool = [...asiaComments.general].sort(() => 0.5 - Math.random());
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
    
    console.log(`\n🎉 COMPLETADO: ${recipesUpdated} recetas de China, Tailandia e India actualizadas con ${commentsInserted} comentarios.`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

updateAsiaComments();
