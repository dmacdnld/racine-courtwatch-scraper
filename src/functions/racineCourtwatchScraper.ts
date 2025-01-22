import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  Timer,
} from "@azure/functions";

import { scrape } from "../utils/scrape";

export async function racineCourtwatchScraper(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  context.log("Timer function processing request");
  await scrape(context);
  context.log("Timer function processed request");
}

// app.timer("racineCourtwatchScraper", {
//   // Run Mon-Fri @ 11:30 am & 12:30 pm CT to account for DST
//   schedule: "* */10 * * * *",
//   handler: racineCourtwatchScraper,
// });

export async function httpTrigger1(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("HTTP function processing request");
  await scrape(context);
  context.log("HTTP function processed request");
  return { status: 200 };
}

app.http("httpTrigger1", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: httpTrigger1,
});
