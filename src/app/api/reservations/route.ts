import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { reservations, vehicles } from "@/db/schema";

export const dynamic = "force-dynamic";

function clean(value: unknown, max = 400) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function makeReference() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const random = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `DL-R-${stamp}${random}`;
}

/**
 * Reservation interest. Kept intentionally separate from any payment flow so
 * online reservation + payment can be switched on later without a redesign.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const fullName = clean(body.fullName, 120);
  const phone = clean(body.phone, 40);
  const vehicleSlug = clean(body.vehicleSlug, 160);

  if (fullName.length < 2) {
    return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 422 });
  }
  if (phone.replace(/\D/g, "").length < 7) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid phone number." },
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

    const reference = makeReference();
    const [inserted] = await db
      .insert(reservations)
      .values({
        vehicleId,
        vehicleSlug: vehicleSlug || null,
        reference,
        fullName,
        phone,
        preferredDate: clean(body.preferredDate, 40) || null,
        inspectionMode: clean(body.inspectionMode, 40) || null,
        notes: clean(body.notes, 2000) || null,
        status: "interest_recorded",
        paymentStatus: "not_started",
      })
      .returning({ id: reservations.id, reference: reservations.reference });

    return NextResponse.json({ ok: true, id: inserted?.id ?? null, reference: inserted?.reference ?? reference });
  } catch (error) {
    console.error("[dashlink] reservation failed", error);
    return NextResponse.json(
      { ok: false, error: "We could not save your reservation request." },
      { status: 500 },
    );
  }
}
