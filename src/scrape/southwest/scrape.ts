import cheerio from "cheerio";
import currencyFormatter from "currency-formatter";

export async function getTripsFromHtml(html) {
  const trips = [];
  const scraper = cheerio.load(html);
  //Not 100% sure what the thing below does

  //Should I get the span since the ul doesn't have a class really
  scraper("ul").each(function(i, elem) {
    scraper(this)
      .find("li")
      .each(function(i, elem) {
        const trip: any = { times: {} };

        trip.times.depart = scraper(this) //Can't get this due to the type='origination' or type='destination'
          .find(".air-operations-time-status") //.find(".select-detail--time")
          .filter(function(i, el) {
            return scraper(this).attr("type") === "origination";
          })
          .text()
          .trim();

        trip.times.arrival = scraper(this) //Can't get this due to the type='origination' or type='destination'
          .find(".air-operations-time-status") //.find(".select-detail--time")
          .filter(function(i, el) {
            return scraper(this).attr("type") === "destination";
          })
          .text()
          .trim();
        console.log(`Times: ${trip.times}`);
        trip.duration = scraper(this)
          .find(".flight-stops--duration-time")
          .text()
          .trim();
        console.log(`Duration: ${trip.duration}`);
        trip.stops = scraper(this)
          .find(".flight-stops-badge")
          .text()
          .trim();
        console.log(`Stops: ${trip.stops}`);
        // results in something like
        // "$299         $299"
        trip.price = scraper(this)
          .find(".fare-button--value-total") //This prolly won't work bc it would list out all of them. And div layout doesn't make sense.
          .last()
          .text();
        console.log(`Price: ${trip.price}`);

        trip.price = Number(trip.price);

        // naiive
        // price = price.split(" ")[0].trim();
        // console.log(price);

        // trip.price = currencyFormatter.unformat(price, { code: "USD" });

        if (trip.price) {
          trips.push(trip);
        }
      });
  });
  // Sorting takes unnecessary cpu time, this can be done client-side/ on a database call
  // trips.sort((a,b) => a.price - b.price);
  return trips;
}
