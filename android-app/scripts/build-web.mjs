// Copies the web app into www/ and adds the native bundle (reminders on device).
import { build } from "esbuild";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const www = join(here, "..", "www");

rmSync(www, { recursive: true, force: true });
mkdirSync(www, { recursive: true });
const files = [
  "index.html", "styles.css", "manifest.json", "i18n.js", "content-data.js", "journal.js",
  "voice.js", "lectures-data.js", "lectures.js", "app.js", "push-config.js", "push.js",
];
for (const f of files) cpSync(join(root, f), join(www, f));
cpSync(join(root, "icons"), join(www, "icons"), { recursive: true });

await build({
  entryPoints: [join(here, "..", "src", "native.js")],
  bundle: true,
  format: "iife",
  target: "es2020",
  outfile: join(www, "native.bundle.js"),
  logLevel: "warning",
});

const html = readFileSync(join(www, "index.html"), "utf8");
if (!html.includes('<script src="i18n.js"></script>')) throw new Error("index.html script tags changed");
writeFileSync(
  join(www, "index.html"),
  html.replace('<script src="i18n.js"></script>', '<script src="native.bundle.js"></script>\n<script src="i18n.js"></script>')
);
console.log("www/ ready");
