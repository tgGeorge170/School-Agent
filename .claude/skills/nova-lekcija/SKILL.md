---
name: nova-lekcija
description: Turn photos of the student's notebook into lessons for the app's Predavanja tab, for any subject (Termodinamika, CNC programiranje, Hidraulika i pneumatika, Mašinski elementi, Tehnologija obrade, Matematika...), with diagrams, one example per concept, and a study guide in chat. Use whenever the student sends lecture/notebook photos, says "nova lekcija", "dodaj predavanje", "imam test iz...", or asks for a study guide from their notes.
---

# Nova lekcija

The student (3rd year, CNC tehničar, Tehnička škola Gradiška) sends photos of
their handwritten notebook. You turn them into lessons the Android app reads
aloud, plus a study guide in chat. Everything in Serbian, Latin script,
ijekavian (tijelo, razmijeniti), matching the notebook's wording.

If no photos are attached, say so and ask for them. Never invent lecture
content that isn't in the photos.

## 1. Read the notes

- Transcribe every photo in order. Keep the teacher's definitions word for word
  where possible; the test asks for them.
- Note drawings and diagrams in the notebook; they become SVGs (step 3).
- If the notebook has a mistake (e.g. 1 bar = 101325 Pa), keep the lesson
  correct and tell the student in chat what was wrong.
- Anything you add beyond the notebook is marked "Dodatno objašnjenje" and kept short.

## 2. Write the lessons

Lessons live in `lectures-data.js` on branch `main`. The app
downloads that file from GitHub, so pushing it is all it takes: no new APK.

- Check out that branch (`git fetch origin main`).
- One entry per subject. If the subject exists, append lessons to it; don't duplicate it.
  Subject ids/icons: `termodinamika` 🔥, `cnc-programiranje` 🔧,
  `hidraulika-i-pneumatika` 💧, `masinski-elementi` ⚙️, `tehnologija-obrade` 🛠️,
  `matematika` 📐, `racunari-i-programiranje` 💻, `prakticna-nastava` 🏭,
  others: pick a fitting emoji. `order` follows the order subjects were added.
- Lesson ids: `<subject-short>-<module>-<n>` (e.g. `tmd-1-7`). `module` is the
  chapter heading, e.g. "1. Osnovni pojmovi".
- **Everything inside `concat(...)` must be strict JSON** (double-quoted keys
  and strings). The app and worker `JSON.parse` it; a JS-only literal breaks
  lesson downloads for everyone.

Lesson shape:

```json
{
  "id": "tmd-1-1", "module": "1. Osnovni pojmovi", "title": "...",
  "summary": "One sentence.",
  "sections": [{ "h": "Heading", "img": "<svg ...>...</svg>", "cap": "Caption", "p": ["Paragraph.", "..."] }],
  "key": ["What the test asks, one line each."]
}
```

Writing rules (the student asked for these):
- Thorough explanations, not bullet fragments. Explain *why*, not just the definition.
- **Exactly one real-life example per concept.** Start it with "Primjer:".
- Text is read aloud: write formulas in words ("p a jednako p b plus p m",
  "deset na peti paskala"), no symbols, subscripts or abbreviations like "npr.".
- 4–7 short lessons per two classes; split big topics.
- `key` = 3–5 lines the student must know for the test.

## 3. Diagrams

Every lesson gets at least one picture: redraw every notebook diagram, and add
one for the lesson's main idea if the notebook has none. Put it in the section
it explains (`img` + `cap`).

- Inline SVG string, `viewBox` about 360 wide, no fixed width/height, no
  scripts, no external fonts or images. `font-family="Arial,Helvetica,sans-serif"`.
- It is shown on a white card, so use dark text (#1f2328) and clear colors:
  hot/nadpritisak red #d9480f, cold/podpritisak blue #1c7ed6, OK green #2b8a3e,
  muted #868e96. Formulas and symbols (p_a, ρ, ΣF) are fine inside the SVG.
- Arrows: a `<marker>` with `fill="context-stroke"`.
- Keep labels short; the paragraphs do the explaining.

## 4. Check before pushing

```bash
node .claude/skills/nova-lekcija/check.mjs            # structure + JSON + SVG sanity
node .claude/skills/nova-lekcija/check.mjs --shot out.png   # also renders every diagram
```

Look at the screenshot (Read it) and fix overlapping or cut-off text. Also run
`cd worker && npm test` on the APK branch.

## 5. Push

1. Commit `lectures-data.js` on the APK branch and push it. That branch skips
   the APK build for lesson-only changes; the app picks lessons up on its next
   open (GitHub caches up to ~5 min).
2. Copy the same `lectures-data.js` to the session's own development branch
   and push it too, so both stay in sync.
3. Don't touch other files unless asked. If you change `lectures.js` or other
   app code, that rebuilds the APK and the student must reinstall; tell them.

## 6. Answer in chat

Give the study guide in chat (Serbian): per topic the definition in bold, a
short explanation, one example, formulas with units, then "Najvjerovatnija
pitanja" with one-line answers. Mention notebook mistakes you corrected. End
with: the lessons are in the app under Predavanja → <icon> <subject>, open the
app with internet to fetch them.
