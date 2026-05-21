const fs = require('fs');
const path = require('path');

const recipes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db-recipes.json'), 'utf8'));
const mexico = recipes.filter(r => r.category_country === 'mexico');

console.log("=== MEXICO RECIPES ===");
mexico.forEach(r => {
  const titleStr = r.title.es || r.title.en || r.title;
  console.log(`ID: ${r.id} | Title: ${titleStr}`);
  console.log(`  Cat: ${r.category_type} | Image: ${r.image_url}`);
  console.log("------------------------");
});
