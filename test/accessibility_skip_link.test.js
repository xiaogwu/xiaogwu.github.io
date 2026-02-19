const { expect } = require('chai');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('Accessibility Skip Link Tests', () => {
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

  it('should have a skip-link element as the first child of body', () => {
    const firstChild = document.body.firstElementChild;
    expect(firstChild.classList.contains('skip-link')).to.be.true;
    expect(firstChild.tagName).to.equal('A');
    expect(firstChild.getAttribute('href')).to.equal('#main-content');
    expect(firstChild.textContent.trim()).to.equal('Skip to main content');
  });

  it('should have a main element with id main-content', () => {
    const main = document.getElementById('main-content');
    expect(main).to.not.be.null;
    expect(main.tagName).to.equal('MAIN');
  });
});
