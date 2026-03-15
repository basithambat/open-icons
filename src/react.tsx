import React from 'react';
import { getIconMeta, iconKeys, type IconMeta } from './icon-registry';
import { svgContent } from './icons-svg.generated';

export type { IconMeta };
export { iconKeys, getIconMeta } from './icon-registry';

function sanitizeIconKey(key: string): string {
  return key.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
}

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  name: string;
  size?: number;
  /** Override SVG content (e.g. after loading from export) */
  svg?: string;
}

/**
 * Renders an Open Icon by key. SVG must be present in svgContent (run npm run export-svgs then generate-svg-registry).
 */
export function Icon({ name, size = 24, svg: svgOverride, className, ...rest }: IconProps): React.ReactElement {
  const content = svgOverride ?? svgContent[name] ?? svgContent[sanitizeIconKey(name)];
  const meta = getIconMeta(name);

  if (!content) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        data-icon={name}
        data-missing="true"
        {...rest}
      >
        <title>{meta?.iconKey ?? name}</title>
        <rect width="24" height="24" rx="2" fill="currentColor" opacity={0.2} />
      </svg>
    );
  }

  const innerMatch = content.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
  const inner = innerMatch ? innerMatch[1] : content;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      data-icon={name}
      role="img"
      aria-label={meta?.iconKey ?? name}
      {...rest}
    >
      <g dangerouslySetInnerHTML={{ __html: inner }} />
    </svg>
  );
}

export default Icon;
