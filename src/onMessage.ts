import { TripScraperQuery, ProviderResults, TripGroup, SearchProviders } from '@flight-squad/admin';
import logger from 'config/winston';
import { DB } from 'config/database';
import { onResult } from './onResult';
import { delegate } from './scrape';
import { scraperDebug } from 'config/debug';

const findProvider = (prov: string): SearchProviders | never => {
    const matchingEntry = Object.entries(SearchProviders).find(([, val]) => val === prov);
    if (matchingEntry) return matchingEntry[1];
    throw new Error(`Search Provider '${prov}' not found.`);
};

export async function onMessage(message): Promise<void> {
    const query: TripScraperQuery = message;
    const group = await DB.find(TripGroup.Collection, query.group, TripGroup);
    scraperDebug('Found group:', group.data());
    const provider = findProvider(query.provider);
    scraperDebug('Found Matching Search Provider:', provider);
    const scrape = delegate(provider);

    logger.debug('Processing Message');
    const res: ProviderResults = await scrape(query);
    logger.info('Scraped Message');
    logger.debug(JSON.stringify(res));
    await onResult(await (await group.addProvider(provider, res)).refresh(TripGroup));
}
