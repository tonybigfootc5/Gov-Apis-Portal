import "server-only";

import { PaymentEnvironment as PrismaPaymentEnvironment } from "@/generated/prisma/client";

export type PhonePeEnv = "SANDBOX" | "PRODUCTION";

export function getPhonePeEnvironment(): PhonePeEnv {
  return process.env.PHONEPE_ENV === "PRODUCTION" ? "PRODUCTION" : "SANDBOX";
}

export function getCurrentPaymentEnvironment(): PrismaPaymentEnvironment {
  return getPhonePeEnvironment() === "PRODUCTION"
    ? PrismaPaymentEnvironment.PRODUCTION
    : PrismaPaymentEnvironment.SANDBOX;
}

export function getTrainingApplicationAmountPaise() {
  const configured = Number(process.env.TRAINING_APPLICATION_FEE_PAISE ?? "");
  if (Number.isFinite(configured) && configured >= 100) {
    return configured;
  }

  if (getPhonePeEnvironment() === "SANDBOX") {
    return 100;
  }

  throw new Error("TRAINING_APPLICATION_FEE_PAISE must be configured for production.");
}

export function buildPhonePeRedirectUrl(merchantOrderId: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${siteUrl}/payments/return?merchantOrderId=${encodeURIComponent(merchantOrderId)}`;
}
