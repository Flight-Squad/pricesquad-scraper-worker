import { formatDateAsKebab } from "data/date/formatter";
import { IFlightSearchParams } from "data/flight/search/params";
import logger from "config/winston";

export async function makeUrl(params: IFlightSearchParams): Promise<string> {
  const departDate = formatDateAsKebab(new Date(params.departDate));
  const returnDate = params.returnDate
    ? formatDateAsKebab(new Date(params.returnDate))
    : "";
const tripType = determineTripType(params.isRoundTrip);

  const url = `https://www.studentuniverse.com/flights/1/${params.origin}/${params.dest}/${departDate}/${tripType}?flexible=false&premiumCabins=false&source=productHome`;

  function determineTripType(isRoundTrip) {
    return isRoundTrip ? `${params.dest}/${params.origin}/${returnDate}` : "";
  }
  logger.debug(url); // Need to remove this later
  //departure date - year - month - day
  return url;
}


