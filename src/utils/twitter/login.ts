import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const COOKIE_PATH = path.join(__dirname, '../../../cookies/demo_user.json');

export async function loginAndSaveCookies() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized'],
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Adjust as needed
  });

  const page = await browser.newPage();

  try {
    await page.goto('https://twitter.com/login', {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    console.log('✅ Please log in manually in the browser...');

    await page.waitForFunction(
      () => window.location.href.includes('/home'),
      { timeout: 1000 * 60 * 3 } // 3 min max
    );

    const cookies = await page.cookies();
    fs.writeFileSync(COOKIE_PATH, JSON.stringify(cookies, null, 2));

    console.log('✅ Cookies saved to', COOKIE_PATH);
    console.log('⏳ Keeping browser open. Press Ctrl+C to exit.');
    await new Promise(() => {}); // keeps browser open
  } catch (err) {
    console.error('❌ Login failed:', err);
    await browser.close();
  }
}
