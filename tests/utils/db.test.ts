import { test } from "node:test";
import assert from "node:assert";

import { InvocationContext } from "@azure/functions";

import { canAccessDB } from "../../src/utils/db";

const invocationContextMock = {
  log: () => {},
  error: () => {},
} as InvocationContext;

// Temporary test to check DB connection until real e2e tests are added
test("getCaseCount", async (t) => {
  await t.test("should return a case count", async () => {
    const result = await canAccessDB(invocationContextMock);
    assert.strictEqual(result, true);
  });
});
