const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

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
    expect(packageJson).to.not.be.null;
    expect(packageJson).to.be.an('object');
  });

  it('should have a "main" entry point', () => {
    expect(packageJson).to.have.property('main');
    expect(packageJson.main).to.be.a('string');
    expect(packageJson.main).to.not.be.empty;
  });

  it('should have a valid "main" entry point file', () => {
    const mainFile = packageJson.main;
    const mainFilePath = path.resolve(__dirname, '..', mainFile);

    // require.resolve throws if module not found
    expect(() => require.resolve(mainFilePath)).to.not.throw();
  });
});
