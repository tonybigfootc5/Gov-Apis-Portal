import { createHash } from "crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { badRequest, serviceUnavailable, tooManyRequests } from "@/lib/api-response";
import { getContactMessageCutoffDate } from "@/lib/contact-inbox";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { TRAINING_APPLICATION_SUBJECT_PREFIX } from "@/lib/training-application";
import { contactSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = contactSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return badRequest("Contact form fields could not be submitted.");
  }

  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip")?.trim() ||
    "unknown";
  const ipHash = ip ? createHash("sha256").update(ip).digest("hex") : undefined;
  const limit = rateLimit("contact-form", ip, 5, 10 * 60 * 1000);
  if (!limit.allowed) {
    const retryAfterSeconds = Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000));
    return tooManyRequests("Too many messages were submitted from this connection.", retryAfterSeconds);
  }

  try {
    await prisma.contactMessage.deleteMany({
      where: {
        createdAt: { lt: getContactMessageCutoffDate() },
        NOT: {
          subject: {
            startsWith: TRAINING_APPLICATION_SUBJECT_PREFIX,
          },
        },
      },
    });

    await prisma.contactMessage.create({
      data: {
        ...parsed.data,
        phone: parsed.data.phone || null,
        ipHash,
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return serviceUnavailable("Message storage is temporarily unavailable.");
  }
}
