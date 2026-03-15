# Prompt: How to Use Open Icons in Another Project

Copy the text below and give it to your other agent (or use it as project context).

---

## Context

We have an npm package called **@basithambat/open-icons** that provides 1,080 SVG icons from a Figma file (Open Icons). The package is a local folder at:

**Path:** `"/Users/basith/Documents/Open icons"` (or the path to this repo on the user’s machine)

It is **not** published to npm yet; it is consumed via a **local install** (e.g. `npm install "/path/to/Open icons"` or `"@basithambat/open-icons": "file:../Open icons"` in `package.json`).

---

## What you need to do

1. **Install the package in the target project**
   - In the **target app’s** root (the app that will show the icons), run:
     ```bash
     npm install "/Users/basith/Documents/Open icons"
     ```
   - Or add to the target app’s `package.json` under `dependencies`:
     ```json
     "@basithambat/open-icons": "file:../Open icons"
     ```
     (Adjust the path so it correctly points to the Open Icons folder from the target app’s root.)  
   - Then run `npm install` in the target app.
   - The target project **must** have **React** installed (any version compatible with React 17+); `open-icons` declares React as a peer dependency.

2. **Use the icons in React components**
   - Import the icon component from the **subpath** `@basithambat/open-icons/react` (not from `@basithambat/open-icons`):
     ```tsx
     import { Icon } from '@basithambat/open-icons/react';
     ```
   - Render an icon by **name** (string). There are 1,080 names. Examples: `map-pin`, `globus`, `send`, `phone`, `heart`, `github`, `settings`, `search`, `arrow-right`, `camera-1`, `email-1`, etc.
   - Example usage:
     ```tsx
     <Icon name="map-pin" size={24} />
     <Icon name="globus" size={32} className="text-blue-500" />
     <Icon name="send" size={20} />
     ```
   - **Props:**
     - `name` (string, required): icon key, e.g. `"map-pin"`, `"github"`. Use kebab-case; the package normalizes aliases (e.g. `openai,chatgpt` → `openai-chatgpt`).
     - `size` (number, optional): width and height in pixels. Default is `24`.
     - All other props are passed through to the underlying SVG (e.g. `className`, `style`, `aria-label`, `onClick`). So you can style and make icons accessible like any SVG.

3. **Optional: list or look up icon names**
   - To get all icon names or metadata, import from the **main** entry `@basithambat/open-icons` (not `@basithambat/open-icons/react`):
     ```tsx
     import { iconKeys, getIconMeta, categories } from '@basithambat/open-icons';
     ```
   - `iconKeys`: array of all 1,080 icon name strings.
   - `categories`: array of category names (e.g. `"Location"`, `"Communication"`, `"Gaming"`).
   - `getIconMeta(name)`: returns `{ iconKey, categoryName, categoryNodeId, nodeId, variantName }` for a given icon name, or `undefined` if not found.
   - Use these when you need to build pickers, search, or docs (e.g. autocomplete over `iconKeys`).

---

## Technical details

- **Module format:** ESM only. The package uses `"type": "module"` and exports `./dist/index.js` and `./dist/react.js`. Use in an ESM or bundler-based project (Vite, Next, CRA, etc.); no CommonJS `require()` from this package.
- **Exports:**
  - `open-icons` → registry: `iconKeys`, `categories`, `getIconMeta`, `getIconsByCategory`, `iconRegistry`, `svgContent`, type `IconMeta`.
  - `@basithambat/open-icons/react` → React: `Icon` component, `iconKeys`, `getIconMeta`, types `IconProps`, `IconMeta`.
- **Icon set:** One canonical variant per icon (stroke 2, round join, not filled). All icons are 24×24 in design; use `size` to scale.
- **Styling:** Icons render as inline SVG. Use `className` or `style` to set color (e.g. `currentColor`), size, or other CSS. No built-in Tailwind; the consuming app’s CSS applies.

---

## Summary for the agent

- **Install:** In the **target app**, run `npm install "/Users/basith/Documents/Open icons"` (or use `file:` in `package.json`). Ensure React is installed.
- **Import:** `import { Icon } from '@basithambat/open-icons/react';`
- **Use:** `<Icon name="icon-name" size={24} />` with any of the 1,080 icon names (e.g. `map-pin`, `github`, `send`).
- **Names:** Prefer kebab-case. Full list is in `iconKeys` from `@basithambat/open-icons` if the app needs to enumerate or validate names.

Do not modify the Open Icons package itself unless the user asks to change the icon set or the package API.
