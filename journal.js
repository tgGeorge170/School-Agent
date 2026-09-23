// Local-only study journal: notes, upcoming tests, grades. All data lives in
// localStorage on this device — nothing is sent anywhere, works fully offline.

const JOURNAL_SUBJECTS = [
  "CNC programiranje",
  "Praktična nastava",
  "Tehnologija obrade",
  "Mašinski elementi",
  "Modeliranje i simulacija pomoću računara",
  "Računari i programiranje",
  "Hidraulika i pneumatika",
  "Termodinamika",
  "Osnovi preduzetništva",
  "Matematika",
  "Srpski jezik",
  "Strani jezik",
  "Fizičko vaspitanje",
];

(function () {
  const NOTES_KEY = "cncJournalNotes";
  const TESTS_KEY = "cncJournalTests";
  const GRADES_KEY = "cncJournalGrades";
  const TASKS_KEY = "cncJournalTasks";
  const ALL_KEYS = [NOTES_KEY, TESTS_KEY, GRADES_KEY, TASKS_KEY];

  const datalist = document.getElementById("subjects-list");
  if (!datalist) return; // journal markup not present

  JOURNAL_SUBJECTS.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s;
    datalist.appendChild(opt);
  });

  function load(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch (e) {
      return [];
    }
  }
  function save(key, arr) {
    localStorage.setItem(key, JSON.stringify(arr));
    window.dispatchEvent(new CustomEvent("journal-changed", { detail: { key } }));
  }
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  // Escape user-entered text before it goes into innerHTML.
  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }
  function fmtDate(iso) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}.${m}.${y}.`;
  }
  // Local calendar date (YYYY-MM-DD) — not UTC, so it stays correct past
  // midnight in Belgrade's timezone. `pad` is hoisted from below.
  function todayIso() {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  // ---------- Sub-tab switching ----------
  const subtabButtons = document.querySelectorAll("#journal .subtab");
  const subtabPanels = document.querySelectorAll("#journal .subtab-panel");
  subtabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      subtabButtons.forEach((b) => b.classList.toggle("active", b === btn));
      subtabPanels.forEach((p) => p.classList.toggle("active", p.id === "sub-" + btn.dataset.sub));
    });
  });

  // ---------- Notes ----------
  const noteForm = document.getElementById("note-form");
  const noteDate = document.getElementById("note-date");
  const noteSubject = document.getElementById("note-subject");
  const noteText = document.getElementById("note-text");
  const notesList = document.getElementById("notes-list");

  function renderNotes() {
    const notes = load(NOTES_KEY).sort((a, b) => (a.date < b.date ? 1 : -1));
    notesList.innerHTML = "";
    if (notes.length === 0) {
      notesList.innerHTML = '<div class="hint">Još nema bilježaka.</div>';
      return;
    }
    notes.forEach((n) => {
      const div = document.createElement("div");
      div.className = "journal-item";
      div.innerHTML = `
        <div class="journal-item-head">
          <span class="journal-date">${fmtDate(n.date)}</span>
          ${n.subject ? `<span class="journal-subject">${esc(n.subject)}</span>` : ""}
          <button class="journal-del" type="button" aria-label="Obriši">✕</button>
        </div>
        <div class="journal-text">${esc(n.text)}</div>
      `;
      div.querySelector(".journal-del").addEventListener("click", () => {
        save(NOTES_KEY, load(NOTES_KEY).filter((x) => x.id !== n.id));
        renderNotes();
      });
      notesList.appendChild(div);
    });
  }

  noteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = noteText.value.trim();
    if (!text) return;
    const notes = load(NOTES_KEY);
    notes.push({
      id: uid(),
      date: noteDate.value || todayIso(),
      subject: noteSubject.value.trim(),
      text,
    });
    save(NOTES_KEY, notes);
    noteText.value = "";
    noteSubject.value = "";
    renderNotes();
  });

  // ---------- Calendar export (.ics) ----------
  // No backend, no push service — hand the reminder off to the phone's own
  // calendar app, which can notify even when this PWA isn't open.
  function pad(n) {
    return String(n).padStart(2, "0");
  }
  function icsEscape(str) {
    return String(str || "").replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
  }
  function icsDateTime(iso, hh, mm) {
    const [y, m, d] = iso.split("-");
    return `${y}${m}${d}T${pad(hh)}${pad(mm)}00`;
  }
  function icsNowUtc() {
    const d = new Date();
    return (
      d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) +
      "T" + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + "Z"
    );
  }
  function buildIcs(tests) {
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//CNC Skolski Pomocnik//Dnevnik//SR", "CALSCALE:GREGORIAN"];
    tests.forEach((tst) => {
      const summary = icsEscape((tst.subject || "Test") + " - test");
      lines.push(
        "BEGIN:VEVENT",
        `UID:${tst.id}@cnc-companion.local`,
        `DTSTAMP:${icsNowUtc()}`,
        `DTSTART:${icsDateTime(tst.date, 8, 0)}`,
        `DTEND:${icsDateTime(tst.date, 8, 30)}`,
        `SUMMARY:${summary}`,
        tst.note ? `DESCRIPTION:${icsEscape(tst.note)}` : null,
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        "DESCRIPTION:Podsjetnik na test",
        "TRIGGER:-P2D",
        "END:VALARM",
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        "DESCRIPTION:Podsjetnik na test",
        "TRIGGER:-PT1H",
        "END:VALARM",
        "END:VEVENT"
      );
    });
    lines.push("END:VCALENDAR");
    return lines.filter(Boolean).join("\r\n");
  }
  function slugForFilename(str) {
    const map = { š: "s", č: "c", ć: "c", ž: "z", đ: "dj", Š: "S", Č: "C", Ć: "C", Ž: "Z", Đ: "Dj" };
    return String(str || "test")
      .replace(/[šćčžđŠĆČŽĐ]/g, (ch) => map[ch] || ch)
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "");
  }
  function downloadFile(filename, content, mime) {
    if (window.NativeApp) return window.NativeApp.saveFile(filename, content);
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
  function downloadIcs(filename, content) {
    downloadFile(filename, content, "text/calendar;charset=utf-8");
  }

  // ---------- Tests ----------
  const testForm = document.getElementById("test-form");
  const testSubject = document.getElementById("test-subject");
  const testDate = document.getElementById("test-date");
  const testNote = document.getElementById("test-note");
  const testsList = document.getElementById("tests-list");
  const exportAllBtn = document.getElementById("export-tests-btn");

  function daysUntil(iso) {
    const today = new Date(todayIso() + "T00:00:00");
    const target = new Date(iso + "T00:00:00");
    return Math.round((target - today) / 86400000);
  }
  function countdownLabel(days) {
    if (days < 0) return "prošlo";
    if (days === 0) return "danas!";
    if (days === 1) return "sutra";
    return `za ${days} dana`;
  }

  function renderTests() {
    const tests = load(TESTS_KEY).sort((a, b) => (a.date > b.date ? 1 : -1));
    testsList.innerHTML = "";
    if (tests.length === 0) {
      testsList.innerHTML = '<div class="hint">Još nema zakazanih testova.</div>';
      return;
    }
    tests.forEach((tst) => {
      const days = daysUntil(tst.date);
      const div = document.createElement("div");
      div.className = "journal-item" + (days < 0 ? " past" : "");
      const badgeClass = days < 0 ? "badge-past" : days <= 3 ? "badge-soon" : "badge-normal";
      div.innerHTML = `
        <div class="journal-item-head">
          <span class="journal-subject">${esc(tst.subject || "Test")}</span>
          <span class="journal-badge ${badgeClass}">${countdownLabel(days)}</span>
          <button class="journal-cal" type="button" aria-label="Dodaj u kalendar">📅</button>
          <button class="journal-del" type="button" aria-label="Obriši">✕</button>
        </div>
        <div class="journal-text">${fmtDate(tst.date)}${tst.note ? " — " + esc(tst.note) : ""}</div>
      `;
      div.querySelector(".journal-cal").addEventListener("click", () => {
        downloadIcs(`test-${slugForFilename(tst.subject)}.ics`, buildIcs([tst]));
      });
      div.querySelector(".journal-del").addEventListener("click", () => {
        save(TESTS_KEY, load(TESTS_KEY).filter((x) => x.id !== tst.id));
        renderTests();
      });
      testsList.appendChild(div);
    });
  }

  if (exportAllBtn) {
    exportAllBtn.addEventListener("click", () => {
      const upcoming = load(TESTS_KEY).filter((tst) => daysUntil(tst.date) >= 0);
      if (upcoming.length === 0) return;
      downloadIcs("testovi.ics", buildIcs(upcoming));
    });
  }

  testForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!testDate.value) return;
    const tests = load(TESTS_KEY);
    tests.push({
      id: uid(),
      subject: testSubject.value.trim(),
      date: testDate.value,
      note: testNote.value.trim(),
    });
    save(TESTS_KEY, tests);
    testSubject.value = "";
    testDate.value = "";
    testNote.value = "";
    renderTests();
  });

  // ---------- Tasks (Zadaci) ----------
  const taskForm = document.getElementById("task-form");
  const taskSubject = document.getElementById("task-subject");
  const taskDate = document.getElementById("task-date");
  const taskNote = document.getElementById("task-note");
  const tasksList = document.getElementById("tasks-list");
  const exportTasksBtn = document.getElementById("export-tasks-btn");

  function renderTasks() {
    const tasks = load(TASKS_KEY).sort((a, b) => {
      if (!!a.done !== !!b.done) return a.done ? 1 : -1;
      return a.date > b.date ? 1 : -1;
    });
    tasksList.innerHTML = "";
    if (tasks.length === 0) {
      tasksList.innerHTML = '<div class="hint">Još nema zadataka.</div>';
      return;
    }
    tasks.forEach((task) => {
      const days = daysUntil(task.date);
      const div = document.createElement("div");
      div.className = "journal-item" + (task.done ? " past" : "");
      const badgeClass = task.done ? "badge-past" : days < 0 ? "badge-soon" : days <= 1 ? "badge-soon" : "badge-normal";
      const badgeText = task.done ? "urađeno" : countdownLabel(days);
      div.innerHTML = `
        <div class="journal-item-head">
          <button class="journal-check" type="button" aria-label="Označi urađeno">${task.done ? "☑" : "☐"}</button>
          <span class="journal-subject">${esc(task.subject || "Zadatak")}</span>
          <span class="journal-badge ${badgeClass}">${badgeText}</span>
          <button class="journal-cal" type="button" aria-label="Dodaj u kalendar">📅</button>
          <button class="journal-del" type="button" aria-label="Obriši">✕</button>
        </div>
        <div class="journal-text">${fmtDate(task.date)}${task.note ? " — " + esc(task.note) : ""}</div>
      `;
      div.querySelector(".journal-check").addEventListener("click", () => {
        const all = load(TASKS_KEY);
        const t = all.find((x) => x.id === task.id);
        if (t) t.done = !t.done;
        save(TASKS_KEY, all);
        renderTasks();
      });
      div.querySelector(".journal-cal").addEventListener("click", () => {
        downloadIcs(`zadatak-${slugForFilename(task.subject)}.ics`, buildIcs([task]));
      });
      div.querySelector(".journal-del").addEventListener("click", () => {
        save(TASKS_KEY, load(TASKS_KEY).filter((x) => x.id !== task.id));
        renderTasks();
      });
      tasksList.appendChild(div);
    });
  }

  if (exportTasksBtn) {
    exportTasksBtn.addEventListener("click", () => {
      const upcoming = load(TASKS_KEY).filter((task) => !task.done);
      if (upcoming.length === 0) return;
      downloadIcs("zadaci.ics", buildIcs(upcoming));
    });
  }

  if (taskForm) {
    taskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!taskDate.value) return;
      const tasks = load(TASKS_KEY);
      tasks.push({
        id: uid(),
        subject: taskSubject.value.trim(),
        date: taskDate.value,
        note: taskNote.value.trim(),
        done: false,
      });
      save(TASKS_KEY, tasks);
      taskSubject.value = "";
      taskDate.value = "";
      taskNote.value = "";
      renderTasks();
    });
  }

  // ---------- Backup / restore ----------
  const exportBackupBtn = document.getElementById("export-backup-btn");
  const importBackupBtn = document.getElementById("import-backup-btn");
  const importBackupInput = document.getElementById("import-backup-input");

  if (importBackupBtn && importBackupInput) {
    importBackupBtn.addEventListener("click", () => importBackupInput.click());
  }

  if (exportBackupBtn) {
    exportBackupBtn.addEventListener("click", () => {
      const data = {};
      ALL_KEYS.forEach((k) => { data[k] = load(k); });
      const stamp = todayIso();
      downloadFile(`dnevnik-backup-${stamp}.json`, JSON.stringify(data, null, 2), "application/json");
    });
  }
  if (importBackupInput) {
    importBackupInput.addEventListener("change", () => {
      const file = importBackupInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          const hasKnownKey = ALL_KEYS.some((k) => Array.isArray(data[k]));
          if (!hasKnownKey) {
            alert("Ovaj fajl ne izgleda kao backup Dnevnika.");
            return;
          }
          if (!confirm("Ovo će zamijeniti sve trenutne bilješke, testove, ocjene i zadatke na ovom telefonu. Nastaviti?")) {
            return;
          }
          ALL_KEYS.forEach((k) => {
            if (Array.isArray(data[k])) save(k, data[k]);
          });
          renderNotes();
          renderTests();
          renderTasks();
          renderGrades();
          alert("Podaci su vraćeni.");
        } catch (e) {
          alert("Fajl nije validan JSON backup.");
        }
        importBackupInput.value = "";
      };
      reader.readAsText(file);
    });
  }

  // ---------- Grades ----------
  const gradeForm = document.getElementById("grade-form");
  const gradeSubject = document.getElementById("grade-subject");
  const gradeValue = document.getElementById("grade-value");
  const gradesSummary = document.getElementById("grades-summary");
  const gradesList = document.getElementById("grades-list");

  function renderGrades() {
    const grades = load(GRADES_KEY);

    gradesSummary.innerHTML = "";
    if (grades.length === 0) {
      gradesSummary.innerHTML = '<div class="hint">Još nema unesenih ocjena.</div>';
    } else {
      const overall = grades.reduce((s, g) => s + g.value, 0) / grades.length;
      const bySubject = {};
      grades.forEach((g) => {
        const key = g.subject || "Ostalo";
        if (!bySubject[key]) bySubject[key] = [];
        bySubject[key].push(g.value);
      });

      const overallRow = document.createElement("div");
      overallRow.className = "result-row";
      overallRow.innerHTML = `<span class="result-label">Prosjek (sve ocjene)</span><span class="result-value">${overall.toFixed(2)}</span>`;
      gradesSummary.appendChild(overallRow);

      Object.keys(bySubject).sort().forEach((subj) => {
        const vals = bySubject[subj];
        const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
        const row = document.createElement("div");
        row.className = "result-row";
        row.innerHTML = `<span class="result-label">${esc(subj)}</span><span class="result-value" style="font-size:1rem;">${avg.toFixed(2)}<span class="unit">(${vals.length})</span></span>`;
        gradesSummary.appendChild(row);
      });
    }

    gradesList.innerHTML = "";
    if (grades.length === 0) {
      gradesList.innerHTML = '<div class="hint">Dodaj prvu ocjenu ispod.</div>';
      return;
    }
    grades
      .slice()
      .reverse()
      .forEach((g) => {
        const div = document.createElement("div");
        div.className = "journal-item";
        div.innerHTML = `
          <div class="journal-item-head">
            <span class="journal-subject">${esc(g.subject || "Ostalo")}</span>
            <span class="journal-badge badge-normal">${g.value}</span>
            <button class="journal-del" type="button" aria-label="Obriši">✕</button>
          </div>
        `;
        div.querySelector(".journal-del").addEventListener("click", () => {
          save(GRADES_KEY, load(GRADES_KEY).filter((x) => x.id !== g.id));
          renderGrades();
        });
        gradesList.appendChild(div);
      });
  }

  gradeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = parseInt(gradeValue.value, 10);
    if (!value || value < 1 || value > 5) return;
    const grades = load(GRADES_KEY);
    grades.push({ id: uid(), subject: gradeSubject.value.trim(), value, date: todayIso() });
    save(GRADES_KEY, grades);
    gradeSubject.value = "";
    gradeValue.value = "5";
    renderGrades();
  });

  noteDate.value = todayIso();
  renderNotes();
  renderTests();
  renderTasks();
  renderGrades();
})();
