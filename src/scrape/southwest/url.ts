import { formatDateAsKebab } from "data/date/formatter";
import { FlightStops } from "data/flight/stops";
import { IFlightSearchParams } from "data/flight/search/params";

async function makeUrl(params: IFlightSearchParams): Promise<string> {
  const departDate = formatDateAsKebab(new Date(params.departDate));
  const returnDate = params.returnDate
    ? formatDateAsKebab(new Date(params.returnDate))
    : "";
  //const roundTripQuery = makeRoundTripQuery(params.isRoundTrip, params.origin, params.dest, returnDate);
  const tripType = determineTripType(params.isRoundTrip);
  //const stopsQuery = makeStopsQuery(params.numStops);
  //const oneWayQuery = makeOneWayQuery(params.isRoundTrip);

  //VERY CONFUSED ABOUT ROUNDTRIP ON URL.TS
  const url = `https://www.southwest.com/air/booking/select.html?adultPassengersCount=1&departureDate=${departDate}&departureTimeOfDay=ALL_DAY&destinationAirportCode=${params.dest}&fareType=USD&int=HOMEQBOMAIR&originationAirportCode=${params.origin}&passengerType=ADULT&reset=true&returnDate=${returnDate}&returnTimeOfDay=ALL_DAY&seniorPassengersCount=0&tripType=${tripType}`;
  //original link:
  // https://www.southwest.com/air/booking/select.html?int=HOMEQBOMAIR&adultPassengersCount=1&departureDate=2019-12-11&destinationAirportCode=BOS&fareType=USD&originationAirportCode=BWI&passengerType=ADULT&returnDate=2019-12-14&seniorPassengersCount=0&tripType=oneway&departureTimeOfDay=ALL_DAY&reset=true&returnTimeOfDay=ALL_DAY
  //departure date - year - month - day
  return url;
}

/**
 *
 * @param isRoundTrip
 * @param origin
 * @param dest
 * @param returnDateStr
 */

/* NOT VERY SURE ABOUT ROUNDTRIP -> Does this actually change the URL?
  Cause I don't think I saw any change */

function determineTripType(isRoundTrip) {
  if (isRoundTrip) {
    return "roundtrip";
  } else {
    return "oneway";
  }
}
function makeRoundTripQuery(isRoundTrip, origin, dest, returnDateStr) {
  // Translated from following GSheets Formula
  // if(F2="Round Trip","*"&C2&"."&B2&"."&D5&"-"&E5&"-"&F5,"")
  // F2 specifies round trip or one way
  // C2 is dest, B2 is origin, "&D5&"-"&E5&"-"&F5 is date string
  if (!isRoundTrip) return "";

  return `*${dest}.${origin}.${returnDateStr}`;
}

/* function makeStopsQuery(stops) {
  // Translated from following GSheets Formula
  // if(E2="Nonstop","",if(E2="Max 1 Stop","s:1*1",""))
  // what's ls:1w ?
  if (stops === FlightStops.OneStop) return 's:1*1;';
  return '';
}

function makeOneWayQuery(isRoundTrip) {
  if (!isRoundTrip) return ';tt:o';
  return '';
}

function idek() {
  // "sc:"&left(A1,1)
  // is this a bug because it won't be separated by semicolon if max 1 stop
} */

export default makeUrl;
