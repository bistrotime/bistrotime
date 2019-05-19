import { Router } from 'express';
import config from 'config';
import { error } from '../utils/http';
import compute from '../bistrotime';
import { getPoints } from '../utils/coordinates';

const api = Router();

api.get('/find', (req, res) => {
  const { min: minCoords, max: maxCoords } = config.get('bistrotime.coords');
  const { coords } = req.query;

  if (!coords) {
    error(res, `You must provide at least ${minCoords} coordinates`);
    return;
  }

  const points = getPoints(coords);
  if (points.length < minCoords || points.length > maxCoords) {
    error(res, `You must provide between ${minCoords} and ${maxCoords} coordinates`);
    return;
  }

  compute(points).then((data) => {
    res.json({ ...data });
  });
});

export default api;
