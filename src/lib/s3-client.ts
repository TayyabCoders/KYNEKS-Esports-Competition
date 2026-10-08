import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Neon Object Storage (S3-compatible). Server-only: credentials come from .env and never reach the browser.

/** Longest lifetime SigV4 allows (7 days). Fresh links are minted from the key on demand. */
export const MAX_SIGNED_URL_SECONDS = 7 * 24 * 60 * 60;

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

let client: S3Client | undefined;

/** Created on first use so a missing variable fails the request, not the build. */
export function getS3(): S3Client {
  client ??= new S3Client({
    forcePathStyle: true,
    endpoint: env("AWS_ENDPOINT_URL_S3"),
    region: env("AWS_REGION"),
    credentials: { accessKeyId: env("AWS_ACCESS_KEY_ID"), secretAccessKey: env("AWS_SECRET_ACCESS_KEY") },
    // Newer SDKs add checksum headers by default; non-AWS S3 services can reject them.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
  return client;
}

const bucket = () => env("S3_BUCKET_NAME");

export async function putObject(key: string, body: Uint8Array, contentType: string): Promise<void> {
  await getS3().send(new PutObjectCommand({ Bucket: bucket(), Key: key, Body: body, ContentType: contentType }));
}

/** Size and type as stored by the bucket, or null when the key does not exist. */
export async function statObject(key: string): Promise<{ size: number; contentType: string } | null> {
  try {
    const head = await getS3().send(new HeadObjectCommand({ Bucket: bucket(), Key: key }));
    return { size: head.ContentLength ?? 0, contentType: head.ContentType ?? "" };
  } catch (error) {
    if (error instanceof Error && (error.name === "NotFound" || error.name === "NoSuchKey")) return null;
    throw error;
  }
}

export function signedUrl(key: string, expiresIn = 3600): Promise<string> {
  return getSignedUrl(getS3(), new GetObjectCommand({ Bucket: bucket(), Key: key }), { expiresIn });
}
