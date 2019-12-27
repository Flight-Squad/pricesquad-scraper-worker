import Nightmare from "nightmare";

export async function getHtml(url: string) {
  const nightmare = new Nightmare();
  //Throws an exception if the .wait() didn't return true within the set timeframe - defualt is 30 secs

  return nightmare
  .header('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.75 Safari/537.36')
  .goto(url)
  .wait("#flight_recommended_cheapest")//#departureTime1
  .evaluate(() => document.querySelector(".flight-results-list").outerHTML)
  .end();


}
