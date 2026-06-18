import { NextResponse } from "next/server";
import { createPhonePePayment, getTrainingApplicationAmountPaise } from "@/lib/phonepe";
import { prisma } from "@/lib/prisma";
import {
  buildMerchantOrderId,
  getCurrentPaymentEnvironment,
} from "@/lib/training-application";
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
  const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/payments/return?merchantOrderId=${encodeURIComponent(merchantOrderId)}`;
  const checkout = await createPhonePePayment({
    merchantOrderId,
    amountPaise,
    redirectUrl,
    message: `${application.serviceName} application retry payment`,
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
      latestEventName: "checkout.retry.created",
    },
  });

  return NextResponse.json({
    ok: true,
    applicationId: application.id,
    merchantOrderId,
    redirectUrl: checkout.checkoutUrl,
  });
}
