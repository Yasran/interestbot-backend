import { Router } from 'express';

const router = Router();

router.get('/login', (_, res) => {
  res.send('Login endpoint 🧪');
});

export default router;
