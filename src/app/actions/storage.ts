"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { requireAdmin } from "@/lib/auth";
import {
  assertAllowedMediaType,
  buildMediaObjectKey,
  buildMediaPublicUrl,
  getR2BucketName,
  getR2ConfigurationError,
  getR2Client,
  sanitizeFilename,
} from "@/lib/r2";

async function assertAdminAccess() {
  const allowed = await requireAdmin();
  if (!allowed) {
    throw new Error("Unauthorized");
  }
}

type UploadActionResult =
  | {
      ok: true;
      uploadUrl: string;
      publicUrl: string;
      objectKey: string;
    }
  | {
      ok: false;
      error: string;
    };

export async function getPresignedUploadUrlAction(
  filename: string,
  fileType: string,
  section: "articles" | "gallery" = "articles",
): Promise<UploadActionResult> {
  try {
    await assertAdminAccess();

    if (!filename.trim()) {
      throw new Error("Filename is required.");
    }

    const configurationError = getR2ConfigurationError();
    if (configurationError) {
      throw new Error(configurationError);
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
      ok: true,
      uploadUrl,
      publicUrl: buildMediaPublicUrl(objectKey),
      objectKey,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Article media upload failed.",
    };
  }
}

export async function getApplicationPhotoUploadUrlAction(
  filename: string,
  fileType: string,
): Promise<UploadActionResult> {
  try {
    if (!filename.trim()) {
      throw new Error("Filename is required.");
    }

    const configurationError = getR2ConfigurationError();
    if (configurationError) {
      throw new Error(configurationError);
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
      ok: true,
      uploadUrl,
      publicUrl: buildMediaPublicUrl(objectKey),
      objectKey,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Photo upload failed.",
    };
  }
}
