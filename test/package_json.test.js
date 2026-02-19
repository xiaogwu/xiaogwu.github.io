const fs = require('fs');
const path = require('path');
const { expect } = require('chai');

describe('package.json', () => {
  let packageJsonPath;
  let packageJsonContent;
  let packageJson;

  before(() => {
    packageJsonPath = path.resolve(__dirname, '../package.json');
    if (fs.existsSync(packageJsonPath)) {
      packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
      try {
        packageJson = JSON.parse(packageJsonContent);
      } catch (e) {
        packageJson = null;
      }
    }
  });

  it('should exist', () => {
    expect(fs.existsSync(packageJsonPath)).to.be.true;
  });

  it('should be valid JSON', () => {
    expect(packageJson).to.be.an('object');
  });

  it('should have a "main" entry point', () => {
    expect(packageJson).to.have.property('main');
    expect(packageJson.main).to.be.a('string');
    expect(packageJson.main).to.not.be.empty;
  });

  it('should point to a file that exists', () => {
    const mainFile = packageJson.main;
    const mainFilePath = path.resolve(__dirname, '..', mainFile);

    // Check if the file exists using fs.existsSync for direct check
    // or require.resolve to follow node resolution (e.g. index.js, .json)

    // Since 'main' is usually a relative path like 'index.js' or './lib/index.js'
    // require.resolve is robust.

    // We wrap require.resolve in a function to test if it throws
    const resolveMain = () => require.resolve(mainFilePath);
    expect(resolveMain).to.not.throw();
  });
});
