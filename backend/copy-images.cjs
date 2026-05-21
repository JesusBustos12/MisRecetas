const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\52762\\.gemini\\antigravity-ide\\brain\\46116ea7-3fe9-46c1-a452-49f5653bcff4';
const projectDir = path.join(__dirname, '..');

const mappings = [
  { src: 'italy_chicken_parm_1779402426814.png', dest: 'public/recipes/italy/italy_chicken_parm.png' },
  { src: 'italy_saltimbocca_1779402471251.png', dest: 'public/recipes/italy/italy_saltimbocca.png' },
  { src: 'mexico_tostadas_1779402525786.png', dest: 'public/recipes/mexico/mexico_tostadas.png' },
  { src: 'mexico_sopa_lima_1779402560745.png', dest: 'public/recipes/mexico/mexico_sopa_lima.png' },
  { src: 'japan_sushi_nigiri_1779402592894.png', dest: 'public/recipes/japan/japan_sushi_nigiri.png' },
  { src: 'spain_torrijas_1779402628708.png', dest: 'public/recipes/spain/spain_torrijas.png' },
  { src: 'usa_hotdog_chicago_1779402696186.png', dest: 'public/recipes/usa/usa_hotdog_chicago.png' },
  { src: 'usa_cookies_1779402733552.png', dest: 'public/recipes/usa/usa_cookies.png' },
  { src: 'usa_gumbo_1779402760003.png', dest: 'public/recipes/usa/usa_gumbo.png' },
  { src: 'thailand_noodles_1779402793413.png', dest: 'public/recipes/thailand/thailand_noodles.png' },
  { src: 'thailand_fish_1779402832452.png', dest: 'public/recipes/thailand/thailand_fish.png' },
  { src: 'greece_horiatiki_1779402858073.png', dest: 'public/recipes/greece/greece_horiatiki.png' },
  { src: 'greece_fakes_1779402888805.png', dest: 'public/recipes/greece/greece_fakes.png' }
];

console.log('Copying images from artifact dir to public folder...');

mappings.forEach(m => {
  const fullSrc = path.join(srcDir, m.src);
  const fullDest = path.join(projectDir, m.dest);
  const destDir = path.dirname(fullDest);

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  if (fs.existsSync(fullSrc)) {
    fs.copyFileSync(fullSrc, fullDest);
    console.log(`Copied ${m.src} to ${m.dest}`);
  } else {
    console.error(`Source file not found: ${fullSrc}`);
  }
});

console.log('Copying done!');
