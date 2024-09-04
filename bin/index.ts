import basicConfig from './config.json';
import { Entries } from 'type-fest';
import fs from 'fs';
import path from 'path';
// @ts-expect-error
import CSSJSON from 'cssjson';

declare global {
  interface ObjectConstructor {
    entries<T extends object>(o: T): Entries<T>
  }  
}

type units = 'px' | 'rem';
type conversions = units | 'skip';

export const transformBasicValue = (value: string, targetUnit: conversions, config = basicConfig): string => {

  const rawConvertion = (value: number, sourceUnit: units, targetUnit: conversions, baseFontSize: number): number => {
    if (sourceUnit === targetUnit) return value;
    if (sourceUnit === 'px' && targetUnit === 'rem') return value / baseFontSize;
    if (sourceUnit === 'rem' && targetUnit === 'px') return value * baseFontSize;
    return value;
  }

  const getSourceUnit = (value: string, lengthMatchingRules: {'px': string, 'rem': string}) => {
    for (const [unit, regexStr] of Object.entries(lengthMatchingRules)) {
      const regex = new RegExp(regexStr);
      if (regex.test(value)) {
        return unit;
      }
    }
  }

  const extractNumericValue = (inputString: string) => {
    const pattern = /(\-?\d+(\.\d+)?|\.\d+)/;
    const match = inputString.match(pattern);
    return match ? parseFloat(match[0]) : null;
  }

  const getClosest = (arr: number[], num: number, roundUp: boolean) => {
    return arr.reduce((a, b) => Math.abs(a - num) < Math.abs(b - num) ? a : 
      Math.abs(a - num) === Math.abs(b - num) ? (roundUp ? b : a) : b);
  }
  
  const sourceUnit = getSourceUnit(value, config.lengthMatchingRules)

  if (targetUnit === 'skip' || !sourceUnit) return value

  return value.replace(new RegExp(config.lengthMatchingRules[sourceUnit]), (match) => {
    const originalValue = extractNumericValue(match);
    if (originalValue === null) return match;
    const allowedLength = Object.keys(config.sizes[targetUnit]).map(e => parseFloat(e));
    const convertedValueRaw = rawConvertion(originalValue, sourceUnit, targetUnit, config.baseFontSize);
    const absConvertedValueRaw = Math.abs(convertedValueRaw);
    if (!allowedLength.includes(absConvertedValueRaw)) {
      const roundUpOnTieConsideringNegative = convertedValueRaw < 0 ? !config.round.roundUpOnTie : config.round.roundUpOnTie;
      const closest = getClosest(allowedLength, absConvertedValueRaw, roundUpOnTieConsideringNegative);
      if (config.round.enabled) {
        return convertedValueRaw >= 0 ? 
        // @ts-expect-error TOFIX
        config.sizes[targetUnit][closest] : 
        // @ts-expect-error TOFIX
        `-${config.sizes[targetUnit][closest]}`;
      } else {
        return convertedValueRaw >= 0 
        // @ts-expect-error TOFIX
        ? `${originalValue}${targetUnit} /* tofix: ${config.sizes[targetUnit][closest]} */`
        // @ts-expect-error TOFIX
        : `${originalValue}${targetUnit} /* tofix: -${config.sizes[targetUnit][closest]} */`;
      }
    } else {
      return convertedValueRaw >= 0 
      // @ts-expect-error TOFIX
      ? config.sizes[targetUnit][absConvertedValueRaw] : 
      // @ts-expect-error TOFIX
      `-${config.sizes[targetUnit][absConvertedValueRaw]}`;
    }
  })
};

export const transformComplexValue = (property: string, value: string, config: typeof basicConfig): string => {
  const isValidProperty = (prop: string, obj: typeof config.properties): prop is keyof typeof config.properties => {
    return prop in obj;
  }

  // Determine the target unit for the property
  const targetUnit = isValidProperty(property, config.properties) ? config.properties[property] as 'rem' | 'px' : null;

  if (!targetUnit) return value;

  // Iterate over each unit type (px, rem) defined in lengthMatchingRules
  for (const [_, regexStr] of Object.entries(config.lengthMatchingRules)) {
    const regex = new RegExp(regexStr, 'g'); // Create a global regex to match all instances in the value string

    // Replace each matching instance in the value using the transformBasicValue
    value = value.replace(regex, (match) => {
      // Call transformBasicValue for each match found
      return transformBasicValue(match, targetUnit, config);
    });
  }

  return value;
};

const transformCSSFileContent = (cssContent: string, config = basicConfig): string => {
  const cssJson = CSSJSON.toJSON(cssContent);
  
  const transformCssObject = (cssObj: any): any => {
    for (const selector in cssObj.children) {
      if (cssObj.children.hasOwnProperty(selector)) {
        const styles = cssObj.children[selector].attributes;

        for (const property in styles) {
          if (styles.hasOwnProperty(property)) {
            const originalValue = Array.isArray(styles[property]) ? styles[property].slice(-1)[0] : styles[property];
            const transformedValue = transformComplexValue(property, originalValue, config);
            styles[property] = transformedValue;
          }
        }

        if (cssObj.children[selector].children) {
          cssObj.children[selector].children = transformCssObject(cssObj.children[selector].children);
        }
      }
    }
    return cssObj;
  };

  const transformedCssJson = transformCssObject(cssJson);
  const transformedCss = CSSJSON.toCSS(transformedCssJson);

  return transformedCss;
};


const traverseDirectory = (directory: string) => {
  fs.readdirSync(directory).forEach((file) => {
    const fullPath = path.join(directory, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      traverseDirectory(fullPath)
    } else if (stat.isFile()) {
      // Only transform .css and .scss files
      if (fullPath.endsWith('.css') || fullPath.endsWith('.scss')) {
        const content = fs.readFileSync(fullPath, 'utf8')
        const transformedContent = transformCSSFileContent(content, basicConfig)
        if (content !== transformedContent) {
          fs.writeFileSync(fullPath, transformedContent, 'utf8')
          console.log(`Transformed: ${fullPath}`)
        }
      }
    }
  })
}

const folder = process.argv[2]

if (!folder) {
  console.error('Please provide a folder path.')
  process.exit(1)
}

const fullFolderPath = path.resolve(folder)

if (!fs.existsSync(fullFolderPath) || !fs.statSync(fullFolderPath).isDirectory()) {
  console.error('The provided path is not a valid directory.')
  process.exit(1)
}

traverseDirectory(fullFolderPath)
