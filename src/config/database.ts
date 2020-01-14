import { Database } from '@flight-squad/admin';
import path from 'path';

Database.init({
    serviceAccount: process.env.FIRESTORE_CONFIG,
    serviceAccountPath: path.resolve(__dirname, './serviceAccount.json'),
});

export const DB = Database.firebase;
