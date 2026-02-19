const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const { expect } = require('chai');

describe('Typography Security', () => {
    let dom;
    let document;
    let window;

    // Load HTML but remove external script/css references to avoid JSDOM errors
    let htmlContent = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
    // Remove <script src="..."> tags to prevent JSDOM from trying to load them
    htmlContent = htmlContent.replace(/<script src="[^"]+"><\/script>/g, '');
    // Remove <link ...> tags to prevent CSS loading errors
    htmlContent = htmlContent.replace(/<link[^>]+>/g, '');

    const scriptContent = fs.readFileSync(path.resolve(__dirname, '../script.js'), 'utf8');

    beforeEach(() => {
        dom = new JSDOM(htmlContent, {
            runScripts: "dangerously",
            resources: "usable",
            url: "http://localhost",
            beforeParse(window) {
                let storage = {};
                window.localStorage = {
                    getItem: (key) => storage[key] || null,
                    setItem: (key, value) => { storage[key] = value.toString(); },
                    removeItem: (key) => { delete storage[key]; },
                    clear: () => { storage = {}; }
                };
            }
        });
        window = dom.window;
        document = window.document;
    });

    it('should sanitize invalid typography preference from localStorage', (done) => {
        // Set an invalid value
        window.localStorage.setItem('typography-preference', 'invalid-value');

        // Execute the script manually
        const scriptEl = document.createElement('script');
        scriptEl.textContent = scriptContent;
        document.body.appendChild(scriptEl);

        // Simulate DOMContentLoaded
        window.document.dispatchEvent(new window.Event("DOMContentLoaded"));

        setTimeout(() => {
            const classes = Array.from(document.body.classList);
            console.log('Body classes:', classes);

            const hasInvalidClass = document.body.classList.contains('typography-invalid-value');
            const hasModernClass = document.body.classList.contains('typography-modern');

            // Expect invalid class NOT to be present
            expect(hasInvalidClass, 'Should not have invalid class').to.be.false;

            // Expect fallback class to be present
            expect(hasModernClass, 'Should have fallback class').to.be.true;

            done();
        }, 100);
    });
});
