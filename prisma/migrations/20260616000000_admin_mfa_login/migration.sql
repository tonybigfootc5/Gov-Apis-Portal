CREATE TABLE "AdminBackupCodeUse" (
    "id" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminBackupCodeUse_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AdminBackupCodeUse_codeHash_key" ON "AdminBackupCodeUse"("codeHash");
