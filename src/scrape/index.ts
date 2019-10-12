import { IMessageBody } from "data/queue/message/body";
import { SearchProviders } from "data/flight/search/providers";
import scrapeGoogle from "./google";

const providerNotImplemented = new Error('Provider not implemented');

export async function scrape(data: IMessageBody) {
  switch (data.provider) {
    case SearchProviders.google: return scrapeGoogle(data.params);
    case SearchProviders.kayak: throw providerNotImplemented;
    case SearchProviders.southwest: throw providerNotImplemented;
    default: throw new Error('Provider not supported');
  }
}
