import React from 'react';
export { I as IconMeta, g as getIconMeta, i as iconKeys } from './icon-registry-BVHyNp4F.js';

interface IconProps extends React.SVGAttributes<SVGSVGElement> {
    name: string;
    size?: number;
    /** Override SVG content (e.g. after loading from export) */
    svg?: string;
}
/**
 * Renders an Open Icon by key. SVG must be present in svgContent (run npm run export-svgs then generate-svg-registry).
 */
declare function Icon({ name, size, svg: svgOverride, className, ...rest }: IconProps): React.ReactElement;

export { Icon, type IconProps, Icon as default };
