const { expect } = require('chai');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('Performance Optimization', () => {
  let html;
  let dom;
  let document;

  before(() => {
    html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
    dom = new JSDOM(html);
    document = dom.window.document;
  });

  it('should lazy load the about image', () => {
    const aboutImage = document.querySelector('#about .about-image img');
    expect(aboutImage).to.not.be.null;
    expect(aboutImage.getAttribute('loading')).to.equal('lazy');
  });
});
