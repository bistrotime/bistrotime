import * as turf from '@turf/turf';

export function getPoints(coords) {
  if (!Array.isArray(coords)) {
    // eslint-disable-next-line no-param-reassign
    coords = [coords];
  }

  const points = [];
  coords.forEach((coord) => {
    try {
      const point = turf.point(coord.split(',').map(l => parseFloat(l)));
      points.push(point);
    } catch (err) {
      // noop
    }
  });

  return points;
}

export function inline(point) {
  const coord = turf.getCoord(point);
  return `${coord[0]},${coord[1]}`;
}
