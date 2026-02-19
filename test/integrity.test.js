const { expect } = require('chai');
const { chromium } = require('playwright');
const { spawn } = require('child_process');

describe('SRI Integrity Check', function() {
  this.timeout(30000);
  let browser, page, server;
  const port = 8083;

  before(async () => {
    server = spawn('npx', ['http-server', '-p', port], { stdio: 'ignore', shell: true, detached: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  after(async () => {
    if (browser) await browser.close();
    if (server) { try { process.kill(-server.pid); } catch { server.kill(); } }
  });

  it('should have SRI integrity on Font Awesome link', async () => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto(`http://localhost:${port}`);

    // Wait for the dynamic link to be added
    const linkSelector = 'link[href*="font-awesome"][rel="stylesheet"]';
    await page.waitForSelector(linkSelector, { state: 'attached' });

    const integrity = await page.getAttribute(linkSelector, 'integrity');
    const crossOrigin = await page.getAttribute(linkSelector, 'crossorigin');

    expect(integrity).to.equal('sha384-5e2ESR8Ycmos6g3gAKr1Jvwye8sW4U1u/cAKulfVJnkakCcMqhOudbtPnvJ+nbv7');
    expect(crossOrigin).to.equal('anonymous');

    // Ensure no console errors related to integrity
    const integrityErrors = errors.filter(e => e.includes('integrity') || e.includes('SRI'));
    expect(integrityErrors, 'Console errors related to integrity found').to.be.empty;
  });

  it('should have SRI integrity on preload link', async () => {
      await page.goto(`http://localhost:${port}`);
      const preloadSelector = 'link[href*="font-awesome"][rel="preload"]';
      const integrity = await page.getAttribute(preloadSelector, 'integrity');
      const crossOrigin = await page.getAttribute(preloadSelector, 'crossorigin');

      expect(integrity).to.equal('sha384-5e2ESR8Ycmos6g3gAKr1Jvwye8sW4U1u/cAKulfVJnkakCcMqhOudbtPnvJ+nbv7');
      expect(crossOrigin).to.equal('anonymous');
  });
});
