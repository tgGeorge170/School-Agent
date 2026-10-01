// Professor portal: first-run setup, login, invite/reset links, "Moji predmeti"
// and the admin section (invites, users, subject assignments). Talks to the Worker API.
(function () {
  const TOKEN_KEY = "cncProfToken";
  const MIN_PASSWORD = 8;
  const $ = (id) => document.getElementById(id);

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} },
  };
  const API = (store.get("cncApiUrl") || (self.PUSH_CONFIG && self.PUSH_CONFIG.workerUrl) || "").replace(/\/+$/, "");

  const VIEWS = ["view-loading", "view-error", "view-setup", "view-login", "view-link", "view-home"];
  const SUBTITLES = {
    "view-setup": "Prvo pokretanje",
    "view-login": "Prijava za profesore",
    "view-link": "Postavljanje lozinke",
    "view-home": "Moji predmeti",
  };

  const MESSAGES = {
    bad_credentials: "Pogrešan email ili lozinka.",
    wrong_current: "Trenutna lozinka nije tačna.",
    disabled: "Ovaj nalog je isključen. Javite se administratoru.",
    bad_code: "Kod za postavljanje nije tačan.",
    already_setup: "Prvi nalog je već napravljen. Prijavite se.",
    weak_password: `Lozinka mora imati najmanje ${MIN_PASSWORD} znakova.`,
    invalid_email: "Email adresa nije ispravna.",
    invalid_link: "Ovaj link nije ispravan ili je istekao.",
    email_taken: "Već postoji aktivan nalog sa ovim emailom.",
    cannot_disable_self: "Ne možete isključiti sopstveni nalog.",
    forbidden: "Nemate dozvolu za ovu radnju.",
    network: "Nema veze sa serverom. Provjerite internet i pokušajte ponovo.",
  };
  const GENERIC = "Nešto nije u redu. Pokušajte ponovo malo kasnije.";

  let token = store.get(TOKEN_KEY);
  let me = null;
  let allSubjects = [];
  let linkToken = null;

  class SessionExpired extends Error {}

  function el(tag, props, children) {
    const node = document.createElement(tag);
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (k === "text") node.textContent = v;
        else if (k === "class") node.className = v;
        else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
        else if (k in node) node[k] = v;
        else node.setAttribute(k, v);
      }
    }
    for (const c of [].concat(children || [])) if (c) node.append(c);
    return node;
  }

  function show(id) {
    VIEWS.forEach((v) => { $(v).hidden = v !== id; });
    if (SUBTITLES[id]) $("prof-subtitle").textContent = SUBTITLES[id];
    window.scrollTo(0, 0);
  }

  function setMsg(id, text, ok) {
    const box = $(id);
    box.textContent = text || "";
    box.hidden = !text;
    box.classList.toggle("ok", !!ok);
  }

  function errorText(err) {
    if (!err) return GENERIC;
    if (err.code === "too_many_attempts") {
      const min = Math.max(1, Math.ceil((Number(err.retryAfter) || 900) / 60));
      return `Previše pogrešnih pokušaja. Pokušajte ponovo za ${min} min.`;
    }
    return MESSAGES[err.code] || GENERIC;
  }

  async function api(path, opts = {}) {
    const headers = {};
    if (opts.body !== undefined) headers["Content-Type"] = "application/json";
    if (opts.auth && token) headers.Authorization = "Bearer " + token;
    let res;
    try {
      res = await fetch(API + path, {
        method: opts.method || "GET",
        headers,
        body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      });
    } catch (e) {
      throw { code: "network" };
    }
    let data = {};
    try { data = await res.json(); } catch (e) {}
    if (res.ok) return data;
    const code = data && data.error;
    // A 401 on an authed call means the session is gone, except a wrong current password.
    if (opts.auth && res.status === 401 && code !== "bad_credentials") {
      clearSession();
      showLogin("Sesija je istekla. Prijavite se ponovo.");
      throw new SessionExpired();
    }
    throw { code: code || "server_error", status: res.status, retryAfter: data && data.retryAfter };
  }

  // Runs a form action with the submit button disabled; shows errors in msgId.
  async function busy(form, msgId, fn) {
    const btn = form.querySelector("button[type=submit]");
    if (btn) btn.disabled = true;
    setMsg(msgId, "");
    try {
      await fn();
    } catch (err) {
      if (!(err instanceof SessionExpired)) setMsg(msgId, errorText(err));
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  function checkPasswords(a, b) {
    if (a.length < MIN_PASSWORD) return MESSAGES.weak_password;
    if (a !== b) return "Lozinke se ne poklapaju.";
    return "";
  }

  function validEmail(s) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  }

  function clearSession() {
    token = null;
    me = null;
    store.del(TOKEN_KEY);
  }

  async function startSession(data) {
    token = data.token;
    store.set(TOKEN_KEY, token);
    await loadHome();
  }

  function showLogin(message) {
    $("view-login").reset();
    setMsg("login-msg", message || "");
    show("view-login");
  }

  // ---------- Setup ----------
  $("view-setup").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const code = $("setup-code").value.trim();
    const name = $("setup-name").value.trim();
    const email = $("setup-email").value.trim();
    const pass = $("setup-pass").value;
    if (!code || !name) return setMsg("setup-msg", "Popunite sva polja.");
    if (!validEmail(email)) return setMsg("setup-msg", MESSAGES.invalid_email);
    const bad = checkPasswords(pass, $("setup-pass2").value);
    if (bad) return setMsg("setup-msg", bad);
    busy(form, "setup-msg", async () => {
      try {
        await startSession(await api("/api/auth/setup", { method: "POST", body: { code, name, email, password: pass } }));
      } catch (err) {
        if (err && err.code === "already_setup") return showLogin(MESSAGES.already_setup);
        throw err;
      }
    });
  });

  // ---------- Login ----------
  $("view-login").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("login-email").value.trim();
    const password = $("login-pass").value;
    if (!email || !password) return setMsg("login-msg", "Unesite email i lozinku.");
    busy(e.currentTarget, "login-msg", async () => {
      await startSession(await api("/api/auth/login", { method: "POST", body: { email, password } }));
    });
  });

  // ---------- Invite / reset link ----------
  function readLinkToken() {
    const m = location.hash.match(/^#link=([^&]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  function dropHash() {
    history.replaceState(null, "", location.pathname + location.search);
  }

  async function openLink(t) {
    linkToken = t;
    $("view-link").reset();
    setMsg("link-msg", "");
    $("link-title").textContent = "Postavi lozinku";
    $("link-lead").textContent = "Provjeravam link…";
    $("link-fields").hidden = true;
    $("link-invalid").hidden = true;
    show("view-link");
    try {
      const info = await api("/api/auth/link?token=" + encodeURIComponent(t));
      if (info.kind === "reset") {
        $("link-title").textContent = "Nova lozinka";
        $("link-lead").textContent = `Nova lozinka za ${info.email || ""}`;
      } else {
        $("link-title").textContent = `Dobrodošli, ${info.name || ""}`;
        $("link-lead").textContent = `Izaberite lozinku za nalog ${info.email || ""}.`;
      }
      $("link-fields").hidden = false;
    } catch (err) {
      $("link-lead").textContent = "";
      if (err.code === "invalid_link") {
        $("link-invalid").hidden = false;
      } else {
        $("link-lead").textContent = errorText(err);
      }
    }
  }

  $("view-link").addEventListener("submit", (e) => {
    e.preventDefault();
    const pass = $("link-pass").value;
    const bad = checkPasswords(pass, $("link-pass2").value);
    if (bad) return setMsg("link-msg", bad);
    busy(e.currentTarget, "link-msg", async () => {
      try {
        const data = await api("/api/auth/accept", { method: "POST", body: { token: linkToken, password: pass } });
        linkToken = null;
        dropHash();
        await startSession(data);
      } catch (err) {
        if (err && err.code === "invalid_link") {
          $("link-fields").hidden = true;
          $("link-invalid").hidden = false;
          return;
        }
        throw err;
      }
    });
  });

  $("link-to-login").addEventListener("click", () => {
    linkToken = null;
    dropHash();
    init();
  });

  // ---------- Home ----------
  async function loadHome() {
    const data = await api("/api/me", { auth: true });
    me = data.user;
    $("home-greeting").textContent = `Dobrodošli, ${me.name || me.email}`;
    $("home-email").textContent = me.email + (me.role === "admin" ? " · administrator" : "");
    const list = $("home-subjects");
    list.replaceChildren(...(data.subjects || []).map((s) =>
      el("li", null, [el("span", { class: "prof-icon", text: s.icon || "📘" }), el("span", { text: s.name })])
    ));
    $("home-no-subjects").hidden = list.children.length > 0;
    $("pw-form").hidden = true;
    $("pw-form").reset();
    setMsg("pw-msg", "");
    $("admin").hidden = me.role !== "admin";
    show("view-home");
    if (me.role === "admin") loadAdmin();
  }

  $("pw-toggle").addEventListener("click", () => {
    const form = $("pw-form");
    form.hidden = !form.hidden;
    if (!form.hidden) $("pw-current").focus();
  });

  $("pw-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const current = $("pw-current").value;
    const pass = $("pw-new").value;
    if (!current) return setMsg("pw-msg", "Unesite trenutnu lozinku.");
    const bad = checkPasswords(pass, $("pw-new2").value);
    if (bad) return setMsg("pw-msg", bad);
    busy(form, "pw-msg", async () => {
      try {
        await api("/api/auth/password", { method: "POST", auth: true, body: { current, password: pass } });
      } catch (err) {
        if (err && err.code === "bad_credentials") throw { code: "wrong_current" };
        throw err;
      }
      form.reset();
      setMsg("pw-msg", "Lozinka je promijenjena.", true);
    });
  });

  $("logout").addEventListener("click", async () => {
    $("logout").disabled = true;
    try { await api("/api/auth/logout", { method: "POST", auth: true }); } catch (e) {}
    $("logout").disabled = false;
    clearSession();
    showLogin();
  });

  // ---------- Admin ----------
  function linkBox(url, note) {
    const input = el("input", { type: "text", readOnly: true, value: url, class: "prof-link-input", "aria-label": "Link" });
    const status = el("span", { class: "hint prof-copied" });
    const copy = el("button", {
      type: "button",
      class: "add-btn secondary",
      text: "📋 Kopiraj link",
      onclick: async () => {
        let ok = false;
        try {
          await navigator.clipboard.writeText(url);
          ok = true;
        } catch (e) {
          input.focus();
          input.select();
          try { ok = document.execCommand("copy"); } catch (e2) {}
        }
        status.textContent = ok ? "Kopirano ✓" : "Označite link i kopirajte ga ručno.";
      },
    });
    input.addEventListener("focus", () => input.select());
    return el("div", { class: "prof-linkbox" }, [input, el("div", { class: "prof-linkrow" }, [copy, status]), el("div", { class: "hint", text: note })]);
  }

  $("invite-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = $("inv-name").value.trim();
    const email = $("inv-email").value.trim();
    const role = $("inv-role").value;
    if (!name) return setMsg("inv-msg", "Unesite ime i prezime.");
    if (!validEmail(email)) return setMsg("inv-msg", MESSAGES.invalid_email);
    const out = $("inv-result");
    out.hidden = true;
    busy(form, "inv-msg", async () => {
      const data = await api("/api/admin/invites", { method: "POST", auth: true, body: { name, email, role } });
      out.replaceChildren(
        el("div", { class: "prof-msg ok", text: `Pozivnica za ${name} je spremna.` }),
        linkBox(data.url, "Pošaljite ovaj link profesoru (Viber, email…). Važi 48 sati, može se iskoristiti samo jednom.")
      );
      out.hidden = false;
      $("inv-name").value = "";
      $("inv-email").value = "";
      $("inv-role").value = "profesor";
      loadUsers();
    });
  });

  async function loadAdmin() {
    try {
      const data = await api("/api/subjects");
      allSubjects = data.subjects || [];
    } catch (err) {
      allSubjects = [];
    }
    loadUsers();
  }

  async function loadUsers() {
    setMsg("users-msg", "");
    try {
      const data = await api("/api/admin/users", { auth: true });
      renderUsers(data.users || []);
    } catch (err) {
      if (!(err instanceof SessionExpired)) setMsg("users-msg", errorText(err));
    }
  }

  const STATUS = {
    active: ["Aktivan", "active"],
    invited: ["Čeka pozivnicu", "invited"],
    disabled: ["Isključen", "disabled"],
  };

  function renderUsers(users) {
    const list = $("users-list");
    if (!users.length) {
      list.replaceChildren(el("div", { class: "hint", text: "Još nema korisnika." }));
      return;
    }
    list.replaceChildren(...users.map(userCard));
  }

  function subjectLabel(id) {
    const s = allSubjects.find((x) => x.id === id);
    return s ? `${s.icon || "📘"} ${s.name}` : String(id);
  }

  function userCard(u) {
    const isMe = me && u.id === me.id;
    const [statusText, statusClass] = STATUS[u.status] || [u.status, ""];
    const assigned = (u.subjects || []).map(subjectLabel).join(", ");
    const panel = el("div", { class: "prof-user-extra" });
    const msgBox = el("div", { class: "prof-msg", role: "alert", hidden: true });
    const say = (text, ok) => {
      msgBox.textContent = text;
      msgBox.hidden = !text;
      msgBox.classList.toggle("ok", !!ok);
    };
    const fail = (err) => { if (!(err instanceof SessionExpired)) say(errorText(err)); };

    const subjectsBtn = el("button", {
      type: "button", class: "prof-small-btn", text: "📚 Predmeti",
      onclick: () => {
        if (panel.dataset.mode === "subjects") { panel.replaceChildren(); panel.dataset.mode = ""; return; }
        panel.dataset.mode = "subjects";
        say("");
        if (!allSubjects.length) {
          panel.replaceChildren(el("div", { class: "hint", text: "Nema predmeta za dodjelu." }));
          return;
        }
        const chosen = new Set(u.subjects || []);
        const boxes = allSubjects.map((s) => {
          const cb = el("input", { type: "checkbox", value: s.id, checked: chosen.has(s.id) });
          const meta = [s.program, s.year ? `${s.year}. razred` : ""].filter(Boolean).join(" · ");
          return el("label", { class: "push-check prof-check" }, [
            cb,
            el("span", { text: `${s.icon || "📘"} ${s.name}` }),
            meta ? el("span", { class: "hint", text: meta }) : null,
          ]);
        });
        const save = el("button", {
          type: "button", class: "add-btn", text: "Sačuvaj predmete",
          onclick: async () => {
            const subjectIds = boxes.map((b) => b.querySelector("input")).filter((c) => c.checked)
              .map((c) => allSubjects.find((s) => String(s.id) === c.value).id);
            save.disabled = true;
            try {
              await api(`/api/admin/users/${encodeURIComponent(u.id)}/subjects`, { method: "PUT", auth: true, body: { subjectIds } });
              u.subjects = subjectIds;
              assignedEl.textContent = subjectIds.length ? subjectIds.map(subjectLabel).join(", ") : "Bez predmeta";
              panel.replaceChildren();
              panel.dataset.mode = "";
              say("Predmeti su sačuvani.", true);
              if (isMe) loadHome();
            } catch (err) {
              fail(err);
            } finally {
              save.disabled = false;
            }
          },
        });
        panel.replaceChildren(el("div", { class: "prof-checks" }, boxes), save);
      },
    });

    const resetBtn = el("button", {
      type: "button", class: "prof-small-btn", text: "🔑 Link za novu lozinku",
      onclick: async () => {
        resetBtn.disabled = true;
        say("");
        try {
          const data = await api(`/api/admin/users/${encodeURIComponent(u.id)}/reset`, { method: "POST", auth: true });
          panel.dataset.mode = "reset";
          panel.replaceChildren(linkBox(data.url, "Pošaljite ovaj link korisniku. Važi 1 sat, može se iskoristiti samo jednom."));
        } catch (err) {
          fail(err);
        } finally {
          resetBtn.disabled = false;
        }
      },
    });

    const buttons = [subjectsBtn, resetBtn];
    if (!isMe) {
      const disabled = u.status === "disabled";
      const toggleBtn = el("button", {
        type: "button", class: "prof-small-btn" + (disabled ? "" : " danger"), text: disabled ? "Uključi" : "Isključi",
        onclick: async () => {
          toggleBtn.disabled = true;
          try {
            await api(`/api/admin/users/${encodeURIComponent(u.id)}`, { method: "PATCH", auth: true, body: { active: disabled } });
            loadUsers();
          } catch (err) {
            fail(err);
            toggleBtn.disabled = false;
          }
        },
      });
      buttons.push(toggleBtn);
    }

    const assignedEl = el("div", { class: "hint", text: assigned || "Bez predmeta" });
    return el("div", { class: "prof-user" + (u.status === "disabled" ? " is-disabled" : "") }, [
      el("div", { class: "prof-user-head" }, [
        el("b", { text: u.name || u.email }),
        isMe ? el("span", { class: "hint", text: " (vi)" }) : null,
      ]),
      el("div", { class: "prof-user-email", text: u.email }),
      el("div", { class: "prof-badges" }, [
        el("span", { class: "prof-badge", text: u.role === "admin" ? "Administrator" : "Profesor" }),
        el("span", { class: "prof-badge status-" + statusClass, text: statusText }),
      ]),
      assignedEl,
      el("div", { class: "prof-user-actions" }, buttons),
      msgBox,
      panel,
    ]);
  }

  // ---------- Start ----------
  async function init() {
    const t = readLinkToken();
    if (t) return openLink(t);
    show("view-loading");
    try {
      if (token) return await loadHome();
      const status = await api("/api/auth/status");
      if (status.setupNeeded) {
        $("view-setup").reset();
        setMsg("setup-msg", "");
        show("view-setup");
      } else {
        showLogin();
      }
    } catch (err) {
      if (err instanceof SessionExpired) return;
      $("error-text").textContent = errorText(err);
      show("view-error");
    }
  }

  $("error-retry").addEventListener("click", init);
  window.addEventListener("hashchange", () => { if (readLinkToken()) init(); });
  init();
})();
