import React from 'react';
import { IconName } from './index.js';
export { IconMeta, getIconMeta, iconKeys } from './index.js';

interface IconProps extends React.SVGAttributes<SVGSVGElement> {
    /** Icon key (e.g. "map-pin", "github"). Use IconName for autocomplete. */
    name: IconName | string;
    size?: number;
    /** Override SVG content (e.g. after loading from export) */
    svg?: string;
}
/**
 * Renders an Open Icon by key. SVG must be present in svgContent (run npm run export-svgs then generate-svg-registry).
 * Forwards ref to the underlying SVG element.
 */
declare const Icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;

export { Icon, IconName, type IconProps, Icon as default };
