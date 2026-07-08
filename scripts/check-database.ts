import { config as loadEnv } from "dotenv";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env.production.local" });
loadEnv();

function getRuntimeDatabaseUrl() {
  return process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "";
}

function isNeonConnectionString(connectionString: string) {
  return /neon\.tech|aws\.neon\.tech/i.test(connectionString);
}

async function main() {
  const connectionString = getRuntimeDatabaseUrl();
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const adapter = isNeonConnectionString(connectionString)
    ? new PrismaNeon({ connectionString })
    : new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    const ping = await prisma.$queryRaw<Array<{ ok: number }>>`SELECT 1 AS ok`;
    const [
      programCount,
      eventCount,
      articleCount,
      galleryCount,
      applicationCount,
      paymentCount,
      contactCount,
    ] = await Promise.all([
      prisma.program.count(),
      prisma.event.count(),
      prisma.article.count(),
      prisma.galleryImage.count(),
      prisma.trainingApplication.count(),
      prisma.paymentOrder.count(),
      prisma.contactMessage.count(),
    ]);

    console.log("Database reachable:", ping[0]?.ok === 1 ? "yes" : "unknown");
    console.log("Programs:", programCount);
    console.log("Events:", eventCount);
    console.log("Articles:", articleCount);
    console.log("Gallery images:", galleryCount);
    console.log("Training applications:", applicationCount);
    console.log("Payment orders:", paymentCount);
    console.log("Contact messages:", contactCount);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Database check failed.");
  console.error(error);
  process.exit(1);
});
