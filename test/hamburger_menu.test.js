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
    // Remove CSP to allow inline script injection for testing
    html = html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/, '');
    html = html.replace('<script src="script.js"></script>', '');
    html = html.replace(/<link.*?>/g, ''); // Remove external links to avoid ECONNREFUSED in tests
    scriptContent = fs.readFileSync(path.resolve(__dirname, '../script.js'), 'utf8');
  });

  beforeEach(() => {
    dom = new JSDOM(html, {
      runScripts: "dangerously",
      url: "http://localhost"
    });
    window = dom.window;
    document = window.document;

    // Execute script
    const scriptEl = document.createElement('script');
    scriptEl.textContent = scriptContent;
    document.body.appendChild(scriptEl);

    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = function() {};

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
