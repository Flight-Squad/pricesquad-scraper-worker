import { FlightStops } from "data/flight/stops";
import { SearchProviders } from "data/flight/search/providers";

export interface IMessageBody {
  origin: string;
  dest: string;
  departDate: string;
  returnDate?: string;
  isRoundTrip: boolean;
  numStops: FlightStops;
  provider: SearchProviders;
}
