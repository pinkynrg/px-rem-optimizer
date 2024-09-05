<!-- ⚠️ This README has been generated from the file(s) "blueprint.md" ⚠️-->

[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#css-unit-transformer-utility---fix-a11y-lengths)

# ➤ CSS Unit Transformer Utility - fix-a11y-lengths

This utility provides functions for transforming CSS unit values (e.g., `px`, `rem`) within CSS files or property values based on configurable rules. It includes support for rounding, custom length-matching rules, handling complex CSS properties, and replacing hard-coded lengths with CSS/SCSS variables.


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

The configuration is defined in a `.fix-a11y-lengths` file. The schema for the configuration is validated using **AJV**.

### Example `.fix-a11y-lengths`:

```json
{
  "baseFontSize": 16,
  "round": {
    "enabled": true,
    "roundUpOnTie": true
  },
  "lengthMatchingRules": {
    "px": "(-?\d+(\.\d+)?|\.\d+)px",
    "rem": "(-?\d+(\.\d+)?|\.\d+)rem"
  },
  "properties": {
    "width": "rem",
    "padding": "px"
  },
  "sizes": {
    "px": {
      "0": "var(--size-0-in-px)",
      "1": "var(--size-1-in-px)",
      "4": "var(--size-4-in-px)"
    },
    "rem": {
      "0": "var(--size-0-in-rem)",
      "1": "var(--size-1-in-rem)",
      "4": "var(--size-4-in-rem)"
    }
  }
}
```

In the `sizes` section, you can define mappings from hard-coded lengths to CSS/SCSS variables. When the utility transforms the file, it will replace any matching length with the corresponding variable.


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#usage)

## ➤ Usage

No installation is required. You can run the utility directly using `npx`. Simply place your `.fix-a11y-lengths` file in the same folder where you are executing the command, and the utility will use it as the configuration.

### Example Command

```bash
npx fix-a11y-lengths@latest [file|folder]
```

Replace `[file|folder]` with the path to the CSS file or folder you want to transform.


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#validation)

## ➤ Validation

This utility validates the `.fix-a11y-lengths` configuration file using **AJV (Another JSON Schema Validator)**. It checks for the structure and correctness of the configuration.


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#contributing)

## ➤ Contributing

Feel free to open issues or submit pull requests for enhancements and bug fixes.


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#license)

## ➤ License

MIT License
