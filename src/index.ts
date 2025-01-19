import { app } from "@azure/functions";

app.setup({
  enableHttpStream: true,
});

app.timer("test", {
  schedule: "*/5 * * * * *",
  handler: (myTimer, context) => {
    const timeStamp = new Date().toISOString();
    context.log("Hello World! Timer function executed at:", timeStamp);
  },
});
