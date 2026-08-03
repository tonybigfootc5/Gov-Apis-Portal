import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { validatePhonePeCallback } from "@/lib/phonepe";
import { processPhonePeCallback } from "@/lib/training-application-store";

export async function POST(request: Request) {
  const requestId = randomUUID();
  const authorizationHeader = request.headers.get("authorization") ?? "";
  const rawBody = await request.text();

  try {
    const callback = validatePhonePeCallback(authorizationHeader, rawBody);
    await processPhonePeCallback(callback, rawBody, authorizationHeader);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PhonePe webhook callback rejected", {
      requestId,
      hasAuthorizationHeader: Boolean(authorizationHeader),
      rawBodyLength: rawBody.length,
      error,
    });

    return NextResponse.json({ error: "Invalid webhook callback." }, { status: 401 });
  }
}
