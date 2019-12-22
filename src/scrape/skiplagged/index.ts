import { IFlightSearchParams } from "data/flight/search/params";
import { getHtml } from 'scrape/skiplagged/html';
import {makeUrl} from 'scrape/skiplagged/url';
import { getDepartingTrips, getReturningTrips } from "./scrape";

export async function scrapeSkiplagged(params: IFlightSearchParams) {
  const processStartTime = process.hrtime();
  const url = await makeUrl(params);
  const html = await getHtml(url);
  const departingTrips = await getDepartingTrips(html);
  const resData: any = {
    data: departingTrips,
    url: url
  };

  // if (params.isRoundTrip && params.returnDate) {
  //   const returningTrips = await getReturningTrips(html);
  //   resData.returnTrips = returningTrips;
  // }

  const processEndTime = process.hrtime(processStartTime);
  resData.time = processEndTime;

  return resData;
}
