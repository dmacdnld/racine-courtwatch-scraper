import { InvocationContext } from "@azure/functions";
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { Browser, BrowserContext, firefox } from "playwright";

async function fetchBrowserlessApiToken(context: InvocationContext) {
  context.log("[fetchBrowserlessApiToken] - API token requested");
  const credential = new DefaultAzureCredential();
  const vaultName = "racinecourtwatchscraper";
  const secretName = "BrowserlessApiToken";
  const url = `https://${vaultName}.vault.azure.net`;
  const client = new SecretClient(url, credential);

  try {
    const secret = await client.getSecret(secretName);
    const apiToken = secret.value;
    context.log("[fetchBrowserlessApiToken] - API token retrieved");
    return apiToken;
  } catch (error) {
    context.error("[fetchBrowserlessApiToken] - API token retrieval failed:", error);
  }
}

export async function launchBrowser(context: InvocationContext) {
  context.log("[launchBrowser] - Browser launch requested");
  const browserMode = process.env.PLAYWRIGHT_BROWSER_MODE ?? "headless";
  context.log("[launchBrowser] - Browser launch mode:", browserMode);
  try {
    let browser: Browser;

    if (process.env.NODE_ENV === "production") {
      context.log("[launchBrowser] - Browser launch mode:", browserMode);
      const apiToken = await fetchBrowserlessApiToken(context);
      browser = await firefox.connect(
        `wss://production-sfo.browserless.io/firefox/playwright?token=${apiToken}&proxy=residential`
      );
    } else {
      browser = await firefox.launch();
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
