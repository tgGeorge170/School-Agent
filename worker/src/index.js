import { sendWebPush } from "./webpush.js";
import { DEFAULT_SETTINGS, dueReminders, remindersForDate, todayPreview } from "./reminders.js";
import { addDays, localParts } from "./time.js";

// KV layout: sub:<hash> = device record, state:<hash> = sent log + last push
// result, bare <hash> = legacy subscription from the first version.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Admin-Secret",
};
const PUSH_HOSTS = ["googleapis.com", "mozilla.com", "windows.com", "apple.com"];
const MAX_BODY = 64 * 1024;
const TEST_COOLDOWN_MS = 15e3;
const SENT_RETENTION_MS = 4 * 86400e3;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

async function sha256Hex(text) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function validEndpoint(endpoint) {
  try {
    const u = new URL(endpoint);
    return u.protocol === "https:" && PUSH_HOSTS.some((h) => u.hostname === h || u.hostname.endsWith("." + h));
  } catch {
    return false;
  }
}

function validSubscription(sub) {
  return !!(sub && validEndpoint(sub.endpoint) && sub.keys && typeof sub.keys.p256dh === "string" && typeof sub.keys.auth === "string");
}

const str = (v, max = 200) => String(v == null ? "" : v).trim().slice(0, max);
const isDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v);
const isTime = (v) => /^([01]\d|2[0-3]):[0-5]\d$/.test(v);

function cleanSettings(s) {
  const out = { ...DEFAULT_SETTINGS };
  if (!s || typeof s !== "object") return out;
  for (const k of ["daily", "tests", "tasks"]) if (typeof s[k] === "boolean") out[k] = s[k];
  for (const k of ["dailyTime", "eveningTime"]) if (isTime(s[k])) out[k] = s[k];
  return out;
}

function cleanItems(items) {
  if (!Array.isArray(items)) return [];
  return items
    .filter((t) => t && isDate(t.date))
    .slice(0, 300)
    .map((t) => ({ id: str(t.id, 40) || str(t.date), subject: str(t.subject), date: t.date, note: str(t.note), done: !!t.done }));
}

function cleanSchedule(s) {
  if (!s || !Array.isArray(s.days)) return null;
  return {
    days: s.days.slice(0, 7).map((d) => ({ day: str(d && d.day, 20), classes: (Array.isArray(d && d.classes) ? d.classes : []).slice(0, 12).map((c) => str(c)) })),
    periods: (Array.isArray(s.periods) ? s.periods : []).slice(0, 12).map((p) => str(p, 20)),
  };
}

async function readJson(request) {
  const text = await request.text();
  if (text.length > MAX_BODY) throw new Error("too large");
  return JSON.parse(text);
}

async function getRecord(env, hash) {
  const rec = await env.CNC_PUSH.get(`sub:${hash}`, "json");
  if (rec) return rec;
  const legacy = await env.CNC_PUSH.get(hash, "json");
  return legacy ? { subscription: legacy, settings: { ...DEFAULT_SETTINGS }, schedule: null, tests: [], tasks: [] } : null;
}

async function getState(env, hash) {
  return (await env.CNC_PUSH.get(`state:${hash}`, "json")) || { sent: {} };
}

function vapidFrom(env) {
  return { vapidSubject: env.VAPID_SUBJECT, vapidPublicKey: env.VAPID_PUBLIC_KEY, vapidPrivateKey: env.VAPID_PRIVATE_KEY };
}

// Sends one notification; returns a result and whether the subscription is dead.
async function push(env, subscription, payload, opts) {
  try {
    const res = await sendWebPush(subscription, { ...payload, ts: Date.now() }, vapidFrom(env), opts);
    const body = (await res.text().catch(() => "")).slice(0, 300);
    return { status: res.status, body, gone: res.status === 404 || res.status === 410 };
  } catch (err) {
    return { status: 0, body: String(err && err.message ? err.message : err).slice(0, 300), gone: false };
  }
}

async function deleteDevice(env, hash) {
  await Promise.all([env.CNC_PUSH.delete(`sub:${hash}`), env.CNC_PUSH.delete(`state:${hash}`), env.CNC_PUSH.delete(hash)]);
}

function upcoming(record, now, days = 7) {
  const today = localParts(now).date;
  const list = [];
  for (let i = 0; i < days; i++) list.push(...remindersForDate(record, addDays(today, i)));
  return list
    .filter((r) => r.at > now)
    .sort((a, b) => a.at - b.at)
    .slice(0, 5)
    .map((r) => ({ at: r.at, title: r.payload.title }));
}

async function handleSubscribe(request, env) {
  const body = await readJson(request);
  const subscription = body && body.subscription ? body.subscription : body;
  if (!validSubscription(subscription)) return json({ error: "invalid subscription" }, 400);

  const hash = await sha256Hex(subscription.endpoint);
  let prev = await getRecord(env, hash);
  if (!prev && body.oldEndpoint && validEndpoint(body.oldEndpoint)) {
    const oldHash = await sha256Hex(body.oldEndpoint);
    prev = await getRecord(env, oldHash);
    if (prev) {
      const state = await getState(env, oldHash);
      await env.CNC_PUSH.put(`state:${hash}`, JSON.stringify(state));
      await deleteDevice(env, oldHash);
    }
  }
  prev = prev || {};
  const record = {
    subscription: { endpoint: subscription.endpoint, keys: { p256dh: subscription.keys.p256dh, auth: subscription.keys.auth } },
    settings: "settings" in body ? cleanSettings(body.settings) : cleanSettings(prev.settings),
    schedule: "schedule" in body ? cleanSchedule(body.schedule) : prev.schedule || null,
    tests: "tests" in body ? cleanItems(body.tests) : prev.tests || [],
    tasks: "tasks" in body ? cleanItems(body.tasks) : prev.tasks || [],
    updatedAt: Date.now(),
  };
  await env.CNC_PUSH.put(`sub:${hash}`, JSON.stringify(record));
  await env.CNC_PUSH.delete(hash);
  return json({ ok: true, next: upcoming(record, Date.now()) });
}

async function handleStatus(request, env) {
  const body = await readJson(request);
  if (!body || !validEndpoint(body.endpoint)) return json({ error: "missing endpoint" }, 400);
  const hash = await sha256Hex(body.endpoint);
  const record = await getRecord(env, hash);
  if (!record) return json({ registered: false });
  const state = await getState(env, hash);
  return json({ registered: true, settings: cleanSettings(record.settings), last: state.last || null, next: upcoming(record, Date.now()) });
}

async function handleTest(request, env) {
  const body = await readJson(request);
  if (!body || !validEndpoint(body.endpoint)) return json({ error: "missing endpoint" }, 400);
  const hash = await sha256Hex(body.endpoint);
  const record = await getRecord(env, hash);
  if (!record) return json({ error: "not registered" }, 404);
  const state = await getState(env, hash);
  if (state.lastTestAt && Date.now() - state.lastTestAt < TEST_COOLDOWN_MS) return json({ error: "too soon" }, 429);

  const preview = todayPreview(record, Date.now());
  const result = await push(env, record.subscription, { ...preview, title: "✅ Obavještenja rade", body: `${preview.title}\n${preview.body}`, tag: "test" }, { ttl: 600 });
  state.lastTestAt = Date.now();
  state.last = { at: Date.now(), status: result.status, body: result.body, title: "test" };
  if (result.gone) await deleteDevice(env, hash);
  else await env.CNC_PUSH.put(`state:${hash}`, JSON.stringify(state));
  return json({ ok: result.status >= 200 && result.status < 300, status: result.status, body: result.body });
}

async function processDevice(env, hash, now) {
  const record = await getRecord(env, hash);
  if (!record) return [];
  const state = await getState(env, hash);
  const due = dueReminders(record, state.sent, now);
  if (!due.length) return [];

  const results = [];
  for (const r of due) {
    const result = await push(env, record.subscription, r.payload, { ttl: (r.expires - now) / 1000, topic: r.payload.tag });
    results.push({ hash: hash.slice(0, 8), id: r.id, status: result.status, body: result.body });
    if (result.gone) {
      await deleteDevice(env, hash);
      return results;
    }
    if (result.status >= 200 && result.status < 300) state.sent[r.id] = now;
    state.last = { at: now, status: result.status, body: result.body, title: r.payload.title };
  }
  for (const [id, at] of Object.entries(state.sent)) if (now - at > SENT_RETENTION_MS) delete state.sent[id];
  await env.CNC_PUSH.put(`state:${hash}`, JSON.stringify(state));
  return results;
}

async function allDeviceHashes(env) {
  const hashes = new Set();
  let cursor;
  do {
    const list = await env.CNC_PUSH.list({ cursor });
    for (const { name } of list.keys) {
      if (name.startsWith("sub:")) hashes.add(name.slice(4));
      else if (/^[0-9a-f]{64}$/.test(name)) hashes.add(name);
    }
    cursor = list.list_complete ? undefined : list.cursor;
  } while (cursor);
  return [...hashes];
}

async function runReminders(env, now = Date.now()) {
  const hashes = await allDeviceHashes(env);
  const results = await Promise.all(hashes.map((h) => processDevice(env, h, now).catch((e) => [{ hash: h.slice(0, 8), error: String(e) }])));
  const flat = results.flat();
  if (flat.length) console.log(JSON.stringify({ reminders: flat }));
  return flat;
}

async function handleAdminNotify(env) {
  const results = [];
  for (const hash of await allDeviceHashes(env)) {
    const record = await getRecord(env, hash);
    if (!record) continue;
    const result = await push(env, record.subscription, todayPreview(record, Date.now()), { ttl: 3600 });
    results.push({ hash: hash.slice(0, 8), status: result.status, body: result.body });
    if (result.gone) await deleteDevice(env, hash);
  }
  return results;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS_HEADERS });
    if (url.pathname === "/" || url.pathname === "/health") return new Response("OK", { headers: CORS_HEADERS });
    if (url.pathname === "/api/vapid-public-key") return json({ key: env.VAPID_PUBLIC_KEY });
    if (request.method !== "POST") return json({ error: "not found" }, 404);

    try {
      switch (url.pathname) {
        case "/api/subscribe":
          return await handleSubscribe(request, env);
        case "/api/status":
          return await handleStatus(request, env);
        case "/api/test":
          return await handleTest(request, env);
        case "/api/unsubscribe": {
          const body = await readJson(request);
          if (!body || !body.endpoint) return json({ error: "missing endpoint" }, 400);
          await deleteDevice(env, await sha256Hex(body.endpoint));
          return json({ ok: true });
        }
        case "/api/test-notify":
          if (!env.ADMIN_SECRET || request.headers.get("X-Admin-Secret") !== env.ADMIN_SECRET) return json({ error: "forbidden" }, 403);
          return json({ ok: true, results: await handleAdminNotify(env) });
        case "/api/run-reminders":
          if (!env.ADMIN_SECRET || request.headers.get("X-Admin-Secret") !== env.ADMIN_SECRET) return json({ error: "forbidden" }, 403);
          return json({ ok: true, results: await runReminders(env, Number(url.searchParams.get("now")) || Date.now()) });
      }
    } catch (err) {
      return json({ error: "bad request" }, 400);
    }
    return json({ error: "not found" }, 404);
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(runReminders(env, event.scheduledTime || Date.now()));
  },
};
