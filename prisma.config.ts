import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env.production.local" });
loadEnv();

const fallbackDatabaseUrl = "postgresql://prisma:prisma@localhost:5432/prisma";
const prismaCliUrl =
  process.env.DIRECT_DATABASE_URL ??
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL_UNPOOLED ??
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.DATABASE_URL ??
  fallbackDatabaseUrl;

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: prismaCliUrl,
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
