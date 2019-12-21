import { IFlightSearchParams } from "data/flight/search/params";
import { getHtml } from "scrape/southwest/html";
import { getTripsFromHtml } from "scrape/southwest/scrape";
import makeUrl from "scrape/southwest/url";

export async function southwestFlights(params: IFlightSearchParams) {
  const processStartTime = process.hrtime();
  const url = await makeUrl(params);
  const html = await getHtml(url);
  console.log(html);
  const trips = await getTripsFromHtml(html);

  const processEndTime = process.hrtime(processStartTime);

  return {
    time: processEndTime,
    data: trips,
    url: url
  };
}
