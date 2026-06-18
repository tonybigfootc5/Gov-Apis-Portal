import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { adminUnauthorized, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPhonePeRefundStatus, initiatePhonePeRefund } from "@/lib/phonepe";
import {
  getPaymentOrderEntityById,
  mapPaymentOrderAdminRecord,
  syncRefundRequestFromStatus,
} from "@/lib/training-application-store";
import { refundRequestSchema } from "@/lib/validators";

type Props = {
  params: Promise<{ orderId: string }>;
};

export async function POST(request: Request, { params }: Props) {
  if (!(await requireAdmin())) return adminUnauthorized();
  const { orderId } = await params;
  const parsed = refundRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid refund request." },
      { status: 400 },
    );
  }

  const paymentOrder = await getPaymentOrderEntityById(orderId);
  if (!paymentOrder) {
    return NextResponse.json({ error: "Payment order not found." }, { status: 404 });
  }

  if (!paymentOrder.refundEligible || paymentOrder.status !== "PAID") {
    return NextResponse.json({ error: "This payment is not eligible for a full refund." }, { status: 400 });
  }

  const merchantRefundId = `refund-${randomUUID().slice(0, 12)}`;
  const refundResponse = await initiatePhonePeRefund(
    paymentOrder.merchantOrderId,
    merchantRefundId,
    paymentOrder.amountPaise,
  );

  const refundRequest = await prisma.refundRequest.create({
    data: {
      paymentOrderId: paymentOrder.id,
      merchantRefundId,
      phonePeRefundId: refundResponse.refundId,
      amountPaise: paymentOrder.amountPaise,
      reason: parsed.data.reason,
      requestedBy: "Admin",
      status: refundResponse.state === "COMPLETED" ? "COMPLETED" : refundResponse.state === "FAILED" ? "FAILED" : "REQUESTED",
      completedAt: refundResponse.state === "COMPLETED" ? new Date() : null,
      failedAt: refundResponse.state === "FAILED" ? new Date() : null,
    },
  });

  await prisma.paymentOrder.update({
    where: { id: paymentOrder.id },
    data: {
      status: "REFUND_PENDING",
      refundEligible: false,
      latestEventName: "refund.initiated",
    },
  });

  const refundStatus = await getPhonePeRefundStatus(refundRequest.merchantRefundId);
  await syncRefundRequestFromStatus(refundRequest, refundStatus);

  const refreshed = await getPaymentOrderEntityById(orderId);
  return NextResponse.json(refreshed ? mapPaymentOrderAdminRecord(refreshed) : null);
}
