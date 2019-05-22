import { Router } from 'express';
import config from 'config';
import { error } from '../utils/http';
import compute from '../bistrotime';
import { getPoints, inline } from '../utils/coordinates';
import logger from '../logger';

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

  logger.info(
    'Trying to find a bar with %d coordinates (%s)',
    points.length,
    points.map(p => inline(p)),
  );

  compute(points)
    .then((data) => {
      res.json({ ...data });
    })
    .catch((err) => {
      logger.warn('Unable to compute the bar location (%s)', err.message);
      error(res, 'Some services did not respond as expected');
    });
});

export default api;
