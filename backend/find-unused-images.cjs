const fs = require('fs');
const path = require('path');

const recipes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db-recipes.json'), 'utf8'));
const usedImages = new Set(recipes.map(r => r.image_url));

const rootRecipesDir = path.join(__dirname, '..', 'public', 'recipes');
const countries = fs.readdirSync(rootRecipesDir).filter(f => fs.statSync(path.join(rootRecipesDir, f)).isDirectory());

console.log("=== UNUSED IMAGES BY COUNTRY ===");
countries.forEach(country => {
  const dir = path.join(rootRecipesDir, country);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
  console.log(`\nCountry: ${country} (${files.length} images total)`);
  
  let unusedCount = 0;
  files.forEach(file => {
    const relPath = `/recipes/${country}/${file}`;
    if (!usedImages.has(relPath)) {
      console.log(`  - ${relPath}`);
      unusedCount++;
    }
  });
  if (unusedCount === 0) {
    console.log("  No unused images found!");
  }
});
