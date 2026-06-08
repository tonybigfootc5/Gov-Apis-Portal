import { NextResponse } from "next/server";
import { prismaErrorResponse } from "@/lib/api-response";
import { adminUnauthorized, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  buildTrainingApplicationSubject,
  mapTrainingApplicationRecord,
  parseTrainingApplicationMessage,
  serializeTrainingApplication,
} from "@/lib/training-application";
import { trainingApplicationAdminSchema } from "@/lib/validators";

type Props = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Props) {
  if (!(await requireAdmin())) return adminUnauthorized();
  const { id } = await params;
  const parsed = trainingApplicationAdminSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid application update" }, { status: 400 });
  }

  try {
    const current = await prisma.contactMessage.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: "Application was not found." }, { status: 404 });
    }

    const payload = parseTrainingApplicationMessage(current.message);
    if (!payload) {
      return NextResponse.json({ error: "Application data could not be parsed." }, { status: 400 });
    }

    const nextPayload = {
      ...payload,
      ...parsed.data,
      adminNotes: parsed.data.adminNotes || "",
      paymentReference: parsed.data.paymentReference || "",
      approvedAt:
        parsed.data.approvalStatus === "APPROVED"
          ? payload.approvedAt || new Date().toISOString()
          : parsed.data.approvalStatus === "REJECTED"
            ? null
            : payload.approvedAt,
      approvedBy:
        parsed.data.approvalStatus === "APPROVED"
          ? payload.approvedBy || "Admin"
          : parsed.data.approvalStatus === "REJECTED"
            ? null
            : payload.approvedBy,
    };

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: {
        name: payload.candidateName,
        email: payload.email || current.email,
        phone: payload.phone || current.phone,
        subject: buildTrainingApplicationSubject(payload.candidateName),
        message: serializeTrainingApplication(nextPayload),
      },
    });

    const record = mapTrainingApplicationRecord(updated);
    return NextResponse.json(record);
  } catch (error) {
    return prismaErrorResponse(error, "Application");
  }
}
