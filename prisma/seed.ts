import { PrismaClient, ProgramLevel, EventStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.program.upsert({
    where: { slug: "scientific-beekeeping-foundation" },
    update: {},
    create: {
      title: "Scientific Beekeeping Foundation",
      slug: "scientific-beekeeping-foundation",
      summary:
        "Practical training for beginners covering colony biology, hive handling, safety, and seasonal management.",
      description:
        "A field-led foundation program for farmers, self-help groups, youth entrepreneurs, and institutional trainees. Participants learn bee biology, apiary layout, hive inspection, protective practices, harvesting hygiene, and responsible colony care.",
      duration: "5 days",
      level: ProgramLevel.FOUNDATION,
      fee: "As notified by the center",
      capacity: 30,
    },
  });

  await prisma.program.upsert({
    where: { slug: "queen-rearing-and-colony-multiplication" },
    update: {},
    create: {
      title: "Queen Rearing & Colony Multiplication",
      slug: "queen-rearing-and-colony-multiplication",
      summary:
        "Advanced instruction on queen cell preparation, selection, nucleus colonies, and sustainable multiplication.",
      description:
        "Designed for trained beekeepers and extension teams, this module focuses on genetic selection, grafting discipline, mating yard preparation, nucleus management, and record-led colony multiplication.",
      duration: "7 days",
      level: ProgramLevel.ADVANCED,
      fee: "As notified by the center",
      capacity: 20,
    },
  });

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
      location: "Honey House, API Culture Technology Center, Rajendranagar, Hyderabad",
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
