# cnc-pomocnik-push

Small Cloudflare Worker that sends phone push notifications for upcoming
tests logged in the app's Dnevnik → Testovi tab. Opt-in only: nothing is
sent anywhere until the student taps "Omogući podsjetnike" in the app, which
requires this Worker to be deployed and its URL filled into `push.js`.

What it does, and nothing else:
- Stores a Web Push subscription per anonymous device.
- Stores a slimmed copy of that device's tests (subject, date, note — never
  notes or grades, which stay local-only in the app regardless).
- Once a day (cron), checks every device's tests and sends a push for
  anything 2 days out or due today.

## One-time setup

You'll need a free Cloudflare account and Node.js installed locally.

```bash
cd worker
npm install
npx wrangler login          # opens a browser to authorize the CLI
```

### 1. Create the KV namespace (stores subscriptions + test data)

```bash
npx wrangler kv namespace create CNC_PUSH
```

This prints an `id`. Paste it into `wrangler.toml`, replacing
`REPLACE_WITH_YOUR_KV_NAMESPACE_ID`.

### 2. Set the VAPID private key as a secret

A VAPID key pair was already generated for this app — the public half is
already in `wrangler.toml` and in `../push.js`. **The private half must
never be committed to the repo.** Set it as an encrypted Worker secret
instead:

```bash
npx wrangler secret put VAPID_PRIVATE_KEY
# paste the private key when prompted, then press enter
```

(If you don't have the private key handy, generate a fresh pair and update
both `wrangler.toml`'s `VAPID_PUBLIC_KEY` and `../push.js`'s
`VAPID_PUBLIC_KEY` to match — the public and private key must always be from
the same pair.)

### 3. Set your VAPID subject

`wrangler.toml`'s `[vars] VAPID_SUBJECT` should be a `mailto:` address or
`https://` URL that identifies you — it's how a push service (Google's FCM,
Apple's push service, etc.) can reach you if something's wrong with your
usage. Already set to the repo owner's email; change it if needed.

### 4. Deploy

```bash
npx wrangler deploy
```

This prints your Worker's URL, something like:

```
https://cnc-pomocnik-push.<your-subdomain>.workers.dev
```

### 5. Wire it into the app

Paste that URL into `PUSH_API_BASE` near the top of `../push.js`:

```js
const PUSH_API_BASE = "https://cnc-pomocnik-push.<your-subdomain>.workers.dev";
```

Commit and redeploy the static site (see the root `README.md` for hosting
the site itself on Cloudflare Pages). Once that's live, the "Omogući
podsjetnike" button in Dnevnik → Testovi will actually work.

## Local development

```bash
cp .dev.vars.example .dev.vars   # then edit .dev.vars with a real private key
npx wrangler dev
```

`wrangler dev` reads `.dev.vars` for secrets locally (it's gitignored) and
uses `wrangler.toml`'s `[vars]` and `kv_namespaces` as normal. Test the cron
handler locally by hitting the `/__scheduled` endpoint `wrangler dev`
exposes, or trigger the deployed cron early from the Cloudflare dashboard
(Workers & Pages → your worker → Triggers → Cron Triggers → "Trigger now")
or with `npx wrangler triggers`.

## Notes / limitations

- No authentication beyond an unguessable per-device ID generated client-side.
  Fine for a personal/class tool with no sensitive data; not meant for a
  public product.
- The cron runs once a day at 06:00 UTC — reminders are "2 days before" and
  "day of", not hour-precise. The existing `.ics` calendar export in the app
  still gives a 1-hour-before reminder via the phone's own calendar app.
- iOS only supports Web Push for a PWA that's been "Added to Home Screen"
  (Safari tab notifications aren't supported), and needs iOS 16.4+.
