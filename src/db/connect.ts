import mongoose from 'mongoose';

export const connectToDB = async () => {
  const uri = process.env.MONGO_URI;
  
  if (!uri) {
    console.error('❌ MongoDB connection error: MONGO_URI environment variable is not set');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};
