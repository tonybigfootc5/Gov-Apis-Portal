import { createHash, randomUUID } from "crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getApplicationErrorGuideItem, type ApplicationErrorCode } from "@/lib/application-error-codes";
import { createLocalTrainingApplication } from "@/lib/local-training-applications";
import { createPhonePePayment, isPhonePeConfigured } from "@/lib/phonepe";
import {
  buildPhonePeRedirectUrl,
  getCurrentPaymentEnvironment,
  getTrainingApplicationAmountPaise,
} from "@/lib/phonepe-config";
import { getProgramEnrollmentState } from "@/lib/program-enrollment";
import { getPrograms } from "@/lib/data";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { buildMerchantOrderId, buildTrainingBatchCode, getTrainingBatchMonthYear, getTrainingCourseCode } from "@/lib/training-application";
import { trainingApplicationSchema } from "@/lib/validators";

const TRAINING_APPLICATION_SEQUENCE_LOCK_ID = 84152026;

export async function POST(request: Request) {
  const requestId = randomUUID();
  const parsed = trainingApplicationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const fieldName = formatValidationField(firstIssue?.path.join(".") || "form");
    return applicationErrorResponse(
      "APP-VAL-001",
      `${fieldName} is missing or invalid.`,
      400,
      requestId,
    );
  }

  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip")?.trim() ||
    "unknown";
  const ipHash = ip ? createHash("sha256").update(ip).digest("hex") : undefined;
  const limit = rateLimit("training-application-form", ip, 10, 30 * 60 * 1000);
  if (!limit.allowed) {
    const retryAfterSeconds = Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000));
    return applicationErrorResponse(
      "APP-RATE-001",
      "Too many applications were submitted from this connection.",
      429,
      requestId,
      { "Retry-After": String(retryAfterSeconds) },
    );
  }

  const enrollmentProgram = await getEnrollmentProgramForService(parsed.data.serviceName);
  if (!enrollmentProgram || !getProgramEnrollmentState(enrollmentProgram).canEnroll) {
    const enrollmentState = enrollmentProgram
      ? getProgramEnrollmentState(enrollmentProgram)
      : null;
    return applicationErrorResponse(
      "APP-ENROLL-001",
      enrollmentState?.message ?? "Selected program is not open for enrollment or payment.",
      400,
      requestId,
    );
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

    const selectedProgramFee = enrollmentProgram.fee;
    let amountPaise: number;
    try {
      amountPaise = getTrainingApplicationAmountPaise(selectedProgramFee);
    } catch (error) {
      console.error("Training application fee resolution failed", {
        requestId,
        serviceName: parsed.data.serviceName,
        selectedProgramFee,
        error,
      });
      return applicationErrorResponse(
        "APP-FEE-001",
        "Selected program fee is not payable.",
        400,
        requestId,
      );
    }

    const application = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(${TRAINING_APPLICATION_SEQUENCE_LOCK_ID})`;

      const batchDate = enrollmentProgram.batchStartsAt ? new Date(enrollmentProgram.batchStartsAt) : new Date();
      const courseCode = getTrainingCourseCode(parsed.data.serviceName);
      const batchMonthYear = getTrainingBatchMonthYear(batchDate);
      const existingMonthlyBatch = await tx.trainingApplication.findFirst({
        where: {
          serviceName: parsed.data.serviceName,
          batchCode: { startsWith: `${courseCode}-`, endsWith: `-${batchMonthYear}` },
        },
        orderBy: { createdAt: "asc" },
        select: { batchCode: true },
      });
      const batchCode =
        existingMonthlyBatch?.batchCode ??
        buildTrainingBatchCode(
          parsed.data.serviceName,
          await getNextBatchNumberForService(tx, courseCode, parsed.data.serviceName),
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
          aadhaarNo: parsed.data.aadhaarNo,
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
      await prisma.trainingApplication.update({
        where: { id: application.id },
        data: { attemptStatus: "PAYMENT_FAILED" },
      });

      return applicationErrorResponse(
        "APP-PAY-001",
        "Application saved, but payment gateway credentials are unavailable.",
        503,
        requestId,
      );
    }

    let merchantOrderId: string | null = null;
    let checkoutUrl: string;
    let redirectUrl: string | null = null;
    try {
      merchantOrderId = buildMerchantOrderId(application.id);
      redirectUrl = buildPhonePeRedirectUrl(merchantOrderId);
      checkoutUrl = (
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

      await prisma.$transaction([
        prisma.paymentOrder.create({
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
        }),
        prisma.trainingApplication.update({
          where: { id: application.id },
          data: { attemptStatus: "PAYMENT_INITIATED" },
        }),
      ]);
    } catch (error) {
      console.error("PhonePe checkout creation failed", {
        requestId,
        applicationId: application.id,
        merchantOrderId,
        serviceName: parsed.data.serviceName,
        error,
      });
      const failureMessage = error instanceof Error ? error.message : "PhonePe checkout creation failed.";

      if (merchantOrderId && redirectUrl) {
        await prisma.paymentOrder
          .create({
            data: {
              trainingApplicationId: application.id,
              environment: getCurrentPaymentEnvironment(),
              merchantOrderId,
              redirectUrl,
              status: "FAILED",
              amountPaise,
              meta: {
                ipHash,
                serviceName: parsed.data.serviceName,
                mode: "phonepe",
              },
              latestErrorMessage: failureMessage,
              latestEventName: "checkout.failed",
              failedAt: new Date(),
            },
          })
          .catch((paymentOrderError) => {
            console.error("Failed to record PhonePe checkout failure", {
              requestId,
              applicationId: application.id,
              merchantOrderId,
              error: paymentOrderError,
            });
          });
      }

      await prisma.trainingApplication
        .update({
          where: { id: application.id },
          data: { attemptStatus: "PAYMENT_FAILED" },
        })
        .catch((applicationUpdateError) => {
          console.error("Failed to mark application payment as failed", {
            requestId,
            applicationId: application.id,
            error: applicationUpdateError,
          });
        });

      return applicationErrorResponse(
        "APP-PAY-002",
        "Application saved, but payment checkout could not be created.",
        503,
        requestId,
      );
    }

    return NextResponse.json(
      {
        ok: true,
        applicationId: application.id,
        merchantOrderId,
        redirectUrl: checkoutUrl,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Training application submission failed", { requestId, error });
    return applicationErrorResponse(
      "APP-DB-001",
      "Application could not be saved in the database.",
      503,
      requestId,
    );
  }
}

async function getEnrollmentProgramForService(serviceName: string) {
  const normalizedServiceName = serviceName.trim().toLowerCase().replace(/[\s_-]+/g, "");
  const programs = await getPrograms();

  return (
    programs.find((program) => program.title.trim().toLowerCase().replace(/[\s_-]+/g, "") === normalizedServiceName) ??
    null
  );
}

function applicationErrorResponse(
  code: ApplicationErrorCode,
  summary: string,
  status: number,
  requestId: string,
  headers?: HeadersInit,
) {
  const guide = getApplicationErrorGuideItem(code);

  return NextResponse.json(
    {
      ok: false,
      errorCode: code,
      summary,
      error: `${summary} Error code: ${code}.`,
      adminMeaning: guide.adminMeaning,
      requestId,
    },
    { status, headers },
  );
}

function formatValidationField(fieldName: string) {
  const labels: Record<string, string> = {
    serviceName: "Selected training program",
    applicationDate: "Application date",
    candidateName: "Applicant name",
    guardianName: "Guardian name",
    aadhaarNo: "Aadhaar number",
    email: "Email address",
    gender: "Gender",
    dateOfBirth: "Date of birth",
    addressLine: "Address",
    mandal: "Mandal",
    district: "District",
    state: "State",
    pinCode: "Pin code",
    phone: "Mobile number",
    residencePhone: "Residence phone",
    educationQualification: "Education qualification",
    occupation: "Occupation",
    sponsoringOrganization: "Sponsoring organization",
    photoName: "Applicant photo name",
    photoType: "Applicant photo type",
    photoUrl: "Applicant photo",
  };

  return labels[fieldName] ?? "Application form";
}

async function getNextBatchNumberForService(
  tx: Pick<typeof prisma, "trainingApplication">,
  courseCode: string,
  serviceName: string,
) {
  const existingBatches = await tx.trainingApplication.findMany({
    where: {
      serviceName,
      batchCode: { startsWith: `${courseCode}-` },
    },
    select: { batchCode: true },
    distinct: ["batchCode"],
  });
  const largestBatchNumber = existingBatches.reduce((largest, application) => {
    const newBatchMatch = application.batchCode?.match(new RegExp(`^${courseCode}-(\\d+)-[A-Z][a-z]{2}\\d{2}$`));
    const currentBatchMatch = application.batchCode?.match(new RegExp(`^${courseCode}-B(\\d+)-\\d{2}-\\d{4}$`));
    const modernBatchMatch = application.batchCode?.match(new RegExp(`^${courseCode}-\\d{2}-HYD-B(\\d+)$`));
    const legacyParts = application.batchCode?.split("-") ?? [];
    const batchNumber = newBatchMatch
      ? Number(newBatchMatch[1])
      : currentBatchMatch
        ? Number(currentBatchMatch[1])
        : modernBatchMatch
          ? Number(modernBatchMatch[1])
          : legacyParts[0] === courseCode && legacyParts.length === 4
            ? Number(legacyParts[1])
            : 0;

    return Number.isFinite(batchNumber) ? Math.max(largest, batchNumber) : largest;
  }, 0);

  return largestBatchNumber + 1;
}
