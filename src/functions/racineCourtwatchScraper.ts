import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  Timer,
} from "@azure/functions";

import { scrape } from "../utils/scrape";
import { getSecret } from "../utils/secrets";

export async function timerTrigger(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  try {
    context.log("[timerTrigger] - Timer trigger execution requested");
    await scrape(context);
    context.log("[timerTrigger] - Timer trigger execution complete");
  } catch (error) {
    context.error("[timerTrigger] - Timer trigger execution failed", error);
  }
}

app.timer("timerTrigger", {
  // Run Mon-Fri @ 11:30 am & 12:30 pm CT to account for DST
  schedule: "0 30 17-18 * * 1-5",
  handler: timerTrigger,
});

export async function httpTrigger(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const apiTestTokenSecret = await getSecret(context, "ApiTestToken");
    if (
      apiTestTokenSecret.value === undefined ||
      request.headers.get("API-Test-Token") !== apiTestTokenSecret.value
    ) {
      context.error("Unauthorized request");
      return { status: 403 };
    }
  } catch (error) {}

  try {
    context.log("[httpTrigger] - HTTP trigger execution requested");
    await scrape(context);
    context.log("[httpTrigger] - HTTP trigger execution complete");
  } catch (error) {
    context.error("[httpTrigger] - HTTP trigger execution failed", error);
  } finally {
    return { status: 200 };
  }
}

app.http("scrape", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: httpTrigger,
});
