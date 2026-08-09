import { trainingProgramCatalog } from "@/lib/training-programs";

export const MANUAL_BATCH_CONTACT_PHONE = "93955077066";

export const manualBatchProgramSlugs = new Set([
  "honey-processing",
  "queen-rearing-and-colony-multiplication",
]);

type EnrollmentProgram = {
  slug: string;
  title?: string;
  batchStartsAt: Date | string | null;
  registrationStartsAt?: Date | string | null;
  registrationEndsAt?: Date | string | null;
  scheduledPostAt?: Date | string | null;
  enrollmentClosed: boolean;
  published?: boolean;
};

export type ProgramEnrollmentState = {
  canEnroll: boolean;
  statusLabel: "Enroll Now" | "Coming soon" | "Enrollment closed";
  reason: "manual-date-missing" | "admin-closed" | "batch-started" | "unpublished" | "scheduled-post" | "registration-not-started" | "registration-ended" | null;
  message: string;
};

const indiaDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function findCatalogProgramByServiceName(serviceName: string) {
  const normalizedServiceName = normalizeProgramName(serviceName);
  return (
    trainingProgramCatalog.find((program) => normalizeProgramName(program.title) === normalizedServiceName) ??
    null
  );
}

export function normalizeProgramName(value: string) {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, "");
}

export function getProgramEnrollmentState(
  program: EnrollmentProgram,
  now = new Date(),
): ProgramEnrollmentState {
  const title = program.title || "this program";

  if (program.published === false) {
    return {
      canEnroll: false,
      statusLabel: "Enrollment closed",
      reason: "unpublished",
      message: `${title} is not available for enrollment right now.`,
    };
  }

  const scheduledPostAt = parseDate(program.scheduledPostAt ?? null);
  if (scheduledPostAt && now.getTime() < scheduledPostAt.getTime()) {
    return {
      canEnroll: false,
      statusLabel: "Coming soon",
      reason: "scheduled-post",
      message: `${title} will be posted for registration at the scheduled time.`,
    };
  }

  if (manualBatchProgramSlugs.has(program.slug) && !program.batchStartsAt) {
    return {
      canEnroll: false,
      statusLabel: "Coming soon",
      reason: "manual-date-missing",
      message: `Coming soon, date is not yet fixed. Please contact ${MANUAL_BATCH_CONTACT_PHONE}.`,
    };
  }

  if (program.enrollmentClosed) {
    return {
      canEnroll: false,
      statusLabel: "Enrollment closed",
      reason: "admin-closed",
      message: `${title} enrollment is closed by admin.`,
    };
  }

  const registrationStartsAt = parseDate(program.registrationStartsAt ?? null);
  if (registrationStartsAt && now.getTime() < registrationStartsAt.getTime()) {
    return {
      canEnroll: false,
      statusLabel: "Coming soon",
      reason: "registration-not-started",
      message: `${title} registration has not started yet.`,
    };
  }

  const registrationEndsAt = parseDate(program.registrationEndsAt ?? null);
  if (registrationEndsAt && now.getTime() > registrationEndsAt.getTime()) {
    return {
      canEnroll: false,
      statusLabel: "Enrollment closed",
      reason: "registration-ended",
      message: `${title} registration last date is over.`,
    };
  }

  if (hasBatchDayStarted(program.batchStartsAt, now)) {
    return {
      canEnroll: false,
      statusLabel: "Enrollment closed",
      reason: "batch-started",
      message: `${title} enrollment is closed because the batch date has started.`,
    };
  }

  return {
    canEnroll: true,
    statusLabel: "Enroll Now",
    reason: null,
    message: `${title} enrollment is open.`,
  };
}

export function hasBatchDayStarted(batchStartsAt: Date | string | null, now = new Date()) {
  const batchDate = parseDate(batchStartsAt);
  if (!batchDate) return false;

  return getIndiaDateNumber(now) >= getIndiaDateNumber(batchDate);
}

function parseDate(value: Date | string | null) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getIndiaDateNumber(date: Date) {
  const parts = indiaDateFormatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value ?? "0000";
  const month = parts.find((part) => part.type === "month")?.value ?? "00";
  const day = parts.find((part) => part.type === "day")?.value ?? "00";
  return Number(`${year}${month}${day}`);
}
