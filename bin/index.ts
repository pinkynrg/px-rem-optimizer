import fs from 'fs';
import path from 'path';
import { transformCSSFileContent } from './utils';
import basicConfig from './config.json';

const transformFile = (filePath: string) => {
  const content = fs.readFileSync(filePath, 'utf8')
  const transformedContent = transformCSSFileContent(content, basicConfig)
  if (content !== transformedContent) {
    fs.writeFileSync(filePath, transformedContent, 'utf8')
    console.log(`Transformed: ${filePath}`)
  }
}

const traverseDirectory = (directory: string) => {
  fs.readdirSync(directory).forEach((file) => {
    const fullPath = path.join(directory, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      traverseDirectory(fullPath)
    } else if (stat.isFile()) {
      // Only transform .css and .scss files
      if (fullPath.endsWith('.css') || fullPath.endsWith('.scss')) {
        transformFile(fullPath)
      }
    }
  })
}

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

const stats = fs.statSync(fullTargetPath);

if (stats.isFile()) {
  // Handle single file transformation
  transformFile(fullTargetPath);
} else if (stats.isDirectory()) {
  // Handle directory traversal and file transformation
  traverseDirectory(fullTargetPath);
} else {
  console.error('The provided path is neither a valid file nor a directory.');
  process.exit(1);
}