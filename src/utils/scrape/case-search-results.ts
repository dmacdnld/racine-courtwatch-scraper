import { InvocationContext } from "@azure/functions";
import type { Locator, Page } from "playwright";

import type { TypeIngestCase } from "./types";

import { parseHTMLCaseDateTimeString } from "../date";
import {
  inCustodyCaseActivities,
  type TypeInCustodyCaseActivity,
} from "./constants";

export async function getCasesData(
  context: InvocationContext,
  page: Page
): Promise<TypeIngestCase[]> {
  try {
    context.log("[getCasesData] - Cases data retrieval requested");

    context.log("[getCasesData] - Search results page retrieval requested");
    await page.waitForURL(
      "https://wcca.wicourts.gov/courtOfficialCalendarReport.html**"
    );
    context.log("[getCasesData] - Search results page retrieval finished");

    const casesData: TypeIngestCase[] = [];
    const caseRows = page.locator(
      "css=.calendar-container > .row:not(.calendar-header)"
    );
    const caseRowsCount = await caseRows.count();
    context.log(`[getCasesData] - Scanning ${caseRowsCount} case(s)`);
    for (let i = 0; i < caseRowsCount; i++) {
      context.log(
        `[getCasesData] - Scanning case ${i + 1} of ${caseRowsCount}`
      );
      const caseRow = caseRows.nth(i);
      const shouldViewCase = await isInCustodyHearing(context, caseRow);
      if (shouldViewCase) {
        context.log(
          `[getCasesData] - Case details retrieval for case ${
            i + 1
          } of ${caseRowsCount} requested`
        );
        // TODO: get case details data
      } else {
        context.log(
          `[getCasesData] - Case details retrieval for case ${
            i + 1
          } of ${caseRowsCount} not requested`
        );
        continue;
      }
    }
    context.log(
      `[getCasesData] - Retrieved data for ${casesData.length} case(s)`
    );
    context.log("[getCasesData] - Cases data retrieval finished");
    return casesData;
  } catch (error) {
    context.error("[getCasesData] - Cases data retrieval failed", error);
    throw error;
  }
}

async function isInCustodyHearing(
  context: InvocationContext,
  caseRow: Locator
) {
  try {
    context.log(
      "[isInCustodyHearing] - In-custody hearing verification requested"
    );

    const caseActivityDateTime = await getCaseActivityDateTime(
      context,
      caseRow
    );
    const caseActivityDateTimeFormatted = caseActivityDateTime.format("HH:mm");
    const isCorrectCaseActivityTime =
      caseActivityDateTimeFormatted === "13:30" ||
      caseActivityDateTimeFormatted === "13:45";

    if (!isCorrectCaseActivityTime) {
      context.log(
        `[isInCustodyHearing] - Case activity time of ${caseActivityDateTimeFormatted} is outside expected time`
      );
      return false;
    }

    const caseActivityType = await getCaseActivityType(context, caseRow);
    const isCorrectCaseActivityType =
      inCustodyCaseActivities.includes(caseActivityType);

    if (!isCorrectCaseActivityType) {
      context.log(
        `[isInCustodyHearing] - Case activity type of ${caseActivityType} is outside expected types`
      );
      return false;
    }

    context.log(
      `[isInCustodyHearing] - Case activity time of ${caseActivityDateTimeFormatted} and type of ${caseActivityType} meet in-custody hearing expectations`
    );
    return true;
  } catch (error) {
    context.error(
      "[isInCustodyHearing] - In-custody hearing verification failed",
      error
    );
    throw error;
  }
}

async function getCaseActivityDateTime(
  context: InvocationContext,
  caseRow: Locator
) {
  try {
    context.log(
      "[getCaseActivityDateTime] - Case activity date time retrieval requested"
    );
    const caseDateSpan = caseRow.locator(".date");
    const caseDateRawText = await caseDateSpan.innerText();
    const caseActivityDateTime = parseHTMLCaseDateTimeString(caseDateRawText);
    context.log(
      `[getCaseActivityDateTime] - Case activity date time: ${caseActivityDateTime.format()}`
    );
    context.log(
      "[getCaseActivityDateTime] - Case activity date time retrieval finished"
    );
    return caseActivityDateTime;
  } catch (error) {
    context.error(
      "[getCaseActivityDateTime] - Case activity date time retrieval failed",
      error
    );
    throw error;
  }
}

async function getCaseActivityType(
  context: InvocationContext,
  caseRow: Locator
) {
  try {
    context.log(
      "[getCaseActivityType] - Case activity type retrieval requested"
    );
    const caseActivityTypeDiv = caseRow.locator(
      "div.columns.large-9 > div > div.columns.large-3"
    );
    const caseActivityType = await caseActivityTypeDiv.innerText();
    context.log(
      `[getCaseActivityType] - Case activity type: ${caseActivityType}`
    );
    context.log(
      "[getCaseActivityType] - Case activity type retrieval finished"
    );
    return caseActivityType as TypeInCustodyCaseActivity;
  } catch (error) {
    context.log(
      "[getCaseActivityType] - Case activity type retrieval failed",
      error
    );
    throw error;
  }
}
