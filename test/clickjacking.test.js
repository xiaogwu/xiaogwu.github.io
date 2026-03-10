const { expect } = require('chai');
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('Clickjacking Protection', function() {
  this.timeout(40000);
  let browser, page, serverVictim, serverAttacker;
  const portVictim = 8083;
  const portAttacker = 8085;
  const attackerFilePath = path.join(__dirname, 'attacker.html');

  before(async () => {
    // Create attacker HTML dynamically
    const attackerHtml = `
      <!DOCTYPE html>
      <html>
      <body>
        <h1>Attacker Page</h1>
        <iframe src="http://localhost:${portVictim}/" id="victim" width="800" height="600"></iframe>
      </body>
      </html>
    `;
    fs.writeFileSync(attackerFilePath, attackerHtml);

    // Start victim server (index.html)
    serverVictim = spawn('npx', ['serve', '-l', portVictim], { stdio: 'ignore', shell: true, detached: true });

    // Start attacker server (serving test directory to access attacker.html)
    // Actually npx serve . serves root. attacker.html is in test/
    // So http://localhost:8085/test/attacker.html
    serverAttacker = spawn('npx', ['serve', '-l', portAttacker], { stdio: 'ignore', shell: true, detached: true });

    await new Promise(resolve => setTimeout(resolve, 3000));
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  after(async () => {
    if (browser) await browser.close();
    if (serverVictim) { try { process.kill(-serverVictim.pid); } catch { serverVictim.kill(); } }
    if (serverAttacker) { try { process.kill(-serverAttacker.pid); } catch { serverAttacker.kill(); } }
    // Clean up
    if (fs.existsSync(attackerFilePath)) {
      fs.unlinkSync(attackerFilePath);
    }
  });

  it('should not allow embedding in an iframe', async () => {
    const attackerUrl = `http://localhost:${portAttacker}/test/attacker.html`;

    console.log('Navigating to attacker page:', attackerUrl);
    await page.goto(attackerUrl);

    // Check if frame busting redirected the top window
    try {
        await page.waitForURL((url) => url.toString().startsWith(`http://localhost:${portVictim}`), { timeout: 2000 });
        console.log('Redirected to victim URL (Frame busting worked)');
        return;
    } catch (err) {
            console.error(err);
        console.log('No redirect detected.');
    }

    const frameElement = await page.$('#victim');
    const frame = await frameElement.contentFrame();

    try {
        // Wait for h1 to be visible. If it times out, content is hidden/blocked (Good).
        await frame.waitForSelector('h1', { state: 'visible', timeout: 5000 });
        const text = await frame.textContent('h1');

        if (text.includes('Sean Wu')) {
             expect.fail('Clickjacking successful: Content loaded in iframe');
        }
    } catch(e) {
        if (e.message.includes('Clickjacking successful')) throw e;
        // If timeout, it implies content didn't load (Safe via CSP/Frame Busting)
    }
  });
});
