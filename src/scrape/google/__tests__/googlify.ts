import { TripGroupQuery, SearchProviders, TripScraperQuery } from '@flight-squad/admin';

export const googlifyQuery = (query: TripGroupQuery): TripScraperQuery => {
    return {
        ...query,
        provider: SearchProviders.GoogleFlights,
        group: '',
    };
};
