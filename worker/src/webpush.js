// Minimal Web Push implementation (RFC 8291 aes128gcm + RFC 8292 VAPID) built
// entirely on the runtime's native WebCrypto, so it needs no npm dependency
// (the standard "web-push" package relies on Node's crypto module, which
// isn't available in the Workers runtime).

function base64UrlEncode(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str) {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const withPad = padded + "=".repeat((4 - (padded.length % 4)) % 4);
  const binary = atob(withPad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacSha256(keyBytes, dataBytes) {
  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, dataBytes);
  return new Uint8Array(sig);
}

function concatBytes(...arrays) {
  const total = arrays.reduce((n, a) => n + a.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const a of arrays) {
    out.set(a, offset);
    offset += a.length;
  }
  return out;
}

async function hkdf(salt, ikm, info, length) {
  const prk = await hmacSha256(salt, ikm);
  const full = await hmacSha256(prk, concatBytes(info, new Uint8Array([1])));
  return full.slice(0, length);
}

function importVapidPrivateKey(publicKeyB64, privateKeyB64) {
  const pub = base64UrlDecode(publicKeyB64);
  const jwk = {
    kty: "EC",
    crv: "P-256",
    d: privateKeyB64,
    x: base64UrlEncode(pub.slice(1, 33)),
    y: base64UrlEncode(pub.slice(33, 65)),
    ext: true,
  };
  return crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
}

async function buildVapidHeader(endpoint, subject, publicKeyB64, privateKeyB64) {
  const aud = new URL(endpoint).origin;
  const exp = Math.floor(Date.now() / 1000) + 12 * 60 * 60;
  const header = base64UrlEncode(new TextEncoder().encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const payload = base64UrlEncode(new TextEncoder().encode(JSON.stringify({ aud, exp, sub: subject })));
  const unsigned = `${header}.${payload}`;
  const privateKey = await importVapidPrivateKey(publicKeyB64, privateKeyB64);
  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    privateKey,
    new TextEncoder().encode(unsigned)
  );
  const jwt = `${unsigned}.${base64UrlEncode(new Uint8Array(signature))}`;
  return `vapid t=${jwt}, k=${publicKeyB64}`;
}

async function encryptPayload(payloadObj, subscription) {
  const plaintext = new TextEncoder().encode(JSON.stringify(payloadObj));
  const receiverPublicRaw = base64UrlDecode(subscription.keys.p256dh);
  const authSecret = base64UrlDecode(subscription.keys.auth);

  const receiverPublicKey = await crypto.subtle.importKey(
    "raw",
    receiverPublicRaw,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    []
  );
  const localKeyPair = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const localPublicRaw = new Uint8Array(await crypto.subtle.exportKey("raw", localKeyPair.publicKey));
  const sharedSecret = new Uint8Array(
    await crypto.subtle.deriveBits({ name: "ECDH", public: receiverPublicKey }, localKeyPair.privateKey, 256)
  );

  const keyInfo = concatBytes(
    new TextEncoder().encode("WebPush: info\0"),
    receiverPublicRaw,
    localPublicRaw
  );
  const ikm = await hkdf(authSecret, sharedSecret, keyInfo, 32);

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(salt, ikm, new TextEncoder().encode("Content-Encoding: aes128gcm\0"), 16);
  const nonce = await hkdf(salt, ikm, new TextEncoder().encode("Content-Encoding: nonce\0"), 12);

  const recordPlaintext = concatBytes(plaintext, new Uint8Array([2]));
  const cekKey = await crypto.subtle.importKey("raw", cek, { name: "AES-GCM" }, false, ["encrypt"]);
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce, tagLength: 128 }, cekKey, recordPlaintext)
  );

  const recordSize = new Uint8Array(4);
  new DataView(recordSize.buffer).setUint32(0, 4096);
  const header = concatBytes(salt, recordSize, new Uint8Array([localPublicRaw.length]), localPublicRaw);

  return concatBytes(header, ciphertext);
}

export async function sendWebPush(subscription, payloadObj, { vapidSubject, vapidPublicKey, vapidPrivateKey }) {
  const body = await encryptPayload(payloadObj, subscription);
  const authorization = await buildVapidHeader(subscription.endpoint, vapidSubject, vapidPublicKey, vapidPrivateKey);
  return fetch(subscription.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Encoding": "aes128gcm",
      TTL: "86400",
      Urgency: "high",
      Authorization: authorization,
    },
    body,
  });
}
