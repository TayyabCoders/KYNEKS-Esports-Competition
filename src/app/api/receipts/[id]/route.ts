import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signedUrl } from "@/lib/s3-client";

export const runtime = "nodejs";

/** Redirects to a fresh, short-lived signed link for a stored receipt (the saved fileUrl expires). Access relies on the unguessable UUID. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const receipt = await prisma.receipt.findUnique({ where: { id }, select: { fileKey: true } });
  if (!receipt) return new Response("Not found", { status: 404 });

  const res = NextResponse.redirect(await signedUrl(receipt.fileKey, 300));
  res.headers.set("Cache-Control", "no-store");
  return res;
}
