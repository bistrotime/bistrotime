import request from 'request-promise';

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
  return response.travel_time_minutes;
}
