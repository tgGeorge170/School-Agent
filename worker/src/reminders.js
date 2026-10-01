import { addDays, localParts, localToEpoch, weekdayOf } from "./time.js";
import { PERIOD_TIMES, SCHEDULE } from "./schedule.js";

export const DAY_NAMES = ["Nedjelja", "Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota"];

export const DEFAULT_SETTINGS = {
  daily: true,
  dailyTime: "10:50",
  tests: true,
  tasks: true,
  eveningTime: "19:00",
};

// How far back a run looks for reminders it hasn't sent yet, so a skipped or
// late cron run still delivers.
export const CATCH_UP_MS = 30 * 60e3;

function lessonsFor(record, dateIso) {
  const schedule = record.schedule || { days: SCHEDULE, periods: PERIOD_TIMES };
  const day = schedule.days.find((d) => d.day === DAY_NAMES[weekdayOf(dateIso)]);
  if (!day || !day.classes.length) return null;
  return { day: day.day, classes: day.classes, periods: schedule.periods || [] };
}

function firstLessonEpoch(dateIso, lessons) {
  const start = (lessons && lessons.periods[0] || "").split("–")[0];
  return /^\d{2}:\d{2}$/.test(start) ? localToEpoch(dateIso, start) : localToEpoch(addDays(dateIso, 1), "00:00");
}

function fmtDate(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.`;
}

// Every reminder due for one local date, regardless of whether it was sent.
export function remindersForDate(record, dateIso) {
  const s = { ...DEFAULT_SETTINGS, ...record.settings };
  const out = [];
  const lessons = lessonsFor(record, dateIso);
  const endOfDay = localToEpoch(addDays(dateIso, 1), "00:00");

  if (s.daily && lessons) {
    const lines = lessons.classes.map((c, i) => `${(lessons.periods[i] || "").split("–")[0] || i + 1 + "."} ${c}`);
    out.push({
      id: `daily:${dateIso}`,
      at: localToEpoch(dateIso, s.dailyTime),
      expires: firstLessonEpoch(dateIso, lessons),
      payload: { title: `Raspored — ${lessons.day}`, body: lines.join("\n"), tag: "daily", url: "./#schedule" },
    });
  }

  if (s.tests) {
    for (const t of record.tests || []) {
      const name = t.subject || "Test";
      const note = t.note ? ` — ${t.note}` : "";
      if (t.date === dateIso) {
        out.push({
          id: `test:${t.id}:0:${dateIso}`,
          at: localToEpoch(dateIso, s.dailyTime),
          expires: endOfDay,
          payload: { title: `📝 Danas je test: ${name}`, body: `Sretno!${note}`, tag: `test-${t.id}`, url: "./#journal" },
        });
      }
      for (const [daysBefore, label] of [[1, "Sutra je test"], [2, "Test za 2 dana"]]) {
        if (addDays(t.date, -daysBefore) === dateIso) {
          out.push({
            id: `test:${t.id}:${daysBefore}:${dateIso}`,
            at: localToEpoch(dateIso, s.eveningTime),
            expires: endOfDay,
            payload: { title: `📝 ${label}: ${name}`, body: `${fmtDate(t.date)}${note}`, tag: `test-${t.id}`, url: "./#journal" },
          });
        }
      }
    }
  }

  if (s.tasks) {
    for (const t of record.tasks || []) {
      if (t.done) continue;
      const name = t.subject || "Zadatak";
      const note = t.note ? ` — ${t.note}` : "";
      if (t.date === dateIso) {
        out.push({
          id: `task:${t.id}:0:${dateIso}`,
          at: localToEpoch(dateIso, s.dailyTime),
          expires: endOfDay,
          payload: { title: `✏️ Danas je rok: ${name}`, body: `Zadatak${note}`, tag: `task-${t.id}`, url: "./#journal" },
        });
      }
      if (addDays(t.date, -1) === dateIso) {
        out.push({
          id: `task:${t.id}:1:${dateIso}`,
          at: localToEpoch(dateIso, s.eveningTime),
          expires: endOfDay,
          payload: { title: `✏️ Sutra je rok: ${name}`, body: `${fmtDate(t.date)}${note}`, tag: `task-${t.id}`, url: "./#journal" },
        });
      }
    }
  }
  return out;
}

// Reminders whose time falls inside (now - CATCH_UP_MS, now], not yet sent.
export function dueReminders(record, sent, now) {
  const today = localParts(now).date;
  const dates = [addDays(today, -1), today];
  return dates
    .flatMap((d) => remindersForDate(record, d))
    .filter((r) => r.at <= now && r.at > now - CATCH_UP_MS && r.expires > now && !sent[r.id]);
}

export function todayPreview(record, now) {
  const today = localParts(now).date;
  const daily = remindersForDate({ ...record, settings: { ...record.settings, daily: true } }, today).find((r) => r.id.startsWith("daily:"));
  if (daily) return daily.payload;
  return { title: "CNC Školski Pomoćnik", body: `${DAY_NAMES[weekdayOf(today)]} — danas nema nastave.`, tag: "daily", url: "./#schedule" };
}
