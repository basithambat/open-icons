import {
  getIconMeta,
  iconKeys,
  svgContent
} from "./chunk-MF3HF4HI.js";

// src/react.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function sanitizeIconKey(key) {
  return key.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
}
function Icon({ name, size = 24, svg: svgOverride, className, ...rest }) {
  const content = svgOverride ?? svgContent[name] ?? svgContent[sanitizeIconKey(name)];
  const meta = getIconMeta(name);
  if (!content) {
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        className,
        "data-icon": name,
        "data-missing": "true",
        ...rest,
        children: [
          /* @__PURE__ */ jsx("title", { children: meta?.iconKey ?? name }),
          /* @__PURE__ */ jsx("rect", { width: "24", height: "24", rx: "2", fill: "currentColor", opacity: 0.2 })
        ]
      }
    );
  }
  const innerMatch = content.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
  const inner = innerMatch ? innerMatch[1] : content;
  return /* @__PURE__ */ jsx(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      className,
      "data-icon": name,
      role: "img",
      "aria-label": meta?.iconKey ?? name,
      ...rest,
      children: /* @__PURE__ */ jsx("g", { dangerouslySetInnerHTML: { __html: inner } })
    }
  );
}
var react_default = Icon;
export {
  Icon,
  react_default as default,
  getIconMeta,
  iconKeys
};
//# sourceMappingURL=react.js.map