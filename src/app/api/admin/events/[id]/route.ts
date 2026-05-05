import { NextResponse } from "next/server";
import { adminUnauthorized, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { eventSchema } from "@/lib/validators";

type Props = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Props) {
  if (!(await requireAdmin())) return adminUnauthorized();
  const { id } = await params;
  const parsed = eventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid event" }, { status: 400 });
  }
  const event = await prisma.event.update({ where: { id }, data: parsed.data });
  return NextResponse.json(event);
}

export async function DELETE(_request: Request, { params }: Props) {
  if (!(await requireAdmin())) return adminUnauthorized();
  const { id } = await params;
  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
