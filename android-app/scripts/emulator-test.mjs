// Drives the installed APK on an emulator through the WebView's DevTools socket:
// turns reminders on, checks Android scheduled exact alarms, fires the test.
import { execSync } from "node:child_process";

const PKG = "ba.tggeorge.cncpomocnik";
const sh = (cmd) => execSync(cmd, { encoding: "utf8" }).trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fail = (msg) => { console.error("FAIL:", msg); process.exit(1); };

sh(`adb shell pm grant ${PKG} android.permission.POST_NOTIFICATIONS`);
sh(`adb shell am start -W -n ${PKG}/.MainActivity`);
await sleep(8000);

const pid = sh(`adb shell pidof ${PKG}`);
if (!pid) fail("app not running");
sh(`adb forward tcp:9222 localabstract:webview_devtools_remote_${pid}`);
let target;
for (let i = 0; i < 20 && !target; i++) {
  try {
    const list = await (await fetch("http://127.0.0.1:9222/json")).json();
    target = list.find((t) => t.type === "page");
  } catch {}
  if (!target) await sleep(1000);
}
if (!target) fail("no WebView page");

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
let seq = 0;
const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
const evaluate = (expression) => new Promise((resolve) => {
  const id = ++seq;
  pending.set(id, (d) => resolve(d.result && d.result.result ? d.result.result.value : undefined));
  ws.send(JSON.stringify({ id, method: "Runtime.evaluate", params: { expression, awaitPromise: true, returnByValue: true } }));
});
const text = (sel) => evaluate(`(document.querySelector(${JSON.stringify(sel)})||{}).textContent`);

console.log("native:", await evaluate("!!window.NativeApp"));
console.log("state before:", await text("#push-state"));
await evaluate(`document.querySelector('.tabbar button[data-tab="schedule"]').click()`);
await evaluate(`document.getElementById("push-toggle").click()`);
await sleep(5000);
const state = await text("#push-state");
console.log("state after:", state);
if (!state || !state.startsWith("✅")) fail("reminders not enabled");
console.log("next:", await evaluate(`[...document.querySelectorAll("#push-next .journal-item")].map(e => e.textContent.trim())`));

const alarms = sh(`adb shell dumpsys alarm`).split("\n").filter((l) => l.includes(PKG));
console.log("alarm lines for app:", alarms.length);
console.log(alarms.slice(0, 6).join("\n"));
if (!alarms.some((l) => /RTC_WAKEUP/.test(l))) fail("no RTC_WAKEUP alarms scheduled");
console.log("exact alarm permission:", sh(`adb shell appops get ${PKG} SCHEDULE_EXACT_ALARM`) || "(default)");

// Test notification: 15 s, with the app sent to background.
await evaluate(`document.getElementById("push-test").click()`);
await sleep(1500);
console.log("test:", await text("#push-test-result"));
sh(`adb shell input keyevent KEYCODE_HOME`);
await sleep(22000);
const notif = sh(`adb shell dumpsys notification --noredact`);
const shown = notif.includes("Obavještenja rade") || notif.includes("Obavje");
console.log("test notification posted while in background:", shown);
if (!shown) fail("test notification not posted");
ws.close();
console.log("EMULATOR TEST PASSED");
