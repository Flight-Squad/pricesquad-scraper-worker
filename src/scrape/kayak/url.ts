import { formatDateAsKebab } from 'data/date/formatter';
import { TripScraperQuery, FlightStops } from '@flight-squad/admin';

function makeRoundTripQuery(params: TripScraperQuery): string {
    //returns trip type for URL link
    if (params.isRoundTrip) {
        return '/' + formatDateAsKebab(new Date(params.returnDate));
    }
    return '';
}

function makeStopsQuery(stops: FlightStops | string | number): string {
    //returns # of stops for URL link
    switch (stops) {
        case FlightStops.NonStop:
            return '&fs=stops=0';
        case FlightStops.OneStop:
            return '&fs=stops=-2';
        default:
            return '';
    }
}

export async function makeUrl(params: TripScraperQuery): Promise<string> {
    // 'Create URL' logic
    const roundTripQuery = makeRoundTripQuery(params);
    const stopsQuery = makeStopsQuery(params.stops);
    const departDate = formatDateAsKebab(new Date(params.departDate));
    const url = `https://www.kayak.com/flights/${params.origin}-${params.dest}/${departDate}${roundTripQuery}?sort=price_a${stopsQuery}`;

    return url;
}

export default makeUrl;
