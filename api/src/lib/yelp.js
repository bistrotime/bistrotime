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
      limit: 1,
    },
    auth: {
      bearer: process.env.YELP_TOKEN,
    },
    json: true,
  };

  const response = await request(options);
  return response.businesses;
};
