import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const SITE_ORIGIN = 'https://nph-solutions.com';
const dataBriefsPath = path.join(projectRoot, 'src', 'data', 'dataBriefs.ts');
const sitemapPath = path.join(projectRoot, 'public', 'sitemap.xml');

const today = new Date().toISOString().slice(0, 10);

const staticRoutes = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/about', changefreq: 'monthly', priority: '0.8' },
  { loc: '/services', changefreq: 'monthly', priority: '0.9' },
  { loc: '/data', changefreq: 'daily', priority: '0.9' },
  { loc: '/data-explorer', changefreq: 'weekly', priority: '0.8' },
  { loc: '/publications', changefreq: 'weekly', priority: '0.7' },
  { loc: '/thematic-areas', changefreq: 'monthly', priority: '0.7' },
  { loc: '/contact', changefreq: 'monthly', priority: '0.6' },
];

function parseBriefs(source) {
  const briefs = [];
  const objectRegex = /\{\s*id:\s*'([^']+)'[\s\S]*?date:\s*'([^']+)'[\s\S]*?\}/g;
  let match;
  while ((match = objectRegex.exec(source)) !== null) {
    const [, id, date] = match;
    const ts = Date.parse(date);
    const lastmod = Number.isNaN(ts)
      ? today
      : new Date(ts).toISOString().slice(0, 10);
    briefs.push({ id, lastmod });
  }
  return briefs;
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSitemap(briefs) {
  const lines = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push(
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">'
  );
  lines.push('');
  lines.push('  <!-- Static routes -->');
  for (const route of staticRoutes) {
    lines.push('  <url>');
    lines.push(`    <loc>${SITE_ORIGIN}${route.loc}</loc>`);
    lines.push(`    <lastmod>${today}</lastmod>`);
    lines.push(`    <changefreq>${route.changefreq}</changefreq>`);
    lines.push(`    <priority>${route.priority}</priority>`);
    lines.push('  </url>');
  }
  lines.push('');
  lines.push(`  <!-- Data Briefs (${briefs.length}) -->`);
  for (const brief of briefs) {
    lines.push('  <url>');
    lines.push(`    <loc>${SITE_ORIGIN}/data-brief/${escapeXml(brief.id)}</loc>`);
    lines.push(`    <lastmod>${brief.lastmod}</lastmod>`);
    lines.push('    <changefreq>monthly</changefreq>');
    lines.push('    <priority>0.7</priority>');
    lines.push('  </url>');
  }
  lines.push('');
  lines.push('</urlset>');
  lines.push('');
  return lines.join('\n');
}

function main() {
  if (!fs.existsSync(dataBriefsPath)) {
    console.error(`[sitemap] dataBriefs source not found at ${dataBriefsPath}`);
    process.exit(1);
  }
  const source = fs.readFileSync(dataBriefsPath, 'utf8');
  const briefs = parseBriefs(source);
  if (briefs.length === 0) {
    console.warn('[sitemap] No data briefs were parsed; sitemap will only contain static routes.');
  }
  const xml = buildSitemap(briefs);
  fs.writeFileSync(sitemapPath, xml, 'utf8');
  console.log(`[sitemap] Wrote ${sitemapPath} with ${staticRoutes.length} static routes and ${briefs.length} data briefs.`);
}

main();
