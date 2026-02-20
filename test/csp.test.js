const { expect } = require('chai');
const { chromium } = require('playwright');
const { spawn } = require('child_process');

describe('Content Security Policy', function() {
  this.timeout(30000);
  let browser, page, server;
  const port = 8082;

  before(async () => {
    server = spawn('npx', ['serve', '-l', port], { stdio: 'ignore', shell: true, detached: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  after(async () => {
    if (browser) await browser.close();
    if (server) { try { process.kill(-server.pid); } catch { server.kill(); } }
  });

  it('should have a CSP meta tag', async () => {
    await page.goto(`http://localhost:${port}`);
    const content = await page.getAttribute('meta[http-equiv="Content-Security-Policy"]', 'content');
    expect(content).to.include("default-src 'self'").and.include("script-src 'self'");
    expect(content).to.include("object-src 'none'");
    expect(content).to.include("base-uri 'self'");
    expect(content).to.include("form-action 'self'");
  });

  it('should have a referrer policy', async () => {
    await page.goto(`http://localhost:${port}`);
    const content = await page.getAttribute('meta[name="referrer"]', 'content');
    expect(content).to.equal("strict-origin-when-cross-origin");
  });

  it('should not have CSP violations', async () => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && (msg.text().includes('Content Security Policy') || msg.text().includes('violates'))) errors.push(msg.text());
    });
    await page.goto(`http://localhost:${port}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    expect(errors, 'CSP violations detected').to.be.empty;
  });
});
