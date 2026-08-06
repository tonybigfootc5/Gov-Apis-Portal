import "server-only";

import { PaymentEnvironment as PrismaPaymentEnvironment } from "@/generated/prisma/client";
import { getSiteOrigin } from "@/lib/site-url";
import { trainingProgramCatalog } from "@/lib/training-programs";

export type PhonePeEnv = "SANDBOX" | "PRODUCTION";

export function getPhonePeEnvironment(): PhonePeEnv {
  return process.env.PHONEPE_ENV === "PRODUCTION" ? "PRODUCTION" : "SANDBOX";
}

export function getCurrentPaymentEnvironment(): PrismaPaymentEnvironment {
  return getPhonePeEnvironment() === "PRODUCTION"
    ? PrismaPaymentEnvironment.PRODUCTION
    : PrismaPaymentEnvironment.SANDBOX;
}

export function parseFeeLabelToPaise(fee: string | null | undefined) {
  const normalized = fee?.replace(/,/g, "").trim() ?? "";
  const match = normalized.match(/(?:INR|Rs\.?|₹)?\s*(\d+(?:\.\d{1,2})?)/i);
  if (!match) {
    return null;
  }

  return Math.round(Number(match[1]) * 100);
}

function normalizeTrainingProgramName(value: string) {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, "");
}

export function getTrainingProgramFeeByServiceName(serviceName: string) {
  const normalizedServiceName = normalizeTrainingProgramName(serviceName);
  return trainingProgramCatalog.find((program) => normalizeTrainingProgramName(program.title) === normalizedServiceName)?.fee ?? null;
}

export function getTrainingApplicationAmountPaise(fee?: string | null) {
  const parsedFeeAmount = parseFeeLabelToPaise(fee);
  if (parsedFeeAmount != null && Number.isFinite(parsedFeeAmount) && parsedFeeAmount >= 100) {
    return parsedFeeAmount;
  }

  const configured = Number(process.env.TRAINING_APPLICATION_FEE_PAISE ?? "");
  if (Number.isFinite(configured) && configured >= 100) {
    return configured;
  }

  if (getPhonePeEnvironment() === "SANDBOX") {
    return 100;
  }

  throw new Error("A valid training program fee must be configured for production payments.");
}

export function buildPhonePeRedirectUrl(merchantOrderId: string) {
  return `${getSiteOrigin("http://localhost:3000")}/payments/return?merchantOrderId=${encodeURIComponent(merchantOrderId)}`;
}
