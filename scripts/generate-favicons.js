const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const sourceFile = path.join(__dirname, '../public/logo-icon.jpg');
const publicDir = path.join(__dirname, '../public');

const targets = [
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'icon-48x48.png', size: 48 },
  { name: 'icon-96x96.png', size: 96 },
  { name: 'icon-144x144.png', size: 144 },
  { name: 'icon-192x192.png', size: 192 },
  { name: 'apple-touch-icon.png', size: 180 },
];

async function generate() {
  console.log('Starting favicon generation from:', sourceFile);
  
  if (!fs.existsSync(sourceFile)) {
    console.error('Source file does not exist:', sourceFile);
    process.exit(1);
  }

  for (const target of targets) {
    const dest = path.join(publicDir, target.name);
    await sharp(sourceFile)
      .resize(target.size, target.size)
      .toFormat('png')
      .toFile(dest);
    console.log(`Successfully generated ${target.name} (${target.size}x${target.size})`);
  }
  
  console.log('Favicon generation completed successfully.');
}

generate().catch(err => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});
