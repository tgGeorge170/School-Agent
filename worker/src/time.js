export const TZ = "Europe/Sarajevo";

const fmt = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  weekday: "short",
});
const WEEKDAYS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

export function localParts(epochMs) {
  const p = {};
  for (const { type, value } of fmt.formatToParts(new Date(epochMs))) p[type] = value;
  return {
    y: +p.year,
    m: +p.month,
    d: +p.day,
    h: +p.hour,
    mi: +p.minute,
    s: +p.second,
    weekday: WEEKDAYS[p.weekday],
    date: `${p.year}-${p.month}-${p.day}`,
  };
}

function offsetMs(epochMs) {
  const p = localParts(epochMs);
  return Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi, p.s) - Math.floor(epochMs / 1000) * 1000;
}

// Local wall-clock time in TZ -> epoch ms (DST-aware).
export function localToEpoch(dateIso, hhmm) {
  const [y, m, d] = dateIso.split("-").map(Number);
  const [h, mi] = hhmm.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, h, mi);
  const off = offsetMs(guess);
  const off2 = offsetMs(guess - off);
  return guess - (off2 === off ? off : off2);
}

export function addDays(dateIso, n) {
  const [y, m, d] = dateIso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

export function weekdayOf(dateIso) {
  const [y, m, d] = dateIso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}
