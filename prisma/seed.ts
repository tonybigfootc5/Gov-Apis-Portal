import { config as loadEnv } from "dotenv";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { EventStatus, PrismaClient, ProgramLevel } from "../src/generated/prisma/client";
import { trainingProgramCatalog } from "../src/lib/training-programs";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env.production.local" });
loadEnv();

const connectionString =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  "postgresql://prisma:prisma@localhost:5432/prisma";
const adapter = /neon\.tech|aws\.neon\.tech/i.test(connectionString)
  ? new PrismaNeon({ connectionString })
  : new PrismaPg({ connectionString });
const prisma = new PrismaClient({
  adapter,
});

async function main() {
  for (const program of trainingProgramCatalog) {
    await prisma.program.upsert({
      where: { slug: program.slug },
      update: {
        title: program.title,
        summary: program.summary,
        description: program.description,
        duration: program.duration,
        level: ProgramLevel[program.level],
        fee: program.fee,
        capacity: program.capacity,
        batchStartsAt: new Date(program.batchStartsAt),
        enrollmentClosed: program.enrollmentClosed,
        popupEnabled: program.popupEnabled,
        published: program.published,
      },
      create: {
        title: program.title,
        slug: program.slug,
        summary: program.summary,
        description: program.description,
        duration: program.duration,
        level: ProgramLevel[program.level],
        fee: program.fee,
        capacity: program.capacity,
        batchStartsAt: new Date(program.batchStartsAt),
        enrollmentClosed: program.enrollmentClosed,
        popupEnabled: program.popupEnabled,
        published: program.published,
      },
    });
  }

  await prisma.event.upsert({
    where: { slug: "apiculture-technology-orientation" },
    update: {},
    create: {
      title: "Apiculture Technology Orientation",
      slug: "apiculture-technology-orientation",
      summary:
        "Open orientation on modern beekeeping, honey value chains, and rural enterprise opportunities.",
      description:
        "A public orientation for prospective trainees, farmer groups, and partner institutions. Sessions include center briefing, equipment demonstrations, and guidance on training enrollment.",
      location: "API CULTURE Technology Center, Rajendranagar, Hyderabad",
      startsAt: new Date("2026-06-12T10:00:00.000Z"),
      endsAt: new Date("2026-06-12T13:00:00.000Z"),
      status: EventStatus.UPCOMING,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
