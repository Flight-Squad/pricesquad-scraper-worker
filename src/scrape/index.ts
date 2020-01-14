import scrapeGoogle from './google';
import { ProviderResults, SearchProviders, TripScraperQuery } from '@flight-squad/admin';

const providerNotImplemented = (provider: string): Error => new Error(`Provider '${provider}' not implemented`);

export function delegate(provider: SearchProviders): (query: TripScraperQuery) => Promise<ProviderResults> {
    switch (provider) {
        case SearchProviders.GoogleFlights:
            return scrapeGoogle;
        default:
            throw providerNotImplemented(provider);
    }
}
