import { Entries } from 'type-fest';
import { Config } from './types';

declare global {
  interface ObjectConstructor {
    entries<T extends object>(o: T): Entries<T>
  }  
}

type Units = 'px' | 'rem';
type Conversions = Units | 'skip';

const regex = "(-?\\d+(?:\\.\\d+)?|\\.\\d+)(px|rem)(?:\\s*/\\* tofix .*? \\*/)?"

const checkUnit = (unit: any): unit is Units => {
  return unit === 'px' || unit === 'rem'
}    

const getClosest = (arr: number[], num: number, roundUp: boolean) => {
  return arr.reduce((a, b) => Math.abs(a - num) < Math.abs(b - num) ? a : 
    Math.abs(a - num) === Math.abs(b - num) ? (roundUp ? b : a) : b);
}

const rawConvertion = (value: number, sourceUnit: Units, targetUnit: Conversions, baseFontSize: number): number => {
  if (sourceUnit === targetUnit) return value;
  if (sourceUnit === 'px' && targetUnit === 'rem') return value / baseFontSize;
  if (sourceUnit === 'rem' && targetUnit === 'px') return value * baseFontSize;
  return value;
}

const transformValue = (value: string, transformers: ((value: string) => string)[]) => {
  return transformers.reduce<string>((acc, transformer) => transformer(acc), value);
}

const convertValue = (value: string, targetUnit: Units, baseFontSize: number) => {
  return value.replace(new RegExp(regex, 'g'), (_, sourceNumberString, sourceUnit) => {
    const sourceNumber = parseFloat(sourceNumberString);
    const convertedValue = rawConvertion(sourceNumber, sourceUnit, targetUnit, baseFontSize);
    return `${convertedValue}${targetUnit}`
  })
}

const formatVariableWithSign = (variable: string, isPositive: boolean) => {
  if (variable.startsWith('--')) {
    return isPositive ? `var(${variable})` : `calc(-1 * var(${variable}))`
  } else {
    return isPositive ? variable : `(-${variable})`
  }
}

const roundValue = (
  value: string, 
  baseFontSize: number, 
  sizes: Config['sizesInPixel'], 
  roundStrategy: Config['roundStrategy'],
  getVariableName?: ((sizeInPx: number) => string),
) => {
  const roundStrategyString = getRoundStrategyString(roundStrategy)
  return value.replace(new RegExp(regex, 'g'), (_, value, unit) => {
    if (checkUnit(unit)) {
      const number = parseFloat(value);
      const inPx = rawConvertion(number, unit, 'px', baseFontSize);
      const roundedInPx = getClosest(sizes, Math.abs(inPx), number >= 0 && roundStrategyString.includes('up')) 
      const roundedInTargetUnit = rawConvertion(roundedInPx, 'px', unit, baseFontSize);
      const isPositive = number >= 0;
      const rounded = isPositive ? roundedInTargetUnit : -roundedInTargetUnit;
      const variable = getVariableName ? getVariableName(roundedInPx) : null;
      const finalResult = variable ? formatVariableWithSign(variable, isPositive) : `${rounded}${unit}`
      switch (roundStrategyString) {
        case 'on_up': return finalResult
        case 'on_down': return finalResult
        case 'comment_up': return `${number}${unit}${number !== rounded ? ` /* tofix ${finalResult} */` : ''}`
        case 'comment_down': return `${number}${unit}${number !== rounded ? ` /* tofix ${finalResult} */` : ''}`
        case 'off': return `${number}${unit}`
        default: return `${number}${unit}`
      }
    } else {
      return `${value}${unit}`
    }
  })
}

const getRoundStrategyString = (roundStrategy: { mode: string, onTie: string}) => {
  switch (roundStrategy.mode) {
    case 'on': return roundStrategy.onTie === 'up' ? 'on_up' : 'on_down';
    case 'off': return 'off';
    case 'comment': return roundStrategy.onTie === 'up' ? 'comment_up' : 'comment_down';
    default: return 'off'
  }
}

export const optimizeValue = (
  property: string,
  value: string, 
  config: Config
): string => {

  // find target unit from the confiig file based on the property in the config 
  const targetUnit = property in config.properties
  ? config.properties[property as keyof typeof config.properties]['unit'] as Conversions
  : 'skip';
  
  if (targetUnit === 'skip') return value;

  // transform the value based on the transformers in the config file
  const transformedValue = transformValue(value, config.transformers)

  // convert the value to the target unit
  const convertedValue = convertValue(transformedValue, targetUnit, config.baseFontSize)

  // round the value to the closest value in the sizes array in the config file
  return roundValue(
    convertedValue, 
    config.baseFontSize, 
    config.sizesInPixel, 
    config.roundStrategy,
    config.properties[property]['getVariableName'] || config.getGenericVariableName, 
  )
};

export const transformCSSFileContent = (cssContent: string, config: Config): string => {
  const propertyValueRegex = /([\w-]+)(\s*:\s*)([^\{\};]+);/g;
  return cssContent.replace(propertyValueRegex, (_, property, separator, value) => {
    const convertedValue = optimizeValue(property, value, config);
    return `${property}${separator}${convertedValue};`;
  });
};