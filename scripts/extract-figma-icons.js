#!/usr/bin/env node
/**
 * Extracts icon structure from Figma metadata XML files.
 * Each file should contain the output of get_metadata for one category node.
 *
 * Usage:
 *   node extract-figma-icons.js [metadata-dir]
 *
 * metadata-dir: folder containing .txt files with Figma metadata XML (default: ../figma-metadata)
 * Output: writes icons-manifest.json and canonical-icons.json to the project root
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const METADATA_DIR = process.argv[2] || path.join(__dirname, '../figma-metadata');
const OUT_DIR = path.join(__dirname, '..');

// Prefer "filled=off, stroke=2, radius=0, join=round" as canonical variant
const CANONICAL_VARIANT = 'filled=off, stroke=2, radius=0, join=round';
const VARIANT_NAME_REGEX = /^filled=(on|off),\s*stroke=/;

function parseMetadataFile(content) {
  const lines = content.split('\n');
  let categoryId = null;
  let categoryName = null;
  const iconTypes = [];

  // First line: root frame (category)
  const rootMatch = lines[0].match(/<frame\s+id="([^"]+)"\s+name="([^"]+)"/);
  if (rootMatch) {
    categoryId = rootMatch[1];
    categoryName = rootMatch[2].replace(/&amp;/g, '&');
  }

  let currentIconType = null;
  for (let j = 1; j < lines.length; j++) {
    const line = lines[j];
    const frameMatch = line.match(/^\s*<frame\s+id="([^"]+)"\s+name="([^"]+)"/);
    const symbolMatch = line.match(/^\s*<symbol\s+id="([^"]+)"\s+name="([^"]+)"/);

    if (frameMatch) {
      if (currentIconType && currentIconType.variants.length > 0) {
        iconTypes.push(currentIconType);
      }
      const frameName = frameMatch[2].replace(/&amp;/g, '&');
      currentIconType = {
        frameId: frameMatch[1],
        name: frameName,
        key: frameName.split(',')[0].trim().replace(/\s+/g, '-'),
        variants: [],
      };
    } else if (symbolMatch) {
      const variantName = symbolMatch[2].replace(/&amp;/g, '&');
      const isVariant = VARIANT_NAME_REGEX.test(variantName);
      if (currentIconType && isVariant) {
        currentIconType.variants.push({ nodeId: symbolMatch[1], variantName });
      } else if (currentIconType && !isVariant) {
        // Standalone icon (e.g. Social Media: figma, github) - each symbol is its own icon type
        if (currentIconType.variants.length > 0) iconTypes.push(currentIconType);
        const key = variantName.split(',')[0].trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '') || variantName;
        currentIconType = {
          frameId: null,
          name: variantName,
          key: key.toLowerCase(),
          variants: [{ nodeId: symbolMatch[1], variantName }],
        };
      } else if (!currentIconType) {
        // Top-level symbol (e.g. under "icons" frame with no variant pattern)
        const key = variantName.split(',')[0].trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '') || variantName;
        iconTypes.push({
          frameId: null,
          name: variantName,
          key: key.toLowerCase(),
          variants: [{ nodeId: symbolMatch[1], variantName }],
        });
      }
    }
  }
  if (currentIconType && currentIconType.variants.length > 0) {
    iconTypes.push(currentIconType);
  }

  return {
    categoryId,
    categoryName,
    iconTypes,
  };
}

function main() {
  let files;
  try {
    files = fs.readdirSync(METADATA_DIR).filter((f) => f.endsWith('.txt'));
  } catch (e) {
    console.error('Cannot read metadata dir:', METADATA_DIR, e.message);
    process.exit(1);
  }

  if (files.length === 0) {
    console.error('No .txt files in', METADATA_DIR);
    process.exit(1);
  }

  const categories = [];
  const canonicalList = []; // { iconKey, categoryName, nodeId }

  for (const file of files) {
    const filePath = path.join(METADATA_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = parseMetadataFile(content);
    if (!parsed.categoryId) continue;

    const category = {
      nodeId: parsed.categoryId,
      name: parsed.categoryName,
      iconTypes: parsed.iconTypes.map((it) => ({
        name: it.name,
        key: it.key,
        frameId: it.frameId,
        variantCount: it.variants.length,
        variants: it.variants.map((v) => ({ nodeId: v.nodeId, variantName: v.variantName })),
      })),
    };
    categories.push(category);

    for (const it of parsed.iconTypes) {
      const canonical = it.variants.find((v) => v.variantName === CANONICAL_VARIANT);
      const nodeId = canonical ? canonical.nodeId : it.variants[0]?.nodeId;
      if (nodeId) {
        canonicalList.push({
          iconKey: it.key,
          categoryName: parsed.categoryName,
          categoryNodeId: parsed.categoryId,
          nodeId,
          variantName: canonical?.variantName || it.variants[0].variantName,
        });
      }
    }
  }

  const manifest = {
    source: 'Figma Open Icons metadata',
    extractedAt: new Date().toISOString(),
    categories: categories.map((c) => ({
      nodeId: c.nodeId,
      name: c.name,
      iconCount: c.iconTypes.length,
      iconTypes: c.iconTypes.map((it) => ({
        key: it.key,
        name: it.name,
        variantCount: it.variantCount,
      })),
    })),
    totalIconTypes: canonicalList.length,
    totalVariants: categories.reduce((sum, c) => sum + c.iconTypes.reduce((s, it) => s + it.variantCount, 0), 0),
  };

  const manifestPath = path.join(OUT_DIR, 'icons-manifest.json');
  const canonicalPath = path.join(OUT_DIR, 'canonical-icons.json');

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  fs.writeFileSync(canonicalPath, JSON.stringify({ canonicalVariant: CANONICAL_VARIANT, icons: canonicalList }, null, 2));
  const srcCanonical = path.join(OUT_DIR, 'src', 'canonical-icons.json');
  fs.copyFileSync(canonicalPath, srcCanonical);

  console.log('Wrote', manifestPath);
  console.log('Wrote', canonicalPath);
  console.log('Copied to', srcCanonical);
  console.log('Categories:', categories.length);
  console.log('Unique icon types:', canonicalList.length);
  console.log('Total variant symbols:', manifest.totalVariants);
}

main();
