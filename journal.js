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
  }
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  function fmtDate(iso) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}.${m}.${y}.`;
  }
  function todayIso() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
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
          ${n.subject ? `<span class="journal-subject">${n.subject}</span>` : ""}
          <button class="journal-del" type="button" aria-label="Obriši">✕</button>
        </div>
        <div class="journal-text">${n.text}</div>
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
  function downloadIcs(filename, content) {
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
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
          <span class="journal-subject">${tst.subject || "Test"}</span>
          <span class="journal-badge ${badgeClass}">${countdownLabel(days)}</span>
          <button class="journal-cal" type="button" aria-label="Dodaj u kalendar">📅</button>
          <button class="journal-del" type="button" aria-label="Obriši">✕</button>
        </div>
        <div class="journal-text">${fmtDate(tst.date)}${tst.note ? " — " + tst.note : ""}</div>
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
        row.innerHTML = `<span class="result-label">${subj}</span><span class="result-value" style="font-size:1rem;">${avg.toFixed(2)}<span class="unit">(${vals.length})</span></span>`;
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
            <span class="journal-subject">${g.subject || "Ostalo"}</span>
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
  renderGrades();
})();
