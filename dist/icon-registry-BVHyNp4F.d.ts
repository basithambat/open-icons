/**
 * Icon registry: icon key → Figma node ID (for export) and category.
 * SVG content is in icons-svg.generated.ts (run scripts/export-svgs-from-figma.js then generate-svg-registry.js).
 */
interface IconMeta {
    iconKey: string;
    categoryName: string;
    categoryNodeId: string;
    nodeId: string;
    variantName: string;
}
declare const iconRegistry: Map<string, IconMeta>;
declare const iconKeys: string[];
declare const categories: string[];
declare function getIconMeta(key: string): IconMeta | undefined;
declare function getIconsByCategory(category: string): IconMeta[];

export { type IconMeta as I, getIconsByCategory as a, iconRegistry as b, categories as c, getIconMeta as g, iconKeys as i };
