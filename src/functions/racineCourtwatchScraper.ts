import { app, InvocationContext, Timer } from "@azure/functions";

export async function racineCourtwatchScraper(myTimer: Timer, context: InvocationContext): Promise<void> {
    context.log('Timer function processed request.');
}

app.timer('racineCourtwatchScraper', {
    schedule: '0 30 12 * * 1-5',
    handler: racineCourtwatchScraper
});
