#!/usr/bin/env node
/**
 * Export SVG for each canonical icon from Figma via REST API.
 * Requires FIGMA_ACCESS_TOKEN and the file to be accessible to that token.
 *
 * Usage:
 *   FIGMA_ACCESS_TOKEN=xxx node scripts/export-svgs-from-figma.js
 *
 * File key for "Open Icons - Copy": CPjqRJKTFGDskJHa3vZzvS (from the Figma URL).
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const FIGMA_FILE_KEY = 'CPjqRJKTFGDskJHa3vZzvS';
const BATCH_SIZE = 50;
const SVG_DIR = path.join(__dirname, '../svg');

const token = process.env.FIGMA_ACCESS_TOKEN;
if (!token) {
  console.error('Set FIGMA_ACCESS_TOKEN (personal access token from Figma account settings).');
  process.exit(1);
}

const canonicalPath = path.join(__dirname, '../src/canonical-icons.json');
const canonical = JSON.parse(fs.readFileSync(canonicalPath, 'utf8'));
const icons = canonical.icons;

function get(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = { hostname: u.hostname, path: u.pathname + u.search, headers: { 'X-Figma-Token': token } };
    https.get(opts, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => (res.statusCode === 200 ? resolve(body) : reject(new Error(`${res.statusCode} ${body}`))));
    }).on('error', reject);
  });
}

async function fetchSvg(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => (res.statusCode === 200 ? resolve(body) : reject(new Error(`${res.statusCode}`))));
    }).on('error', reject);
  });
}

async function main() {
  if (!fs.existsSync(SVG_DIR)) fs.mkdirSync(SVG_DIR, { recursive: true });

  let done = 0;
  for (let i = 0; i < icons.length; i += BATCH_SIZE) {
    const batch = icons.slice(i, i + BATCH_SIZE);
    const ids = batch.map((icon) => icon.nodeId).join(',');
    const url = `https://api.figma.com/v1/images/${FIGMA_FILE_KEY}?ids=${ids}&format=svg`;
    try {
      const raw = await get(url);
      const data = JSON.parse(raw);
      if (data.err) {
        console.error('Figma API error:', data.err);
        continue;
      }
      const images = data.images || {};
      for (const icon of batch) {
        const imageUrl = images[icon.nodeId];
        if (!imageUrl) {
          console.warn('No URL for', icon.iconKey, icon.nodeId);
          continue;
        }
        try {
          const svg = await fetchSvg(imageUrl);
          const safeKey = icon.iconKey.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
          fs.writeFileSync(path.join(SVG_DIR, `${safeKey}.svg`), svg);
          done++;
        } catch (e) {
          console.warn('Fetch SVG failed', icon.iconKey, e.message);
        }
      }
      console.log(`Batch ${i / BATCH_SIZE + 1}: ${done} SVGs written`);
    } catch (e) {
      console.error('Batch request failed:', e.message);
    }
  }

  console.log('Total SVGs written:', done);
  console.log('Run: node scripts/generate-svg-registry.js');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
