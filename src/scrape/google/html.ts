import puppeteer from 'puppeteer';
import { cleanup } from 'config/puppeteer';

export async function getHtml(url: string): Promise<string> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('ol');
    const html = await page.$eval('.gws-flights__app-root', el => el.outerHTML);
    await cleanup(browser, page);
    return html;
}
