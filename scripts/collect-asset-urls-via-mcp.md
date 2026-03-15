# Collecting asset URLs via Figma MCP (no token)

The Figma MCP returns design context that includes **localhost URLs** for SVG assets (e.g. `http://localhost:3845/assets/xxx.svg`). Those URLs are served by **Figma Desktop** when the file is open. The Cursor agent can call the MCP but cannot fetch localhost; you run the fetch script on your machine.

## Flow

1. **Agent** (or you in Cursor): For each icon in `src/canonical-icons.json`, call Figma MCP **get_design_context** with the icon’s `nodeId`. From the response text, extract the first SVG URL with:
   - Regex: `http://localhost:3845/assets/[a-f0-9]+\.svg`
   - Or: `const imgVector = "([^"]+)"`
   Add `iconKey -> url` to `figma-desktop-asset-urls.json` (merge with existing).

2. **You**: Open the Open Icons Figma file in **Figma Desktop**, then run:
   ```bash
   node scripts/fetch-from-figma-desktop.js
   ```
   This fetches each URL from localhost:3845 and saves to `svg/{iconKey}.svg`.

3. **You**: Regenerate the bundle and build:
   ```bash
   npm run generate-svg-registry && npm run build
   ```

## Merging new URLs

To add more URLs after more MCP batches, merge into `figma-desktop-asset-urls.json` (object spread or manual edit). The fetch script reads whatever is in that file.

## Why no token?

- **Figma REST API** needs a personal access token and exports from Figma’s servers.
- **Figma MCP** talks to the **Figma Desktop app** on your machine; assets are served on localhost. No token, but Figma Desktop must be open with the file and you must run the fetch script locally.
