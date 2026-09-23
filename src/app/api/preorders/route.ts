import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { preorderRequests } from "@/db/schema";

export const dynamic = "force-dynamic";

function clean(value: unknown, max = 400) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function toInt(value: unknown, min: number, max: number) {
  const parsed = Number(clean(value, 12));
  if (!Number.isFinite(parsed)) return null;
  if (parsed < min || parsed > max) return null;
  return Math.trunc(parsed);
}

export async function GET() {
  try {
    const rows = await db
      .select({
        id: preorderRequests.id,
        make: preorderRequests.make,
        model: preorderRequests.model,
        status: preorderRequests.status,
        createdAt: preorderRequests.createdAt,
      })
      .from(preorderRequests)
      .orderBy(desc(preorderRequests.createdAt))
      .limit(10);
    return NextResponse.json({ items: rows });
  } catch (error) {
    console.error("[dashlink] preorder list failed", error);
    return NextResponse.json({ items: [] }, { status: 200 });
  }
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
  const make = clean(body.make, 80);

  if (fullName.length < 2) {
    return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 422 });
  }
  if (phone.replace(/\D/g, "").length < 7) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid phone number." },
      { status: 422 },
    );
  }
  if (make.length < 2) {
    return NextResponse.json(
      { ok: false, error: "Please tell us the make you are looking for." },
      { status: 422 },
    );
  }

  try {
    const [inserted] = await db
      .insert(preorderRequests)
      .values({
        fullName,
        phone,
        email: clean(body.email, 160) || null,
        make,
        model: clean(body.model, 120) || null,
        yearFrom: toInt(body.yearFrom, 1985, 2100),
        yearTo: toInt(body.yearTo, 1985, 2100),
        budgetMax: toInt(body.budgetMax, 0, 1_000_000_000),
        bodyType: clean(body.bodyType, 40) || null,
        transmission: clean(body.transmission, 40) || null,
        fuelType: clean(body.fuelType, 40) || null,
        exteriorColor: clean(body.exteriorColor, 60) || null,
        timeline: clean(body.timeline, 60) || null,
        notes: clean(body.notes, 2000) || null,
      })
      .returning({ id: preorderRequests.id });

    return NextResponse.json({ ok: true, id: inserted?.id ?? null });
  } catch (error) {
    console.error("[dashlink] preorder failed", error);
    return NextResponse.json(
      { ok: false, error: "We could not save your request. Please send it on WhatsApp." },
      { status: 500 },
    );
  }
}
