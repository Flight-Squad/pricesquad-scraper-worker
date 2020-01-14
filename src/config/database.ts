import { Database } from '@flight-squad/admin';
import path from 'path';

Database.init({
    serviceAccount: process.env.FIRESTORE_CONFIG,
    serviceAccountPath: path.resolve(__dirname, './serviceAccount.json'),
    firebaseUrl: process.env.FIREBASE_URL,
});

export const DB = Database.firebase;
