import basicConfig from './config.json';
import { Entries } from 'type-fest';

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

export const transformCSSFileContent = (cssContent: string, config = basicConfig): string => {
  // Use a regex to match CSS properties and values.
  const propertyValueRegex = /([\w-]+)\s*:\s*([^;]+);/g;

  // Replace each matching property-value pair using the transformComplexValue function.
  cssContent = cssContent.replace(propertyValueRegex, (match, property, value) => {
    const transformedValue = transformComplexValue(property, value, config);
    return `${property}: ${transformedValue};`;
  });

  return cssContent;
};