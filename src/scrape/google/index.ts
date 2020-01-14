import { getHtml } from './html';
import makeUrl from './url';
import { getTripsFromHtml } from './scrape';
import { ProviderResults, TripScraperQuery } from '@flight-squad/admin';

/**
 * params in an object with the following
 *
 */
async function scrapeGoogle(query: TripScraperQuery): Promise<ProviderResults> {
    const url = await makeUrl(query);
    const listContainer = await getHtml(url);
    const trips = await getTripsFromHtml(listContainer);

    return {
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
