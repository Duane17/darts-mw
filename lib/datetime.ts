// src/lib/datetime.ts
const LOCALE = "en-GB" as const;
const TIMEZONE = "Africa/Blantyre" as const;

const dateFmt = new Intl.DateTimeFormat(LOCALE, {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: TIMEZONE,
});

const timeFmt = new Intl.DateTimeFormat(LOCALE, {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: TIMEZONE,
});

/** Returns { date: "Wed, 24 Sep", time: "15:00" } (deterministic) */
export function formatLocal(iso: string) {
  const d = new Date(iso);
  return {
    date: dateFmt.format(d),
    time: timeFmt.format(d),
  };
}
