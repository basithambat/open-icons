import {
  getIconMeta,
  iconKeys,
  svgContent
} from "./chunk-J37QPDAO.js";

// src/react.tsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function sanitizeIconKey(key) {
  return key.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
}
function IconInner({ name, size = 24, svg: svgOverride, className, ...rest }, ref) {
  const content = svgOverride ?? svgContent[name] ?? svgContent[sanitizeIconKey(name)];
  const meta = getIconMeta(name);
  if (!content) {
    if (typeof process !== "undefined" && process.env.NODE_ENV === "development") {
      console.warn(`[open-icons] Icon "${name}" not found. Check name or run generate-svg-registry.`);
    }
    return /* @__PURE__ */ jsxs(
      "svg",
      {
        ref,
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        className,
        "data-icon": name,
        "data-missing": "true",
        "aria-hidden": true,
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
  const ariaLabel = rest["aria-label"];
  const isDecorative = ariaLabel == null || ariaLabel === "";
  return /* @__PURE__ */ jsx(
    "svg",
    {
      ref,
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      className,
      "data-icon": name,
      ...rest,
      role: isDecorative ? void 0 : "img",
      "aria-label": isDecorative ? void 0 : ariaLabel,
      "aria-hidden": isDecorative ? true : void 0,
      children: /* @__PURE__ */ jsx("g", { dangerouslySetInnerHTML: { __html: inner } })
    }
  );
}
var Icon = React.forwardRef(IconInner);
Icon.displayName = "Icon";
var react_default = Icon;
export {
  Icon,
  react_default as default,
  getIconMeta,
  iconKeys
};
//# sourceMappingURL=react.js.map