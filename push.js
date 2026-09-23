// Push notifications: subscribes this device to the school-agent-push Worker
// and keeps it in sync with the schedule, tests and tasks so the server can
// send reminders while the app is closed.
(function () {
  const PUSH = self.PUSH_CONFIG;
  const SETTINGS_KEY = "cncPushSettings";
  const DEFAULTS = { daily: true, dailyTime: "10:50", tests: true, tasks: true, eveningTime: "19:00" };

  const $ = (id) => document.getElementById(id);
  const el = {
    state: $("push-state"),
    toggle: $("push-toggle"),
    settings: $("push-settings"),
    brave: $("push-brave"),
    denied: $("push-denied"),
    daily: $("push-daily"),
    tests: $("push-tests"),
    tasks: $("push-tasks"),
    dailyTime: $("push-daily-time"),
    eveningTime: $("push-evening-time"),
    test: $("push-test"),
    testResult: $("push-test-result"),
    next: $("push-next"),
  };
  if (!el.toggle) return;

  let ready;
  let permission = "default";
  const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  let subscription = null;
  let syncTimer = null;
  let lastSyncAt = 0;
  let dirty = false;

  function loadJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (e) {
      return fallback;
    }
  }
  const settings = () => ({ ...DEFAULTS, ...loadJson(SETTINGS_KEY, {}) });

  function keyBytes(b64) {
    const pad = "=".repeat((4 - (b64.length % 4)) % 4);
    const raw = atob((b64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
    return Uint8Array.from(raw, (c) => c.charCodeAt(0));
  }
  function sameKey(buf) {
    if (!buf) return true;
    const a = new Uint8Array(buf);
    const b = keyBytes(PUSH.vapidPublicKey);
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }

  async function api(path, body) {
    const res = await fetch(PUSH.workerUrl + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
  }

  function payload() {
    return {
      subscription: subscription.toJSON(),
      settings: settings(),
      schedule: { days: SCHEDULE, periods: PERIOD_TIMES },
      tests: loadJson("cncJournalTests", []),
      tasks: loadJson("cncJournalTasks", []),
    };
  }

  const fmtWhen = new Intl.DateTimeFormat("sr-Latn", {
    timeZone: "Europe/Sarajevo",
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  function renderNext(next) {
    el.next.innerHTML = "";
    if (!next || !next.length) return;
    const h = document.createElement("div");
    h.className = "section-heading";
    h.textContent = "Sljedeća obavještenja";
    el.next.appendChild(h);
    next.forEach((n) => {
      const div = document.createElement("div");
      div.className = "journal-item";
      const head = document.createElement("div");
      head.className = "journal-item-head";
      const when = document.createElement("span");
      when.className = "journal-date";
      when.textContent = fmtWhen.format(new Date(n.at));
      const title = document.createElement("span");
      title.className = "journal-subject";
      title.textContent = n.title;
      head.append(when, title);
      div.appendChild(head);
      el.next.appendChild(div);
    });
  }

  async function readPermission() {
    try {
      const state = (await navigator.permissions.query({ name: "notifications" })).state;
      permission = state === "prompt" ? "default" : state;
    } catch (e) {
      permission = Notification.permission;
    }
    return permission;
  }

  function render() {
    const enabled = !!subscription && permission === "granted";
    el.toggle.textContent = enabled ? "🔕 Isključi obavještenja" : "🔔 Uključi obavještenja";
    el.toggle.classList.toggle("secondary", enabled);
    el.settings.hidden = !enabled;
    el.denied.hidden = permission !== "denied";
    if (!enabled) {
      el.state.textContent = "Isključeno na ovom telefonu.";
      el.next.innerHTML = "";
    }
  }

  async function sync() {
    clearTimeout(syncTimer);
    if (!subscription) return;
    dirty = false;
    try {
      const { status, data } = await api("/api/subscribe", payload());
      if (status !== 200) throw new Error(data.error || status);
      lastSyncAt = Date.now();
      el.state.textContent = "✅ Uključeno — stižu i kad je aplikacija zatvorena.";
      renderNext(data.next);
    } catch (e) {
      dirty = true;
      el.state.textContent = "⚠️ Uključeno, ali server trenutno nije dostupan — sinhronizovaću čim bude internet.";
    }
  }
  function syncSoon() {
    dirty = true;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(sync, 1500);
  }

  async function registration() {
    return Promise.race([
      navigator.serviceWorker.ready,
      new Promise((_, reject) => setTimeout(() => reject(new Error("sw timeout")), 10000)),
    ]);
  }

  async function subscribe(reg) {
    return reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(PUSH.vapidPublicKey) });
  }

  async function enable() {
    permission = await Notification.requestPermission();
    if (permission !== "granted") {
      render();
      return;
    }
    el.state.textContent = "Uključujem…";
    const reg = await registration();
    subscription = (await reg.pushManager.getSubscription()) || (await subscribe(reg));
    render();
    await sync();
  }

  async function disable() {
    const sub = subscription;
    subscription = null;
    render();
    try {
      await api("/api/unsubscribe", { endpoint: sub.endpoint });
    } catch (e) {}
    await sub.unsubscribe().catch(() => {});
  }

  function fillSettings() {
    const s = settings();
    el.daily.checked = s.daily;
    el.tests.checked = s.tests;
    el.tasks.checked = s.tasks;
    el.dailyTime.value = s.dailyTime;
    el.eveningTime.value = s.eveningTime;
  }
  function saveSettings() {
    const valid = (v, d) => (/^\d{2}:\d{2}$/.test(v) ? v : d);
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        daily: el.daily.checked,
        tests: el.tests.checked,
        tasks: el.tasks.checked,
        dailyTime: valid(el.dailyTime.value, DEFAULTS.dailyTime),
        eveningTime: valid(el.eveningTime.value, DEFAULTS.eveningTime),
      })
    );
    syncSoon();
  }

  // Server waits before sending; meanwhile the user closes the app / locks the phone.
  function testCountdown(seconds) {
    const sentAt = Date.now();
    const tick = () => {
      const left = seconds - Math.floor((Date.now() - sentAt) / 1000);
      if (left > 0) {
        el.testResult.textContent = `Obavještenje stiže za ${left} s — zatvori aplikaciju i zaključaj telefon.`;
        setTimeout(tick, 1000);
        return;
      }
      el.testResult.textContent = "Poslano. Ako nije stiglo dok je aplikacija bila zatvorena, pogledaj upozorenje iznad / podešavanja baterije.";
      setTimeout(checkTestResult, 4000);
    };
    tick();
    setTimeout(() => (el.test.disabled = false), 30000);
  }
  async function checkTestResult() {
    try {
      const { data } = await api("/api/status", { endpoint: subscription.endpoint });
      const last = data.last;
      if (last && last.title === "test" && !(last.status >= 200 && last.status < 300)) {
        el.testResult.textContent = `Push servis je odbio poruku (${last.status}${last.body ? ": " + last.body : ""}).`;
      }
    } catch (e) {}
  }

  async function sendTest() {
    if (!subscription) return;
    el.test.disabled = true;
    el.testResult.textContent = "Šaljem…";
    try {
      if (dirty || !lastSyncAt) await sync();
      const { status, data } = await api("/api/test", { endpoint: subscription.endpoint });
      if (data.ok) {
        testCountdown(data.delaySeconds || 15);
        return;
      } else if (status === 429) {
        el.testResult.textContent = "Sačekaj par sekundi pa probaj ponovo.";
      } else if (status === 404) {
        el.testResult.textContent = "Server nije znao za ovaj telefon — ponovo sam ga prijavio, probaj opet.";
        await sync();
      } else {
        el.testResult.textContent = `Push servis je odbio poruku (${data.status || status}${data.body ? ": " + data.body : ""}).`;
      }
    } catch (e) {
      el.testResult.textContent = "Nema veze sa serverom. Provjeri internet.";
    }
    setTimeout(() => (el.test.disabled = false), 3000);
  }

  async function init() {
    if (!supported) {
      el.state.textContent = "Ovaj pregledač ne podržava obavještenja. Otvori aplikaciju u Chrome-u.";
      el.toggle.hidden = true;
      return;
    }
    if (navigator.brave && (await navigator.brave.isBrave().catch(() => false))) el.brave.hidden = false;
    fillSettings();
    await readPermission();
    try {
      const reg = await registration();
      subscription = await reg.pushManager.getSubscription();
      if (subscription && !sameKey(subscription.options && subscription.options.applicationServerKey)) {
        await subscription.unsubscribe();
        subscription = permission === "granted" ? await subscribe(reg) : null;
      }
    } catch (e) {
      subscription = null;
    }
    if (subscription && permission !== "granted") subscription = null;
    render();
    if (subscription) sync();
  }

  el.toggle.addEventListener("click", async () => {
    el.toggle.disabled = true;
    try {
      await ready;
      subscription ? await disable() : await enable();
    } catch (e) {
      el.state.textContent = "Uključivanje nije uspjelo: " + (e && e.message ? e.message : e);
    }
    el.toggle.disabled = false;
  });
  [el.daily, el.tests, el.tasks, el.dailyTime, el.eveningTime].forEach((input) => input.addEventListener("change", saveSettings));
  el.test.addEventListener("click", sendTest);
  ready = init();
  window.addEventListener("journal-changed", (e) => {
    if (subscription && /Tests|Tasks/.test(e.detail && e.detail.key)) syncSoon();
  });
  window.addEventListener("online", () => dirty && sync());
  document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState !== "visible") return;
    await readPermission();
    render();
    if (subscription && permission === "granted" && (dirty || Date.now() - lastSyncAt > 3600e3)) sync();
  });
})();
