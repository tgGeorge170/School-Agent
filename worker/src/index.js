// Tiny Cloudflare Worker backing the app's optional phone push reminders.
//
// It knows about exactly two things, both scoped per anonymous deviceId:
//   - a Web Push subscription (from PushManager.subscribe() on the phone)
//   - a slimmed-down copy of that device's tests: { id, subject, date, note }
//
// A daily cron job walks every device's tests and pushes a reminder for
// anything 2 days out or due today. No accounts, no auth beyond an
// unguessable deviceId — appropriate for a personal/class tool, not a
// public service. See ../README.md for deployment steps.

import { buildPushPayload } from "@block65/webcrypto-web-push";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

function vapidFromEnv(env) {
  return {
    subject: env.VAPID_SUBJECT,
    publicKey: env.VAPID_PUBLIC_KEY,
    privateKey: env.VAPID_PRIVATE_KEY,
  };
}

async function handleSubscribe(request, env) {
  const body = await request.json();
  const { deviceId, subscription } = body || {};
  if (!deviceId || !subscription || !subscription.endpoint) {
    return json({ error: "Missing deviceId or subscription" }, 400);
  }
  await env.CNC_PUSH.put(`sub:${deviceId}`, JSON.stringify(subscription));
  return json({ ok: true });
}

async function handleUnsubscribe(request, env) {
  const body = await request.json();
  const { deviceId } = body || {};
  if (!deviceId) return json({ error: "Missing deviceId" }, 400);
  await env.CNC_PUSH.delete(`sub:${deviceId}`);
  await env.CNC_PUSH.delete(`tests:${deviceId}`);
  return json({ ok: true });
}

async function handleTests(request, env) {
  const body = await request.json();
  const { deviceId, tests } = body || {};
  if (!deviceId || !Array.isArray(tests)) {
    return json({ error: "Missing deviceId or tests" }, 400);
  }
  // Keep only what a reminder needs — no other journal data is ever sent
  // by the client, but slim it server-side too as a second safety net.
  const slim = tests
    .filter((t) => t && t.date)
    .map((t) => ({
      id: String(t.id || ""),
      subject: String(t.subject || "").slice(0, 200),
      date: String(t.date).slice(0, 10),
      note: String(t.note || "").slice(0, 500),
    }));
  await env.CNC_PUSH.put(`tests:${deviceId}`, JSON.stringify(slim));
  return json({ ok: true, count: slim.length });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }
    const url = new URL(request.url);
    try {
      if (request.method === "GET" && url.pathname === "/") {
        return json({ ok: true, service: "cnc-pomocnik-push" });
      }
      if (request.method === "POST" && url.pathname === "/api/subscribe") {
        return await handleSubscribe(request, env);
      }
      if (request.method === "POST" && url.pathname === "/api/unsubscribe") {
        return await handleUnsubscribe(request, env);
      }
      if (request.method === "POST" && url.pathname === "/api/tests") {
        return await handleTests(request, env);
      }
      return json({ error: "Not found" }, 404);
    } catch (err) {
      return json({ error: String((err && err.message) || err) }, 500);
    }
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(sendDueReminders(env));
  },
};

// Whole calendar days between two YYYY-MM-DD strings, compared as UTC
// midnights. The cron fires at 06:00 UTC — safely past local midnight in
// Europe/Sarajevo (UTC+1/+2) year-round — so the UTC calendar date always
// matches the student's local calendar date at that point in the morning.
function daysUntil(dateIso, todayIso) {
  const MS_PER_DAY = 86400000;
  const target = Date.parse(dateIso + "T00:00:00Z");
  const today = Date.parse(todayIso + "T00:00:00Z");
  return Math.round((target - today) / MS_PER_DAY);
}

function todayIsoUtc() {
  return new Date().toISOString().slice(0, 10);
}

async function sendDueReminders(env) {
  const vapid = vapidFromEnv(env);
  const today = todayIsoUtc();
  let cursor;

  do {
    const page = await env.CNC_PUSH.list({ prefix: "tests:", cursor });

    for (const key of page.keys) {
      const deviceId = key.name.slice("tests:".length);
      const testsRaw = await env.CNC_PUSH.get(key.name);
      if (!testsRaw) continue;

      let tests;
      try {
        tests = JSON.parse(testsRaw);
      } catch (e) {
        continue;
      }

      const due = tests.filter((t) => {
        const d = daysUntil(t.date, today);
        return d === 2 || d === 0;
      });
      if (due.length === 0) continue;

      const subRaw = await env.CNC_PUSH.get(`sub:${deviceId}`);
      if (!subRaw) continue;
      const subscription = JSON.parse(subRaw);

      for (const t of due) {
        const d = daysUntil(t.date, today);
        const title = `📝 ${t.subject || "Test"}`;
        const body =
          d === 0
            ? `Danas je test${t.note ? " — " + t.note : ""}.`
            : `Test za 2 dana (${t.date})${t.note ? " — " + t.note : ""}.`;

        const message = {
          data: JSON.stringify({ title, body, url: "./index.html" }),
          options: { ttl: 60 * 60 * 24, urgency: "high" },
        };

        try {
          const payload = await buildPushPayload(message, subscription, vapid);
          const res = await fetch(subscription.endpoint, payload);
          if (res.status === 404 || res.status === 410) {
            // Subscription expired or was revoked on the client — stop
            // trying and clean it up.
            await env.CNC_PUSH.delete(`sub:${deviceId}`);
          }
        } catch (err) {
          console.error("push failed for device", deviceId, err);
        }
      }
    }

    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
}
