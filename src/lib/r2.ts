import { randomUUID } from "crypto";
import { S3Client } from "@aws-sdk/client-s3";

const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

function required(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured.`);
  }
  return value;
}

export function getR2Client() {
  const accountId = required("CLOUDFLARE_R2_ACCOUNT_ID");
  const accessKeyId = required("R2_ACCESS_KEY_ID");
  const secretAccessKey = required("R2_SECRET_ACCESS_KEY");

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export function getR2BucketName() {
  return required("R2_BUCKET_NAME");
}

export function getR2PublicBaseUrl() {
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL;
  if (!publicBaseUrl) {
    throw new Error("R2_PUBLIC_BASE_URL must be configured to serve public media directly from R2.");
  }
  return publicBaseUrl.replace(/\/+$/, "");
}

export function assertAllowedMediaType(fileType: string) {
  if (!ALLOWED_CONTENT_TYPES.has(fileType)) {
    throw new Error("Unsupported media type. Upload a JPG, PNG, WebP, AVIF, MP4, WebM, or MOV file.");
  }
}

export function sanitizeFilename(filename: string) {
  const trimmed = filename.trim().toLowerCase();
  const extension = trimmed.includes(".") ? trimmed.slice(trimmed.lastIndexOf(".")) : "";
  const baseName = trimmed.replace(extension, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${baseName || "media-file"}${extension}`;
}

export function buildMediaObjectKey(section: string, type: string, filename: string) {
  const datePrefix = new Date().toISOString().slice(0, 10);
  return `media/${section.toLowerCase()}/${type.toLowerCase()}/${datePrefix}/${randomUUID()}-${sanitizeFilename(filename)}`;
}

export function buildMediaPublicUrl(objectKey: string) {
  return `${getR2PublicBaseUrl()}/${objectKey}`;
}
