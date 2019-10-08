import cheerio from 'cheerio'
import currencyFormatter from 'currency-formatter';
import { getHtml } from './html';
import { IMessageBody } from 'data/queue/message/body';
import makeUrl from './url';

/**
 * params in an object with the following
 *
 */
async function scrapeGoogle(params: IMessageBody) {
  const processStartTime = process.hrtime()
  const url = await makeUrl(params);
  const listContainer = await getHtml(url);

    const trips = [];
    const scraper = cheerio.load(listContainer);
    scraper('ol[class*="gws-flights-results__result-list"]').each(function (i, elem) {
      scraper(this).find('li').each(function (i, elem) {
        const trip: any = {};

        trip.times = scraper(this).find('.gws-flights-results__times-row').text().trim()
        trip.airline = scraper(this).find('.gws-flights-results__carriers').text().trim()
        trip.duration = scraper(this).find('.gws-flights-results__duration').text().trim()
        trip.stops = scraper(this).find('.gws-flights-results__stops').text().trim()
        trip.layover = scraper(this).find('.gws-flights-results__layover-time').text().trim()

        // results in something like
        // "$299         $299"
        let price = scraper(this).find('.gws-flights-results__price').text().trim()

        // naiive
        price = price.split(" ")[0].trim()
        // console.log(price);

        trip.price = currencyFormatter.unformat(price, { code: 'USD' })

        if (trip.price) {
          trips.push(trip);
        }
      })
    })
    // Sorting takes unnecessary cpu time, this can be done client-side/ on a database call
    // trips.sort((a,b) => a.price - b.price);

    const processEndTime = process.hrtime(processStartTime);

    return {
      time: processEndTime,
      data: trips,
      url: url,
    };
}

// Keeping this for future testing

// const params = {
//   origin: 'BOS',
//   dest: 'SFO',
//   departDate: new Date('2019-10-01'),
//   isRoundTrip: false,
//   numStops: 0
// };

// scrapeGoogle(params).then(res => console.log(res))

export default scrapeGoogle;

