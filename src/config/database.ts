import { Database, ValidPricingStrategyConfig, PricingStrategyConfig, Discount } from '@flight-squad/admin';
import path from 'path';

Database.init({
    serviceAccount: process.env.FIRESTORE_CONFIG,
    serviceAccountPath: path.resolve(__dirname, './serviceAccount.json'),
    firebaseUrl: process.env.FIREBASE_URL,
});

export const DB = Database.firebase;

async function discountStrategy(): Promise<ValidPricingStrategyConfig> {
    const docId = process.env.GSHEETS_DOC;
    const sheet = process.env.DISCOUNT_SHEET_NAME;
    const cfg = new PricingStrategyConfig(docId, sheet, DB);
    await cfg.load();
    return cfg.strategy();
}

// discountStrategy().then(res => console.log(Discount(100, res)));
