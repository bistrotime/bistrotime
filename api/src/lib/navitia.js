import request from 'request-promise';
import * as turf from '@turf/turf';
import logger from '../logger';

export default async function (from, to) {
  from = turf.getCoord(from);
  to = turf.getCoord(to);

  const options = {
    uri: 'https://api.navitia.io/v1/journeys',
    auth: {
      user: process.env.NAVITIA_TOKEN,
    },
    qs: {
      from: `${from[1]};${from[0]}`,
      to: `${to[1]};${to[0]}`,
    },
    json: true,
  };

  const response = await request(options);

  // Get the duration from the best journey available
  const journey = response.journeys.find(j => j.type === 'best');
  const { duration } = journey;

  console.log(JSON.stringify(journey));

  logger.debug(
    'Journey duration between %s and %s is %d seconds with Navitia',
    from,
    to,
    duration,
  );

  return duration;
}
