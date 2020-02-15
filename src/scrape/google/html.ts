import Nightmare from 'nightmare';

export async function getHtml(url: string) {
    const nightmare = new Nightmare();

    return nightmare
        .goto(url)
        .wait('ol')
        .evaluate(() => document.querySelector('.gws-flights__app-root').outerHTML)
        .end();
}
