import fs from 'fs';
import path from 'path';
import { transformCSSFileContent } from './utils';
import basicConfig from './config.json';
import { validateConfig } from './config-validator';

const externalConfigFileName = '.fix-a11y-lengths'

// Helper to load configuration (default or custom)
const loadConfig = (): typeof basicConfig | null => {
  const customConfigPath = path.resolve(process.cwd(), externalConfigFileName);
  if (fs.existsSync(customConfigPath)) {
    try {
      const configContent = JSON.parse(fs.readFileSync(customConfigPath, 'utf8'));
      const isValid = validateConfig(configContent)
      if (isValid) {
        console.log(`Custom configuration ${externalConfigFileName} found. Using custom config file.`);
        return configContent;
      } else {
        throw new Error('Invalid custom configuration.');
      }
    } catch (error) {
      // @ts-expect-error
      console.error(error.message);
      return null
    }
  }
  console.log('No custom config found. Using default configuration.');
  return basicConfig;
};

// Transform a single file with the given config
const transformFile = (filePath: string, config: typeof basicConfig) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const transformedContent = transformCSSFileContent(content, config);
  
  if (content !== transformedContent) {
    fs.writeFileSync(filePath, transformedContent, 'utf8');
    console.log(`Transformed: ${filePath}`);
  }
};

// Traverse through a directory, transforming each CSS/SCSS file
const traverseDirectory = (directory: string, config: typeof basicConfig) => {
  fs.readdirSync(directory).forEach((file) => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      traverseDirectory(fullPath, config);
    } else if (stat.isFile() && (fullPath.endsWith('.css') || fullPath.endsWith('.scss'))) {
      transformFile(fullPath, config);
    }
  });
};

// Main logic to execute the transformations
const targetPath = process.argv[2];

if (!targetPath) {
  console.error('Please provide a file or folder path.');
  process.exit(1);
}

const fullTargetPath = path.resolve(targetPath);

if (!fs.existsSync(fullTargetPath)) {
  console.error('The provided path does not exist.');
  process.exit(1);
}

// Load configuration (custom or default or null if invalid custom config)
const config = loadConfig();

if (!!config) {
  const stats = fs.statSync(fullTargetPath);
  if (stats.isFile()) {
    // Handle single file transformation
    transformFile(fullTargetPath, config);
  } else if (stats.isDirectory()) {
    // Handle directory traversal and file transformation
    traverseDirectory(fullTargetPath, config);
  } else {
    console.error('The provided path is neither a valid file nor a directory.');
    process.exit(1);
  }
}