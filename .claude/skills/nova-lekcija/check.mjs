// Validates lectures-data.js the way the app reads it; --shot <png> renders every diagram.
import { readFileSync, writeFileSync } from "node:fs";

const file = new URL("../../../lectures-data.js", import.meta.url);
const text = readFileSync(file, "utf8");
const start = text.indexOf(".concat(");
const end = text.lastIndexOf(");");
let data;
try {
  data = JSON.parse(text.slice(start + 8, end));
} catch (e) {
  console.error("✗ concat(...) is not strict JSON:", e.message);
  process.exit(1);
}

const errors = [];
const ids = new Set();
const svgs = [];
for (const s of data) {
  if (!s.id || !s.subject || !Array.isArray(s.lessons)) errors.push(`subject ${s.id || "?"}: needs id, subject, lessons`);
  for (const l of s.lessons || []) {
    const where = `${s.id}/${l.id}`;
    if (ids.has(l.id)) errors.push(`${where}: duplicate lesson id`);
    ids.add(l.id);
    if (!l.title || !l.summary) errors.push(`${where}: needs title and summary`);
    if (!(l.key || []).length) errors.push(`${where}: no key points`);
    let imgs = 0;
    for (const sec of l.sections || []) {
      if (!Array.isArray(sec.p)) errors.push(`${where}: section "${sec.h}" has no p array`);
      if (sec.img) {
        imgs++;
        if (sec.img.startsWith("<svg")) {
          if (/<script|on\w+=|href="http/i.test(sec.img)) errors.push(`${where}: SVG has scripts, handlers or external links`);
          if (!sec.img.includes("viewBox")) errors.push(`${where}: SVG needs a viewBox`);
          svgs.push({ where, svg: sec.img });
        }
      }
      for (const p of sec.p || []) if (/\bnpr\.|[₀-₉]/.test(p)) errors.push(`${where}: write "na primjer" / formulas in words for read-aloud`);
    }
    if (!imgs) errors.push(`${where}: no diagram`);
  }
}

if (errors.length) {
  errors.forEach((e) => console.error("✗", e));
  process.exit(1);
}
console.log(`✓ ${data.length} subjects, ${ids.size} lessons, ${svgs.length} diagrams`);

const shot = process.argv.indexOf("--shot");
if (shot > 0) {
  const out = process.argv[shot + 1] || "lectures-diagrams.png";
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.error("✗ playwright missing: run `npm i --no-save --no-package-lock playwright` in the repo root (Chromium is preinstalled; node_modules is git-ignored)");
    process.exit(1);
  }
  const html = "<body style='margin:0;width:380px;background:#16181d;font:12px sans-serif;color:#ccc'>" +
    svgs.map((s) => `<div style="padding:6px 10px">${s.where}</div><img style="width:360px;margin:0 10px;background:#fff;border-radius:10px" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(s.svg)}">`).join("") + "</body>";
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium" }).catch(() => chromium.launch());
  const page = await browser.newPage({ viewport: { width: 380, height: 800 } });
  await page.setContent(html);
  await page.waitForTimeout(300);
  await page.screenshot({ path: out, fullPage: true });
  await browser.close();
  console.log("✓ diagrams rendered to", out);
}
