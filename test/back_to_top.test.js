const { expect } = require('chai');
const { JSDOM, VirtualConsole } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('Back to Top Button', () => {
  let html;
  let scriptContent;
  let dom;
  let document;
  let window;
  let backToTopButton;
  let footer;

  before(() => {
    html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
    // Remove CSP to allow inline script injection for testing
    html = html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/, '');
    // Remove external script to avoid ECONNREFUSED
    html = html.replace(/<script src="script.js"[^>]*><\/script>/, '');
    // Remove external css to avoid ECONNREFUSED
    html = html.replace(/<link rel="stylesheet" href="style.css">/, '');
    // Remove Google Fonts preload
    html = html.replace(/<link rel="preload"[^>]*id="google-fonts-css"[^>]*>/, '');
    // Remove Font Awesome preload
    html = html.replace(/<link rel="preload"[^>]*id="font-awesome-css"[^>]*>/, '');

    scriptContent = fs.readFileSync(path.resolve(__dirname, '../script.js'), 'utf8');
  });

  beforeEach(() => {
    // Suppress console errors from JSDOM resource loader if any remain
    const virtualConsole = new VirtualConsole();
    virtualConsole.sendTo(console, { omitJSDOMErrors: true });

    dom = new JSDOM(html, {
      runScripts: "dangerously",
      resources: "usable",
      url: "http://localhost",
      virtualConsole
    });
    window = dom.window;
    document = window.document;

    // Mock scrollTo
    window.scrollTo = () => {};

    // Mock window properties
    // Note: redefine properties before script runs
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });

    // Execute script
    const scriptEl = document.createElement('script');
    scriptEl.textContent = scriptContent;
    document.body.appendChild(scriptEl);

    // Trigger DOMContentLoaded
    document.dispatchEvent(new window.Event('DOMContentLoaded'));

    backToTopButton = document.getElementById('back-to-top');
    footer = document.querySelector('footer');

    // Mock footer.offsetTop
    if (footer) {
        Object.defineProperty(footer, 'offsetTop', { value: 2000, writable: true });
    }
  });

  it('should exist in the DOM', () => {
    expect(backToTopButton).to.not.be.null;
  });

  it('should have the correct aria-label', () => {
    expect(backToTopButton.getAttribute('aria-label')).to.equal('Back to top');
  });

  it('should contain the arrow icon', () => {
    const icon = backToTopButton.querySelector('i');
    expect(icon).to.not.be.null;
    expect(icon.className).to.include('fas');
    expect(icon.className).to.include('fa-arrow-up');
  });

  it('should be hidden by default', () => {
    expect(backToTopButton.classList.contains('visible')).to.be.false;
  });

  it('should become visible when scrolled past 300px', () => {
    window.scrollY = 301;
    window.dispatchEvent(new window.Event('scroll'));
    expect(backToTopButton.classList.contains('visible')).to.be.true;
  });

  it('should remain hidden when scrolled less than 300px', () => {
    window.scrollY = 299;
    window.dispatchEvent(new window.Event('scroll'));
    expect(backToTopButton.classList.contains('visible')).to.be.false;
  });

  it('should hide when scrolled back up', () => {
    window.scrollY = 500;
    window.dispatchEvent(new window.Event('scroll'));
    expect(backToTopButton.classList.contains('visible')).to.be.true;

    window.scrollY = 100;
    window.dispatchEvent(new window.Event('scroll'));
    expect(backToTopButton.classList.contains('visible')).to.be.false;
  });

  it('should hide when footer is visible', () => {
    // footer.offsetTop is 2000
    // window.innerHeight is 800
    // We want footerVisible to be true
    // (innerHeight + scrollY) >= offsetTop
    // 800 + scrollY >= 2000 => scrollY >= 1200

    window.scrollY = 1200;

    // Also need scrolledPastThreshold (1200 > 300) -> true

    // Logic: if (scrolledPastThreshold && !footerVisible) -> show
    // True && !True -> False -> hide

    window.dispatchEvent(new window.Event('scroll'));
    expect(backToTopButton.classList.contains('visible')).to.be.false;
  });

  it('should be visible when scrolled past threshold but footer is not visible', () => {
    // scrollY = 1199 -> 800 + 1199 = 1999 < 2000 -> footer not visible
    window.scrollY = 1199;

    window.dispatchEvent(new window.Event('scroll'));

    // True && !False -> True -> show
    expect(backToTopButton.classList.contains('visible')).to.be.true;
  });

  it('should scroll to top when clicked', (done) => {
    window.scrollTo = (options) => {
        try {
            expect(options.top).to.equal(0);
            expect(options.behavior).to.equal('smooth');
            done();
        } catch (e) {
            done(e);
        }
    };

    backToTopButton.click();
  });
});
