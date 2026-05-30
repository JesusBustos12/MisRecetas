import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const fixes = [
  {
    id: 33,
    name: 'Matcha Mochi Premium',
    ingredients: [
      { es: '200g de harina de arroz glutinoso (mochiko)', en: '200g glutinous rice flour (mochiko)' },
      { es: '3 cucharadas de polvo de matcha', en: '3 tablespoons matcha powder' },
      { es: '¾ taza de agua', en: '¾ cup water' },
      { es: '½ taza de azúcar', en: '½ cup sugar' },
      { es: '150g de pasta de frijol rojo dulce (anko)', en: '150g sweet red bean paste (anko)' },
      { es: 'Almidón de maíz para espolvorear', en: 'Cornstarch for dusting' },
    ],
    steps: [
      { es: 'Mezcla el mochiko, el azúcar y el matcha en un bowl apto para microondas. Agrega el agua y revuelve hasta obtener una masa homogénea sin grumos.', en: 'Mix the mochiko, sugar and matcha in a microwave-safe bowl. Add water and stir until smooth with no lumps.' },
      { es: 'Cubre con plástico y cocina en microondas 2 minutos. Revuelve vigorosamente con espátula húmeda. Repite 1 minuto más hasta que la masa esté elástica y translúcida.', en: 'Cover with plastic wrap and microwave for 2 minutes. Stir vigorously with a wet spatula. Repeat for 1 more minute until the dough is elastic and translucent.' },
      { es: 'Vuelca la masa sobre una superficie generosamente espolvoreada con almidón de maíz. Divídela en 8-10 porciones con las manos enharinadas.', en: 'Turn the dough onto a surface generously dusted with cornstarch. Divide into 8-10 portions with floured hands.' },
      { es: 'Aplana cada porción en un disco, coloca una cucharadita de anko en el centro, pellizca los bordes para sellar y forma una bolita suave. Espolvorea con matcha extra al servir.', en: 'Flatten each portion into a disc, place a teaspoon of anko in the center, pinch edges to seal and form a smooth ball. Dust with extra matcha before serving.' },
    ],
    nutrition: { calories: 180, protein: 3, carbs: 38, fat: 1, fiber: 2, sugar: 18 },
  },
  {
    id: 59,
    name: 'NYC Cheesecake',
    ingredients: [
      { es: '900g de queso crema a temperatura ambiente', en: '900g cream cheese at room temperature' },
      { es: '1 taza de azúcar', en: '1 cup sugar' },
      { es: '5 huevos grandes', en: '5 large eggs' },
      { es: '2 cucharaditas de extracto de vainilla', en: '2 teaspoons vanilla extract' },
      { es: '¼ taza de harina de trigo', en: '¼ cup all-purpose flour' },
      { es: '1 taza de crema agria (sour cream)', en: '1 cup sour cream' },
      { es: '200g de galletas graham trituradas + 80g de mantequilla derretida (base)', en: '200g crushed graham crackers + 80g melted butter (crust)' },
    ],
    steps: [
      { es: 'Mezcla las galletas graham trituradas con la mantequilla derretida. Presiona firmemente en el fondo de un molde desmontable de 23cm. Hornea a 160°C por 10 minutos y reserva.', en: 'Mix crushed graham crackers with melted butter. Press firmly into the bottom of a 9-inch springform pan. Bake at 325°F for 10 minutes and set aside.' },
      { es: 'Bate el queso crema con el azúcar a velocidad media hasta que esté cremoso y sin grumos. Añade los huevos uno por uno, integrando cada uno antes de agregar el siguiente. Incorpora la vainilla.', en: 'Beat cream cheese with sugar at medium speed until creamy and smooth. Add eggs one at a time, fully incorporating each before adding the next. Mix in vanilla.' },
      { es: 'Agrega la harina tamizada y la crema agria, mezclando a velocidad baja solo hasta integrar. No sobrebatas. Vierte sobre la base de galleta.', en: 'Add sifted flour and sour cream, mixing on low speed just until combined. Do not overmix. Pour over the cookie crust.' },
      { es: 'Hornea a 160°C en baño maría por 60-70 minutos hasta que los bordes estén firmes pero el centro aún tiemble ligeramente. Apaga el horno, entreabre la puerta y deja enfriar 1 hora adentro. Refrigera mínimo 4 horas antes de servir.', en: 'Bake at 325°F in a water bath for 60-70 minutes until edges are set but center still jiggles slightly. Turn off oven, crack the door open, and let cool inside for 1 hour. Refrigerate at least 4 hours before serving.' },
    ],
    nutrition: { calories: 420, protein: 8, carbs: 32, fat: 30, fiber: 0, sugar: 24 },
  },
  {
    id: 127,
    name: 'Macarons de Colores',
    ingredients: [
      { es: '100g de harina de almendras fina', en: '100g fine almond flour' },
      { es: '100g de azúcar glass', en: '100g powdered sugar' },
      { es: '2 claras de huevo (75g aprox.)', en: '2 egg whites (about 75g)' },
      { es: '75g de azúcar granulada', en: '75g granulated sugar' },
      { es: 'Colorante en gel del color deseado', en: 'Gel food coloring of choice' },
      { es: '100g de ganache de chocolate o buttercream para relleno', en: '100g chocolate ganache or buttercream for filling' },
    ],
    steps: [
      { es: 'Tamiza juntas la harina de almendras y el azúcar glass dos veces para una textura superfina. Descarta cualquier grumo que quede en el tamiz.', en: 'Sift almond flour and powdered sugar together twice for a superfine texture. Discard any lumps left in the sieve.' },
      { es: 'Bate las claras a velocidad media hasta que estén espumosas. Agrega el azúcar granulada poco a poco mientras subes la velocidad. Bate hasta obtener un merengue firme y brillante con picos rígidos. Añade el colorante.', en: 'Beat egg whites at medium speed until foamy. Gradually add granulated sugar while increasing speed. Beat until you get a firm, glossy meringue with stiff peaks. Add food coloring.' },
      { es: 'Incorpora los secos al merengue con movimientos envolventes (macaronage). Mezcla hasta que la masa fluya como lava: al levantar la espátula debe caer en una cinta continua que se integra en 10 segundos.', en: 'Fold the dry ingredients into the meringue with folding motions (macaronage). Mix until the batter flows like lava: when lifted with a spatula it should fall in a continuous ribbon that settles back in 10 seconds.' },
      { es: 'Coloca en manga pastelera con boquilla redonda. Forma discos de 3cm en charola con tapete de silicón. Golpea la charola contra la mesa para eliminar burbujas. Deja reposar 30-40 min hasta que se forme una costra seca al tacto. Hornea a 150°C por 14 minutos. Rellena con ganache al enfriar.', en: 'Pipe into a piping bag with a round tip. Pipe 3cm discs on a baking sheet lined with a silicone mat. Tap the tray against the counter to remove air bubbles. Rest 30-40 min until a dry shell forms on top. Bake at 300°F for 14 minutes. Fill with ganache once cooled.' },
    ],
    nutrition: { calories: 95, protein: 2, carbs: 14, fat: 4, fiber: 1, sugar: 12 },
  },
];

async function fixFinal() {
  console.log('🔧 CORRECCIÓN FINAL: 3 recetas con contenido incorrecto\n');
  const pool = mysql.createPool({
    host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME, ssl: { rejectUnauthorized: false }
  });
  const conn = await pool.getConnection();

  for (const fix of fixes) {
    await conn.query(
      `UPDATE recipes SET ingredients = ?, steps = ?, nutrition = ? WHERE id = ?`,
      [JSON.stringify(fix.ingredients), JSON.stringify(fix.steps), JSON.stringify(fix.nutrition), fix.id]
    );
    console.log(`✅ ID ${fix.id}: ${fix.name} [${fix.ingredients.length} ings, ${fix.steps.length} pasos]`);
  }

  console.log(`\n🎉 Corrección final completada: ${fixes.length} recetas arregladas`);
  conn.release(); pool.end();
}
fixFinal();
