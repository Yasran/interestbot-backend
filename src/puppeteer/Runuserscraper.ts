import { launchWithCookies } from './login';
import { scrapeUserEngagements } from '../utils/twitter/scrapeuseractivity';
import { TweetModel } from '../models/tweet.model';
import { analyzeAndGenerateTweets } from '../mastra/analyze';
import { connectToDB } from '../db/connect';
import { fetchTweetsWithCookies } from '../utils/twitter/fetchTweets';

export async function scrapeUserActivityAndSave() {
  const allTweets = await fetchTweetsWithCookies();

  return allTweets; // array of { text, type }
}


(async () => {
  await connectToDB();

  try {
    const { browser } = await launchWithCookies();
    const tweets = await scrapeUserEngagements();
    await browser.close();

    if (Array.isArray(tweets) && tweets.length) {
      await TweetModel.insertMany(tweets);
      console.log(`✅ Saved ${tweets.length} tweets to MongoDB`);
    }

    const generated = await analyzeAndGenerateTweets();
    console.log('\n🧠 Generated Tweets:\n');
    generated.forEach((t: string, i: number) => console.log(`${i + 1}. ${t}`));

  } catch (err) {
    if (err instanceof Error) {
      console.error('❌ Error:', err.message);
    } else {
      console.error('❌ Error:', err);
    }
  }
})();
