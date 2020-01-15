import * as cases from './cases';
import { SearchProviders, ProviderResults, Trip, TripStop } from '@flight-squad/admin';
import { delegate } from 'scrape';
import assert from 'assert';

function isProvResult(obj: any): obj is ProviderResults {
    function isTrip(obj: any): obj is Trip {
        function isStop(obj: any): obj is TripStop {
            return (
                'duration' in obj &&
                'stop' in obj &&
                'operator' in obj &&
                'flightNum' in obj &&
                'arrivalTime' in obj &&
                'departTime' in obj &&
                'duration' in obj
            );
        }
        return 'price' in obj && 'provider' in obj && 'stops' in obj && obj.stops.every(stop => isStop(stop));
    }
    return 'url' in obj && 'data' in obj && obj.data.every(trip => isTrip(trip));
}

const maxMilliPerCase = 30 * 1000;

for (const [, prov] of Object.entries(SearchProviders)) {
    describe(`When ${prov} is provided`, function() {
        const scrape = delegate(prov);
        const testCases = Object.entries(cases);
        this.timeout(maxMilliPerCase * testCases.length);
        for (const [caseName, query] of testCases) {
            describe(`A ${caseName} query`, function() {
                this.timeout(maxMilliPerCase);
                it('Should return a ProviderResult', async () => {
                    const res = await scrape(query);
                    assert(isProvResult(res));
                });
            });
        }
    });
}

// describe('When provided with a TripScraperQuery', () => {
//     it('Should return a ProviderResult', async () => {
//         for (const testCase of cases) {
//             awa;
//         }
//     });
// });
