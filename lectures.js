// Predavanja tab: browse lessons, have them read aloud in Serbian, and read
// any pasted text aloud. Lesson content lives in window.LECTURES (see
// lectures-data.js); everything here works even when that list is empty.
(function () {
  const $ = (id) => document.getElementById(id);
  const root = $("lectures");
  if (!root) return;

  const els = {
    status: $("voice-status"),
    select: $("voice-select"),
    rate: $("voice-rate"),
    rateOut: $("rate-out"),
    pitch: $("voice-pitch"),
    pitchOut: $("pitch-out"),
    adapt: $("voice-adapt"),
    adaptRow: $("voice-adapt-row"),
    testText: $("voice-test-text"),
    testBtn: $("voice-test-btn"),
    settings: $("voice-settings"),
    browse: $("lecture-browse"),
    reader: $("lecture-reader"),
    freeText: $("free-text"),
    freeBtn: $("free-read-btn"),
    player: $("player"),
    pNow: $("player-now"),
    pPlay: $("p-play"),
    pPrev: $("p-prev"),
    pNext: $("p-next"),
    pStop: $("p-stop"),
    pProgress: $("p-progress"),
  };

  let chunks = [];      // [{ text, el }] currently loaded into the player
  let currentLesson = null;

  // ---------- voice settings panel ----------

  function langLabel(v) {
    const base = String(v.lang || "").toLowerCase().split(/[-_]/)[0];
    const names = {
      sr: "srpski", hr: "hrvatski", bs: "bosanski", sh: "srpskohrvatski",
      cnr: "crnogorski", sl: "slovenački", mk: "makedonski", bg: "bugarski",
      ru: "ruski", cs: "češki", sk: "slovački", pl: "poljski", uk: "ukrajinski",
      en: "engleski", de: "njemački", it: "italijanski", fr: "francuski",
      es: "španski", hu: "mađarski", ro: "rumunski", tr: "turski",
    };
    return names[base] || v.lang;
  }

  function fillVoices() {
    const list = Voice.voices();
    els.select.innerHTML = "";
    if (!list.length) {
      const opt = document.createElement("option");
      opt.textContent = "Nema dostupnih glasova";
      els.select.appendChild(opt);
      return;
    }
    const active = Voice.voice();
    list.forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v.voiceURI;
      opt.textContent = v.name + " — " + langLabel(v);
      if (active && v.voiceURI === active.voiceURI) opt.selected = true;
      els.select.appendChild(opt);
    });
  }

  function updateStatus() {
    const v = Voice.voice();
    if (!Voice.supported) {
      els.status.className = "voice-status bad";
      els.status.textContent = "Ovaj pregledač ne podržava čitanje naglas. Otvori aplikaciju u Chrome-u ili Edge-u.";
      return;
    }
    if (!v) {
      els.status.className = "voice-status bad";
      els.status.textContent = "Nijedan glas nije pronađen na ovom uređaju. Vidi uputstvo ispod.";
      return;
    }
    if (Voice.isGoodVoice()) {
      els.status.className = "voice-status good";
      els.status.textContent = "Glas: " + v.name + " (" + langLabel(v) + "). Ovo je naš jezik — izgovor će biti tačan.";
    } else {
      els.status.className = "voice-status warn";
      els.status.textContent = "Na ovom uređaju nema srpskog glasa, pa se koristi " + langLabel(v) +
        ". Razumljivo je, ali izgovor neće biti tačan — uputstvo ispod kaže kako da dodaš srpski glas.";
    }
    els.adaptRow.style.display = Voice.isGoodVoice() ? "none" : "flex";
  }

  function syncSettingsUI() {
    const s = Voice.settings();
    els.rate.value = s.rate;
    els.rateOut.textContent = Number(s.rate).toFixed(2) + "×";
    els.pitch.value = s.pitch;
    els.pitchOut.textContent = Number(s.pitch).toFixed(2);
    els.adapt.checked = !!s.adapt;
  }

  els.select.addEventListener("change", () => {
    Voice.set({ voiceURI: els.select.value });
    updateStatus();
  });
  els.rate.addEventListener("input", () => {
    Voice.set({ rate: parseFloat(els.rate.value) });
    els.rateOut.textContent = parseFloat(els.rate.value).toFixed(2) + "×";
  });
  els.pitch.addEventListener("input", () => {
    Voice.set({ pitch: parseFloat(els.pitch.value) });
    els.pitchOut.textContent = parseFloat(els.pitch.value).toFixed(2);
  });
  els.adapt.addEventListener("change", () => Voice.set({ adapt: els.adapt.checked }));

  els.testBtn.addEventListener("click", () => {
    const text = els.testText.value.trim();
    if (!text) return;
    playText(text, "Proba glasa");
  });

  // ---------- player ----------

  function playText(text, label) {
    const sentences = Voice.splitSentences(text);
    chunks = sentences.map((s) => ({ text: s, el: null }));
    startPlayer(label);
  }

  function showPlayer(visible) {
    els.player.hidden = !visible;
    document.body.classList.toggle("player-open", visible);
  }

  function startPlayer(label) {
    if (!chunks.length) return;
    showPlayer(true);
    els.pNow.textContent = label || "";
    Voice.play(chunks);
  }

  function clearHighlight() {
    root.querySelectorAll(".sent.speaking").forEach((el) => el.classList.remove("speaking"));
  }

  Voice.on("chunk", (info) => {
    showPlayer(true);
    clearHighlight();
    if (info.item.el) {
      info.item.el.classList.add("speaking");
      const rect = info.item.el.getBoundingClientRect();
      if (rect.top < 80 || rect.bottom > window.innerHeight - 160) {
        info.item.el.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
    els.pProgress.textContent = (info.index + 1) + " / " + info.total;
    els.pPlay.textContent = "⏸";
  });
  Voice.on("pause", () => { els.pPlay.textContent = "▶️"; });
  Voice.on("resume", () => { els.pPlay.textContent = "⏸"; });
  Voice.on("end", () => { clearHighlight(); els.pPlay.textContent = "▶️"; });
  Voice.on("stop", () => { clearHighlight(); showPlayer(false); });
  Voice.on("error", () => {
    clearHighlight();
    els.pNow.textContent = "Greška u čitanju — probaj drugi glas u podešavanjima.";
  });

  els.pPlay.addEventListener("click", () => {
    if (Voice.state() === "idle" && chunks.length) startPlayer(els.pNow.textContent);
    else Voice.toggle();
  });
  els.pPrev.addEventListener("click", () => Voice.jump(-1));
  els.pNext.addEventListener("click", () => Voice.jump(1));
  els.pStop.addEventListener("click", () => Voice.stop());

  // ---------- free text reader ----------

  els.freeBtn.addEventListener("click", () => {
    const text = els.freeText.value.trim();
    if (!text) return;
    playText(text, "Tvoj tekst");
  });

  // ---------- lesson browser ----------

  function subjects() {
    return (window.LECTURES || []).slice().sort((a, b) => (a.order || 99) - (b.order || 99));
  }

  function renderBrowse() {
    const list = subjects();
    els.browse.innerHTML = "";
    els.reader.hidden = true;

    if (!list.length) {
      els.browse.innerHTML =
        '<div class="note" style="margin-top:0;">Još nema ubačenih predavanja. ' +
        'Pošalji fotografije svoje sveske i gradivo će se pojaviti ovdje, podijeljeno po predmetima i temama. ' +
        'Dotle, glas možeš isprobati gore, a bilo koji tekst možeš dati na čitanje ispod.</div>';
      return;
    }

    list.forEach((subject) => {
      const details = document.createElement("details");
      details.className = "subject";
      const summary = document.createElement("summary");
      const count = subject.lessons.length;
      summary.textContent = (subject.icon ? subject.icon + " " : "") + subject.subject +
        " — " + count + (count === 1 ? " lekcija" : count < 5 ? " lekcije" : " lekcija");
      details.appendChild(summary);

      let lastModule = null;
      subject.lessons.forEach((lesson) => {
        if (lesson.module && lesson.module !== lastModule) {
          lastModule = lesson.module;
          const m = document.createElement("div");
          m.className = "module-title";
          m.style.padding = "0.6rem 0.9rem 0";
          m.textContent = lesson.module;
          details.appendChild(m);
        }
        const row = document.createElement("button");
        row.type = "button";
        row.className = "lesson-row";
        row.innerHTML = '<span class="lesson-title">' + lesson.title + "</span>" +
          (lesson.summary ? '<span class="lesson-sub">' + lesson.summary + "</span>" : "");
        row.addEventListener("click", () => openLesson(subject, lesson));
        details.appendChild(row);
      });

      els.browse.appendChild(details);
    });
  }

  // Wrap every sentence in its own span so the player can highlight it and
  // the student can tap a sentence to start reading from there.
  function sentenceNodes(text, collected) {
    const frag = document.createDocumentFragment();
    Voice.splitSentences(text).forEach((s) => {
      const span = document.createElement("span");
      span.className = "sent";
      span.textContent = s + " ";
      span.addEventListener("click", () => {
        const idx = collected.findIndex((c) => c.el === span);
        if (idx >= 0) { Voice.play(chunks); Voice.jump(idx); }
      });
      collected.push({ text: s, el: span });
      frag.appendChild(span);
    });
    return frag;
  }

  function openLesson(subject, lesson) {
    Voice.stop();
    currentLesson = lesson;
    const collected = [];
    els.reader.innerHTML = "";
    els.reader.hidden = false;
    els.browse.innerHTML = "";

    const back = document.createElement("button");
    back.type = "button";
    back.className = "add-btn secondary";
    back.textContent = "← Nazad na spisak";
    back.addEventListener("click", () => { Voice.stop(); renderBrowse(); });
    els.reader.appendChild(back);

    const head = document.createElement("div");
    head.className = "lesson-head";
    head.innerHTML = '<div class="lesson-crumb">' + subject.subject +
      (lesson.module ? " · " + lesson.module : "") + "</div><h2>" + lesson.title + "</h2>";
    els.reader.appendChild(head);

    const listen = document.createElement("button");
    listen.type = "button";
    listen.className = "add-btn";
    listen.textContent = "🔊 Slušaj lekciju";
    els.reader.appendChild(listen);

    const body = document.createElement("div");
    body.className = "lesson-body";

    collected.push({ text: lesson.title + ".", el: null });
    if (lesson.summary) {
      const p = document.createElement("p");
      p.className = "lesson-summary";
      p.appendChild(sentenceNodes(lesson.summary, collected));
      body.appendChild(p);
    }

    (lesson.sections || []).forEach((sec) => {
      if (sec.h) {
        const h = document.createElement("h3");
        h.className = "lesson-h";
        h.textContent = sec.h;
        body.appendChild(h);
        collected.push({ text: sec.h + ".", el: h });
      }
      (sec.p || []).forEach((para) => {
        const p = document.createElement("p");
        p.appendChild(sentenceNodes(para, collected));
        body.appendChild(p);
      });
    });

    if (lesson.key && lesson.key.length) {
      const h = document.createElement("h3");
      h.className = "lesson-h";
      h.textContent = "Ključno za test";
      body.appendChild(h);
      collected.push({ text: "Ključno za test.", el: h });
      const ul = document.createElement("ul");
      ul.className = "tip-list";
      lesson.key.forEach((k) => {
        const li = document.createElement("li");
        li.appendChild(sentenceNodes(k, collected));
        ul.appendChild(li);
      });
      body.appendChild(ul);
    }

    els.reader.appendChild(body);
    chunks = collected;
    listen.addEventListener("click", () => startPlayer(lesson.title));
    window.scrollTo(0, 0);
  }

  // ---------- init ----------

  Voice.load().then(() => {
    fillVoices();
    updateStatus();
    // A device that already has a Serbian voice needs no setup, so collapse
    // the panel and let the student get straight to the lessons.
    if (Voice.isGoodVoice()) els.settings.open = false;
  });
  if (Voice.supported) {
    speechSynthesis.addEventListener("voiceschanged", () => {
      Voice.load().then(() => { fillVoices(); updateStatus(); });
    });
  }
  syncSettingsUI();
  renderBrowse();

  // Never leave the phone talking after the tab is closed.
  window.addEventListener("pagehide", () => Voice.stop());
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && Voice.state() === "speaking") Voice.pause();
  });
})();
