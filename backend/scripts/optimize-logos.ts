import sharp from 'sharp';
import path from 'path';

const frontendImagesDir = path.resolve(__dirname, '..', '..', 'frontend', 'public', 'images');
const mainLogoPath = path.join(frontendImagesDir, 'main-logo.png');
const logoVer2Path = path.join(frontendImagesDir, 'logo-ver2.png');

async function optimize() {
  console.log('Optimizing main-logo.png...');
  const mainBuffer = await sharp(mainLogoPath)
    .resize({ width: 320, withoutEnlargement: true })
    .png({ quality: 90, compressionLevel: 9 })
    .toBuffer();
  await sharp(mainBuffer).toFile(mainLogoPath);

  console.log('Optimizing logo-ver2.png...');
  const ver2Buffer = await sharp(logoVer2Path)
    .resize({ width: 320, withoutEnlargement: true })
    .png({ quality: 90, compressionLevel: 9 })
    .toBuffer();
  await sharp(ver2Buffer).toFile(logoVer2Path);

  console.log('Logos successfully optimized!');
}

optimize().catch(console.error);
