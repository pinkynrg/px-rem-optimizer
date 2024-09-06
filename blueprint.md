# CSS Unit Transformer Utility - px-rem-optimizer

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
## Features

- **Unit conversion**: Transform values between `px` and `rem` or other units.
- **Custom rules**: Define your own matching rules for CSS units.
- **Flexible configuration**: Supports rounding options and custom size mappings.
- **Replace hard-coded lengths**: Replace fixed-length values with CSS/SCSS variables.
- **Complex value transformation**: Handle and transform CSS properties with multiple length values.
- **Preserve formatting**: Retains the original formatting, including spaces, newlines, and comments, in your CSS.

## Configuration

The configuration is defined in a `.px-rem-optimizer` file. The schema for the configuration is validated using **AJV**.

### Example `.px-rem-optimizer`:

```json
{
  "baseFontSize": 16,
  "targetPath": ".",
  "excludePaths": ["node_modules", "dist"],
  "round": {
    "enabled": true,
    "roundUpOnTie": true
  },
  "lengthMatchingRules": {
    "px": "(-?\\d+(\\.\\d+)?|\\.\\d+)px",
    "rem": "(-?\\d+(\\.\\d+)?|\\.\\d+)rem"
  },
  "properties": {
    "width": "rem",
    "min-width": "rem",
    "max-width": "rem",
    "height": "rem",
    "min-height": "rem",
    "max-height": "rem",
    "padding": "px",
    "padding-top": "px",
    "padding-right": "px",
    "padding-bottom": "px",
    "padding-left": "px",
    "margin": "px",
    "margin-top": "px",
    "margin-right": "px",
    "margin-bottom": "px",
    "margin-left": "px",
    "border": "px",
    "border-top": "px",
    "border-right": "px",
    "border-bottom": "px",
    "border-left": "px",
    "border-width": "px",
    "border-radius": "px",
    "outline": "px",
    "outline-width": "px",
    "box-shadow": "px",
    "text-shadow": "px",
    "font-size": "px",
    "line-height": "rem",
    "letter-spacing": "rem",
    "word-spacing": "rem",
    "text-indent": "rem",
    "flex-basis": "rem",
    "gap": "rem",
    "column-gap": "rem",
    "row-gap": "rem",
    "grid-template-columns": "rem",
    "grid-template-rows": "rem",
    "grid-auto-columns": "rem",
    "grid-auto-rows": "rem",
    "background-position": "px",
    "background-size": "px",
    "border-spacing": "px",
    "translate": "rem",
    "translateX": "rem",
    "translateY": "rem",
    "perspective": "rem",
    "transform-origin": "rem",
    "list-style-position": "rem",
    "list-style-image": "rem",
    "clip-path": "rem",
    "mask-position": "px",
    "mask-size": "px",
    "object-position": "rem",
    "scroll-margin": "rem",
    "scroll-margin-top": "rem",
    "scroll-margin-right": "rem",
    "scroll-margin-bottom": "rem",
    "scroll-margin-left": "rem",
    "scroll-padding": "rem",
    "scroll-padding-top": "rem",
    "scroll-padding-right": "rem",
    "scroll-padding-bottom": "rem",
    "scroll-padding-left": "rem",
    "shape-margin": "rem",
    "stroke-width": "px",
    "column-rule": "px",
    "cursor": "px"
  },
  "sizes": {
    "0": {"px": null, "rem": null},
    "1": {"px": null, "rem": null},
    "2": {"px": null, "rem": null},
    "4": {"px": null, "rem": null},
    "8": {"px": null, "rem": null},
    "12": {"px": null, "rem": null},
    "16": {"px": null, "rem": null},
    "20": {"px": null, "rem": null},
    "24": {"px": null, "rem": null},
    "28": {"px": null, "rem": null},
    "32": {"px": null, "rem": null},
    "36": {"px": null, "rem": null},
    "40": {"px": null, "rem": null},
    "44": {"px": null, "rem": null},
    "48": {"px": null, "rem": null},
    "64": {"px": null, "rem": null},
    "80": {"px": null, "rem": null},
    "96": {"px": null, "rem": null},
    "128": {"px": null, "rem": null}
  }
}
```

In the `sizes` section, you can define mappings from hard-coded lengths to CSS/SCSS variables. When the utility transforms the file, it will replace any matching length with the corresponding variable.

## Usage

No installation is required. You can run the utility directly using `npx`. Simply place your `.px-rem-optimizer` file in the same folder where you are executing the command, and the utility will use it as the configuration.

### Example Command

```bash
npx px-rem-optimizer@latest [file|folder]
```

Replace `[file|folder]` with the path to the CSS file or folder you want to transform.

## Contributing

Feel free to open issues or submit pull requests for enhancements and bug fixes.

## License

MIT License
