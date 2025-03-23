import { InvocationContext } from "@azure/functions";
import { Browser, BrowserContext, firefox } from "playwright";

import { getSecret } from "./secrets";

async function fetchBrowserlessApiToken(context: InvocationContext) {
  context.log("[fetchBrowserlessApiToken] - API token requested");
  try {
    const secret = await getSecret(context, "BrowserlessApiToken");
    const apiToken = secret.value;
    context.log("[fetchBrowserlessApiToken] - API token retrieved");
    return apiToken;
  } catch (error) {
    context.error(
      "[fetchBrowserlessApiToken] - API token retrieval failed:",
      error
    );
  }
}

export async function launchBrowser(context: InvocationContext) {
  context.log("[launchBrowser] - Browser launch requested");
  try {
    let browser: Browser;

    if (
      process.env.NODE_ENV === "production" ||
      process.env.NODE_ENV === "staging"
    ) {
      context.log("[launchBrowser] - Local Firefox launch requested");
      browser = await firefox.launch();
    } else {
      const apiToken = await fetchBrowserlessApiToken(context);
      context.log("[launchBrowser] - Browserless Firefox launch requested");
      browser = await firefox.connect(
        `wss://production-sfo.browserless.io/firefox/playwright?token=${apiToken}&proxy=residential`
      );
    }

    const browserContext = await browser.newContext();
    context.log("[launchBrowser] - Browser launch finished");
    return { browser, browserContext };
  } catch (error) {
    context.error("[launchBrowser] - Browser launch failed:", error);
  }
}

export async function closeBrowser(
  context: InvocationContext,
  browser: Browser,
  browserContext: BrowserContext
) {
  context.log("[closeBrowser] - Browser close requested");
  await browserContext.close();
  await browser.close();
  context.log("[closeBrowser] - Browser close finished");
}
