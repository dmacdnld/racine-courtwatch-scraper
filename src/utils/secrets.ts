import { InvocationContext } from "@azure/functions";
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

const VAULT_NAME = "racinecourtwatchscraper";
let secretClient: SecretClient;
export async function getSecret(
  context: InvocationContext,
  secretName: string
) {
  if (!secretClient) {
    const credential = new DefaultAzureCredential();
    const url = `https://${VAULT_NAME}.vault.azure.net`;
    secretClient = new SecretClient(url, credential);
  }

  try {
    context.log("[getSecret] - Vault secret requested");
    const secret = await secretClient.getSecret(secretName);
    context.log("[getSecret] - Vault secret retrieved");
    return secret;
  } catch (error) {
    context.error("[getSecret] - Vault secret retrieval failed", error);
  }
}
