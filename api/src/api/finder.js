import { Router } from 'express';
import * as turf from '@turf/turf';
import findBistro from '../bistrotime';

const finder = Router();

finder.get('/', (req, res) => {
  const { coords } = req.query;

  const points = [];
  coords.forEach((coord) => {
    try {
      const point = turf.point(coord.split(',').map(l => parseFloat(l)));
      points.push(point);
    } catch (err) {
      // noop
    }
  });

  findBistro(points).then((bar) => {
    res.json({ bar });
  });
});

export default finder;
