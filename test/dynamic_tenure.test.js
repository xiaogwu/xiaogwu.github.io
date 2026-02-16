const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const { expect } = require('chai');

describe('Dynamic Tenure Calculation', () => {
  let html;
  let scriptContent;

  before(() => {
    html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
    scriptContent = fs.readFileSync(path.resolve(__dirname, '../script.js'), 'utf8');
  });

  it('should display 7 years in Feb 2026', () => {
    const dom = new JSDOM(html, {
      runScripts: "dangerously",
      url: "http://localhost"
    });
    const { window } = dom;
    const { document } = window;

    // Mock Date in the window context
    // We need to override Date before the script runs.
    // But we are running script via script tag injection or eval.

    // Let's inject a script that overrides Date first?
    // Or just rely on the fact that JSDOM uses the system time by default?
    // And system time is 2026.

    // Execute script
    const scriptEl = document.createElement('script');
    scriptEl.textContent = scriptContent;
    document.body.appendChild(scriptEl);

    // Trigger DOMContentLoaded
    document.dispatchEvent(new window.Event('DOMContentLoaded'));

    const tenureSpan = document.getElementById('apple-tenure');
    // Start date 2019-02-15
    // Current date (system) 2026-02-16
    // Expected: 7
    expect(tenureSpan.textContent).to.equal('7');
  });

});
