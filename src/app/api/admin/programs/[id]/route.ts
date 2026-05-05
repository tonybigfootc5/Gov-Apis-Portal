import { NextResponse } from "next/server";
import { adminUnauthorized, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { programSchema } from "@/lib/validators";

type Props = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Props) {
  if (!(await requireAdmin())) return adminUnauthorized();
  const { id } = await params;
  const parsed = programSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid program" }, { status: 400 });
  }
  const program = await prisma.program.update({
    where: { id },
    data: { ...parsed.data, fee: parsed.data.fee || null },
  });
  return NextResponse.json(program);
}

export async function DELETE(_request: Request, { params }: Props) {
  if (!(await requireAdmin())) return adminUnauthorized();
  const { id } = await params;
  await prisma.program.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
