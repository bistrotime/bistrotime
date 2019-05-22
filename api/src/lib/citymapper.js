import request from 'request-promise';
import logger from '../logger';

export default async function computeTraveltime(from, to) {
  const options = {
    uri: 'https://developer.citymapper.com/api/1/traveltime/',
    qs: {
      startcoord: from,
      endcoord: to,
      key: process.env.CITYMAPPER_TOKEN,
    },
    json: true,
  };

  const response = await request(options);
  const travelTimeMinutes = response.travel_time_minutes;

  logger.debug(
    'Travel time between %s and %s is %d minutes with Citymapper',
    from,
    to,
    travelTimeMinutes,
  );

  return travelTimeMinutes;
}
