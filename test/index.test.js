const { expect } = require('chai');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('index.html structure', () => {
  let html;
  let dom;
  let document;

  before(() => {
    html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
    dom = new JSDOM(html);
    document = dom.window.document;
  });

  it('should have a DOCTYPE', () => {
    expect(dom.window.document.doctype).to.not.be.null;
    expect(dom.window.document.doctype.name).to.equal('html');
  });

  it('should have an <html> tag', () => {
    expect(document.querySelector('html')).to.not.be.null;
    // Check for explicit tag in source
    expect(html).to.match(/<html.*?>/i);
  });

  it('should have a <head> tag', () => {
    expect(document.querySelector('head')).to.not.be.null;
    expect(html).to.match(/<head.*?>/i);
  });

  it('should have a <body> tag', () => {
    expect(document.querySelector('body')).to.not.be.null;
    expect(html).to.match(/<body.*?>/i);
  });

  it('should have a <title> tag with content', () => {
    const title = document.querySelector('title');
    expect(title).to.not.be.null;
    expect(title.textContent).to.not.be.empty;
  });

  it('should have essential meta tags', () => {
    const charset = document.querySelector('meta[charset]');
    const viewport = document.querySelector('meta[name="viewport"]');
    const compatible = document.querySelector('meta[http-equiv="X-UA-Compatible"]');

    expect(charset, 'charset meta tag').to.not.be.null;
    expect(viewport, 'viewport meta tag').to.not.be.null;
    expect(compatible, 'X-UA-Compatible meta tag').to.not.be.null;
  });
});
