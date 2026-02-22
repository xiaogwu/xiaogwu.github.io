const { JSDOM, VirtualConsole } = require('jsdom');
const fs = require('fs');
const path = require('path');
const { expect } = require('chai');

describe('Dynamic Copyright Year', () => {
  let html;
  let scriptContent;

  before(() => {
    html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
    scriptContent = fs.readFileSync(path.resolve(__dirname, '../script.js'), 'utf8');
  });

  it('should display the current year in the footer', () => {
    // Suppress "Could not load ..." errors from JSDOM trying to fetch local resources
    const virtualConsole = new VirtualConsole();
    virtualConsole.sendTo(console);
    virtualConsole.on("jsdomError", (err) => {
        if (err.message.includes("Could not load")) {
            return;
        }
        console.error(err);
    });

    const dom = new JSDOM(html, {
      runScripts: "dangerously",
      url: "http://localhost",
      virtualConsole
    });
    const { window } = dom;
    const { document } = window;

    // Inject script content manually because runScripts: "dangerously"
    // will execute <script> tags present in the HTML, but since
    // script.js is external, JSDOM might not load it automatically without a server.
    // So we manually inject the script content to be sure.

    // However, the script is inside `DOMContentLoaded`, so we need to inject it
    // and then trigger the event.

    // Note: The script in index.html is <script src="script.js"></script>.
    // JSDOM won't load local files by default unless configured with proper resources.
    // Instead of relying on JSDOM to load it, we'll strip the external script tag
    // and inject the content directly.

    const scriptEl = document.createElement('script');
    scriptEl.textContent = scriptContent;
    document.body.appendChild(scriptEl);

    // Trigger DOMContentLoaded
    document.dispatchEvent(new window.Event('DOMContentLoaded'));

    const yearSpan = document.getElementById('copyright-year');
    expect(yearSpan).to.not.be.null;

    const currentYear = new Date().getFullYear().toString();
    expect(yearSpan.textContent).to.equal(currentYear);
  });
});
