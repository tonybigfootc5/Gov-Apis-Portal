import "server-only";

import {
  Env,
  RefundRequest,
  StandardCheckoutClient,
  StandardCheckoutPayRequest,
} from "@phonepe-pg/pg-sdk-node";
import type {
  CallbackResponse,
  OrderStatusResponse,
  RefundResponse,
  RefundStatusResponse,
} from "@phonepe-pg/pg-sdk-node/dist/common";
import { getAppEnvironment } from "@/lib/app-env";

type PhonePeEnv = "SANDBOX" | "PRODUCTION";

type CreatePaymentInput = {
  merchantOrderId: string;
  amountPaise: number;
  redirectUrl: string;
  message?: string;
  expireAfter?: number;
};

let phonePeClient: StandardCheckoutClient | null = null;

function getPhonePeEnvironment(): PhonePeEnv {
  return process.env.PHONEPE_ENV === "PRODUCTION" ? "PRODUCTION" : "SANDBOX";
}

function getPhonePeCredentials() {
  return {
    clientId: process.env.PHONEPE_CLIENT_ID ?? "",
    clientSecret: process.env.PHONEPE_CLIENT_SECRET ?? "",
    clientVersion: Number(process.env.PHONEPE_CLIENT_VERSION ?? 1),
    env: getPhonePeEnvironment(),
  };
}

export function isPhonePeConfigured() {
  const { clientId, clientSecret } = getPhonePeCredentials();
  return Boolean(clientId && clientSecret);
}

export function getPhonePeWebhookCredentials() {
  return {
    username: process.env.PHONEPE_WEBHOOK_USERNAME ?? "",
    password: process.env.PHONEPE_WEBHOOK_PASSWORD ?? "",
  };
}

export function getTrainingApplicationAmountPaise() {
  const configured = Number(process.env.TRAINING_APPLICATION_FEE_PAISE ?? "");
  if (Number.isFinite(configured) && configured >= 100) {
    return configured;
  }

  if (getAppEnvironment() === "sandbox") {
    return 100;
  }

  throw new Error("TRAINING_APPLICATION_FEE_PAISE must be configured for production.");
}

function getPhonePeClient() {
  if (phonePeClient) return phonePeClient;

  const { clientId, clientSecret, clientVersion, env } = getPhonePeCredentials();
  if (!clientId || !clientSecret || !clientVersion) {
    throw new Error("PhonePe credentials are not configured.");
  }

  phonePeClient = StandardCheckoutClient.getInstance(
    clientId,
    clientSecret,
    clientVersion,
    env === "PRODUCTION" ? Env.PRODUCTION : Env.SANDBOX,
  );

  return phonePeClient;
}

export function buildPhonePeRedirectUrl(merchantOrderId: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${siteUrl}/payments/return?merchantOrderId=${encodeURIComponent(merchantOrderId)}`;
}

export async function createPhonePePayment(input: CreatePaymentInput) {
  const client = getPhonePeClient();
  const request = StandardCheckoutPayRequest.builder()
    .merchantOrderId(input.merchantOrderId)
    .amount(input.amountPaise)
    .redirectUrl(input.redirectUrl)
    .message(input.message ?? "Training application payment")
    .expireAfter(input.expireAfter ?? 15 * 60)
    .build();

  const response = await client.pay(request);

  return {
    checkoutUrl: response.redirectUrl,
  };
}

export async function getPhonePeOrderStatus(merchantOrderId: string): Promise<OrderStatusResponse> {
  return getPhonePeClient().getOrderStatus(merchantOrderId, true);
}

export async function initiatePhonePeRefund(
  merchantOrderId: string,
  merchantRefundId: string,
  amountPaise: number,
): Promise<RefundResponse> {
  const request = RefundRequest.builder()
    .merchantRefundId(merchantRefundId)
    .originalMerchantOrderId(merchantOrderId)
    .amount(amountPaise)
    .build();

  return getPhonePeClient().refund(request);
}

export async function getPhonePeRefundStatus(merchantRefundId: string): Promise<RefundStatusResponse> {
  return getPhonePeClient().getRefundStatus(merchantRefundId);
}

export function validatePhonePeCallback(
  authorizationHeader: string,
  body: string,
): CallbackResponse {
  const { username, password } = getPhonePeWebhookCredentials();
  if (!username || !password) {
    throw new Error("PhonePe webhook credentials are not configured.");
  }

  return getPhonePeClient().validateCallback(username, password, authorizationHeader, body);
}
