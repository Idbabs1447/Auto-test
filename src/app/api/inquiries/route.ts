import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { inquiries, vehicles } from "@/db/schema";

export const dynamic = "force-dynamic";

function clean(value: unknown, max = 500) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const fullName = clean(body.fullName, 120);
  const phone = clean(body.phone, 40);
  const email = clean(body.email, 160);
  const message = clean(body.message, 2000);
  const vehicleSlug = clean(body.vehicleSlug, 160);
  const channel = clean(body.channel, 20) || "form";

  if (fullName.length < 2) {
    return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 422 });
  }
  if (phone.replace(/\D/g, "").length < 7) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid phone number." },
      { status: 422 },
    );
  }
  if (message.length < 5) {
    return NextResponse.json(
      { ok: false, error: "Please tell us a little about what you need." },
      { status: 422 },
    );
  }

  try {
    let vehicleId: number | null = null;
    if (vehicleSlug) {
      const rows = await db
        .select({ id: vehicles.id })
        .from(vehicles)
        .where(eq(vehicles.slug, vehicleSlug))
        .limit(1);
      vehicleId = rows[0]?.id ?? null;
    }

    const [inserted] = await db
      .insert(inquiries)
      .values({
        vehicleId,
        vehicleSlug: vehicleSlug || clean(body.vehicleTitle, 160) || null,
        fullName,
        phone,
        email: email || null,
        message,
        channel,
      })
      .returning({ id: inquiries.id });

    return NextResponse.json({ ok: true, id: inserted?.id ?? null });
  } catch (error) {
    console.error("[dashlink] inquiry failed", error);
    return NextResponse.json(
      { ok: false, error: "We could not save your enquiry. Please use WhatsApp." },
      { status: 500 },
    );
  }
}
