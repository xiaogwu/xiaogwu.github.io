const { expect } = require('chai');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('Theme Logic in script.js', () => {
    let dom;
    let document;
    let window;
    let scriptContent;

    before(() => {
        scriptContent = fs.readFileSync(path.resolve(__dirname, '../script.js'), 'utf8');
    });

    beforeEach(() => {
        // Setup a basic DOM with the elements required by script.js
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html lang="en">
            <head></head>
            <body>
                <button id="theme-toggle">🌙</button>
            </body>
            </html>
        `, {
            runScripts: 'dangerously',
            resources: 'usable'
        });

        window = dom.window;
        document = window.document;

        // Mock localStorage
        window.localStorage = {
            getItem: () => null,
            setItem: () => {},
        };

        // Mock window.scrollTo
        window.scrollTo = () => {};
    });

    it('should respect light-mode-early class even if time suggests dark mode', () => {
        // Setup: Add light-mode-early to html
        document.documentElement.classList.add('light-mode-early');

        // Setup: Mock Date to return 20:00 (8 PM) - Night time
        const OriginalDate = window.Date;
        window.Date = class extends OriginalDate {
            constructor() {
                super();
            }
            getHours() {
                return 20;
            }
        };

        // Execute script.js
        const scriptElement = document.createElement('script');
        scriptElement.textContent = scriptContent;
        document.body.appendChild(scriptElement);

        // Trigger DOMContentLoaded
        const event = new window.Event('DOMContentLoaded');
        document.dispatchEvent(event);

        // Assertions
        const body = document.body;
        const themeToggle = document.getElementById('theme-toggle');

        // Should be light mode because of the class, ignoring the time
        expect(body.classList.contains('light-mode')).to.be.true;

        // Icon should be sun
        expect(themeToggle.textContent).to.equal('☀️');

        // light-mode-early should be removed
        expect(document.documentElement.classList.contains('light-mode-early')).to.be.false;
    });

    it('should respect absence of light-mode-early class even if time suggests light mode', () => {
        // Setup: Ensure NO light-mode-early on html
        document.documentElement.classList.remove('light-mode-early');

        // Execute script.js
        const scriptElement = document.createElement('script');
        scriptElement.textContent = scriptContent;
        document.body.appendChild(scriptElement);

        // Trigger DOMContentLoaded
        const event = new window.Event('DOMContentLoaded');
        document.dispatchEvent(event);

        // Assertions
        const body = document.body;
        const themeToggle = document.getElementById('theme-toggle');

        // Should be dark mode because of missing class, ignoring the time
        expect(body.classList.contains('light-mode')).to.be.false;

        // Icon should be moon
        expect(themeToggle.textContent).to.equal('🌙');
    });

    it('should toggle theme and update icon when button is clicked', () => {
        // Setup: Ensure NO light-mode-early on html
        document.documentElement.classList.remove('light-mode-early');

        // Setup: Mock Date to return 10:00 (10 AM) - Day time
        const OriginalDate = window.Date;
        window.Date = class extends OriginalDate {
            constructor() {
                super();
            }
            getHours() {
                return 10;
            }
        };

        // Execute script.js
        const scriptElement = document.createElement('script');
        scriptElement.textContent = scriptContent;
        document.body.appendChild(scriptElement);

        // Trigger DOMContentLoaded
        const event = new window.Event('DOMContentLoaded');
        document.dispatchEvent(event);

        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;

        // Initial state (dark mode because no light-mode-early)
        expect(body.classList.contains('light-mode')).to.be.false;
        expect(themeToggle.textContent).to.equal('🌙');

        // Click 1: Toggle to light mode
        themeToggle.click();
        expect(body.classList.contains('light-mode')).to.be.true;
        expect(themeToggle.textContent).to.equal('☀️');

        // Click 2: Toggle back to dark mode
        themeToggle.click();
        expect(body.classList.contains('light-mode')).to.be.false;
        expect(themeToggle.textContent).to.equal('🌙');
    });
});
