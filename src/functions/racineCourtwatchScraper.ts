import { app, InvocationContext, Timer } from "@azure/functions";

export async function racineCourtwatchScraper(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  context.log("Timer function processed request", JSON.stringify(myTimer));
}

app.timer("racineCourtwatchScraper", {
  // Run Mon-Fri @ 11:30 am & 12:30 pm CT to account for DST
  schedule: "0 30 17-18 * * 1-5",
  handler: racineCourtwatchScraper,
});
