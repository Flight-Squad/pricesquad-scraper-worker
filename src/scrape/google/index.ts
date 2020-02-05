import { getHtml } from './html';
import makeUrl, { makeReturningFlightsUrl } from './url';
import { getTripsFromHtml } from './scrape';
import { ProviderResults, TripScraperQuery, TripGroup, Trip } from '@flight-squad/admin';

/**
 * params in an object with the following
 *
 */
async function scrapeGoogle(query: TripScraperQuery): Promise<ProviderResults> {
    const url = await makeUrl(query);
    const listContainer = await getHtml(url);
    let trips = await getTripsFromHtml(query, listContainer);

    if (query.isRoundTrip) {
        trips = trips.sort(TripGroup.SortPriceAsc);
        const returnFlightsUrl = await makeReturningFlightsUrl(query, trips[0].stops);
        const returnFlights: Trip[] = await getReturningTrips(await getHtml(returnFlightsUrl)).sort(
            TripGroup.SortPriceAsc,
        );
        trips.forEach(trip => trip.stops.push(...returnFlights[0].stops));
    }

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
