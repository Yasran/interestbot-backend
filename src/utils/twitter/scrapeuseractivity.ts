// src/utils/twitter/scrapeUserActivity.ts
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { TweetModel } from '../../models/tweet.model';
import { delay, getRandomInt } from '../helper/delay';
import { getLoggedInUsername } from './getusername';

export async function scrapeUserEngagements() {
  const cookiePath = path.join(__dirname, '../../../cookies/demo_user.json');

  if (!fs.existsSync(cookiePath)) {
    console.error('❌ No saved cookies. Login required.');
    return;
  }

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ['--no-sandbox'],
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });

  const page = await browser.newPage();
  const cookies = JSON.parse(fs.readFileSync(cookiePath, 'utf-8'));
  await page.setCookie(...cookies);

  try {
    const username = await getLoggedInUsername(page);

    const likedTweets: { text: string; type: string }[] = [];
    await page.goto(`https://twitter.com/${username}/likes`, { waitUntil: 'networkidle2' });
    console.log('📄 On Likes page');

    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await delay(getRandomInt(2000, 4000));
    }

    const likes = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('article')).map(article => {
        const spans = article.querySelectorAll('div[lang]');
        const text = Array.from(spans).map(span => span.textContent).join(' ');
        return { text, type: 'like' };
      }).filter(tweet => tweet.text.length > 0);
    });

    likedTweets.push(...likes);

    // Step 2: Scrape retweets & replies from timeline
    const homeTweets: { text: string; type: string }[] = [];
    await page.goto('https://twitter.com/home', { waitUntil: 'networkidle2' });

    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await delay(getRandomInt(2000, 4000));
    }

    const retweetsAndReplies = await page.evaluate(() => {
      const tweets: { text: string; type: string }[] = [];

      document.querySelectorAll('article').forEach(article => {
        const spans = article.querySelectorAll('div[lang]');
        const text = Array.from(spans).map(span => span.textContent).join(' ');

        const retweetIndicator = article.innerHTML.includes('Retweeted');
        const replyIndicator = article.innerHTML.includes('Replying to');

        if (retweetIndicator) tweets.push({ text, type: 'retweet' });
        else if (replyIndicator) tweets.push({ text, type: 'reply' });
      });

      return tweets;
    });

    homeTweets.push(...retweetsAndReplies);

    const allTweets = [...likedTweets, ...homeTweets];
    console.log(`📥 Scraped ${allTweets.length} tweets (likes + retweets + replies)`);

    await TweetModel.insertMany(allTweets.map(t => ({ text: t.text, type: t.type })));
    console.log('✅ Saved to MongoDB');

    await browser.close();
  } catch (err) {
    console.error('❌ Scraping failed:', err);
    await browser.close();
  }
}
