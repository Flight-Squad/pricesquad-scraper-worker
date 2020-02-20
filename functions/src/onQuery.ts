import { ProviderResults, TripGroup, SearchProviders, Firebase, ConfiguredScraperQuery } from '@flight-squad/admin';
import { makeResultHandler } from './onResult';
import { delegate } from './scrape';
import { scraperDebug } from './config/debug';

const findProvider = (prov: string): SearchProviders | never => {
    const matchingEntry = Object.entries(SearchProviders).find(([, val]) => val === prov);
    if (matchingEntry) return matchingEntry[1];
    throw new Error(`Search Provider '${prov}' not found.`);
};

export function makeQueryHandler(DB: Firebase) {
    return async function onQuery(query: ConfiguredScraperQuery): Promise<void> {
        const group = await TripGroup.find(DB, query.group);
        console.log('Found group:', group.data());
        const provider = findProvider(query.provider);
        scraperDebug('Found Matching Search Provider:', provider);
        const scrape = delegate(provider);

        const res: ProviderResults = await scrape(query);
        console.log('Scraped Message:');
        console.log(res);

        const onResult = makeResultHandler(query.config);
        let resultGroup = await group.addProvider(provider, res);
        resultGroup = await resultGroup.refresh(TripGroup);
        await onResult(resultGroup);
    };
}
