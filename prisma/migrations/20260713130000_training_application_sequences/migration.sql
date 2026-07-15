-- Add durable application and batch sequence numbers for new training applications.
ALTER TABLE "TrainingApplication" ADD COLUMN "applicationNumber" INTEGER;
ALTER TABLE "TrainingApplication" ADD COLUMN "batchCode" TEXT;
ALTER TABLE "TrainingApplication" ADD COLUMN "batchSequenceNumber" INTEGER;

CREATE UNIQUE INDEX "TrainingApplication_applicationNumber_key" ON "TrainingApplication"("applicationNumber");
CREATE UNIQUE INDEX "TrainingApplication_batchCode_batchSequenceNumber_key" ON "TrainingApplication"("batchCode", "batchSequenceNumber");
CREATE INDEX "TrainingApplication_batchCode_batchSequenceNumber_idx" ON "TrainingApplication"("batchCode", "batchSequenceNumber");
