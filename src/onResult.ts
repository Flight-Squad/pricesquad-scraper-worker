import {
    TripGroup,
    FlightSearch,
    FlightSearchStatus,
    Pricesquad,
    Trip,
    Customer,
    Chatsquad,
    PricingStrategyConfig,
    Discount,
    ValidPricingStrategyConfig,
} from '@flight-squad/admin';
import { PRICESQUAD_API, CHATSQUAD_API } from 'config/squad.api';
import { DB } from 'config/database';

async function discountStrategy(search: FlightSearch): Promise<ValidPricingStrategyConfig> {
    const cfg = new PricingStrategyConfig(process.env.GSHEETS_DOC, process.env.DISCOUNT_SHEET_NAME, search.db);
    await cfg.load();
    return cfg.strategy();
}

/**
 * Returns a function that takes a `Trip` and calculates the price to charge
 * based on the benchmark from the `FlightSearch`.
 * @param search search to find benchmark in
 */
function discount(strategy: ValidPricingStrategyConfig) {
    return async function(trip: Trip): Promise<string> {
        return Discount(trip.price, strategy).toFixed(2);
    };
}

/**
 * PreCondition: Any results have been added to the trip group
 * @param group
 */
export async function onResult(group: TripGroup): Promise<void> {
    let search: FlightSearch = await group.finish();
    console.log(`searchExists=${Boolean(search)}`);
    if (Boolean(search)) console.log(`searchIsDone=${search.isDone()}`);
    console.log(group.isDone());
    console.log(group.providers);
    if (search && search.isDone()) {
        search = await search.updateStatus(FlightSearchStatus.Done);
        const bestTrip = await search.bestTrip();
        if (!bestTrip) {
            await search.updateStatus(FlightSearchStatus.Error);
            const chatsquad = new Chatsquad(CHATSQUAD_API);
            const customer = await Customer.find(DB, search.meta.customer);
            await chatsquad.send.msg({
                platform: search.meta.platform,
                id: customer.messaging[search.meta.platform],
                message:
                    'We ran into a few hiccups trying to find the best flight for you. A human should reach out to help you shortly.',
            });
            return;
        }
        const strategy = await discountStrategy(search);
        const calculateUsdCharge = discount(strategy);
        const pricesquad = new Pricesquad(PRICESQUAD_API);
        const payment = await pricesquad.tx.create({
            customer: search.meta.customer,
            trip: bestTrip,
            amount: Number(await calculateUsdCharge(bestTrip)),
        });

        const chatsquad = new Chatsquad(CHATSQUAD_API);
        const customer = await Customer.find(DB, search.meta.customer);

        await chatsquad.send.payment({
            platform: search.meta.platform,
            id: customer.messaging[search.meta.platform],
            payment,
            trip: bestTrip,
            query: group.query,
        });
        // Temporary, just for visual testing via terminal
        console.log(bestTrip);
    }
}
