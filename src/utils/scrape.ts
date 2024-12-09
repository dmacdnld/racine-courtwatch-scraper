import { InvocationContext } from "@azure/functions";
import { firefox, type Locator, type Page } from "playwright";

export async function scrape(context: InvocationContext) {
  context.log("scrape - scrape requested");
  const browserMode = process.env.PLAYWRIGHT_BROWSER_MODE ?? "headless";
  context.log(`scrape - Playwright browser mode: ${browserMode}`);
  const isHeadless = browserMode !== "headed";
  const browser = await firefox.launch({ headless: isHeadless });
  const browserContext = await browser.newContext();
  const page = await browserContext.newPage();
  await page.goto("https://wcca.wicourts.gov/courtOfficialCalendar.html");

  // TODO: search by court calendar
  // TODO: get cases data
  // TODO: save cases data

  await browserContext.close();
  await browser.close();

  context.log("scrape - scrape finished");
}
