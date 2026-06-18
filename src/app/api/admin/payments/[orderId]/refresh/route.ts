import { NextResponse } from "next/server";
import { adminUnauthorized, requireAdmin } from "@/lib/auth";
import { getPhonePeOrderStatus } from "@/lib/phonepe";
import {
  getPaymentOrderEntityById,
  mapPaymentOrderAdminRecord,
  syncPaymentOrderFromStatus,
} from "@/lib/training-application-store";

type Props = {
  params: Promise<{ orderId: string }>;
};

export async function POST(_request: Request, { params }: Props) {
  if (!(await requireAdmin())) return adminUnauthorized();
  const { orderId } = await params;

  const paymentOrder = await getPaymentOrderEntityById(orderId);
  if (!paymentOrder) {
    return NextResponse.json({ error: "Payment order not found." }, { status: 404 });
  }

  const status = await getPhonePeOrderStatus(paymentOrder.merchantOrderId);
  await syncPaymentOrderFromStatus(paymentOrder, status, "admin.refresh");

  const refreshed = await getPaymentOrderEntityById(orderId);
  return NextResponse.json(refreshed ? mapPaymentOrderAdminRecord(refreshed) : null);
}
