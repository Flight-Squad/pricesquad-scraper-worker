import test from 'ava';
import scrapeGoogle from '..';
import { SearchProviders } from 'data/flight/search/providers';

const params = {
  origin: 'BOS',
  dest: 'SFO',
  departDate: '2019-10-01',
  isRoundTrip: false,
  numStops: 0,
  provider: SearchProviders.google,
};

test('google.oneway.nonstop.integration', async t => {
  const res = await scrapeGoogle(params);
  // console.log(res);
  t.truthy(res.data);
});
