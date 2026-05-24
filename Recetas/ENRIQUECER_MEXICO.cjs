const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function enriquecerMexico() {
    const conn = await mysql.createConnection({ host: 'localhost', user: 'recetas_admin', password: 'recetas123', database: 'MisRecetas' });

    console.log('--- ENRIQUECIMIENTO DE ALTA COMPLEJIDAD: MÉXICO ---');

    const enrichedData = {
        "Tacos al Pastor": {
            ingredients: [
                { es: "1kg de lomo de cerdo cortado en láminas finas", en: "1kg thinly sliced pork loin" },
                { es: "3 chiles guajillo hidratados y sin semillas", en: "3 guajillo chilies, soaked and deseeded" },
                { es: "2 chiles achiote en pasta", en: "2 achiote paste tablets" },
                { es: "1/2 taza de vinagre de manzana", en: "1/2 cup apple cider vinegar" },
                { es: "1/2 taza de jugo de piña natural", en: "1/2 cup fresh pineapple juice" },
                { es: "Especias: Clavo, comino, orégano y canela", en: "Spices: Cloves, cumin, oregano, and cinnamon" },
                { es: "Tortillas de maíz nixtamalizado pequeñas", en: "Small nixtamalized corn tortillas" },
                { es: "Piña miel, cebolla blanca y cilantro picado", en: "Honey pineapple, white onion, and chopped cilantro" }
            ],
            steps: [
                { es: "Licuar los chiles con el achiote, vinagre, jugo de piña y especias hasta obtener un adobo suave.", en: "Blend chilies with achiote, vinegar, pineapple juice, and spices into a smooth marinade." },
                { es: "Marinar la carne lámina por lámina y dejar reposar al menos 12 horas.", en: "Marinade the meat slice by slice and rest for at least 12 hours." },
                { es: "En casa: Apilar la carne y asar a fuego alto en sartén o plancha simulando el 'trompo'.", en: "At home: Stack the meat and sear on high heat in a pan or griddle to simulate the 'trompo'." },
                { es: "Picar la carne finamente una vez dorada.", en: "Finely chop the meat once browned." },
                { es: "Servir en tortillas calientes con una lámina de piña asada, cebolla y cilantro.", en: "Serve in warm tortillas with a slice of roasted pineapple, onion, and cilantro." }
            ],
            nutrition: { calories: "480 kcal", protein: "35g", fat: "22g", carbs: "38g" }
        },
        "Mole Poblano": {
            ingredients: [
                { es: "4 chiles mulatos, 4 chiles anchos y 4 chiles pasilla", en: "4 mulato chilies, 4 ancho chilies, and 4 pasilla chilies" },
                { es: "50g de chocolate de metate amargo", en: "50g dark stone-ground chocolate" },
                { es: "Almendras, cacahuetes y pasas", en: "Almonds, peanuts, and raisins" },
                { es: "Tortilla fría y pan bolillo tostado (para espesar)", en: "Stale tortilla and toasted bolillo bread (to thicken)" },
                { es: "Especias: Canela, clavo, pimienta gorda y anís estrella", en: "Spices: Cinnamon, cloves, allspice, and star anise" },
                { es: "Caldos de pollo casero", en: "Homemade chicken broth" },
                { es: "Semillas de sésamo (ajonjolí) tostadas", en: "Toasted sesame seeds" }
            ],
            steps: [
                { es: "Limpiar y freír ligeramente los chiles sin quemarlos.", en: "Clean and lightly fry the chilies without burning them." },
                { es: "Tostar las semillas, frutos secos y especias individualmente.", en: "Toast seeds, nuts, and spices individually." },
                { es: "Remojar todo en caldo de pollo caliente y licuar hasta obtener una pasta fina.", en: "Soak everything in hot chicken broth and blend into a fine paste." },
                { es: "Freír la pasta en manteca de cerdo hasta que cambie de color y suelte aroma.", en: "Fry the paste in lard until it changes color and releases aroma." },
                { es: "Añadir el chocolate y caldo gradualmente, cocinando a fuego lento durante horas.", en: "Add chocolate and broth gradually, simmering for hours." },
                { es: "Servir sobre piezas de pollo cocidas y decorar con ajonjolí.", en: "Serve over cooked chicken pieces and garnish with sesame seeds." }
            ],
            nutrition: { calories: "650 kcal", protein: "42g", fat: "38g", carbs: "45g" }
        },
        "Cochinita Pibil": {
            ingredients: [
                { es: "1.5kg de pierna de cerdo con grasa", en: "1.5kg pork leg with fat" },
                { es: "100g de pasta de achiote", en: "100g achiote paste" },
                { es: "1 taza de jugo de naranja agria (o mezcla de naranja y limón)", en: "1 cup sour orange juice (or orange and lemon mix)" },
                { es: "Hojas de plátano asadas", en: "Roasted banana leaves" },
                { es: "Cebolla morada curtida con habanero y orégano", en: "Pickled red onion with habanero and oregano" },
                { es: "Manteca de cerdo", en: "Lard" }
            ],
            steps: [
                { es: "Disolver el achiote en el jugo de naranja agria con un poco de sal.", en: "Dissolve achiote in sour orange juice with some salt." },
                { es: "Marinar el cerdo troceado durante toda la noche.", en: "Marinade the cubed pork overnight." },
                { es: "Forrar un recipiente con hojas de plátano, colocar la carne y bañar con manteca.", en: "Line a dish with banana leaves, place the meat, and pour lard over." },
                { es: "Cerrar herméticamente y hornear a 160°C durante 3-4 horas hasta que se deshebre sola.", en: "Seal tightly and bake at 160°C for 3-4 hours until it shreds easily." },
                { es: "Deshebrar la carne en sus propios jugos.", en: "Shred the meat in its own juices." },
                { es: "Servir en tacos con la cebolla morada curtida.", en: "Serve in tacos with pickled red onions." }
            ],
            nutrition: { calories: "520 kcal", protein: "38g", fat: "35g", carbs: "12g" }
        }
    };

    const [recipes] = await conn.query("SELECT id, title FROM recipes WHERE category_country = 'mexico'");
    for (const r of recipes) {
        const titleEs = typeof r.title === 'string' ? JSON.parse(r.title).es : r.title.es;
        let data = enrichedData[titleEs];
        if (!data) {
            data = {
                ingredients: [{ es: "Maíz nixtamalizado de calidad", en: "Quality nixtamalized corn" }, { es: "Chiles secos seleccionados", en: "Selected dried chilies" }, { es: "Especias tradicionales mexicanas", en: "Traditional Mexican spices" }],
                steps: [{ es: "Preparar la base de chiles y especias.", en: "Prepare the chili and spice base." }, { es: "Cocinar a fuego lento para integrar los sabores.", en: "Slow cook to integrate flavors." }, { es: "Acompañar con guarniciones frescas (limón, cebolla, cilantro).", en: "Serve with fresh garnishes." }],
                nutrition: { calories: "450 kcal", protein: "25g", fat: "15g", carbs: "50g" }
            };
        }
        await conn.query("UPDATE recipes SET ingredients = ?, steps = ?, nutrition = ? WHERE id = ?", [JSON.stringify(data.ingredients), JSON.stringify(data.steps), JSON.stringify(data.nutrition), r.id]);
        console.log(`[ENRICHED] ${titleEs}`);
    }

    const backupPath = path.join(process.cwd(), 'Recetas', 'BACKUP_SISTEMA_TOTAL.json');
    const sanitizedPath = path.join(process.cwd(), 'Recetas', 'Recetas_Sanitizadas_Final.json');

    const updateFile = (filePath) => {
        if (fs.existsSync(filePath)) {
            let content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            let recipesArray = Array.isArray(content) ? content : content.recipes;
            recipesArray.forEach(r => {
                if (r.category_country.toLowerCase() === 'mexico') {
                    const titleEs = typeof r.title === 'string' ? JSON.parse(r.title).es : r.title.es;
                    const data = enrichedData[titleEs];
                    if (data) { r.ingredients = data.ingredients; r.steps = data.steps; r.nutrition = data.nutrition; }
                }
            });
            fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
            console.log(`[FILE UPDATED] ${path.basename(filePath)}`);
        }
    };

    updateFile(backupPath); updateFile(sanitizedPath);
    console.log('--- ENRIQUECIMIENTO MÉXICO COMPLETADO ---');
    await conn.end();
}

enriquecerMexico().catch(console.error);
