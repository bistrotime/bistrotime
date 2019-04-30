import { Router } from 'express';
import { check, validationResult } from 'express-validator/check';
import config from 'config';
import jsonError from '../utils/errors';
import findBistro from '../bistrotime';
import { getPoints } from '../utils/coordinates';

const finder = Router();

finder.get('/find', [check('coords').exists()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
    return;
  }

  const { coords } = req.query;
  const points = getPoints(coords);

  if (points.length < 2) {
    jsonError(res, 'You must provide at least 2 coordinates');
    return;
  }

  const maxCoords = config.get('bistrotime.max_coords');
  if (points.length > maxCoords) {
    jsonError(res, `You cannot provide more than ${maxCoords} coordinates at once`);
    return;
  }

  findBistro(points).then((bar) => {
    res.json({ bar });
  });
});

export default finder;
