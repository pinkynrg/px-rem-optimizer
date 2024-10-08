import { Config } from "../types";

export const config: Config = {
  "baseFontSize": 16,
  "targetPath": ".",
  "excludePaths": ["node_modules", "dist"],
  "targetExtensions": ["css", "scss", "sass", "less"],
  "roundStrategy": {
    "onTie": 'up',
    "mode": 'on'
  },
  "getGenericVariableName": undefined,
  "transformers": [(value: string) => value],
  "properties": {
    "width": { "unit": "rem" },
    "min-width": { "unit": "rem" },
    "max-width": { "unit": "rem" },
    "height": { "unit": "rem" },
    "min-height": { "unit": "rem" },
    "max-height": { "unit": "rem" },
    "padding": { "unit": "px" },
    "padding-top": { "unit": "px" },
    "padding-right": { "unit": "px" },
    "padding-bottom": { "unit": "px" },
    "padding-left": { "unit": "px" },
    "margin": { "unit": "px" },
    "margin-top": { "unit": "px" },
    "margin-right": { "unit": "px" },
    "margin-bottom": { "unit": "px" },
    "margin-left": { "unit": "px" },
    "border": { "unit": "px" },
    "border-top": { "unit": "px" },
    "border-right": { "unit": "px" },
    "border-bottom": { "unit": "px" },
    "border-left": { "unit": "px" },
    "border-width": { "unit": "px" },
    "border-radius": { "unit": "px" },
    "outline": { "unit": "px" },
    "outline-width": { "unit": "px" },
    "box-shadow": { "unit": "px" },
    "text-shadow": { "unit": "px" },
    "font-size": { "unit": "rem" },
    "line-height": { "unit": "rem" },
    "letter-spacing": { "unit": "rem" },
    "word-spacing": { "unit": "rem" },
    "text-indent": { "unit": "rem" },
    "flex-basis": { "unit": "rem" },
    "gap": { "unit": "rem" },
    "column-gap": { "unit": "rem" },
    "row-gap": { "unit": "rem" },
    "grid-template-columns": { "unit": "rem" },
    "grid-template-rows": { "unit": "rem" },
    "grid-auto-columns": { "unit": "rem" },
    "grid-auto-rows": { "unit": "rem" },
    "grid-gap": { "unit": "rem" },
    "background-position": { "unit": "px" },
    "background-size": { "unit": "px" },
    "border-spacing": { "unit": "px" },
    "translate": { "unit": "rem" },
    "translateX": { "unit": "rem" },
    "translateY": { "unit": "rem" },
    "perspective": { "unit": "rem" },
    "transform-origin": { "unit": "rem" },
    "list-style-position": { "unit": "rem" },
    "list-style-image": { "unit": "rem" },
    "clip-path": { "unit": "rem" },
    "mask-position": { "unit": "px" },
    "mask-size": { "unit": "px" },
    "object-position": { "unit": "rem" },
    "scroll-margin": { "unit": "rem" },
    "scroll-margin-top": { "unit": "rem" },
    "scroll-margin-right": { "unit": "rem" },
    "scroll-margin-bottom": { "unit": "rem" },
    "scroll-margin-left": { "unit": "rem" },
    "scroll-padding": { "unit": "rem" },
    "scroll-padding-top": { "unit": "rem" },
    "scroll-padding-right": { "unit": "rem" },
    "scroll-padding-bottom": { "unit": "rem" },
    "scroll-padding-left": { "unit": "rem" },
    "shape-margin": { "unit": "rem" },
    "stroke-width": { "unit": "px" },
    "column-rule": { "unit": "px" },
    "top": { "unit": "px" },
    "right": { "unit": "px" },
    "bottom": { "unit": "px" },
    "left": { "unit": "px" },
    "transform": { "unit": "rem" },
    "flex": { "unit": "rem" },
  },
  "sizesInPixel": [
    0,
    1,
    2,
    4,
    8,
    12,
    16,
    20,
    24,
    28,
    32,
    36,
    40,
    44,
    48,
    64,
    80,
    96,
    112,
    128,
    144,
    160,
    184,
    240,
    280,
    320,
    384,
    480,
    640,
    800,
    960,
    1200,
    1440,
  ]
}