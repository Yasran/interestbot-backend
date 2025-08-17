import mongoose from 'mongoose';

const tweetSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, enum: ['like', 'retweet', 'reply'], required: true },
  createdAt: { type: Date, default: Date.now },
});

export const TweetModel = mongoose.model('Tweet', tweetSchema);
