import { NextResponse } from "next/server";
import { getPrograms } from "@/lib/data";
import { createPhonePePayment } from "@/lib/phonepe";
import {
  buildPhonePeRedirectUrl,
  getCurrentPaymentEnvironment,
  getTrainingApplicationAmountPaise,
  getTrainingProgramFeeByServiceName,
} from "@/lib/phonepe-config";
import { getProgramEnrollmentState } from "@/lib/program-enrollment";
import { prisma } from "@/lib/prisma";
import { buildMerchantOrderId } from "@/lib/training-application";
import { getTrainingApplicationEntityById } from "@/lib/training-application-store";

type Props = {
  params: Promise<{ applicationId: string }>;
};

export async function POST(_request: Request, { params }: Props) {
  const { applicationId } = await params;
  const application = await getTrainingApplicationEntityById(applicationId);

  if (!application) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  const enrollmentProgram = await getEnrollmentProgramForService(application.serviceName);
  const enrollmentState = enrollmentProgram ? getProgramEnrollmentState(enrollmentProgram) : null;
  if (!enrollmentState?.canEnroll) {
    return NextResponse.json(
      {
        ok: false,
        errorCode: "APP-ENROLL-001",
        summary: enrollmentState?.message ?? "Selected program is not open for enrollment or payment.",
        error: `${enrollmentState?.message ?? "Selected program is not open for enrollment or payment."} Error code: APP-ENROLL-001.`,
      },
      { status: 400 },
    );
  }

  const amountPaise = getTrainingApplicationAmountPaise(getTrainingProgramFeeByServiceName(application.serviceName));
  const merchantOrderId = buildMerchantOrderId(application.id);
  const redirectUrl = buildPhonePeRedirectUrl(merchantOrderId);
  const checkoutUrl = (
    await createPhonePePayment({
      merchantOrderId,
      amountPaise,
      redirectUrl,
      message: `${application.serviceName} application retry payment`,
      disablePaymentRetry: true,
      phoneNumber: application.phone,
      metadata: {
        applicationId: application.id,
        serviceName: application.serviceName,
        candidateName: application.candidateName,
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
      latestEventName: "checkout.retry.created",
    },
  });

  return NextResponse.json({
    ok: true,
    applicationId: application.id,
    merchantOrderId,
    redirectUrl: checkoutUrl,
  });
}

async function getEnrollmentProgramForService(serviceName: string) {
  const normalizedServiceName = serviceName.trim().toLowerCase().replace(/[\s_-]+/g, "");
  const programs = await getPrograms();

  return (
    programs.find((program) => program.title.trim().toLowerCase().replace(/[\s_-]+/g, "") === normalizedServiceName) ??
    null
  );
}
