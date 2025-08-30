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
const imagesDir = path.join(assetsDir, 'images');

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

// Function to get file size in MB
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / (1024 * 1024)).toFixed(2);
}

// Main optimization function
async function optimizeImages() {
  console.log('🖼️  Starting image optimization...\n');

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const largeImages = [];

  // Find all images in assets
  function findImages(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findImages(filePath);
      } else if (imageExtensions.includes(path.extname(file).toLowerCase())) {
        const size = getFileSize(filePath);
        if (parseFloat(size) > 0.5) { // Images larger than 500KB
          largeImages.push({
            path: filePath,
            size: parseFloat(size),
            name: file
          });
        }
      }
    }
  }

  findImages(assetsDir);

  if (largeImages.length === 0) {
    console.log('✅ No large images found to optimize!');
    return;
  }

  console.log(`Found ${largeImages.length} large images to optimize:\n`);

  // Sort by size (largest first)
  largeImages.sort((a, b) => b.size - a.size);

  for (const image of largeImages) {
    console.log(`📁 ${image.name} (${image.size}MB)`);
  }

  console.log('\n🚀 Starting optimization...\n');

  // Create optimized directory
  const optimizedDir = path.join(assetsDir, 'optimized');
  if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir, { recursive: true });
  }

  // Optimize each image
  for (const image of largeImages) {
    const ext = path.extname(image.name).toLowerCase();
    const nameWithoutExt = path.basename(image.name, ext);
    
    // Determine output format and options
    let format = 'webp';
    let quality = 80;
    
    if (ext === '.png') {
      // For PNGs, also create a JPEG version for better compression
      await optimizeImage(image.path, path.join(optimizedDir, `${nameWithoutExt}.webp`), {
        quality: 85,
        format: 'webp'
      });
      await optimizeImage(image.path, path.join(optimizedDir, `${nameWithoutExt}.jpg`), {
        quality: 80,
        format: 'jpeg'
      });
    } else {
      await optimizeImage(image.path, path.join(optimizedDir, `${nameWithoutExt}.webp`), {
        quality,
        format
      });
    }
  }

  console.log('\n📊 Optimization Summary:');
  console.log('Original images:', largeImages.length);
  console.log('Optimized images saved to:', optimizedDir);
  console.log('\n💡 Next steps:');
  console.log('1. Review the optimized images in src/assets/optimized/');
  console.log('2. Replace original images with optimized versions');
  console.log('3. Update import statements to use optimized images');
  console.log('4. Consider using WebP format for better compression');
}

// Run optimization
optimizeImages().catch(console.error);
