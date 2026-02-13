const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(__dirname, '../package.json');

if (!fs.existsSync(packageJsonPath)) {
  console.error('Error: package.json not found.');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const mainFile = packageJson.main;

if (!mainFile) {
  console.log('No "main" field found in package.json. Skipping validation.');
  process.exit(0);
}

// Construct absolute path to the main file/directory
const mainFilePath = path.resolve(__dirname, '..', mainFile);

try {
  // Use require.resolve to leverage Node.js resolution algorithm (extensions, index.js, etc.)
  require.resolve(mainFilePath);
  console.log(`Main file found: ${mainFile}`);
  process.exit(0);
} catch (error) {
  console.error(`Error: Main file specified in package.json ("${mainFile}") could not be resolved.`);
  console.error(error.message);
  process.exit(1);
}
