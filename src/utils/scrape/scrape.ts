import { InvocationContext } from "@azure/functions";
import { type Browser, type BrowserContext, firefox } from "playwright";

import { searchByCourtCalendar } from "./calendar-search";
import { closeBrowser, launchBrowser } from "../browser";

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
