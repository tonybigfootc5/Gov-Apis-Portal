import { createHash } from "crypto";
import { CallbackType } from "@phonepe-pg/pg-sdk-node";
import type {
  CallbackResponse,
  OrderStatusResponse,
  RefundStatusResponse,
} from "@phonepe-pg/pg-sdk-node/dist/common";
import type {
  PaymentOrder,
  PaymentOrderState,
  Prisma,
  RefundRequest,
  RefundState,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { buildPhonePeRedirectUrl, getCurrentPaymentEnvironment } from "@/lib/phonepe-config";
import {
  buildLegacyMerchantOrderId,
  formatApplicationCode,
  formatPaymentInvoiceNumber,
  formatStudentCode,
  mapLegacyPaymentStatus,
  mapTrainingApplicationEntity,
  parseTrainingApplicationMessage,
  TRAINING_APPLICATION_SUBJECT_PREFIX,
  trainingApplicationAdminInclude,
  type TrainingApplicationAdminEntity,
  type TrainingApplicationRecord,
} from "@/lib/training-application";

export const paymentOrderAdminInclude = {
  trainingApplication: true,
  paymentEvents: {
    orderBy: { receivedAt: "desc" as const },
    take: 20,
  },
  refundRequests: {
    orderBy: { createdAt: "desc" as const },
  },
} satisfies Prisma.PaymentOrderInclude;

export type PaymentOrderAdminEntity = Prisma.PaymentOrderGetPayload<{
  include: typeof paymentOrderAdminInclude;
}>;

export type PaymentAdminRecord = {
  id: string;
  invoiceNumber: string;
  merchantOrderId: string;
  phonePeOrderId: string | null;
  provider: "PHONEPE";
  status: PaymentOrderState;
  amountPaise: number;
  currency: string;
  checkoutUrl: string | null;
  redirectUrl: string;
  paymentReference: string | null;
  environment: "SANDBOX" | "PRODUCTION";
  paidAt: string | null;
  failedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  latestErrorCode: string | null;
  latestErrorMessage: string | null;
  refundEligible: boolean;
  latestEventName: string | null;
  application: {
    id: string;
    applicationNumber: number | null;
    applicationCode: string | null;
    batchCode: string | null;
    batchSequenceNumber: number | null;
    studentCode: string | null;
    candidateName: string;
    guardianName: string;
    serviceName: string;
    applicationDate: string;
    gender: string;
    dateOfBirth: string;
    aadhaarNo: string;
    addressLine: string;
    mandal: string;
    district: string;
    state: string;
    pinCode: string;
    phone: string;
    residencePhone: string;
    email: string;
    educationQualification: string;
    occupation: string;
    sponsoringOrganization: string;
    photoName: string;
    photoType: string;
    photoUrl: string | null;
    photoObjectKey: string | null;
    attemptStatus: string;
    approvalStatus: string;
    crossCheckStatus: string;
    adminNotes: string;
    approvedAt: string | null;
    approvedBy: string | null;
    createdAt: string;
    updatedAt: string;
  };
  refunds: Array<{
    id: string;
    merchantRefundId: string;
    phonePeRefundId: string | null;
    amountPaise: number;
    reason: string;
    status: RefundState;
    createdAt: string;
    completedAt: string | null;
    failedAt: string | null;
    failureCode: string | null;
    failureMessage: string | null;
  }>;
  events: Array<{
    id: string;
    eventName: string;
    source: string;
    state: string | null;
    receivedAt: string;
    details: PaymentGatewayEventDetails;
  }>;
};

export type PaymentGatewayEventDetails = {
  merchantOrderId: string | null;
  orderId: string | null;
  state: string | null;
  amount: number | null;
  expireAt: number | null;
  errorCode: string | null;
  detailedErrorCode: string | null;
  callbackType: string | null;
  refundId: string | null;
  merchantRefundId: string | null;
  paymentDetails: Array<{
    transactionId: string | null;
    paymentMode: string | null;
    timestamp: number | null;
    amount: number | null;
    state: string | null;
    errorCode: string | null;
    detailedErrorCode: string | null;
  }>;
};

function buildEventDedupeKey(parts: Array<string | number | null | undefined>) {
  return createHash("sha256")
    .update(parts.map((value) => String(value ?? "")).join("|"))
    .digest("hex");
}

function mapOrderState(state: string | undefined | null): PaymentOrderState {
  switch (state) {
    case "COMPLETED":
      return "PAID";
    case "FAILED":
      return "FAILED";
    case "PENDING":
      return "PENDING";
    case "EXPIRED":
      return "EXPIRED";
    default:
      return "PENDING";
  }
}

function mapRefundState(state: string | undefined | null): RefundState {
  switch (state) {
    case "COMPLETED":
      return "COMPLETED";
    case "FAILED":
      return "FAILED";
    default:
      return "REQUESTED";
  }
}

function buildApplicationUpdateFromPaymentState(status: PaymentOrderState): Prisma.TrainingApplicationUpdateInput {
  if (status === "PAID") {
    return {
      attemptStatus: "PAYMENT_COMPLETED",
      approvalStatus: "APPROVED",
      crossCheckStatus: "VERIFIED",
      approvedAt: new Date(),
      approvedBy: "Payment gateway",
    };
  }

  if (status === "FAILED" || status === "EXPIRED" || status === "REFUNDED" || status === "REFUND_FAILED") {
    return {
      attemptStatus: "PAYMENT_FAILED",
      approvalStatus: "PENDING",
      crossCheckStatus: "PENDING",
      approvedAt: null,
      approvedBy: null,
    };
  }

  return {
    attemptStatus: "PAYMENT_INITIATED",
    approvalStatus: "PENDING",
    crossCheckStatus: "PENDING",
  };
}

function buildPaymentUpdateFromOrderStatus(status: OrderStatusResponse) {
  const orderState = mapOrderState(status.state);
  const latestPayment = status.paymentDetails?.[0];

  return {
    status: orderState,
    phonePeOrderId: status.orderId || null,
    paidAt:
      orderState === "PAID"
        ? new Date(latestPayment?.timestamp ?? Date.now())
        : null,
    failedAt:
      orderState === "FAILED"
        ? new Date(latestPayment?.timestamp ?? Date.now())
        : null,
    expiresAt: status.expireAt ? new Date(status.expireAt) : null,
    paymentReference: latestPayment?.transactionId ?? null,
    refundEligible: orderState === "PAID",
    latestErrorCode: latestPayment?.errorCode ?? status.errorCode ?? null,
    latestErrorMessage:
      latestPayment?.detailedErrorCode ?? status.detailedErrorCode ?? null,
    latestEventName: "order.status.sync",
  } as const;
}

function buildPaymentUpdateFromCallback(callback: CallbackResponse) {
  const payload = callback.payload;
  const latestPayment = payload.paymentDetails?.[0];
  const paidState =
    callback.type === CallbackType.CHECKOUT_ORDER_COMPLETED ||
    callback.type === CallbackType.PG_ORDER_COMPLETED;
  const failedState =
    callback.type === CallbackType.CHECKOUT_ORDER_FAILED ||
    callback.type === CallbackType.PG_ORDER_FAILED ||
    callback.type === CallbackType.CHECKOUT_TRANSACTION_ATTEMPT_FAILED ||
    callback.type === CallbackType.PG_TRANSACTION_ATTEMPT_FAILED;
  const refundCompleted = callback.type === CallbackType.PG_REFUND_COMPLETED;
  const refundFailed = callback.type === CallbackType.PG_REFUND_FAILED;
  const refundAccepted = callback.type === CallbackType.PG_REFUND_ACCEPTED;

  return {
    status: refundCompleted
      ? "REFUNDED"
      : refundFailed
        ? "REFUND_FAILED"
        : refundAccepted
          ? "REFUND_PENDING"
          : paidState
            ? "PAID"
            : failedState
              ? "FAILED"
              : mapOrderState(payload.state),
    phonePeOrderId: payload.orderId || null,
    paidAt:
      paidState && latestPayment?.timestamp
        ? new Date(latestPayment.timestamp)
        : null,
    failedAt:
      failedState && latestPayment?.timestamp
        ? new Date(latestPayment.timestamp)
        : null,
    expiresAt: payload.expireAt ? new Date(payload.expireAt) : null,
    paymentReference: latestPayment?.transactionId ?? null,
    refundEligible: paidState && !refundAccepted && !refundCompleted,
    latestErrorCode: latestPayment?.errorCode ?? payload.errorCode ?? null,
    latestErrorMessage:
      latestPayment?.detailedErrorCode ?? payload.detailedErrorCode ?? null,
    latestEventName: CallbackType[callback.type] ?? "callback",
  } as const;
}

function asJsonRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function readString(record: Record<string, unknown> | null, key: string) {
  const value = record?.[key];
  return typeof value === "string" && value ? value : null;
}

function readNumber(record: Record<string, unknown> | null, key: string) {
  const value = record?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readPaymentEventDetails(payload: unknown): PaymentGatewayEventDetails {
  const record = asJsonRecord(payload);
  const rawPaymentDetails = record?.paymentDetails;
  const paymentDetails = Array.isArray(rawPaymentDetails)
    ? rawPaymentDetails
        .map(asJsonRecord)
        .filter((detail): detail is Record<string, unknown> => Boolean(detail))
        .map((detail) => ({
          transactionId: readString(detail, "transactionId"),
          paymentMode: readString(detail, "paymentMode"),
          timestamp: readNumber(detail, "timestamp"),
          amount: readNumber(detail, "amount"),
          state: readString(detail, "state"),
          errorCode: readString(detail, "errorCode"),
          detailedErrorCode: readString(detail, "detailedErrorCode"),
        }))
    : [];

  const firstPayment = paymentDetails[0] ?? null;

  return {
    merchantOrderId: readString(record, "merchantOrderId"),
    orderId: readString(record, "orderId"),
    state: readString(record, "state"),
    amount: readNumber(record, "amount"),
    expireAt: readNumber(record, "expireAt"),
    errorCode: firstPayment?.errorCode ?? readString(record, "errorCode"),
    detailedErrorCode: firstPayment?.detailedErrorCode ?? readString(record, "detailedErrorCode"),
    callbackType: readString(record, "type"),
    refundId: readString(record, "refundId"),
    merchantRefundId: readString(record, "merchantRefundId"),
    paymentDetails,
  };
}

export function mapPaymentOrderAdminRecord(order: PaymentOrderAdminEntity): PaymentAdminRecord {
  return {
    id: order.id,
    invoiceNumber: formatPaymentInvoiceNumber({
      createdAt: order.createdAt,
      merchantOrderId: order.merchantOrderId,
      applicationNumber: order.trainingApplication.applicationNumber,
    }),
    merchantOrderId: order.merchantOrderId,
    phonePeOrderId: order.phonePeOrderId ?? null,
    provider: order.provider,
    status: order.status,
    amountPaise: order.amountPaise,
    currency: order.currency,
    checkoutUrl: order.checkoutUrl ?? null,
    redirectUrl: order.redirectUrl,
    paymentReference: order.paymentReference ?? null,
    environment: order.environment,
    paidAt: order.paidAt?.toISOString() ?? null,
    failedAt: order.failedAt?.toISOString() ?? null,
    expiresAt: order.expiresAt?.toISOString() ?? null,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    latestErrorCode: order.latestErrorCode ?? null,
    latestErrorMessage: order.latestErrorMessage ?? null,
    refundEligible: order.refundEligible,
    latestEventName: order.latestEventName ?? null,
    application: {
      id: order.trainingApplication.id,
      applicationNumber: order.trainingApplication.applicationNumber,
      applicationCode: formatApplicationCode(order.trainingApplication.applicationNumber),
      batchCode: order.trainingApplication.batchCode,
      batchSequenceNumber: order.trainingApplication.batchSequenceNumber,
      studentCode: formatStudentCode(
        order.trainingApplication.batchCode,
        order.trainingApplication.batchSequenceNumber,
        order.trainingApplication.candidateName,
      ),
      candidateName: order.trainingApplication.candidateName,
      guardianName: order.trainingApplication.guardianName,
      serviceName: order.trainingApplication.serviceName,
      applicationDate: order.trainingApplication.applicationDate,
      gender: order.trainingApplication.gender,
      dateOfBirth: order.trainingApplication.dateOfBirth,
      aadhaarNo: order.trainingApplication.aadhaarNo,
      addressLine: order.trainingApplication.addressLine,
      mandal: order.trainingApplication.mandal,
      district: order.trainingApplication.district,
      state: order.trainingApplication.state,
      pinCode: order.trainingApplication.pinCode,
      phone: order.trainingApplication.phone,
      residencePhone: order.trainingApplication.residencePhone,
      email: order.trainingApplication.email,
      educationQualification: order.trainingApplication.educationQualification,
      occupation: order.trainingApplication.occupation,
      sponsoringOrganization: order.trainingApplication.sponsoringOrganization,
      photoName: order.trainingApplication.photoName,
      photoType: order.trainingApplication.photoType,
      photoUrl: order.trainingApplication.photoUrl ?? order.trainingApplication.photoDataUrl ?? null,
      photoObjectKey: order.trainingApplication.photoObjectKey ?? null,
      attemptStatus: order.trainingApplication.attemptStatus,
      approvalStatus: order.trainingApplication.approvalStatus,
      crossCheckStatus: order.trainingApplication.crossCheckStatus,
      adminNotes: order.trainingApplication.adminNotes,
      approvedAt: order.trainingApplication.approvedAt?.toISOString() ?? null,
      approvedBy: order.trainingApplication.approvedBy,
      createdAt: order.trainingApplication.createdAt.toISOString(),
      updatedAt: order.trainingApplication.updatedAt.toISOString(),
    },
    refunds: order.refundRequests.map((refund) => ({
      id: refund.id,
      merchantRefundId: refund.merchantRefundId,
      phonePeRefundId: refund.phonePeRefundId ?? null,
      amountPaise: refund.amountPaise,
      reason: refund.reason,
      status: refund.status,
      createdAt: refund.createdAt.toISOString(),
      completedAt: refund.completedAt?.toISOString() ?? null,
      failedAt: refund.failedAt?.toISOString() ?? null,
      failureCode: refund.failureCode ?? null,
      failureMessage: refund.failureMessage ?? null,
    })),
    events: order.paymentEvents.map((event) => ({
      id: event.id,
      eventName: event.eventName,
      source: event.source,
      state: event.state ?? null,
      receivedAt: event.receivedAt.toISOString(),
      details: readPaymentEventDetails(event.payload),
    })),
  };
}

function getFallbackLegacyAmount() {
  const configured = Number(process.env.TRAINING_APPLICATION_FEE_PAISE ?? "");
  return Number.isFinite(configured) && configured >= 100 ? configured : 100;
}

export async function backfillLegacyTrainingApplications() {
  const legacyMessages = await prisma.contactMessage.findMany({
    where: {
      subject: {
        startsWith: TRAINING_APPLICATION_SUBJECT_PREFIX,
      },
    },
    orderBy: { createdAt: "asc" },
  });

  for (const message of legacyMessages) {
    const payload = parseTrainingApplicationMessage(message.message);
    if (!payload) continue;

    const application = await prisma.trainingApplication.upsert({
      where: { legacyMessageId: message.id },
      update: {
        serviceName: payload.serviceName,
        applicationDate: payload.applicationDate,
        candidateName: payload.candidateName,
        guardianName: payload.guardianName,
        aadhaarNo: payload.aadhaarNo ?? "",
        email: payload.email || message.email,
        gender: payload.gender,
        dateOfBirth: payload.dateOfBirth,
        addressLine: payload.addressLine,
        mandal: payload.mandal,
        district: payload.district,
        state: payload.state,
        pinCode: payload.pinCode,
        phone: payload.phone,
        residencePhone: payload.residencePhone,
        educationQualification: payload.educationQualification,
        occupation: payload.occupation,
        sponsoringOrganization: payload.sponsoringOrganization,
        photoName: payload.photoName,
        photoType: payload.photoType,
        photoUrl: payload.photoUrl ?? null,
        photoObjectKey: payload.photoObjectKey ?? null,
        photoDataUrl: payload.photoDataUrl ?? null,
        approvalStatus: payload.approvalStatus,
        crossCheckStatus: payload.crossCheckStatus,
        adminNotes: payload.adminNotes,
        approvedAt: payload.approvedAt ? new Date(payload.approvedAt) : null,
        approvedBy: payload.approvedBy,
      },
      create: {
        legacyMessageId: message.id,
        serviceName: payload.serviceName,
        applicationDate: payload.applicationDate,
        candidateName: payload.candidateName,
        guardianName: payload.guardianName,
        aadhaarNo: payload.aadhaarNo ?? "",
        email: payload.email || message.email,
        gender: payload.gender,
        dateOfBirth: payload.dateOfBirth,
        addressLine: payload.addressLine,
        mandal: payload.mandal,
        district: payload.district,
        state: payload.state,
        pinCode: payload.pinCode,
        phone: payload.phone,
        residencePhone: payload.residencePhone,
        educationQualification: payload.educationQualification,
        occupation: payload.occupation,
        sponsoringOrganization: payload.sponsoringOrganization,
        photoName: payload.photoName,
        photoType: payload.photoType,
        photoUrl: payload.photoUrl ?? null,
        photoObjectKey: payload.photoObjectKey ?? null,
        photoDataUrl: payload.photoDataUrl ?? null,
        attemptStatus: payload.attemptStatus,
        approvalStatus: payload.approvalStatus,
        crossCheckStatus: payload.crossCheckStatus,
        adminNotes: payload.adminNotes,
        approvedAt: payload.approvedAt ? new Date(payload.approvedAt) : null,
        approvedBy: payload.approvedBy,
        createdAt: payload.submittedAt ? new Date(payload.submittedAt) : message.createdAt,
      },
    });

    if (payload.paymentStatus === "NOT_STARTED" && !payload.paymentReference) {
      continue;
    }

    await prisma.paymentOrder.upsert({
      where: { merchantOrderId: buildLegacyMerchantOrderId(message.id) },
      update: {
        status: mapLegacyPaymentStatus(payload.paymentStatus),
        paymentReference: payload.paymentReference || null,
        refundEligible: payload.paymentStatus === "PAID",
        paidAt:
          payload.paymentStatus === "PAID"
            ? new Date(payload.approvedAt ?? payload.submittedAt)
            : null,
        latestEventName: "legacy.backfill",
      },
      create: {
        trainingApplicationId: application.id,
        environment: getCurrentPaymentEnvironment(),
        merchantOrderId: buildLegacyMerchantOrderId(message.id),
        redirectUrl: buildPhonePeRedirectUrl(buildLegacyMerchantOrderId(message.id)),
        status: mapLegacyPaymentStatus(payload.paymentStatus),
        amountPaise: getFallbackLegacyAmount(),
        paymentReference: payload.paymentReference || null,
        paidAt:
          payload.paymentStatus === "PAID"
            ? new Date(payload.approvedAt ?? payload.submittedAt)
            : null,
        refundEligible: payload.paymentStatus === "PAID",
        latestEventName: "legacy.backfill",
      },
    });
  }
}

export async function getAdminTrainingApplications(): Promise<TrainingApplicationRecord[]> {
  await backfillLegacyTrainingApplications();

  const applications = await prisma.trainingApplication.findMany({
    include: trainingApplicationAdminInclude,
    orderBy: { createdAt: "desc" },
  });

  return applications.map(mapTrainingApplicationEntity);
}

export async function getAdminPaymentOrders(): Promise<PaymentAdminRecord[]> {
  await backfillLegacyTrainingApplications();

  const paymentOrders = await prisma.paymentOrder.findMany({
    include: paymentOrderAdminInclude,
    orderBy: { createdAt: "desc" },
  });

  return paymentOrders.map(mapPaymentOrderAdminRecord);
}

export async function syncPaymentOrderFromStatus(
  order: PaymentOrder,
  status: OrderStatusResponse,
  source: "admin.refresh" | "return.status",
) {
  const paymentUpdate = buildPaymentUpdateFromOrderStatus(status);
  const applicationUpdate = buildApplicationUpdateFromPaymentState(paymentUpdate.status);
  const dedupeKey = buildEventDedupeKey([
    order.id,
    source,
    status.state,
    status.orderId,
    status.paymentDetails?.[0]?.transactionId,
    status.paymentDetails?.[0]?.timestamp,
    status.expireAt,
  ]);

  await prisma.$transaction([
    prisma.paymentOrder.update({
      where: { id: order.id },
      data: {
        ...paymentUpdate,
        phonePeOrderId: paymentUpdate.phonePeOrderId ?? order.phonePeOrderId,
        paidAt: paymentUpdate.paidAt ?? order.paidAt,
        failedAt: paymentUpdate.failedAt ?? order.failedAt,
        paymentReference: paymentUpdate.paymentReference ?? order.paymentReference,
      },
    }),
    prisma.trainingApplication.update({
      where: { id: order.trainingApplicationId },
      data: applicationUpdate,
    }),
    prisma.paymentEvent.upsert({
      where: { dedupeKey },
      update: {},
      create: {
        paymentOrderId: order.id,
        dedupeKey,
        eventName: "order.status.sync",
        source,
        state: status.state,
        payload: status as unknown as Prisma.InputJsonValue,
      },
    }),
  ]);
}

export async function syncRefundRequestFromStatus(
  refundRequest: RefundRequest,
  status: RefundStatusResponse,
) {
  const nextRefundState = mapRefundState(status.state);
  const orderState: PaymentOrderState =
    nextRefundState === "COMPLETED"
      ? "REFUNDED"
      : nextRefundState === "FAILED"
        ? "REFUND_FAILED"
        : "REFUND_PENDING";
  const firstDetail = status.paymentDetails?.[0];
  const dedupeKey = buildEventDedupeKey([
    refundRequest.paymentOrderId,
    "refund.status.sync",
    status.merchantRefundId,
    status.state,
    firstDetail?.transactionId,
    firstDetail?.timestamp,
  ]);

  await prisma.$transaction([
    prisma.refundRequest.update({
      where: { id: refundRequest.id },
      data: {
        status: nextRefundState,
        phonePeRefundId: firstDetail?.transactionId ?? refundRequest.phonePeRefundId,
        completedAt:
          nextRefundState === "COMPLETED"
            ? new Date(firstDetail?.timestamp ?? Date.now())
            : null,
        failedAt:
          nextRefundState === "FAILED"
            ? new Date(firstDetail?.timestamp ?? Date.now())
            : null,
        failureCode: firstDetail?.errorCode ?? null,
        failureMessage: firstDetail?.detailedErrorCode ?? null,
      },
    }),
    prisma.paymentOrder.update({
      where: { id: refundRequest.paymentOrderId },
      data: {
        status: orderState,
        refundEligible: false,
        latestEventName: "refund.status.sync",
        latestErrorCode: firstDetail?.errorCode ?? null,
        latestErrorMessage: firstDetail?.detailedErrorCode ?? null,
      },
    }),
    prisma.trainingApplication.updateMany({
      where: { paymentOrders: { some: { id: refundRequest.paymentOrderId } } },
      data: buildApplicationUpdateFromPaymentState(orderState),
    }),
    prisma.paymentEvent.upsert({
      where: { dedupeKey },
      update: {},
      create: {
        paymentOrderId: refundRequest.paymentOrderId,
        dedupeKey,
        eventName: "refund.status.sync",
        source: "refund.status",
        state: status.state,
        payload: status as unknown as Prisma.InputJsonValue,
      },
    }),
  ]);
}

export async function processPhonePeCallback(
  callback: CallbackResponse,
  rawBody: string,
  authorizationHeader: string,
) {
  const merchantOrderId =
    callback.payload.merchantOrderId ?? callback.payload.originalMerchantOrderId;
  if (!merchantOrderId) {
    throw new Error("Callback did not include a merchant order id.");
  }

  const order = await prisma.paymentOrder.findUnique({
    where: { merchantOrderId },
  });

  if (!order) {
    throw new Error("Payment order not found for callback.");
  }

  const paymentUpdate = buildPaymentUpdateFromCallback(callback);
  const applicationUpdate = buildApplicationUpdateFromPaymentState(paymentUpdate.status);
  const firstPaymentDetail = callback.payload.paymentDetails?.[0];
  const dedupeKey = buildEventDedupeKey([
    order.id,
    "webhook",
    CallbackType[callback.type] ?? String(callback.type),
    callback.payload.state,
    callback.payload.orderId,
    callback.payload.refundId,
    callback.payload.merchantRefundId,
    firstPaymentDetail?.transactionId,
    firstPaymentDetail?.timestamp,
  ]);

  await prisma.$transaction([
    prisma.paymentOrder.update({
      where: { id: order.id },
      data: {
        ...paymentUpdate,
        phonePeOrderId: paymentUpdate.phonePeOrderId ?? order.phonePeOrderId,
        paidAt: paymentUpdate.paidAt ?? order.paidAt,
        failedAt: paymentUpdate.failedAt ?? order.failedAt,
        paymentReference: paymentUpdate.paymentReference ?? order.paymentReference,
      },
    }),
    prisma.trainingApplication.update({
      where: { id: order.trainingApplicationId },
      data: applicationUpdate,
    }),
    prisma.paymentEvent.upsert({
      where: { dedupeKey },
      update: {},
      create: {
        paymentOrderId: order.id,
        dedupeKey,
        eventName: CallbackType[callback.type] ?? "callback",
        source: "webhook",
        state: callback.payload.state,
        authorizationHeader,
        payload: JSON.parse(rawBody) as Prisma.InputJsonValue,
      },
    }),
  ]);

  if (callback.payload.merchantRefundId) {
    const refundRequest = await prisma.refundRequest.findUnique({
      where: { merchantRefundId: callback.payload.merchantRefundId },
    });

    if (refundRequest) {
      const nextRefundState = mapRefundState(callback.payload.state);
      await prisma.refundRequest.update({
        where: { id: refundRequest.id },
        data: {
          status: nextRefundState,
          phonePeRefundId: callback.payload.refundId ?? refundRequest.phonePeRefundId,
          completedAt:
            nextRefundState === "COMPLETED"
              ? new Date(firstPaymentDetail?.timestamp ?? Date.now())
              : null,
          failedAt:
            nextRefundState === "FAILED"
              ? new Date(firstPaymentDetail?.timestamp ?? Date.now())
              : null,
          failureCode:
            firstPaymentDetail?.errorCode ?? callback.payload.errorCode ?? null,
          failureMessage:
            firstPaymentDetail?.detailedErrorCode ??
            callback.payload.detailedErrorCode ??
            null,
        },
      });
    }
  }
}

export async function getTrainingApplicationEntityById(id: string) {
  await backfillLegacyTrainingApplications();

  return prisma.trainingApplication.findUnique({
    where: { id },
    include: trainingApplicationAdminInclude,
  });
}

export async function getPaymentOrderEntityById(id: string) {
  await backfillLegacyTrainingApplications();

  return prisma.paymentOrder.findUnique({
    where: { id },
    include: paymentOrderAdminInclude,
  });
}

export async function getPaymentOrderByMerchantOrderId(merchantOrderId: string) {
  await backfillLegacyTrainingApplications();

  return prisma.paymentOrder.findUnique({
    where: { merchantOrderId },
    include: paymentOrderAdminInclude,
  });
}

export function isTrainingApplicationEntity(
  value: TrainingApplicationAdminEntity | null,
): value is TrainingApplicationAdminEntity {
  return Boolean(value);
}
