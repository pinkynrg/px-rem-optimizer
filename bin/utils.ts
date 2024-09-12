import { Entries } from 'type-fest';
import { Config } from './types';

declare global {
  interface ObjectConstructor {
    entries<T extends object>(o: T): Entries<T>
  }  
}

type Units = 'px' | 'rem';

type Payload = {
  property: string;
  value: string;
  config: Config;
}

const cssPropertyAndValue = "([\\w-]+)(\\s*:\\s*)([^\\{\\};\\n]+);"
const cssValue = "(-?\\d+(?:\\.\\d+)?|\\.\\d+)(px|rem)(?:\\s*/\\* tofix .*? \\*/)?"

const getClosest = (arr: number[], num: number, roundUp: boolean) => {
  return arr.reduce((a, b) => Math.abs(a - num) < Math.abs(b - num) ? a : 
    Math.abs(a - num) === Math.abs(b - num) ? (roundUp ? b : a) : b);
}

const rawConvertion = (value: number, sourceUnit: Units, targetUnit: Units, baseFontSize: number): number => {
  if (sourceUnit === targetUnit) return value;
  if (sourceUnit === 'px' && targetUnit === 'rem') return value / baseFontSize;
  if (sourceUnit === 'rem' && targetUnit === 'px') return value * baseFontSize;
  return value;
}

const formatVariableWithSign = (variable: string, isPositive: boolean) => {
  if (variable.startsWith('--')) {
    return isPositive ? `var(${variable})` : `calc(-1 * var(${variable}))`
  } else {
    return isPositive ? variable : `(-${variable})`
  }
}

const getRoundStrategyString = (roundStrategy: { mode: string, onTie: string}) => {
  switch (roundStrategy.mode) {
    case 'on': return roundStrategy.onTie === 'up' ? 'on_up' : 'on_down';
    case 'off': return 'off';
    case 'comment': return roundStrategy.onTie === 'up' ? 'comment_up' : 'comment_down';
    default: return 'off'
  }
}

const propertyExists = (property: string, config: Config): property is Extract<keyof Config['properties'], string> => {
  return property in config.properties;
};

const transformValue = ({property, value, config}: Payload) => {
  if (!propertyExists(property, config)) return value;
  if (config.properties[property].transform === false) return value;
  return config.transformers.reduce<string>((acc, transformer) => transformer(acc), value)
}

const convertValue = ({property, value, config}: Payload) => {
  if (!propertyExists(property, config)) return value;
  if (config.properties[property].convert === false) return value;
  return value.replace(new RegExp(cssValue, 'g'), (_, sourceNumberString, sourceUnit) => {
    const sourceNumber = parseFloat(sourceNumberString);
    const targetUnit = config.properties[property].unit
    const convertedValue = rawConvertion(sourceNumber, sourceUnit, targetUnit, config.baseFontSize);
    return `${convertedValue}${targetUnit}`
  })
}

const roundValue = ({ property, value, config}: Payload) => {
  if (!propertyExists(property, config)) return value;
  if (config.properties[property].round === false) return value;
  const roundStrategyString = getRoundStrategyString(config.roundStrategy)
  return value.replace(new RegExp(cssValue, 'g'), (_, value, unit) => {
    const number = parseFloat(value);
    const inPx = rawConvertion(number, unit, 'px', config.baseFontSize);
    const roundedInPx = getClosest(config.sizesInPixel, Math.abs(inPx), number >= 0 && roundStrategyString.includes('up')) 
    const roundedInTargetUnit = rawConvertion(roundedInPx, 'px', unit, config.baseFontSize);
    const isPositive = number >= 0;
    const rounded = isPositive ? roundedInTargetUnit : -roundedInTargetUnit;
    const getVariableName = config.properties[property]['getVariableName'] || config.getGenericVariableName
    const variable = getVariableName ? getVariableName(roundedInPx) : null;
    const finalResult = variable ? formatVariableWithSign(variable, isPositive) : `${rounded}${unit}`
    switch (roundStrategyString) {
      case 'on_up': return finalResult
      case 'on_down': return finalResult
      case 'comment_up': return number !== rounded ? `${number}${unit} /* tofix ${finalResult} */` : finalResult
      case 'comment_down': return number !== rounded ? `${number}${unit} /* tofix ${finalResult} */` : finalResult
      case 'off': return number !== rounded ? `${number}${unit}` : finalResult
      default: return number !== rounded ? `${number}${unit}` : finalResult
    }
  })
}

export const optimizeValue = (payload: Payload): string => {

  // transform the value based on the transformers in the config file
  const transformed = transformValue(payload)

  // convert the value to the target unit
  const converted = convertValue({...payload, value: transformed})

  // round the value to the closest value in the sizes array in the config file
  const roundedValue = roundValue({...payload, value: converted})

  // finally return the rounded value
  return roundedValue
};

export const transformCSSFileContent = (cssContent: string, config: Config): string => {
  return cssContent.replace(new RegExp(cssPropertyAndValue, 'g'), (_, property, separator, value) => {
    const convertedValue = optimizeValue({property, value, config});
    return `${property}${separator}${convertedValue};`;
  });
};