import cheerio from "cheerio";
import currencyFormatter from "currency-formatter";

/**
 *
 * @param html The html to parse
 */
export async function getDepartingTrips(html) {
  const trips = [];
  const scraper = cheerio.load(html);

  //BROKEN IN THE SENSE THAT IT ONLY SEMI-WORKS FOR FLIGHTS WITH MORE THAN ONE STOP

  scraper(".itin").each(function(i, elem) {
    const trip: any = {
      return: { times: {}, airline: {} },
      depart: { times: {}, airline: {} }
    };
    trip.depart.airline.name = scraper(this)
      .find(".itin-leg-summary-carrier")
      .find("#airlineName0")
      .text()
      .trim();

    trip.return.airline.name = scraper(this)
      .find(".itin-leg-summary-carrier")
      .find("#airlineName1")
      .text()
      .trim();

    scraper(this).find("su-itinerary-leg-details").each(function(i, elem) {
      // for each "su-itinerary-leg-details" found, do the following:
      trip.depart.airline.number = scraper(this)
     // .find(".itin-details-carrier")
        .find("#flightNumberLeg0flight0")
        .text()
        .trim();
      trip.return.airline.number = scraper(this)
      //.find(".itin-details-carrier")
        .find("#flightNumberLeg1flight1")
        .text()
        .trim();
    });

    trip.depart.times.depart = scraper(this)
      .find(".itin-leg-summary-times")
      .find("#departureTime0")
      .text()
      .trim();
    trip.depart.times.arrival = scraper(this)
      .find(".itin-leg-summary-times")
      .find("#arrivalTime0")
      .text()
      .trim();

    trip.return.times.depart = scraper(this)
      .find(".itin-leg-summary-times")
      .find("#departureTime1")
      .text()
      .trim();
    trip.return.times.arrival = scraper(this)
      .find(".itin-leg-summary-times")
      .find("#arrivalTime1")
      .text()
      .trim();

    trip.depart.duration = scraper(this)
      .find(".itin-leg-summary-duration")
      .find("#duration0")
      .text()
      .trim();
    // trip.duration = trip.duration.split(" ", 1);

    trip.return.duration = scraper(this)
      .find(".itin-leg-summary-duration")
      .find("#duration1")
      .text()
      .trim();

    trip.depart.stops = scraper(this)
      .find(".itin-leg-summary-stops")
      .find("#stops0")
      .text()
      .trim();
    trip.return.stops = scraper(this)
      .find(".itin-leg-summary-stops")
      .find("#stops1")
      .text()
      .trim();

    trip.price = scraper(this)
      .find(".itin-price-price")
      .text()
      .trim();

    trip.price = currencyFormatter.unformat(trip.price, { code: "USD" });

    trips.push(trip);
  });

  console.log(trips.length);
  return trips;
}
