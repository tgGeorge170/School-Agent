// Optional phone push notifications for upcoming tests, backed by a small
// Cloudflare Worker (see worker/README.md for how to deploy it).
//
// This is fully opt-in and does nothing until:
//   1. PUSH_API_BASE below is filled in (after `wrangler deploy`), and
//   2. the student taps the "Omogući podsjetnike" button in Dnevnik → Testovi.
//
// Only a test's subject/date/note ever leaves the device, and only after
// that opt-in — never notes or grades, which stay entirely in localStorage
// as before. Unsubscribing (or the button never being tapped) means nothing
// is ever sent.

// TODO after deploying the worker: paste its URL here, e.g.
// "https://cnc-pomocnik-push.<your-subdomain>.workers.dev" (no trailing slash).
const PUSH_API_BASE = "";

// Must match VAPID_PUBLIC_KEY in worker/wrangler.toml — this is the public
// half of the key pair, safe to ship in client code.
const VAPID_PUBLIC_KEY = "BGowme9gW7VoopuxI151WN_Oq7pirXETfCeoMnLrAq-jTrK3lqjAd2TPKkalUn74B4PY3g7HD4ZZbL9-tdzeydQ";

const PUSH_TESTS_KEY = "cncJournalTests"; // must match journal.js's TESTS_KEY
const DEVICE_ID_KEY = "cncPushDeviceId";
const PUSH_ENABLED_KEY = "cncPushEnabled";

(function () {
  const btn = document.getElementById("push-toggle-btn");
  const statusEl = document.getElementById("push-status");
  if (!btn) return; // markup not present on this page

  const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

  function deviceId() {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  }

  function isEnabled() {
    return localStorage.getItem(PUSH_ENABLED_KEY) === "1";
  }

  // Standard VAPID key conversion: base64url -> Uint8Array, as required by
  // PushManager.subscribe's applicationServerKey option.
  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    const output = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) output[i] = rawData.charCodeAt(i);
    return output;
  }

  function currentTests() {
    try {
      return JSON.parse(localStorage.getItem(PUSH_TESTS_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  async function apiPost(path, body) {
    const res = await fetch(PUSH_API_BASE + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Server je odgovorio sa " + res.status);
    return res.json().catch(() => ({}));
  }

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function setEnabledUi(enabled) {
    btn.textContent = enabled ? "🔕 Isključi podsjetnike" : "🔔 Omogući podsjetnike na telefon";
    btn.classList.toggle("active", enabled);
  }

  // Best-effort background sync — never blocks or surfaces errors to the
  // user, since it's not core app function (the journal itself stays fully
  // local either way).
  async function syncTests(tests) {
    if (!isEnabled() || !PUSH_API_BASE) return;
    try {
      await apiPost("/api/tests", { deviceId: deviceId(), tests: tests || currentTests() });
    } catch (e) {
      console.warn("Sinhronizacija testova nije uspjela:", e);
    }
  }

  async function subscribe() {
    if (!PUSH_API_BASE) {
      setStatus("Server za podsjetnike još nije podešen (vidi worker/README.md).");
      return;
    }
    if (!supported) {
      setStatus("Ovaj uređaj ne podržava push notifikacije. Na iPhone-u prvo dodaj aplikaciju na Home Screen (Add to Home Screen), pa probaj ponovo.");
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("Dozvola za notifikacije nije odobrena.");
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
      }
      await apiPost("/api/subscribe", { deviceId: deviceId(), subscription: sub.toJSON() });
      await syncTests();
      localStorage.setItem(PUSH_ENABLED_KEY, "1");
      setEnabledUi(true);
      setStatus("Podsjetnici uključeni — dobićeš obavještenje 2 dana prije testa i na dan testa.");
    } catch (e) {
      console.error(e);
      setStatus("Nije uspjelo uključivanje podsjetnika: " + e.message);
    }
  }

  async function unsubscribe() {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) await sub.unsubscribe();
      if (PUSH_API_BASE) await apiPost("/api/unsubscribe", { deviceId: deviceId() });
    } catch (e) {
      console.warn(e);
    } finally {
      localStorage.setItem(PUSH_ENABLED_KEY, "0");
      setEnabledUi(false);
      setStatus("Podsjetnici isključeni.");
    }
  }

  btn.addEventListener("click", () => {
    if (isEnabled()) unsubscribe();
    else subscribe();
  });

  document.addEventListener("cncTestsChanged", (e) => syncTests(e.detail));

  // Reflect existing state on load.
  const wasEnabled = isEnabled();
  setEnabledUi(wasEnabled);
  if (!supported) {
    setStatus("Push notifikacije nisu podržane u ovom browseru/na ovom uređaju.");
  } else if (!PUSH_API_BASE) {
    setStatus("Podsjetnici još nisu podešeni (potreban je Cloudflare Worker — vidi worker/README.md).");
  } else if (wasEnabled) {
    setStatus("Podsjetnici uključeni — dobićeš obavještenje 2 dana prije testa i na dan testa.");
  }
})();
