import { redirect } from "next/navigation";
import { AdminConsole } from "@/components/admin-console";
import { requireAdmin } from "@/lib/auth";
import { fallbackEvents, fallbackPrograms } from "@/lib/fallback-data";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import { mapTrainingApplicationRecord, TRAINING_APPLICATION_SUBJECT_PREFIX } from "@/lib/training-application";

export const dynamic = "force-dynamic";

type AdminProgram = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  duration: string;
  level: "FOUNDATION" | "ADVANCED" | "PROFESSIONAL";
  fee: string | null;
  capacity: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type AdminEvent = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  location: string;
  startsAt: Date;
  endsAt: Date | null;
  status: "UPCOMING" | "COMPLETED" | "CANCELLED";
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export default async function AdminPage() {
  const allowed = await requireAdmin();
  if (!allowed) redirect("/admin/login");

  let programs: AdminProgram[] = fallbackPrograms.map((program) => ({
    ...program,
    level: program.level as AdminProgram["level"],
    fee: program.fee ?? null,
  }));
  let events: AdminEvent[] = fallbackEvents.map((event) => ({
    ...event,
    status: event.status as AdminEvent["status"],
    endsAt: event.endsAt ?? null,
  }));
  let applications: NonNullable<ReturnType<typeof mapTrainingApplicationRecord>>[] = [];

  if (hasDatabaseUrl) {
    const [dbPrograms, dbEvents, applicationMessages] = await Promise.all([
      prisma.program.findMany({ orderBy: { updatedAt: "desc" } }),
      prisma.event.findMany({ orderBy: { startsAt: "desc" } }),
      prisma.contactMessage.findMany({
        where: {
          subject: {
            startsWith: TRAINING_APPLICATION_SUBJECT_PREFIX,
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    programs = dbPrograms.map((program) => ({
      ...program,
      level: program.level,
      fee: program.fee ?? null,
    }));
    events = dbEvents.map((event) => ({
      ...event,
      status: event.status,
      endsAt: event.endsAt ?? null,
    }));
    applications = applicationMessages
      .map(mapTrainingApplicationRecord)
      .filter((value): value is NonNullable<typeof value> => Boolean(value));
  }

  return (
    <AdminConsole
      databaseConfigured={hasDatabaseUrl}
      initialApplications={applications}
      initialPrograms={programs.map((program: (typeof programs)[number]) => ({
        ...program,
        updatedAt: program.updatedAt.toISOString(),
      }))}
      initialEvents={events.map((event: (typeof events)[number]) => ({
        ...event,
        startsAt: event.startsAt.toISOString(),
        endsAt: event.endsAt?.toISOString() ?? null,
        updatedAt: event.updatedAt.toISOString(),
      }))}
    />
  );
}
