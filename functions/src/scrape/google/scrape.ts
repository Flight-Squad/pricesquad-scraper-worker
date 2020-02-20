import cheerio = require('cheerio');
import currencyFormatter = require('currency-formatter');
import { Trip, TripStop, SearchProviders, TripScraperQuery } from '@flight-squad/admin';
import { parse, addDays } from 'date-fns';
import { googleDebugger } from '.';

function toAppropriateDate(time: string, baseDate: Date): Date {
    // time is usually formatted as "8:59 PM"
    let parsableTime = time;
    let date = baseDate;
    if (time.includes('+')) {
        // time is formatted as "5:57 PM+1"
        const parts = time.split('+').map(item => item.trim());
        parsableTime = parts[0];
        date = addDays(baseDate, Number(parts[1]));
    }
    // FIXME: Implicitly assuming time is given in eastern time -> maybe from when we parse the query depart date?
    return parse(parsableTime, 'hh:mm a', date);
}

function emptyStop(): TripStop {
    return {
        stop: { city: '', code: '', name: '' },
        operator: '',
        flightNum: '',
        arrivalTime: '',
        departTime: '',
        duration: '',
    };
}

// Cheerio Helper Functions
const indexOf = (block: Cheerio, index: number): string =>
    block
        .eq(index)
        .text()
        .trim();

const indexedChildOf = (childType: string, defaultIndex: number) => (block: Cheerio, indexOverload?: number): string =>
    indexOf(block.children(childType), indexOverload || defaultIndex);

const getChildDiv = indexedChildOf('div', 0);
const getChildSpan = indexedChildOf('span', 0);

// Scraper Unit Functions
const LegScraper = (legBlock: Cheerio) =>
    Object.freeze({
        depart: {
            time: (): string => getChildDiv(legBlock.find('.gws-flights-results__leg-departure')),
            code: (): string => indexOf(legBlock.find('.gws-flights-results__iata-code'), 0),
        },
        arrival: {
            time: (): string => getChildDiv(legBlock.find('.gws-flights-results__leg-arrival')),
            code: (): string => indexOf(legBlock.find('.gws-flights-results__iata-code'), 1),
        },
        duration: (): string =>
            legBlock
                .find('.gws-flights-results__leg-duration')
                .find('span')
                .text()
                .trim(),
        airline: (): string => getChildDiv(legBlock.find('.gws-flights-results__leg-flight')),
        airlineClass: (): string =>
            legBlock
                .find('.gws-flights-results__leg-flight')
                .find('div[class*="gws-flights-results__seating"]')
                .find('span')
                .text()
                .trim(),
        aircraftType: (): string =>
            getChildSpan(legBlock.find('.gws-flights-results__leg-flight').find('.gws-flights-results__aircraft-type')),
        flightNumber: (): string => getChildSpan(legBlock.find('.gws-flights-results__other-leg-info')),
    });

function setBaseDate(date: Date) {
    const toTimestamp = (time: string): string => toAppropriateDate(time, date).toISOString();
    return function fillStops(scraper: CheerioStatic, stops: TripStop[], tripLegs: Cheerio): void {
        function fillLeg(origin: TripStop, dest: TripStop, legBlock: Cheerio): void {
            const Scrape = LegScraper(legBlock);
            // Leg depart time
            // https://stackoverflow.com/questions/47542338/cheerio-get-image-src-with-no-class
            origin.departTime = toTimestamp(Scrape.depart.time());
            origin.stop.code = Scrape.depart.code();
            origin.duration = Scrape.duration();
            origin.operator = Scrape.airline();
            // const cabinClass = Scrape.airlineClass();
            // const aircraft = Scrape.aircraftType();
            origin.flightNum = Scrape.flightNumber();

            dest.arrivalTime = toTimestamp(Scrape.arrival.time());
            dest.stop.code = Scrape.arrival.code();
            googleDebugger('Origin', origin);
            googleDebugger('Dest', dest);
        }

        tripLegs.each(function(i) {
            stops[i] = stops[i] || emptyStop();
            stops[i + 1] = stops[i + 1] || emptyStop();
            fillLeg(stops[i], stops[i + 1], scraper(this));
        });
    };
}

export async function getTripsFromHtml(query: TripScraperQuery, baseDate: string | Date, html): Promise<Trip[]> {
    const trips: Trip[] = [];
    const fillStops = setBaseDate(new Date(baseDate));
    const scraper = cheerio.load(html);
    scraper('ol[class*="gws-flights-results__result-list"]').each(function(i, elem) {
        scraper(this)
            .find('li')
            .each(function(i, elem) {
                // Each element represents a trip between 2 stops
                const trip: Trip = { price: 0, stops: [], provider: SearchProviders.GoogleFlights, query };

                // results in something like
                // "$299         $299"
                let price = scraper(this)
                    .find('.gws-flights-results__price')
                    .text()
                    .trim();

                // naiive
                price = price.split(' ')[0].trim();
                trip.price = currencyFormatter.unformat(price, { code: 'USD' });

                fillStops(scraper, trip.stops, scraper(this).find('.gws-flights-results__leg'));
                googleDebugger('----');

                if (trip.price) {
                    trips.push(trip);
                }
            });
    });
    return trips;
}
