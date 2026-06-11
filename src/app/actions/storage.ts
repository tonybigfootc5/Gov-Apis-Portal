"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { requireAdmin } from "@/lib/auth";
import {
  assertAllowedMediaType,
  buildMediaObjectKey,
  buildMediaPublicUrl,
  getR2BucketName,
  getR2Client,
  sanitizeFilename,
} from "@/lib/r2";

async function assertAdminAccess() {
  const allowed = await requireAdmin();
  if (!allowed) {
    throw new Error("Unauthorized");
  }
}

export async function getPresignedUploadUrlAction(
  filename: string,
  fileType: string,
  section: "articles" | "gallery" = "articles",
) {
  await assertAdminAccess();

  if (!filename.trim()) {
    throw new Error("Filename is required.");
  }

  assertAllowedMediaType(fileType);

  const safeFilename = sanitizeFilename(filename);
  const inferredType = fileType.startsWith("video/") ? "VIDEO" : "IMAGE";
  const objectKey = buildMediaObjectKey(section, inferredType, safeFilename);

  const client = getR2Client();
  const bucket = getR2BucketName();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: objectKey,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 60 * 15 });

  return {
    uploadUrl,
    publicUrl: buildMediaPublicUrl(objectKey),
    objectKey,
  };
}

export async function getApplicationPhotoUploadUrlAction(filename: string, fileType: string) {
  if (!filename.trim()) {
    throw new Error("Filename is required.");
  }

  if (!fileType.startsWith("image/")) {
    throw new Error("Only image uploads are allowed for applications.");
  }

  assertAllowedMediaType(fileType);

  const safeFilename = sanitizeFilename(filename);
  const objectKey = buildMediaObjectKey("applications", "IMAGE", safeFilename);

  const client = getR2Client();
  const bucket = getR2BucketName();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: objectKey,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 60 * 15 });

  return {
    uploadUrl,
    publicUrl: buildMediaPublicUrl(objectKey),
    objectKey,
  };
}
