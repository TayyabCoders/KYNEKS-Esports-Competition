import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { buildReceiptKey } from "@/lib/receipt";
import { MAX_SLIP_BYTES, detectSlipType, validateSlip } from "@/lib/registration";
import { putObject } from "@/lib/s3-client";

export const runtime = "nodejs";

// File plus a little multipart overhead. Checked from Content-Length before the body is read.
const MAX_BODY_BYTES = MAX_SLIP_BYTES + 64 * 1024;

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

/** multipart/form-data with a `file` field. Stores the payment slip in object storage and returns its key. */
export async function POST(req: Request) {
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return fail("File is too large (5 MB max).", 413);

  let upload: FormDataEntryValue | null;
  try {
    upload = (await req.formData()).get("file");
  } catch {
    return fail("Invalid request.", 400);
  }
  const file = upload instanceof File ? upload : null;

  const problem = validateSlip(file);
  if (problem || !file) return fail(problem ?? "Upload your payment slip.", 422);

  // The browser-supplied type can be faked, so trust the file's own signature.
  const bytes = new Uint8Array(await file.arrayBuffer());
  const fileType = detectSlipType(bytes);
  if (!fileType) return fail("That file doesn't look like a JPG, PNG, WebP or PDF.", 422);

  const fileKey = buildReceiptKey(randomUUID(), file.name);
  try {
    await putObject(fileKey, bytes, fileType);
  } catch (error) {
    console.error("[upload] storage failed", error);
    return fail("We couldn't store your slip. Please try again.", 502);
  }
  return NextResponse.json({ ok: true, fileKey }, { status: 201 });
}
