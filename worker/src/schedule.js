// Kept in sync by hand with the SCHEDULE/PERIOD_TIMES in ../../content-data.js
// — duplicated here because the worker runs isolated from the browser bundle
// and needs the weekly schedule to build the daily reminder's body text.

const PERIOD_TIMES = [
  "13:10–13:55",
  "14:00–14:45",
  "14:50–15:35",
  "15:55–16:40",
  "16:45–17:30",
  "17:35–18:20",
  "18:25–19:10",
];

const SCHEDULE = [
  { day: "Ponedjeljak", classes: [
    "Hidraulika i pneumatika — A. Rapaić",
    "Mašinski elementi — S. Vidović",
    "Mašinski elementi — S. Vidović",
    "Demokratija i ljudska prava — S. Ivanović",
    "Demokratija i ljudska prava — S. Ivanović",
    "Njemački jezik — Ž. Milojković",
    "Fizičko vaspitanje — D. Šarčević",
  ]},
  { day: "Utorak", classes: [
    "Tehnologija obrade — V. Turjačanin",
    "Vjeronauka — S. Rakić",
    "Hidraulika i pneumatika — A. Rapaić",
    "Srpski jezik — M. Čekić",
    "Fizičko vaspitanje — D. Šarčević",
    "Termodinamika — M. Knežević",
    "Termodinamika — M. Knežević",
  ]},
  { day: "Srijeda", classes: [
    "Matematika — N. Runjić",
    "Matematika — N. Runjić",
    "Njemački jezik — Ž. Milojković",
    "Računari i programiranje (G1) — V. Sredanović",
    "Računari i programiranje (G1) — V. Sredanović",
  ]},
  { day: "Četvrtak", classes: [
    "CNC programiranje — M. Knežević, S. Đukanović",
    "CNC programiranje — M. Knežević, S. Đukanović",
    "CNC programiranje — M. Knežević, S. Đukanović",
    "Praktična nastava (G1) — M. Vučković",
    "Praktična nastava (G1) — M. Vučković",
    "Praktična nastava (G1) — M. Vučković",
  ]},
  { day: "Petak", classes: [
    "Matematika — N. Runjić",
    "Tehnologija obrade — V. Turjačanin",
    "Modeliranje i simulacija — S. Đukanović, A. Rapaić",
    "Modeliranje i simulacija — S. Đukanović, A. Rapaić",
    "Modeliranje i simulacija — S. Đukanović, A. Rapaić",
    "Srpski jezik — M. Čekić",
    "Srpski jezik — M. Čekić",
  ]},
];

const EN_TO_SR_DAY = {
  Monday: "Ponedjeljak",
  Tuesday: "Utorak",
  Wednesday: "Srijeda",
  Thursday: "Četvrtak",
  Friday: "Petak",
  Saturday: "Subota",
  Sunday: "Nedjelja",
};

function todayNameInSarajevo() {
  const en = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Sarajevo", weekday: "long" }).format(new Date());
  return EN_TO_SR_DAY[en];
}

export function buildTodayScheduleNotification() {
  const todayName = todayNameInSarajevo();
  const day = SCHEDULE.find((d) => d.day === todayName);
  if (!day) {
    return { title: "CNC Školski Pomoćnik", body: `${todayName} — danas nema nastave po rasporedu.` };
  }
  const lines = day.classes.map((cls, i) => `${PERIOD_TIMES[i] || i + 1 + "."} ${cls}`);
  return { title: `Raspored — ${todayName}`, body: lines.join("\n") };
}
