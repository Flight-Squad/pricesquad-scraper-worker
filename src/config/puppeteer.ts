import puppeteer from 'puppeteer';

export async function cleanup(browser: puppeteer.Browser, page?: puppeteer.Page): Promise<void> {
    if (page) await page.close();
    await browser.close();
}

export const newBrowser = (): Promise<puppeteer.Browser> =>
    puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
