<!-- ⚠️ This README has been generated from the file(s) "blueprint.md" ⚠️-->
[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#css-unit-transformer-utility---px-rem-optimizer)

# ➤ CSS Unit Transformer Utility - px-rem-optimizer

🔧 Unprecise lengths in your stylesheet?  
📏 Wrong unit based on your preferences?  
💡 Need to replace lengths with CSS/SCSS variables?  

```css
/* Before */
.container {
  font-size: 17px;          /* ❌ Not 4px-based, incorrect unit */
  line-height: 26px;        /* ❌ Not 4px-based, incorrect unit */
  letter-spacing: 0.26rem;  /* ❌ Not 4px-based, incorrect unit */
  width: 18px;              /* ❌ Not 4px-based, incorrect unit */
  padding: 10px;            /* ❌ Not 4px-based */
  margin: 1.5rem;           /* ❌ Incorrect unit */
  border: 0.0625rem;        /* ❌ Incorrect unit */
}

/* Applies Unit Conversion */
.container {
  font-size: 1.0625rem;     /* ✅ 17px converted to rem */
  line-height: 1.625rem;    /* ✅ 26px converted to rem */
  letter-spacing: 0.26rem;  /* ✅ No change, already in rem */
  width: 1.125rem;          /* ✅ 18px converted to rem */
  padding: 0.625rem;        /* ✅ 10px converted to rem */
  margin: 24px;             /* ✅ No change, already correct */
  border: 1px;              /* ✅ 0.0625rem converted to px */
}

/* Applies Rounding */
.container {
  font-size: 1rem;          /* ✅ 17px rounded to 16px */
  line-height: 1.5rem;      /* ✅ 26px rounded to 24px */
  letter-spacing: 0.25rem;  /* ✅ 0.26rem rounded to 0.25rem */
  width: 1rem;              /* ✅ 18px rounded to 16px */
  padding: 8px;             /* ✅ 10px rounded to 8px */
  margin: 1.5rem;           /* ✅ No change, already in rem */
  border: 1px;              /* ✅ No rounding needed */
}

/* Applies Variable Usage */
.container {
  font-size: var(--space-4);          /* ✅ Using variable for 1rem */
  line-height: var(--space-6);        /* ✅ Using variable for 1.5rem */
  letter-spacing: var(--space-025);   /* ✅ Using variable for 0.25rem */
  width: var(--space-4);              /* ✅ Using variable for 1rem */
  padding: var(--space-2);            /* ✅ Using variable for 8px */
  margin: var(--space-24);            /* ✅ Using variable for 1.5rem */
  border: var(--space-1);             /* ✅ Using variable for 1px */
}
```

[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#features)

## ➤ Features

- **Unit conversion**: Transform values between `px` and `rem` or other units.
- **Custom rules**: Define your own matching rules for CSS units.
- **Flexible configuration**: Supports rounding options and custom size mappings.
- **Replace hard-coded lengths**: Replace fixed-length values with CSS/SCSS variables.
- **Complex value transformation**: Handle and transform CSS properties with multiple length values.
- **Preserve formatting**: Retains the original formatting, including spaces, newlines, and comments, in your CSS.


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#configuration)

## ➤ Configuration

The configuration is defined in a `px-rem-optimizer.config.ts` file.

### Example `px-rem-optimizer.config.ts`:

```js
const config = {
  "baseFontSize": 16,
  "targetPath": ".",
  "excludePaths": ["node_modules", "dist"],
  "targetExtensions": ["css", "scss", "sass", "less"],
  "roundStrategy": {
    "onTie": 'up',
    "mode": 'on'
  },
  "getGenericVariableName": (sizeInPx) => {
    return `--space-${sizeInPx/4}`;
  },
  "transformers": [
    (value) => someStringTrasformer(value)
  ],
  "properties": {
    "font-size": { 
      "unit": "px",
      "transform": true,
      "convert": true,
      "round": false,
    },
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
  ],
}

export default config;
```

In the `sizes` section, you can define mappings from hard-coded lengths to CSS/SCSS variables. When the utility transforms the file, it will replace any matching length with the corresponding variable.


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#usage)

## ➤ Usage

No installation is required. You can run the utility directly using `npx`. Simply place your `px-rem-optimizer.config.ts` file in the same folder where you are executing the command, and the utility will use it as the configuration.

### Example Command

```bash
npx px-rem-optimizer@latest [file|folder]
```

Replace `[file|folder]` with the path to the CSS file or folder you want to transform.


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#contributing)

## ➤ Contributing

Feel free to open issues or submit pull requests for enhancements and bug fixes.


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#license)

## ➤ License

MIT License
