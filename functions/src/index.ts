import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { RuntimeOptions } from 'firebase-functions';
import { makeQueryHandler } from './onQuery';
import { Firebase, ConfiguredScraperQuery } from '@flight-squad/admin';

// Variables defined outside cloud function are cached for consecutive runs

const runtimeOpts: RuntimeOptions = {
    timeoutSeconds: 60 * 2,
    memory: '1GB',
};

const app = admin.initializeApp();

export const onScraperQueryCreated = functions
    .runWith(runtimeOpts)
    .firestore.document('scraper_queries/{query}')
    .onCreate(async (snapshot, context) => {
        const query = snapshot.data() as ConfiguredScraperQuery;
        console.log('Query Created:', query);
        const onQuery = makeQueryHandler(Firebase.from(app.database(), app.firestore()));
        await onQuery(query);
        return;
        // return snapshot.ref.delete();
    });
