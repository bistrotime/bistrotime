import * as turf from '@turf/turf';
import computeTraveltime from './lib/citymapper';
import barFinder from './lib/yelp';
import logger from './logger';
import { inline } from './utils/coordinates';

export default async function compute(points) {
  const geoCenter = turf.center(turf.featureCollection(points));
  const distance = turf.distance(points[0], geoCenter);

  logger.debug(
    'Geographic center computed at %s with %f kilometers',
    inline(geoCenter),
    distance,
  );

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
  const places = [];
  points.forEach((point, i) => {
    const factor = factors[i];
    let offset = null;

    if (factor !== 1) {
      const lineString = turf.lineString([
        turf.getCoord(geoCenter),
        turf.getCoord(point),
      ]);

      offset = turf.along(lineString, factor * distance);
    } else {
      offset = turf.clone(point);
    }

    offsets.push(offset);

    // Add additional information
    places.push({
      point,
      offset,
      factor,
    });
  });

  // Calculate the new "center" with offset coords
  const offsetCenter = turf.center(turf.featureCollection(offsets));
  logger.debug('Offset center computed at %s', inline(offsetCenter));

  const bar = barFinder(turf.getCoord(offsetCenter));

  return {
    center: {
      geo: geoCenter,
      offset: offsetCenter,
    },
    places,
    bar,
  };
}
