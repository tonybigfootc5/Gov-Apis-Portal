import { NextResponse } from "next/server";
import { adminUnauthorized, requireAdmin } from "@/lib/auth";
import { getLocalTrainingApplications } from "@/lib/local-training-applications";
import { hasDatabaseUrl } from "@/lib/prisma";
import { getAdminTrainingApplications } from "@/lib/training-application-store";
import { prisma } from "@/lib/prisma";
import { buildMerchantOrderId, mapTrainingApplicationEntity, trainingApplicationAdminInclude } from "@/lib/training-application";
import { buildPhonePeRedirectUrl, getCurrentPaymentEnvironment } from "@/lib/phonepe-config";
import { manualStudentAdminSchema } from "@/lib/validators";

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

export async function POST(request: Request) {
  if (!(await requireAdmin())) return adminUnauthorized();

  if (!hasDatabaseUrl) {
    return NextResponse.json({ error: "Manual student creation requires database mode." }, { status: 503 });
  }

  const parsed = manualStudentAdminSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid manual student details." },
      { status: 400 },
    );
  }

  try {
    const created = await prisma.$transaction(async (tx) => {
      const applicationCounter = await tx.trainingApplication.aggregate({ _max: { applicationNumber: true } });
      const applicationNumber = (applicationCounter._max.applicationNumber ?? 0) + 1;
      const approvedAt = new Date();

      const application = await tx.trainingApplication.create({
        data: {
          applicationNumber,
          batchCode: parsed.data.batchCode,
          batchSequenceNumber: parsed.data.batchSequenceNumber,
          serviceName: parsed.data.serviceName,
          applicationDate: parsed.data.applicationDate,
          candidateName: parsed.data.candidateName,
          guardianName: parsed.data.guardianName,
          aadhaarNo: parsed.data.aadhaarNo,
          email: parsed.data.email || "no-email-provided@applicant.local",
          gender: parsed.data.gender,
          dateOfBirth: parsed.data.dateOfBirth,
          addressLine: parsed.data.addressLine,
          mandal: parsed.data.mandal,
          district: parsed.data.district,
          state: parsed.data.state,
          pinCode: parsed.data.pinCode,
          phone: parsed.data.phone,
          residencePhone: parsed.data.residencePhone || "",
          educationQualification: parsed.data.educationQualification || "",
          occupation: parsed.data.occupation || "",
          sponsoringOrganization: parsed.data.sponsoringOrganization || "",
          photoName: "manual-entry",
          photoType: "admin/manual",
          attemptStatus: "PAYMENT_COMPLETED",
          approvalStatus: "APPROVED",
          crossCheckStatus: "VERIFIED",
          adminNotes: parsed.data.adminNotes || "Manual student added by admin.",
          approvedAt,
          approvedBy: "Admin manual entry",
        },
      });

      const merchantOrderId = buildMerchantOrderId(application.id);
      await tx.paymentOrder.create({
        data: {
          trainingApplicationId: application.id,
          environment: getCurrentPaymentEnvironment(),
          merchantOrderId,
          redirectUrl: buildPhonePeRedirectUrl(merchantOrderId),
          status: "PAID",
          amountPaise: parsed.data.amountPaise,
          paymentReference: parsed.data.paymentReference || `ADMIN-${applicationNumber}`,
          paidAt: approvedAt,
          refundEligible: false,
          latestEventName: "admin.manual.enrollment",
          meta: {
            mode: "admin-manual",
            createdBy: "Admin",
          },
        },
      });

      return tx.trainingApplication.findUniqueOrThrow({
        where: { id: application.id },
        include: trainingApplicationAdminInclude,
      });
    });

    return NextResponse.json(mapTrainingApplicationEntity(created), { status: 201 });
  } catch (error) {
    const message = error instanceof Error && error.message.includes("Unique constraint")
      ? "Batch sequence is already used. Choose a different student code number."
      : "Manual student could not be created.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
