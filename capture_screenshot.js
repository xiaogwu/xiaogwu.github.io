const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');

(async () => {
  // Start the server
  const server = spawn('npx', ['serve', '-l', '8080'], {
    stdio: 'ignore',
    shell: true
  });

  console.log('Server started on port 8080');

  // Give the server a moment to start
  await new Promise(resolve => setTimeout(resolve, 2000));

  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();

    // Go to the local server
    await page.goto('http://localhost:8080');

    // Take screenshot
    // Sanitized input
    const arg = process.argv[2] || 'screenshot.png';
    const filename = path.basename(arg);
    const safeFilename = filename.endsWith('.png') ? filename : `${filename}.png`;
    const screenshotPath = path.join(process.cwd(), safeFilename);

    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved to ${screenshotPath}`);

  } catch (error) {
    console.error('Error taking screenshot:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
    // Kill the server
    server.kill();
    process.exit(0);
  }
})();
