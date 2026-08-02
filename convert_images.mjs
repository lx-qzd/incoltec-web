import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const files = ['fondo1.jpg', 'fondo2.jpg', 'fondo3.jpg'];
const dir = './src/assets';

async function processImages() {
  for (const file of files) {
    const inputPath = path.join(dir, file);
    const outputPath = path.join(dir, file.replace('.jpg', '.webp'));
    
    if (fs.existsSync(inputPath)) {
      console.log(`Processing ${file}...`);
      await sharp(inputPath)
        .webp({ quality: 50 })
        .toFile(outputPath);
      console.log(`Created ${outputPath}`);
      // Remove original
      fs.unlinkSync(inputPath);
      console.log(`Deleted ${inputPath}`);
    } else {
      console.log(`File not found: ${inputPath}`);
    }
  }
}

processImages().catch(console.error);
