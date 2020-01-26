import {
    TripGroup,
    FlightSearch,
    FlightSearchStatus,
    Pricesquad,
    Trip,
    Customer,
    Chatsquad,
} from '@flight-squad/admin';
import { PRICESQUAD_API, CHATSQUAD_API } from 'config/squad.api';
import { DB } from 'config/database';

/**
 * Returns a function that takes a `Trip` and calculates the price to charge
 * based on the benchmark from the `FlightSearch`.
 * @param search search to find benchmark in
 */
function benchmarker(search: FlightSearch) {
    return async function(trip: Trip): Promise<string> {
        const { price } = trip;
        if (price <= 300) return (price * 0.94).toFixed(2);
        if (price > 300 && price <= 500) return (price * 0.89).toFixed(2);

        // else
        return (price * 0.86).toFixed(2);
    };
}

/**
 * PreCondition: Any results have been added to the trip group
 * @param group
 */
export async function onResult(group: TripGroup): Promise<void> {
    let search: FlightSearch = await group.finish();
    if (search && search.isDone()) {
        search = await search.updateStatus(FlightSearchStatus.Done);
        const bestTrip = await search.bestTrip();
        const calculateUsdCharge = benchmarker(search);
        const pricesquad = new Pricesquad(PRICESQUAD_API);
        const payment = await pricesquad.tx.create({
            customer: search.meta.customer,
            trip: bestTrip,
            amount: Number(await calculateUsdCharge(bestTrip)),
        });

        const chatsquad = new Chatsquad(CHATSQUAD_API);
        const customer = await Customer.find(DB, search.meta.customer);

        await chatsquad.send.payment.msg({
            platform: search.meta.platform,
            id: customer.messaging[search.meta.platform],
            payment,
        });
        // Temporary, just for visual testing via terminal
        console.log(bestTrip);
    }
}
