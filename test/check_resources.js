const fs = require('fs');
const path = require('path');

const htmlFile = path.join(__dirname, '..', 'index.html');

if (!fs.existsSync(htmlFile)) {
  console.error('Error: index.html not found!');
  process.exit(1);
}

const htmlContent = fs.readFileSync(htmlFile, 'utf8');

// remove comments
const cleanContent = htmlContent.replace(/<!--[\s\S]*?-->/g, '');

const failures = [];

function checkResource(tagRegex, attributeName, type) {
  let match;
  while ((match = tagRegex.exec(cleanContent)) !== null) {
    const tag = match[0];
    // simpler regex for attribute extraction:
    const attributeMatch = tag.match(new RegExp(`${attributeName}=["']([^"']+)["']`, 'i'));

    if (attributeMatch) {
      const resourcePath = attributeMatch[1];

      if (resourcePath.startsWith('http') || resourcePath.startsWith('//') || resourcePath.startsWith('#') || resourcePath.startsWith('mailto:')) {
        continue;
      }

      const filePath = path.join(__dirname, '..', resourcePath);
      if (!fs.existsSync(filePath)) {
        failures.push(`${type} resource not found: ${resourcePath}`);
      }
    }
  }
}

// Regex to find tags
// <link ... >
const linkTagRegex = /<link\s+[^>]*>/gi;
// <script ... >
const scriptTagRegex = /<script\s+[^>]*>/gi;
// <img ... >
const imgTagRegex = /<img\s+[^>]*>/gi;

checkResource(linkTagRegex, 'href', 'Link');
checkResource(scriptTagRegex, 'src', 'Script');
checkResource(imgTagRegex, 'src', 'Image');

if (failures.length > 0) {
  console.error('Resource verification failed:');
  failures.forEach(f => console.error(f));
  process.exit(1);
} else {
  console.log('All referenced resources exist.');
  process.exit(0);
}
