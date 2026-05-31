import pool from '../config/db.js';

async function migrateCategories() {
  try {
    console.log('Iniciando migración de categorías...');

    // 1. Añadir la columna category_type si no existe
    try {
      await pool.query('ALTER TABLE recipes ADD COLUMN category_type VARCHAR(20) DEFAULT NULL');
      console.log('Columna category_type añadida a la tabla recipes.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('La columna category_type ya existe, procediendo a actualizar...');
      } else {
        throw e;
      }
    }

    // Lógica actual de expresiones regulares
    const meatLand = 'massaman|pollo|chicken|carne|cerdo|beef|pork|cordero|steak|ternera|chuleta|tocino|bacon|jamon|jamón|salchicha|sausage|salami|pavo|turkey|duck|pato|meatball|albóndiga|brisket|wings|prosciutto|guanciale|pancetta|chorizo|carnitas|cochinita|pastrami|veal|lamb|ribs|costillas|ossobuco|bolognese|boloñesa|tonkotsu|menudo|barbacoa|hot.dog|perrito|hamburguesa|burger|bistecca|meatloaf|cochinillo|boeuf|escargot|katsudon|shabu|sukiyaki|yakisoba|nogada|torta.ahogada|gravy|calzone|fabada|cassoulet|croque.monsieur|rogan.josh|kra.pao|larb|pastitsio|jambalaya|wonton|tuetano|tuétano|ragú|brodo|soupe.oignon|yam.nua|tom.kha|khao.soi|pad.see.ew|moussaka|carbonara|quiche|gyoza|omurice|katsu|coq.au|chicharron|chicharrón|suadero';
    const meatSea = 'pescado|fish|camaron|camarón|shrimp|marisco|seafood|salmon|salmón|atun|atún|pulpo|octopus|calamar|squid|bacalao|lobster|langosta|crab|cangrejo|mussels|mejillones|clams|almejas|ostras|oysters|vieiras|scallops|prawns|gambas|langostinos|unagi|anchoa|anchovy|takoyaki|aguachile|clam|bouillabaisse|paella|arroz.negro|pla.goong|miso|chawanmushi|nicoise|niçoise|pissaladiere|tod.mun.pla|taramosalata|coquilles|okonomiyaki|khao.pad';
    const dessertTerms = 'postre|dessert|helado|flan|galleta|cookie|brownie|muffin|cupcake|mermelada|mousse|creme.brulee|pudding|pudin|tiramisu|tiramisú|gelato|cannoli|panettone|panna.cotta|macaron|baklava|dorayaki|mochi|profiteroles|churros|sfogliatella|zabaione|zeppole|loukoumades|mooncakes|bizcocho|cheesecake|tartaleta|gelatina|sorbete|sorbet|pumpkin.pie|crema.catalana|tarta.santiago|tarte.tatin|crepes.suzette|gulab.jamun|mango.lassi|mango.sticky|galaktoboureko|pancakes|souffle|pan.de.muerto|alfajor|apple.pie|crepe|crêpe|croissant|affogato|biscotti|rollitos dulces';
    
    const vegOverride = 'carpaccio di manzo|esquites con tu|soupe.*oignon|tortellini in brodo|ensalada caprese|mac & cheese';
    const meatOverride = 'panang curry|wonton|lo mein|tom kha|kra pao|satay|larb|khao soi|dim sum|okonomiyaki|meatloaf|pato pek';
    const dessertOverride = 'galletas de lim|rollitos dulces';
    const notDessertOverride = 'clam chowder|mac & cheese|meatloaf|pato pek';

    // 2. Obtener todas las recetas
    const [rows] = await pool.query('SELECT id, title, ingredients, image_url FROM recipes');
    
    let stats = { carnes: 0, mariscos: 0, postres: 0, vegetariano: 0, sin_categoria: 0 };

    for (const r of rows) {
      const title = r.title ? (typeof r.title === 'object' ? JSON.stringify(r.title) : String(r.title)).toLowerCase() : '';
      const ingredients = r.ingredients ? (typeof r.ingredients === 'object' ? JSON.stringify(r.ingredients) : String(r.ingredients)).toLowerCase() : '';
      const imageUrl = r.image_url ? String(r.image_url).toLowerCase() : '';

      const contentCheck = (regexStr) => {
        const re = new RegExp(regexStr, 'i');
        return re.test(title) || re.test(ingredients) || re.test(imageUrl);
      };

      const notContentCheck = (regexStr) => !contentCheck(regexStr);
      const titleMatch = (regexStr) => new RegExp(regexStr, 'i').test(title);

      let category_type = null;

      if (titleMatch(meatOverride) || (contentCheck(meatLand) && notContentCheck(meatSea) && notContentCheck(dessertTerms) && !titleMatch(vegOverride))) {
        category_type = 'carnes';
        stats.carnes++;
      } else if (contentCheck(meatSea) && !titleMatch(meatOverride) && !titleMatch(dessertOverride)) {
        category_type = 'mariscos';
        stats.mariscos++;
      } else if ((contentCheck(dessertTerms) || titleMatch(dessertOverride)) && !titleMatch(notDessertOverride)) {
        category_type = 'postres';
        stats.postres++;
      } else if (titleMatch(vegOverride) || (notContentCheck(meatLand) && notContentCheck(meatSea) && notContentCheck(dessertTerms))) {
        category_type = 'vegetariano';
        stats.vegetariano++;
      } else {
        // En teoría no debería caer aquí, pero por si acaso.
        stats.sin_categoria++;
      }

      if (category_type) {
        await pool.query('UPDATE recipes SET category_type = ? WHERE id = ?', [category_type, r.id]);
      }
    }

    console.log('Migración completada con éxito.');
    console.log('Resultados de la clasificación:');
    console.log(`- Carnes: ${stats.carnes}`);
    console.log(`- Mariscos: ${stats.mariscos}`);
    console.log(`- Postres: ${stats.postres}`);
    console.log(`- Vegetariano: ${stats.vegetariano}`);
    console.log(`- Sin categoría asignada: ${stats.sin_categoria}`);

  } catch (error) {
    console.error('Error durante la migración:', error);
  } finally {
    process.exit(0);
  }
}

migrateCategories();
