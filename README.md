# Open Icons

Icons from [Open Icons (Figma)](https://www.figma.com/design/CPjqRJKTFGDskJHa3vZzvS/Open-Icons--Copy-), as an **npm package** with React components and SVG export.

## Using in another project

### 1. Install the package

**From the local folder** (e.g. while developing):

```bash
cd /path/to/your-app
npm install /path/to/Open\ icons
```

Or in `package.json`:

```json
"dependencies": {
  "@basithambat/open-icons": "file:../Open icons"
}
```

**From GitHub Packages** (after you publish):

```bash
# Ensure .npmrc has: @basithambat:registry=https://npm.pkg.github.com
npm install @basithambat/open-icons
```

Your app must have **React** installed (peer dependency).

### 2. Use the icons

```tsx
import { Icon } from '@basithambat/open-icons/react';

// Basic usage
<Icon name="map-pin" size={24} />
<Icon name="globus" size={32} />

// With CSS / Tailwind
<Icon name="send" size={20} className="text-blue-500" />

// Pass through SVG props (aria, style, etc.)
<Icon name="heart" size={24} aria-label="Favorite" />
```

### 3. List or look up icons (optional)

```tsx
import { iconKeys, getIconMeta, categories } from '@basithambat/open-icons';

// All icon names (1,080)
console.log(iconKeys);  // ['globus', 'earth', 'map-pin', ...]

// Info for one icon
const meta = getIconMeta('map-pin');
// { iconKey, categoryName, categoryNodeId, nodeId, variantName }

// Category names
console.log(categories);  // ['Location', 'Communication', ...]
```

## Exports

- **`@basithambat/open-icons`** – Registry (`iconKeys`, `categories`, `getIconMeta`, `svgContent`, type `IconName`).
- **`@basithambat/open-icons/react`** – `<Icon name="…" size={24} />`, `iconKeys`, `getIconMeta`, types `IconProps`, `IconName`, `IconMeta`.

## Quality (Lucide-style)

- **Typed icon names** – `IconName` gives autocomplete and type-checking for the `name` prop.
- **currentColor** – SVGs use `currentColor` so icons inherit text color (e.g. `className="text-blue-500"`).
- **Accessibility** – Decorative icons get `aria-hidden`. Use `aria-label` when the icon has meaning.
- **Optional SVGO** – Run `npm run optimize-svgs` before `generate-svg-registry` to shrink SVG size.
- **Ref forwarding** – `<Icon ref={...} />` forwards to the underlying SVG for focus/measurement.
- **Dev warning** – In development, missing icon names log a console warning.
- **Smoke check** – `npm run smoke-check` (or after build) verifies registry and bundle.

## Getting the SVGs (required for rendering)

The package ships with an **empty** SVG set by default. Two ways to populate SVGs:

### Option A: Figma MCP + Figma Desktop (no token)

1. In Cursor, use the Figma MCP to call **get_design_context** for each icon in `src/canonical-icons.json` (use each icon’s `nodeId`). From each response, take the first `http://localhost:3845/assets/…svg` URL and add it to **`figma-desktop-asset-urls.json`** as `"iconKey": "url"`. See `scripts/collect-asset-urls-via-mcp.md`.
2. Open the **Open Icons** Figma file in **Figma Desktop**.
3. Run:

```bash
npm run fetch-from-figma-desktop
npm run generate-svg-registry && npm run build
```

Figma Desktop serves assets on localhost; the script fetches them and writes `svg/*.svg`. No API token needed.

### Option B: Figma REST API (token)

1. Create a [Figma personal access token](https://www.figma.com/developers/api#access-tokens).
2. Run:

```bash
FIGMA_ACCESS_TOKEN=your_token npm run export-svgs
npm run build
```

This uses the Figma API to export each canonical icon as SVG into `svg/`, then runs `generate-svg-registry`.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run extract` | Parse `figma-metadata/*.txt` → `icons-manifest.json`, `canonical-icons.json` (and copy to `src/`). |
| `npm run export-svgs` | Fetch SVGs from Figma API into `svg/` and run `generate-svg-registry`. |
| `npm run generate-svg-registry` | Turn `svg/*.svg` into `src/icons-svg.generated.ts` (with `currentColor` and `IconName` type). |
| `npm run optimize-svgs` | Run SVGO on `svg/` to reduce file size (optional; run before `generate-svg-registry`). |
| `npm run build` | Build the package (`dist/`). Runs `smoke-check` after build. |
| `npm run lint` | Run ESLint on `src/`. |
| `npm run lint:fix` | Run ESLint with `--fix`. |
| `npm run smoke-check` | Verify registry and build (icon count, getIconMeta, svgContent). |

## Structure (Figma)

- **Categories** (e.g. Devices & Signals, Gaming) → **icon types** (e.g. `phone`, `map-pin`) → **variants** (filled, stroke, radius, join).
- One **canonical** variant per icon: `filled=off, stroke=2, radius=0, join=round`.
- **Social Media & Brands**: one symbol per brand (e.g. `figma`, `github`), no stroke/fill variants.

## Stats

- **Categories:** 28
- **Unique icon types:** 1,080
- **Total variant symbols:** 32,372

## Repository & publishing

- **GitHub:** https://github.com/basithambat/open-icons  
- **Package name:** `@basithambat/open-icons` (publishes to GitHub Packages).

To push this folder to GitHub:

```bash
cd "/Users/basith/Documents/Open icons"
git init
git remote add origin https://github.com/basithambat/open-icons.git
git add .
git commit -m "Initial commit: open-icons package"
git branch -M main
git push -u origin main
```

To publish to GitHub Packages and install in other projects, see **`PUBLISH-PRIVATE-NPM.md`**.
