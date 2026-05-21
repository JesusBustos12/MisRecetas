const fs = require('fs');
const path = require('path');

const recipes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db-recipes.json'), 'utf8'));

console.log("=== DUPLICATE IMAGES ===");
const imageGroups = {};
recipes.forEach(r => {
  if (r.image_url) {
    if (!imageGroups[r.image_url]) imageGroups[r.image_url] = [];
    imageGroups[r.image_url].push(r);
  }
});

let duplicateFound = false;
Object.entries(imageGroups).forEach(([url, list]) => {
  if (list.length > 1) {
    duplicateFound = true;
    console.log(`\nImage URL used ${list.length} times: ${url}`);
    list.forEach(r => {
      console.log(`  - [ID: ${r.id}] ${r.title.es || r.title.en || r.title} (${r.category_type} - ${r.category_country})`);
    });
  }
});
if (!duplicateFound) {
  console.log("No duplicate images found!");
}

console.log("\n=== RECIPES IN 'MEAT' CATEGORY ===");
const meatRecipes = recipes.filter(r => r.category_type === 'meat');
meatRecipes.forEach(r => {
  const titleStr = r.title.es || r.title.en || r.title;
  console.log(`- [ID: ${r.id}] ${titleStr} (${r.category_country})`);
});

console.log("\n=== RECIPES IN 'SEAFOOD' CATEGORY ===");
const seafoodRecipes = recipes.filter(r => r.category_type === 'seafood');
seafoodRecipes.forEach(r => {
  const titleStr = r.title.es || r.title.en || r.title;
  console.log(`- [ID: ${r.id}] ${titleStr} (${r.category_country})`);
});

console.log("\n=== RECIPES IN 'VEGETARIAN' CATEGORY ===");
const vegRecipes = recipes.filter(r => r.category_type === 'vegetarian');
vegRecipes.forEach(r => {
  const titleStr = r.title.es || r.title.en || r.title;
  console.log(`- [ID: ${r.id}] ${titleStr} (${r.category_country})`);
});

console.log("\n=== RECIPES IN 'DESSERTS' CATEGORY ===");
const dessertRecipes = recipes.filter(r => r.category_type === 'desserts');
dessertRecipes.forEach(r => {
  const titleStr = r.title.es || r.title.en || r.title;
  console.log(`- [ID: ${r.id}] ${titleStr} (${r.category_country})`);
});
