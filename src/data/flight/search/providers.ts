// Essentially syntactic sugar for JS object -> https://stackoverflow.com/a/39372911/6656631
/**
 * This is the slave copy of `flightsquad/pricesquad/src/data/flightSearch/providers.ts`
 * That is the source of truth. This *should* mirror the contents of that file
 */
export enum SearchProviders {
  google = 'google',
  kayak = 'kayak',
  southwest = 'southwest',
}
