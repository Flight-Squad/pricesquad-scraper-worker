import test from 'ava';
import { SearchProviders } from 'data/flight/search/providers';
import { scrapeSkiplagged } from 'scrape/skiplagged/index';
import {makeUrl} from 'scrape/skiplagged/url';

const params = {
  origin: 'BOS',
  dest: 'SFO',
  departDate: new Date('2020-05-01'),
  returnDate: new Date('2020-20-01'),
  isRoundTrip: true,
  numStops: 0

};



test('skiplagged.roundtrip.nonstop.integration', async t => {
  const res = await makeUrl(params);
  // console.log(res);
 // t.truthy(res.data);
});
