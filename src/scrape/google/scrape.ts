import cheerio from 'cheerio';
import currencyFormatter from 'currency-formatter';
import { Trip, TripStop, SearchProviders, TripScraperQuery } from '@flight-squad/admin';
import { parse, addDays } from 'date-fns';

const toAppropriateDate = (time: string, baseDate: Date): Date => {
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
};

const emptyStop = () => {
    return {
        stop: { city: '', code: '', name: '' },
        operator: '',
        flightNum: '',
        arrivalTime: '',
        departTime: '',
        duration: '',
    };
};

function fillLeg(origin: TripStop, dest: TripStop, legBlock: Cheerio) {}

function fillStops(scraper: CheerioStatic, stops: TripStop[], tripLegs: Cheerio) {
    tripLegs.each(function(i, elem) {
        stops[i] = stops[i] || emptyStop();
        stops[i + 1] = stops[i + 1] || emptyStop();
        fillLeg(stops[i], stops[i + 1], scraper(this));
    });
}

export async function getTripsFromHtml(query: TripScraperQuery, html): Promise<Trip[]> {
    const trips: Trip[] = [];
    const departDate = new Date(query.departDate);
    const scraper = cheerio.load(html);
    scraper('ol[class*="gws-flights-results__result-list"]').each(function(i, elem) {
        scraper(this)
            .find('li')
            .each(function(i, elem) {
                // Each element represents a trip between 2 stops
                const trip: Trip = { price: 0, stops: [], provider: SearchProviders.GoogleFlights, query };
                const originStop: TripStop = emptyStop();
                const destStop: TripStop = emptyStop();

                const times = scraper(this)
                    .find('.gws-flights-results__times-row')
                    .text()
                    .trim()
                    .split('–')
                    .map(item => item.trim())
                    .filter(item => Boolean(item));
                if (times.length < 2) return;
                originStop.departTime = toAppropriateDate(times[0], departDate).toISOString();
                destStop.arrivalTime = toAppropriateDate(times[1], departDate).toISOString();

                originStop.operator = scraper(this)
                    .find('.gws-flights-results__carriers')
                    .text()
                    .trim();

                originStop.duration = scraper(this)
                    .find('.gws-flights-results__duration')
                    .text()
                    .trim();

                // results in something like
                // "$299         $299"
                let price = scraper(this)
                    .find('.gws-flights-results__price')
                    .text()
                    .trim();

                // naiive
                price = price.split(' ')[0].trim();
                // console.log(price);

                trip.price = currencyFormatter.unformat(price, { code: 'USD' });

                // fillStops(trip.stops, scraper(this).find('.gws-flights-results__leg'));

                scraper(this)
                    .find('.gws-flights-results__leg')
                    .each(function(i, elem) {
                        // Leg depart time
                        // https://stackoverflow.com/questions/47542338/cheerio-get-image-src-with-no-class
                        const legDepart = scraper(this)
                            .find('.gws-flights-results__leg-departure')
                            .children('div')
                            .eq(0)
                            .text()
                            .trim();

                        // Leg arrival time
                        const legArrival = scraper(this)
                            .find('.gws-flights-results__leg-arrival')
                            .children('div')
                            .eq(0)
                            .text()
                            .trim();

                        const departCode = scraper(this)
                            .find('.gws-flights-results__iata-code')
                            .eq(0)
                            .text()
                            .trim();

                        const arriveCode = scraper(this)
                            .find('.gws-flights-results__iata-code')
                            .eq(1)
                            .text()
                            .trim();
                        const legDuration = scraper(this)
                            .find('.gws-flights-results__leg-duration')
                            .find('span')
                            .text()
                            .trim();
                        const airline = scraper(this)
                            .find('.gws-flights-results__leg-flight')
                            .children('div')
                            .eq(0)
                            .text()
                            .trim();
                        const airlineClass = scraper(this)
                            .find('.gws-flights-results__leg-flight')
                            .find('div[class*="gws-flights-results__seating"]')
                            .find('span')
                            .text()
                            .trim();
                        const aircraft = scraper(this)
                            .find('.gws-flights-results__leg-flight')
                            .find('.gws-flights-results__aircraft-type')
                            .children('span')
                            .eq(0)
                            .text()
                            .trim();
                        const flightNum = scraper(this)
                            .find('.gws-flights-results__other-leg-info')
                            .children('span')
                            .eq(0)
                            .text()
                            .trim();
                        console.log(
                            i,
                            legDepart,
                            legArrival,
                            legDuration,
                            departCode,
                            arriveCode,
                            airline,
                            airlineClass,
                            aircraft,
                            flightNum,
                        );
                        // console.log(code);
                    });
                console.log('-----');
                trip.stops = [originStop, destStop];

                if (trip.price) {
                    trips.push(trip);
                }
            });
    });
    return trips;
}
