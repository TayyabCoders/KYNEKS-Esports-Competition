import { NextResponse } from "next/server";
import { validateContact } from "@/lib/contact";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 8_000;

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
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const result = validateContact(body);
  if (!result.ok) {
    return NextResponse.json({ error: Object.values(result.errors)[0], errors: result.errors }, { status: 422 });
  }

  const { phone, ...rest } = result.data;
  try {
    await prisma.contact.create({ data: { ...rest, phone: phone || null } });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[contact] save failed", error);
    return NextResponse.json({ error: "We couldn't send your message. Please try again." }, { status: 500 });
  }
}
