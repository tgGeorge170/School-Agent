import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { handleAuth, hashPassword, verifyPassword } from "../src/auth.js";

// Minimal D1 stand-in over node:sqlite (same prepare/bind/first/all/run/batch shape).
function d1() {
  const sql = new DatabaseSync(":memory:");
  const stmt = (query, args = []) => ({
    bind: (...a) => stmt(query, a),
    async first() {
      return sql.prepare(query).get(...args) ?? null;
    },
    async all() {
      return { results: sql.prepare(query).all(...args) };
    },
    async run() {
      const r = sql.prepare(query).run(...args);
      return { meta: { changes: r.changes } };
    },
    exec() {
      return /^\s*(SELECT|INSERT[\s\S]*RETURNING|UPDATE[\s\S]*RETURNING)/i.test(query) ? this.all() : this.run();
    },
  });
  return {
    prepare: (q) => stmt(q),
    async batch(list) {
      sql.exec("BEGIN");
      try {
        const out = [];
        for (const s of list) out.push(await s.exec());
        sql.exec("COMMIT");
        return out;
      } catch (e) {
        sql.exec("ROLLBACK");
        throw e;
      }
    },
  };
}

function app() {
  const env = { DB: d1(), ADMIN_SECRET: "tajna-123", APP_URL: "https://example.test" };
  let now = 1_800_000_000_000;
  async function call(method, path, { body, token, ip = "1.1.1.1" } = {}) {
    const url = new URL("https://w.test" + path);
    const headers = { "CF-Connecting-IP": ip };
    if (token) headers.Authorization = `Bearer ${token}`;
    const req = new Request(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
    const res = await handleAuth(req, env, url, {}, now);
    return { status: res.status, data: await res.json() };
  }
  return { env, call, tick: (ms) => (now += ms) };
}

const tokenOf = (url) => url.split("#link=")[1];

async function withAdmin() {
  const a = app();
  const r = await a.call("POST", "/api/auth/setup", { body: { code: "tajna-123", name: "Đorđe", email: "Admin@Skola.ba", password: "lozinka123" } });
  assert.equal(r.status, 200);
  return { ...a, admin: r.data.token };
}

async function invite(a, email = "prof@skola.ba", role = "profesor") {
  const r = await a.call("POST", "/api/admin/invites", { token: a.admin, body: { name: "Marko Marković", email, role } });
  assert.equal(r.status, 200);
  assert.match(r.data.url, /^https:\/\/example\.test\/profesor\.html#link=/);
  return tokenOf(r.data.url);
}

test("password hashing round-trips and rejects wrong passwords", async () => {
  const h = await hashPassword("tajno-geslo", 1000);
  assert.ok(await verifyPassword("tajno-geslo", h));
  assert.ok(!(await verifyPassword("tajno-gesl0", h)));
  assert.ok(!(await verifyPassword("x", null)));
});

test("first-run setup needs the code and only works once", async () => {
  const a = app();
  assert.deepEqual((await a.call("GET", "/api/auth/status")).data, { setupNeeded: true });
  const bad = await a.call("POST", "/api/auth/setup", { body: { code: "pogresno", name: "X", email: "x@y.ba", password: "lozinka123" } });
  assert.equal(bad.data.error, "bad_code");
  const weak = await a.call("POST", "/api/auth/setup", { body: { code: "tajna-123", name: "X", email: "x@y.ba", password: "kratka" } });
  assert.equal(weak.data.error, "weak_password");
  const ok = await a.call("POST", "/api/auth/setup", { body: { code: "tajna-123", name: "X", email: "x@y.ba", password: "lozinka123" } });
  assert.equal(ok.data.user.role, "admin");
  assert.deepEqual((await a.call("GET", "/api/auth/status")).data, { setupNeeded: false });
  const again = await a.call("POST", "/api/auth/setup", { body: { code: "tajna-123", name: "Y", email: "z@y.ba", password: "lozinka123" } });
  assert.equal(again.data.error, "already_setup");
});

test("setup is impossible without ADMIN_SECRET configured", async () => {
  const a = app();
  delete a.env.ADMIN_SECRET;
  const r = await a.call("POST", "/api/auth/setup", { body: { code: "", name: "X", email: "x@y.ba", password: "lozinka123" } });
  assert.equal(r.status, 403);
});

test("invite → set password → login → me with assigned subjects", async () => {
  const a = await withAdmin();
  const t = await invite(a);
  const link = await a.call("GET", `/api/auth/link?token=${t}`);
  assert.deepEqual(link.data, { kind: "invite", email: "prof@skola.ba", name: "Marko Marković" });

  const users = (await a.call("GET", "/api/admin/users", { token: a.admin })).data.users;
  const prof = users.find((u) => u.email === "prof@skola.ba");
  assert.equal(prof.status, "invited");

  const accepted = await a.call("POST", "/api/auth/accept", { body: { token: t, password: "profesor123" } });
  assert.equal(accepted.status, 200);
  assert.equal((await a.call("POST", "/api/auth/accept", { body: { token: t, password: "profesor123" } })).data.error, "invalid_link");

  const put = await a.call("PUT", `/api/admin/users/${prof.id}/subjects`, { token: a.admin, body: { subjectIds: ["termodinamika", "nepostoji", "termodinamika"] } });
  assert.equal(put.status, 200);

  const login = await a.call("POST", "/api/auth/login", { body: { email: " PROF@skola.ba ", password: "profesor123" } });
  assert.equal(login.status, 200);
  const me = await a.call("GET", "/api/me", { token: login.data.token });
  assert.equal(me.data.user.role, "profesor");
  assert.deepEqual(me.data.subjects.map((s) => s.id), ["termodinamika"]);
  assert.equal((await a.call("GET", "/api/admin/users", { token: login.data.token })).status, 403);
});

test("expired invite links are refused", async () => {
  const a = await withAdmin();
  const t = await invite(a);
  a.tick(49 * 3600e3);
  assert.equal((await a.call("GET", `/api/auth/link?token=${t}`)).status, 404);
});

test("wrong password is rate limited per email", async () => {
  const a = await withAdmin();
  for (let i = 0; i < 5; i++) {
    const r = await a.call("POST", "/api/auth/login", { body: { email: "admin@skola.ba", password: "pogresno1" } });
    assert.equal(r.data.error, "bad_credentials");
  }
  const locked = await a.call("POST", "/api/auth/login", { body: { email: "admin@skola.ba", password: "lozinka123" } });
  assert.equal(locked.status, 429);
  assert.ok(locked.data.retryAfter > 0);
  a.tick(16 * 60e3);
  assert.equal((await a.call("POST", "/api/auth/login", { body: { email: "admin@skola.ba", password: "lozinka123" } })).status, 200);
});

test("unknown email and wrong password give the same answer", async () => {
  const a = await withAdmin();
  const unknown = await a.call("POST", "/api/auth/login", { body: { email: "niko@skola.ba", password: "lozinka123" } });
  const wrong = await a.call("POST", "/api/auth/login", { body: { email: "admin@skola.ba", password: "lozinka124" } });
  assert.deepEqual(unknown, wrong);
});

test("logout ends the session; disabling a user ends theirs", async () => {
  const a = await withAdmin();
  const t = await invite(a);
  const prof = (await a.call("POST", "/api/auth/accept", { body: { token: t, password: "profesor123" } })).data;
  assert.equal((await a.call("GET", "/api/me", { token: prof.token })).status, 200);

  const off = await a.call("PATCH", `/api/admin/users/${prof.user.id}`, { token: a.admin, body: { active: false } });
  assert.equal(off.status, 200);
  assert.equal((await a.call("GET", "/api/me", { token: prof.token })).status, 401);
  assert.equal((await a.call("POST", "/api/auth/login", { body: { email: "prof@skola.ba", password: "profesor123" } })).data.error, "disabled");

  const me = (await a.call("GET", "/api/me", { token: a.admin })).data.user;
  assert.equal((await a.call("PATCH", `/api/admin/users/${me.id}`, { token: a.admin, body: { active: false } })).data.error, "cannot_disable_self");

  assert.equal((await a.call("POST", "/api/auth/logout", { token: a.admin })).status, 200);
  assert.equal((await a.call("GET", "/api/me", { token: a.admin })).status, 401);
});

test("reset link sets a new password and logs out other sessions", async () => {
  const a = await withAdmin();
  const t = await invite(a);
  const prof = (await a.call("POST", "/api/auth/accept", { body: { token: t, password: "profesor123" } })).data;
  const reset = await a.call("POST", `/api/admin/users/${prof.user.id}/reset`, { token: a.admin });
  assert.equal((await a.call("GET", `/api/auth/link?token=${tokenOf(reset.data.url)}`)).data.kind, "reset");
  await a.call("POST", "/api/auth/accept", { body: { token: tokenOf(reset.data.url), password: "novalozinka1" } });
  assert.equal((await a.call("GET", "/api/me", { token: prof.token })).status, 401);
  assert.equal((await a.call("POST", "/api/auth/login", { body: { email: "prof@skola.ba", password: "novalozinka1" } })).status, 200);
});

test("change password needs the current one", async () => {
  const a = await withAdmin();
  const wrong = await a.call("POST", "/api/auth/password", { token: a.admin, body: { current: "x", password: "drugalozinka" } });
  assert.equal(wrong.status, 401);
  const ok = await a.call("POST", "/api/auth/password", { token: a.admin, body: { current: "lozinka123", password: "drugalozinka" } });
  assert.equal(ok.status, 200);
  assert.equal((await a.call("GET", "/api/me", { token: a.admin })).status, 200);
  assert.equal((await a.call("POST", "/api/auth/login", { body: { email: "admin@skola.ba", password: "drugalozinka" } })).status, 200);
});

test("inviting an existing active account is refused; re-inviting a pending one works", async () => {
  const a = await withAdmin();
  const first = await invite(a);
  const second = await invite(a);
  assert.equal((await a.call("GET", `/api/auth/link?token=${first}`)).status, 404);
  assert.equal((await a.call("GET", `/api/auth/link?token=${second}`)).status, 200);
  const taken = await a.call("POST", "/api/admin/invites", { token: a.admin, body: { name: "X", email: "admin@skola.ba", role: "profesor" } });
  assert.equal(taken.data.error, "email_taken");
});

test("subjects are public and seeded; admin routes need a token", async () => {
  const a = app();
  const s = await a.call("GET", "/api/subjects");
  assert.ok(s.data.subjects.some((x) => x.id === "cnc-programiranje"));
  assert.equal((await a.call("GET", "/api/admin/users")).status, 401);
  assert.equal((await a.call("GET", "/api/admin/users", { token: "garbage" })).status, 401);
  assert.equal((await a.call("DELETE", "/api/me")).status, 404);
});
