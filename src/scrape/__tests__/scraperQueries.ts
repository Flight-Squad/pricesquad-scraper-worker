import { TripGroupQuery, FlightStops } from '@flight-squad/admin';
import { format, formatISO, add } from 'date-fns';

const today = new Date();

export const DomesticOnewayToday: TripGroupQuery = {
    origin: 'BOS',
    dest: 'BWI',
    departDate: formatISO(today, { representation: 'date' }),
    isRoundTrip: false,
    stops: FlightStops.NonStop,
};

export const DomesticOnewayInOneWeek: TripGroupQuery = {
    origin: 'BOS',
    dest: 'BWI',
    departDate: formatISO(add(today, { days: 7 }), { representation: 'date' }),
    isRoundTrip: false,
    stops: FlightStops.NonStop,
};

export const DomesticRoundTripInOneWeek: TripGroupQuery = {
    origin: 'BOS',
    dest: 'BWI',
    departDate: formatISO(add(today, { days: 7 }), { representation: 'date' }),
    returnDate: formatISO(add(today, { days: 14 }), { representation: 'date' }),
    isRoundTrip: true,
    stops: FlightStops.AnyStops,
};
