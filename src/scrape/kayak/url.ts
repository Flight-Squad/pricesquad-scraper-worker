import { formatDateAsKebab } from "data/date/formatter";
import { FlightStops } from "data/flight/stops";
import { IFlightSearchParams } from "data/flight/search/params";

export async function makeUrl(params: IFlightSearchParams): Promise<string> {
  // 'Create URL' logic
  const roundTripQuery = makeRoundTripQuery(params);
  const stopsQuery = makeStopsQuery(params);
  const departDate = formatDateAsKebab(params.departDate);
  const url = `https://www.kayak.com/flights/${params.origin}-${params.dest}/${departDate}${roundTripQuery}?sort=price_a${stopsQuery}`

  return url;
}

function makeRoundTripQuery(params: IFlightSearchParams) { //returns trip type for URL link
  if (params.isRoundTrip) {
    return '/' + formatDateAsKebab(params.returnDate);
  }
  return '';
}

function makeStopsQuery(params: IFlightSearchParams) { //returns # of stops for URL link
  switch(params.numStops) {
    case FlightStops.NonStop: return '&fs=stops=0';
    case FlightStops.OneStop: return '&fs=stops=-2';
    default: return '';
  }
}
export default makeUrl;
