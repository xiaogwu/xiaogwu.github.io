const { expect } = require('chai');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('Accessibility Tests', () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    let html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
    // Remove external script to prevent loading error and double execution
    html = html.replace('<script src="script.js"></script>', '');

    const scriptContent = fs.readFileSync(path.resolve(__dirname, '../script.js'), 'utf8');

    // Initialize JSDOM with the HTML content
    dom = new JSDOM(html, {
      runScripts: "dangerously",
      resources: "usable",
      url: "http://localhost/"
    });
    window = dom.window;
    document = window.document;

    // Mock localStorage
    const localStorageMock = (function() {
      let store = {};
      return {
        getItem: function(key) {
          return store[key] || null;
        },
        setItem: function(key, value) {
          store[key] = value.toString();
        },
        clear: function() {
          store = {};
        },
        removeItem: function(key) {
          delete store[key];
        }
      };
    })();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    // Inject and execute the script
    const scriptElement = document.createElement("script");
    scriptElement.textContent = scriptContent;
    document.body.appendChild(scriptElement);

    // Dispatch DOMContentLoaded to trigger the script logic
    document.dispatchEvent(new window.Event("DOMContentLoaded"));
  });

  it('Hamburger menu should be a button element', () => {
    const hamburger = document.querySelector('.hamburger');
    expect(hamburger.tagName, 'Tag name should be BUTTON').to.equal('BUTTON');
  });

  it('Hamburger menu should have aria-label and aria-expanded attributes', () => {
    const hamburger = document.querySelector('.hamburger');
    expect(hamburger.getAttribute('aria-label')).to.equal('Toggle navigation menu');
    expect(hamburger.getAttribute('aria-expanded')).to.equal('false');
  });

  it('Hamburger menu should toggle aria-expanded on click', () => {
    const hamburger = document.querySelector('.hamburger');

    // Click to open
    hamburger.click();
    expect(hamburger.getAttribute('aria-expanded')).to.equal('true');
    expect(hamburger.classList.contains('active')).to.be.true;

    // Click to close
    hamburger.click();
    expect(hamburger.getAttribute('aria-expanded')).to.equal('false');
    expect(hamburger.classList.contains('active')).to.be.false;
  });
});
