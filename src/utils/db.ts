import { InvocationContext } from "@azure/functions";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
client.$connect();

export async function canAccessDB(context: InvocationContext) {
  try {
    context.log(`[canAccessDB] - Testing DB connection`);
    const caseCount = await client.case.count();
    context.log(`[canAccessDB] - DB connected - Case count: ${caseCount}`);
    return true;
  } catch (error) {
    context.error(`[canAccessDB] - DB connection failed: ${error}`);
    return false;
  } finally {
    client.$disconnect();
  }
}
