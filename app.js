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
