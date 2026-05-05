import { NextResponse } from "next/server";
import { adminUnauthorized, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { eventSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireAdmin())) return adminUnauthorized();
  const events = await prisma.event.findMany({ orderBy: { startsAt: "desc" } });
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return adminUnauthorized();
  const parsed = eventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid event" }, { status: 400 });
  }
  const event = await prisma.event.create({ data: parsed.data });
  return NextResponse.json(event, { status: 201 });
}
