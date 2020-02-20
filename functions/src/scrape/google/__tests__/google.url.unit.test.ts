import { makeLayoverQueryAccum, makeReturningFlightsUrl } from '../url';
import { TripStop } from '@flight-squad/admin';
import { expect } from 'chai';
import { googlifyQuery } from './googlify';
import * as Queries from '../../__tests__/scraperQueries';

const bosIsbStops: TripStop[] = [
    {
        stop: { code: 'BOS', city: 'Boston', name: '' },
        operator: '',
        flightNum: 'QR 744',
        arrivalTime: '',
        departTime: '',
        duration: '',
    },
    {
        stop: { code: 'DOH', city: 'Boston', name: '' },
        operator: '',
        flightNum: 'QR 632',
        arrivalTime: '',
        departTime: '',
        duration: '',
    },
    {
        stop: { code: 'ISB', city: 'Boston', name: '' },
        operator: '',
        flightNum: '',
        arrivalTime: '',
        departTime: '',
        duration: '',
    },
];

describe('Google URL Generator', async () => {
    describe('Generate Layover Queries', () => {
        it('When given 1 layover, it generates 2 layover queries', () => {
            const stops: TripStop[] = [
                {
                    stop: { code: 'BOS', city: 'Boston', name: '' },
                    operator: '',
                    flightNum: 'B6 427',
                    arrivalTime: '',
                    departTime: '',
                    duration: '',
                },
                {
                    stop: { code: 'DOH', city: 'Boston', name: '' },
                    operator: '',
                    flightNum: 'QR 632',
                    arrivalTime: '',
                    departTime: '',
                    duration: '',
                },
                {
                    stop: { code: 'ISB', city: 'Boston', name: '' },
                    operator: '',
                    flightNum: '',
                    arrivalTime: '',
                    departTime: '',
                    duration: '',
                },
            ];
            const queryParts = makeLayoverQueryAccum(stops.length - 1, stops, []);
            console.log(queryParts);
            expect(queryParts).to.have.length(stops.length - 1);
            queryParts.forEach((val, index) => expect(val.includes(index + '')).to.be.true);
        });
    });
    describe('Generate Full URL', async () => {
        it('When asked to generate round trip url, it does it correctly', async () => {
            const url = await makeReturningFlightsUrl(googlifyQuery(Queries.IntlRoundTripInOneWeek), bosIsbStops);
            expect(url.includes(' ')).to.be.false;
            console.log(url);
        });
    });
});
