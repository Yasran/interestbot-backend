import express from 'express';
import cors from 'cors';
import userRoutes from './Routes/userRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
  res.send('API is running ✅');
});

app.use('/api/users', userRoutes);

export default app;
