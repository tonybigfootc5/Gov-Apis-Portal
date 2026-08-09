import { NextResponse } from "next/server";
import { adminUnauthorized, requireAdmin } from "@/lib/auth";
import { updateLocalTrainingApplication } from "@/lib/local-training-applications";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import {
  mapTrainingApplicationEntity,
  trainingApplicationAdminInclude,
} from "@/lib/training-application";
import { getTrainingApplicationEntityById } from "@/lib/training-application-store";
import { manualStudentAdminSchema, trainingApplicationAdminSchema } from "@/lib/validators";

type Props = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Props) {
  if (!(await requireAdmin())) return adminUnauthorized();
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = trainingApplicationAdminSchema.safeParse(body);
  const parsedStudent = manualStudentAdminSchema.safeParse(body);
  if (!parsed.success && !parsedStudent.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? parsedStudent.error?.issues[0]?.message ?? "Invalid application update" },
      { status: 400 },
    );
  }

  if (!hasDatabaseUrl) {
    if (parsedStudent.success) {
      return NextResponse.json({ error: "Manual student detail editing requires database mode." }, { status: 503 });
    }
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid application update" }, { status: 400 });
    }

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

  if (parsedStudent.success) {
    const updated = await prisma.trainingApplication.update({
      where: { id },
      data: {
        batchCode: parsedStudent.data.batchCode,
        batchSequenceNumber: parsedStudent.data.batchSequenceNumber,
        serviceName: parsedStudent.data.serviceName,
        applicationDate: parsedStudent.data.applicationDate,
        candidateName: parsedStudent.data.candidateName,
        guardianName: parsedStudent.data.guardianName,
        aadhaarNo: parsedStudent.data.aadhaarNo,
        email: parsedStudent.data.email || "no-email-provided@applicant.local",
        gender: parsedStudent.data.gender,
        dateOfBirth: parsedStudent.data.dateOfBirth,
        addressLine: parsedStudent.data.addressLine,
        mandal: parsedStudent.data.mandal,
        district: parsedStudent.data.district,
        state: parsedStudent.data.state,
        pinCode: parsedStudent.data.pinCode,
        phone: parsedStudent.data.phone,
        residencePhone: parsedStudent.data.residencePhone || "",
        educationQualification: parsedStudent.data.educationQualification || "",
        occupation: parsedStudent.data.occupation || "",
        sponsoringOrganization: parsedStudent.data.sponsoringOrganization || "",
        adminNotes: parsedStudent.data.adminNotes || current.adminNotes || "",
      },
      include: trainingApplicationAdminInclude,
    });

    if (updated.paymentOrders[0]) {
      await prisma.paymentOrder.update({
        where: { id: updated.paymentOrders[0].id },
        data: {
          amountPaise: parsedStudent.data.amountPaise,
          paymentReference: parsedStudent.data.paymentReference || updated.paymentOrders[0].paymentReference,
          latestEventName: "admin.manual.edit",
        },
      });
    }

    const refreshed = await getTrainingApplicationEntityById(id);
    return NextResponse.json(mapTrainingApplicationEntity(refreshed ?? updated));
  }

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid application update" }, { status: 400 });
  }

  const updated = await prisma.trainingApplication.update({
    where: { id },
    data: {
      attemptStatus: parsed.data.attemptStatus,
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
