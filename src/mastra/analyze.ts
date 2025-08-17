import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import { TweetModel } from '../models/tweet.model';
import GeneratedTweet from '../models/generatedtweet.model';

export async function analyzeAndGenerateTweets() {
  const likedTweets = await TweetModel.find().lean();
  const tweetTexts = likedTweets.map(t => t.text).join('\n');

  const agent = new Agent({
    name: 'interest-analyzer',
    instructions: `Analyze the user's liked, retweeted, and replied tweets to summarize interests, then generate 5–7 realistic tweets that sound natural.`,
    model: openai('gpt-4'),
  });

  const response = await agent.generate([
    { role: 'user', content: tweetTexts },
  ]);

  const generated = response.text.trim().split('\n').filter(l => l);
  console.log('📝 Generated Tweets:', generated);

  await GeneratedTweet.insertMany(generated.map(text => ({ text })));
  return generated;
}
