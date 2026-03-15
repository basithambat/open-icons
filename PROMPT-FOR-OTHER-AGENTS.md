# Prompt: How to Use Open Icons in Another Project

Copy the text below and give it to your other agent (or use it as project context).

---

## Context

We have an npm package **@basithambat/open-icons** that provides 1,080 SVG icons from a Figma file (Open Icons). The source lives on GitHub:

- **Repo:** https://github.com/basithambat/open-icons  
- **Install from GitHub** (recommended): the target app can depend on the repo directly so it always gets the latest from `main`.

---

## What you need to do

### 1. Install the package in the target project

**Option A – From GitHub (recommended)**

In the **target app’s** root, run:

```bash
npm install github:basithambat/open-icons
```

Or add to the target app’s `package.json` under `dependencies`:

```json
"@basithambat/open-icons": "github:basithambat/open-icons"
```

Then run `npm install` in the target app.

**Option B – From a local path** (e.g. while developing the icons package)

```bash
npm install "/path/to/Open icons"
```

Or in `package.json`:

```json
"@basithambat/open-icons": "file:../Open icons"
```

The target project **must** have **React** installed (React 17+); `@basithambat/open-icons` declares React as a peer dependency.

### 2. Use the icons in React components

Import the icon component from the **subpath** `@basithambat/open-icons/react`:

```tsx
import { Icon } from '@basithambat/open-icons/react';

<Icon name="map-pin" size={24} />
<Icon name="globus" size={32} className="text-blue-500" />
<Icon name="send" size={20} />
```

- **`name`** (required): icon key in kebab-case. Use type **`IconName`** for autocomplete and type-checking (1,080 names). Examples: `"map-pin"`, `"github"`, `"send"`. The package normalizes aliases (e.g. `openai,chatgpt` → `openai-chatgpt`).
- **`size`** (optional): width and height in pixels. Default is `24`.
- **`ref`**: forwarded to the underlying `<svg>` (for focus, measurement, or animation).
- Other props (e.g. `className`, `style`, `aria-label`, `onClick`) are passed through to the SVG.
- **Accessibility:** Icons are treated as decorative by default (`aria-hidden`). Pass **`aria-label`** when the icon has meaning (e.g. “Submit”, “Close”).
- **Styling:** Icons use `currentColor`; set color via `className` or `style` (e.g. `className="text-blue-500"` or `style={{ color: 'red' }}`).

### 3. Optional: list or look up icon names

Import from the **main** entry `@basithambat/open-icons`:

```tsx
import { iconKeys, getIconMeta, categories, type IconName } from '@basithambat/open-icons';

// All 1,080 icon names (use IconName for strict typing)
const names: IconName[] = iconKeys;

// Metadata for one icon
getIconMeta('map-pin'); // { iconKey, categoryName, categoryNodeId, nodeId, variantName }

// Category names (e.g. "Location", "Communication")
console.log(categories);
```

Use these for pickers, search, or autocomplete over `iconKeys`.

---

## Technical details

- **Module format:** ESM only. Use in an ESM or bundler-based project (Vite, Next, CRA, etc.); no CommonJS `require()` from this package.
- **Exports:**
  - **`@basithambat/open-icons`** → `iconKeys`, `categories`, `getIconMeta`, `getIconsByCategory`, `iconRegistry`, `svgContent`, types `IconMeta`, `IconName`.
  - **`@basithambat/open-icons/react`** → `Icon` component, `iconKeys`, `getIconMeta`, types `IconProps`, `IconMeta`, `IconName`.
- **Icon set:** One canonical variant per icon (stroke 2, round join, not filled). Design size 24×24; use `size` to scale.
- **Styling:** Icons render as inline SVG with `currentColor`; color is inherited from CSS.

---

## Summary for the agent

- **Install from GitHub:** In the target app, run `npm install github:basithambat/open-icons` (or add `"@basithambat/open-icons": "github:basithambat/open-icons"` to `package.json` and run `npm install`). Ensure React is installed.
- **Import:** `import { Icon } from '@basithambat/open-icons/react';` (use `type IconName` for strict icon names).
- **Use:** `<Icon name="icon-name" size={24} />` with any of the 1,080 icon names (e.g. `map-pin`, `github`, `send`). Use `ref` when you need a reference to the SVG. Set `aria-label` for meaningful icons.
- **Names:** Prefer kebab-case. Full list: `iconKeys` from `@basithambat/open-icons`. Type `IconName` gives autocomplete.

Do not modify the Open Icons package itself unless the user asks to change the icon set or the package API.
