import { config as basicConfig } from './config';
import { Entries } from 'type-fest';

declare global {
  interface ObjectConstructor {
    entries<T extends object>(o: T): Entries<T>
  }  
}

type Units = 'px' | 'rem';
type Conversions = Units | 'skip';

const regex = "(-?\\d+(?:\\.\\d+)?|\\.\\d+)(px|rem)"

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

const roundValue = (value: string, targetUnit: Units, baseFontSize: number, sizes: number[], roundStrategy: string) => {
  return value.replace(new RegExp(regex, 'g'), (_, num, unit) => {
    const number = parseFloat(num);
    const inPx = rawConvertion(number, unit, 'px', baseFontSize);
    const roundedInPx = getClosest(sizes, Math.abs(inPx), number >= 0 && roundStrategy.includes('up')) 
    const roundedInTargetUnit = rawConvertion(roundedInPx, 'px', targetUnit, baseFontSize);
    const rounded = number >= 0 ? roundedInTargetUnit : -roundedInTargetUnit;
    switch (roundStrategy) {
      case 'on_up': return `${rounded}${unit}`
      case 'on_down': return `${rounded}${unit}`
      case 'comment_up': return `${number}${unit}${number !== rounded ? ` /* tofix ${rounded}${targetUnit} */` : ''}`
      case 'comment_down': return `${number}${unit}${number !== rounded ? ` /* tofix ${rounded}${targetUnit} */` : ''}`
      case 'off': return `${number}${unit}`
      default: return `${number}${unit}`

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
  config: typeof basicConfig
): string => {

  // find target unit from the confiig file based on the property in the config 
  const targetUnit = property in config.properties
  ? config.properties[property as keyof typeof config.properties] as Conversions
  : 'skip';
  
  if (targetUnit === 'skip') return value;

  // transform the value based on the transformers in the config file
  const transformedValue = transformValue(value, config.transformers)

  // convert the value to the target unit
  const convertedValue = convertValue(transformedValue, targetUnit, config.baseFontSize)

  // round the value to the closest value in the sizes array in the config file
  const sizes = Object.keys(config.sizes).map(e => parseFloat(e))
  const roundStrategyString = getRoundStrategyString(config.roundStrategy)
  return roundValue(convertedValue, targetUnit, config.baseFontSize, sizes, roundStrategyString)
};

export const transformCSSFileContent = (cssContent: string, config = basicConfig): string => {
  const propertyValueRegex = /([\w-]+)(\s*:\s*)([^\{\};]+);/g;
  return cssContent.replace(propertyValueRegex, (_, property, separator, value) => {
    const convertedValue = optimizeValue(property, value, config);
    return `${property}${separator}${convertedValue};`;
  });
};