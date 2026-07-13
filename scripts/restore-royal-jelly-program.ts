import { config as loadEnv } from "dotenv";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, ProgramLevel } from "../src/generated/prisma/client";
import { trainingProgramCatalog } from "../src/lib/training-programs";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env.production.local" });
loadEnv();

const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL or POSTGRES_URL is required.");
}

const adapter = /neon\.tech|aws\.neon\.tech/i.test(connectionString)
  ? new PrismaNeon({ connectionString })
  : new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });
function getRoyalJellyProgram() {
  const program = trainingProgramCatalog.find((item) => item.slug === "royal-jelly-production");
  if (!program) {
    throw new Error("Royal Jelly Production is missing from the training catalog.");
  }
  return program;
}

async function main() {
  const royalJellyProgram = getRoyalJellyProgram();
  const program = await prisma.program.upsert({
    where: { slug: royalJellyProgram.slug },
    update: {
      title: royalJellyProgram.title,
      summary: royalJellyProgram.summary,
      description: royalJellyProgram.description,
      duration: royalJellyProgram.duration,
      level: ProgramLevel[royalJellyProgram.level],
      fee: royalJellyProgram.fee,
      capacity: royalJellyProgram.capacity,
      batchStartsAt: new Date(royalJellyProgram.batchStartsAt),
      enrollmentClosed: false,
      popupEnabled: true,
      published: true,
    },
    create: {
      title: royalJellyProgram.title,
      slug: royalJellyProgram.slug,
      summary: royalJellyProgram.summary,
      description: royalJellyProgram.description,
      duration: royalJellyProgram.duration,
      level: ProgramLevel[royalJellyProgram.level],
      fee: royalJellyProgram.fee,
      capacity: royalJellyProgram.capacity,
      batchStartsAt: new Date(royalJellyProgram.batchStartsAt),
      enrollmentClosed: false,
      popupEnabled: true,
      published: true,
    },
  });

  const livePrograms = await prisma.program.findMany({
    where: { published: true },
    orderBy: [{ level: "asc" }, { title: "asc" }],
    select: { title: true, slug: true, published: true, popupEnabled: true, enrollmentClosed: true },
  });

  console.log(JSON.stringify({ restored: program.slug, livePrograms }, null, 2));
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
