import cheerio from "cheerio";
import currencyFormatter from "currency-formatter";

/**
 *
 * @param html The html to parse
 */
export async function getDepartingTrips(html) {
  const trips = [];
  const scraper = cheerio.load(html);

  await scraper(".infinite-trip-list").each(function(i, elem) {
    scraper(this)
      .find(".trip")
      .each(function(i, elem) {
        const trip: any = { times: {} };

        trip.times.depart = scraper(this)
          .find(".trip-path-point-time")
          .text()
          .trim();

        trip.times.depart = trip.times.depart.substring(
          0,
          trip.times.depart.indexOf("m") + 1
        );

        trip.times.arrival = scraper(this)
          .find(".trip-path-point-last")
          .text()
          .trim();
        trip.times.arrival = trip.times.arrival.substring(
          0,
          trip.times.arrival.indexOf("m") + 1
        );

        trip.duration = scraper(this)
          .find(".trip-path-duration")
          .text()
          .trim();
        trip.duration = trip.duration.split(" ", 1);

        trip.stops = scraper(this)
          .find(".trip-stops")
          .text()
          .trim();

        trip.price = scraper(this)
          .find(".trip-cost")
          .find("p")
          .text()
          .trim();

        trip.price = currencyFormatter.unformat(trip.price, { code: "USD" });

        trips.push(trip);
      });
  });

  console.log(trips.length);
  return trips;
}
