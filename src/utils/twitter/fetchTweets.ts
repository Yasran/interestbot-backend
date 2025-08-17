
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export async function fetchTweetsWithCookies() {
  const cookiePath = path.join(__dirname, '../../../cookies/demo_user.json');

  if (!fs.existsSync(cookiePath)) {
    console.error('❌ No cookies found. Please run login first.');
    return;
  }

  const cookies = JSON.parse(fs.readFileSync(cookiePath, 'utf-8'));

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });

  const page = await browser.newPage();
  await browser.setCookie(...cookies);

  try {
    await page.goto('https://twitter.com/home', { waitUntil: 'networkidle2' });

    // Detect login redirect
    if (page.url().includes('/login')) {
      console.log('🔐 Session expired. Please login again.');
      await browser.close();
      return;
    }

    // Scroll randomly
    for (let i = 0; i < 5; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));
      await page.evaluate(() => {
        window.scrollBy(0, Math.floor(Math.random() * 400 + 200));
      });
    }

    console.log('✅ Reached feed, tweets ready to scrape.');
    // TODO: extract tweets from page.evaluate()

    await browser.close();
  } catch (err) {
    console.error('❌ Failed to fetch tweets:', err);
    await browser.close();
  }
}
