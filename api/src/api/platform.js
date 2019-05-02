import { Router } from 'express';

const api = Router();

api.get('/ping', (req, res) => {
  res.json({ status: 'ok' });
});

export default api;
