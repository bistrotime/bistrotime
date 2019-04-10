import { Router } from 'express';

const platform = Router();

platform.get('/ping', (req, res) => {
  res.json({ status: 'ok' });
});

export default platform;
