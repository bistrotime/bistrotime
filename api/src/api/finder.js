import { Router } from 'express';
import { check, validationResult } from 'express-validator/check';
import { getPoints } from '../utils/coordinates';
import jsonError from '../utils/errors';
import findBistro from '../bistrotime';

const finder = Router();

finder.get('/', [check('coords').exists()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
    return;
  }

  const { coords } = req.query;
  const points = getPoints(coords);

  if (points.length < 2) {
    jsonError(res, 'You must provide at least two coordinates');
    return;
  }

  findBistro(points).then((bar) => {
    res.json({ bar });
  });
});

export default finder;
