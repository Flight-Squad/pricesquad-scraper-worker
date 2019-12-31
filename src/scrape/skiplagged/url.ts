import { formatDateAsKebab } from "data/date/formatter";
import { IFlightSearchParams } from "data/flight/search/params";
import logger from "config/winston";

export async function makeUrl(params: IFlightSearchParams): Promise<string> {
  const departDate = formatDateAsKebab(new Date(params.departDate));
  const returnDate = params.returnDate
    ? formatDateAsKebab(new Date(params.returnDate))
    : "";

  const url = `https://skiplagged.com/flights/${params.origin}/${params.dest}/${departDate}/${returnDate}`;
  logger.debug(url); // Need to remove this later
  //departure date - year - month - day
  return url;
}


