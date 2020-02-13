import { formatDateAsKebab } from 'data/date/formatter';
import { TripScraperQuery } from '@flight-squad/admin';

function determineTripType(isRoundTrip): string {
    return isRoundTrip ? 'roundtrip' : 'oneway';
}

async function makeUrl(params: TripScraperQuery): Promise<string> {
    const departDate = formatDateAsKebab(new Date(params.departDate));
    const returnDate = params.returnDate ? formatDateAsKebab(new Date(params.returnDate)) : '';
    const tripType = determineTripType(params.isRoundTrip);

    const url = `https://www.southwest.com/air/booking/select.html?adultPassengersCount=1&departureDate=${departDate}&departureTimeOfDay=ALL_DAY&destinationAirportCode=${params.dest}&fareType=USD&int=HOMEQBOMAIR&originationAirportCode=${params.origin}&passengerType=ADULT&reset=true&returnDate=${returnDate}&returnTimeOfDay=ALL_DAY&seniorPassengersCount=0&tripType=${tripType}`;

    //departure date - year - month - day
    return url;
}

export default makeUrl;
