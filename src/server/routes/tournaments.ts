import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ message: 'Get all tournaments' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get tournament ${req.params.id}` });
});

router.post('/', (_req, res) => {
  res.json({ message: 'Create new tournament' });
});

router.post('/:id/join', (req, res) => {
  res.json({ message: `Join tournament ${req.params.id}` });
});

export default router;