import mongoose from 'mongoose';

const generatedTweetSchema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('GeneratedTweet', generatedTweetSchema);
