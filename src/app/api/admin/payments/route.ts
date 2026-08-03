import { NextResponse } from "next/server";
import { adminUnauthorized, requireAdmin } from "@/lib/auth";
import { hasDatabaseUrl } from "@/lib/prisma";
import { getAdminPaymentOrders } from "@/lib/training-application-store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireAdmin())) return adminUnauthorized();

  if (!hasDatabaseUrl) {
    return NextResponse.json([]);
  }

  const payments = await getAdminPaymentOrders();
  return NextResponse.json(payments);
}
