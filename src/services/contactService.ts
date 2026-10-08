import type { ContactInput } from "@/lib/contact";

export interface ContactPayload extends ContactInput {
  /** Honeypot: real users never fill this in. */
  website?: string;
}

export async function sendContact(payload: ContactPayload): Promise<void> {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.ok) return;
  const body = (await res.json().catch(() => null)) as { error?: string } | null;
  throw new Error(body?.error ?? "Couldn't reach us. Try again in a moment.");
}
