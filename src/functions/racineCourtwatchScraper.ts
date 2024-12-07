import { app, InvocationContext, Timer } from "@azure/functions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testDbConnection(context: InvocationContext) {
  try {
    context.log(`Testing DB connection`);
    const caseCount = await prisma.case.count();
    context.log(`DB connected - Case count: ${caseCount}`);
  } catch (error) {
    context.error(`DB connection failed: ${error}`);
  }
}

export async function racineCourtwatchScraper(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  context.log("Timer function processing request");
  await testDbConnection(context);
  context.log("Timer function processed request");
}

app.timer("racineCourtwatchScraper", {
  // Run Mon-Fri @ 11:30 am & 12:30 pm CT to account for DST
  schedule: "0 30 17-18 * * 1-5",
  handler: racineCourtwatchScraper,
});
