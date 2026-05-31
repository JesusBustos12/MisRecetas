import pool from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fixTaramosalata() {
  try {
    const recipeId = 299; // ID de Taramosalata en la DB

    // Los datos correctos de un dip clásico de Taramosalata
    const newDesc = JSON.stringify({
      "es": "Dip griego clásico a base de huevas de pescado, mezclado con pan, aceite de oliva y limón. Sedoso, salado y perfecto para acompañar con pan pita.",
      "en": "Classic Greek fish roe dip, blended with bread, olive oil, and lemon. Silky, salty, and perfect for dipping with pita bread."
    });

    const newIngredients = JSON.stringify({
      "es": [
        "100g de tarama (huevas de bacalao o carpa en salazón)",
        "3 rebanadas de pan blanco sin corteza, remojado y escurrido",
        "1 cebolla pequeña rallada muy fina",
        "Jugo de 2 limones",
        "150ml de aceite de oliva virgen extra",
        "Pan pita para acompañar"
      ],
      "en": [
        "100g tarama (salted cod or carp roe)",
        "3 slices of crustless white bread, soaked and squeezed",
        "1 small onion, very finely grated",
        "Juice of 2 lemons",
        "150ml extra virgin olive oil",
        "Pita bread for serving"
      ]
    });

    const newSteps = JSON.stringify({
      "es": [
        "Remoja el pan en agua durante unos minutos y exprímelo bien para quitar el exceso de líquido.",
        "En un procesador de alimentos, añade la tarama, la cebolla rallada y un poco de jugo de limón. Bate hasta que quede suave.",
        "Añade el pan escurrido y sigue procesando hasta que la mezcla sea homogénea.",
        "Con el motor en marcha, vierte el aceite de oliva poco a poco en un hilo fino, alternando con el resto del jugo de limón, hasta lograr una textura cremosa.",
        "Prueba y ajusta de limón si es necesario. Sirve frío, acompañado de pan pita, aceitunas y un hilo de aceite de oliva por encima."
      ],
      "en": [
        "Soak the bread in water for a few minutes and squeeze well to remove excess liquid.",
        "In a food processor, add the tarama, grated onion, and a little lemon juice. Blend until smooth.",
        "Add the squeezed bread and continue processing until the mixture is homogeneous.",
        "With the motor running, gradually pour in the olive oil in a thin stream, alternating with the remaining lemon juice, until you achieve a creamy texture.",
        "Taste and adjust lemon if necessary. Serve cold, accompanied by pita bread, olives, and a drizzle of olive oil on top."
      ]
    });

    const newNutrition = JSON.stringify({
      "calories": 250,
      "protein": 5,
      "carbs": 12,
      "fat": 20
    });

    // Mover la imagen generada a public
    const srcImage = "C:\\Users\\52762\\.gemini\\antigravity-ide\\brain\\aaa1ee2f-39e9-4da3-9096-dd8c328b731a\\taramosalata_dip_1780185923152.png";
    const destImage = path.resolve(__dirname, '../../../public/recipes/greece/taramosalata_dip.png');
    
    if (fs.existsSync(srcImage)) {
      fs.copyFileSync(srcImage, destImage);
      console.log('Imagen copiada exitosamente a:', destImage);
    } else {
      console.log('La imagen fuente no se encontró. Revisa la ruta.');
    }

    const newImageUrl = "/recipes/greece/taramosalata_dip.png";

    // Actualizar la base de datos
    await pool.query(
      'UPDATE recipes SET description = ?, ingredients = ?, steps = ?, nutrition = ?, image_url = ?, title = ? WHERE id = ? OR title LIKE "%Taramosala%"',
      [newDesc, newIngredients, newSteps, newNutrition, newImageUrl, JSON.stringify({"es": "Taramosalata", "en": "Taramosalata"}), recipeId]
    );

    console.log('¡Receta Taramosalata actualizada correctamente en la base de datos!');

  } catch (error) {
    console.error('Error actualizando la receta:', error);
  } finally {
    process.exit(0);
  }
}

fixTaramosalata();
