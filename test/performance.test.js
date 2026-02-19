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
    const noscripts = document.querySelectorAll('noscript');
    expect(noscripts.length).to.be.at.least(1, 'There should be at least one noscript tag');

    // Check that noscript contains the stylesheet link
    let fontAwesomeFallbackFound = false;
    noscripts.forEach(noscript => {
        if (noscript.innerHTML.includes('font-awesome') && noscript.innerHTML.includes('rel="stylesheet"')) {
            fontAwesomeFallbackFound = true;
        }
    });
    expect(fontAwesomeFallbackFound, 'Font Awesome fallback should exist in noscript').to.be.true;
  });

  it('should not block rendering with Google Fonts', () => {
      // Check that there is no blocking stylesheet link for Google Fonts outside of noscript
      const links = document.querySelectorAll('link[rel="stylesheet"][href*="fonts.googleapis.com"]');
      let blockingFound = false;
      links.forEach(link => {
          // If the link is not inside a noscript tag, it's blocking
          if (!link.closest('noscript')) {
              blockingFound = true;
          }
      });
      expect(blockingFound, 'Google Fonts should not be loaded as a blocking stylesheet').to.be.false;

      // Check for preload link
      const preloadLink = document.querySelector('link[rel="preload"][id="google-fonts-css"][as="style"]');
      expect(preloadLink, 'Google Fonts should be preloaded with id google-fonts-css').to.not.be.null;

      // Check for noscript fallback
      const noscripts = document.querySelectorAll('noscript');
      let googleFontsFallbackFound = false;
      noscripts.forEach(noscript => {
          if (noscript.innerHTML.includes('fonts.googleapis.com') && noscript.innerHTML.includes('rel="stylesheet"')) {
              googleFontsFallbackFound = true;
          }
      });
      expect(googleFontsFallbackFound, 'Google Fonts fallback should exist in noscript').to.be.true;
  });
});
