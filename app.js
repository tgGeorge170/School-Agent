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
  const MATERIALS = {
    aluminum:  { label: "Aluminum (6061)",        vc: 300, feedFactor: 1.3 },
    brass:     { label: "Brass",                  vc: 150, feedFactor: 1.1 },
    mildsteel: { label: "Mild Steel (S235/1018)",  vc: 120, feedFactor: 1.0 },
    stainless: { label: "Stainless Steel (304)",   vc: 60,  feedFactor: 0.7 },
    toolsteel: { label: "Tool Steel (pre-hard)",   vc: 55,  feedFactor: 0.6 },
    castiron:  { label: "Cast Iron",               vc: 90,  feedFactor: 0.9 },
    plastic:   { label: "Plastic (Acetal/POM)",    vc: 200, feedFactor: 1.5 },
    titanium:  { label: "Titanium",                vc: 45,  feedFactor: 0.5 },
  };

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

  for (const key in MATERIALS) {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = MATERIALS[key].label;
    els.material.appendChild(opt);
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
    els.diameterLabel.textContent = op === "turning" ? "Workpiece Diameter" : "Tool Diameter";
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

  updateLabelsAndUnits();
  recalc();
})();

// ---------- G-code / M-code reference ----------
(function () {
  const GCODES = [
    { code: "G00", cat: "Positioning", desc: "Rapid positioning (rapid traverse, no cutting)" },
    { code: "G01", cat: "Interpolation", desc: "Linear interpolation — straight-line feed move" },
    { code: "G02", cat: "Interpolation", desc: "Circular interpolation, clockwise (CW)" },
    { code: "G03", cat: "Interpolation", desc: "Circular interpolation, counter-clockwise (CCW)" },
    { code: "G04", cat: "Program control", desc: "Dwell — pause for a programmed time" },
    { code: "G17", cat: "Plane selection", desc: "Select XY plane" },
    { code: "G18", cat: "Plane selection", desc: "Select XZ plane (typical lathe default)" },
    { code: "G19", cat: "Plane selection", desc: "Select YZ plane" },
    { code: "G20", cat: "Units", desc: "Inch units (Fanuc-style; some controls use G70)" },
    { code: "G21", cat: "Units", desc: "Metric units (Fanuc-style; some controls use G71)" },
    { code: "G28", cat: "Positioning", desc: "Return to reference/home position" },
    { code: "G40", cat: "Compensation", desc: "Cutter radius compensation cancel" },
    { code: "G41", cat: "Compensation", desc: "Cutter radius compensation, left of path" },
    { code: "G42", cat: "Compensation", desc: "Cutter radius compensation, right of path" },
    { code: "G43", cat: "Compensation", desc: "Tool length compensation, positive" },
    { code: "G49", cat: "Compensation", desc: "Tool length compensation cancel" },
    { code: "G53", cat: "Coordinate systems", desc: "Move in machine coordinate system (non-modal)" },
    { code: "G54–G59", cat: "Coordinate systems", desc: "Select work coordinate system 1–6" },
    { code: "G80", cat: "Canned cycles", desc: "Cancel canned (fixed) cycle" },
    { code: "G81", cat: "Canned cycles", desc: "Simple drilling cycle" },
    { code: "G82", cat: "Canned cycles", desc: "Drilling with dwell (spot/counterbore)" },
    { code: "G83", cat: "Canned cycles", desc: "Peck drilling cycle (deep holes, chip breaking)" },
    { code: "G84", cat: "Canned cycles", desc: "Tapping cycle" },
    { code: "G90", cat: "Positioning mode", desc: "Absolute positioning — coordinates from part zero" },
    { code: "G91", cat: "Positioning mode", desc: "Incremental positioning — coordinates from last position" },
    { code: "G92", cat: "Coordinate systems", desc: "Set/shift the work coordinate origin" },
    { code: "G94", cat: "Feed mode", desc: "Feed per minute (mm/min or in/min)" },
    { code: "G95", cat: "Feed mode", desc: "Feed per revolution (mm/rev or in/rev) — common on lathes" },
    { code: "G96", cat: "Spindle mode", desc: "Constant surface speed (CSS) control — on (turning)" },
    { code: "G97", cat: "Spindle mode", desc: "Constant surface speed cancel — direct RPM" },
  ];

  const MCODES = [
    { code: "M00", cat: "Program control", desc: "Program stop (unconditional) — machine halts, press cycle start to resume" },
    { code: "M01", cat: "Program control", desc: "Optional stop — only halts if operator has it enabled" },
    { code: "M02", cat: "Program control", desc: "End of program" },
    { code: "M03", cat: "Spindle", desc: "Spindle start, clockwise (CW)" },
    { code: "M04", cat: "Spindle", desc: "Spindle start, counter-clockwise (CCW)" },
    { code: "M05", cat: "Spindle", desc: "Spindle stop" },
    { code: "M06", cat: "Tooling", desc: "Tool change" },
    { code: "M08", cat: "Coolant", desc: "Coolant on" },
    { code: "M09", cat: "Coolant", desc: "Coolant off" },
    { code: "M30", cat: "Program control", desc: "End of program, reset to the start" },
  ];

  const listEl = document.getElementById("gcode-list");
  const searchEl = document.getElementById("gcode-search");
  if (!listEl) return;

  function render(filter) {
    const q = (filter || "").trim().toLowerCase();
    listEl.innerHTML = "";

    function renderGroup(title, items) {
      const filtered = items.filter(
        (it) => !q || it.code.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q) || it.cat.toLowerCase().includes(q)
      );
      if (filtered.length === 0) return;
      const h = document.createElement("div");
      h.className = "section-heading";
      h.textContent = title;
      listEl.appendChild(h);
      filtered.forEach((it) => {
        const row = document.createElement("div");
        row.className = "gcode-item";
        row.innerHTML = `<span class="gcode-code">${it.code}</span><span class="gcode-desc">${it.desc}<div class="gcode-cat">${it.cat}</div></span>`;
        listEl.appendChild(row);
      });
    }

    renderGroup("G-codes", GCODES);
    renderGroup("M-codes", MCODES);

    if (listEl.children.length === 0) {
      const empty = document.createElement("div");
      empty.className = "hint";
      empty.textContent = "No matches.";
      listEl.appendChild(empty);
    }
  }

  searchEl.addEventListener("input", () => render(searchEl.value));
  render("");
})();

// ---------- Service worker registration ----------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
