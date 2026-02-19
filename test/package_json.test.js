const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

describe('package.json Validation', () => {
  const packageJsonPath = path.resolve(__dirname, '../package.json');
  let packageJson;

  it('should exist', () => {
    expect(fs.existsSync(packageJsonPath)).to.be.true;
  });

  it('should be valid JSON', () => {
    const content = fs.readFileSync(packageJsonPath, 'utf8');
    expect(() => {
      packageJson = JSON.parse(content);
    }).to.not.throw();
    expect(packageJson).to.be.an('object');
  });

  it('should have a "main" field', () => {
    expect(packageJson).to.have.property('main');
    expect(packageJson.main).to.be.a('string');
    expect(packageJson.main).to.not.be.empty;
  });

  it('should point to a valid entry file', () => {
    const mainFile = packageJson.main;
    const mainFilePath = path.resolve(__dirname, '..', mainFile);

    // Check if the file exists using require.resolve
    // This allows for extensions to be omitted if supported by Node (though explicit is better)
    let resolvedPath;
    try {
        resolvedPath = require.resolve(mainFilePath);
    } catch (e) {
        resolvedPath = null;
    }

    expect(resolvedPath, `Could not resolve main file: ${mainFile}`).to.not.be.null;
    expect(fs.existsSync(resolvedPath), `Resolved file does not exist: ${resolvedPath}`).to.be.true;
  });
});
