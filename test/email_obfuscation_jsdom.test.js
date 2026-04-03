const { expect } = require('chai');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('Email Obfuscation Logic (JSDOM)', () => {
  let scriptContent;

  before(() => {
    scriptContent = fs.readFileSync(path.resolve(__dirname, '../script.js'), 'utf8');
  });

  it('should correctly set the href of the email link', () => {
    const html = `
      <!DOCTYPE html>
      <html>
      <body>
        <a id="email-link" href="#">Email</a>
      </body>
      </html>
    `;
    const dom = new JSDOM(html, { runScripts: "dangerously" });
    const { window } = dom;
    const document = window.document;

    // Execute script
    const scriptEl = document.createElement('script');
    scriptEl.textContent = scriptContent;
    document.body.appendChild(scriptEl);

    // Mock scrollIntoView which is missing in JSDOM
    window.HTMLElement.prototype.scrollIntoView = function() {};

    // Trigger DOMContentLoaded
    document.dispatchEvent(new window.Event('DOMContentLoaded'));

    const emailLink = document.getElementById('email-link');
    expect(emailLink.href).to.equal('mailto:xiaogwu@gmail.com');
  });

  it('should not throw an error if the email link is missing', () => {
    const html = `
      <!DOCTYPE html>
      <html>
      <body>
      </body>
      </html>
    `;
    const dom = new JSDOM(html, { runScripts: "dangerously" });
    const { window } = dom;
    const document = window.document;

    // Execute script
    const scriptEl = document.createElement('script');
    scriptEl.textContent = scriptContent;
    document.body.appendChild(scriptEl);

    // Mock scrollIntoView which is missing in JSDOM
    window.HTMLElement.prototype.scrollIntoView = function() {};

    expect(() => {
      // Trigger DOMContentLoaded
      document.dispatchEvent(new window.Event('DOMContentLoaded'));
    }).to.not.throw();
  });
});
