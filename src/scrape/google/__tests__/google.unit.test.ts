// import test from 'ava';
// import makeUrl from '../url';
// import { getHtml } from '../html';
// import { getTripsFromHtml } from '../scrape';

// const params: IMessageBodyParams = {
//   origin: 'BOS',
//   dest: 'SFO',
//   departDate: '2019-10-01',
//   isRoundTrip: false,
//   numStops: 0,
// };

// test('google.url.oneway.nonstop', async t => {
//   const ultimateRedirect = 'https://www.google.com/flights?hl=en#flt=BOS.SFO.2019-10-12*SFO.BOS.2019-10-16;c:USD;e:1;sd:1;t:f';
//   const firstResult = 'https://www.google.com/flights?hl=en#flt=BOS.SFO.2019-10-01;c:USD;e:1;sd:1;t:f;tt:o';
//   const url = await makeUrl(params);
//   // console.log(url);
//   const isValidUrl = url === firstResult || url === ultimateRedirect;
//   t.true(isValidUrl);
// });

// test('google.html.oneway.nonstop', async t => {
//   const url = 'https://www.google.com/flights?hl=en#flt=BOS.SFO.2019-10-01;c:USD;e:1;sd:1;t:f;tt:o';
//   const html = await getHtml(url);
//   // console.log(html);
//   t.truthy(html);
// });

// test('google.scrape.oneway.nonstop', async t => {
//   var fs = require('fs');
//   const html = fs.readFileSync('src/scrape/google/__tests__/google.oneway.nonstop.html');
//   const trips = await getTripsFromHtml(html);
//   // console.log(trips);
//   t.truthy(trips);
// });

