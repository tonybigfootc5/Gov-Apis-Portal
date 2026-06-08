import type { ContactMessage } from "@/generated/prisma/client";

export const TRAINING_APPLICATION_SUBJECT_PREFIX = "TRAINING_APPLICATION::";

export type ApplicationAttemptStatus =
  | "ATTEMPTED"
  | "SUBMITTED"
  | "PAYMENT_INITIATED"
  | "PAYMENT_FAILED"
  | "PAYMENT_COMPLETED";

export type ApplicationPaymentStatus = "NOT_STARTED" | "PENDING" | "PAID" | "FAILED";
export type ApplicationApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export type TrainingApplicationPayload = {
  version: 1;
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
  photoDataUrl: string;
  attemptStatus: ApplicationAttemptStatus;
  paymentStatus: ApplicationPaymentStatus;
  approvalStatus: ApplicationApprovalStatus;
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
};

export function buildTrainingApplicationPayload(
  input: Omit<
    TrainingApplicationPayload,
    | "version"
    | "attemptStatus"
    | "paymentStatus"
    | "approvalStatus"
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
    version: 1,
    ...input,
    attemptStatus: "SUBMITTED",
    paymentStatus: "NOT_STARTED",
    approvalStatus: "PENDING",
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
    if (parsed && parsed.version === 1 && typeof parsed.candidateName === "string") {
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
  };
}
