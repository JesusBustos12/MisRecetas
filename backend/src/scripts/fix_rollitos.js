import pool from '../config/db.js';

async function fixRollitos() {
  try {
    const recipeId = 13;

    const newDesc = JSON.stringify({
      "es": "Crujientes rollitos de primavera chinos rellenos de una suave y dulce pasta de frijol rojo (anko), espolvoreados con azúcar glass y acompañados de miel.",
      "en": "Crispy Chinese spring rolls filled with smooth and sweet red bean paste, dusted with powdered sugar and served with honey."
    });

    const newIngredients = JSON.stringify({
      "es": [
        "8 hojas para rollitos de primavera (spring roll wrappers)",
        "200g de pasta dulce de frijol rojo (dou sha / anko)",
        "1 cucharada de harina de trigo mezclada con 2 cucharadas de agua (para sellar)",
        "Aceite vegetal para freír",
        "Azúcar glass para espolvorear",
        "Miel para acompañar"
      ],
      "en": [
        "8 spring roll wrappers",
        "200g sweet red bean paste (dou sha / anko)",
        "1 tbsp wheat flour mixed with 2 tbsp water (for sealing)",
        "Vegetable oil for frying",
        "Powdered sugar for dusting",
        "Honey for serving"
      ]
    });

    const newSteps = JSON.stringify({
      "es": [
        "Coloca una hoja de rollito de primavera en forma de rombo sobre una superficie plana.",
        "Pon una cucharada generosa de pasta de frijol rojo cerca de la esquina inferior de la hoja y dale forma de pequeño cilindro.",
        "Dobla la esquina inferior sobre el relleno, luego dobla las esquinas laterales hacia el centro.",
        "Enrolla firmemente hacia arriba y usa un poco de la mezcla de harina y agua en la esquina superior para sellar el rollito.",
        "Calienta el aceite a 170°C en una sartén o wok. Fríe los rollitos en tandas hasta que estén dorados y crujientes (aproximadamente 3-4 minutos).",
        "Retira y escurre sobre papel absorbente. Espolvorea generosamente con azúcar glass y sirve caliente con miel a un lado."
      ],
      "en": [
        "Place a spring roll wrapper in a diamond shape on a flat surface.",
        "Put a generous tablespoon of red bean paste near the bottom corner of the wrapper and shape it into a small cylinder.",
        "Fold the bottom corner over the filling, then fold the side corners towards the center.",
        "Roll up tightly and use a little of the flour and water mixture on the top corner to seal the roll.",
        "Heat the oil to 170°C in a pan or wok. Fry the rolls in batches until golden and crispy (about 3-4 minutes).",
        "Remove and drain on paper towels. Dust generously with powdered sugar and serve hot with honey on the side."
      ]
    });

    const newNutrition = JSON.stringify({
      "calories": 210,
      "protein": 4,
      "carbs": 32,
      "fat": 8
    });

    await pool.query(
      'UPDATE recipes SET description = ?, ingredients = ?, steps = ?, nutrition = ? WHERE id = ?',
      [newDesc, newIngredients, newSteps, newNutrition, recipeId]
    );

    console.log('¡Receta Rollitos Dulces de Primavera actualizada correctamente!');

  } catch (error) {
    console.error('Error actualizando la receta:', error);
  } finally {
    process.exit(0);
  }
}

fixRollitos();
