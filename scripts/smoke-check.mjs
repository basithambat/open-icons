#!/usr/bin/env node
/**
 * Smoke check: verify build output and registry.
 * Run after `npm run build`. Exits 0 on success, 1 on failure.
 */
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function assert(condition, message) {
  if (!condition) {
    console.error('Smoke check failed:', message);
    process.exit(1);
  }
}

// 1. dist exists and has expected entries
const distPath = join(root, 'dist', 'index.js');
assert(existsSync(distPath), 'dist/index.js not found (run npm run build)');

// 2. Dynamic import of built package (ESM)
const pkg = await import(join(root, 'dist/index.js'));

assert(Array.isArray(pkg.iconKeys), 'iconKeys should be an array');
assert(pkg.iconKeys.length > 0, 'iconKeys should not be empty');
assert(typeof pkg.getIconMeta === 'function', 'getIconMeta should be a function');
assert(Array.isArray(pkg.categories), 'categories should be an array');

const meta = pkg.getIconMeta('map-pin');
assert(meta && meta.iconKey === 'map-pin', 'getIconMeta("map-pin") should return metadata');

assert(pkg.svgContent && typeof pkg.svgContent === 'object', 'svgContent should be an object');
const svgCount = Object.keys(pkg.svgContent).length;
assert(svgCount === pkg.iconKeys.length, `svgContent keys (${svgCount}) should match iconKeys length (${pkg.iconKeys.length})`);

console.log('Smoke check OK:', pkg.iconKeys.length, 'icons');
process.exit(0);
