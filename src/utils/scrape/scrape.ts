import { InvocationContext } from "@azure/functions";
import { type Browser, type BrowserContext, firefox } from "playwright";

import { searchByCourtCalendar } from "./calendarSearch";

export async function scrape(context: InvocationContext) {
  context.log("[scrape] - Scrape requested");
  const { browser, browserContext } = await launchBrowser(context);
  const page = await browserContext.newPage();

  await searchByCourtCalendar(context, page);
  // TODO: get cases data
  // TODO: save cases data

  await closeBrowser(context, browser, browserContext);
  context.log("[scrape] - Scrape finished");
}

async function launchBrowser(context: InvocationContext) {
  context.log("[launchBrowser] - Browser launch requested");
  const browserMode = process.env.PLAYWRIGHT_BROWSER_MODE ?? "headless";
  context.log("[launchBrowser] - Browser launch mode:", browserMode);
  const isHeadless = browserMode !== "headed";
  try {
    const browser = await firefox.launch({ headless: isHeadless });
    const browserContext = await browser.newContext();
    context.log("[launchBrowser] - Browser launch finished");
    return { browser, browserContext };
  } catch (error) {
    context.error(error);
  }
}

async function closeBrowser(
  context: InvocationContext,
  browser: Browser,
  browserContext: BrowserContext
) {
  context.log("[closeBrowser] - Browser close requested");
  await browserContext.close();
  await browser.close();
  context.log("[closeBrowser] - Browser close finished");
}
