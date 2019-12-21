import Nightmare from "nightmare";

export async function getHtml(url: string) {
  const nightmare = new Nightmare();
  //Throws an exception if the .wait() didn't return true within the set timeframe - defualt is 30 secs

  return (
    nightmare
      .goto(url)
      .wait(".time--period") //.wait('.time--period') //it's an unordered list so I changed this from ol to ul
      .evaluate(
        () =>
          document.querySelector(".air-booking-select-price-matrix").outerHTML
      )
      //Idk why we put .outerHtml instead of .href  like I understand. But I also don't. href makes no sense to me.
      .end()
  );
}
