import { InvocationContext } from "@azure/functions";
import type { Locator, Page } from "playwright";

import { searchByCourtCalendar } from "./calendar-search";
import { getCasesData } from "./case-search-results";

import { closeBrowser, launchBrowser } from "../browser";

export async function scrape(context: InvocationContext) {
  context.log("[scrape] - Scrape requested");
  const { browser, browserContext } = await launchBrowser(context);
  const page = await browserContext.newPage();

  await searchByCourtCalendar(context, page);
  const casesData = await getCasesData(context, page);
  // TODO: save cases data

  await closeBrowser(context, browser, browserContext);
  context.log("[scrape] - Scrape finished");
}
