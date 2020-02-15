import { getHtml } from 'scrape/southwest/html';
import makeUrl from 'scrape/southwest/url';
import { getDepartingTrips, getReturningTrips } from './scrape';
import { TripScraperQuery } from '@flight-squad/admin';

export async function scrapeSouthwest(params: TripScraperQuery) {
    const url = await makeUrl(params);
    const html = await getHtml(url);
    const departingTrips = await getDepartingTrips(html);
    const resData: any = {
        data: departingTrips,
        url: url,
    };

    if (params.isRoundTrip && params.returnDate) {
        const returningTrips = await getReturningTrips(html);
        resData.returnTrips = returningTrips;
    }

    return resData;
}
