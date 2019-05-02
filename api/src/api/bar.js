import { Router } from 'express';
import config from 'config';
import { error } from '../utils/http';
import discoverBar from '../bistrotime';
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

  discoverBar(points).then((bar) => {
    res.json({ bar });
  });
});

export default api;
