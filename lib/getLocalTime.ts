import { DateTime } from "luxon";

export default function getLocalTime(dt: number, timezone_offset: number, forecastType: string) {

  const utcTime = DateTime.fromSeconds(dt, { zone: "UTC" });
  const localTime = utcTime.plus({ seconds: timezone_offset });

  if (forecastType === "hourly") {
    return localTime.toFormat("HH:mm");
  } else {
    return localTime.toFormat("ccc dd LLL");
  }

}