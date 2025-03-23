import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(customParseFormat);
dayjs.extend(timezone);
dayjs.extend(utc);

const CCAP_DATETIME_FORMAT_HTML = "MM-DD-YYYY - hh:mm A";
const LOCAL_TIME_ZONE = "America/Chicago";

export function parseHTMLCaseDateTimeString(caseDateTimeRawText: string) {
  const caseDateTime = dayjs(caseDateTimeRawText, CCAP_DATETIME_FORMAT_HTML).tz(
    LOCAL_TIME_ZONE,
    true
  );
  return caseDateTime;
}
