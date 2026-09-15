// Serbian text-to-speech engine.
//
// Uses the browser's built-in Web Speech API: free, no API key, no account,
// works in Chrome/Edge on a laptop and in Chrome/Safari on a phone. The
// quality depends on which voices the device has installed, so this module
// picks the best Serbian-sounding voice it can find and adapts the text when
// only a foreign voice is available.
const Voice = (function () {
  const LS_KEY = "cnc-voice-settings";
  const CHUNK_HEARTBEAT_MS = 9000;

  const defaults = { voiceURI: "", rate: 0.95, pitch: 1.0, adapt: true };
  let settings = Object.assign({}, defaults);
  try {
    Object.assign(settings, JSON.parse(localStorage.getItem(LS_KEY) || "{}"));
  } catch (e) { /* ignore corrupted settings */ }

  let voices = [];
  let heartbeat = null;
  let queue = [];
  let index = 0;
  let listeners = {};
  let state = "idle"; // idle | speaking | paused

  const supported = typeof speechSynthesis !== "undefined" && typeof SpeechSynthesisUtterance !== "undefined";

  // ---------- voice discovery ----------

  function baseLang(v) {
    return String(v.lang || "").toLowerCase().replace("_", "-").split("-")[0];
  }

  // Higher is better. Serbian first, then the languages that share its
  // phonetics almost exactly, then other Slavic languages, then anything.
  function score(v) {
    const base = baseLang(v);
    const name = String(v.name || "").toLowerCase();
    let s;
    if (base === "sr") s = 100;
    else if (base === "hr" || base === "bs" || base === "sh" || base === "cnr") s = 90;
    else if (base === "sl" || base === "mk") s = 70;
    else if (["bg", "cs", "sk", "pl", "ru", "uk"].indexOf(base) !== -1) s = 45;
    else if (["it", "ro", "es", "pt"].indexOf(base) !== -1) s = 25;
    else if (base === "de") s = 20;
    else s = 10;
    // Microsoft's "Natural"/"Online" voices and Google's network voices sound
    // dramatically better than the old local ones.
    if (name.indexOf("natural") !== -1 || name.indexOf("online") !== -1) s += 4;
    if (name.indexOf("google") !== -1) s += 2;
    return s;
  }

  function isSouthSlavic(v) {
    return v && ["sr", "hr", "bs", "sh", "cnr", "sl", "mk"].indexOf(baseLang(v)) !== -1;
  }

  function loadVoices() {
    return new Promise((resolve) => {
      if (!supported) return resolve([]);
      const got = speechSynthesis.getVoices();
      if (got && got.length) { voices = got; return resolve(voices); }
      let tries = 0;
      const tick = () => {
        const list = speechSynthesis.getVoices();
        if (list && list.length) { voices = list; resolve(voices); return; }
        if (++tries > 20) { resolve(voices); return; }
        setTimeout(tick, 100);
      };
      speechSynthesis.addEventListener("voiceschanged", () => {
        voices = speechSynthesis.getVoices() || [];
        resolve(voices);
      }, { once: true });
      tick();
    });
  }

  function sortedVoices() {
    return voices.slice().sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name));
  }

  function currentVoice() {
    if (!voices.length) return null;
    if (settings.voiceURI) {
      const picked = voices.filter((v) => v.voiceURI === settings.voiceURI)[0];
      if (picked) return picked;
    }
    return sortedVoices()[0] || null;
  }

  // ---------- text -> speech text ----------

  const LETTERS = {
    A: "a", B: "be", C: "ce", D: "de", E: "e", F: "ef", G: "ge", H: "ha",
    I: "i", J: "jot", K: "ka", L: "el", M: "em", N: "en", O: "o", P: "pe",
    Q: "ku", R: "er", S: "es", T: "te", U: "u", V: "ve", W: "duplo ve",
    X: "iks", Y: "ipsilon", Z: "zet",
  };
  const DIGITS = ["nula", "jedan", "dva", "tri", "četiri", "pet", "šest", "sedam", "osam", "devet"];

  const ABBREV = [
    [/\bnpr\./gi, "na primjer"],
    [/\btj\./gi, "to jest"],
    [/\bitd\./gi, "i tako dalje"],
    [/\btzv\./gi, "takozvani"],
    [/\bsl\./gi, "slično"],
    [/\bbr\./gi, "broj"],
    [/\bstr\./gi, "strana"],
    [/\bcca\b/gi, "otprilike"],
    [/\bmin\./gi, "minuta"],
  ];

  const UNITS = [
    [/\bmm\s*\/\s*min\b/gi, "milimetara u minuti"],
    [/\bm\s*\/\s*min\b/gi, "metara u minuti"],
    [/\bmm\s*\/\s*(o|obr|rev)\b/gi, "milimetara po obrtaju"],
    [/\bmm\s*\/\s*(z|zub|tooth)\b/gi, "milimetara po zubu"],
    [/\bob\s*\/\s*min\b/gi, "obrtaja u minuti"],
    [/\bo\s*\/\s*min\b/gi, "obrtaja u minuti"],
    [/\bmm2\b|\bmm²/gi, "kvadratnih milimetara"],
    [/\bmm\b/gi, "milimetara"],
    [/\bcm\b/gi, "centimetara"],
    [/\bkW\b/g, "kilovata"],
    [/\bkN\b/g, "kilonjutna"],
    [/\bNm\b/g, "njutn metara"],
    [/\bMPa\b/g, "megapaskala"],
    [/\bbar\b/gi, "bara"],
    [/\bkg\b/gi, "kilograma"],
    [/°\s*C/g, " stepeni celzijusa"],
    [/°/g, " stepeni"],
    [/%/g, " posto"],
    [/[ØøΦφ]/g, "prečnika "],
    [/≈/g, " približno "],
    [/×/g, " puta "],
  ];

  const ACRONYMS = [
    [/\bCNC\b/g, "Ce En Ce"],
    [/\bNUMA\b/g, "numa"],
    [/\bHSS\b/g, "Ha Es Es"],
    [/\bCAD\b/g, "kad"],
    [/\bCAM\b/g, "kam"],
    [/\bISO\b/g, "iso"],
    [/\bRPM\b/g, "obrtaja u minuti"],
    [/\bPDV\b/g, "Pe De Ve"],
    [/\bDIN\b/g, "din"],
  ];

  // "G01" -> "ge nula jedan", "M30" -> "em tri nula", "T3" -> "te tri".
  function spellCode(letter, digits, decimals) {
    let out = LETTERS[letter.toUpperCase()] || letter;
    for (let i = 0; i < digits.length; i++) out += " " + DIGITS[+digits[i]];
    if (decimals) {
      out += " tačka";
      for (let i = 0; i < decimals.length; i++) out += " " + DIGITS[+decimals[i]];
    }
    return out;
  }

  function forSpeech(text) {
    let s = " " + String(text || "") + " ";
    ABBREV.forEach((r) => { s = s.replace(r[0], r[1]); });
    ACRONYMS.forEach((r) => { s = s.replace(r[0], r[1]); });
    // G/M/T codes and axis words used as machine addresses.
    s = s.replace(/\b([GMT])(\d{1,3})(?:\.(\d))?\b/g, (m, l, d, dec) => spellCode(l, d, dec));
    s = s.replace(/\b([XYZIJKFSRHDPQ])(-?\d+(?:[.,]\d+)?)\b/g, (m, l, num) => {
      return (LETTERS[l] || l) + " " + num.replace("-", "minus ").replace(".", ",");
    });
    UNITS.forEach((r) => { s = s.replace(r[0], r[1]); });
    // Decimal points read better as the Serbian comma.
    s = s.replace(/(\d)\.(\d)/g, "$1,$2");
    s = s.replace(/\s+/g, " ").trim();
    return s;
  }

  // When only a foreign voice exists, respell Serbian so it still comes out
  // close enough to follow. Better a Serbian word with an accent than a
  // Serbian word read as if it were English.
  // Single-pass digraph-aware respelling: rules never re-match their own
  // output, which a chain of .replace() calls would do ("č"->"ch"->"tsh").
  function respell(text, map) {
    const keys = Object.keys(map).sort((a, b) => b.length - a.length);
    let out = "";
    let i = 0;
    while (i < text.length) {
      let hit = null;
      for (let k = 0; k < keys.length; k++) {
        const key = keys[k];
        if (text.substr(i, key.length).toLowerCase() === key) { hit = key; break; }
      }
      if (hit) {
        const src = text.substr(i, hit.length);
        let rep = map[hit];
        if (src[0] === src[0].toUpperCase() && src[0] !== src[0].toLowerCase()) {
          rep = rep.charAt(0).toUpperCase() + rep.slice(1);
        }
        out += rep;
        i += hit.length;
      } else {
        out += text[i];
        i++;
      }
    }
    return out;
  }

  // Serbian letters a foreign engine cannot pronounce, respelled in that
  // engine's own orthography. Better an accent than an English reading.
  const APPROX = {
    en: { "dž": "j", "đ": "j", "nj": "ny", "lj": "ly", "č": "ch", "ć": "ch",
          "š": "sh", "ž": "zh", "c": "ts", "j": "y" },
    de: { "dž": "dsch", "đ": "dsch", "č": "tsch", "ć": "tsch", "š": "sch",
          "ž": "sch", "c": "z", "v": "w" },
    it: { "dž": "gi", "đ": "gi", "č": "ci", "ć": "ci", "š": "sci", "ž": "j",
          "c": "z", "h": "c" },
  };
  const STRIP = { "č": "c", "ć": "c", "š": "s", "ž": "z", "đ": "dj" };

  const CYR = { a:"а",b:"б",c:"ц",d:"д",e:"е",f:"ф",g:"г",h:"х",i:"и",j:"ј",k:"к",
                l:"л",m:"м",n:"н",o:"о",p:"п",r:"р",s:"с",t:"т",u:"у",v:"в",z:"з",
                "č":"ч","ć":"ћ","š":"ш","ž":"ж","đ":"ђ" };

  function toCyrillic(text) {
    let s = String(text).replace(/dž/gi, "џ").replace(/lj/gi, "љ").replace(/nj/gi, "њ");
    return s.replace(/[a-zčćšžđ]/gi, (ch) => {
      const lower = ch.toLowerCase();
      const mapped = CYR[lower];
      if (!mapped) return ch;
      return ch === lower ? mapped : mapped.toUpperCase();
    });
  }

  function adaptTo(text, voice) {
    if (!voice) return text;
    const base = baseLang(voice);
    if (base === "sr") {
      // A few Serbian engines are Cyrillic-only and stumble over Latin text.
      const name = String(voice.name || "").toLowerCase();
      const wantsCyrillic = /cyrl|ћир|cyrillic/.test(name) || /cyrl/i.test(voice.lang || "");
      return wantsCyrillic ? toCyrillic(text) : text;
    }
    if (isSouthSlavic(voice)) return text; // hr/bs/sl/mk read Serbian Latin as-is
    if (!settings.adapt) return text;
    return respell(text, APPROX[base] || STRIP);
  }

  // ---------- sentence splitting ----------

  const NO_SPLIT = ["npr", "tj", "itd", "tzv", "sl", "br", "str", "min", "cca",
                    "dr", "mr", "god", "tzv", "od", "sc"];

  function splitSentences(text) {
    const s = String(text || "").trim();
    if (!s) return [];
    const out = [];
    let buf = "";
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      buf += ch;
      if (ch === "." || ch === "!" || ch === "?" || ch === ":") {
        const prev = s[i - 1] || "";
        const next = s[i + 1] || " ";
        const afterNext = s[i + 2] || "";
        // Don't break inside 12.5 or after a single capital initial.
        if (/\d/.test(prev) && /\d/.test(next)) continue;
        if (/\s/.test(next) || next === "") {
          if (ch === "." && /[A-ZČĆŠŽĐ]/.test(prev) && /[a-zčćšžđ]/.test(afterNext)) continue;
          const lastWord = (buf.slice(0, -1).match(/[\wčćšžđČĆŠŽĐ]+$/) || [""])[0];
          // "npr." and G-code decimals like "X50." are not sentence ends.
          if (ch === "." && NO_SPLIT.indexOf(lastWord.toLowerCase()) !== -1) continue;
          if (ch === "." && /^[A-Z]-?\d+$/.test(lastWord)) continue;
          out.push(buf.trim());
          buf = "";
        }
      }
    }
    if (buf.trim()) out.push(buf.trim());
    return out;
  }

  // ---------- playback ----------

  function emit(name, payload) {
    (listeners[name] || []).forEach((fn) => fn(payload));
  }

  function on(name, fn) {
    (listeners[name] = listeners[name] || []).push(fn);
    return () => { listeners[name] = listeners[name].filter((f) => f !== fn); };
  }

  function startHeartbeat() {
    stopHeartbeat();
    // Desktop Chrome silently stops speaking after ~15 s; a pause/resume pair
    // keeps the queue alive.
    heartbeat = setInterval(() => {
      if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        speechSynthesis.resume();
      }
    }, CHUNK_HEARTBEAT_MS);
  }

  function stopHeartbeat() {
    if (heartbeat) { clearInterval(heartbeat); heartbeat = null; }
  }

  function speakCurrent() {
    if (index >= queue.length) {
      state = "idle";
      stopHeartbeat();
      emit("end");
      return;
    }
    const item = queue[index];
    const voice = currentVoice();
    const u = new SpeechSynthesisUtterance(adaptTo(forSpeech(item.text), voice));
    // A voice object can go stale when the device reloads its voice list;
    // assigning it then throws, and speaking in the default voice beats
    // silence.
    try {
      if (voice) { u.voice = voice; u.lang = voice.lang; }
      else u.lang = "sr-RS";
    } catch (e) { u.lang = "sr-RS"; }
    u.rate = settings.rate;
    u.pitch = settings.pitch;
    u.onend = () => {
      if (state !== "speaking") return;
      index++;
      speakCurrent();
    };
    u.onerror = (e) => {
      if (e && (e.error === "interrupted" || e.error === "canceled")) return;
      state = "idle";
      stopHeartbeat();
      emit("error", e);
    };
    emit("chunk", { index: index, item: item, total: queue.length });
    speechSynthesis.speak(u);
  }

  function play(items) {
    if (!supported) { emit("unsupported"); return false; }
    stop();
    queue = (items || []).filter((it) => it && String(it.text || "").trim());
    index = 0;
    if (!queue.length) return false;
    state = "speaking";
    emit("start", { total: queue.length });
    startHeartbeat();
    speakCurrent();
    return true;
  }

  function stop() {
    state = "idle";
    stopHeartbeat();
    if (supported) speechSynthesis.cancel();
    queue = [];
    index = 0;
    emit("stop");
  }

  function pause() {
    if (!supported || state !== "speaking") return;
    speechSynthesis.pause();
    state = "paused";
    emit("pause");
  }

  function resume() {
    if (!supported || state !== "paused") return;
    speechSynthesis.resume();
    state = "speaking";
    emit("resume");
  }

  function toggle() {
    if (state === "speaking") pause();
    else if (state === "paused") resume();
  }

  function jump(delta) {
    if (!queue.length) return;
    const target = Math.max(0, Math.min(queue.length - 1, index + delta));
    index = target;
    speechSynthesis.cancel();
    if (state === "paused") state = "speaking";
    if (state !== "speaking") { state = "speaking"; startHeartbeat(); }
    speakCurrent();
  }

  function save() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(settings)); } catch (e) { /* private mode */ }
  }

  function set(patch) {
    Object.assign(settings, patch);
    save();
    emit("settings", settings);
  }

  return {
    supported: supported,
    load: loadVoices,
    voices: () => sortedVoices(),
    voice: currentVoice,
    isGoodVoice: () => isSouthSlavic(currentVoice()),
    settings: () => Object.assign({}, settings),
    set: set,
    splitSentences: splitSentences,
    forSpeech: forSpeech,
    play: play,
    stop: stop,
    pause: pause,
    resume: resume,
    toggle: toggle,
    jump: jump,
    state: () => state,
    on: on,
  };
})();
