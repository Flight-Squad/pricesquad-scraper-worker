export interface IFlightSearchParams {
  origin: string;
  dest: string;
  departDate: Date;
  returnDate?: Date;
  isRoundTrip: boolean;
  numStops: FlightStops;
  searchProvider: SearchProviders;
}

export enum SearchProviders {
  Google = 'google',
  Kayak = 'kayak',
  Southwest = 'southwest',
  Skiplagged = 'skiplagged',
}

export enum FlightStops {
  NonStop,
  OneStop,
  AnyStops
}

export async function validateFlightSearchParams(params: IFlightSearchParams) {
  // orig and dest must be non empty and conform to existing airport/region code
  if (!(params.origin.trim() && params.dest.trim()) ||
  // naiive validation on existing code
   (params.origin.length < 3 || params.dest.length < 3)) {
    throw new Error('origin and dest must be proper codes')
  }
  // If is round trip, must have return date later than depart date
  // use moment
}

/**
 * Takes request data and processes it for easier use with controllers
 *
 * @param data
 */
export function makeFlightSearchParams(data: any): IFlightSearchParams {
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
