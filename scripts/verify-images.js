import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reportPath = path.join(rootDir, 'src', 'assets', 'generated', 'image-report.json');
const errors = [];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(filePath) : [filePath];
  });
}

const sourceImages = walk(path.join(rootDir, 'src', 'assets', 'image-sources'))
  .filter((file) => /\.(avif|jpe?g|png|webp)$/i.test(file));
if (sourceImages.length !== 37) errors.push(`Expected 37 preserved source images, found ${sourceImages.length}`);

if (!fs.existsSync(reportPath)) {
  errors.push('Generated image report is missing. Run npm run images:generate.');
} else {
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  for (const asset of report.assets) {
    const filePath = path.join(rootDir, asset.file);
    if (!fs.existsSync(filePath)) errors.push(`Missing generated asset: ${asset.file}`);
    if (asset.role === 'photo') {
      const limit = asset.width <= 960 ? 200 * 1024 : 300 * 1024;
      if (asset.bytes > limit) errors.push(`Photo budget exceeded: ${asset.file} is ${Math.ceil(asset.bytes / 1024)} KiB`);
    }
  }
}

const codeFiles = [
  'index.html',
  'public/manifest.json',
  'src/assets/images.ts',
  'src/components/seo/SEOHead.tsx',
  'src/pages/Home.tsx',
  'src/pages/DataBriefDetail.tsx',
];
for (const relativeFile of codeFiles) {
  const contents = fs.readFileSync(path.join(rootDir, relativeFile), 'utf8');
  if (contents.includes('/src/assets/Company-logo.jpg')) errors.push(`Invalid production logo URL remains in ${relativeFile}`);
  if (/images\.unsplash\.com/.test(contents) && !relativeFile.includes('images.ts')) errors.push(`Remote Unsplash URL remains in ${relativeFile}`);
}

for (const relativeFile of ['public/images/brand/icon-192.png', 'public/images/brand/icon-512.png', 'public/images/brand/social-preview.jpg']) {
  if (!fs.existsSync(path.join(rootDir, relativeFile))) errors.push(`Missing stable public brand asset: ${relativeFile}`);
}

for (const filePath of walk(path.join(rootDir, 'src')).filter((file) => file.endsWith('.tsx'))) {
  if (path.basename(filePath) === 'OptimizedImage.tsx') continue;
  if (/<img\b/.test(fs.readFileSync(filePath, 'utf8'))) {
    errors.push(`Unmigrated <img> remains in ${path.relative(rootDir, filePath).split(path.sep).join('/')}`);
  }
}

if (errors.length) {
  console.error(`[images] Verification failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log('[images] Generated assets exist, production paths are stable, and photo byte budgets pass.');
