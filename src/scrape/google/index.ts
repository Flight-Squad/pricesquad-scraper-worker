import { getHtml } from "./html";
import makeUrl from "./url";
import { getTripsFromHtml } from "./scrape";
import { IMessageBodyParams } from "data/queue/message/params";

/**
 * params in an object with the following
 *
 */
async function scrapeGoogle(params: IMessageBodyParams) {
  const processStartTime = process.hrtime();
  const url = await makeUrl(params);
  const listContainer = await getHtml(url);
  const trips = await getTripsFromHtml(listContainer);

  const processEndTime = process.hrtime(processStartTime);

  return {
    time: processEndTime,
    data: trips,
    url: url
  };
}

// Keeping this for future testing

// const params = {
//   origin: 'BOS',
//   dest: 'SFO',
//   departDate: new Date('2019-10-01'),
//   isRoundTrip: false,
//   numStops: 0
// };

// scrapeGoogle(params).then(res => console.log(res))

export default scrapeGoogle;
