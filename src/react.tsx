import React from 'react';
import { getIconMeta, type IconMeta } from './icon-registry';
import { svgContent, type IconName } from './icons-svg.generated';

export type { IconMeta, IconName };
export { iconKeys, getIconMeta } from './icon-registry';

function sanitizeIconKey(key: string): string {
  return key.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
}

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Icon key (e.g. "map-pin", "github"). Use IconName for autocomplete. */
  name: IconName | string;
  size?: number;
  /** Override SVG content (e.g. after loading from export) */
  svg?: string;
}

function IconInner(
  { name, size = 24, svg: svgOverride, className, ...rest }: IconProps,
  ref: React.Ref<SVGSVGElement>
): React.ReactElement {
  const content = svgOverride ?? svgContent[name] ?? svgContent[sanitizeIconKey(name)];
  const meta = getIconMeta(name);

  if (!content) {
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.warn(`[open-icons] Icon "${name}" not found. Check name or run generate-svg-registry.`);
    }
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        data-icon={name}
        data-missing="true"
        aria-hidden
        {...rest}
      >
        <title>{meta?.iconKey ?? name}</title>
        <rect width="24" height="24" rx="2" fill="currentColor" opacity={0.2} />
      </svg>
    );
  }

  const innerMatch = content.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
  const inner = innerMatch ? innerMatch[1] : content;

  const ariaLabel = rest['aria-label'];
  const isDecorative = ariaLabel == null || ariaLabel === '';

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      data-icon={name}
      {...rest}
      role={isDecorative ? undefined : 'img'}
      aria-label={isDecorative ? undefined : ariaLabel}
      aria-hidden={isDecorative ? true : undefined}
    >
      <g dangerouslySetInnerHTML={{ __html: inner }} />
    </svg>
  );
}

/**
 * Renders an Open Icon by key. SVG must be present in svgContent (run npm run export-svgs then generate-svg-registry).
 * Forwards ref to the underlying SVG element.
 */
export const Icon = React.forwardRef(IconInner);
Icon.displayName = 'Icon';

export default Icon;
