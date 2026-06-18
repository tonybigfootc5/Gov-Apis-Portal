import { NextResponse } from "next/server";
import { getPhonePeOrderStatus } from "@/lib/phonepe";
import {
  getPaymentOrderByMerchantOrderId,
  mapPaymentOrderAdminRecord,
  syncPaymentOrderFromStatus,
} from "@/lib/training-application-store";

type Props = {
  params: Promise<{ merchantOrderId: string }>;
};

export async function GET(_request: Request, { params }: Props) {
  const { merchantOrderId } = await params;
  const paymentOrder = await getPaymentOrderByMerchantOrderId(merchantOrderId);

  if (!paymentOrder) {
    return NextResponse.json({ error: "Payment order not found." }, { status: 404 });
  }

  if (["PENDING", "CREATED", "FAILED", "EXPIRED"].includes(paymentOrder.status)) {
    try {
      const status = await getPhonePeOrderStatus(paymentOrder.merchantOrderId);
      await syncPaymentOrderFromStatus(paymentOrder, status, "return.status");
    } catch {
      // Preserve current DB state if gateway reconciliation fails.
    }
  }

  const refreshed = await getPaymentOrderByMerchantOrderId(merchantOrderId);
  return NextResponse.json(refreshed ? mapPaymentOrderAdminRecord(refreshed) : null);
}
