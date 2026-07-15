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

function createIcoFromPng(pngBuffer, width, height) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type (1 = ICO)
  header.writeUInt16LE(1, 4); // Number of images (1)

  const dir = Buffer.alloc(16);
  dir.writeUInt8(width === 256 ? 0 : width, 0); // Width
  dir.writeUInt8(height === 256 ? 0 : height, 1); // Height
  dir.writeUInt8(0, 2); // Color palette count (0 = no palette)
  dir.writeUInt8(0, 3); // Reserved
  dir.writeUInt16LE(1, 4); // Color planes (1)
  dir.writeUInt16LE(32, 6); // Bits per pixel (32)
  dir.writeUInt32LE(pngBuffer.length, 8); // Image data size
  dir.writeUInt32LE(22, 12); // Image data offset (6 + 16 = 22)

  return Buffer.concat([header, dir, pngBuffer]);
}

async function generate() {
  console.log('Starting favicon generation from:', sourceFile);
  
  if (!fs.existsSync(sourceFile)) {
    console.error('Source file does not exist:', sourceFile);
    process.exit(1);
  }

  // Generate PNG sizes
  for (const target of targets) {
    const dest = path.join(publicDir, target.name);
    await sharp(sourceFile)
      .resize(target.size, target.size)
      .toFormat('png')
      .toFile(dest);
    console.log(`Successfully generated ${target.name} (${target.size}x${target.size})`);
  }

  // Generate a valid ICO file containing a 48x48 PNG of the logo
  console.log('Compiling favicon.ico...');
  const icoPngBuffer = await sharp(sourceFile)
    .resize(48, 48)
    .toFormat('png')
    .toBuffer();
  
  const icoBuffer = createIcoFromPng(icoPngBuffer, 48, 48);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('Successfully generated favicon.ico (48x48 PNG inside ICO)');

  console.log('Favicon generation completed successfully.');
}

generate().catch(err => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});
