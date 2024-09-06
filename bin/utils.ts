import basicConfig from './config.json';
import { Entries } from 'type-fest';

declare global {
  interface ObjectConstructor {
    entries<T extends object>(o: T): Entries<T>
  }  
}

type Units = 'px' | 'rem';
type Conversions = Units | 'skip';

export const transformBasicValue = (
  value: string, 
  targetUnit: Conversions, 
  config = basicConfig
): string => {

  const rawConvertion = (value: number, sourceUnit: Units, targetUnit: Conversions, baseFontSize: number): number => {
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
    
    // get list of allowed sizes
    const allowedSizes = Object.keys(config.sizes).map(e => parseFloat(e))

    // get number close to the sizes index object
    const pxValue = rawConvertion(originalValue, sourceUnit, 'px', config.baseFontSize);

    // decides if it should round up on tie
    const roundUpOnTie = originalValue < 0 ? !config.round.roundUpOnTie : config.round.roundUpOnTie;
    
    // get closest size index
    const closestIndex = getClosest(allowedSizes, Math.abs(pxValue), roundUpOnTie);

    // @ts-expect-error TOFIX
    const variableName = config.sizes[String(closestIndex)][targetUnit]
    const convertedNotRoundedValue = rawConvertion(originalValue, sourceUnit, targetUnit, config.baseFontSize);
    const convertedRoundedValue = rawConvertion(closestIndex, 'px', targetUnit, config.baseFontSize);
    const sign = originalValue >= 0 ? '' : '-'

    if (config.round.enabled) {
      if (!!variableName) {
        // TOFIX: use variableName: consider negative and what to do for css/scss variables
        return `${sign}${variableName}`
      } else {
        return `${sign}${convertedRoundedValue}${targetUnit}`;
      }
    } else {
      if (!!variableName) {
        // TOFIX: use variableName: consider negative and what to do for css/scss variables
        return `${originalValue}${targetUnit} /* tofix: ${sign}${variableName} */`;   
      } else {
        if (convertedNotRoundedValue !== parseFloat(`${sign}${convertedRoundedValue}`)) {
          return `${convertedNotRoundedValue}${targetUnit} /* tofix: ${sign}${convertedRoundedValue}${targetUnit} */`;   
        }
        return `${convertedNotRoundedValue}${targetUnit}`;   
      }
      
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
  // Use a regex to match CSS properties, optional spaces around `:`, and the values.
  const propertyValueRegex = /([\w-]+)(\s*:\s*)([^;]+);/g;

  // Replace each matching property-value pair using the transformComplexValue function.
  cssContent = cssContent.replace(propertyValueRegex, (match, property, separator, value) => {
    const transformedValue = transformComplexValue(property, value, config);
    // Return the property, the original separator (spaces/newlines), and the transformed value
    return `${property}${separator}${transformedValue};`;
  });

  return cssContent;
};