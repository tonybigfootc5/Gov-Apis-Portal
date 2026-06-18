import { NextResponse } from "next/server";
import { createPhonePePayment } from "@/lib/phonepe";
import {
  buildPhonePeRedirectUrl,
  getCurrentPaymentEnvironment,
  getTrainingApplicationAmountPaise,
} from "@/lib/phonepe-config";
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

  const amountPaise = getTrainingApplicationAmountPaise();
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
