import scrapeGoogle from '..';
import * as Queries from '../../__tests__/scraperQueries';
import { TripScraperQuery, SearchProviders } from '@flight-squad/admin';
import { expect } from 'chai';

describe('Google Scraper Integration Test @slow', async () => {
    describe('Scrape One-Way Trips', async () => {
        it('When given a query for a one-way domestic non-stop flight, it returns two stops', async () => {
            // Arrange
            const query: TripScraperQuery = {
                ...Queries.DomesticOnewayInOneWeek,
                provider: SearchProviders.GoogleFlights,
                group: '',
            };
            // Act
            const results = await scrapeGoogle(query);
            // Assert
            expect(results.data.length).to.be.greaterThan(0);
            results.data.map(trip => {
                expect(trip.stops).to.have.lengthOf(2);
                expect(trip.stops[0]).to.have.property('duration');
            });
        });
    });

    describe('Scrape Round Trips', async () => {
        it('When given a query for a round-trip domestic flight, it returns at least 3 stops', async () => {
            // Arrange
            const query: TripScraperQuery = {
                ...Queries.DomesticRoundTripInOneWeek,
                provider: SearchProviders.GoogleFlights,
                group: '',
            };
            // Act
            const results = await scrapeGoogle(query);
            // Assert
            expect(results.data.length).to.be.greaterThan(0);
            results.data.map(trip => {
                expect(trip.stops.length).to.be.greaterThan(3);
                expect(trip.stops[0]).to.have.property('duration');
            });
        });
    });
});
