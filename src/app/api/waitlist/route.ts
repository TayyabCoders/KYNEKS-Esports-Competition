import { NextResponse } from "next/server";
import { validateWaitlist } from "@/lib/validation";

const MAX_BODY_BYTES = 2_000;

export async function POST(req: Request) {
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Bots fill the hidden field. Pretend success so they learn nothing.
  if (typeof body.website === "string" && body.website !== "") {
    return NextResponse.json({ ok: true });
  }

  const result = validateWaitlist(body);
  if (!result.ok) {
    return NextResponse.json({ error: Object.values(result.errors)[0], errors: result.errors }, { status: 422 });
  }

  const webhook = process.env.WAITLIST_WEBHOOK_URL;
  if (webhook) {
    try {
      const upstream = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, joinedAt: new Date().toISOString() }),
      });
      if (!upstream.ok) throw new Error(`webhook ${upstream.status}`);
    } catch (error) {
      console.error("[waitlist] webhook failed", error);
      return NextResponse.json({ error: "We couldn't save your spot. Please try again." }, { status: 502 });
    }
  } else {
    // ponytail: no storage configured yet, so entries only reach the server log.
    // Set WAITLIST_WEBHOOK_URL (Google Sheet / Formspree / DB endpoint) to persist them.
    console.log("[waitlist]", result.data);
  }

  return NextResponse.json({ ok: true });
}
