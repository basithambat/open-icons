/**
 * Icon registry: icon key → Figma node ID (for export) and category.
 * SVG content is in icons-svg.generated.ts (run scripts/export-svgs-from-figma.js then generate-svg-registry.js).
 */
export interface IconMeta {
  iconKey: string;
  categoryName: string;
  categoryNodeId: string;
  nodeId: string;
  variantName: string;
}

import iconsList from './canonical-icons.json';
const icons = (iconsList as { icons: IconMeta[] }).icons;

export const iconRegistry: Map<string, IconMeta> = new Map(
  icons.map((icon) => [icon.iconKey, icon])
);

export const iconKeys: string[] = icons.map((i) => i.iconKey);

export const categories = [...new Set(icons.map((i) => i.categoryName))].sort();

export function getIconMeta(key: string): IconMeta | undefined {
  return iconRegistry.get(key);
}

export function getIconsByCategory(category: string): IconMeta[] {
  return icons.filter((i) => i.categoryName === category);
}
