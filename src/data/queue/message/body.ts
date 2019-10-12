import { FlightStops } from "data/flight/stops";
import { SearchProviders } from "data/flight/search/providers";
import { IMessageBodyParams } from "./params";

export interface IMessageBody {
  params: IMessageBodyParams;
  provider: SearchProviders;
}
