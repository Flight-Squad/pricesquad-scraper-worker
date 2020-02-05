import { TripScraperQuery, FlightStops, TripStop } from '@flight-squad/admin';
import { formatISO } from 'date-fns';

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

/**
 * Formats given date as yyyy-mm-dd
 * @param date
 */
const dateAsISO = (date: string | Date): string => formatISO(new Date(date), { representation: 'date' });

function idek() {
    // "sc:"&left(A1,1)
    // is this a bug because it won't be separated by semicolon if max 1 stop
}

const urlParts = (params: TripScraperQuery) => {
    const returnDate = dateAsISO(params.returnDate);
    return {
        departDate: dateAsISO(params.departDate),
        returnDate,
        roundTripQuery: makeRoundTripQuery(params.isRoundTrip, params.origin, params.dest, returnDate),
        stopsQuery: makeStopsQuery(params.stops),
        oneWayQuery: makeOneWayQuery(params.isRoundTrip),
    };
};

async function makeUrl(params: TripScraperQuery): Promise<string> {
    const { departDate, roundTripQuery, stopsQuery, oneWayQuery } = urlParts(params);
    return `https://www.google.com/flights?hl=en#flt=${params.origin}.${params.dest}.${departDate}${roundTripQuery};c:USD;e:1;${stopsQuery}sd:1;t:f${oneWayQuery}`;
}

const stripSpaces = (str: string): string => str.split(' ').join('');
const getCode = (stop: TripStop): string => stop.stop.code;

export function makeLayoverQueryAccum(i: number, arr: TripStop[], accum: string[]): string[] {
    // NOTE ON Tail Call Optimization (TCO) in Javascript
    // TCO was removed by Chrome v8 devs https://bugs.chromium.org/p/v8/issues/detail?id=4698 around 2016
    // Support for TCO was dropped by Node in/after >= v8.0
    //
    // I'm keeping the recursive code here for future recursion references
    // Optimizations: curry array and/or accumulator
    if (i - 1 < 0) return accum;
    const layoverNumber = i - 1;
    const dest = arr[i];
    const origin = arr[layoverNumber];
    accum.unshift(`${getCode(origin)}${getCode(dest)}${layoverNumber}${stripSpaces(origin.flightNum)}`);
    return makeLayoverQueryAccum(i - 1, arr, accum);
}

export const makeLayoverQuery = (stops: TripStop[]) => {
    const queryParts = makeLayoverQueryAccum(stops.length - 1, stops, []);
    return queryParts.join('~');
};

export async function makeReturningFlightsUrl(params: TripScraperQuery, stops: TripStop[]): Promise<string> {
    const { departDate, roundTripQuery, stopsQuery, oneWayQuery } = urlParts(params);
    const layoverQuery = makeLayoverQuery(stops);
    return `https://www.google.com/flights?hl=en#flt=${params.origin}.${params.dest}.${departDate}.${layoverQuery}${roundTripQuery};c:USD;e:1;${stopsQuery}sd:1;t:f${oneWayQuery}`;
}

export default makeUrl;
