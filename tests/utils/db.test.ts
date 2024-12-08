import { test } from "node:test";
import assert from "node:assert";

import { InvocationContext } from "@azure/functions";

import { getCaseCount } from "../../src/utils/db";

const invocationContextMock = {
  log: () => {},
  error: () => {},
} as InvocationContext;

// Temporary test to check DB connection
test("getCaseCount", async (t) => {
  await t.test("should return a case count", async () => {
    const result = await getCaseCount(invocationContextMock);
    assert.strictEqual(typeof result, "number");
  });
});
