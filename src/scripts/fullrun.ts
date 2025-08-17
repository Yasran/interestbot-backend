
import { scrapeUserActivityAndSave } from '../puppeteer/Runuserscraper';
import { analyzeAndGenerateTweets } from '../mastra/analyze';
import '../../.env';
import { connectToDB } from '../db/connect';

(async () => {
  await connectToDB();

  console.log('🚀 Scraping tweets...');
  const scraped = await scrapeUserActivityAndSave();
  console.log(`✅ Scraped ${scraped} tweets`);

  console.log('\n🧠 Running analysis...');
  const result = await analyzeAndGenerateTweets();

  console.log('\n✅ Done!');
  process.exit(0);
})();
