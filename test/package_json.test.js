const fs = require('fs');
const path = require('path');
const { expect } = require('chai');

describe('package.json', () => {
  let packageJsonPath;
  let packageJsonContent;
  let packageJson;

  before(() => {
    packageJsonPath = path.resolve(__dirname, '../package.json');
    try {
      packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
      packageJson = JSON.parse(packageJsonContent);
    } catch (error) {
      packageJsonContent = null;
      packageJson = null;
    }
  });

  it('should exist', () => {
    expect(fs.existsSync(packageJsonPath), 'package.json file should exist').to.be.true;
  });

  it('should be valid JSON', () => {
    expect(packageJsonContent, 'package.json content should not be null').to.not.be.null;
    expect(packageJson, 'package.json should be a valid JSON object').to.be.an('object');
  });

  it('should have a "main" entry point', function() {
    if (!packageJson) this.skip();
    expect(packageJson).to.have.property('main');
    expect(packageJson.main).to.be.a('string');
    expect(packageJson.main).to.not.be.empty;
  });

  it('should have a valid "main" entry point file', function() {
    if (!packageJson || !packageJson.main) this.skip();

    const mainFile = packageJson.main;
    // Resolve relative to the package.json location
    const mainFilePath = path.resolve(__dirname, '..', mainFile);

    let resolvedPath;
    try {
      resolvedPath = require.resolve(mainFilePath);
    } catch (error) {
      resolvedPath = null;
    }

    expect(resolvedPath, `Could not resolve main file: ${mainFile}`).to.not.be.null;
  });
});
