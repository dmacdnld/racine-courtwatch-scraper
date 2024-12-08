import { InvocationContext } from "@azure/functions";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
client.$connect();

export async function getCaseCount(context: InvocationContext) {
  try {
    context.log(`Testing DB connection`);
    const caseCount = await client.case.count();
    context.log(`DB connected - Case count: ${caseCount}`);
    return caseCount;
  } catch (error) {
    context.error(`DB connection failed: ${error}`);
  }
}
