import { InvocationContext } from "@azure/functions";
import { type Page } from "playwright";

export async function searchByCourtCalendar(
  context: InvocationContext,
  page: Page
) {
  context.log("[searchByCourtCalendar] - Search requested");
  await navigateToCourtCalendar(context, page);
  await selectCounty(context, page);
  await selectCourtOfficial(context, page);
  await selectFromDate(context, page);
  await submitSearch(context, page);
  // Ensure that the court calendar search results page has loaded
  page.locator("h2", { hasText: /^Court calendar$/ });
  context.log("[searchByCourtCalendar] - Search finished");
}

async function navigateToCourtCalendar(context: InvocationContext, page: Page) {
  context.log(
    "[navigateToCourtCalendar] - Navigation to court calendar requested"
  );
  await page.goto("https://wcca.wicourts.gov/courtOfficialCalendar.html");
  // Ensure that the court calendar page has loaded
  page.locator("h2", { hasText: /^Court calendar search$/ });
  context.log(
    "[navigateToCourtCalendar] - Navigation to court calendar finished"
  );
}

async function selectCounty(context: InvocationContext, page: Page) {
  context.log("[selectCounty] - Selecting county");
  const countyLabelText = "County";
  const countyInput = page.getByLabel(countyLabelText);
  await countyInput.fill("Racine");
  const countyOption = page.getByRole("option", { name: "Racine" });
  await countyOption.click();
  const countyLabel = page.getByText(countyLabelText);
  const selectedCountyOption = countyLabel.getByRole("option");
  const selectedCountyOptionText = await selectedCountyOption.textContent();
  context.log("[selectCounty] - County selected:", selectedCountyOptionText);
}

async function selectCourtOfficial(context: InvocationContext, page: Page) {
  context.log("[selectCourtOfficial] - Selecting court official");
  const courtOfficialLabelText = "Court official";
  const courtOfficialInput = page.getByLabel(courtOfficialLabelText);
  await courtOfficialInput.fill("Rudebusch, Alice A (2181)");
  const courtOfficialOption = page.locator(
    ".VirtualizedSelectOption.VirtualizedSelectFocusedOption"
  );
  await courtOfficialOption.click();
  const courtOfficialLabel = page.getByText(courtOfficialLabelText);
  const selectedCourtOfficialOption = courtOfficialLabel.getByRole("option");
  const selectedCourtOfficialOptionText =
    await selectedCourtOfficialOption.textContent();
  context.log(
    "[selectCourtOfficial] - Court official selected:",
    selectedCourtOfficialOptionText
  );
}

async function selectFromDate(context: InvocationContext, page: Page) {
  context.log("[selectFromDate] - Selecting from date");
  const fromDateInput = page.getByLabel("from");
  await fromDateInput.click();
  const fromDateTodayOption = page.locator(".react-datepicker__day--today");
  await fromDateTodayOption.click();
  const fromDateInputValue = await fromDateInput.inputValue();
  context.log("[selectFromDate] - From date selected:", fromDateInputValue);
}

async function submitSearch(context: InvocationContext, page: Page) {
  context.log("[searchByCourtCalendar] - Submitting search");
  const searchButton = page.locator('button[type="submit"]');
  await searchButton.click();
  context.log("[searchByCourtCalendar] - Search submitted");
}
