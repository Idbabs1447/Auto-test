import { NextResponse } from "next/server";
import { parseInventoryFilters, type RawParams } from "@/lib/filters";
import { getInventory, getVehiclesBySlugs } from "@/lib/vehicles";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slugsParam = url.searchParams.get("slugs");

  try {
    if (slugsParam) {
      const slugs = slugsParam
        .split(",")
        .map((slug) => slug.trim())
        .filter(Boolean)
        .slice(0, 12);
      const items = await getVehiclesBySlugs(slugs);
      return NextResponse.json({ items });
    }

    const raw: RawParams = {};
    url.searchParams.forEach((value, key) => {
      const existing = raw[key];
      if (existing === undefined) raw[key] = value;
      else if (Array.isArray(existing)) existing.push(value);
      else raw[key] = [existing, value];
    });

    const filters = parseInventoryFilters(raw);
    if (url.searchParams.has("perPage")) {
      filters.perPage = Math.min(48, Math.max(1, Number(url.searchParams.get("perPage")) || 12));
    }

    const result = await getInventory(filters);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[dashlink] /api/vehicles failed", error);
    return NextResponse.json({ error: "Unable to load inventory right now." }, { status: 500 });
  }
}
