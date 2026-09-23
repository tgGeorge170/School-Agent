// Native (APK) side: reminders are scheduled on the device as exact alarms
// instead of arriving as web push, so they fire on time with the app closed.
import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { App } from "@capacitor/app";
import { DEFAULT_SETTINGS, remindersForDate } from "../../worker/src/reminders.js";
import { addDays, localParts } from "../../worker/src/time.js";

const SETTINGS_KEY = "cncPushSettings";
const ENABLED_KEY = "cncNativeReminders";
const CHANNEL = "reminders";
const DAYS_AHEAD = 45;
const TEST_ID = 2000000000;

function loadJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch (e) {
    return fallback;
  }
}

// Stable positive 31-bit id per reminder, so rescheduling replaces instead of duplicating.
function idFor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return (h >>> 0) % 1999999999 + 1;
}

async function saveFile(filename, content) {
  const { uri } = await Filesystem.writeFile({ path: filename, data: content, directory: Directory.Cache, encoding: Encoding.UTF8 });
  await Share.share({ title: filename, files: [uri] });
}

function record() {
  return {
    settings: { ...DEFAULT_SETTINGS, ...loadJson(SETTINGS_KEY, {}) },
    schedule: { days: window.SCHEDULE, periods: window.PERIOD_TIMES },
    tests: loadJson("cncJournalTests", []),
    tasks: loadJson("cncJournalTasks", []),
  };
}

function upcoming(now) {
  const rec = record();
  const today = localParts(now).date;
  const list = [];
  for (let i = 0; i < DAYS_AHEAD; i++) list.push(...remindersForDate(rec, addDays(today, i)));
  return list.filter((r) => r.at > now + 5000).sort((a, b) => a.at - b.at).slice(0, 200);
}

async function cancelAll() {
  const { notifications } = await LocalNotifications.getPending();
  const ids = notifications.filter((n) => n.id !== TEST_ID).map((n) => ({ id: n.id }));
  if (ids.length) await LocalNotifications.cancel({ notifications: ids });
}

async function reschedule() {
  await cancelAll();
  if (!localStorage.getItem(ENABLED_KEY)) return [];
  const list = upcoming(Date.now());
  if (list.length) {
    await LocalNotifications.schedule({
      notifications: list.map((r) => ({
        id: idFor(r.id),
        title: r.payload.title,
        body: r.payload.body,
        largeBody: r.payload.body,
        channelId: CHANNEL,
        schedule: { at: new Date(r.at), allowWhileIdle: true },
        extra: { url: r.payload.url },
      })),
    });
  }
  return list;
}

function initUi() {
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
    hintSwipe: $("push-hint-swipe"),
    hintBattery: $("push-hint-battery"),
  };
  if (!el.toggle) return;
  el.brave.hidden = true;
  if ($("push-apk")) $("push-apk").hidden = true;
  if (el.hintSwipe) el.hintSwipe.hidden = true;
  if (el.hintBattery) {
    el.hintBattery.innerHTML =
      "Podsjetnici su zakazani na samom telefonu i stižu i bez interneta. Za svaki slučaj: Podešavanja → Aplikacije → <b>CNC Pomoćnik</b> → Baterija → <b>Neograničeno</b>.";
  }

  let permission = "prompt";
  const fmtWhen = new Intl.DateTimeFormat("sr-Latn", { weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  const enabled = () => !!localStorage.getItem(ENABLED_KEY) && permission === "granted";

  function renderNext(list) {
    el.next.innerHTML = "";
    if (!list.length) return;
    const h = document.createElement("div");
    h.className = "section-heading";
    h.textContent = "Sljedeća obavještenja";
    el.next.appendChild(h);
    list.slice(0, 5).forEach((r) => {
      const div = document.createElement("div");
      div.className = "journal-item";
      const head = document.createElement("div");
      head.className = "journal-item-head";
      const when = document.createElement("span");
      when.className = "journal-date";
      when.textContent = fmtWhen.format(new Date(r.at));
      const title = document.createElement("span");
      title.className = "journal-subject";
      title.textContent = r.payload.title;
      head.append(when, title);
      div.appendChild(head);
      el.next.appendChild(div);
    });
  }

  function render() {
    const on = enabled();
    el.toggle.textContent = on ? "🔕 Isključi obavještenja" : "🔔 Uključi obavještenja";
    el.toggle.classList.toggle("secondary", on);
    el.settings.hidden = !on;
    el.denied.hidden = permission !== "denied";
    if (!on) {
      el.state.textContent = "Isključeno na ovom telefonu.";
      el.next.innerHTML = "";
    }
  }

  let timer = null;
  async function refresh() {
    clearTimeout(timer);
    try {
      const list = await reschedule();
      if (enabled()) {
        el.state.textContent = "✅ Uključeno — podsjetnici su zakazani na telefonu i stižu tačno na vrijeme.";
        renderNext(list);
      }
    } catch (e) {
      el.state.textContent = "⚠️ Zakazivanje nije uspjelo: " + (e && e.message ? e.message : e);
    }
  }
  const refreshSoon = () => {
    clearTimeout(timer);
    timer = setTimeout(refresh, 800);
  };

  async function ensureExact() {
    try {
      const { exact_alarm } = await LocalNotifications.checkExactNotificationSetting();
      if (exact_alarm !== "granted") await LocalNotifications.changeExactNotificationSetting();
    } catch (e) {}
  }

  async function enable() {
    permission = (await LocalNotifications.requestPermissions()).display;
    if (permission !== "granted") return render();
    await ensureExact();
    localStorage.setItem(ENABLED_KEY, "1");
    render();
    await refresh();
  }

  async function disable() {
    localStorage.removeItem(ENABLED_KEY);
    render();
    await refresh();
  }

  function fillSettings() {
    const s = { ...DEFAULT_SETTINGS, ...loadJson(SETTINGS_KEY, {}) };
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
        dailyTime: valid(el.dailyTime.value, DEFAULT_SETTINGS.dailyTime),
        eveningTime: valid(el.eveningTime.value, DEFAULT_SETTINGS.eveningTime),
      })
    );
    refreshSoon();
  }

  async function sendTest() {
    el.test.disabled = true;
    const at = Date.now() + 15000;
    await LocalNotifications.schedule({
      notifications: [{
        id: TEST_ID,
        title: "✅ Obavještenja rade",
        body: "Probno obavještenje, zakazano 15 s nakon dodira.",
        channelId: CHANNEL,
        schedule: { at: new Date(at), allowWhileIdle: true },
        extra: { url: "./#schedule" },
      }],
    });
    const tick = () => {
      const left = Math.ceil((at - Date.now()) / 1000);
      if (left > 0) {
        el.testResult.textContent = `Obavještenje stiže za ${left} s — slobodno zatvori aplikaciju (i prevlačenjem) i zaključaj telefon.`;
        setTimeout(tick, 1000);
      } else {
        el.testResult.textContent = "Trebalo je upravo da stigne.";
        el.test.disabled = false;
      }
    };
    tick();
  }

  el.toggle.addEventListener("click", async () => {
    el.toggle.disabled = true;
    try {
      enabled() ? await disable() : await enable();
    } catch (e) {
      el.state.textContent = "Uključivanje nije uspjelo: " + (e && e.message ? e.message : e);
    }
    el.toggle.disabled = false;
  });
  [el.daily, el.tests, el.tasks, el.dailyTime, el.eveningTime].forEach((i) => i.addEventListener("change", saveSettings));
  el.test.addEventListener("click", () => sendTest().catch((e) => (el.testResult.textContent = String(e))));
  window.addEventListener("journal-changed", (e) => {
    if (/Tests|Tasks/.test(e.detail && e.detail.key)) refreshSoon();
  });
  App.addListener("resume", async () => {
    permission = (await LocalNotifications.checkPermissions()).display;
    render();
    refresh();
  });

  (async () => {
    fillSettings();
    await LocalNotifications.createChannel({
      id: CHANNEL,
      name: "Podsjetnici",
      description: "Raspored, testovi i zadaci",
      importance: 5,
      visibility: 1,
      vibration: true,
    }).catch(() => {});
    permission = (await LocalNotifications.checkPermissions()).display;
    render();
    refresh();
  })();
}

if (Capacitor.isNativePlatform()) {
  window.NativeApp = { saveFile };
  LocalNotifications.addListener("localNotificationActionPerformed", (e) => {
    const url = e.notification && e.notification.extra && e.notification.extra.url;
    if (url && url.includes("#")) location.hash = url.slice(url.indexOf("#"));
  });
  document.addEventListener("DOMContentLoaded", initUi);
}
