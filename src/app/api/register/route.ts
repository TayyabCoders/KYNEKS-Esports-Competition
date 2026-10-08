import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SLIP_TYPES, validateRegistration, type FormErrors } from "@/lib/registration";
import { MAX_SIGNED_URL_SECONDS, signedUrl, statObject } from "@/lib/s3-client";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 16_000;

const fail = (error: string, status: number, errors?: FormErrors) => NextResponse.json({ error, errors }, { status });

/** JSON body: the squad details plus `receiptKey` returned by /api/upload. */
export async function POST(req: Request) {
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return fail("Request too large.", 413);

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return fail("Invalid request.", 400);
  }

  const result = validateRegistration(json);
  if (!result.ok) return fail(Object.values(result.errors)[0] ?? "Invalid request.", 422, result.errors);
  const { data } = result;

  // Never trust the client about the file: ask the bucket what is really stored under this key.
  let receipt: { fileUrl: string; fileType: string; fileSize: number };
  try {
    const stored = await statObject(data.receiptKey);
    if (!stored || !(SLIP_TYPES as readonly string[]).includes(stored.contentType)) {
      return fail("We couldn't find your payment slip. Please upload it again.", 422, { receiptKey: "Upload your payment slip." });
    }
    receipt = { fileUrl: await signedUrl(data.receiptKey, MAX_SIGNED_URL_SECONDS), fileType: stored.contentType, fileSize: stored.size };
  } catch (error) {
    console.error("[register] storage check failed", error);
    return fail("We couldn't verify your payment slip. Please try again.", 502);
  }

  try {
    // A nested create is one transaction: the registration, its players and its receipt are saved together or not at all.
    const registration = await prisma.registration.create({
      data: {
        id: data.registrationId,
        teamName: data.teamName,
        contactName: data.igl.fullName,
        contactWhatsapp: data.igl.whatsapp,
        contactEmail: data.igl.email,
        contactAge: data.igl.age,
        contactArea: data.igl.area,
        agreementsAccepted: true,
        players: { create: data.players },
        receipt: { create: { fileKey: data.receiptKey, fileName: data.receiptFileName, ...receipt } },
      },
      select: { id: true },
    });
    return NextResponse.json({ ok: true, id: registration.id }, { status: 201 });
  } catch (error) {
    // Same upload submitted twice (double click, retry after a lost response)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return fail("This registration was already submitted.", 409);
    }
    console.error("[register] save failed", error);
    return fail("We couldn't save your registration. Please try again.", 500);
  }
}
