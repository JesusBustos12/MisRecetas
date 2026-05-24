const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function exportarDatosFinales() {
    console.log('⏳ Conectando a la base de datos local para extraer tu versión final...');
    // Conexión a la base de datos local
    const conn = await mysql.createConnection({ 
        host: 'localhost', 
        user: 'recetas_admin', 
        password: 'recetas123', 
        database: 'MisRecetas' 
    });
    
    // Obtener todas las recetas, usuarios, comentarios y favoritos
    const [recipes] = await conn.query("SELECT * FROM recipes");
    const [users] = await conn.query("SELECT * FROM users");
    const [comments] = await conn.query("SELECT * FROM comments");
    const [favorites] = await conn.query("SELECT * FROM favorites");

    console.log(`✅ ¡Datos extraídos! Recetas encontradas: ${recipes.length}`);

    const fullBackup = {
        recipes: recipes.map(r => ({
            ...r,
            title: typeof r.title === 'string' ? JSON.parse(r.title) : r.title,
            description: typeof r.description === 'string' ? JSON.parse(r.description) : r.description,
            ingredients: typeof r.ingredients === 'string' ? JSON.parse(r.ingredients) : r.ingredients,
            steps: typeof r.steps === 'string' ? JSON.parse(r.steps) : r.steps,
            nutrition: typeof r.nutrition === 'string' && r.nutrition ? JSON.parse(r.nutrition) : r.nutrition
        })),
        users,
        comments,
        favorites
    };

    // Guardar el archivo en la misma carpeta donde se ejecuta el script para que sea fácil de encontrar
    const outputPath = path.join(__dirname, 'DATOS_FINALES_A_MIGRAR.json');
    fs.writeFileSync(outputPath, JSON.stringify(fullBackup, null, 2), 'utf8');

    console.log('\n🎉 ======================================================== 🎉');
    console.log('   ¡ARCHIVO DE DATOS CREADO CON ÉXITO!');
    console.log(`   Ruta del archivo: ${outputPath}`);
    console.log('   Ahora, por favor COPIA este archivo DATOS_FINALES_A_MIGRAR.json');
    console.log('   y pégalo en la carpeta "Recetas" de tu proyecto desplegado.');
    console.log('🎉 ======================================================== 🎉');
    
    await conn.end();
}

exportarDatosFinales().catch(error => {
    console.error('❌ Error al exportar los datos:', error);
});
