import cheerio from "cheerio";
import currencyFormatter from "currency-formatter";

/**
 *
 * @param html The html to parse
 */
export async function getDepartingTrips(html) {
  const trips = [];
  const scraper = cheerio.load(html);

  scraper(this).each((i, elem) => parseTrips(i, elem, trips));

  console.log(trips.length);
  return trips;
}

/**
 *
 * @param html The html to parse
 */
export async function getReturningTrips(html) {
  const trips = [];
  const scraper = cheerio.load(html);

  scraper(".air-booking-select-price-matrix")
    .filter(function(i, el) {
      return scraper(this).attr("id") === "air-booking-product-1";
    })
    .each((i, elem) => parseTrips(i, elem, trips));

  return trips;
}

/**
 *
 * @param i
 * @param elem
 * @param trips Array to push the trip obejects into
 */
function parseTrips(i, elem, trips) {
  const scraper = cheerio.load(elem);
  scraper(this).each(function(i, elem) {
    scraper(this)
      .find(".trips")
      .each(function(i, elem) {
        const trip: any = { times: {} };

        trip.times.depart = scraper(this)
          .find(".trip-path-point-time ")
          .filter(function(i, el) {
            return scraper(this).attr("type") === "origination";
          })
          .text()
          .trim();

        trip.times.arrival = scraper(this)
          .find(".trip-path-point-last")
          .filter(function(i, el) {
            return scraper(this).attr("type") === "destination";
          })
          .text()
          .trim();

        trip.duration = scraper(this)
          .find(".trip-path-duration")
          .text()
          .trim();

        trip.stops = scraper(this)
          .find(".trip-stops")
          .text()
          .trim();

        trip.price = scraper(this)
          .find(".trip-cost")
          .last()
          .text();

        trip.price = Number(trip.price);

        if (trip.price) {
          trips.push(trip);
        }
      });
  });
}
