import "server-only";

import {
  Env,
  MetaInfo,
  PrefillUserLoginDetails,
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
import { getPhonePeEnvironment } from "@/lib/phonepe-config";

type CreatePaymentInput = {
  merchantOrderId: string;
  amountPaise: number;
  redirectUrl: string;
  message?: string;
  expireAfter?: number;
  disablePaymentRetry?: boolean;
  phoneNumber?: string;
  metadata?: {
    applicationId?: string;
    serviceName?: string;
    candidateName?: string;
  };
};

let phonePeClient: StandardCheckoutClient | null = null;

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

export async function createPhonePePayment(input: CreatePaymentInput) {
  const client = getPhonePeClient();
  const requestBuilder = StandardCheckoutPayRequest.builder()
    .merchantOrderId(input.merchantOrderId)
    .amount(input.amountPaise)
    .redirectUrl(input.redirectUrl)
    .message(input.message ?? "Training application payment")
    .expireAfter(input.expireAfter ?? 15 * 60)
    .disablePaymentRetry(input.disablePaymentRetry ?? true);

  if (input.phoneNumber) {
    requestBuilder.prefillUserLoginDetails(
      PrefillUserLoginDetails.builder().phoneNumber(input.phoneNumber).build(),
    );
  }

  if (input.metadata) {
    requestBuilder.metaInfo(
      MetaInfo.builder()
        .udf1(input.metadata.applicationId ?? "")
        .udf2(input.metadata.serviceName ?? "")
        .udf3(input.metadata.candidateName ?? "")
        .build(),
    );
  }

  const request = requestBuilder.build();

  const response = await client.pay(request);

  return {
    checkoutUrl: response.redirectUrl,
  };
}

export async function getPhonePeOrderStatus(merchantOrderId: string): Promise<OrderStatusResponse> {
  return getPhonePeClient().getOrderStatus(merchantOrderId, false);
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
