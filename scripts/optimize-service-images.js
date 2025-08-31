import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../src/assets/optimized');
const outputDir = path.join(__dirname, '../src/assets/optimized');

// Target file sizes for different image types
const targetSizes = {
  'Public Health.webp': { width: 800, quality: 80 },
  'Political Economy.webp': { width: 800, quality: 80 },
  'Health and Environment.webp': { width: 800, quality: 80 }
};

async function optimizeImage(filename) {
  const inputPath = path.join(inputDir, filename);
  const outputPath = path.join(outputDir, `optimized_${filename}`);
  
  if (!fs.existsSync(inputPath)) {
    console.log(`File not found: ${filename}`);
    return;
  }

  try {
    const stats = fs.statSync(inputPath);
    const originalSize = (stats.size / 1024 / 1024).toFixed(2);
    
    console.log(`Optimizing ${filename} (${originalSize}MB)...`);
    
    const config = targetSizes[filename] || { width: 800, quality: 80 };
    
    await sharp(inputPath)
      .resize(config.width, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ 
        quality: config.quality,
        effort: 6
      })
      .toFile(outputPath);
    
    const newStats = fs.statSync(outputPath);
    const newSize = (newStats.size / 1024 / 1024).toFixed(2);
    
    console.log(`✓ ${filename}: ${originalSize}MB → ${newSize}MB (${((1 - newStats.size / stats.size) * 100).toFixed(1)}% reduction)`);
    
    // Replace original with optimized version
    fs.unlinkSync(inputPath);
    fs.renameSync(outputPath, inputPath);
    
  } catch (error) {
    console.error(`Error optimizing ${filename}:`, error.message);
  }
}

async function optimizeAllImages() {
  console.log('Starting image optimization...\n');
  
  const files = Object.keys(targetSizes);
  
  for (const file of files) {
    await optimizeImage(file);
  }
  
  console.log('\nImage optimization complete!');
}

// Run the optimization
optimizeAllImages().catch(console.error);
