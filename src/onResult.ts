import { TripGroup, FlightSearch, FlightSearchStatus } from '@flight-squad/admin';
import logger from 'config/winston';

/**
 * PreCondition: Any results have been added to the trip group
 * @param group
 */
export async function onResult(group: TripGroup): Promise<void> {
    let search: FlightSearch = await group.finish();
    if (search && search.isDone()) {
        search = await search.updateStatus(FlightSearchStatus.Done);
        const bestTrip = await search.bestTrip();
        // Temporary, just for visual testing via terminal
        console.log(bestTrip);
        // use best trip to
        //  - create payment details
        //  - send message back to user
    }
}
