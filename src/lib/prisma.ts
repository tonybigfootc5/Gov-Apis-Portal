import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    errorFormat: "minimal",
  });

if (process.env.NODE_ENV !== "production" && process.env.DATABASE_URL) {
  globalForPrisma.prisma = prisma;
}
