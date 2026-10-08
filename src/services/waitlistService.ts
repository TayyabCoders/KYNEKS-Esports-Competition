import type { WaitlistInput } from "@/lib/validation";

export interface WaitlistPayload extends WaitlistInput {
  /** Honeypot: real users never fill this in. */
  website?: string;
}

/** Joins the early-access list. Swap the endpoint here when a real backend exists. */
export async function joinWaitlist(payload: WaitlistPayload): Promise<void> {
  const res = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.ok) return;
  const body = (await res.json().catch(() => null)) as { error?: string } | null;
  throw new Error(body?.error ?? "Couldn't reach the arena. Try again in a moment.");
}
