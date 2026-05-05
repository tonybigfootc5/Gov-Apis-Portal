import { createHash } from "crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = contactSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form fields and try again." }, { status: 400 });
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ipHash = ip ? createHash("sha256").update(ip).digest("hex") : undefined;

  try {
    await prisma.contactMessage.create({
      data: {
        ...parsed.data,
        phone: parsed.data.phone || null,
        ipHash,
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Message storage is temporarily unavailable." }, { status: 503 });
  }
}
