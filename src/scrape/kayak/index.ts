import { IFlightSearchParams } from "data/flight/search/params";
import makeUrl from "scrape/kayak/url";
import { getHtml } from "scrape/kayak/html";
import { kayakTripData } from "./scrape";

export async function scrapeKayak(params: IFlightSearchParams) {
  const processStartTime = process.hrtime();
  const url = await makeUrl(params);
  const html = await getHtml(url);
  const trips = await kayakTripData(html);
  const response: any = {
    data: trips,
    url: url
  }

  const processEndTime = process.hrtime(processStartTime);
  response.time = processEndTime;

  return response;
}
