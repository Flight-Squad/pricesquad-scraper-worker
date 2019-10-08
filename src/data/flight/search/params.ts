import { FlightStops } from "../stops";
import { IMessageBody } from "data/queue/message/body";
var moment = require('moment');

export interface IFlightSearchParams {
  origin: string;
  dest: string;
  departDate: Date;
  returnDate?: Date;
  isRoundTrip: boolean;
  numStops: FlightStops;
}

/**
 * Takes request data and processes it for easier use with controllers
 *
 * @param data
 */
export function makeFlightSearchParams(data: IMessageBody): IFlightSearchParams {
  const params: any = {
    origin: data.origin,
    dest: data.dest,
    departDate: new Date(data.departDate),
    isRoundTrip: data.isRoundTrip,
    numStops: data.numStops
  };

  if (data.returnDate) {
    params.returnDate = new Date(data.returnDate);
  }

  return params;
}
