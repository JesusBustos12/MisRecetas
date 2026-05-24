const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function actualizarAvatars() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'recetas_admin',
        password: 'recetas123',
        database: 'MisRecetas'
    });

    console.log('--- ACTUALIZANDO AVATARS DE USUARIOS ---');

    const avatarMapping = {
        1: "/users/admin.png",
        2: "/users/frida.png",
        3: "/users/marco.png",
        4: "/users/ferran.png",
        5: "/users/julia.png",
        6: "/users/kenji.png",
        7: "/users/somsak.png",
        8: "/users/anita.png",
        9: "/users/john.png",
        10: "/users/lin.png"
    };

    for (const [id, avatarUrl] of Object.entries(avatarMapping)) {
        await conn.query("UPDATE users SET avatar_url = ? WHERE id = ?", [avatarUrl, id]);
        console.log(`[UPDATE] Usuario ID ${id} -> ${avatarUrl}`);
    }

    // Actualizar el archivo de backup total para que sea consistente
    const backupPath = path.join(process.cwd(), 'Recetas', 'BACKUP_SISTEMA_TOTAL.json');
    if (fs.existsSync(backupPath)) {
        const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
        backup.users = backup.users.map(u => {
            if (avatarMapping[u.id]) {
                return { ...u, avatar_url: avatarMapping[u.id] };
            }
            return u;
        });
        fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2), 'utf8');
        console.log('[BACKUP] Archivo BACKUP_SISTEMA_TOTAL.json actualizado con nuevos avatars.');
    }

    console.log('--- PROCESO FINALIZADO ---');
    await conn.end();
}

actualizarAvatars().catch(console.error);
