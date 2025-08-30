import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if sharp is installed
let sharp;
try {
  sharp = (await import('sharp')).default;
} catch (error) {
  console.log('Installing sharp for image optimization...');
  execSync('npm install --save-dev sharp', { stdio: 'inherit' });
  sharp = (await import('sharp')).default;
}

const assetsDir = path.join(__dirname, '../src/assets');
const servicesDir = path.join(assetsDir, 'images/services');
const optimizedDir = path.join(assetsDir, 'optimized');

// Ensure optimized directory exists
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}

// Function to optimize images
async function optimizeImage(inputPath, outputPath, options = {}) {
  const {
    width = null,
    height = null,
    quality = 80,
    format = 'webp'
  } = options;

  try {
    let pipeline = sharp(inputPath);

    if (width || height) {
      pipeline = pipeline.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    if (format === 'webp') {
      pipeline = pipeline.webp({ quality });
    } else if (format === 'jpeg') {
      pipeline = pipeline.jpeg({ quality });
    } else if (format === 'png') {
      pipeline = pipeline.png({ quality });
    }

    await pipeline.toFile(outputPath);
    console.log(`✅ Optimized: ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ Failed to optimize ${inputPath}:`, error.message);
  }
}

// Service images to optimize
const serviceImages = [
  'Data analytics and system.jpg',
  'Health system .png',
  'Health promotion.png',
  'Health and Environment.jpg',
  'Political Economy.jpg',
  'Public Health.jpg',
  'Monitoring and Evaluation Image.png'
];

async function optimizeServiceImages() {
  console.log('🖼️  Optimizing service images...\n');

  for (const imageName of serviceImages) {
    const inputPath = path.join(servicesDir, imageName);
    
    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  Image not found: ${imageName}`);
      continue;
    }

    const ext = path.extname(imageName).toLowerCase();
    const nameWithoutExt = path.basename(imageName, ext);
    
    // Create WebP version
    await optimizeImage(inputPath, path.join(optimizedDir, `${nameWithoutExt}.webp`), {
      quality: 85,
      format: 'webp'
    });
  }

  console.log('\n✅ Service images optimization complete!');
}

// Run optimization
optimizeServiceImages().catch(console.error);
