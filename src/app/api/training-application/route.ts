import { createHash } from "crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { badRequest, serviceUnavailable, tooManyRequests } from "@/lib/api-response";
import { createLocalTrainingApplication } from "@/lib/local-training-applications";
import { createPhonePePayment, isPhonePeConfigured } from "@/lib/phonepe";
import {
  buildPhonePeRedirectUrl,
  getCurrentPaymentEnvironment,
  getTrainingApplicationAmountPaise,
} from "@/lib/phonepe-config";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { buildMerchantOrderId, buildTrainingBatchCode, getTrainingBatchPeriod, getTrainingServiceInitials } from "@/lib/training-application";
import { trainingProgramCatalog } from "@/lib/training-programs";
import { trainingApplicationSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = trainingApplicationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return badRequest("Application details could not be submitted.");
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
    return tooManyRequests("Too many applications were submitted from this connection.", retryAfterSeconds);
  }

  try {
    if (!hasDatabaseUrl) {
    const application = await createLocalTrainingApplication({
      ...parsed.data,
      email: parsed.data.email || "no-email-provided@applicant.local",
      residencePhone: parsed.data.residencePhone || "",
      educationQualification: parsed.data.educationQualification || "",
      occupation: parsed.data.occupation || "",
      sponsoringOrganization: parsed.data.sponsoringOrganization || "",
      photoObjectKey: parsed.data.photoObjectKey || "",
      photoDataUrl: parsed.data.photoDataUrl || "",
    });

      return NextResponse.json(
        {
          ok: true,
          applicationId: application.id,
          localMode: true,
          redirectUrl: null,
          message:
            "Application saved locally. Payment handoff is skipped in this development environment, and the record is now available in Admin > Applications.",
        },
        { status: 201 },
      );
    }

    const amountPaise = getTrainingApplicationAmountPaise();

    const application = await prisma.$transaction(async (tx) => {
      const batchDate = new Date();
      const initials = getTrainingServiceInitials(parsed.data.serviceName);
      const { month, year } = getTrainingBatchPeriod(batchDate);
      const monthSuffix = `-${month}-${year}`;
      const existingMonthlyBatch = await tx.trainingApplication.findFirst({
        where: {
          serviceName: parsed.data.serviceName,
          batchCode: { endsWith: monthSuffix },
        },
        orderBy: { createdAt: "asc" },
        select: { batchCode: true },
      });
      const batchCode =
        existingMonthlyBatch?.batchCode ??
        buildTrainingBatchCode(
          parsed.data.serviceName,
          await getNextBatchNumberForService(tx, initials, parsed.data.serviceName),
          batchDate,
        );
      const [applicationCounter, batchCounter] = await Promise.all([
        tx.trainingApplication.aggregate({ _max: { applicationNumber: true } }),
        tx.trainingApplication.aggregate({
          _max: { batchSequenceNumber: true },
          where: { batchCode },
        }),
      ]);
      const applicationNumber = (applicationCounter._max.applicationNumber ?? 0) + 1;
      const batchSequenceNumber = (batchCounter._max.batchSequenceNumber ?? 0) + 1;

      return tx.trainingApplication.create({
        data: {
          applicationNumber,
          batchCode,
          batchSequenceNumber,
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
          photoUrl: parsed.data.photoUrl || null,
          photoObjectKey: parsed.data.photoObjectKey || null,
          photoDataUrl: parsed.data.photoDataUrl || null,
        },
      });
    });

    if (!isPhonePeConfigured()) {
      const fallbackProgram =
        trainingProgramCatalog.find((program) => program.title.toLowerCase() === parsed.data.serviceName.toLowerCase()) ??
        null;

      return NextResponse.json(
        {
          ok: true,
          applicationId: application.id,
          localMode: true,
          redirectUrl: fallbackProgram ? `/programs/${fallbackProgram.slug}` : "/programs",
          message:
            "Application saved successfully. Payment is not configured in this environment yet, so the record has been kept for manual follow-up.",
        },
        { status: 201 },
      );
    }

    const merchantOrderId = buildMerchantOrderId(application.id);
    const redirectUrl = buildPhonePeRedirectUrl(merchantOrderId);
    const checkoutUrl = (
      await createPhonePePayment({
        merchantOrderId,
        amountPaise,
        redirectUrl,
        message: `${parsed.data.serviceName} application payment`,
        disablePaymentRetry: true,
        phoneNumber: parsed.data.phone,
        metadata: {
          applicationId: application.id,
          serviceName: parsed.data.serviceName,
          candidateName: parsed.data.candidateName,
        },
      })
    ).checkoutUrl;

    await prisma.paymentOrder.create({
      data: {
        trainingApplicationId: application.id,
        environment: getCurrentPaymentEnvironment(),
        merchantOrderId,
        checkoutUrl,
        redirectUrl,
        status: "PENDING",
        amountPaise,
        meta: {
          ipHash,
          serviceName: parsed.data.serviceName,
          mode: "phonepe",
        },
        latestEventName: "checkout.created",
      },
    });

    return NextResponse.json(
      {
        ok: true,
        applicationId: application.id,
        merchantOrderId,
        redirectUrl: checkoutUrl,
      },
      { status: 201 },
    );
  } catch {
    return serviceUnavailable("Application storage is temporarily unavailable.");
  }
}

async function getNextBatchNumberForService(
  tx: Pick<typeof prisma, "trainingApplication">,
  initials: string,
  serviceName: string,
) {
  const existingBatches = await tx.trainingApplication.findMany({
    where: {
      serviceName,
      batchCode: { startsWith: `${initials}-` },
    },
    select: { batchCode: true },
    distinct: ["batchCode"],
  });
  const largestBatchNumber = existingBatches.reduce((largest, application) => {
    const parts = application.batchCode?.split("-") ?? [];
    const batchNumber = parts[0] === initials && parts.length === 4 ? Number(parts[1]) : 0;

    return Number.isFinite(batchNumber) ? Math.max(largest, batchNumber) : largest;
  }, 0);

  return largestBatchNumber + 1;
}
