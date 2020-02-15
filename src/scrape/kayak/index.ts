import makeUrl from 'scrape/kayak/url';
import { getHtml } from 'scrape/kayak/html';
import { kayakTripData } from './scrape';
import { TripScraperQuery, ProviderResults } from '@flight-squad/admin';

export async function scrapeKayak(params: TripScraperQuery): Promise<ProviderResults> {
    const url = await makeUrl(params);
    const html = await getHtml(url);
    const trips = await kayakTripData(html);

    return {
        data: trips,
        url: url,
    };
}
