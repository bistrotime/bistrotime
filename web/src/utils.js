// eslint-disable-next-line import/prefer-default-export
export function withCoordinates(places) {
  return places.filter(place => place.coords);
}
