import { TripScraperQuery, SearchProviders } from '@flight-squad/admin';

const group = 'test-trip-group-1';

export const oneWayNonStopDomestic: TripScraperQuery = {
    provider: SearchProviders.GoogleFlights,
    group,
    origin: 'BOS',
    dest: 'BWI',
    departDate: '2020-01-20T12:00:00-05:00',
    isRoundTrip: false,
    stops: 1,
};
