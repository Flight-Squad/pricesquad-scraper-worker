import { IFlightSearchParams } from "data/flight/search/params";
import { getHtml } from "scrape/student-universe/html";
import { makeUrl } from "scrape/student-universe/url";
import { getDepartingTrips } from "./scrape";

export async function scrapeStudentUniverse(params: IFlightSearchParams) {
  const processStartTime = process.hrtime();
  const url = await makeUrl(params);
  const html = await getHtml(url);

// const fs =require ('fs')
//   fs.writeFile( 'A:/Documents/Write Files/HTML.txt', html, (err) => {

//     // In case of a error throw err.
//     if (err) throw err;
// })
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
