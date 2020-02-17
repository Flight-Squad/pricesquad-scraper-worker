import puppeteer from 'puppeteer';

export async function cleanup(browser: puppeteer.Browser, page?: puppeteer.Page): Promise<void> {
    if (page) await page.close();
    await browser.close();
}
