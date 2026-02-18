const { expect } = require('chai');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('Performance Optimization', () => {
  let html;
  let dom;
  let document;

  before(() => {
    html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
    dom = new JSDOM(html);
    document = dom.window.document;
  });

  it('should lazy load the about image', () => {
    const aboutImage = document.querySelector('#about .about-image img');
    expect(aboutImage).to.not.be.null;
    expect(aboutImage.getAttribute('loading')).to.equal('lazy');
  });

  it('should not block rendering with Font Awesome', () => {
    // Check that there is no blocking stylesheet link for Font Awesome outside of noscript
    const links = document.querySelectorAll('link[rel="stylesheet"][href*="font-awesome"]');
    let blockingFound = false;
    links.forEach(link => {
        // If the link is not inside a noscript tag, it's blocking
        if (!link.closest('noscript')) {
            blockingFound = true;
        }
    });
    expect(blockingFound, 'Font Awesome should not be loaded as a blocking stylesheet').to.be.false;

    // Check for preload link
    const preloadLink = document.querySelector('link[rel="preload"][href*="font-awesome"][as="style"]');
    expect(preloadLink, 'Font Awesome should be preloaded').to.not.be.null;

    // Check for noscript fallback
    const noscript = document.querySelector('noscript');
    expect(noscript, 'There should be a noscript tag').to.not.be.null;

    // Check that noscript contains the stylesheet link
    // Note: JSDOM might treat noscript content as text or elements depending on configuration
    // We check innerHTML to be safe
    expect(noscript.innerHTML).to.include('font-awesome');
    expect(noscript.innerHTML).to.include('rel="stylesheet"');
  });
});
