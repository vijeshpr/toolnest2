// Generates public/sitemap.xml and public/robots.txt from the tool + category registries.
// Usage: SITE_URL=https://your-domain.com npm run build   (or set VITE_SITE_URL in .env)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

function envFromFile() {
  if (!existsSync('.env')) return {};
  return Object.fromEntries(
    readFileSync('.env', 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/)).filter(Boolean).map((m) => [m[1], m[2]]),
  );
}
const site = (process.env.SITE_URL || process.env.VITE_SITE_URL || envFromFile().VITE_SITE_URL || 'https://www.example.com').replace(/\/$/, '');

const grab = (file, re) => [...readFileSync(file, 'utf8').matchAll(re)].map((m) => m[1]);
const toolSlugs = grab('src/data/tools.ts', /^\s+slug: '([^']+)'/gm);
const catIds = grab('src/data/categories.ts', /\{ id: '([^']+)'/g);

const paths = ['/', '/tools', '/categories', ...toolSlugs.map((s) => `/tools/${s}`), ...catIds.map((c) => `/categories/${c}`), '/about', '/contact', '/privacy-policy', '/terms-of-service'];
const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `  <url><loc>${site}${p === '/' ? '' : p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`;

writeFileSync('public/sitemap.xml', xml);
writeFileSync('public/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
console.log(`Sitemap: ${paths.length} URLs for ${site}${site.includes('example.com') ? '  (placeholder domain: set VITE_SITE_URL!)' : ''}`);
