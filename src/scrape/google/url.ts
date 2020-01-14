import { formatDateAsKebab } from 'data/date/formatter';
import { TripScraperQuery, FlightStops } from '@flight-squad/admin';
/**
 *
 * @param isRoundTrip
 * @param origin
 * @param dest
 * @param returnDateStr
 */
function makeRoundTripQuery(isRoundTrip, origin, dest, returnDateStr): string {
    // Translated from following GSheets Formula
    // if(F2="Round Trip","*"&C2&"."&B2&"."&D5&"-"&E5&"-"&F5,"")
    // F2 specifies round trip or one way
    // C2 is dest, B2 is origin, "&D5&"-"&E5&"-"&F5 is date string
    if (!isRoundTrip) return '';

    return `*${dest}.${origin}.${returnDateStr}`;
}

function makeStopsQuery(stops): string {
    // Translated from following GSheets Formula
    // if(E2="Nonstop","",if(E2="Max 1 Stop","s:1*1",""))
    // what's ls:1w ?
    if (stops === FlightStops.OneStop) return 's:1*1;';
    return '';
}

function makeOneWayQuery(isRoundTrip): string {
    if (!isRoundTrip) return ';tt:o';
    return '';
}

function idek() {
    // "sc:"&left(A1,1)
    // is this a bug because it won't be separated by semicolon if max 1 stop
}

async function makeUrl(params: TripScraperQuery): Promise<string> {
    const departDate = formatDateAsKebab(new Date(params.departDate));
    const returnDate = params.returnDate ? formatDateAsKebab(new Date(params.returnDate)) : '';
    const roundTripQuery = makeRoundTripQuery(params.isRoundTrip, params.origin, params.dest, returnDate);
    const stopsQuery = makeStopsQuery(params.stops);
    const oneWayQuery = makeOneWayQuery(params.isRoundTrip);
    const url = `https://www.google.com/flights?hl=en#flt=${params.origin}.${params.dest}.${departDate}${roundTripQuery};c:USD;e:1;${stopsQuery}sd:1;t:f${oneWayQuery}`;
    return url;
}

export default makeUrl;
