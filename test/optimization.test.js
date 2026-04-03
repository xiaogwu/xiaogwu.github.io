const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

describe('Optimization Logic', () => {
    let scriptContent;
    let mockElements;
    let eventListeners;
    let context;

    before(() => {
        scriptContent = fs.readFileSync(path.resolve(__dirname, '../script.js'), 'utf8');
    });

    beforeEach(() => {
        // Mock DOM elements
        mockElements = {
            'google-fonts-css': { id: 'google-fonts-css', rel: 'preload' },
            'font-awesome-css': { id: 'font-awesome-css', rel: 'preload' }
        };

        eventListeners = {};

        const mockDocument = {
            getElementById: (id) => mockElements[id] || null,
            addEventListener: (event, callback) => {
                if (!eventListeners[event]) {
                    eventListeners[event] = [];
                }
                eventListeners[event].push(callback);
            },
            documentElement: {
                classList: {
                    contains: () => false,
                    remove: () => {}
                }
            },
            body: {
                classList: {
                    add: () => {},
                    remove: () => {},
                    contains: () => false,
                    toggle: () => {}
                },
                appendChild: () => {}
            },
            querySelector: () => null,
            querySelectorAll: () => [],
            createElement: () => ({ style: {}, prepend: () => {} })
        };

        const mockWindow = {
            document: mockDocument,
            addEventListener: (event, callback) => {
                if (!eventListeners[event]) {
                    eventListeners[event] = [];
                }
                eventListeners[event].push(callback);
            },
            localStorage: {
                getItem: () => null,
                setItem: () => {}
            },
            Date: class {
                constructor() { return new Date(); }
                getFullYear() { return 2026; }
                getMonth() { return 0; }
                getDate() { return 1; }
                getHours() { return 12; }
            },
            Event: class {
                constructor(type) { this.type = type; }
            },
            IntersectionObserver: class {
                observe() {}
            }
        };

        // Create a sandbox with the mocks
        context = vm.createContext({
            document: mockDocument,
            window: mockWindow,
            console: { log: () => {}, error: () => {} }, // Silence console in tests
            localStorage: mockWindow.localStorage,
            Date: mockWindow.Date,
            IntersectionObserver: mockWindow.IntersectionObserver
        });
    });

    it('should activate Google Fonts immediately', () => {
        try {
            vm.runInContext(scriptContent, context);
        } catch {
            // Ignore execution errors from later parts of the script
        }
        assert.strictEqual(mockElements['google-fonts-css'].rel, 'stylesheet', 'Google Fonts should be activated immediately');
    });

    it('should defer Font Awesome activation until DOMContentLoaded', () => {
        try {
            vm.runInContext(scriptContent, context);
        } catch {
            // Ignore
        }

        // Before DOMContentLoaded
        assert.strictEqual(mockElements['font-awesome-css'].rel, 'preload', 'Font Awesome should still be preloaded before DOMContentLoaded');

        // Trigger DOMContentLoaded
        if (eventListeners['DOMContentLoaded']) {
            eventListeners['DOMContentLoaded'].forEach(cb => cb());
        }

        // After DOMContentLoaded
        assert.strictEqual(mockElements['font-awesome-css'].rel, 'stylesheet', 'Font Awesome should be activated after DOMContentLoaded');
    });
});
