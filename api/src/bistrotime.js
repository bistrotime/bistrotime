import * as turf from '@turf/turf';
import computeTraveltime from './lib/citymapper';
import barFinder from './lib/yelp';
import inline from './utils/coordinates';

export default async function findBistro(points) {
  const geoCenter = turf.center(turf.featureCollection(points));
  const geoDistance = turf.distance(points[0], geoCenter);

  const promises = [];
  points.forEach((point) => {
    promises.push(computeTraveltime(
      inline(point),
      inline(geoCenter),
    ));
  });

  const traveltimes = await Promise.all(promises);
  const min = Math.min(...traveltimes);

  // Always between 0 and 1
  const factors = traveltimes.map(traveltime => min / traveltime);

  const offsets = [];
  points.forEach((point, i) => {
    if (factors[i] !== 1) {
      const lineString = turf.lineString([
        turf.getCoord(geoCenter),
        turf.getCoord(point),
      ]);

      offsets.push(turf.along(lineString, factors[i] * geoDistance));
    } else {
      offsets.push(turf.clone(point));
    }
  });

  // Calculate the new "center" with offset coords
  const center = turf.center(turf.featureCollection(offsets));
  const bar = barFinder(turf.getCoord(center));

  return bar;
}
