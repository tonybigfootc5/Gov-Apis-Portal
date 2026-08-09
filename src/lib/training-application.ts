import { randomUUID } from "crypto";
import type { ContactMessage, PaymentOrderState, Prisma } from "@/generated/prisma/client";

export const TRAINING_APPLICATION_SUBJECT_PREFIX = "TRAINING_APPLICATION::";

export type ApplicationAttemptStatus =
  | "ATTEMPTED"
  | "SUBMITTED"
  | "PAYMENT_INITIATED"
  | "PAYMENT_FAILED"
  | "PAYMENT_COMPLETED";

export type ApplicationPaymentStatus = "NOT_STARTED" | "PENDING" | "PAID" | "FAILED";
export type ApplicationApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ApplicationCrossCheckStatus = "PENDING" | "VERIFIED";

export type TrainingApplicationPayload = {
  version: 1 | 2;
  serviceName: string;
  applicationDate: string;
  candidateName: string;
  guardianName: string;
  aadhaarNo: string;
  email: string;
  gender: "male" | "female";
  dateOfBirth: string;
  addressLine: string;
  mandal: string;
  district: string;
  state: string;
  pinCode: string;
  phone: string;
  residencePhone: string;
  educationQualification: string;
  occupation: string;
  sponsoringOrganization: string;
  photoName: string;
  photoType: string;
  photoUrl?: string;
  photoObjectKey?: string;
  photoDataUrl?: string;
  attemptStatus: ApplicationAttemptStatus;
  paymentStatus: ApplicationPaymentStatus;
  approvalStatus: ApplicationApprovalStatus;
  crossCheckStatus: ApplicationCrossCheckStatus;
  attemptedAt: string;
  submittedAt: string;
  approvedAt: string | null;
  approvedBy: string | null;
  adminNotes: string;
  paymentReference: string;
};

export type TrainingApplicationRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  applicationNumber?: number | null;
  applicationCode?: string | null;
  batchCode?: string | null;
  batchSequenceNumber?: number | null;
  studentCode?: string | null;
  name: string;
  email: string;
  phone: string | null;
  payload: TrainingApplicationPayload;
  latestPayment?: PaymentOrderSummary | null;
};

export type PaymentOrderSummary = {
  id: string;
  merchantOrderId: string;
  status: PaymentOrderState;
  amountPaise: number;
  checkoutUrl: string | null;
  paymentReference: string | null;
  environment: "SANDBOX" | "PRODUCTION";
  paidAt: string | null;
  expiresAt: string | null;
  refundEligible: boolean;
  latestEventName: string | null;
};

export const trainingApplicationAdminInclude = {
  paymentOrders: {
    orderBy: { createdAt: "desc" as const },
    take: 1,
  },
} satisfies Prisma.TrainingApplicationInclude;

export type TrainingApplicationAdminEntity = Prisma.TrainingApplicationGetPayload<{
  include: typeof trainingApplicationAdminInclude;
}>;

export function getTrainingServiceInitials(serviceName: string) {
  return serviceName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word[0])
    .join("")
    .replace(/[^A-Z]/gi, "")
    .toUpperCase() || "TRN";
}

export function getTrainingCourseCode(serviceName: string) {
  const normalized = serviceName.toLowerCase().replace(/[\s_-]+/g, "");

  if (normalized.includes("honeyprocessing")) return "HP";
  if (normalized.includes("queen") || normalized.includes("colony")) return "QCM";
  if (normalized.includes("royaljelly")) return "RJ";
  if (normalized.includes("beekeeping")) return "BK";

  return getTrainingServiceInitials(serviceName).slice(0, 3) || "TRN";
}

export function getTrainingBatchPeriod(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());

  return { month, year };
}

export function buildTrainingBatchCode(serviceName: string, batchNumber: number, date = new Date()) {
  const servicePrefix = getTrainingCourseCode(serviceName);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());

  return `${servicePrefix}-B${String(batchNumber).padStart(2, "0")}-${month}-${year}`;
}

export function formatApplicationCode(applicationNumber?: number | null) {
  return applicationNumber ? `API-${String(applicationNumber).padStart(4, "0")}` : null;
}

function normalizeBatchCodeForEnrollment(batchCode: string) {
  const currentMatch = batchCode.match(/^([A-Z0-9]+)-B(\d{2,})-(\d{2})-(\d{4})$/);
  if (currentMatch) return batchCode;

  const modernMatch = batchCode.match(/^([A-Z0-9]+)-(\d{2})-([A-Z]{3})-B(\d{2,})$/);
  if (modernMatch) return batchCode;

  const legacyMatch = batchCode.match(/^([A-Z0-9]+)-(\d+)-(\d{2})-(\d{4})$/);
  if (legacyMatch) {
    const [, servicePrefix, batchNumber, , year] = legacyMatch;
    return `${servicePrefix}-${year.slice(-2)}-HYD-B${String(Number(batchNumber)).padStart(2, "0")}`;
  }

  return batchCode;
}

export function getEnrollmentVerificationCharacter(candidateName?: string | null) {
  return candidateName?.trim().match(/[A-Za-z]/)?.[0]?.toUpperCase() ?? "X";
}

export function formatStudentCode(
  batchCode?: string | null,
  batchSequenceNumber?: number | null,
  candidateName?: string | null,
) {
  return batchCode && batchSequenceNumber
    ? `API-${normalizeBatchCodeForEnrollment(batchCode)}-${String(batchSequenceNumber).padStart(4, "0")}-${getEnrollmentVerificationCharacter(candidateName)}`
    : null;
}

export function buildTrainingApplicationPayload(
  input: Omit<
    TrainingApplicationPayload,
    | "version"
    | "attemptStatus"
    | "paymentStatus"
    | "approvalStatus"
    | "crossCheckStatus"
    | "attemptedAt"
    | "submittedAt"
    | "approvedAt"
    | "approvedBy"
    | "adminNotes"
    | "paymentReference"
  >,
): TrainingApplicationPayload {
  const now = new Date().toISOString();
  return {
    version: 2,
    ...input,
    attemptStatus: "SUBMITTED",
    paymentStatus: "NOT_STARTED",
    approvalStatus: "PENDING",
    crossCheckStatus: "PENDING",
    attemptedAt: now,
    submittedAt: now,
    approvedAt: null,
    approvedBy: null,
    adminNotes: "",
    paymentReference: "",
  };
}

export function buildTrainingApplicationSubject(candidateName: string) {
  return `${TRAINING_APPLICATION_SUBJECT_PREFIX}${candidateName}`;
}

export function serializeTrainingApplication(payload: TrainingApplicationPayload) {
  return JSON.stringify(payload);
}

export function parseTrainingApplicationMessage(message: string) {
  try {
    const parsed = JSON.parse(message) as TrainingApplicationPayload;
    if (
      parsed &&
      (parsed.version === 1 || parsed.version === 2) &&
      typeof parsed.candidateName === "string"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function isTrainingApplicationRecord(message: ContactMessage) {
  return message.subject.startsWith(TRAINING_APPLICATION_SUBJECT_PREFIX);
}

export function mapTrainingApplicationRecord(message: ContactMessage): TrainingApplicationRecord | null {
  const payload = parseTrainingApplicationMessage(message.message);
  if (!payload) return null;

  return {
    id: message.id,
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.createdAt.toISOString(),
    applicationNumber: null,
    applicationCode: null,
    batchCode: null,
    batchSequenceNumber: null,
    studentCode: null,
    name: message.name,
    email: message.email,
    phone: message.phone,
    payload,
    latestPayment: null,
  };
}

export function mapPaymentOrderStateToApplicationPaymentStatus(
  state?: PaymentOrderState | null,
): ApplicationPaymentStatus {
  switch (state) {
    case "PAID":
      return "PAID";
    case "FAILED":
    case "EXPIRED":
    case "REFUNDED":
    case "REFUND_FAILED":
      return "FAILED";
    case "CREATED":
      return "NOT_STARTED";
    case "PENDING":
    case "REFUND_PENDING":
      return "PENDING";
    default:
      return "NOT_STARTED";
  }
}

export function deriveAttemptStatus(
  paymentStatus: ApplicationPaymentStatus,
  hasPaymentOrder: boolean,
): ApplicationAttemptStatus {
  if (paymentStatus === "PAID") return "PAYMENT_COMPLETED";
  if (paymentStatus === "FAILED") return "PAYMENT_FAILED";
  if (paymentStatus === "PENDING") return "PAYMENT_INITIATED";
  return hasPaymentOrder ? "SUBMITTED" : "ATTEMPTED";
}

export function mapTrainingApplicationEntity(
  application: TrainingApplicationAdminEntity,
): TrainingApplicationRecord {
  const latestPayment = application.paymentOrders[0] ?? null;
  const paymentStatus = mapPaymentOrderStateToApplicationPaymentStatus(latestPayment?.status);
  const submittedAt = application.createdAt.toISOString();

  return {
    id: application.id,
    createdAt: application.createdAt.toISOString(),
    updatedAt: application.updatedAt.toISOString(),
    applicationNumber: application.applicationNumber,
    applicationCode: formatApplicationCode(application.applicationNumber),
    batchCode: application.batchCode,
    batchSequenceNumber: application.batchSequenceNumber,
    studentCode: formatStudentCode(application.batchCode, application.batchSequenceNumber, application.candidateName),
    name: application.candidateName,
    email: application.email,
    phone: application.phone,
    latestPayment: latestPayment
      ? {
          id: latestPayment.id,
          merchantOrderId: latestPayment.merchantOrderId,
          status: latestPayment.status,
          amountPaise: latestPayment.amountPaise,
          checkoutUrl: latestPayment.checkoutUrl ?? null,
          paymentReference: latestPayment.paymentReference ?? null,
          environment: latestPayment.environment,
          paidAt: latestPayment.paidAt?.toISOString() ?? null,
          expiresAt: latestPayment.expiresAt?.toISOString() ?? null,
          refundEligible: latestPayment.refundEligible,
          latestEventName: latestPayment.latestEventName ?? null,
        }
      : null,
    payload: {
      version: 2,
      serviceName: application.serviceName,
      applicationDate: application.applicationDate,
      candidateName: application.candidateName,
      guardianName: application.guardianName,
      aadhaarNo: application.aadhaarNo,
      email: application.email,
      gender: application.gender as "male" | "female",
      dateOfBirth: application.dateOfBirth,
      addressLine: application.addressLine,
      mandal: application.mandal,
      district: application.district,
      state: application.state,
      pinCode: application.pinCode,
      phone: application.phone,
      residencePhone: application.residencePhone,
      educationQualification: application.educationQualification,
      occupation: application.occupation,
      sponsoringOrganization: application.sponsoringOrganization,
      photoName: application.photoName,
      photoType: application.photoType,
      photoUrl: application.photoUrl ?? undefined,
      photoObjectKey: application.photoObjectKey ?? undefined,
      photoDataUrl: application.photoDataUrl ?? undefined,
      attemptStatus: deriveAttemptStatus(paymentStatus, Boolean(latestPayment)),
      paymentStatus,
      approvalStatus: application.approvalStatus,
      crossCheckStatus: application.crossCheckStatus,
      attemptedAt: submittedAt,
      submittedAt,
      approvedAt: application.approvedAt?.toISOString() ?? null,
      approvedBy: application.approvedBy,
      adminNotes: application.adminNotes,
      paymentReference: latestPayment?.paymentReference ?? "",
    },
  };
}

export function mapLegacyPaymentStatus(
  status: ApplicationPaymentStatus,
): PaymentOrderState {
  switch (status) {
    case "PAID":
      return "PAID";
    case "FAILED":
      return "FAILED";
    case "PENDING":
      return "PENDING";
    case "NOT_STARTED":
    default:
      return "CREATED";
  }
}

export function isSuccessfulPaymentApplication(application: TrainingApplicationRecord) {
  return application.latestPayment?.status === "PAID" || (!application.latestPayment && application.payload.paymentStatus === "PAID");
}

export function isFailedPaymentApplication(application: TrainingApplicationRecord) {
  return (
    application.payload.paymentStatus === "FAILED" ||
    application.payload.attemptStatus === "PAYMENT_FAILED" ||
    application.latestPayment?.status === "FAILED" ||
    application.latestPayment?.status === "EXPIRED"
  );
}

export function buildLegacyMerchantOrderId(messageId: string) {
  return `legacy-${messageId}`;
}

export function buildMerchantOrderId(applicationId: string) {
  return `app-${applicationId}-${randomUUID().slice(0, 8)}`;
}
