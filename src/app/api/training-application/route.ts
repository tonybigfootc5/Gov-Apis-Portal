import { createHash } from "crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { badRequest, serviceUnavailable, tooManyRequests } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import {
  buildTrainingApplicationPayload,
  buildTrainingApplicationSubject,
  serializeTrainingApplication,
} from "@/lib/training-application";
import { trainingApplicationSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = trainingApplicationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return badRequest("Please check the application details and try again.");
  }

  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip")?.trim() ||
    "unknown";
  const ipHash = ip ? createHash("sha256").update(ip).digest("hex") : undefined;
  const limit = rateLimit("training-application-form", ip, 3, 30 * 60 * 1000);
  if (!limit.allowed) {
    const retryAfterSeconds = Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000));
    return tooManyRequests("Too many applications were submitted from this connection. Please wait and try again.", retryAfterSeconds);
  }

  try {
    const payload = buildTrainingApplicationPayload({
      ...parsed.data,
      email: parsed.data.email || "",
      residencePhone: parsed.data.residencePhone || "",
      educationQualification: parsed.data.educationQualification || "",
      occupation: parsed.data.occupation || "",
      sponsoringOrganization: parsed.data.sponsoringOrganization || "",
    });
    const record = await prisma.contactMessage.create({
      data: {
        name: parsed.data.candidateName,
        email: parsed.data.email || "no-email-provided@applicant.local",
        phone: parsed.data.phone,
        subject: buildTrainingApplicationSubject(parsed.data.candidateName),
        message: serializeTrainingApplication(payload),
        ipHash,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        reference: `BTC-${record.id.slice(0, 8).toUpperCase()}`,
      },
      { status: 201 },
    );
  } catch {
    return serviceUnavailable("Application storage is temporarily unavailable.");
  }
}
