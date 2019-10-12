import { FlightStops } from "data/flight/stops";

export interface IMessageBodyParams {
  origin: string;
  dest: string;
  departDate: string;
  returnDate?: string;
  isRoundTrip: boolean;
  numStops: FlightStops;
}
