import { app, InvocationContext, Timer } from "@azure/functions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testDbConnection(context) {
  const caseCount = await prisma.case.count();
  context.log(`DB connected - Case count: ${caseCount}`);
}

export async function racineCourtwatchScraper(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  context.log("Timer function processed request");
  testDbConnection(context).catch((error) => {
    context.error(error);
  });
}

app.timer("racineCourtwatchScraper", {
  // Run Mon-Fri @ 11:30 am & 12:30 pm CT to account for DST
  schedule: "0 30 17-18 * * 1-5",
  handler: racineCourtwatchScraper,
});
