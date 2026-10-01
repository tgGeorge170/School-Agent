# Plan: professor login, every curriculum, store apps

Goal: professors log in and publish lessons themselves, for any smjer and
razred, and students get the app from Google Play, the App Store and the
Microsoft Store (Windows).

## Where we are today

| Piece | Where | Notes |
|---|---|---|
| Web app (PWA) | `main`, GitHub Pages | Vanilla JS, no build step, Serbian/EN |
| Android APK | `android-app/` (was on its own branch, now merged) | Capacitor 8, CI builds the APK, emulator test |
| Backend | `worker/` (Cloudflare Worker + KV) | Push reminders, serves `/lectures.json` and the APK |
| Lessons | `lectures-data.js` in git | Only we can add lessons (photos → `nova-lekcija` skill → push) |

The problem: lessons live in a git file. To let professors add lessons, they
have to live in a **database** behind a **login**.

## Target architecture

```
 Student app (Android / iOS / Windows / web)     Professor portal (same app, "Za profesore")
            │ reads published lessons                      │ login, write lessons, upload images
            └──────────────────┬───────────────────────────┘
                               ▼
            Cloudflare Worker (our existing one, extended)
            ├─ D1: users, sessions, curriculum, lessons
            ├─ R2: lesson images
            └─ push reminders, "new lesson published" notifications
```

One codebase (the current web app) ships everywhere:
- **Android + iOS**: Capacitor (already set up for Android).
- **Windows**: the same PWA packaged as MSIX via PWABuilder → Microsoft Store.
- **Web**: GitHub Pages (or our own domain).

## Decisions made

| Question | Answer |
|---|---|
| Backend | **Cloudflare only**: extend our Worker with D1 (database) and R2 (images) |
| Store accounts | **School / professor** (organization account) |
| Scope | **Our school, all smjerovi** |
| Students | **Anonymous**: pick smjer + razred, no accounts |

## Build on it or start over?

**Build on it, but restructure.** What exists works and is tested; what has to
change is the data being hard-coded for CNC 3rd year.

| Part | Verdict | Why |
|---|---|---|
| `voice.js` (Serbian read-aloud) | Keep as is | Hardest part, works on phone, PC and in the APK |
| `lectures.js` (player) | Keep, change the data source | Reads from the API instead of `lectures-data.js` |
| Calculator, G-code, C reference | Keep | Become "tools" shown only for smjerovi that need them |
| `content-data.js`, journal subject list, schedule | **Rewrite** | Hard-coded for CNC 3rd year; must come from the database per smjer/razred |
| `index.html` (one big page, all tabs) | **Restructure** | Split into modules with a small build step (esbuild, already used by `android-app/`) so login, editor and admin don't pile into one file |
| `android-app/` (Capacitor) | Keep | Add iOS to the same project |
| `worker/` | Keep, extend | Add D1 + auth + lesson API next to push reminders |
| Two diverged branches | **Merge into `main`** | One app, one source |

Starting over would throw away the read-aloud work, the Android build with
its emulator test, and the push reminders, all of which would need to be
rebuilt the same way.

## Data model

```
programs       id, name                                  e.g. "Tehničar CNC tehnologije"
grades         id, program_id, year (1–4)
subjects       id, grade_id, name, icon, order
modules        id, subject_id, name, order    e.g. "1. Programiranje NUMA"
lessons        id, module_id, title, summary, sections (JSON), key (JSON),
               status (draft | published), author_id, updated_at
users          id, email, full_name, role (admin | profesor), password_hash, salt
sessions       token_hash, user_id, expires_at
invites        token_hash, email, role, expires_at, used_at
assignments    user_id, subject_id            which subjects a professor may edit
```

`sections` and `key` keep **today's lesson format**, so the Predavanja player
and read-aloud keep working unchanged. Images go to file storage instead of
inline SVG strings (SVG still allowed).

Permissions (checked in the Worker on every write request):
- Anyone (even without logging in): read **published** lessons.
- Profesor: create, edit and publish lessons only for their assigned subjects.
- Admin (us / school): add programs and subjects, invite professors,
  assign subjects.

## Phase 0: preparation (before coding)

1. **Merge the branches.** `main` and the APK branch have split. Put everything
   (PWA, `android-app/`, `worker/`) on `main` so there is one app.
2. Make the remaining decisions at the bottom of this file.
3. Ask the school to start the **D-U-N-S number** request now: Google and
   Apple organization accounts need it, and it can take weeks.

## Phase 1: login page (first)

Screens (Serbian, matching the app's style):
1. **Prijava**: email + lozinka, "Zaboravili ste lozinku?"
2. **Postavi lozinku**: the professor opens the invite link and picks a password.
3. **Reset lozinke**: from a reset link the admin generates.
4. **Moji predmeti**: after login, the subjects assigned to this professor.
5. **Odjava** (log out), session remembered on the device.

How professors get in:
- **Invite-only.** No public sign-up, so random people can't post lessons.
  An admin enters the professor's name and email, the app shows a one-time
  link, and the admin sends it themselves (Viber, email). No email service needed.
- The entry point is a "Za profesore" button in the app's settings / footer,
  plus a direct web link (`…/#/profesor`) for using it on a computer.
- On Android/iOS, invite and reset links open the app (deep links).

How it works (Cloudflare, no outside auth service):
- Passwords hashed with PBKDF2-SHA256 (Web Crypto, built into Workers) with a
  random salt per user; never stored or logged in plain text.
- Login returns a random session token; only its hash is stored in D1.
  Web uses an HttpOnly cookie, the apps send it as a Bearer header.
  Sessions expire after 30 days, "Odjava" deletes the session.
- Invite and reset links: one-time random tokens, valid 48 h / 1 h.
- Rate limit on login (e.g. 5 wrong tries → wait 15 min) against password guessing.
- Endpoints: `POST /api/auth/login`, `/logout`, `/accept-invite`,
  `/request-reset`, `/reset`, `GET /api/me`.

Done when: a professor gets an invite, sets a password, logs in on the web
and on the Android app, sees "Moji predmeti", and the database refuses
edits to subjects they aren't assigned to (tested).

## Phase 2: lesson editor

- List of the subject's modules and lessons, with draft/published badges.
- Editor: title, module, summary, sections (heading, paragraphs, image
  upload + caption), "key" points for the test.
- **Preview** button that shows the lesson exactly as students see it and
  reads it aloud with the same voice engine.
- Publish / unpublish. Students only see published lessons.
- Move the existing lessons from `lectures-data.js` into the database
  (one-off import script). The app keeps a bundled copy for offline first launch.

## Phase 3: every curriculum

- First-launch picker for students: Škola → Smjer → Razred (changeable later).
- The Raspored, 3rd Year curriculum and Dnevnik subject lists come from the
  database instead of being hard-coded for CNC 3rd year.
- Admin panel: add programs/subjects (seed from the official RPZ RS
  curricula), invite professors, assign subjects.
- Offline: lessons the student opened are cached on the device.

## Phase 4: stores

| Store | Cost | What's needed | Watch out for |
|---|---|---|---|
| Google Play | $25 one-time | Organization account (school) with D-U-N-S number, AAB build (we have APK), privacy policy URL, Data safety form, content rating | Organization accounts skip the 14-day closed test that personal accounts need |
| Apple App Store | $99/year (schools may qualify for a fee waiver) | Organization account with D-U-N-S; Capacitor iOS project; build on a Mac **or** GitHub Actions macOS runners / Codemagic | Apple rejects "just a website in a wrapper", so we point to offline lessons, read-aloud, notifications. Review takes 1–3 days |
| Microsoft Store | Free for individuals | PWABuilder → MSIX package | Easiest of the three |

The school owns the accounts; we get added as developers to upload builds.
Every store needs a privacy policy page (we store professors' emails;
students are anonymous).

## Phase 5: extras (later)

- **AI draft from photos**: a professor uploads notebook/board photos and
  gets a lesson draft to correct (what the `nova-lekcija` skill does now,
  built into the app). Uses the Claude API, so it costs per use.
- Push notification "Nova lekcija iz Termodinamike" when a lesson is published.
- Short quizzes from the lesson's key points.
- Statistics for professors (how many students opened a lesson).

## Status

- [x] Phase 0: Android/worker branch merged into one branch
- [x] Phase 0b: everything lives on `main`; accounts run in their own Worker `school-agent-api` (`api/`)
- [x] Phase 1: login, invites, reset links, admin user list (`api/src/auth.js`, `profesor.html`)
- [ ] Phase 2: lesson editor
- [ ] Phase 3: every smjer and razred
- [ ] Phase 4: stores
