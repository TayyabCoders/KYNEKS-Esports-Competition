// Receipt object keys: receipts/{registrationId}/{timestamp}-{filename}
// The upload route mints the registration id; /api/register later reuses it, so the key, the registration and the receipt all line up.

const KEY_RE = /^receipts\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/(\d{10,16})-([\w.-]{1,80})$/;

export function buildReceiptKey(registrationId: string, fileName: string, now = Date.now()): string {
  const safe = fileName.replace(/[^\w.-]+/g, "_").slice(-80) || "receipt";
  return `receipts/${registrationId}/${now}-${safe}`;
}

/** Returns the registration id and display name encoded in a key, or null if the key isn't one of ours. */
export function parseReceiptKey(key: unknown): { registrationId: string; fileName: string } | null {
  const match = typeof key === "string" ? KEY_RE.exec(key) : null;
  return match?.[1] && match[3] ? { registrationId: match[1], fileName: match[3] } : null;
}
