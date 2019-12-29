import Nightmare from "nightmare";

export async function getHtml(url: string) {
  const nightmare = new Nightmare();

  return nightmare
  // Mimick a desktop browser - prevent rate limiting from Kayak
    .header('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.75 Safari/537.36')
    .goto(url)
    .wait('.Flights-Results-FlightResultsList')
    .evaluate(
      () => document.querySelector('.Flights-Results-FlightResultsList').outerHTML
    )
    .end();
}
