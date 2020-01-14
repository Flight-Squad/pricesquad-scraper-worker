import { TripScraperQuery, ProviderResults, TripGroup, SearchProviders } from '@flight-squad/admin';
import logger from 'config/winston';
import { DB } from 'config/database';
import { onResult } from './onResult';
import { SQSMessage } from 'config/aws';
import { delegate } from './scrape';

const findProvider = (prov: string): SearchProviders | never => {
    const matchingEntry = Object.entries(SearchProviders).find(([, val]) => val === prov);
    if (matchingEntry) return matchingEntry[1];
    throw new Error(`Search Provider '${prov}' not found.`);
};

export async function onMessage(message: SQSMessage): Promise<void> {
    const query: TripScraperQuery = JSON.parse(message.Body);
    const group = await DB.find(TripGroup.Collection, query.group, TripGroup);
    const provider = findProvider(query.provider);
    const scrape = delegate(provider);

    // Commented out because this can/should be handled more succinctly and scalably
    // if (process.env.NODE_ENV === 'debug' || process.env.NODE_ENV === 'development') {
    logger.debug(`Processing ${message.MessageId}`);
    // }

    try {
        const res: ProviderResults = await scrape(query); // interfaces?
        await onResult(await group.addProvider(provider, res));
        logger.info(`[FINISHED] Processed ${message.MessageId}`);
        // logger.info(JSON.stringify({requestId: data.params.requestId, res: res,}));
    } catch (e) {
        logger.error(e.message);
    }
}
