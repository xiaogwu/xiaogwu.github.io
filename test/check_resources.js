const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const htmlFile = path.resolve(__dirname, '../index.html');

if (!fs.existsSync(htmlFile)) {
  console.error('Error: index.html not found!');
  process.exit(1);
}

const htmlContent = fs.readFileSync(htmlFile, 'utf8');
const dom = new JSDOM(htmlContent);
const document = dom.window.document;

const failures = [];

function checkPath(resourcePath, type) {
  if (!resourcePath) return;
  if (resourcePath.startsWith('http') || resourcePath.startsWith('//') || resourcePath.startsWith('#') || resourcePath.startsWith('mailto:')) {
    return;
  }

  // Resolve path relative to project root (where index.html is)
  // path.join handles both relative (style.css) and absolute-like (/style.css) paths correctly for this context
  // assuming root-relative paths point to the project root.
  const absolutePath = path.resolve(__dirname, '..', resourcePath.replace(/^\//, ''));

  if (!fs.existsSync(absolutePath)) {
    failures.push(`${type} resource not found: ${resourcePath} (resolved to ${absolutePath})`);
  }
}

// Check <link href="...">
document.querySelectorAll('link[href]').forEach(el => {
  checkPath(el.getAttribute('href'), 'Link');
});

// Check <script src="...">
document.querySelectorAll('script[src]').forEach(el => {
  checkPath(el.getAttribute('src'), 'Script');
});

// Check <img src="...">
document.querySelectorAll('img[src]').forEach(el => {
  checkPath(el.getAttribute('src'), 'Image');
});

if (failures.length > 0) {
  console.error('Resource verification failed:');
  failures.forEach(f => console.error(f));
  process.exit(1);
} else {
  console.log('All referenced resources exist.');
  process.exit(0);
}
