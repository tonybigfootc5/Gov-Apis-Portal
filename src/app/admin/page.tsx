import { redirect } from "next/navigation";
import { AdminConsole } from "@/components/admin-console";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mapTrainingApplicationRecord, TRAINING_APPLICATION_SUBJECT_PREFIX } from "@/lib/training-application";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const allowed = await requireAdmin();
  if (!allowed) redirect("/admin/login");
  const [programs, events, applicationMessages] = await Promise.all([
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
  const applications = applicationMessages
    .map(mapTrainingApplicationRecord)
    .filter((value): value is NonNullable<typeof value> => Boolean(value));
  return (
    <AdminConsole
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
