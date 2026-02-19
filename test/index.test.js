const fs = require('fs');
const path = require('path');

describe('Basic Site Checks', () => {
  test('index.html should exist', () => {
    const indexPath = path.resolve(__dirname, '../index.html');
    expect(fs.existsSync(indexPath)).toBe(true);
  });

  test('index.html should have correct title', () => {
    const indexPath = path.resolve(__dirname, '../index.html');
    const content = fs.readFileSync(indexPath, 'utf8');
    expect(content).toMatch(/<title>Hello World!<\/title>/);
  });
});
