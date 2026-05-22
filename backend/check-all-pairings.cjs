const fs = require('fs');
const path = require('path');

const recipes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db-recipes.json'), 'utf8'));

console.log("=== ALL RECIPES AND THEIR IMAGES ===");
recipes.forEach(r => {
  const titleStr = r.title.es || r.title.en || r.title;
  console.log(`[ID: ${r.id}] ${titleStr} (${r.category_country})`);
  console.log(`  Category: ${r.category_type} | Image: ${r.image_url}`);
  console.log("-----------------------------------------");
});
