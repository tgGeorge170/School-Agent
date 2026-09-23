importScripts("push-config.js");

const CACHE_NAME = "cnc-companion-v10";
const ASSETS = [
  "./index.html",
  "./styles.css",
  "./i18n.js",
  "./content-data.js",
  "./journal.js",
  "./voice.js",
  "./lectures-data.js",
  "./lectures.js",
  "./app.js",
  "./push-config.js",
  "./push.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS.map((url) => new Request(url, { cache: "no-store" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME && k !== "push-log").map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first: always prefer the latest deployed files while online (this
// app is under active development), falling back to cache only when offline.
// `cache: "no-store"` is essential here — GitHub Pages sends Cache-Control
// headers, so a plain fetch() can be silently answered from the browser's
// own HTTP cache instead of actually hitting the network.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request, { cache: "no-store" })
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

self.addEventListener("push", (event) => {
  let data = { title: "CNC Školski Pomoćnik", body: "" };
  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch {
      data.body = event.data.text();
    }
  }
  event.waitUntil(
    showAndLog(data, {
      body: data.body,
      icon: "icons/icon-192.png",
      badge: "icons/icon-192.png",
      tag: data.tag,
      renotify: !!data.tag,
      timestamp: data.ts,
      vibrate: [200, 100, 200],
      data: { url: data.url || "./" },
    })
  );
});

// Records each received push (and whether it could be shown) so the app's
// test button can tell "never arrived" apart from "arrived but hidden".
async function showAndLog(data, options) {
  const entry = { at: Date.now(), tag: data.tag || "", shown: true, error: "" };
  try {
    await self.registration.showNotification(data.title, options);
  } catch (e) {
    entry.shown = false;
    entry.error = String(e && e.message ? e.message : e);
  }
  const cache = await caches.open("push-log");
  await cache.put("./__last-push", new Response(JSON.stringify(entry)));
  const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  clients.forEach((c) => c.postMessage({ type: "push-received", entry }));
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL((event.notification.data && event.notification.data.url) || "./", self.registration.scope).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client) return client.navigate(url).then((c) => (c || client).focus());
      }
      return self.clients.openWindow(url);
    })
  );
});

// The browser can rotate a subscription at any time; re-register it so the
// server keeps this device's reminders instead of silently losing them.
self.addEventListener("pushsubscriptionchange", (event) => {
  const key = Uint8Array.from(
    atob((PUSH_CONFIG.vapidPublicKey + "=".repeat((4 - (PUSH_CONFIG.vapidPublicKey.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/")),
    (c) => c.charCodeAt(0)
  );
  event.waitUntil(
    (event.newSubscription
      ? Promise.resolve(event.newSubscription)
      : self.registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key })
    ).then((sub) =>
      fetch(PUSH_CONFIG.workerUrl + "/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub.toJSON(), oldEndpoint: event.oldSubscription && event.oldSubscription.endpoint }),
      })
    )
  );
});
