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

/* After */
.container {
  font-size: 1rem;          /* ✅ 17px rounded to 16px, converted to rem */   
  line-height: 1.5rem;      /* ✅ 26px rounded to 24px, converted to rem */
  letter-spacing: 0.25rem;  /* ✅ 0.26rem rounded to 0.25rem */   
  width: 1rem;              /* ✅ 18px rounded to 16px, converted to rem */
  padding: 8px;             /* ✅ 10px rounded to 8px */
  margin: 24px;             /* ✅ 1.5rem converted to px */
  border: 1px;              /* ✅ 0.0625rem converted to px */
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

The configuration is defined in a `px-rem-optimizer.config.ts` file. The schema for the configuration is validated using **AJV**.

### Example `px-rem-optimizer.config.ts`:

```ts
const config = {
  baseFontSize: 16,
  targetPath: './src',
  excludePaths: [],
  roundStrategy: {
    onTie: 'up',
    mode: 'on',
  },
  transformers: [(value: string) => value.replace(/to-rem\((-?\d+(\.\d+)?(px|rem))\)/g, (_, target) => target)],
  properties: {
    'width': 'rem',
    'min-width': 'rem',
    'max-width': 'rem',
    'height': 'rem',
    'min-height': 'rem',
    'max-height': 'rem',
    'padding': 'px',
    'padding-top': 'px',
    'padding-right': 'px',
    'padding-bottom': 'px',
    'padding-left': 'px',
    'margin': 'px',
    'margin-top': 'px',
    'margin-right': 'px',
    'margin-bottom': 'px',
    'margin-left': 'px',
    'border': 'px',
    'border-top': 'px',
    'border-right': 'px',
    'border-bottom': 'px',
    'border-left': 'px',
    'border-width': 'px',
    'border-radius': 'px',
    'outline': 'px',
    'outline-width': 'px',
    'box-shadow': 'px',
    'text-shadow': 'px',
    'font-size': 'px',
    'line-height': 'rem',
    'letter-spacing': 'rem',
    'word-spacing': 'rem',
    'text-indent': 'rem',
    'flex-basis': 'rem',
    'gap': 'rem',
    'column-gap': 'rem',
    'row-gap': 'rem',
    'grid-template-columns': 'px',
    'grid-template-rows': 'rem',
    'grid-auto-columns': 'rem',
    'grid-auto-rows': 'rem',
    'background-position': 'px',
    'background-size': 'px',
    'border-spacing': 'px',
    'translate': 'rem',
    'translateX': 'rem',
    'translateY': 'rem',
    'perspective': 'rem',
    'transform-origin': 'rem',
    'list-style-position': 'rem',
    'list-style-image': 'rem',
    'clip-path': 'rem',
    'mask-position': 'px',
    'mask-size': 'px',
    'object-position': 'rem',
    'scroll-margin': 'rem',
    'scroll-margin-top': 'rem',
    'scroll-margin-right': 'rem',
    'scroll-margin-bottom': 'rem',
    'scroll-margin-left': 'rem',
    'scroll-padding': 'rem',
    'scroll-padding-top': 'rem',
    'scroll-padding-right': 'rem',
    'scroll-padding-bottom': 'rem',
    'scroll-padding-left': 'rem',
    'shape-margin': 'rem',
    'stroke-width': 'px',
    'column-rule': 'px',
  },
  sizes: {
    0: { px: '--space-px-0', rem: '--space-rem-0' },
    1: { px: '--space-px-025', rem: '--space-rem-025' },
    2: { px: '--space-px-05', rem: '--space-rem-05' },
    4: { px: '--space-px-1', rem: '--space-rem-1' },
    8: { px: '--space-px-2', rem: '--space-rem-2' },
    12: { px: '--space-px-3', rem: '--space-rem-3' },
    16: { px: '--space-px-4', rem: '--space-rem-4' },
    20: { px: '--space-px-5', rem: '--space-rem-5' },
    24: { px: '--space-px-6', rem: '--space-rem-6' },
    28: { px: '--space-px-7', rem: '--space-rem-7' },
    32: { px: '--space-px-8', rem: '--space-rem-8' },
    36: { px: '--space-px-9', rem: '--space-rem-9' },
    40: { px: '--space-px-10', rem: '--space-rem-10' },
    44: { px: '--space-px-11', rem: '--space-rem-11' },
    48: { px: '--space-px-12', rem: '--space-rem-12' },
    64: { px: '--space-px-16', rem: '--space-rem-16' },
    80: { px: '--space-px-20', rem: '--space-rem-20' },
    96: { px: '--space-px-24', rem: '--space-rem-24' },
    128: { px: '--space-px-32', rem: '--space-rem-32' },
    240: { px: '--space-px-60', rem: '--space-rem-60' },
    280: { px: '--space-px-70', rem: '--space-rem-70' },
    320: { px: '--space-px-80', rem: '--space-rem-80' },
    480: { px: '--space-px-120', rem: '--space-rem-120' },
    640: { px: '--space-px-160', rem: '--space-rem-160' },
    960: { px: '--space-px-240', rem: '--space-rem-240' },
    1200: { px: '--space-px-300', rem: '--space-rem-300' },
    1440: { px: '--space-px-360', rem: '--space-rem-360' },
  },
}

export default config
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
