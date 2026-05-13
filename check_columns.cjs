const mysql = require('mysql2/promise');
async function checkColumns() {
    const conn = await mysql.createConnection({ host: 'localhost', user: 'recetas_admin', password: 'recetas123', database: 'MisRecetas' });
    const [rows] = await conn.query("SHOW COLUMNS FROM recipes");
    console.log(JSON.stringify(rows, null, 2));
    await conn.end();
}
checkColumns();
