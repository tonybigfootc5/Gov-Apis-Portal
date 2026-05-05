import { prisma } from "@/lib/prisma";
import { fallbackEvents, fallbackPrograms } from "@/lib/fallback-data";

function normalizeProgram<T extends { slug: string; title: string }>(program: T): T {
  if (program.slug !== "scientific-beekeeping-foundation") {
    return program;
  }

  return {
    ...program,
    title: "Beekeeping",
  };
}

export async function getPrograms() {
  if (!process.env.DATABASE_URL) return fallbackPrograms;
  try {
    const programs = await prisma.program.findMany({
      where: { published: true },
      orderBy: [{ level: "asc" }, { title: "asc" }],
    });
    return programs.map(normalizeProgram);
  } catch {
    return fallbackPrograms;
  }
}

export async function getProgram(slug: string) {
  if (!process.env.DATABASE_URL) {
    return fallbackPrograms.find((item) => item.slug === slug) ?? null;
  }
  try {
    const program = await prisma.program.findFirst({
      where: { slug, published: true },
    });
    return program ? normalizeProgram(program) : fallbackPrograms.find((item) => item.slug === slug) ?? null;
  } catch {
    return fallbackPrograms.find((item) => item.slug === slug) ?? null;
  }
}

export async function getEvents() {
  if (!process.env.DATABASE_URL) return fallbackEvents;
  try {
    return await prisma.event.findMany({
      where: { published: true },
      orderBy: { startsAt: "asc" },
    });
  } catch {
    return fallbackEvents;
  }
}

export async function getEvent(slug: string) {
  if (!process.env.DATABASE_URL) {
    return fallbackEvents.find((item) => item.slug === slug) ?? null;
  }
  try {
    const event = await prisma.event.findFirst({
      where: { slug, published: true },
    });
    return event ?? fallbackEvents.find((item) => item.slug === slug) ?? null;
  } catch {
    return fallbackEvents.find((item) => item.slug === slug) ?? null;
  }
}
