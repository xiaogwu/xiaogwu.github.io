const { expect } = require('chai');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('Back to Top Button', () => {
  let html;
  let dom;
  let document;

  before(() => {
    html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
    dom = new JSDOM(html);
    document = dom.window.document;
  });

  it('should exist in the DOM', () => {
    const button = document.getElementById('back-to-top');
    expect(button).to.not.be.null;
  });

  it('should have the correct aria-label', () => {
    const button = document.getElementById('back-to-top');
    expect(button.getAttribute('aria-label')).to.equal('Back to top');
  });

  it('should contain the arrow icon', () => {
    const button = document.getElementById('back-to-top');
    const icon = button.querySelector('i');
    expect(icon).to.not.be.null;
    expect(icon.classList.contains('fas')).to.be.true;
    expect(icon.classList.contains('fa-arrow-up')).to.be.true;
  });

  it('should be hidden by default (no visible class)', () => {
    const button = document.getElementById('back-to-top');
    expect(button.classList.contains('visible')).to.be.false;
  });
});
