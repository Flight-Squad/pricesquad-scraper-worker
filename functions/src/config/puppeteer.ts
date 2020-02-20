import puppeteer = require('puppeteer-core');
import chromium = require('chrome-aws-lambda');

export async function cleanup(browser: puppeteer.Browser, page?: puppeteer.Page): Promise<void> {
    if (page) await page.close();
    await browser.close();
}

export const newBrowser = async (): Promise<puppeteer.Browser> =>
    chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
    });
