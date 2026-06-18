import { NextResponse } from "next/server";
import { adminUnauthorized, requireAdmin } from "@/lib/auth";
import { getAdminPaymentOrders } from "@/lib/training-application-store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireAdmin())) return adminUnauthorized();

  const payments = await getAdminPaymentOrders();
  return NextResponse.json(payments);
}
