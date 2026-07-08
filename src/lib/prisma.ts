import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};
let prismaClient: PrismaClient | undefined;

function getRuntimeDatabaseUrl() {
  return process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "";
}

export const hasDatabaseUrl = Boolean(getRuntimeDatabaseUrl());

function isNeonConnectionString(connectionString: string) {
  return /neon\.tech|aws\.neon\.tech/i.test(connectionString);
}

function createPrismaClient() {
  const connectionString = getRuntimeDatabaseUrl();
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const adapter = isNeonConnectionString(connectionString)
    ? new PrismaNeon({ connectionString })
    : new PrismaPg({ connectionString });

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
