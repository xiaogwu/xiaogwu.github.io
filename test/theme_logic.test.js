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

    it('should set light mode if time is between 6 AM and 6 PM', () => {
        // Setup: Mock Date to return 10:00 (10 AM)
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

        // Assertions
        const body = document.body;
        const themeToggle = document.getElementById('theme-toggle');

        expect(body.classList.contains('light-mode')).to.be.true;
        expect(themeToggle.textContent).to.equal('☀️');
    });

    it('should set dark mode if time is after 6 PM', () => {
        // Setup: Mock Date to return 20:00 (8 PM)
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

        expect(body.classList.contains('light-mode')).to.be.false;
        expect(themeToggle.textContent).to.equal('🌙');
    });
});
