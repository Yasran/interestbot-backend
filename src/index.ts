import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectToDB } from './db/connect';

const PORT = process.env.PORT || 4000;

connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
