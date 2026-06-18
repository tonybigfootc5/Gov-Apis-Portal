CREATE TYPE "ApplicationAttemptStatus" AS ENUM ('ATTEMPTED', 'SUBMITTED', 'PAYMENT_INITIATED', 'PAYMENT_FAILED', 'PAYMENT_COMPLETED');
CREATE TYPE "ApplicationApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "ApplicationCrossCheckStatus" AS ENUM ('PENDING', 'VERIFIED');
CREATE TYPE "PaymentProvider" AS ENUM ('PHONEPE');
CREATE TYPE "PaymentEnvironment" AS ENUM ('SANDBOX', 'PRODUCTION');
CREATE TYPE "PaymentOrderState" AS ENUM ('CREATED', 'PENDING', 'PAID', 'FAILED', 'EXPIRED', 'REFUND_PENDING', 'REFUNDED', 'REFUND_FAILED');
CREATE TYPE "RefundState" AS ENUM ('REQUESTED', 'COMPLETED', 'FAILED');

CREATE TABLE "TrainingApplication" (
    "id" TEXT NOT NULL,
    "legacyMessageId" TEXT,
    "serviceName" TEXT NOT NULL,
    "applicationDate" TEXT NOT NULL,
    "candidateName" TEXT NOT NULL,
    "guardianName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "addressLine" TEXT NOT NULL,
    "mandal" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pinCode" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "residencePhone" TEXT NOT NULL,
    "educationQualification" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "sponsoringOrganization" TEXT NOT NULL,
    "photoName" TEXT NOT NULL,
    "photoType" TEXT NOT NULL,
    "photoUrl" TEXT,
    "photoObjectKey" TEXT,
    "photoDataUrl" TEXT,
    "attemptStatus" "ApplicationAttemptStatus" NOT NULL DEFAULT 'SUBMITTED',
    "approvalStatus" "ApplicationApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "crossCheckStatus" "ApplicationCrossCheckStatus" NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT NOT NULL DEFAULT '',
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingApplication_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PaymentOrder" (
    "id" TEXT NOT NULL,
    "trainingApplicationId" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL DEFAULT 'PHONEPE',
    "environment" "PaymentEnvironment" NOT NULL,
    "merchantOrderId" TEXT NOT NULL,
    "phonePeOrderId" TEXT,
    "checkoutUrl" TEXT,
    "redirectUrl" TEXT NOT NULL,
    "status" "PaymentOrderState" NOT NULL DEFAULT 'CREATED',
    "amountPaise" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "paymentReference" TEXT,
    "paidAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "refundEligible" BOOLEAN NOT NULL DEFAULT false,
    "latestErrorCode" TEXT,
    "latestErrorMessage" TEXT,
    "latestEventName" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentOrder_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PaymentEvent" (
    "id" TEXT NOT NULL,
    "paymentOrderId" TEXT NOT NULL,
    "dedupeKey" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "state" TEXT,
    "authorizationHeader" TEXT,
    "payload" JSONB NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RefundRequest" (
    "id" TEXT NOT NULL,
    "paymentOrderId" TEXT NOT NULL,
    "merchantRefundId" TEXT NOT NULL,
    "phonePeRefundId" TEXT,
    "amountPaise" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "requestedBy" TEXT,
    "status" "RefundState" NOT NULL DEFAULT 'REQUESTED',
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "failureCode" TEXT,
    "failureMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefundRequest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TrainingApplication_legacyMessageId_key" ON "TrainingApplication"("legacyMessageId");
CREATE UNIQUE INDEX "PaymentOrder_merchantOrderId_key" ON "PaymentOrder"("merchantOrderId");
CREATE UNIQUE INDEX "PaymentEvent_dedupeKey_key" ON "PaymentEvent"("dedupeKey");
CREATE UNIQUE INDEX "RefundRequest_merchantRefundId_key" ON "RefundRequest"("merchantRefundId");

CREATE INDEX "PaymentOrder_trainingApplicationId_createdAt_idx" ON "PaymentOrder"("trainingApplicationId", "createdAt" DESC);
CREATE INDEX "PaymentOrder_status_createdAt_idx" ON "PaymentOrder"("status", "createdAt" DESC);
CREATE INDEX "PaymentEvent_paymentOrderId_receivedAt_idx" ON "PaymentEvent"("paymentOrderId", "receivedAt" DESC);
CREATE INDEX "RefundRequest_paymentOrderId_createdAt_idx" ON "RefundRequest"("paymentOrderId", "createdAt" DESC);
CREATE INDEX "RefundRequest_status_createdAt_idx" ON "RefundRequest"("status", "createdAt" DESC);

ALTER TABLE "PaymentOrder" ADD CONSTRAINT "PaymentOrder_trainingApplicationId_fkey" FOREIGN KEY ("trainingApplicationId") REFERENCES "TrainingApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PaymentEvent" ADD CONSTRAINT "PaymentEvent_paymentOrderId_fkey" FOREIGN KEY ("paymentOrderId") REFERENCES "PaymentOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RefundRequest" ADD CONSTRAINT "RefundRequest_paymentOrderId_fkey" FOREIGN KEY ("paymentOrderId") REFERENCES "PaymentOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
