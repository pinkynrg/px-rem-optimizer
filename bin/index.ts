import fs from 'fs';
import path from 'path';
import { transformCSSFileContent } from './utils';
import {config as basicConfig } from './config';
import { validateConfig } from './config-validator';

// If TypeScript is needed, require ts-node
const loadTSConfig = () => {
  try {
    require('ts-node').register();
    return true;
  } catch (e) {
    console.warn('ts-node is not installed. Skipping TypeScript support.');
    return false;
  }
};

const loadConfig = () => {
  const tsPath = path.resolve(process.cwd(), 'px-rem-optimizer.config.ts');
  const jsPath = path.resolve(process.cwd(), 'px-rem-optimizer.config.js');

  // Check if TypeScript config exists
  if (fs.existsSync(tsPath)) {
    // Ensure ts-node is registered to handle TypeScript files
    if (loadTSConfig()) {
      const config = require(tsPath);
      return config.default || config;
    }
  }

  // Check if JavaScript config exists
  if (fs.existsSync(jsPath)) {
    const config = require(jsPath);
    return config.default || config;
  }

  // If neither config file exists, throw an error
  throw new Error('No configuration file found. Expected px-rem-optimizer.config.ts or px-rem-optimizer.config.js');
};


// Transform a single file with the given config
const transformFile = (filePath: string, config: typeof basicConfig) => {
  console.log(`Processing: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  const transformedContent = transformCSSFileContent(content, config);
  
  if (content !== transformedContent) {
    fs.writeFileSync(filePath, transformedContent, 'utf8');
    console.log(`Transformed: ${filePath}`);
  } else {
    console.log(`Untouched: ${filePath}`);
  }
};

const isExcluded = (fullPath: string, rootFolder: string, config: typeof basicConfig): boolean => {
  // Check whether it's a file or directory using fs.statSync
  const stats = fs.statSync(fullPath);

  // Iterate over the excludePaths in the config
  return config.excludePaths.some((excluded) => {
    const excludedFullPath = path.resolve(rootFolder, excluded);
    // Compare the exact path based on whether it's a file or directory
    if (excludedFullPath === fullPath) {
      console.log(`Excluding: ${fullPath}`);
      return true; // Exclude folder
    }

    return false; // Not excluded
  });
};

const traverseDirectory = (directory: string, rootFolder: string, config: typeof basicConfig) => {
  fs.readdirSync(directory).forEach((file) => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    // Check if the current file or folder is in the excludePaths list
    if (isExcluded(fullPath, rootFolder, config)) {
      return; // Skip this file or directory
    }

    if (stat.isDirectory()) {
      traverseDirectory(fullPath, rootFolder, config);
    } else if (stat.isFile() && (fullPath.endsWith('.css') || fullPath.endsWith('.scss'))) {
      transformFile(fullPath, config);
    }
  });
};

// Load configuration (custom or default or null if invalid custom config)
const config = loadConfig();

if (!!config && validateConfig(config)) {

  // Main logic to execute the transformations
  const targetPath = process.argv[2] || config?.targetPath;

  if (!targetPath) {
    console.error('Please provide a file or folder path.');
    process.exit(1);
  }

  const fullTargetPath = path.resolve(targetPath);

  if (!fs.existsSync(fullTargetPath)) {
    console.error('The provided path does not exist.');
    process.exit(1);
  }

  const stats = fs.statSync(fullTargetPath);
  if (stats.isFile()) {
    // Handle single file transformation
    transformFile(fullTargetPath, config);
  } else if (stats.isDirectory()) {
    // Handle directory traversal and file transformation
    traverseDirectory(fullTargetPath, fullTargetPath, config);
  } else {
    console.error('The provided path is neither a valid file nor a directory.');
    process.exit(1);
  }
}