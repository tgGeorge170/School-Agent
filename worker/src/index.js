import { sendWebPush } from "./webpush.js";
import { buildTodayScheduleNotification } from "./schedule.js";

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

async function sha256Hex(text) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function isValidSubscription(sub) {
  return !!(sub && sub.endpoint && sub.keys && sub.keys.p256dh && sub.keys.auth);
}

async function sendDailyNotifications(env, payload) {
  payload = payload || buildTodayScheduleNotification();
  const vapid = {
    vapidSubject: env.VAPID_SUBJECT,
    vapidPublicKey: env.VAPID_PUBLIC_KEY,
    vapidPrivateKey: env.VAPID_PRIVATE_KEY,
  };

  let cursor;
  do {
    const list = await env.CNC_PUSH.list({ cursor });
    for (const key of list.keys) {
      const raw = await env.CNC_PUSH.get(key.name);
      if (!raw) continue;
      const subscription = JSON.parse(raw);
      try {
        const res = await sendWebPush(subscription, payload, vapid);
        if (res.status === 404 || res.status === 410) {
          await env.CNC_PUSH.delete(key.name);
        }
      } catch (err) {
        // Transient failure (network, push service outage) — leave the
        // subscription in place and retry on the next scheduled run.
      }
    }
    cursor = list.list_complete ? undefined : list.cursor;
  } while (cursor);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (url.pathname === "/api/subscribe" && request.method === "POST") {
      let subscription;
      try {
        subscription = await request.json();
      } catch {
        return json({ error: "invalid json" }, 400);
      }
      if (!isValidSubscription(subscription)) {
        return json({ error: "invalid subscription" }, 400);
      }
      const key = await sha256Hex(subscription.endpoint);
      await env.CNC_PUSH.put(key, JSON.stringify(subscription));
      return json({ ok: true });
    }

    if (url.pathname === "/api/unsubscribe" && request.method === "POST") {
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "invalid json" }, 400);
      }
      if (!body || !body.endpoint) {
        return json({ error: "missing endpoint" }, 400);
      }
      const key = await sha256Hex(body.endpoint);
      await env.CNC_PUSH.delete(key);
      return json({ ok: true });
    }

    if (url.pathname === "/api/test-notify" && request.method === "POST") {
      if (request.headers.get("X-Admin-Secret") !== env.ADMIN_SECRET) {
        return json({ error: "forbidden" }, 403);
      }
      await sendDailyNotifications(env);
      return json({ ok: true });
    }

    if (url.pathname === "/" || url.pathname === "/health") {
      return new Response("OK", { headers: CORS_HEADERS });
    }

    return json({ error: "not found" }, 404);
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(sendDailyNotifications(env));
  },
};
