// Professor accounts on D1: invite-only login, sessions, admin API.
// Passwords: PBKDF2-SHA256 with a per-user salt; tokens are stored only as SHA-256 hashes.

const SESSION_MS = 30 * 86400e3;
const INVITE_MS = 48 * 3600e3;
const RESET_MS = 3600e3;
const PBKDF2_ITERATIONS = 100000;
const MIN_PASSWORD = 8;
const LIMITS = { email: { max: 5, ms: 15 * 60e3 }, ip: { max: 30, ms: 15 * 60e3 } };
const DEFAULT_APP_URL = "https://school-agent.pages.dev";

const SEED_PROGRAM = "Tehničar CNC tehnologije";
const SEED_SUBJECTS = [
  ["cnc-programiranje", "CNC programiranje", "🔧"],
  ["prakticna-nastava", "Praktična nastava", "🏭"],
  ["tehnologija-obrade", "Tehnologija obrade", "🛠️"],
  ["masinski-elementi", "Mašinski elementi", "⚙️"],
  ["modeliranje-i-simulacija", "Modeliranje i simulacija pomoću računara", "🖥️"],
  ["racunari-i-programiranje", "Računari i programiranje", "💻"],
  ["hidraulika-i-pneumatika", "Hidraulika i pneumatika", "💧"],
  ["termodinamika", "Termodinamika", "🔥"],
  ["osnovi-preduzetnistva", "Osnovi preduzetništva", "💼"],
  ["matematika", "Matematika", "📐"],
  ["srpski-jezik", "Srpski jezik", "📖"],
  ["strani-jezik", "Strani jezik", "🌍"],
  ["fizicko-vaspitanje", "Fizičko vaspitanje", "🏃"],
];

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin','profesor')),
    password_hash TEXT,
    active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at INTEGER NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id)`,
  `CREATE TABLE IF NOT EXISTS links (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('invite','reset')),
    expires_at INTEGER NOT NULL,
    used_at INTEGER)`,
  `CREATE TABLE IF NOT EXISTS subjects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT '📘',
    program TEXT NOT NULL,
    year INTEGER NOT NULL,
    sort INTEGER NOT NULL DEFAULT 0)`,
  `CREATE TABLE IF NOT EXISTS assignments (
    user_id INTEGER NOT NULL,
    subject_id TEXT NOT NULL,
    PRIMARY KEY (user_id, subject_id))`,
  `CREATE TABLE IF NOT EXISTS attempts (
    key TEXT PRIMARY KEY,
    count INTEGER NOT NULL,
    reset_at INTEGER NOT NULL)`,
];

const schemaReady = new WeakMap();
export function ensureSchema(db) {
  if (!schemaReady.has(db)) {
    const seed = db.prepare("INSERT OR IGNORE INTO subjects (id, name, icon, program, year, sort) VALUES (?, ?, ?, ?, 3, ?)");
    const ready = db
      .batch([...SCHEMA.map((s) => db.prepare(s)), ...SEED_SUBJECTS.map(([id, name, icon], i) => seed.bind(id, name, icon, SEED_PROGRAM, i))])
      .catch((err) => {
        schemaReady.delete(db);
        throw err;
      });
    schemaReady.set(db, ready);
  }
  return schemaReady.get(db);
}

class HttpError extends Error {
  constructor(status, code, extra) {
    super(code);
    this.status = status;
    this.code = code;
    this.extra = extra;
  }
}
const fail = (status, code, extra) => {
  throw new HttpError(status, code, extra);
};

const enc = new TextEncoder();
const b64url = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64url = (s) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

function randomToken() {
  return b64url(crypto.getRandomValues(new Uint8Array(32)));
}

async function sha256(text) {
  const d = await crypto.subtle.digest("SHA-256", enc.encode(text));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function sameBytes(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function pbkdf2(password, salt, iterations) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256));
}

export async function hashPassword(password, iterations = PBKDF2_ITERATIONS) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2$${iterations}$${b64url(salt)}$${b64url(await pbkdf2(password, salt, iterations))}`;
}

export async function verifyPassword(password, stored) {
  const [scheme, iter, salt, hash] = String(stored || "").split("$");
  if (scheme !== "pbkdf2" || !hash) {
    await pbkdf2(password, new Uint8Array(16), PBKDF2_ITERATIONS);
    return false;
  }
  return sameBytes(await pbkdf2(password, fromB64url(salt), Number(iter)), fromB64url(hash));
}

const cleanEmail = (v) => String(v || "").trim().toLowerCase().slice(0, 200);
const cleanName = (v) => String(v || "").trim().replace(/\s+/g, " ").slice(0, 100);
const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

function checkPassword(p) {
  if (typeof p !== "string" || p.length < MIN_PASSWORD || p.length > 200) fail(400, "weak_password");
  return p;
}

const publicUser = (u) => ({ id: u.id, email: u.email, name: u.name, role: u.role });
const statusOf = (u) => (!u.active ? "disabled" : u.password_hash ? "active" : "invited");

async function body(request) {
  const text = await request.text();
  if (text.length > 16 * 1024) fail(400, "bad_request");
  try {
    const data = JSON.parse(text || "{}");
    return data && typeof data === "object" ? data : {};
  } catch {
    fail(400, "bad_request");
  }
}

async function newSession(db, userId, now) {
  const token = randomToken();
  await db.batch([
    db.prepare("DELETE FROM sessions WHERE expires_at < ?").bind(now),
    db.prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)").bind(await sha256(token), userId, now + SESSION_MS),
  ]);
  return token;
}

async function newLink(db, env, userId, kind, now) {
  const token = randomToken();
  const expiresAt = now + (kind === "invite" ? INVITE_MS : RESET_MS);
  await db.batch([
    db.prepare("DELETE FROM links WHERE user_id = ? AND kind = ? AND used_at IS NULL").bind(userId, kind),
    db.prepare("INSERT INTO links (token_hash, user_id, kind, expires_at) VALUES (?, ?, ?, ?)").bind(await sha256(token), userId, kind, expiresAt),
  ]);
  const base = String(env.APP_URL || DEFAULT_APP_URL).replace(/\/+$/, "");
  return { url: `${base}/profesor.html#link=${token}`, expiresAt };
}

async function currentUser(request, db, now) {
  const m = /^Bearer\s+(\S+)$/i.exec(request.headers.get("Authorization") || "");
  if (!m) fail(401, "unauthorized");
  const tokenHash = await sha256(m[1]);
  const row = await db
    .prepare("SELECT u.*, s.token_hash FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ? AND u.active = 1")
    .bind(tokenHash, now)
    .first();
  if (!row) fail(401, "unauthorized");
  return row;
}

async function requireAdmin(request, db, now) {
  const user = await currentUser(request, db, now);
  if (user.role !== "admin") fail(403, "forbidden");
  return user;
}

async function limited(db, key, limit, now) {
  const row = await db.prepare("SELECT count, reset_at FROM attempts WHERE key = ?").bind(key).first();
  if (row && row.reset_at > now && row.count >= limit.max) return Math.ceil((row.reset_at - now) / 1000);
  return 0;
}

async function recordFailure(db, key, limit, now) {
  await db
    .prepare(
      `INSERT INTO attempts (key, count, reset_at) VALUES (?1, 1, ?2)
       ON CONFLICT(key) DO UPDATE SET
         count = CASE WHEN reset_at <= ?3 THEN 1 ELSE count + 1 END,
         reset_at = CASE WHEN reset_at <= ?3 THEN ?2 ELSE reset_at END`
    )
    .bind(key, now + limit.ms, now)
    .run();
}

async function subjectsFor(db, userId) {
  const { results } = await db
    .prepare("SELECT s.id, s.name, s.icon FROM assignments a JOIN subjects s ON s.id = a.subject_id WHERE a.user_id = ? ORDER BY s.sort, s.name")
    .bind(userId)
    .all();
  return results;
}

const routes = {
  async "GET /api/auth/status"({ db }) {
    const admin = await db.prepare("SELECT 1 FROM users WHERE role = 'admin' LIMIT 1").first();
    return { setupNeeded: !admin };
  },

  async "POST /api/auth/setup"({ db, env, request, now }) {
    const b = await body(request);
    const secret = env.ADMIN_SECRET ? String(env.ADMIN_SECRET) : "";
    if (!secret || !sameBytes(enc.encode(String(b.code || "")), enc.encode(secret))) fail(403, "bad_code");
    if (await db.prepare("SELECT 1 FROM users WHERE role = 'admin' LIMIT 1").first()) fail(409, "already_setup");
    const email = cleanEmail(b.email);
    const name = cleanName(b.name);
    if (!validEmail(email)) fail(400, "invalid_email");
    if (!name) fail(400, "bad_request");
    const hash = await hashPassword(checkPassword(b.password));
    await db.prepare("DELETE FROM users WHERE email = ?").bind(email).run();
    const user = await db
      .prepare("INSERT INTO users (email, name, role, password_hash, created_at) VALUES (?, ?, 'admin', ?, ?) RETURNING *")
      .bind(email, name, hash, now)
      .first();
    return { token: await newSession(db, user.id, now), user: publicUser(user) };
  },

  async "POST /api/auth/login"({ db, request, now }) {
    const b = await body(request);
    const email = cleanEmail(b.email);
    const password = String(b.password || "");
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const keys = [[`email:${email}`, LIMITS.email], [`ip:${ip}`, LIMITS.ip]];
    for (const [key, limit] of keys) {
      const wait = await limited(db, key, limit, now);
      if (wait) fail(429, "too_many_attempts", { retryAfter: wait });
    }
    const user = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
    const ok = await verifyPassword(password, user && user.password_hash);
    if (!ok) {
      for (const [key, limit] of keys) await recordFailure(db, key, limit, now);
      fail(401, "bad_credentials");
    }
    if (!user.active) fail(403, "disabled");
    await db.prepare("DELETE FROM attempts WHERE key = ?").bind(`email:${email}`).run();
    return { token: await newSession(db, user.id, now), user: publicUser(user) };
  },

  async "POST /api/auth/logout"({ db, request, now }) {
    const user = await currentUser(request, db, now);
    await db.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(user.token_hash).run();
    return { ok: true };
  },

  async "GET /api/me"({ db, request, now }) {
    const user = await currentUser(request, db, now);
    return { user: publicUser(user), subjects: await subjectsFor(db, user.id) };
  },

  async "GET /api/auth/link"({ db, url, now }) {
    const row = await db
      .prepare("SELECT l.kind, u.email, u.name FROM links l JOIN users u ON u.id = l.user_id WHERE l.token_hash = ? AND l.used_at IS NULL AND l.expires_at > ? AND u.active = 1")
      .bind(await sha256(url.searchParams.get("token") || ""), now)
      .first();
    if (!row) fail(404, "invalid_link");
    return { kind: row.kind, email: row.email, name: row.name };
  },

  async "POST /api/auth/accept"({ db, request, now }) {
    const b = await body(request);
    const tokenHash = await sha256(String(b.token || ""));
    const link = await db.prepare("SELECT * FROM links WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?").bind(tokenHash, now).first();
    if (!link) fail(404, "invalid_link");
    const hash = await hashPassword(checkPassword(b.password));
    const claimed = await db.prepare("UPDATE links SET used_at = ? WHERE token_hash = ? AND used_at IS NULL").bind(now, tokenHash).run();
    if (!claimed.meta || !claimed.meta.changes) fail(404, "invalid_link");
    const user = await db.prepare("UPDATE users SET password_hash = ? WHERE id = ? AND active = 1 RETURNING *").bind(hash, link.user_id).first();
    if (!user) fail(404, "invalid_link");
    await db.prepare("DELETE FROM sessions WHERE user_id = ?").bind(user.id).run();
    return { token: await newSession(db, user.id, now), user: publicUser(user) };
  },

  async "POST /api/auth/password"({ db, request, now }) {
    const user = await currentUser(request, db, now);
    const b = await body(request);
    const next = checkPassword(b.password);
    if (!(await verifyPassword(String(b.current || ""), user.password_hash))) fail(401, "bad_credentials");
    await db.batch([
      db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").bind(await hashPassword(next), user.id),
      db.prepare("DELETE FROM sessions WHERE user_id = ? AND token_hash != ?").bind(user.id, user.token_hash),
    ]);
    return { ok: true };
  },

  async "GET /api/subjects"({ db }) {
    const { results } = await db.prepare("SELECT id, name, icon, program, year FROM subjects ORDER BY program, year, sort, name").all();
    return { subjects: results };
  },

  async "GET /api/admin/users"({ db, request, now }) {
    await requireAdmin(request, db, now);
    const [{ results: users }, { results: links }] = await db.batch([
      db.prepare("SELECT * FROM users ORDER BY role, name"),
      db.prepare("SELECT user_id, subject_id FROM assignments"),
    ]);
    return {
      users: users.map((u) => ({
        ...publicUser(u),
        status: statusOf(u),
        subjects: links.filter((a) => a.user_id === u.id).map((a) => a.subject_id),
      })),
    };
  },

  async "POST /api/admin/invites"({ db, env, request, now }) {
    await requireAdmin(request, db, now);
    const b = await body(request);
    const email = cleanEmail(b.email);
    const name = cleanName(b.name);
    const role = b.role === "admin" ? "admin" : "profesor";
    if (!validEmail(email)) fail(400, "invalid_email");
    if (!name) fail(400, "bad_request");
    const existing = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
    if (existing && existing.password_hash) fail(409, "email_taken");
    const user = existing
      ? await db.prepare("UPDATE users SET name = ?, role = ?, active = 1 WHERE id = ? RETURNING *").bind(name, role, existing.id).first()
      : await db.prepare("INSERT INTO users (email, name, role, created_at) VALUES (?, ?, ?, ?) RETURNING *").bind(email, name, role, now).first();
    return newLink(db, env, user.id, "invite", now);
  },

  async "POST /api/admin/users/:id/reset"({ db, env, request, now, id }) {
    await requireAdmin(request, db, now);
    const user = await db.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
    if (!user) fail(404, "not_found");
    return newLink(db, env, user.id, user.password_hash ? "reset" : "invite", now);
  },

  async "PUT /api/admin/users/:id/subjects"({ db, request, now, id }) {
    await requireAdmin(request, db, now);
    const b = await body(request);
    if (!Array.isArray(b.subjectIds)) fail(400, "bad_request");
    if (!(await db.prepare("SELECT 1 FROM users WHERE id = ?").bind(id).first())) fail(404, "not_found");
    const { results } = await db.prepare("SELECT id FROM subjects").all();
    const known = new Set(results.map((r) => r.id));
    const ids = [...new Set(b.subjectIds.map(String))].filter((s) => known.has(s));
    const insert = db.prepare("INSERT INTO assignments (user_id, subject_id) VALUES (?, ?)");
    await db.batch([db.prepare("DELETE FROM assignments WHERE user_id = ?").bind(id), ...ids.map((s) => insert.bind(id, s))]);
    return { ok: true };
  },

  async "PATCH /api/admin/users/:id"({ db, request, now, id }) {
    const admin = await requireAdmin(request, db, now);
    const b = await body(request);
    if (typeof b.active !== "boolean") fail(400, "bad_request");
    if (id === admin.id && !b.active) fail(400, "cannot_disable_self");
    const res = await db.prepare("UPDATE users SET active = ? WHERE id = ?").bind(b.active ? 1 : 0, id).run();
    if (!res.meta || !res.meta.changes) fail(404, "not_found");
    if (!b.active) await db.prepare("DELETE FROM sessions WHERE user_id = ?").bind(id).run();
    return { ok: true };
  },
};

function match(method, pathname) {
  const direct = routes[`${method} ${pathname}`];
  if (direct) return { handler: direct };
  const m = /^\/api\/admin\/users\/(\d+)(\/[a-z]+)?$/.exec(pathname);
  if (!m) return null;
  const handler = routes[`${method} /api/admin/users/:id${m[2] || ""}`];
  return handler ? { handler, id: Number(m[1]) } : null;
}

export async function handleAuth(request, env, url, headers, now = Date.now()) {
  const reply = (data, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers } });
  const route = match(request.method, url.pathname);
  if (!route) return reply({ error: "not_found" }, 404);
  if (!env.DB) return reply({ error: "server_error" }, 500);
  try {
    await ensureSchema(env.DB);
    return reply(await route.handler({ db: env.DB, env, request, url, now, id: route.id }));
  } catch (err) {
    if (err instanceof HttpError) return reply({ error: err.code, ...(err.extra || {}) }, err.status);
    console.error("auth error", err && err.stack);
    return reply({ error: "server_error" }, 500);
  }
}
