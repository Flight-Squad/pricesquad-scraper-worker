import cheerio from "cheerio";
import currencyFormatter from "currency-formatter";
import logger from 'config/winston'

export async function kayakTripData(html) {
  const scraper = cheerio.load(html);
  const prices = [], flightNumbers = [], stops = [], durations = [], airlines = [];

  // Sometimes, providers obscure class names with generated text
  // However, they usually contain a consistent string -> select based on that
  scraper('div[class*="Flights-Results-FlightResultItem"]').each(function (i, elem) {
    scraper(this).find('.resultInner').find('.section.times').find('.bottom').each(function (i, elem) {
      airlines.push(scraper(this).text())
    })

    scraper(this).find('.resultInner').find('.section.duration').find('.top').each(function (i, elem) {
      let duration = scraper(this).text().trim();
      duration = duration.replace(/\\"/g, ''); //regex used to remove escape characters
      durations.push(duration);
    })

    scraper(this).find('.resultInner').find('.section.stops').find('.top').each(function (i, elem) {
      stops.push(scraper(this).text().trim())
    })

    prices.push(scraper(this).find('.above-button').find('.price.option-text').text().trim());

  });

  const trips = makeAggregatorTripsData(prices, stops, airlines, durations);

  return trips;
}

function makeAggregatorTripsData(prices, stops, airlines, durations) {
  const dataIsConsistent = prices.length === stops.length && stops.length === durations.length && durations.length === airlines.length; //True or False - used for later selection
  const trips = [];
  if (dataIsConsistent) {
    for (let i = 0; i < stops.length; i++) {
      trips.push({
        price: prices[i],
        stops: stops[i],
        airline: airlines[i],
        duration: durations[i],
      })
    }
  } else {
    const lengthData = {
      prices: prices.length,
      stops: stops.length,
      airlines: airlines.length,
      durations: durations.length
    };
    const totalData = {
      prices,
      stops,
      airlines,
      durations
    };
    logger.error(`Kayak data not consistent--${JSON.stringify(lengthData)}--${JSON.stringify(totalData)}`)
  }
  return trips;
}
