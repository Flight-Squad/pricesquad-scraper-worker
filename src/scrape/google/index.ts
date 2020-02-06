import { getHtml } from './html';
import makeUrl, { makeReturningFlightsUrl } from './url';
import { getTripsFromHtml } from './scrape';
import { ProviderResults, TripScraperQuery, TripGroup, Trip } from '@flight-squad/admin';
import { scraperDebug } from 'scrape';

export const googleDebugger = scraperDebug.extend('google');

/**
 * params in an object with the following
 *
 */
async function scrapeGoogle(query: TripScraperQuery): Promise<ProviderResults> {
    const url = await makeUrl(query);
    const listContainer = await getHtml(url);
    let trips = await getTripsFromHtml(query, query.departDate, listContainer);

    if (query.isRoundTrip) {
        trips = trips.sort(TripGroup.SortPriceAsc);
        googleDebugger('========================');
        const returnFlightsUrl = await makeReturningFlightsUrl(query, trips[0].stops);
        googleDebugger('Returning Flights Url', returnFlightsUrl);
        // console.log('Returning Flights Url', returnFlightsUrl);
        const html = await getHtml(returnFlightsUrl);
        const returnFlights: Trip[] = (await getTripsFromHtml(query, query.returnDate, html)).sort(
            TripGroup.SortPriceAsc,
        );
        trips.forEach(trip => trip.stops.push(...returnFlights[0].stops));
    }

    googleDebugger(trips[0].stops);

    return {
        data: trips,
        url: url,
    };
}

export default scrapeGoogle;
