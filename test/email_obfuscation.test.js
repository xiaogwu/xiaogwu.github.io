const { Script } = require('node:vm');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

describe('Email Obfuscation Logic (no-jsdom)', () => {
  let scriptContent;

  before(() => {
    scriptContent = fs.readFileSync(path.resolve(__dirname, '../script.js'), 'utf8');
  });

  const createMockEnvironment = (overrides = {}) => {
    let emailLinkHref = '';

    const mockLocalStorage = {
      getItem: () => null,
      setItem: () => {}
    };

    const mockDocument = {
      getElementById: (id) => {
        if (overrides.missingIds && overrides.missingIds.includes(id)) return null;

        if (id === 'email-link') {
          return {
            set href(val) { emailLinkHref = val; },
            get href() { return emailLinkHref; },
            getAttribute: (attr) => attr === 'href' ? emailLinkHref : null
          };
        }
        if (id === 'google-fonts-css') return { rel: 'preload' };
        if (id === 'font-awesome-css') return { rel: 'preload' };
        if (id === 'apple-tenure') return { textContent: '' };
        if (id === 'copyright-year') return { textContent: '' };
        if (id === 'theme-toggle') return { addEventListener: () => {}, textContent: '' };
        if (id === 'typography-select') return { addEventListener: () => {}, value: '' };
        if (id === 'back-to-top') return { classList: { add: () => {}, remove: () => {} }, addEventListener: () => {} };
        return null;
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
        prepend: () => {},
        appendChild: () => {}
      },
      addEventListener: (event, cb) => {
        if (event === 'DOMContentLoaded') {
          cb();
        }
      },
      querySelector: (sel) => {
        if (sel === '.hamburger') return { addEventListener: () => {}, classList: { toggle: () => {}, contains: () => {}, remove: () => {} }, setAttribute: () => {} };
        if (sel === '.nav-links') return { addEventListener: () => {}, classList: { toggle: () => {}, contains: () => {}, remove: () => {} }, setAttribute: () => {} };
        if (sel === 'footer') return { offsetTop: 1000 };
        return null;
      },
      createElement: () => ({ style: {}, setAttribute: () => {}, appendChild: () => {} }),
      dispatchEvent: () => {}
    };

    const mockWindow = {
      document: mockDocument,
      addEventListener: () => {},
      Event: function(name) { return { name }; },
      Date: Date,
      localStorage: mockLocalStorage,
      scrollTo: () => {},
      innerHeight: 800,
      scrollY: 0
    };

    const context = {
      window: mockWindow,
      document: mockDocument,
      console: console,
      setTimeout: setTimeout,
      setInterval: setInterval,
      clearTimeout: clearTimeout,
      clearInterval: clearInterval,
      navigator: { userAgent: 'node' },
      Date: Date,
      IntersectionObserver: class {
        observe() {}
      },
      localStorage: mockLocalStorage
    };

    return { context, getEmailHref: () => emailLinkHref };
  };

  it('should correctly set the href of the email link', () => {
    const { context, getEmailHref } = createMockEnvironment();
    const script = new Script(scriptContent);
    script.runInNewContext(context);
    assert.strictEqual(getEmailHref(), 'mailto:xiaogwu@gmail.com');
  });

  it('should not throw an error if the email link is missing', () => {
    const { context } = createMockEnvironment({ missingIds: ['email-link'] });
    const script = new Script(scriptContent);
    assert.doesNotThrow(() => {
      script.runInNewContext(context);
    });
  });
});
