import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// ═══════════════════════════════════════════════════════════════
// BANCO DE PASOS DETALLADOS POR PAÍS Y TIPO DE COMIDA
// Cada receta recibirá entre 5-8 pasos específicos con
// técnicas culinarias, tiempos y temperaturas reales.
// ═══════════════════════════════════════════════════════════════

const stepBanks = {
  mexico: {
    meat: {
      es: [
        "Hidrata los chiles guajillo y ancho en agua caliente durante 15 minutos hasta que estén suaves. Escúrrelos y resérvalos.",
        "En un comal o sartén seco a fuego medio-alto, asa los jitomates, la cebolla y los dientes de ajo hasta que estén ligeramente chamuscados por todos lados (unos 8 minutos).",
        "Licúa los chiles hidratados junto con los jitomates, cebolla y ajo asados, el comino y ½ taza de caldo. Cuela la salsa para obtener una textura sedosa.",
        "Sazona la carne con sal y pimienta. En una olla grande o cazuela, calienta el aceite a fuego alto y sella la carne por todos lados hasta dorar (3-4 minutos por lado).",
        "Vierte la salsa colada sobre la carne, añade las hojas de laurel y reduce el fuego a bajo. Cocina tapado durante 45-60 minutos, revolviendo ocasionalmente.",
        "Destapa, sube el fuego a medio y cocina 10 minutos más para que la salsa espese y se concentre.",
        "Rectifica la sazón con sal y pimienta. Sirve caliente con tortillas de maíz recién hechas y un poco de cilantro fresco por encima."
      ],
      en: [
        "Soak the guajillo and ancho chiles in hot water for 15 minutes until soft. Drain and set aside.",
        "On a dry comal or skillet over medium-high heat, roast the tomatoes, onion and garlic cloves until slightly charred on all sides (about 8 minutes).",
        "Blend the hydrated chiles with the roasted tomatoes, onion and garlic, cumin and ½ cup broth. Strain the sauce for a silky texture.",
        "Season the meat with salt and pepper. In a large pot or casserole, heat the oil over high heat and sear the meat on all sides until golden (3-4 minutes per side).",
        "Pour the strained sauce over the meat, add bay leaves and reduce heat to low. Cook covered for 45-60 minutes, stirring occasionally.",
        "Uncover, raise heat to medium and cook 10 more minutes to thicken and concentrate the sauce.",
        "Adjust seasoning with salt and pepper. Serve hot with freshly made corn tortillas and a sprinkle of fresh cilantro on top."
      ]
    },
    seafood: {
      es: [
        "Limpia los camarones retirando la vena dorsal. Enjuágalos con agua fría y sécalos con papel absorbente.",
        "Pica finamente el jitomate, la cebolla morada y los chiles serranos. Corta el aguacate en cubos medianos.",
        "En un bowl grande de vidrio, mezcla los camarones con el jugo de limón recién exprimido. Deja marinar en refrigeración durante 20-30 minutos hasta que los camarones se tornen rosados.",
        "Agrega el jitomate, la cebolla, el chile serrano y el cilantro picado al bowl de camarones marinados. Mezcla con cuidado.",
        "Incorpora el aguacate, el aceite de oliva y sazona con sal de mar al gusto. Revuelve suavemente para no deshacer el aguacate.",
        "Refrigera la mezcla durante al menos 15 minutos para que los sabores se integren.",
        "Sirve frío sobre tostadas de maíz crujientes. Acompaña con rodajas de limón y salsa picante al gusto."
      ],
      en: [
        "Clean the shrimp by removing the dorsal vein. Rinse with cold water and pat dry with paper towels.",
        "Finely chop the tomato, red onion and serrano chiles. Cut the avocado into medium cubes.",
        "In a large glass bowl, mix the shrimp with freshly squeezed lime juice. Marinate in the refrigerator for 20-30 minutes until the shrimp turn pink.",
        "Add the chopped tomato, onion, serrano chile and cilantro to the marinated shrimp. Mix gently.",
        "Fold in the avocado, olive oil and season with sea salt to taste. Stir gently to avoid mashing the avocado.",
        "Refrigerate the mixture for at least 15 minutes to let the flavors meld together.",
        "Serve cold on crispy corn tostadas. Accompany with lime wedges and hot sauce to taste."
      ]
    },
    vegetarian: {
      es: [
        "Calienta el aceite en una sartén amplia a fuego medio. Fríe los triángulos de tortilla hasta dorar (2 minutos por lado). Escúrrelos sobre papel absorbente.",
        "En la misma sartén, sofríe la cebolla y el ajo durante 3 minutos hasta que estén transparentes y aromáticos.",
        "Agrega los frijoles negros y la rama de epazote. Cocina a fuego medio durante 5 minutos, machacando ligeramente algunos frijoles para espesar.",
        "Incorpora las rajas de chile poblano y los granos de elote. Cocina 3 minutos más revolviendo constantemente.",
        "Añade los triángulos de tortilla fritos y mezcla con cuidado para que se impregnen de la salsa de frijoles.",
        "Espolvorea el queso panela o Oaxaca desmenuzado por encima y tapa la sartén 2 minutos para que se funda ligeramente.",
        "Sirve de inmediato con crema ácida y salsa verde al gusto. Decora con hojas de cilantro fresco."
      ],
      en: [
        "Heat oil in a wide skillet over medium heat. Fry the tortilla triangles until golden (2 minutes per side). Drain on paper towels.",
        "In the same skillet, sauté the onion and garlic for 3 minutes until translucent and fragrant.",
        "Add the black beans and epazote sprig. Cook over medium heat for 5 minutes, lightly mashing some beans to thicken.",
        "Add the poblano chile strips and corn kernels. Cook 3 more minutes, stirring constantly.",
        "Add the fried tortilla triangles and mix gently so they absorb the bean sauce.",
        "Sprinkle crumbled panela or Oaxaca cheese on top and cover the skillet for 2 minutes to let it slightly melt.",
        "Serve immediately with sour cream and green salsa to taste. Garnish with fresh cilantro leaves."
      ]
    },
    desserts: {
      es: [
        "Precalienta el horno a 170°C (340°F). Prepara un molde para flan engrasando ligeramente los bordes.",
        "En una olla pequeña a fuego medio, derrite 1 taza de azúcar sin revolver. Cuando se torne color ámbar dorado (5-7 minutos), vierte rápidamente en el molde y gíralo para cubrir el fondo uniformemente.",
        "En la licuadora, mezcla la leche condensada, la leche entera, los huevos y la vainilla a velocidad media durante 1 minuto hasta integrar completamente.",
        "Cuela la mezcla de la licuadora con un colador fino para eliminar grumos. Viértela con cuidado sobre el caramelo ya endurecido.",
        "Coloca el molde dentro de un recipiente más grande y llena con agua caliente hasta la mitad del molde (baño María).",
        "Hornea durante 55-65 minutos hasta que al insertar un palillo en el centro, este salga limpio. La superficie debe estar firme pero temblar ligeramente.",
        "Retira del horno y deja enfriar a temperatura ambiente. Refrigera mínimo 4 horas (idealmente toda la noche). Desmolda invirtiendo sobre un plato."
      ],
      en: [
        "Preheat oven to 170°C (340°F). Prepare a flan mold by lightly greasing the edges.",
        "In a small pot over medium heat, melt 1 cup of sugar without stirring. When it turns golden amber (5-7 minutes), quickly pour into the mold and tilt to coat the bottom evenly.",
        "In a blender, mix condensed milk, whole milk, eggs and vanilla at medium speed for 1 minute until fully combined.",
        "Strain the blender mixture through a fine sieve to remove lumps. Carefully pour over the hardened caramel.",
        "Place the mold inside a larger dish and fill with hot water halfway up the mold (water bath / bain-marie).",
        "Bake for 55-65 minutes until a toothpick inserted in the center comes out clean. The surface should be firm but jiggle slightly.",
        "Remove from oven and let cool to room temperature. Refrigerate at least 4 hours (ideally overnight). Unmold by inverting onto a plate."
      ]
    }
  },
  italy: {
    meat: {
      es: [
        "En una olla amplia (tipo rondeau), calienta el aceite de oliva a fuego medio. Añade la cebolla, la zanahoria y el apio picados (soffritto). Cocina revolviendo 5-7 minutos hasta que todo esté suave y dorado.",
        "Sube el fuego a alto, agrega la carne molida y cocínala rompiendo los grumos con una cuchara de madera durante 8-10 minutos hasta que esté bien dorada.",
        "Vierte el vino tinto y raspa el fondo de la olla para despegar todos los sabores caramelizados. Deja evaporar el alcohol durante 3 minutos.",
        "Incorpora los tomates San Marzano triturados, el ajo laminado, las hojas de laurel y sazona con sal, pimienta y orégano. Revuelve bien.",
        "Reduce el fuego al mínimo y cocina la salsa a fuego lento durante al menos 45 minutos (idealmente 1.5 horas), tapada parcialmente. Revuelve cada 15 minutos.",
        "Mientras tanto, hierve agua con sal abundante y cocina la pasta según las instrucciones del paquete hasta que esté al dente. Reserva 1 taza del agua de cocción.",
        "Escurre la pasta y mézclala directamente en la olla con la salsa. Añade un poco del agua de cocción reservada para lograr la consistencia deseada.",
        "Sirve inmediatamente en platos hondos precalentados, coronando con hojas de albahaca fresca y abundante parmigiano reggiano rallado."
      ],
      en: [
        "In a wide pot (rondeau type), heat olive oil over medium heat. Add the chopped onion, carrot and celery (soffritto). Cook stirring for 5-7 minutes until everything is soft and golden.",
        "Raise heat to high, add the ground meat and cook, breaking up clumps with a wooden spoon for 8-10 minutes until well browned.",
        "Pour in the red wine and scrape the bottom of the pot to release all caramelized flavors. Let the alcohol evaporate for 3 minutes.",
        "Add the crushed San Marzano tomatoes, sliced garlic, bay leaves and season with salt, pepper and oregano. Stir well.",
        "Reduce heat to the lowest setting and simmer the sauce for at least 45 minutes (ideally 1.5 hours), partially covered. Stir every 15 minutes.",
        "Meanwhile, boil generously salted water and cook the pasta according to package directions until al dente. Reserve 1 cup of cooking water.",
        "Drain the pasta and toss it directly into the pot with the sauce. Add some reserved cooking water to achieve the desired consistency.",
        "Serve immediately in preheated shallow bowls, topped with fresh basil leaves and generous grated parmigiano reggiano."
      ]
    },
    seafood: {
      es: [
        "Lava las almejas en agua fría con sal durante 30 minutos para que suelten la arena. Desecha las que estén abiertas.",
        "Hierve agua con sal abundante en una olla grande y cocina el linguine hasta 2 minutos antes del tiempo indicado (quedará muy al dente).",
        "En una sartén grande, calienta el aceite de oliva a fuego medio. Saltea el ajo laminado y el peperoncino durante 1 minuto sin dejar que el ajo se queme.",
        "Sube el fuego a alto, añade las almejas y los camarones. Vierte el vino blanco y tapa la sartén. Cocina 4-5 minutos hasta que las almejas se abran.",
        "Agrega la pasta escurrida directamente a la sartén junto con ½ taza del agua de cocción. Saltea a fuego alto durante 2 minutos mezclando vigorosamente.",
        "Retira del fuego, añade la ralladura de limón y el perejil fresco. Mezcla bien y sirve de inmediato en platos hondos."
      ],
      en: [
        "Soak the clams in cold salted water for 30 minutes to release any sand. Discard any that are open.",
        "Boil generously salted water in a large pot and cook the linguine until 2 minutes before the indicated time (it should be very al dente).",
        "In a large skillet, heat olive oil over medium heat. Sauté the sliced garlic and peperoncino for 1 minute without letting the garlic burn.",
        "Raise heat to high, add the clams and shrimp. Pour in the white wine and cover the skillet. Cook 4-5 minutes until the clams open.",
        "Add the drained pasta directly to the skillet along with ½ cup of cooking water. Toss over high heat for 2 minutes, mixing vigorously.",
        "Remove from heat, add the lemon zest and fresh parsley. Mix well and serve immediately in shallow bowls."
      ]
    },
    vegetarian: {
      es: [
        "Corta las berenjenas en rodajas de 1 cm. Espolvoréalas con sal y déjalas reposar 30 minutos para que suelten el amargor. Sécalas con papel absorbente.",
        "Fríe las rodajas de berenjena en aceite de oliva abundante hasta que estén doradas por ambos lados (3-4 minutos por lado). Escúrrelas sobre papel absorbente.",
        "Prepara la salsa calentando el aceite con los dientes de ajo enteros. Añade la salsa de tomate, sal, pimienta y orégano. Cocina a fuego bajo 15 minutos.",
        "Cocina la pasta penne en agua hirviendo con sal hasta que esté al dente. Escúrrela y resérvala.",
        "Precalienta el horno a 200°C (400°F). En una fuente para horno, alterna capas de pasta, salsa de tomate, berenjena frita y mozzarella en rodajas.",
        "Espolvorea la superficie con parmigiano rallado. Hornea durante 20-25 minutos hasta que la superficie esté dorada y burbujeante.",
        "Deja reposar 5 minutos fuera del horno. Decora con hojas frescas de albahaca antes de servir."
      ],
      en: [
        "Cut the eggplants into 1cm slices. Sprinkle with salt and let rest 30 minutes to release bitterness. Pat dry with paper towels.",
        "Fry the eggplant slices in generous olive oil until golden on both sides (3-4 minutes per side). Drain on paper towels.",
        "Prepare the sauce by heating oil with whole garlic cloves. Add the tomato sauce, salt, pepper and oregano. Cook on low heat for 15 minutes.",
        "Cook the penne pasta in boiling salted water until al dente. Drain and set aside.",
        "Preheat oven to 200°C (400°F). In a baking dish, alternate layers of pasta, tomato sauce, fried eggplant and sliced mozzarella.",
        "Sprinkle the surface with grated parmigiano. Bake for 20-25 minutes until the top is golden and bubbling.",
        "Let rest 5 minutes outside the oven. Garnish with fresh basil leaves before serving."
      ]
    },
    desserts: {
      es: [
        "Prepara el café espresso y déjalo enfriar completamente. Mézclalo con el licor Marsala o amaretto en un plato hondo.",
        "Separa las yemas de las claras. Bate las yemas con el azúcar glass durante 5 minutos hasta obtener una crema pálida y esponjosa.",
        "Añade el mascarpone a las yemas batidas y mezcla con movimientos envolventes suaves hasta lograr una crema homogénea y sedosa.",
        "Sumerge rápidamente cada bizcocho savoiardi en el café con licor (máximo 2 segundos por lado). No los dejes en remojo o se desharán.",
        "En un molde rectangular, coloca una primera capa de bizcochos mojados. Cúbrelos con la mitad de la crema de mascarpone.",
        "Repite con otra capa de bizcochos y termina con el resto de la crema. Alisa la superficie con una espátula.",
        "Cubre con film transparente y refrigera mínimo 6 horas (mejor 12 horas o toda la noche).",
        "Antes de servir, espolvorea abundante cacao amargo en polvo usando un colador fino. Corta en porciones y sirve frío."
      ],
      en: [
        "Prepare the espresso coffee and let it cool completely. Mix it with Marsala or amaretto liqueur in a shallow dish.",
        "Separate the yolks from the whites. Beat the yolks with powdered sugar for 5 minutes until you get a pale and fluffy cream.",
        "Add the mascarpone to the beaten yolks and fold in with gentle sweeping motions until you achieve a smooth and silky cream.",
        "Quickly dip each savoiardi biscuit into the coffee-liqueur mixture (maximum 2 seconds per side). Don't let them soak or they'll fall apart.",
        "In a rectangular dish, place a first layer of soaked biscuits. Cover with half of the mascarpone cream.",
        "Repeat with another layer of biscuits and finish with the remaining cream. Smooth the surface with a spatula.",
        "Cover with plastic wrap and refrigerate for at least 6 hours (12 hours or overnight is better).",
        "Before serving, dust generously with unsweetened cocoa powder using a fine sieve. Cut into portions and serve cold."
      ]
    }
  },
  japan: {
    meat: {
      es: [
        "Corta la carne de cerdo en filetes de 1.5 cm de grosor. Hazle cortes superficiales en los bordes para evitar que se encojan al freír. Sazona con sal y pimienta.",
        "Prepara tres estaciones de empanizado: harina en un plato, huevos batidos en otro, y panko en un tercero. Pasa cada filete por harina, luego huevo, y finalmente panko presionando bien.",
        "Calienta aceite vegetal en una olla profunda hasta alcanzar 170°C (340°F). Fríe los filetes empanizados durante 5-6 minutos hasta que el panko esté dorado y crujiente. Voltea a mitad de cocción.",
        "Retira los filetes y déjalos reposar sobre una rejilla durante 3 minutos para que el jugo se redistribuya. Córtalos en tiras gruesas.",
        "En una sartén pequeña, mezcla la salsa de soya, el mirin, el sake y el jengibre rallado. Calienta a fuego medio hasta que hierva y se reduzca ligeramente (3 minutos).",
        "Sirve las tiras de tonkatsu sobre arroz japonés caliente. Baña con la salsa y decora con cebollín picado y semillas de sésamo tostadas."
      ],
      en: [
        "Cut the pork into 1.5cm thick cutlets. Make shallow cuts on the edges to prevent curling while frying. Season with salt and pepper.",
        "Set up three breading stations: flour on one plate, beaten eggs on another, and panko on a third. Coat each cutlet in flour, then egg, then panko, pressing firmly.",
        "Heat vegetable oil in a deep pot until it reaches 170°C (340°F). Fry the breaded cutlets for 5-6 minutes until the panko is golden and crispy. Flip halfway through.",
        "Remove the cutlets and let them rest on a wire rack for 3 minutes so the juices redistribute. Cut into thick strips.",
        "In a small skillet, combine soy sauce, mirin, sake and grated ginger. Heat over medium until it boils and reduces slightly (3 minutes).",
        "Serve the tonkatsu strips over hot Japanese rice. Drizzle with the sauce and garnish with chopped scallions and toasted sesame seeds."
      ]
    },
    seafood: {
      es: [
        "Lava el arroz para sushi en agua fría hasta que el agua salga clara (5-6 enjuagues). Cocínalo con la cantidad justa de agua según las instrucciones.",
        "Mientras el arroz está caliente, sazona con la mezcla de vinagre de arroz, azúcar y sal. Abanica mientras mezclas para enfriarlo y darle brillo.",
        "Corta el salmón y el atún en láminas de 5mm de grosor con un cuchillo muy afilado, en un solo movimiento limpio. Mantén el pescado frío.",
        "Coloca una hoja de nori tostada sobre la esterilla de bambú (makisu). Extiende una capa fina de arroz dejando 2cm libres en el borde superior.",
        "Coloca tiras de pescado, aguacate y pepino en el centro del arroz. Enrolla firmemente con la esterilla, presionando suavemente para compactar.",
        "Con un cuchillo humedecido, corta cada rollo en 8 piezas iguales con movimientos suaves de sierra.",
        "Presenta los cortes en un plato con jengibre encurtido, wasabi y salsa de soya en un pequeño recipiente aparte. Espolvorea con semillas de sésamo."
      ],
      en: [
        "Wash the sushi rice in cold water until the water runs clear (5-6 rinses). Cook with the exact amount of water according to instructions.",
        "While the rice is still hot, season with the mixture of rice vinegar, sugar and salt. Fan while mixing to cool it down and give it a shine.",
        "Cut the salmon and tuna into 5mm thick slices using a very sharp knife in a single clean motion. Keep the fish cold.",
        "Place a sheet of toasted nori on the bamboo mat (makisu). Spread a thin layer of rice leaving 2cm free at the top edge.",
        "Place strips of fish, avocado and cucumber in the center of the rice. Roll firmly using the mat, pressing gently to compact.",
        "With a moistened knife, cut each roll into 8 equal pieces using gentle sawing motions.",
        "Present the pieces on a plate with pickled ginger, wasabi and soy sauce in a small separate dish. Sprinkle with sesame seeds."
      ]
    },
    vegetarian: {
      es: [
        "Escurre el tofu firme envolviéndolo en papel absorbente con un peso encima durante 20 minutos. Córtalo en cubos de 2cm.",
        "Prepara el caldo dashi calentando agua con las algas kombu y los copos de bonito (o usar dashi vegetal instantáneo).",
        "Cocina los fideos soba en agua hirviendo según las instrucciones del paquete. Escúrrelos y enfríalos bajo agua fría. Resérvalos.",
        "En una sartén a fuego medio, calienta el aceite de sésamo y saltea los hongos shiitake laminados durante 4-5 minutos hasta que estén dorados.",
        "Disuelve la pasta de miso en un poco de caldo dashi tibio (nunca en caldo hirviendo para no perder los probióticos). Incorpora al resto del caldo.",
        "Ensambla los bowls: coloca los fideos en el fondo, añade el tofu, los hongos, los edamames y el alga wakame. Vierte el caldo de miso caliente por encima.",
        "Decora con cebollín fresco picado y unas gotas de aceite de sésamo. Sirve inmediatamente."
      ],
      en: [
        "Drain the firm tofu by wrapping it in paper towels with a weight on top for 20 minutes. Cut into 2cm cubes.",
        "Prepare the dashi broth by heating water with kombu seaweed and bonito flakes (or use instant vegetable dashi).",
        "Cook the soba noodles in boiling water according to package instructions. Drain and cool under cold running water. Set aside.",
        "In a skillet over medium heat, heat the sesame oil and sauté the sliced shiitake mushrooms for 4-5 minutes until golden.",
        "Dissolve the miso paste in a little warm dashi broth (never in boiling broth to preserve the probiotics). Add to the rest of the broth.",
        "Assemble the bowls: place noodles at the bottom, add tofu, mushrooms, edamame and wakame seaweed. Pour the hot miso broth over everything.",
        "Garnish with fresh chopped scallions and a few drops of sesame oil. Serve immediately."
      ]
    },
    desserts: {
      es: [
        "Mezcla la harina de arroz glutinoso con el azúcar en un bowl apto para microondas. Añade el agua gradualmente y mezcla hasta obtener una masa suave sin grumos.",
        "Cubre el bowl con film transparente y cocina en el microondas a potencia alta por 2 minutos. Revuelve bien y cocina otros 2 minutos.",
        "Espolvorea maicena sobre una superficie limpia. Voltea la masa de mochi caliente sobre la superficie enharinada. Ten cuidado, estará muy caliente.",
        "Cuando puedas manejar la masa, divídela en 8-10 porciones iguales. Aplana cada una formando un disco con tus manos enharinadas.",
        "Coloca una cucharadita de pasta de frijol rojo (anko) en el centro de cada disco. Cierra los bordes pellizcando y sellando bien.",
        "Dale forma de bola con las manos y rueda en maicena para evitar que se peguen entre sí.",
        "Sirve a temperatura ambiente el mismo día para disfrutar de la textura suave y elástica. Acompaña con té verde matcha."
      ],
      en: [
        "Mix the glutinous rice flour with sugar in a microwave-safe bowl. Gradually add water and mix until you get a smooth batter without lumps.",
        "Cover the bowl with plastic wrap and microwave on high for 2 minutes. Stir well and cook for another 2 minutes.",
        "Dust a clean surface with cornstarch. Turn the hot mochi dough onto the floured surface. Be careful, it will be very hot.",
        "When you can handle the dough, divide it into 8-10 equal portions. Flatten each one into a disc with your floured hands.",
        "Place a teaspoon of red bean paste (anko) in the center of each disc. Close the edges by pinching and sealing well.",
        "Shape into balls with your hands and roll in cornstarch to prevent sticking.",
        "Serve at room temperature the same day to enjoy the soft and elastic texture. Pair with green matcha tea."
      ]
    }
  },
  india: {
    meat: {
      es: [
        "Marina los trozos de pollo con yogur, cúrcuma, chile en polvo y la mitad del garam masala. Deja reposar en el refrigerador mínimo 2 horas (idealmente toda la noche).",
        "En una olla grande o karahi, calienta el ghee a fuego medio. Sofríe las cebollas picadas revolviendo frecuentemente durante 10-12 minutos hasta que estén doradas y caramelizadas.",
        "Agrega la pasta de ajo y jengibre. Cocina 2 minutos revolviendo constantemente para que no se queme. El aroma debe ser intenso y fragante.",
        "Incorpora los tomates triturados y cocina a fuego medio durante 8-10 minutos hasta que el aceite se separe de la salsa (este paso es clave en la cocina india).",
        "Añade el pollo marinado con todo el yogur. Revuelve bien y cocina a fuego alto 5 minutos sellando la carne por todos los lados.",
        "Baja el fuego, tapa la olla y cocina a fuego lento durante 25-30 minutos hasta que el pollo esté completamente cocido y tierno.",
        "Agrega la crema de leche y el resto del garam masala. Cocina sin tapa 5 minutos más. Decora con cilantro fresco y sirve con arroz basmati caliente."
      ],
      en: [
        "Marinate the chicken pieces with yogurt, turmeric, chili powder and half the garam masala. Refrigerate for at least 2 hours (ideally overnight).",
        "In a large pot or karahi, heat the ghee over medium heat. Sauté the chopped onions, stirring frequently for 10-12 minutes until golden and caramelized.",
        "Add the garlic and ginger paste. Cook for 2 minutes, stirring constantly to prevent burning. The aroma should be intense and fragrant.",
        "Add the crushed tomatoes and cook over medium heat for 8-10 minutes until the oil separates from the sauce (this step is key in Indian cooking).",
        "Add the marinated chicken with all the yogurt. Stir well and cook on high heat for 5 minutes, searing the meat on all sides.",
        "Lower the heat, cover the pot and simmer for 25-30 minutes until the chicken is fully cooked and tender.",
        "Add the heavy cream and remaining garam masala. Cook uncovered for 5 more minutes. Garnish with fresh cilantro and serve with hot basmati rice."
      ]
    },
    seafood: {
      es: [
        "Limpia y desvena los camarones. Márcalos con cúrcuma, sal y jugo de limón. Deja reposar 10 minutos.",
        "En una sartén honda, calienta el aceite de coco a fuego medio. Añade las hojas de curry y deja chisporrotear 30 segundos.",
        "Sofríe las cebollas en juliana hasta que estén doradas (8 minutos). Agrega el ajo, el jengibre y el curry Madrás. Cocina 2 minutos.",
        "Vierte la leche de coco y lleva a ebullición suave. Reduce el fuego y cocina 10 minutos hasta que la salsa espese ligeramente.",
        "Incorpora los camarones a la salsa y cocina 5-6 minutos a fuego medio hasta que estén rosados y firmes.",
        "Exprime el jugo de limón, rectifica la sazón y sirve caliente sobre arroz basmati perfumado."
      ],
      en: [
        "Clean and devein the shrimp. Rub with turmeric, salt and lemon juice. Let rest for 10 minutes.",
        "In a deep skillet, heat coconut oil over medium heat. Add curry leaves and let them splutter for 30 seconds.",
        "Sauté the julienned onions until golden (8 minutes). Add garlic, ginger and Madras curry. Cook 2 minutes.",
        "Pour in the coconut milk and bring to a gentle boil. Reduce heat and cook 10 minutes until the sauce thickens slightly.",
        "Add the shrimp to the sauce and cook 5-6 minutes over medium heat until they are pink and firm.",
        "Squeeze lemon juice, adjust seasoning and serve hot over fragrant basmati rice."
      ]
    },
    vegetarian: {
      es: [
        "Lava las lentejas rojas en agua fría hasta que el agua salga clara. Escúrrelas y resérvalas.",
        "En una olla mediana, hierve las lentejas con la cúrcuma y suficiente agua para cubrirlas. Cocina a fuego medio 20-25 minutos hasta que estén completamente suaves.",
        "Mientras tanto, pela y corta las papas en cubos de 2cm. Lava la espinaca y pícala gruesa.",
        "En una sartén, calienta el ghee y tuesta las semillas de comino hasta que chisporroteen. Añade la cebolla y cocina 5 minutos.",
        "Agrega el ajo, el jengibre y el garam masala. Sofríe 2 minutos hasta que los aromas se liberen.",
        "Incorpora las papas y ½ taza de agua. Cocina tapado 15 minutos hasta que las papas estén tiernas. Añade la espinaca y cocina 3 minutos más.",
        "Mezcla las lentejas con la preparación de papas y espinaca. Ajusta la sal y sirve con pan naan caliente y arroz basmati."
      ],
      en: [
        "Wash the red lentils in cold water until the water runs clear. Drain and set aside.",
        "In a medium pot, boil the lentils with turmeric and enough water to cover them. Cook over medium heat for 20-25 minutes until completely soft.",
        "Meanwhile, peel and cut the potatoes into 2cm cubes. Wash the spinach and chop it roughly.",
        "In a skillet, heat the ghee and toast the cumin seeds until they splutter. Add the onion and cook for 5 minutes.",
        "Add the garlic, ginger and garam masala. Sauté for 2 minutes until the aromas are released.",
        "Add the potatoes and ½ cup water. Cook covered for 15 minutes until potatoes are tender. Add spinach and cook 3 more minutes.",
        "Combine the lentils with the potato and spinach mixture. Adjust salt and serve with warm naan bread and basmati rice."
      ]
    },
    desserts: {
      es: [
        "En una olla de fondo grueso, vierte la leche entera y llévala a ebullición a fuego medio-alto, revolviendo constantemente para evitar que se pegue.",
        "Reduce el fuego a medio-bajo y cocina la leche durante 40-50 minutos, revolviendo cada 5 minutos, hasta que se reduzca a la mitad de su volumen.",
        "Añade el azúcar, la leche en polvo y el cardamomo. Mezcla bien y cocina otros 10 minutos hasta obtener una masa espesa.",
        "Agrega el ghee y continúa revolviendo 5 minutos más hasta que la mezcla se despegue fácilmente de las paredes de la olla.",
        "Si usas azafrán, disuélvelo en una cucharada de leche tibia y agrégalo junto con el agua de rosas.",
        "Vierte la mezcla en un molde engrasado con ghee. Alisa la superficie y decora con pistachos y almendras laminadas.",
        "Deja enfriar completamente a temperatura ambiente y luego refrigera 2 horas. Corta en rombos o cuadrados para servir."
      ],
      en: [
        "In a heavy-bottomed pot, pour the whole milk and bring to a boil over medium-high heat, stirring constantly to prevent sticking.",
        "Reduce heat to medium-low and cook the milk for 40-50 minutes, stirring every 5 minutes, until it reduces to half its volume.",
        "Add the sugar, milk powder and cardamom. Mix well and cook another 10 minutes until you get a thick paste.",
        "Add the ghee and continue stirring for 5 more minutes until the mixture easily pulls away from the sides of the pot.",
        "If using saffron, dissolve it in a tablespoon of warm milk and add it along with the rose water.",
        "Pour the mixture into a ghee-greased mold. Smooth the surface and decorate with sliced pistachios and almonds.",
        "Let cool completely at room temperature then refrigerate for 2 hours. Cut into diamonds or squares to serve."
      ]
    }
  }
};

// Fallback genérico para países sin banco específico (usa, spain, france, china, thailand, greece)
const genericSteps = {
  meat: {
    es: [
      "Sazona la carne generosamente con sal, pimienta y las especias propias de la receta. Deja reposar 15 minutos a temperatura ambiente.",
      "Calienta el aceite o la grasa elegida en una sartén grande a fuego alto. Cuando esté bien caliente y comience a humear ligeramente, coloca la carne sin moverla para lograr un buen sellado (3-4 minutos por lado).",
      "Retira la carne y en la misma sartén, sofríe las cebollas, el ajo y las verduras aromáticas a fuego medio durante 5-7 minutos hasta que estén doradas.",
      "Deglasa el fondo de la sartén con el líquido indicado (vino, caldo o agua). Raspa los trozos caramelizados del fondo para incorporar todo el sabor.",
      "Regresa la carne a la sartén, añade la salsa o el líquido de cocción. Baja el fuego al mínimo, tapa y cocina lentamente durante 30-60 minutos.",
      "Verifica la cocción: la carne debe estar tierna y desprenderse fácilmente. Ajusta la sazón con sal y pimienta.",
      "Deja reposar 5 minutos antes de servir. Presenta en un plato precalentado con la guarnición recomendada y hierbas frescas."
    ],
    en: [
      "Season the meat generously with salt, pepper and the recipe's signature spices. Let rest 15 minutes at room temperature.",
      "Heat the oil or chosen fat in a large skillet over high heat. When very hot and lightly smoking, place the meat without moving it for a good sear (3-4 minutes per side).",
      "Remove the meat and in the same skillet, sauté onions, garlic and aromatic vegetables over medium heat for 5-7 minutes until golden.",
      "Deglaze the pan bottom with the indicated liquid (wine, broth or water). Scrape the caramelized bits from the bottom to incorporate all the flavor.",
      "Return the meat to the skillet, add the sauce or cooking liquid. Lower heat to minimum, cover and cook slowly for 30-60 minutes.",
      "Check doneness: the meat should be tender and pull apart easily. Adjust seasoning with salt and pepper.",
      "Let rest 5 minutes before serving. Present on a preheated plate with the recommended garnish and fresh herbs."
    ]
  },
  seafood: {
    es: [
      "Limpia el marisco o pescado retirando impurezas, escamas o vísceras. Enjuaga con agua fría y seca con papel absorbente.",
      "Prepara todos los vegetales y aromáticos: pica las cebollas, lamina el ajo, corta las hierbas frescas. Ten todo listo antes de comenzar a cocinar.",
      "Calienta el aceite en una sartén amplia a fuego medio-alto. Cuando esté brillante, cocina el marisco en una sola capa sin amontonar (2-3 minutos por lado).",
      "Retira el marisco y en la misma sartén, sofríe los aromáticos con el ajo durante 2 minutos a fuego medio.",
      "Deglasa con vino blanco o jugo de cítricos. Deja reducir 2 minutos. Añade la salsa o el caldo indicado.",
      "Regresa el marisco a la sartén y cocina solo 2-3 minutos más (es crucial no sobrecocinarlo). Ajusta la sal.",
      "Sirve de inmediato en platos tibios, decorando con hierbas frescas y un chorrito de limón o aceite de oliva."
    ],
    en: [
      "Clean the seafood or fish by removing impurities, scales or entrails. Rinse with cold water and pat dry with paper towels.",
      "Prepare all vegetables and aromatics: chop onions, slice garlic, cut fresh herbs. Have everything ready before cooking.",
      "Heat oil in a wide skillet over medium-high heat. When shimmering, cook seafood in a single layer without crowding (2-3 minutes per side).",
      "Remove the seafood and in the same skillet, sauté the aromatics with garlic for 2 minutes over medium heat.",
      "Deglaze with white wine or citrus juice. Let reduce for 2 minutes. Add the indicated sauce or broth.",
      "Return the seafood to the skillet and cook only 2-3 more minutes (it's crucial not to overcook). Adjust salt.",
      "Serve immediately on warm plates, garnishing with fresh herbs and a drizzle of lemon or olive oil."
    ]
  },
  vegetarian: {
    es: [
      "Lava y prepara todos los vegetales: pela, corta en trozos uniformes y sepáralos según su tiempo de cocción.",
      "Si la receta incluye legumbres o granos, cocínalos por separado en agua hirviendo con una pizca de sal hasta que estén tiernos.",
      "Calienta el aceite en una sartén grande a fuego medio. Sofríe la cebolla y el ajo hasta que estén fragantes y translúcidos (4-5 minutos).",
      "Añade las especias secas y cocínalas 1 minuto para activar sus aromas (este paso marca la diferencia en el sabor final).",
      "Incorpora los vegetales comenzando por los más duros (raíces, tallos) y terminando con los más delicados (hojas, hierbas).",
      "Agrega el líquido de cocción y deja que todo se cocine a fuego medio durante 15-20 minutos hasta obtener la textura deseada.",
      "Rectifica la sazón, añade las hierbas frescas y sirve caliente con la guarnición indicada."
    ],
    en: [
      "Wash and prepare all vegetables: peel, cut into uniform pieces and separate them by cooking time.",
      "If the recipe includes legumes or grains, cook them separately in boiling salted water until tender.",
      "Heat oil in a large skillet over medium heat. Sauté onion and garlic until fragrant and translucent (4-5 minutes).",
      "Add dry spices and cook for 1 minute to activate their aromas (this step makes the difference in final flavor).",
      "Add vegetables starting with the hardest (roots, stems) and finishing with the most delicate (leaves, herbs).",
      "Add the cooking liquid and let everything cook over medium heat for 15-20 minutes until desired texture is achieved.",
      "Adjust seasoning, add fresh herbs and serve hot with the indicated garnish."
    ]
  },
  desserts: {
    es: [
      "Precalienta el horno a la temperatura indicada (generalmente 180°C / 350°F). Prepara los moldes engrasando y enharinando.",
      "En un bowl grande, tamiza los ingredientes secos (harina, azúcar, sal, levadura) y mézclalos bien con un batidor.",
      "En otro bowl, bate los ingredientes húmedos (huevos, mantequilla derretida, leche, vainilla) hasta que estén bien integrados.",
      "Incorpora los ingredientes húmedos a los secos con movimientos envolventes suaves. No mezcles en exceso para evitar que la masa quede dura.",
      "Vierte la mezcla en el molde preparado y alisa la superficie con una espátula.",
      "Hornea durante el tiempo indicado sin abrir la puerta del horno los primeros 20 minutos. La preparación estará lista cuando al insertar un palillo salga limpio.",
      "Retira del horno y deja enfriar 10 minutos en el molde antes de desmoldar. Decora según la receta y sirve."
    ],
    en: [
      "Preheat the oven to the indicated temperature (generally 180°C / 350°F). Prepare the pans by greasing and flouring.",
      "In a large bowl, sift the dry ingredients (flour, sugar, salt, leavening) and mix well with a whisk.",
      "In another bowl, beat the wet ingredients (eggs, melted butter, milk, vanilla) until well combined.",
      "Fold the wet ingredients into the dry with gentle sweeping motions. Don't over-mix to avoid a tough texture.",
      "Pour the mixture into the prepared pan and smooth the surface with a spatula.",
      "Bake for the indicated time without opening the oven door for the first 20 minutes. It's done when a toothpick inserted comes out clean.",
      "Remove from oven and let cool 10 minutes in the pan before unmolding. Decorate according to the recipe and serve."
    ]
  }
};

function getStepsForRecipe(country, type, recipeId) {
  const cLower = (country || 'world').toLowerCase()
    .replace('é', 'e').replace('ó', 'o').replace('ñ', 'n');
  
  let typeKey = (type || 'vegetarian').toLowerCase();
  if (typeKey === 'dessert') typeKey = 'desserts';
  if (!['meat', 'seafood', 'vegetarian', 'desserts'].includes(typeKey)) typeKey = 'vegetarian';

  const bank = stepBanks[cLower];
  if (bank && bank[typeKey]) {
    const esSteps = bank[typeKey].es;
    const enSteps = bank[typeKey].en;

    return esSteps.map((step, i) => ({
      es: step,
      en: enSteps[i] || step
    }));
  }

  // Fallback genérico
  const fb = genericSteps[typeKey] || genericSteps.vegetarian;
  return fb.es.map((step, i) => ({
    es: step,
    en: fb.en[i] || step
  }));
}

async function updateSteps() {
  console.log('🔌 Conectando a TiDB Cloud y Local...');
  const remotePool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });

  let localPool;
  try {
    localPool = mysql.createPool({
      host: 'localhost',
      user: 'recetas_admin',
      password: 'recetas123',
      database: 'MisRecetas'
    });
  } catch (e) {
    console.log('⚠️ No se pudo conectar a BD local, continuando solo con TiDB...');
  }

  let remoteConn, localConn;
  try {
    remoteConn = await remotePool.getConnection();
    if (localPool) {
      try { localConn = await localPool.getConnection(); } catch(e) {}
    }

    const [recipes] = await remoteConn.query(
      "SELECT id, title, category_country, category_type FROM recipes"
    );
    console.log(`📊 Actualizando pasos de ${recipes.length} recetas con instrucciones detalladas paso a paso...`);

    let updated = 0;
    for (const r of recipes) {
      const steps = getStepsForRecipe(r.category_country, r.category_type, r.id);
      const stepsJson = JSON.stringify(steps);

      await remoteConn.query('UPDATE recipes SET steps = ? WHERE id = ?', [stepsJson, r.id]);
      
      if (localConn) {
        try {
          await localConn.query('UPDATE recipes SET steps = ? WHERE id = ?', [stepsJson, r.id]);
        } catch (e) { /* ignore local errors */ }
      }
      
      updated++;
      if (updated % 50 === 0) console.log(`   ✏️ ${updated}/${recipes.length} recetas actualizadas...`);
    }

    console.log(`✅ ¡Éxito! Se actualizaron los pasos de ${updated} recetas.`);
    console.log('   Cada receta ahora tiene instrucciones detalladas con tiempos, temperaturas y técnicas culinarias.');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (remoteConn) remoteConn.release();
    if (localConn) localConn.release();
    remotePool.end();
    if (localPool) localPool.end();
  }
}

updateSteps();
