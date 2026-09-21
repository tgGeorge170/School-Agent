# School-Agent

A small installable app (PWA) to help with CNC machining coursework at
Tehnička Škola Gradiška, plus the reference notes it's built from.

## The app (`index.html`)

Serbian (Latin) by default. Six tabs, navigable from a bottom bar like a
phone app:

- **🗓️ Raspored** — the weekly bell schedule for 3 CNC (G2), with a
  "Sada / Sljedeće" banner showing the current or next class and its real
  clock time.
- **🧮 Calculator** — feeds & speeds estimator. Given operation
  (milling / drilling / turning), workpiece material, tool material, and
  tool/workpiece diameter, it estimates **spindle speed (RPM)** and
  **feed rate**. Metric by default with an Imperial toggle. Suggested chip
  loads and cutting speeds are reasonable starting points for a school
  shop, not a substitute for the tool manufacturer's data — always verify
  and adjust from chip color, sound, and finish.
- **🔤 G-code** — searchable G-code/M-code quick reference (generic/ISO,
  Fanuc-compatible in most cases — verify exact codes against your
  school's machine control).
- **📘 3rd Year** — the official Republika Srpska curriculum for Техничар
  CNC технологије, 3rd year, broken down by subject and module.
- **📚 Resources** — textbooks, notes, and free CNC programming tutorials
  worth cross-studying with.
- **📓 Dnevnik** — a local study journal: notes, upcoming tests (with
  calendar export and, optionally, phone push reminders — see below), and
  grades with running averages. Everything here lives in `localStorage` on
  the device; nothing leaves it unless push reminders are turned on, and
  even then only a test's subject/date/note is sent.

### Running it

No build step — open `index.html` directly in a browser, or serve the
folder over HTTP(S) (e.g. `python3 -m http.server`, Cloudflare Pages, or
GitHub Pages) to get the full installable PWA experience: "Add to Home
Screen" on your phone, and it keeps working offline afterward (service
worker caches the whole app on first load). Opening the raw file
(`file://`) works fine for everyday use, just without the install prompt
or offline caching, since those require a real HTTP(S) origin.

### Hosting on Cloudflare Pages

1. Push this repo to GitHub (private is fine — Cloudflare Pages deploys
   from private repos on the free plan, unlike GitHub Pages which needs a
   paid plan for that).
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages →
   Connect to Git**, pick this repo.
3. Build settings: **Framework preset: None**, **Build command: (empty)**,
   **Output directory: `/`** (the repo root — `index.html` lives there).
   Pages will auto-deploy on every push to the branch you pick.
4. That's the static site done. Push notifications need a second, separate
   deploy — see `worker/README.md` — since they run on a Worker, not Pages.

### Phone push notifications for tests

Opt-in, off by default. In Dnevnik → Testovi, tapping **"🔔 Omogući
podsjetnike na telefon"** subscribes the device and sends a reminder 2 days
before a test and again on the day of, even if the app isn't open. It's
backed by a small Cloudflare Worker (`worker/`) — see `worker/README.md`
for the one-time deploy steps (create a KV namespace, set the VAPID private
key as a secret, `wrangler deploy`, paste the resulting URL into
`push.js`). Until that's deployed, the button explains what's missing
instead of silently doing nothing.

The existing **📅 "Izvezi sve u kalendar"** button (a plain `.ics` download,
no server involved) still works either way, and adds a 1-hour-before
reminder that the push flow doesn't attempt.

## Source files

- `3rd-year-overview.md` — the curriculum breakdown in longer form, with
  sources.
- `styles.css`, `app.js`, `manifest.json`, `sw.js` — the app shell,
  calculator/reference/schedule logic, and PWA plumbing (including push
  notification handling) behind `index.html`.
- `journal.js` — the Dnevnik tab: notes, tests, grades, all in
  `localStorage`.
- `push.js` — optional phone push reminders for tests; talks to the
  Cloudflare Worker in `worker/`, and does nothing until that's deployed
  and the student opts in.
- `i18n.js`, `content-data.js` — bilingual content data (materials,
  G-codes, curriculum, resources, schedule). The Serbian curriculum text
  uses the actual topic lists from the official document, not a
  translation of the English summary.
- `worker/` — the Cloudflare Worker that sends push reminders; deployed
  separately from the static site (see `worker/README.md`).
