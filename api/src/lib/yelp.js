import request from 'request-promise';
import config from 'config';

import logger from '../logger';

export default async (coord) => {
  logger.debug('Trying to find a bar arround %s', coord);

  const options = {
    uri: 'https://api.yelp.com/v3/businesses/search',
    qs: {
      latitude: coord[0],
      longitude: coord[1],
      radius: config.get('yelp.radius'),
      categories: config.get('yelp.categories'),
      sort_by: 'best_match',
      limit: config.get('yelp.limit'),
    },
    auth: {
      bearer: process.env.YELP_TOKEN,
    },
    json: true,
  };

  const response = await request(options);
  const { businesses } = response;

  // Try to select a different random bar each time
  const bar = businesses[Math.floor((Math.random() * businesses.length))];

  logger.info(
    'Found the random bar "%s" (%s)',
    bar.name,
    bar.alias,
  );

  return bar;
};
