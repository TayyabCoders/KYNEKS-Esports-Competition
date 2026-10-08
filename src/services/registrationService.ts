import type { RegistrationInput } from "@/lib/registration";

/** Sends the squad registration to /api/register. Throws with a user-readable message on failure. */
export async function registerSquad(input: RegistrationInput): Promise<void> {
  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (res.ok) return;
  const body = (await res.json().catch(() => null)) as { error?: string } | null;
  throw new Error(body?.error ?? "Couldn't reach the arena. Try again in a moment.");
}
