import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};
let prismaClient: PrismaClient | undefined;

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
    errorFormat: "minimal",
  });
}

function getPrismaClient() {
  if (process.env.NODE_ENV === "production") {
    prismaClient ??= createPrismaClient();
    return prismaClient;
  }

  globalForPrisma.prisma ??= createPrismaClient();
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, property, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
