const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputSvg = path.join(__dirname, '../client/public/favicon.svg');
const outDir = path.join(__dirname, '../client/public');

async function generate() {
  try {
    await sharp(inputSvg)
      .resize(192, 192)
      .toFile(path.join(outDir, 'icon-192x192.png'));
    console.log('Generated icon-192x192.png');

    await sharp(inputSvg)
      .resize(512, 512)
      .toFile(path.join(outDir, 'icon-512x512.png'));
    console.log('Generated icon-512x512.png');
    
    await sharp(inputSvg)
      .resize(180, 180)
      .toFile(path.join(outDir, 'apple-touch-icon.png'));
    console.log('Generated apple-touch-icon.png');
  } catch (err) {
    console.error(err);
  }
}

generate();
