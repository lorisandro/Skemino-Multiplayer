import { Router } from 'express';

const router = Router();

router.post('/login', (_req, res) => {
  res.json({ message: 'Login endpoint' });
});

router.post('/register', (_req, res) => {
  res.json({ message: 'Register endpoint' });
});

router.post('/logout', (_req, res) => {
  res.json({ message: 'Logout endpoint' });
});

export default router;