export type TypeInCustodyCaseActivity =
  (typeof inCustodyCaseActivities)[number];

export const inCustodyCaseActivities = [
  "Initial appearance",
  "Return on warrant",
  "Return on warrant/Initial appearance",
  "Adjourned initial appearance",
] as const;
