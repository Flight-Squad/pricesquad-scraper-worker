import Nightmare from "nightmare";

export async function getHtml(url: string) {
  const nightmare = new Nightmare();
  //Throws an exception if the .wait() didn't return true within the set timeframe - defualt is 30 secs

  return nightmare
  .goto(url)
  .wait(".trip-duration")
  .evaluate(() => document.querySelector(".trip-list").outerHTML)
  .end();


}
