import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    return NextResponse.json({
      ok: true,
      status: "ok",
      service: "dashlink-integrated-autos",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[dashlink] health check failed", error);
    return NextResponse.json(
      {
        status: "degraded",
        service: "dashlink-integrated-autos",
        database: "unavailable",
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  }
}
