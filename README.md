# School-Agent

A small installable app (PWA) to help with CNC machining coursework at
Tehnička Škola Gradiška, plus the reference notes it's built from.

## The app (`index.html`)

Serbian (Latin) by default, with an EN toggle pinned to the top of every
screen — the choice is remembered between visits. Four tabs, navigable
from a bottom bar like a phone app:

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

### Running it

No build step — open `index.html` directly in a browser, or serve the
folder over HTTP(S) (e.g. `python3 -m http.server`, or GitHub Pages) to
get the full installable PWA experience: "Add to Home Screen" on your
phone, and it keeps working offline afterward (service worker caches the
whole app on first load). Opening the raw file (`file://`) works fine for
everyday use, just without the install prompt or offline caching, since
those require a real HTTP(S) origin.

## Source files

- `3rd-year-overview.md` — the curriculum breakdown in longer form, with
  sources.
- `styles.css`, `app.js`, `manifest.json`, `sw.js` — the app shell,
  calculator/reference logic, and PWA plumbing behind `index.html`.
- `i18n.js`, `content-data.js` — the SR/EN dictionary and bilingual
  content (materials, G-codes, curriculum, resources). The Serbian
  curriculum text uses the actual topic lists from the official document,
  not a translation of the English summary.

## Push notifications (`worker/`)

`school-agent-push` is a Cloudflare Worker that sends reminders while the app
is closed: the day's schedule at 10:50 on school days, tests (2 days and 1 day
before at 19:00, and the morning of), and open homework (the evening before and
the morning of the due date). Times can be changed in the app (Raspored tab).

- The app (`push.js`) syncs the schedule, tests and tasks to the Worker whenever
  they change, and re-registers on every open, so the server never goes stale.
- A cron runs every 5 minutes and converts to Europe/Sarajevo time itself, so
  DST changes don't shift reminders. Missed runs are caught up for 30 minutes;
  each reminder is sent once.
- "Pošalji probno obavještenje" sends a real push and reports the push
  service's answer.

Deploy: `cd worker && npx wrangler deploy` (the `VAPID_PRIVATE_KEY` secret is
already set on the Worker; `ADMIN_SECRET` is optional, for `/api/test-notify`
and `/api/run-reminders`). Tests: `cd worker && npm test`.

Android: install the app from **Chrome**, not Brave (Brave doesn't wake up for
push, so notifications only show when the app is opened). On Samsung, set
Chrome's battery usage to *Unrestricted*.
