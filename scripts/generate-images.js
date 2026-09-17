import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const sourceDir = path.join(rootDir, 'src', 'assets', 'image-sources');
const outputDir = path.join(rootDir, 'src', 'assets', 'generated');
const publicBrandDir = path.join(rootDir, 'public', 'images', 'brand');
const cachePath = path.join(outputDir, '.image-cache.json');
const pipelineVersion = '3';

const photoWidths = [320, 480, 640, 800, 960, 1280, 1600];
const chartWidths = [320, 640, 960, 1280, 1920];
const logoWidths = [64, 128, 256, 512];

const photos = [
  ['hero', 'hero.jpg', 'Healthcare professionals in a meeting', 'Photo by National Cancer Institute on Unsplash', '50% 50%'],
  ['about', 'medical-data.jpg', 'Doctor examining medical data', 'Photo by National Cancer Institute on Unsplash', '50% 50%'],
  ['healthcareTeam', 'healthcare-team.jpg', 'Healthcare team discussing patient data', 'Photo by National Cancer Institute on Unsplash', '50% 50%'],
  ['community', 'community-workers.jpg', 'Community health workers in action', 'Photo attribution retained from the previous site image registry', '50% 50%'],
  ['laboratory', 'laboratory.jpg', 'Scientists conducting public health research', 'Photo by National Cancer Institute on Unsplash', '50% 50%'],
  ['monitoring', 'Monitoring and Evaluation Image.webp', 'Health monitoring and evaluation', 'NPH Solutions', '50% 50%'],
  ['dataAnalysis', 'Data analytics and system.webp', 'Healthcare data analysis', 'NPH Solutions', '50% 50%'],
  ['communityHealth', 'Health promotion.webp', 'Community health education session', 'NPH Solutions', '50% 50%'],
  ['healthAndEnvironment', 'Health and Environment.webp', 'Health and environment', 'NPH Solutions', '50% 50%'],
  ['politicalEconomy', 'Political Economy.webp', 'Political economy of health and development', 'NPH Solutions', '50% 50%'],
  ['publicHealth', 'Public Health.webp', 'Public health research', 'NPH Solutions', '50% 50%'],
].map(([id, file, alt, credit, objectPosition]) => ({
  id,
  input: path.join(sourceDir, 'photos', file),
  alt,
  credit,
  objectPosition,
  role: 'photo',
  widths: id === 'healthAndEnvironment' ? photoWidths.filter((width) => width <= 1280) : photoWidths,
  encoding: id === 'healthAndEnvironment'
    ? { avif: 42, webp: 35, jpeg: 66 }
    : id === 'politicalEconomy'
      ? { avif: 52, webp: 74, jpeg: 78 }
      : undefined,
}));

const charts = [
  ['mddEastAfrica', 'MDD in East Africa 17082025 chart.png', 'Minimum dietary diversity in East Africa'],
  ['violenceAgainstWomen', 'violence against women.png', 'Physical or sexual violence against women by intimate partner'],
  ['under5Mortality', 'Under 5 mortality in SSA.png', 'Under 5 child mortality rates in Sub-Saharan Africa'],
  ['fertilityRate', 'Trend of FR in Uganda.png', 'Trend of fertility rate in Uganda'],
  ['severeWastingMaternalEducation', 'Severe wasting vs maternal education.png', 'Severe wasting among children by maternal education level'],
  ['severeWastingChildren', 'Severe wasting in less than 5 year olds.png', 'Severe wasting among children less than 5 years'],
  ['severeWastingInfants', 'Severe wasting 0 to 5 months.png', 'Severe wasting in infants 0 to 5 months'],
  ['severeAnaemia', 'Severe anaemic in children less than 5 years.png', 'Severe anaemia among children less than 5 years'],
  ['openDefecation', 'Open defecation.png', 'Open defecation in Sub-Saharan Africa'],
  ['obesity', 'Obesity in Uganda.png', 'Obesity prevalence in Uganda'],
  ['neonatalMortality', 'NMR.png', 'Neonatal mortality rate in Sub-Saharan Africa'],
  ['mtct', 'MTCT.png', 'Mother to child transmission of HIV'],
  ['medianAgeSexualIntercourse', 'Median age of first sexual intercourse.png', 'Median age of first sexual intercourse'],
  ['itn', 'ITN.png', 'Use of insecticide-treated mosquito nets'],
  ['fgm', 'FGM.png', 'Female genital mutilation'],
  ['facilityBirths', 'Facility Births.png', 'Facility-based births'],
  ['exclusiveBreastfeeding', 'exclusive breastfeeding.png', 'Exclusive breastfeeding'],
  ['electricity', 'Electricity in Uganda.png', 'Household access to electricity in Uganda'],
  ['womenEducation', 'Educating women in SSA.png', 'Women education in Sub-Saharan Africa'],
  ['pregnancyDeath', 'death related to pregnancy.png', 'Death during pregnancy and childbirth'],
  ['csUganda', 'CS in Uganda.png', 'Caesarean section rates in Uganda'],
  ['csSsa', 'CS in SSA.png', 'Caesarean section prevalence in Sub-Saharan Africa'],
  ['contraceptiveMethods', 'contraceptive methods.png', 'Contraceptive methods used by women'],
  ['bottleFeeding', 'Bottle with a nipple.png', 'Bottle feeding with a nipple'],
  ['basicAntigens', '8 basic antigens.png', 'Eight basic antigens vaccination'],
].map(([id, file, alt]) => ({
  id,
  input: path.join(sourceDir, 'charts', file),
  alt,
  credit: 'NPH Solutions',
  role: 'chart',
  widths: chartWidths,
}));

const assets = [
  ...photos,
  ...charts,
  {
    id: 'companyLogo',
    input: path.join(sourceDir, 'brand', 'company-logo.jpg'),
    alt: 'NPH Solutions logo',
    credit: 'NPH Solutions',
    role: 'logo',
    widths: logoWidths,
  },
];

const normalizePath = (value) => value.split(path.sep).join('/');
const safeId = (value) => value.replace(/[^a-zA-Z0-9]/g, '_');
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

async function readCache() {
  try {
    return JSON.parse(await fs.readFile(cachePath, 'utf8'));
  } catch {
    return {};
  }
}

async function writeIfChanged(filePath, contents) {
  const buffer = Buffer.isBuffer(contents) ? contents : Buffer.from(contents);
  try {
    const current = await fs.readFile(filePath);
    if (current.equals(buffer)) return false;
  } catch {
    // The file will be created below.
  }
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.tmp`;
  await fs.writeFile(temporaryPath, buffer);
  await fs.rename(temporaryPath, filePath);
  return true;
}

async function transform({ input, output, width, format, role, sourceHash, cache, encoding }) {
  const options = { pipelineVersion, width, format, role, encoding };
  const cacheKey = sha256(`${sourceHash}:${JSON.stringify(options)}`);
  const relativeOutput = normalizePath(path.relative(rootDir, output));
  try {
    if (cache[relativeOutput] === cacheKey) {
      const stat = await fs.stat(output);
      return { bytes: stat.size, changed: false };
    }
  } catch {
    // Missing cached output is regenerated.
  }

  let operation = sharp(input).rotate().resize({
    width,
    fit: 'inside',
    withoutEnlargement: true,
  });
  if (format === 'avif') operation = operation.avif({ quality: encoding?.avif ?? 55, effort: 4, chromaSubsampling: '4:2:0' });
  if (format === 'webp') operation = operation.webp(role === 'chart' ? { lossless: true, effort: 5 } : { quality: encoding?.webp ?? 78, effort: 5 });
  if (format === 'jpeg') operation = operation.jpeg({ quality: encoding?.jpeg ?? 82, progressive: true, mozjpeg: true });
  if (format === 'png') operation = operation.png({ compressionLevel: 9, adaptiveFiltering: true });

  const result = await operation.toBuffer();
  const changed = await writeIfChanged(output, result);
  cache[relativeOutput] = cacheKey;
  return { bytes: result.length, changed };
}

async function buildAsset(asset, cache, imports, report) {
  const source = await fs.readFile(asset.input);
  const sourceHash = sha256(source);
  const metadata = await sharp(source).metadata();
  if (!metadata.width || !metadata.height) throw new Error(`Invalid image dimensions: ${asset.input}`);

  const widths = [...new Set(asset.widths.filter((width) => width <= metadata.width))];
  if (!widths.includes(metadata.width) && metadata.width < Math.max(...asset.widths)) widths.push(metadata.width);
  widths.sort((a, b) => a - b);
  if (widths.length === 0) widths.push(metadata.width);

  const formats = asset.role === 'chart' ? ['webp'] : asset.role === 'logo' ? ['webp'] : ['avif', 'webp'];
  const fallbackFormat = asset.role === 'chart' || asset.role === 'logo' ? 'png' : 'jpeg';
  const variants = {};
  let changedCount = 0;

  for (const format of [...formats, fallbackFormat]) {
    variants[format] = [];
    for (const width of widths) {
      if (format === fallbackFormat && asset.role === 'chart' && width !== widths.at(-1)) continue;
      const extension = format === 'jpeg' ? 'jpg' : format;
      const relativeFile = `${asset.role}s/${asset.id}-${width}.${extension}`;
      const output = path.join(outputDir, relativeFile);
      const result = await transform({ input: asset.input, output, width, format, role: asset.role, sourceHash, cache, encoding: asset.encoding });
      changedCount += Number(result.changed);
      const importName = `asset_${safeId(asset.id)}_${width}_${format}`;
      imports.push({ name: importName, path: `./${normalizePath(relativeFile)}` });
      variants[format].push({ importName, width, bytes: result.bytes, file: normalizePath(path.relative(rootDir, output)) });
      report.push({ id: asset.id, role: asset.role, format, width, bytes: result.bytes, file: normalizePath(path.relative(rootDir, output)) });
    }
  }

  const sourceSets = formats.map((format) => ({ type: `image/${format}`, variants: variants[format] }));
  const fallback = variants[fallbackFormat].at(-1);
  return {
    changedCount,
    manifest: {
      ...asset,
      width: metadata.width,
      height: metadata.height,
      sourceSets,
      fallback: { ...fallback, type: `image/${fallbackFormat}` },
      fallbackVariants: variants[fallbackFormat],
    },
  };
}

function renderManifest(manifests, imports) {
  const importLines = imports
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ name, path: importPath }) => `import ${name} from '${importPath}';`)
    .join('\n');
  const entries = manifests.map((asset) => {
    const sources = asset.sourceSets.map((source) => `      {\n        type: '${source.type}',\n        candidates: [\n${source.variants.map((item) => `          { src: ${item.importName}, width: ${item.width}, bytes: ${item.bytes} },`).join('\n')}\n        ],\n      },`).join('\n');
    const fallbackCandidates = asset.fallbackVariants.map((item) => `      { src: ${item.importName}, width: ${item.width}, bytes: ${item.bytes} },`).join('\n');
    return `  ${asset.id}: {\n    id: '${asset.id}',\n    alt: ${JSON.stringify(asset.alt)},\n    credit: ${JSON.stringify(asset.credit)},\n    role: '${asset.role}',\n    width: ${asset.width},\n    height: ${asset.height},\n    fallback: { src: ${asset.fallback.importName}, width: ${asset.fallback.width}, bytes: ${asset.fallback.bytes}, type: '${asset.fallback.type}' },\n    fallbackCandidates: [\n${fallbackCandidates}\n    ],\n    sources: [\n${sources}\n    ],${asset.objectPosition ? `\n    objectPosition: '${asset.objectPosition}',` : ''}\n  },`;
  }).join('\n');
  return `/* This file is generated by scripts/generate-images.js. Do not edit manually. */\nimport type { ResponsiveImageAsset } from '../image-types';\n${importLines}\n\nexport const generatedImages = {\n${entries}\n} as const satisfies Record<string, ResponsiveImageAsset>;\n`;
}

async function generatePublicBrand(sourceHash, cache, report) {
  const logo = path.join(sourceDir, 'brand', 'company-logo.jpg');
  for (const size of [192, 512]) {
    const output = path.join(publicBrandDir, `icon-${size}.png`);
    const cacheKey = sha256(`${sourceHash}:public-icon:${size}:${pipelineVersion}`);
    const relativeOutput = normalizePath(path.relative(rootDir, output));
    let bytes;
    try {
      if (cache[relativeOutput] === cacheKey) bytes = (await fs.stat(output)).size;
    } catch { /* regenerate below */ }
    if (!bytes) {
      const data = await sharp(logo).rotate().resize(size, size, { fit: 'contain', background: '#ffffff' }).png({ compressionLevel: 9 }).toBuffer();
      await writeIfChanged(output, data);
      cache[relativeOutput] = cacheKey;
      bytes = data.length;
    }
    report.push({ id: `icon-${size}`, role: 'logo', format: 'png', width: size, bytes, file: relativeOutput });
  }

  const socialOutput = path.join(publicBrandDir, 'social-preview.jpg');
  const socialKey = sha256(`${sourceHash}:social-preview:1200x630:${pipelineVersion}`);
  const socialRelative = normalizePath(path.relative(rootDir, socialOutput));
  let socialBytes;
  try {
    if (cache[socialRelative] === socialKey) socialBytes = (await fs.stat(socialOutput)).size;
  } catch { /* regenerate below */ }
  if (!socialBytes) {
    const logoLayer = await sharp(logo).rotate().resize(430, 390, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toBuffer();
    const background = {
      create: { width: 1200, height: 630, channels: 3, background: '#e2f6e5' },
    };
    const data = await sharp(background).composite([{ input: logoLayer, gravity: 'centre' }]).jpeg({ quality: 88, progressive: true, mozjpeg: true }).toBuffer();
    await writeIfChanged(socialOutput, data);
    cache[socialRelative] = socialKey;
    socialBytes = data.length;
  }
  report.push({ id: 'social-preview', role: 'logo', format: 'jpeg', width: 1200, bytes: socialBytes, file: socialRelative });
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });
  const cache = await readCache();
  const imports = [];
  const report = [];
  const manifests = [];
  let changedCount = 0;

  for (const asset of assets) {
    const result = await buildAsset(asset, cache, imports, report);
    manifests.push(result.manifest);
    changedCount += result.changedCount;
  }

  const logoSource = await fs.readFile(path.join(sourceDir, 'brand', 'company-logo.jpg'));
  await generatePublicBrand(sha256(logoSource), cache, report);

  await writeIfChanged(path.join(outputDir, 'image-manifest.ts'), renderManifest(manifests, imports));
  await writeIfChanged(path.join(outputDir, 'image-report.json'), `${JSON.stringify({ generatedAt: 'deterministic', pipelineVersion, assets: report }, null, 2)}\n`);
  await writeIfChanged(cachePath, `${JSON.stringify(cache, null, 2)}\n`);
  console.log(`[images] ${assets.length} source images; ${report.length} variants; ${changedCount} generated files changed.`);
}

main().catch((error) => {
  console.error('[images] Generation failed:', error);
  process.exitCode = 1;
});
