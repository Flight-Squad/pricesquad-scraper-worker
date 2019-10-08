import { IMessageBody } from "data/queue/message/body";
import { SearchProviders } from "data/flight/search/providers";

export async function scrape(data: IMessageBody) {
  switch (data.provider) {
    case SearchProviders.google: return scrapeGoogle(data);
    case SearchProviders.kayak: return scrapeKayak(data);
    case SearchProviders.southwest: return scrapeSouthwest(data);
    default: throw new Error('Provider not supported');
  }
}
