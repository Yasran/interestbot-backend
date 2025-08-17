import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const COOKIES_PATH = path.join(__dirname, '../../../cookies/demo_user.json');

export async function launchWithCookies() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();

  if (fs.existsSync(COOKIES_PATH)) {
    const cookies = JSON.parse(fs.readFileSync(COOKIES_PATH, 'utf-8'));
    await page.setCookie(...cookies);
    console.log('✅ Cookies loaded');
  } else {
    console.warn('⚠️ No cookies found, please log in manually first.');
    throw new Error('Login required');
  }

  await page.goto('https://twitter.com/home', { waitUntil: 'domcontentloaded' });

  if (page.url().includes('login')) {
    throw new Error('❌ Session expired. Please re-login.');
  }

  return { browser, page };
}
