const { expect } = require('chai');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('Accessibility Project Tests', () => {
  let dom;
  let document;

  beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
    dom = new JSDOM(html);
    document = dom.window.document;
  });

  it('Project links should have descriptive aria-labels', () => {
    const projectLinks = document.querySelectorAll('.project-link');
    expect(projectLinks.length).to.be.greaterThan(0);

    projectLinks.forEach(link => {
      const ariaLabel = link.getAttribute('aria-label');
      expect(ariaLabel).to.exist;
      expect(ariaLabel).to.include('View source code for');
    });
  });

  it('Social icons should have aria-hidden="true"', () => {
    const socialIcons = document.querySelectorAll('.social-links i');
    expect(socialIcons.length).to.be.greaterThan(0);

    socialIcons.forEach(icon => {
        expect(icon.getAttribute('aria-hidden')).to.equal('true');
    });
  });

  it('Back to top button icon should have aria-hidden="true"', () => {
      const backToTopIcon = document.querySelector('#back-to-top i');
      expect(backToTopIcon).to.exist;
      expect(backToTopIcon.getAttribute('aria-hidden')).to.equal('true');
  });
});
