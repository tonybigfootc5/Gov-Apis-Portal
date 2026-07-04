import { NextResponse } from "next/server";
import { adminUnauthorized, requireAdmin } from "@/lib/auth";
import { updateLocalTrainingApplication } from "@/lib/local-training-applications";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import {
  mapTrainingApplicationEntity,
  trainingApplicationAdminInclude,
} from "@/lib/training-application";
import { getTrainingApplicationEntityById } from "@/lib/training-application-store";
import { trainingApplicationAdminSchema } from "@/lib/validators";

type Props = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Props) {
  if (!(await requireAdmin())) return adminUnauthorized();
  const { id } = await params;
  const parsed = trainingApplicationAdminSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid application update" },
      { status: 400 },
    );
  }

  if (!hasDatabaseUrl) {
    const updated = await updateLocalTrainingApplication(id, {
      attemptStatus: parsed.data.attemptStatus,
      paymentStatus: parsed.data.paymentStatus,
      approvalStatus: parsed.data.approvalStatus,
      crossCheckStatus: parsed.data.crossCheckStatus,
      adminNotes: parsed.data.adminNotes || "",
      paymentReference: parsed.data.paymentReference || "",
    });

    if (!updated) {
      return NextResponse.json({ error: "Application was not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  }

  const current = await getTrainingApplicationEntityById(id);
  if (!current) {
    return NextResponse.json({ error: "Application was not found." }, { status: 404 });
  }

  const updated = await prisma.trainingApplication.update({
    where: { id },
    data: {
      approvalStatus: parsed.data.approvalStatus,
      crossCheckStatus: parsed.data.crossCheckStatus,
      adminNotes: parsed.data.adminNotes || "",
      approvedAt:
        parsed.data.approvalStatus === "APPROVED"
          ? current.approvedAt || new Date()
          : parsed.data.approvalStatus === "REJECTED"
            ? null
            : current.approvedAt,
      approvedBy:
        parsed.data.approvalStatus === "APPROVED"
          ? current.approvedBy || "Admin"
          : parsed.data.approvalStatus === "REJECTED"
            ? null
            : current.approvedBy,
    },
    include: trainingApplicationAdminInclude,
  });

  return NextResponse.json(mapTrainingApplicationEntity(updated));
}
