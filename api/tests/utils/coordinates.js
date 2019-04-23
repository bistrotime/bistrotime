import chai from 'chai';
import * as turf from '@turf/turf';
import { getPoints } from '../../src/utils/coordinates';

const { assert } = chai;

describe('Coordinates', () => {
  it('should return an empty array of points', () => {
    assert.isEmpty(getPoints([]));
    assert.isEmpty(getPoints(['toto']));
  });

  it('should return a point from a coordinate', () => {
    const points = getPoints(['48.850639,2.401598']);
    assert.equal(turf.getCoords(points[0])[0], 48.850639);
    assert.equal(turf.getCoords(points[0])[1], 2.401598);
  });
});
