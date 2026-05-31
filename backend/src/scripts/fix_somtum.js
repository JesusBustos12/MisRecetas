import pool from '../config/db.js';

async function fixSomTum() {
  try {
    const recipeId = 154; // ID de Som Tum

    const newDesc = JSON.stringify({
      "es": "Ensalada tailandesa de papaya verde rallada machacada en mortero con tomates cherry, ejotes, cacahuates, chile y limón. Crujiente, ácida y explosivamente picante.",
      "en": "Thai green papaya salad pounded in a mortar with cherry tomatoes, green beans, peanuts, chili, and lime. Crunchy, tart, and explosively spicy."
    });

    const newIngredients = JSON.stringify({
      "es": [
        "2 tazas de papaya verde rallada",
        "1/2 taza de tomates cherry cortados a la mitad",
        "1/4 taza de ejotes cortados en trozos",
        "2 cucharadas de cacahuates tostados",
        "1 a 2 chiles tailandeses",
        "1 diente de ajo",
        "2 cucharadas de jugo de limón",
        "1 cucharada de azúcar de palma"
      ],
      "en": [
        "2 cups shredded green papaya",
        "1/2 cup cherry tomatoes, halved",
        "1/4 cup green beans, cut into pieces",
        "2 tablespoons roasted peanuts",
        "1 to 2 Thai chilies",
        "1 clove garlic",
        "2 tablespoons lime juice",
        "1 tablespoon palm sugar"
      ]
    });

    const newSteps = JSON.stringify({
      "es": [
        "En un mortero, machaca el ajo y los chiles hasta formar una pasta.",
        "Añade el azúcar de palma y el jugo de limón, mezclando bien para hacer el aderezo.",
        "Agrega los tomates cherry y los ejotes, machacando ligeramente para que suelten su jugo.",
        "Incorpora la papaya verde rallada y los cacahuates. Mezcla y machaca suavemente para que todo se impregne con el aderezo.",
        "Sirve inmediatamente para mantener la textura crujiente de la papaya."
      ],
      "en": [
        "In a mortar, pound the garlic and chilies into a paste.",
        "Add the palm sugar and lime juice, mixing well to make the dressing.",
        "Add the cherry tomatoes and green beans, pounding lightly to release their juices.",
        "Add the shredded green papaya and peanuts. Mix and pound gently so everything absorbs the dressing.",
        "Serve immediately to keep the papaya crisp."
      ]
    });

    await pool.query(
      'UPDATE recipes SET description = ?, ingredients = ?, steps = ? WHERE id = ?',
      [newDesc, newIngredients, newSteps, recipeId]
    );

    console.log('¡Receta Som Tum actualizada correctamente a su versión 100% vegetariana!');

  } catch (error) {
    console.error('Error actualizando la receta:', error);
  } finally {
    process.exit(0);
  }
}

fixSomTum();
