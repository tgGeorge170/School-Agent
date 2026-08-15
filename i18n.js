const I18N = {
  sr: {
    appTitle: "CNC Školski Pomoćnik",
    "nav.calc": "Kalkulator",
    "nav.gcode": "G-kod",
    "nav.curriculum": "3. razred",
    "nav.resources": "Resursi",

    "calc.title": "Kalkulator brzina i posmaka",
    "calc.subtitle": "Brza procjena broja obrtaja i posmaka za glodanje, bušenje i struganje",
    "calc.units": "Jedinice",
    "calc.metric": "Metrične",
    "calc.imperial": "Imperijalne",
    "calc.operation": "Operacija",
    "calc.opMilling": "Glodanje",
    "calc.opDrilling": "Bušenje",
    "calc.opTurning": "Struganje",
    "calc.material": "Materijal",
    "calc.toolMaterial": "Materijal alata",
    "calc.carbide": "Karbid",
    "calc.hss": "Brzorezni čelik (HSS)",
    "calc.toolDiameter": "Prečnik alata",
    "calc.workpieceDiameter": "Prečnik obratka",
    "calc.flutes": "Broj oštrica",
    "calc.pass": "Prolaz",
    "calc.roughing": "Gruba obrada",
    "calc.finishing": "Fina obrada",
    "calc.chiploadLabel": "Posmak po zubu",
    "calc.feedrevLabel": "Posmak po obrtaju",
    "calc.spindleSpeed": "Broj obrtaja vretena",
    "calc.feedRate": "Brzina posmaka",
    "calc.cuttingSpeedUsed": "Korištena rezna brzina",
    "calc.note": "Ovo su početne vrijednosti, a ne garancija — uvijek provjeri tabelu proizvođača alata, počni oprezno na novom podešavanju i prilagodi prema boji strugotine, zvuku i kvaliteti obrade. Ponovo izračunaj nakon promjene materijala ili alata; nikad se ne oslanjaj samo na ovo za nepoznat posao.",

    "gcode.title": "G-kod i M-kod referenca",
    "gcode.subtitle": "Brza pretraga za programiranje — pretraži po kodu, riječi ili kategoriji",
    "gcode.searchPlaceholder": "Pretraži npr. \"G02\", \"luk\", \"vreteno\"",
    "gcode.gcodesHeading": "G-kodovi",
    "gcode.mcodesHeading": "M-kodovi",
    "gcode.note": "Ovo je generička/ISO referenca (u većini slučajeva kompatibilna sa Fanuc-om). Tačni brojevi kodova mogu se razlikovati zavisno od upravljačke jedinice (Fanuc, Siemens Sinumerik, Heidenhain) — uvijek provjeri sa priručnikom mašine u školi prije pokretanja programa, posebno kodove za izbor jedinica (G20/G21 ili G70/G71).",
    "gcode.noResults": "Nema rezultata.",

    "curriculum.title": "3. razred — Tehničar CNC tehnologije",
    "curriculum.subtitle": "Zvanični nastavni plan Republike Srpske, predmet po predmet",
    "curriculum.intro": "Prva dva razreda su postavila temelje. Treći razred je tamo gdje CNC programiranje i rad na mašinama zaista počinju.",

    "resources.title": "Materijali za učenje",
    "resources.subtitle": "Gdje tražiti, i kako iskoristiti vrijeme koje imaš",
    "resources.note": "Zvanični nastavni plan ne navodi fiksni udžbenik — samo kaže da je „odobren od Ministarstva”. Prvo pitaj svoje nastavnike CNC programiranja i Tehnologije obrade za tačan naslov; to je pouzdanije od bilo čega pronađenog na internetu.",
    "resources.textbooksHeading": "Udžbenici i skripte",
    "resources.cncHeading": "CNC programiranje / G-kod",
    "resources.studyHeading": "Kako učiti ove godine",
  },
  en: {
    appTitle: "CNC School Companion",
    "nav.calc": "Calculator",
    "nav.gcode": "G-code",
    "nav.curriculum": "3rd Year",
    "nav.resources": "Resources",

    "calc.title": "Feeds & Speeds Calculator",
    "calc.subtitle": "Quick RPM & feed-rate estimates for milling, drilling, and turning",
    "calc.units": "Units",
    "calc.metric": "Metric",
    "calc.imperial": "Imperial",
    "calc.operation": "Operation",
    "calc.opMilling": "Milling",
    "calc.opDrilling": "Drilling",
    "calc.opTurning": "Turning",
    "calc.material": "Material",
    "calc.toolMaterial": "Tool Material",
    "calc.carbide": "Carbide",
    "calc.hss": "HSS",
    "calc.toolDiameter": "Tool Diameter",
    "calc.workpieceDiameter": "Workpiece Diameter",
    "calc.flutes": "Flutes",
    "calc.pass": "Pass",
    "calc.roughing": "Roughing",
    "calc.finishing": "Finishing",
    "calc.chiploadLabel": "Chip Load / Tooth",
    "calc.feedrevLabel": "Feed / Revolution",
    "calc.spindleSpeed": "Spindle Speed",
    "calc.feedRate": "Feed Rate",
    "calc.cuttingSpeedUsed": "Cutting Speed Used",
    "calc.note": "These are starting-point values, not a guarantee — always check your tool manufacturer's chart, start conservative on a new setup, and adjust from chip color/sound/finish. Recalculate after material or tool changes; never rely on this alone for an unfamiliar job.",

    "gcode.title": "G-code & M-code Reference",
    "gcode.subtitle": "Quick lookup for programming — search by code, word, or category",
    "gcode.searchPlaceholder": "Search e.g. \"G02\", \"arc\", \"spindle\"",
    "gcode.gcodesHeading": "G-codes",
    "gcode.mcodesHeading": "M-codes",
    "gcode.note": "This is a generic/ISO-style reference (Fanuc-compatible in most cases). Exact code numbers can vary by controller (Fanuc, Siemens Sinumerik, Heidenhain) — always verify against your school machine's control manual before running a program, especially unit-selection codes (G20/G21 vs G70/G71).",
    "gcode.noResults": "No matches.",

    "curriculum.title": "3rd Year — Tehničar CNC tehnologije",
    "curriculum.subtitle": "Official Republika Srpska curriculum, subject by subject",
    "curriculum.intro": "Years 1–2 built the foundations. 3rd year is where CNC programming and machine operation actually start.",

    "resources.title": "Study Resources",
    "resources.subtitle": "Where to look, and how to use the time you have",
    "resources.note": "The official curriculum doesn't name a fixed textbook — it just says \"approved by the Ministry.\" Ask your CNC programiranje and Tehnologija obrade teachers for the exact assigned title first; that beats anything found online.",
    "resources.textbooksHeading": "Textbooks & notes",
    "resources.cncHeading": "CNC programming / G-code",
    "resources.studyHeading": "How to study this year",
  },
};

const LANG_STORAGE_KEY = "cncCompanionLang";
let currentLang = localStorage.getItem(LANG_STORAGE_KEY) || "sr";

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key]) || (I18N.en && I18N.en[key]) || key;
}

function applyStaticI18n() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.documentElement.lang = currentLang;
  document.title = t("appTitle");
}

function setLanguage(lang) {
  if (lang !== "sr" && lang !== "en") return;
  currentLang = lang;
  localStorage.setItem(LANG_STORAGE_KEY, lang);
  document.querySelectorAll(".lang-toggle button").forEach((b) => {
    b.classList.toggle("active", b.dataset.lang === lang);
  });
  applyStaticI18n();
  document.dispatchEvent(new CustomEvent("languagechange", { detail: { lang } }));
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".lang-toggle button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
  });
  applyStaticI18n();
});
