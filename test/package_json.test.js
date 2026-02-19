const fs = require('fs');
const path = require('path');
const { expect } = require('chai');

describe('package.json', () => {
  let packageJsonPath;
  let packageJsonContent;
  let packageJson;

  before(() => {
    packageJsonPath = path.resolve(__dirname, '../package.json');
  });

  it('should exist', () => {
    expect(fs.existsSync(packageJsonPath)).to.be.true;
  });

  it('should be valid JSON', () => {
    packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
    expect(() => {
      packageJson = JSON.parse(packageJsonContent);
    }).to.not.throw();
  });

  it('should have a "main" entry point', () => {
    expect(packageJson).to.have.property('main');
    expect(packageJson.main).to.be.a('string');
    expect(packageJson.main).to.not.be.empty;
  });

  it('should point to a valid file', () => {
    const mainFile = packageJson.main;
    const mainFilePath = path.resolve(__dirname, '..', mainFile);

    // Check if the file exists using require.resolve logic (handles .js, .json, etc.)
    expect(() => require.resolve(mainFilePath)).to.not.throw();
  });
});
