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
    case "REFUND_PENDING":
    case "REFUNDED":
    case "REFUND_FAILED":
      return "PAID";
    case "FAILED":
    case "EXPIRED":
      return "FAILED";
    case "CREATED":
      return "NOT_STARTED";
    case "PENDING":
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

export function buildLegacyMerchantOrderId(messageId: string) {
  return `legacy-${messageId}`;
}

export function buildMerchantOrderId(applicationId: string) {
  return `app-${applicationId}-${randomUUID().slice(0, 8)}`;
}
