import { NextResponse } from "next/server";
import { adminUnauthorized, requireAdmin } from "@/lib/auth";
import { getLocalTrainingApplications } from "@/lib/local-training-applications";
import { hasDatabaseUrl } from "@/lib/prisma";
import { getAdminTrainingApplications } from "@/lib/training-application-store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireAdmin())) return adminUnauthorized();

  if (!hasDatabaseUrl) {
    const applications = await getLocalTrainingApplications();
    return NextResponse.json(applications);
  }

  const applications = await getAdminTrainingApplications();
  return NextResponse.json(applications);
}
