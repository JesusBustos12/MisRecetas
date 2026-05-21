const fs = require('fs');
const path = require('path');

const files = [
  'public/recipes/italy/italy_chicken_parm.png',
  'public/recipes/italy/italy_saltimbocca.png',
  'public/recipes/mexico/mexico_tostadas.png',
  'public/recipes/mexico/mexico_sopa_lima.png',
  'public/recipes/japan/japan_sushi_nigiri.png',
  'public/recipes/spain/spain_torrijas.png',
  'public/recipes/usa/usa_hotdog_chicago.png',
  'public/recipes/usa/usa_cookies.png',
  'public/recipes/usa/usa_gumbo.png',
  'public/recipes/thailand/thailand_noodles.png',
  'public/recipes/thailand/thailand_fish.png',
  'public/recipes/greece/greece_horiatiki.png',
  'public/recipes/greece/greece_fakes.png'
];

console.log("=== CHECKING COPIES ===");
let allExist = true;
files.forEach(f => {
  const fullPath = path.join(__dirname, '..', f);
  const exists = fs.existsSync(fullPath);
  console.log(`- ${f}: ${exists ? "EXISTS" : "MISSING"}`);
  if (!exists) allExist = false;
});
console.log(`\nAll files exist: ${allExist}`);
