import { app, InvocationContext, Timer } from "@azure/functions";

import { scrape } from "../utils/scrape";

export async function racineCourtwatchScraper(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  context.log("Timer function processing request");
  await scrape(context);
  context.log("Timer function processed request");
}

app.timer("racineCourtwatchScraper", {
  // Run Mon-Fri @ 11:30 am & 12:30 pm CT to account for DST
  schedule: "* */1 * * * *",
  handler: racineCourtwatchScraper,
});
