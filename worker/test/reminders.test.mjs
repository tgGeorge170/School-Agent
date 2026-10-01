import test from "node:test";
import assert from "node:assert/strict";
import { localToEpoch, localParts } from "../src/time.js";
import { dueReminders, remindersForDate, CATCH_UP_MS } from "../src/reminders.js";

const iso = (ms) => new Date(ms).toISOString();

test("10:50 Sarajevo maps to the right UTC instant across DST", () => {
  assert.equal(iso(localToEpoch("2026-09-23", "10:50")), "2026-09-23T08:50:00.000Z");
  assert.equal(iso(localToEpoch("2026-10-23", "10:50")), "2026-10-23T08:50:00.000Z");
  // DST ends 25.10.2026 — the old month-based crons fired an hour early this week.
  assert.equal(iso(localToEpoch("2026-10-26", "10:50")), "2026-10-26T09:50:00.000Z");
  assert.equal(iso(localToEpoch("2027-03-26", "10:50")), "2027-03-26T09:50:00.000Z");
  // DST starts 28.3.2027.
  assert.equal(iso(localToEpoch("2027-03-29", "10:50")), "2027-03-29T08:50:00.000Z");
  assert.equal(iso(localToEpoch("2026-10-25", "00:00")), "2026-10-24T22:00:00.000Z");
});

test("localParts reports Sarajevo date and weekday", () => {
  const p = localParts(Date.parse("2026-09-23T22:30:00Z"));
  assert.equal(p.date, "2026-09-24");
  assert.equal(p.weekday, 4);
});

const record = {
  settings: { daily: true, dailyTime: "10:50", tests: true, tasks: true, eveningTime: "19:00" },
  schedule: {
    days: [{ day: "Srijeda", classes: ["Matematika", "Njemački jezik"] }, { day: "Petak", classes: ["Srpski jezik"] }],
    periods: ["13:10–13:55", "14:00–14:45"],
  },
  tests: [{ id: "t1", subject: "Mašinski elementi", date: "2026-09-25", note: "zupčanici" }],
  tasks: [
    { id: "k1", subject: "Crtež", date: "2026-09-24", note: "", done: false },
    { id: "k2", subject: "Gotovo", date: "2026-09-24", note: "", done: true },
  ],
};

test("school day gets the schedule at dailyTime, with lesson start times", () => {
  const [daily] = remindersForDate(record, "2026-09-23").filter((r) => r.id.startsWith("daily"));
  assert.equal(iso(daily.at), "2026-09-23T08:50:00.000Z");
  assert.equal(iso(daily.expires), "2026-09-23T11:10:00.000Z");
  assert.equal(daily.payload.title, "Raspored — Srijeda");
  assert.equal(daily.payload.body, "13:10 Matematika\n14:00 Njemački jezik");
});

test("no daily reminder on weekends or days without classes", () => {
  assert.equal(remindersForDate(record, "2026-09-26").filter((r) => r.id.startsWith("daily")).length, 0);
  assert.equal(remindersForDate(record, "2026-09-24").filter((r) => r.id.startsWith("daily")).length, 0);
});

test("tests remind 2 days before, 1 day before (evening) and on the day", () => {
  const ids = ["2026-09-23", "2026-09-24", "2026-09-25"].flatMap((d) => remindersForDate(record, d).filter((r) => r.id.startsWith("test")).map((r) => [r.id, iso(r.at)]));
  assert.deepEqual(ids, [
    ["test:t1:2:2026-09-23", "2026-09-23T17:00:00.000Z"],
    ["test:t1:1:2026-09-24", "2026-09-24T17:00:00.000Z"],
    ["test:t1:0:2026-09-25", "2026-09-25T08:50:00.000Z"],
  ]);
});

test("done tasks are skipped; open ones remind the evening before and on the day", () => {
  const ids = ["2026-09-23", "2026-09-24"].flatMap((d) => remindersForDate(record, d).filter((r) => r.id.startsWith("task")).map((r) => r.id));
  assert.deepEqual(ids, ["task:k1:1:2026-09-23", "task:k1:0:2026-09-24"]);
});

test("dueReminders fires once in the window, catches up missed runs, then goes quiet", () => {
  const at = Date.parse("2026-09-23T08:50:00Z");
  assert.equal(dueReminders(record, {}, at - 60e3).filter((r) => r.id.startsWith("daily")).length, 0);
  assert.equal(dueReminders(record, {}, at).filter((r) => r.id.startsWith("daily")).length, 1);
  assert.equal(dueReminders(record, {}, at + 20 * 60e3).filter((r) => r.id.startsWith("daily")).length, 1);
  assert.equal(dueReminders(record, { "daily:2026-09-23": at }, at + 5 * 60e3).filter((r) => r.id.startsWith("daily")).length, 0);
  assert.equal(dueReminders(record, {}, at + CATCH_UP_MS + 60e3).filter((r) => r.id.startsWith("daily")).length, 0);
});

test("disabled categories send nothing", () => {
  const off = { ...record, settings: { daily: false, tests: false, tasks: false } };
  assert.equal(remindersForDate(off, "2026-09-23").length + remindersForDate(off, "2026-09-25").length, 0);
});
