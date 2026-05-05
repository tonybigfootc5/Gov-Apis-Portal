import { redirect } from "next/navigation";
import { AdminConsole } from "@/components/admin-console";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const allowed = await requireAdmin();
  if (!allowed) redirect("/admin/login");
  const [programs, events] = await Promise.all([
    prisma.program.findMany({ orderBy: { updatedAt: "desc" } }),
    prisma.event.findMany({ orderBy: { startsAt: "desc" } }),
  ]);
  return (
    <AdminConsole
      initialPrograms={programs.map((program) => ({
        ...program,
        updatedAt: program.updatedAt.toISOString(),
      }))}
      initialEvents={events.map((event) => ({
        ...event,
        startsAt: event.startsAt.toISOString(),
        endsAt: event.endsAt?.toISOString() ?? null,
        updatedAt: event.updatedAt.toISOString(),
      }))}
    />
  );
}
