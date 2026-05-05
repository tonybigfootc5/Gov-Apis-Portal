import "dotenv/config";
import { defineConfig } from "prisma/config";

const fallbackDatabaseUrl = "postgresql://prisma:prisma@localhost:5432/prisma";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? fallbackDatabaseUrl,
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
