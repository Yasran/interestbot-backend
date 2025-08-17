import type { Page } from 'puppeteer';

export async function getLoggedInUsername(page: Page): Promise<string> {
    await page.goto('https://twitter.com/home', { waitUntil: 'networkidle2' });
    const url = await page.url();

    // If not logged in, redirect might occur
    if (!url.includes('/home')) throw new Error('Not logged in');
  
    const username = await page.evaluate(() => {
      const meta = document.querySelector('a[role="link"][href^="/"]');
      return meta?.getAttribute('href')?.replace('/', '') ?? '';
    });
  
    if (!username) throw new Error('Username not found from page');
  
    return username;
  }
  