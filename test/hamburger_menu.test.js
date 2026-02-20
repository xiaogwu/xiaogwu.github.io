const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const { expect } = require('chai');

describe('Hamburger Menu', () => {
  let html;
  let scriptContent;
  let dom;
  let window;
  let document;
  let hamburger;
  let navLinks;

  before(() => {
    html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
    scriptContent = fs.readFileSync(path.resolve(__dirname, '../script.js'), 'utf8');
  });

  beforeEach(() => {
    dom = new JSDOM(html, {
      runScripts: "dangerously",
      resources: "usable",
      url: "http://localhost"
    });
    window = dom.window;
    document = window.document;

    // Execute script
    const scriptEl = document.createElement('script');
    scriptEl.textContent = scriptContent;
    document.body.appendChild(scriptEl);

    // Trigger DOMContentLoaded
    document.dispatchEvent(new window.Event('DOMContentLoaded'));

    hamburger = document.querySelector('.hamburger');
    navLinks = document.querySelector('.nav-links');
  });

  it('should toggle active class and aria-expanded when hamburger is clicked', () => {
    expect(hamburger.classList.contains('active')).to.be.false;
    expect(navLinks.classList.contains('active')).to.be.false;
    expect(hamburger.getAttribute('aria-expanded')).to.equal('false');

    // Click to open
    hamburger.click();
    expect(hamburger.classList.contains('active')).to.be.true;
    expect(navLinks.classList.contains('active')).to.be.true;
    expect(hamburger.getAttribute('aria-expanded')).to.equal('true');

    // Click to close
    hamburger.click();
    expect(hamburger.classList.contains('active')).to.be.false;
    expect(navLinks.classList.contains('active')).to.be.false;
    expect(hamburger.getAttribute('aria-expanded')).to.equal('false');
  });

  it('should close the menu when a nav link is clicked', () => {
    // Open the menu first
    hamburger.click();
    expect(hamburger.classList.contains('active')).to.be.true;
    expect(navLinks.classList.contains('active')).to.be.true;

    // Click a nav link
    const firstNavLink = document.querySelector('.nav-links li a');
    firstNavLink.click();

    expect(hamburger.classList.contains('active')).to.be.false;
    expect(navLinks.classList.contains('active')).to.be.false;
    expect(hamburger.getAttribute('aria-expanded')).to.equal('false');
  });
});
