import scrapeGoogle from './google';
import { ProviderResults, SearchProviders, TripScraperQuery } from '@flight-squad/admin';
import { EmptyResults } from './emptyResults';

const providerNotImplemented = async (query: TripScraperQuery): Promise<ProviderResults> => {
    console.log(`Returning empty results for unimplemented provider '${query.provider}'`);
    return EmptyResults();
};

/**
 * Returns a function that handles errors thrown by the parameter function
 * @param func Function to wrap error handling around
 */
const injectErrHandler = (
    func: (query: TripScraperQuery) => Promise<ProviderResults>,
): ((query: TripScraperQuery) => Promise<ProviderResults>) => {
    return async function(query: TripScraperQuery): Promise<ProviderResults> {
        try {
            return await func(query);
        } catch (err) {
            console.log(
                `Error while scraping query ${JSON.stringify(query)}\n\n${JSON.stringify(
                    err,
                    null,
                    2,
                )}\nReturning Empty results.`,
            );
            console.error(err.name);
            console.error(err.message);
            console.error(err.stack);
            return EmptyResults();
        }
    };
};

export function delegate(provider: SearchProviders): (query: TripScraperQuery) => Promise<ProviderResults> {
    switch (provider) {
        case SearchProviders.GoogleFlights:
            return injectErrHandler(scrapeGoogle);
        default:
            return providerNotImplemented;
    }
}
