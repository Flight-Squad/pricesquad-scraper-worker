import {
    TripGroup,
    FlightSearch,
    FlightSearchStatus,
    Pricesquad,
    Trip,
    Customer,
    Chatsquad,
    Discount,
    ValidPricingStrategyConfig,
    QueryConfig,
    ScraperDataTargets,
} from '@flight-squad/admin';

async function discountStrategy(search: FlightSearch, config: QueryConfig): Promise<ValidPricingStrategyConfig> {
    return {
        '100': '0.99',
        '200': '0.95',
        '600': '0.85',
    };
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

export interface ResultHandler {
    (group: TripGroup, ...args: unknown[]): Promise<void>;
}

function configureCustomerHandler(config: QueryConfig): ResultHandler {
    return async (group: TripGroup): Promise<void> => {
        let search: FlightSearch = await group.finish();
        console.log(`searchExists=${Boolean(search)}`);
        if (Boolean(search)) console.log(`searchIsDone=${search.isDone()}`);
        console.log('Group is Done:', group.isDone());
        console.log('Group Providers:', group.providers);
        if (search && search.isDone()) {
            search = await search.updateStatus(FlightSearchStatus.Done);
            const bestTrip = await search.bestTrip();
            if (!bestTrip) {
                await search.updateStatus(FlightSearchStatus.Error);
                const chatsquad = new Chatsquad(config.chatsquad);
                const customer = await Customer.find(group.db, search.meta.customer);
                await chatsquad.send.msg({
                    platform: search.meta.platform,
                    id: customer.messaging[search.meta.platform],
                    message:
                        'We ran into a few hiccups trying to find the best flight for you. A human should reach out to help you shortly.',
                });
                console.log('No Trip found in search results!');
                return;
            }
            const strategy = await discountStrategy(search, config);
            const calculateUsdCharge = discount(strategy);
            const pricesquad = new Pricesquad(config.pricesquad);
            const payment = await pricesquad.tx.create({
                customer: search.meta.customer,
                trip: bestTrip,
                amount: Number(await calculateUsdCharge(bestTrip)),
            });

            console.log('Payment', payment);

            const chatsquad = new Chatsquad(config.chatsquad);
            const customer = await Customer.find(group.db, search.meta.customer);

            await chatsquad.send.payment({
                platform: search.meta.platform,
                id: customer.messaging[search.meta.platform],
                payment,
                trip: bestTrip,
                query: group.query,
            });
            // Temporary, just for visual testing via terminal
            console.log('Best trip found:', bestTrip);
            console.log('Finished Search Request', search.id);
        }
    };
}

const target = (config: QueryConfig): ResultHandler => {
    switch (config.dataTarget) {
        case ScraperDataTargets.DatabaseOnly:
            return async (group: TripGroup): Promise<void> => {
                await group.finish();
            };
        default:
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            return configureCustomerHandler(config);
    }
};

/**
 * PreCondition: Any results have been added to the trip group
 * @param group
 */
export const makeResultHandler = (config: QueryConfig): ResultHandler => target(config);
