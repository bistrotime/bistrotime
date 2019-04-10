import { getCoord } from '@turf/turf';

export default function inline(point) {
  const coord = getCoord(point);
  return `${coord[0]},${coord[1]}`;
}
