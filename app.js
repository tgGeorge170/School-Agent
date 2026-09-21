// ---------- Tab navigation ----------
(function () {
  const buttons = document.querySelectorAll(".tabbar button");
  const panels = document.querySelectorAll(".tab-panel");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      buttons.forEach((b) => b.classList.toggle("active", b === btn));
      panels.forEach((p) => p.classList.toggle("active", p.id === target));
      window.scrollTo(0, 0);
    });
  });
})();

// ---------- Schedule ----------
(function () {
  const listEl = document.getElementById("schedule-list");
  if (!listEl) return;
  const dayNames = ["Nedjelja", "Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota"];
  const todayName = dayNames[new Date().getDay()];

  listEl.innerHTML = "";
  SCHEDULE.forEach((day) => {
    const h = document.createElement("div");
    h.className = "section-heading";
    h.textContent = day.day + (day.day === todayName ? " — danas" : "");
    listEl.appendChild(h);
    day.classes.forEach((cls, i) => {
      const div = document.createElement("div");
      div.className = "journal-item";
      div.innerHTML = `<div class="journal-item-head"><span class="journal-date">${PERIOD_TIMES[i] || i + 1 + "."}</span><span class="journal-subject">${cls}</span></div>`;
      listEl.appendChild(div);
    });
  });

  // ---- Recurring weekly calendar export ----
  // A cron/push-notification approach only lasts 7 days and needs an active
  // session — a recurring calendar event, imported once, notifies forever
  // via the phone's own calendar app with no ongoing dependency on this app.
  const exportBtn = document.getElementById("export-schedule-btn");
  if (!exportBtn) return;

  const DAY_INFO = {
    Ponedjeljak: { dow: 1, byday: "MO" },
    Utorak: { dow: 2, byday: "TU" },
    Srijeda: { dow: 3, byday: "WE" },
    Četvrtak: { dow: 4, byday: "TH" },
    Petak: { dow: 5, byday: "FR" },
  };

  function pad(n) { return String(n).padStart(2, "0"); }
  function icsEscape(str) {
    return String(str || "").replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
  }
  function nextDateForDow(targetDow) {
    const d = new Date();
    d.setDate(d.getDate() + ((targetDow - d.getDay() + 7) % 7));
    return d;
  }
  function fmtLocal(d, hh, mm) {
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(hh)}${pad(mm)}00`;
  }
  function parseTime(range, part) {
    const [start, end] = range.split("–");
    const [h, m] = (part === "start" ? start : end).split(":").map(Number);
    return { h, m };
  }

  exportBtn.addEventListener("click", () => {
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//CNC Skolski Pomocnik//Raspored//SR", "CALSCALE:GREGORIAN"];
    SCHEDULE.forEach((day) => {
      const info = DAY_INFO[day.day];
      if (!info) return;
      const date = nextDateForDow(info.dow);
      const startT = parseTime(PERIOD_TIMES[0], "start");
      const endT = parseTime(PERIOD_TIMES[day.classes.length - 1], "end");
      lines.push(
        "BEGIN:VEVENT",
        `UID:raspored-${info.byday}@cnc-companion.local`,
        `DTSTAMP:${fmtLocal(new Date(), 0, 0)}Z`,
        `DTSTART:${fmtLocal(date, startT.h, startT.m)}`,
        `DTEND:${fmtLocal(date, endT.h, endT.m)}`,
        `RRULE:FREQ=WEEKLY;BYDAY=${info.byday}`,
        `SUMMARY:${icsEscape("Nastava — " + day.day)}`,
        `DESCRIPTION:${icsEscape(day.classes.join("\n"))}`,
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        "DESCRIPTION:Podsjetnik na nastavu",
        "TRIGGER:-PT2H20M",
        "END:VALARM",
        "END:VEVENT"
      );
    });
    lines.push("END:VCALENDAR");
    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "raspored.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  });
})();

// ---------- Feeds & Speeds calculator ----------
(function () {
  const HSS_FACTOR = 0.4;
  const FINISH_FACTOR = 0.4;

  const $ = (id) => document.getElementById(id);
  const els = {
    unitMetric: $("unit-metric"),
    unitImperial: $("unit-imperial"),
    operation: $("operation"),
    material: $("material"),
    toolMaterial: $("tool-material"),
    diameter: $("diameter"),
    diameterLabel: $("diameter-label"),
    diameterUnit: $("diameter-unit"),
    flutesGroup: $("flutes-group"),
    flutes: $("flutes"),
    passType: $("pass-type"),
    chiploadGroup: $("chipload-group"),
    chipload: $("chipload"),
    chiploadLabel: $("chipload-label"),
    chiploadUnit: $("chipload-unit"),
    feedrevGroup: $("feedrev-group"),
    feedrev: $("feedrev"),
    feedrevUnit: $("feedrev-unit"),
    outRpm: $("out-rpm"),
    outFeed: $("out-feed"),
    outFeedUnit: $("out-feed-unit"),
    outVc: $("out-vc"),
    outVcUnit: $("out-vc-unit"),
  };

  if (!els.material) return; // calculator markup not present

  let unit = "metric";
  let userEditedChipload = false;
  let userEditedFeedrev = false;

  function populateMaterials() {
    const prevValue = els.material.value;
    els.material.innerHTML = "";
    for (const key in MATERIALS) {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = MATERIALS[key].label[currentLang] || MATERIALS[key].label.en;
      els.material.appendChild(opt);
    }
    if (prevValue && MATERIALS[prevValue]) els.material.value = prevValue;
  }

  function mmToIn(mm) { return mm / 25.4; }
  function inToMm(inch) { return inch * 25.4; }
  function baseChiploadMm(diameterMm) { return 0.018 + 0.0083 * diameterMm; }
  function baseFeedRevMm() { return 0.15; }

  function setUnit(newUnit) {
    if (newUnit === unit) return;
    const d = parseFloat(els.diameter.value) || 0;
    els.diameter.value = newUnit === "imperial"
      ? round(mmToIn(unit === "metric" ? d : inToMm(d)), 3)
      : round(unit === "imperial" ? inToMm(d) : d, 2);

    unit = newUnit;
    els.unitMetric.classList.toggle("active", unit === "metric");
    els.unitImperial.classList.toggle("active", unit === "imperial");
    userEditedChipload = false;
    userEditedFeedrev = false;
    updateLabelsAndUnits();
    recalc();
  }

  function updateLabelsAndUnits() {
    const op = els.operation.value;
    els.diameterLabel.textContent = op === "turning" ? t("calc.workpieceDiameter") : t("calc.toolDiameter");
    els.diameterUnit.textContent = unit === "metric" ? "mm" : "in";
    els.chiploadUnit.textContent = unit === "metric" ? "mm/tooth" : "in/tooth";
    els.feedrevUnit.textContent = unit === "metric" ? "mm/rev" : "in/rev";
    els.outFeedUnit.textContent = unit === "metric" ? "mm/min" : "in/min";
    els.outVcUnit.textContent = unit === "metric" ? "m/min" : "SFM";

    const isTurning = op === "turning";
    els.flutesGroup.style.display = isTurning ? "none" : "block";
    els.chiploadGroup.classList.toggle("active", !isTurning);
    els.feedrevGroup.classList.toggle("active", isTurning);
  }

  function round(n, digits) {
    const f = Math.pow(10, digits);
    return Math.round(n * f) / f;
  }

  function diameterMm() {
    const d = parseFloat(els.diameter.value) || 0;
    return unit === "metric" ? d : inToMm(d);
  }

  function suggestChiploadAndFeedrev() {
    const mat = MATERIALS[els.material.value];
    const passFactor = els.passType.value === "finishing" ? FINISH_FACTOR : 1.0;

    if (!userEditedChipload) {
      const mm = baseChiploadMm(diameterMm()) * mat.feedFactor * passFactor;
      els.chipload.value = unit === "metric" ? round(mm, 3) : round(mmToIn(mm), 4);
    }
    if (!userEditedFeedrev) {
      const mm = baseFeedRevMm() * mat.feedFactor * passFactor;
      els.feedrev.value = unit === "metric" ? round(mm, 3) : round(mmToIn(mm), 4);
    }
  }

  function recalc() {
    suggestChiploadAndFeedrev();

    const mat = MATERIALS[els.material.value];
    const toolFactor = els.toolMaterial.value === "hss" ? HSS_FACTOR : 1.0;
    const vcMetersPerMin = mat.vc * toolFactor;

    const dMm = diameterMm();
    let rpm = 0;
    if (dMm > 0) {
      rpm = (vcMetersPerMin * 1000) / (Math.PI * dMm);
    }
    rpm = Math.max(0, Math.round(rpm));

    const op = els.operation.value;
    let feedMmPerMin;
    if (op === "turning") {
      const feedRevMm = unit === "metric"
        ? (parseFloat(els.feedrev.value) || 0)
        : inToMm(parseFloat(els.feedrev.value) || 0);
      feedMmPerMin = rpm * feedRevMm;
    } else {
      const flutes = Math.max(1, parseInt(els.flutes.value, 10) || 1);
      const chiploadMm = unit === "metric"
        ? (parseFloat(els.chipload.value) || 0)
        : inToMm(parseFloat(els.chipload.value) || 0);
      feedMmPerMin = rpm * chiploadMm * flutes;
    }

    els.outRpm.textContent = rpm.toLocaleString();
    const feedDisplay = unit === "metric" ? feedMmPerMin : mmToIn(feedMmPerMin);
    els.outFeed.textContent = round(feedDisplay, unit === "metric" ? 0 : 2).toLocaleString();

    const vcDisplay = unit === "metric" ? vcMetersPerMin : vcMetersPerMin / 0.3048;
    els.outVc.textContent = round(vcDisplay, 0).toLocaleString();
  }

  els.unitMetric.addEventListener("click", () => setUnit("metric"));
  els.unitImperial.addEventListener("click", () => setUnit("imperial"));
  els.operation.addEventListener("change", () => { updateLabelsAndUnits(); recalc(); });
  els.material.addEventListener("change", () => { userEditedChipload = false; userEditedFeedrev = false; recalc(); });
  els.toolMaterial.addEventListener("change", recalc);
  els.passType.addEventListener("change", () => { userEditedChipload = false; userEditedFeedrev = false; recalc(); });
  els.diameter.addEventListener("input", recalc);
  els.flutes.addEventListener("input", recalc);
  els.chipload.addEventListener("input", () => { userEditedChipload = true; recalc(); });
  els.feedrev.addEventListener("input", () => { userEditedFeedrev = true; recalc(); });

  document.addEventListener("languagechange", () => {
    populateMaterials();
    updateLabelsAndUnits();
    recalc();
  });

  populateMaterials();
  updateLabelsAndUnits();
  recalc();
})();

// ---------- G-code / M-code reference ----------
(function () {
  const listEl = document.getElementById("gcode-list");
  const searchEl = document.getElementById("gcode-search");
  if (!listEl) return;

  function render(filter) {
    const q = (filter || "").trim().toLowerCase();
    listEl.innerHTML = "";

    function renderGroup(titleKey, items) {
      const filtered = items.filter((it) => {
        const cat = it.cat[currentLang] || it.cat.en;
        const desc = it.desc[currentLang] || it.desc.en;
        return !q || it.code.toLowerCase().includes(q) || desc.toLowerCase().includes(q) || cat.toLowerCase().includes(q);
      });
      if (filtered.length === 0) return;
      const h = document.createElement("div");
      h.className = "section-heading";
      h.textContent = t(titleKey);
      listEl.appendChild(h);
      filtered.forEach((it) => {
        const cat = it.cat[currentLang] || it.cat.en;
        const desc = it.desc[currentLang] || it.desc.en;
        const row = document.createElement("div");
        row.className = "gcode-item";
        row.innerHTML = `<span class="gcode-code">${it.code}</span><span class="gcode-desc">${desc}<div class="gcode-cat">${cat}</div></span>`;
        listEl.appendChild(row);
      });
    }

    renderGroup("gcode.gcodesHeading", GCODES);
    renderGroup("gcode.mcodesHeading", MCODES);

    if (listEl.children.length === 0) {
      const empty = document.createElement("div");
      empty.className = "hint";
      empty.textContent = t("gcode.noResults");
      listEl.appendChild(empty);
    }
  }

  searchEl.addEventListener("input", () => render(searchEl.value));
  document.addEventListener("languagechange", () => render(searchEl.value));
  render("");
})();

// ---------- C reference ----------
(function () {
  const listEl = document.getElementById("cref-list");
  const searchEl = document.getElementById("cref-search");
  if (!listEl) return;

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function render(filter) {
    const q = (filter || "").trim().toLowerCase();
    listEl.innerHTML = "";

    const groups = [];
    const groupIndex = {};
    CCODES.forEach((it) => {
      const cat = it.cat[currentLang] || it.cat.en;
      const desc = it.desc[currentLang] || it.desc.en;
      if (q && !it.code.toLowerCase().includes(q) && !desc.toLowerCase().includes(q) && !cat.toLowerCase().includes(q)) return;
      if (!(cat in groupIndex)) {
        groupIndex[cat] = groups.length;
        groups.push({ cat, items: [] });
      }
      groups[groupIndex[cat]].items.push({ code: it.code, desc });
    });

    groups.forEach((g) => {
      const h = document.createElement("div");
      h.className = "section-heading";
      h.textContent = g.cat;
      listEl.appendChild(h);
      g.items.forEach((it) => {
        const row = document.createElement("div");
        row.className = "gcode-item";
        row.innerHTML = `<span class="gcode-code">${escapeHtml(it.code)}</span><span class="gcode-desc">${escapeHtml(it.desc)}</span>`;
        listEl.appendChild(row);
      });
    });

    if (groups.length === 0) {
      const empty = document.createElement("div");
      empty.className = "hint";
      empty.textContent = "Nema rezultata.";
      listEl.appendChild(empty);
    }
  }

  searchEl.addEventListener("input", () => render(searchEl.value));
  render("");
})();

// ---------- Curriculum ----------
(function () {
  const listEl = document.getElementById("curriculum-list");
  if (!listEl) return;

  function render() {
    listEl.innerHTML = "";
    CURRICULUM.forEach((subject) => {
      const details = document.createElement("details");
      details.className = "subject";
      if (subject.open) details.open = true;

      const summary = document.createElement("summary");
      summary.textContent = subject.name[currentLang] || subject.name.en;
      details.appendChild(summary);

      subject.modules.forEach((mod) => {
        const modDiv = document.createElement("div");
        modDiv.className = "module";
        const title = mod.title[currentLang] || mod.title.en;
        if (title) {
          const titleDiv = document.createElement("div");
          titleDiv.className = "module-title";
          titleDiv.textContent = title;
          modDiv.appendChild(titleDiv);
        }
        const ul = document.createElement("ul");
        ul.className = "module-topics";
        (mod.topics[currentLang] || mod.topics.en).forEach((topic) => {
          const li = document.createElement("li");
          li.textContent = topic;
          ul.appendChild(li);
        });
        modDiv.appendChild(ul);
        details.appendChild(modDiv);
      });

      listEl.appendChild(details);
    });
  }

  document.addEventListener("languagechange", render);
  render();
})();

// ---------- Resources ----------
(function () {
  const textbooksEl = document.getElementById("resources-textbooks");
  const cncEl = document.getElementById("resources-cnc");
  const tipsEl = document.getElementById("resources-tips");
  if (!textbooksEl) return;

  function renderLinks(container, items) {
    container.innerHTML = "";
    items.forEach((item) => {
      const div = document.createElement("div");
      div.className = "resource-item";
      const desc = item.desc[currentLang] || item.desc.en;
      div.innerHTML = `<a href="${item.url}" target="_blank" rel="noopener">${item.title}</a><div class="desc">${desc}</div>`;
      container.appendChild(div);
    });
  }

  function renderTips() {
    tipsEl.innerHTML = "";
    RESOURCES.tips.forEach((tip) => {
      const li = document.createElement("li");
      li.innerHTML = tip[currentLang] || tip.en;
      tipsEl.appendChild(li);
    });
  }

  function render() {
    renderLinks(textbooksEl, RESOURCES.textbooks);
    renderLinks(cncEl, RESOURCES.cnc);
    renderTips();
  }

  document.addEventListener("languagechange", render);
  render();
})();

// ---------- Service worker registration ----------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

// ---------- Push notifications ----------
(function () {
  const PUSH_CONFIG = {
    vapidPublicKey: "BGowme9gW7VoopuxI151WN_Oq7pirXETfCeoMnLrAq-jTrK3lqjAd2TPKkalUn74B4PY3g7HD4ZZbL9-tdzeydQ",
    workerUrl: "https://school-agent-push.djordjerad009.workers.dev",
  };

  const btn = document.getElementById("enable-push-btn");
  const statusEl = document.getElementById("push-status");
  if (!btn) return;

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
  }

  function supported() {
    return "serviceWorker" in navigator && "PushManager" in window;
  }

  async function updateButton() {
    if (!supported()) {
      btn.disabled = true;
      statusEl.textContent = "Obavještenja nisu podržana u ovom pregledaču.";
      return;
    }
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    btn.textContent = sub ? "🔕 Isključi dnevna obavještenja" : "🔔 Uključi dnevna obavještenja";
  }

  btn.addEventListener("click", async () => {
    if (!supported()) return;
    const reg = await navigator.serviceWorker.ready;
    const existing = await reg.pushManager.getSubscription();

    if (existing) {
      try {
        await fetch(`${PUSH_CONFIG.workerUrl}/api/unsubscribe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: existing.endpoint }),
        });
      } catch {}
      await existing.unsubscribe();
      await updateButton();
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      statusEl.textContent = "Dozvola za obavještenja je odbijena.";
      return;
    }

    try {
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUSH_CONFIG.vapidPublicKey),
      });
      await fetch(`${PUSH_CONFIG.workerUrl}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });
    } catch (err) {
      statusEl.textContent = "Prijava na obavještenja nije uspjela.";
    }
    await updateButton();
  });

  if (supported()) {
    navigator.serviceWorker.ready.then(updateButton);
  } else {
    updateButton();
  }
})();
