const fs = require('fs');
const path = require('path');

const recipes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db-recipes.json'), 'utf8'));

console.log("=== CHECKING IMAGE AVAILABILITY ON DISK ===");
let missingCount = 0;

recipes.forEach(r => {
  if (!r.image_url) {
    console.log(`[ID: ${r.id}] ${r.title.es || r.title.en || r.title} has NO image_url!`);
    return;
  }

  // Convert web path (e.g. /recipes/italy/file.png) to local file path
  // The public directory is in the parent folder
  const localPath = path.join(__dirname, '..', 'public', r.image_url);
  
  if (!fs.existsSync(localPath)) {
    console.log(`[ID: ${r.id}] 404 NOT FOUND: ${r.image_url} (Recipe: ${r.title.es || r.title.en || r.title})`);
    missingCount++;
  }
});

console.log(`\nScan complete. Found ${missingCount} missing image file(s).`);
