const { expect } = require('chai');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('Typography Switcher Logic in script.js', () => {
    let dom;
    let document;
    let window;
    let scriptContent;
    let localStorageMock;

    before(() => {
        scriptContent = fs.readFileSync(path.resolve(__dirname, '../script.js'), 'utf8');
    });

    beforeEach(() => {
        // Setup JSDOM
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html lang="en">
            <head></head>
            <body>
                <select id="typography-select">
                    <option value="system">System</option>
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="tech">Tech</option>
                </select>
                <!-- Include other elements to avoid errors if script tries to access them -->
                <button id="theme-toggle">🌙</button>
            </body>
            </html>
        `, {
            runScripts: 'dangerously',
            resources: 'usable',
            url: 'http://localhost'
        });

        window = dom.window;
        document = window.document;

        // Mock localStorage
        localStorageMock = (() => {
            let store = {};
            return {
                getItem: (key) => store[key] || null,
                setItem: (key, value) => {
                    store[key] = value.toString();
                },
                clear: () => {
                    store = {};
                },
                removeItem: (key) => {
                    delete store[key];
                }
            };
        })();

        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock
        });

        // Mock window.scrollTo
        window.scrollTo = () => {};
    });

    const loadScript = () => {
        const scriptElement = document.createElement('script');
        scriptElement.textContent = scriptContent;
        document.body.appendChild(scriptElement);
        document.dispatchEvent(new window.Event('DOMContentLoaded'));
    };

    it('should default to "modern" if no preference is saved', () => {
        loadScript();
        const select = document.getElementById('typography-select');
        expect(select.value).to.equal('modern');
        expect(document.body.classList.contains('typography-modern')).to.be.true;
    });

    it('should apply saved preference "classic" on load', () => {
        localStorageMock.setItem('typography-preference', 'classic');
        loadScript();
        const select = document.getElementById('typography-select');
        expect(select.value).to.equal('classic');
        expect(document.body.classList.contains('typography-classic')).to.be.true;
    });

    it('should apply saved preference "tech" on load', () => {
        localStorageMock.setItem('typography-preference', 'tech');
        loadScript();
        const select = document.getElementById('typography-select');
        expect(select.value).to.equal('tech');
        expect(document.body.classList.contains('typography-tech')).to.be.true;
    });

    it('should apply saved preference "system" on load (no class)', () => {
        localStorageMock.setItem('typography-preference', 'system');
        loadScript();
        const select = document.getElementById('typography-select');
        expect(select.value).to.equal('system');
        expect(document.body.classList.contains('typography-modern')).to.be.false;
        expect(document.body.classList.contains('typography-classic')).to.be.false;
        expect(document.body.classList.contains('typography-tech')).to.be.false;
    });

    it('should update preference and class when changed', () => {
        loadScript();
        const select = document.getElementById('typography-select');

        // Initial state
        expect(select.value).to.equal('modern');
        expect(document.body.classList.contains('typography-modern')).to.be.true;

        // Change to 'classic'
        select.value = 'classic';
        select.dispatchEvent(new window.Event('change'));

        expect(localStorageMock.getItem('typography-preference')).to.equal('classic');
        expect(document.body.classList.contains('typography-classic')).to.be.true;
        expect(document.body.classList.contains('typography-modern')).to.be.false;
    });

    it('should remove all typography classes when changed to "system"', () => {
        // Start with 'modern'
        loadScript();
        const select = document.getElementById('typography-select');

        // Change to 'system'
        select.value = 'system';
        select.dispatchEvent(new window.Event('change'));

        expect(localStorageMock.getItem('typography-preference')).to.equal('system');
        expect(document.body.classList.contains('typography-modern')).to.be.false;
        expect(document.body.classList.contains('typography-classic')).to.be.false;
        expect(document.body.classList.contains('typography-tech')).to.be.false;
    });
});
