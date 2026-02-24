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

  const createTestEnvironment = (currentDateString) => {
    const dom = new JSDOM(html, {
      runScripts: "dangerously",
      url: "http://localhost"
    });
    const { window } = dom;
    const { document } = window;

    // Mock Date
    const originalDate = window.Date;
    const fixedTime = new Date(currentDateString).getTime();

    // Override Date constructor
    window.Date = class extends originalDate {
      constructor(...args) {
        if (args.length === 0) {
          return new originalDate(fixedTime);
        }
        return new originalDate(...args);
      }

      static now() {
        return fixedTime;
      }
    };

    // Inject script content
    const scriptEl = document.createElement('script');
    scriptEl.textContent = scriptContent;
    document.body.appendChild(scriptEl);

    // Trigger DOMContentLoaded
    document.dispatchEvent(new window.Event('DOMContentLoaded'));

    return document.getElementById('apple-tenure').textContent;
  };

  it('should calculate tenure correctly before anniversary (Oct 26, 2025 -> 6 years)', () => {
    const result = createTestEnvironment('2025-10-26T12:00:00Z');
    expect(result).to.equal('6');
  });

  it('should calculate tenure correctly on anniversary (Nov 26, 2025 -> 7 years)', () => {
    const result = createTestEnvironment('2025-11-26T12:00:00Z');
    expect(result).to.equal('7');
  });

  it('should calculate tenure correctly after anniversary (Dec 26, 2025 -> 7 years)', () => {
    const result = createTestEnvironment('2025-12-26T12:00:00Z');
    expect(result).to.equal('7');
  });

  it('should calculate tenure correctly next year before anniversary (Jan 26, 2026 -> 7 years)', () => {
    const result = createTestEnvironment('2026-01-26T12:00:00Z');
    expect(result).to.equal('7');
  });

  it('should calculate tenure correctly next year after anniversary (Dec 26, 2026 -> 8 years)', () => {
    const result = createTestEnvironment('2026-12-26T12:00:00Z');
    expect(result).to.equal('8');
  });

  it('should calculate tenure correctly on day before anniversary (Nov 25, 2025 -> 6 years)', () => {
    const result = createTestEnvironment('2025-11-25T12:00:00Z');
    expect(result).to.equal('6');
  });

  it('should calculate tenure correctly on day after anniversary (Nov 27, 2025 -> 7 years)', () => {
    const result = createTestEnvironment('2025-11-27T12:00:00Z');
    expect(result).to.equal('7');
  });
});
