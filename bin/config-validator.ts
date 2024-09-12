import { Config } from "./types";

export const configValidator = (config: Config): boolean => {
  const logError = (message: string) => {
    console.error(`Config validation error: ${message}`);
  };

  // Validate baseFontSize
  const isValidBaseFontSize = typeof config.baseFontSize === 'number';
  if (!isValidBaseFontSize) {
    logError('baseFontSize should be a number.');
    return false;
  }

  // Validate targetPath
  const isValidTargetPath = typeof config.targetPath === 'string';
  if (!isValidTargetPath) {
    logError('targetPath should be a string.');
    return false;
  }

  // Validate excludePaths
  const isValidExcludePaths = Array.isArray(config.excludePaths) && config.excludePaths.every(path => typeof path === 'string');
  if (!isValidExcludePaths) {
    logError('excludePaths should be an array of strings.');
    return false;
  }

  // Validate excludePaths
  const isValidTargetExtensions = Array.isArray(config.targetExtensions) && config.excludePaths.every(ext => typeof ext === 'string');
  if (!isValidTargetExtensions) {
    logError('targetExtensions should be an array of strings.');
    return false;
  }

  // Validate roundStrategy
  const isValidRoundStrategy = config.roundStrategy &&
    (config.roundStrategy.onTie === 'up' || config.roundStrategy.onTie === 'down') &&
    (config.roundStrategy.mode === 'on' || config.roundStrategy.mode === 'off' || config.roundStrategy.mode === 'comment');
  if (!isValidRoundStrategy) {
    logError('roundStrategy is invalid. It should contain "onTie" as "up" or "down" and "mode" as "on", "off", or "comment".');
    return false;
  }

  // Validate transformers
  const isValidTransformers = Array.isArray(config.transformers) &&
    config.transformers.every(transformer => typeof transformer === 'function');
  if (!isValidTransformers) {
    logError('transformers should be an array of functions.');
    return false;
  }

  // Validate properties
  const isValidProperties = typeof config.properties === 'object' &&
    Object.entries(config.properties).every(([_, property]) =>
      typeof property.unit === 'string' &&
      (property.unit === 'rem' || property.unit === 'px') &&
      (property.getVariableName === undefined || typeof property.getVariableName === 'function') &&
      (property.transform === undefined || typeof property.round === 'boolean') &&
      (property.convert === undefined || typeof property.convert === 'boolean') &&
      (property.round === undefined || typeof property.round === 'boolean')
      
    );
  if (!isValidProperties) {
    logError('properties should be an object with each property containing a valid "unit" (rem or px), and optional getVariableName function.');
    return false;
  }

  // Validate sizesInPixel
  const isValidSizesInPixel = Array.isArray(config.sizesInPixel) &&
    config.sizesInPixel.every(size => typeof size === 'number');
  if (!isValidSizesInPixel) {
    logError('sizesInPixel should be an array of numbers.');
    return false;
  }

  // Validate getGenericVariableName (optional)
  const isValidGenericVariableName = config.getGenericVariableName === undefined ||
    typeof config.getGenericVariableName === 'function';
  if (!isValidGenericVariableName) {
    logError('getGenericVariableName should be undefined or a function.');
    return false;
  }

  return true;
};