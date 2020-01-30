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
                const originStop: TripStop = {
                    stop: { city: '', code: '', name: '' },
                    operator: '',
                    flightNum: '',
                    arrivalTime: '',
                    departTime: '',
                    duration: '',
                };
                const destStop: TripStop = {
                    stop: { city: '', code: '', name: '' },
                    operator: '',
                    flightNum: '',
                    arrivalTime: '',
                    departTime: '',
                    duration: '',
                };

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
                // trip.stops = scraper(this)
                //     .find('.gws-flights-results__stops')
                //     .text()
                //     .trim();
                // trip.layover = scraper(this)
                //     .find('.gws-flights-results__layover-time')
                //     .text()
                //     .trim();

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
                trip.stops = [originStop, destStop];

                if (trip.price) {
                    trips.push(trip);
                }
            });
    });
    return trips;
}
