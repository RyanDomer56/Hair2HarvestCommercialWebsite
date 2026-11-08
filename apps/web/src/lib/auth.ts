/**
 * Tiny stateless session helper used by the /dashboard auth gate.
 *
 * The dashboard has no public link (removed from the chatbot/help) but was still
 * reachable by URL, so we gate it with a signed, http-only cookie. The cookie is
 * HMAC-SHA256 signed with DASHBOARD_PASSWORD (Web Crypto, edge + node safe),
 * so it cannot be forged without the secret and expires after 30 days.
 */
const COOKIE_NAME = "h2h_session";
const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

export function bytesToB64url(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const b1 = bytes[i + 1];
    const b2 = bytes[i + 2];
    out += B64[b0 >> 2];
    out += B64[((b0 & 3) << 4) | (b1 >> 4)];
    out += i + 1 < bytes.length ? B64[((b1 & 15) << 2) | (b2 >> 6)] : "=";
    out += i + 2 < bytes.length ? B64[b2 & 63] : "=";
  }
  return out.replace(/=+$/, "");
}

export function b64urlToBytes(s: string): Uint8Array {
  const str = s.replace(/-/g, "+").replace(/_/g, "/");
  const padded = str.padEnd(str.length + ((4 - (str.length % 4)) % 4), "=");
  const bin = atob(padded);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function sign(payload: string, key: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(payload));
  return bytesToB64url(new Uint8Array(sig));
}

/** Build a signed `payload.signature` cookie value valid for `ttlMs`. */
export async function createSession(
  key: string,
  ttlMs = 1000 * 60 * 60 * 24 * 30,
): Promise<string> {
  const payload = bytesToB64url(
    new TextEncoder().encode(JSON.stringify({ exp: Date.now() + ttlMs })),
  );
  const sig = await sign(payload, key);
  return `${payload}.${sig}`;
}

/** Constant-time-ish verify of the cookie value against the secret. */
export async function verifySession(
  cookie: string | undefined,
  key: string,
): Promise<boolean> {
  if (!cookie || !key) return false;
  const dot = cookie.lastIndexOf(".");
  if (dot <= 0) return false;
  const payload = cookie.slice(0, dot);
  const sig = cookie.slice(dot + 1);
  const expected = await sign(payload, key);
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff !== 0) return false;
  try {
    const data = JSON.parse(
      new TextDecoder().decode(b64urlToBytes(payload)),
    ) as { exp?: number };
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export const AUTH_COOKIE = COOKIE_NAME;
