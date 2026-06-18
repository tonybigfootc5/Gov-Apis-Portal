import { createHash } from "crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { badRequest, serviceUnavailable, tooManyRequests } from "@/lib/api-response";
import { createPhonePePayment, getTrainingApplicationAmountPaise, isPhonePeConfigured } from "@/lib/phonepe";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import {
  buildMerchantOrderId,
  getCurrentPaymentEnvironment,
} from "@/lib/training-application";
import { trainingApplicationSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = trainingApplicationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return badRequest("Please check the application details and try again.");
  }

  if (!process.env.DATABASE_URL) {
    return serviceUnavailable("Training applications need DATABASE_URL before live payment collection can start.");
  }

  if (!isPhonePeConfigured()) {
    return serviceUnavailable("PhonePe is not configured for this environment yet.");
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
    const amountPaise = getTrainingApplicationAmountPaise();
    const application = await prisma.trainingApplication.create({
      data: {
        serviceName: parsed.data.serviceName,
        applicationDate: parsed.data.applicationDate,
        candidateName: parsed.data.candidateName,
        guardianName: parsed.data.guardianName,
        email: parsed.data.email || "no-email-provided@applicant.local",
        gender: parsed.data.gender,
        dateOfBirth: parsed.data.dateOfBirth,
        addressLine: parsed.data.addressLine,
        mandal: parsed.data.mandal,
        district: parsed.data.district,
        state: parsed.data.state,
        pinCode: parsed.data.pinCode,
        phone: parsed.data.phone,
        residencePhone: parsed.data.residencePhone || "",
        educationQualification: parsed.data.educationQualification || "",
        occupation: parsed.data.occupation || "",
        sponsoringOrganization: parsed.data.sponsoringOrganization || "",
        photoName: parsed.data.photoName,
        photoType: parsed.data.photoType,
        photoUrl: parsed.data.photoUrl,
        photoObjectKey: parsed.data.photoObjectKey,
      },
    });

    const merchantOrderId = buildMerchantOrderId(application.id);
    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/payments/return?merchantOrderId=${encodeURIComponent(merchantOrderId)}`;

    const checkout = await createPhonePePayment({
      merchantOrderId,
      amountPaise,
      redirectUrl,
      message: `${parsed.data.serviceName} application payment`,
    });

    await prisma.paymentOrder.create({
      data: {
        trainingApplicationId: application.id,
        environment: getCurrentPaymentEnvironment(),
        merchantOrderId,
        checkoutUrl: checkout.checkoutUrl,
        redirectUrl,
        status: "PENDING",
        amountPaise,
        meta: {
          ipHash,
          serviceName: parsed.data.serviceName,
        },
        latestEventName: "checkout.created",
      },
    });

    return NextResponse.json(
      {
        ok: true,
        applicationId: application.id,
        merchantOrderId,
        redirectUrl: checkout.checkoutUrl,
      },
      { status: 201 },
    );
  } catch {
    return serviceUnavailable("Application storage is temporarily unavailable.");
  }
}
