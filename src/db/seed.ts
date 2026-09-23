import { sql } from "drizzle-orm";
import { db } from "@/db";
import { vehicleMedia, vehicles } from "@/db/schema";
import { SEED_LISTINGS } from "@/db/seed-data";

let seedPromise: Promise<void> | null = null;

async function runSeed() {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(vehicles);

  if ((row?.count ?? 0) > 0) return;

  for (const listing of SEED_LISTINGS) {
    const [inserted] = await db
      .insert(vehicles)
      .values({
        slug: listing.slug,
        make: listing.make,
        model: listing.model,
        trim: listing.trim ?? null,
        year: listing.year,
        condition: listing.condition,
        bodyType: listing.bodyType ?? null,
        transmission: listing.transmission ?? null,
        fuelType: listing.fuelType ?? null,
        drivetrain: listing.drivetrain ?? null,
        engine: listing.engine ?? null,
        exteriorColor: listing.exteriorColor ?? null,
        interiorColor: listing.interiorColor ?? null,
        mileageKm: listing.mileageKm ?? null,
        priceNgn: listing.priceNgn ? String(listing.priceNgn) : null,
        priceOnRequest: listing.priceNgn ? false : true,
        status: listing.status ?? "available",
        clearance: listing.clearance ?? null,
        arrivalNote: listing.arrivalNote ?? null,
        badge: listing.badge ?? null,
        titleStatus: listing.titleStatus ?? null,
        description: listing.description,
        features: listing.features,
        specs: listing.specs ?? [],
        isDemo: listing.isDemo,
        featured: listing.featured ?? false,
        listingRank: listing.listingRank,
      })
      .onConflictDoNothing({ target: vehicles.slug })
      .returning({ id: vehicles.id });

    if (!inserted) continue;

    const mediaRows = [
      ...listing.images.map((image, index) => ({
        vehicleId: inserted.id,
        kind: "image" as const,
        url: image.url,
        platform: null,
        embedId: null,
        caption: image.caption ?? null,
        sortOrder: index,
      })),
      ...(listing.videos ?? []).map((video, index) => ({
        vehicleId: inserted.id,
        kind: "video" as const,
        url: video.url,
        platform: video.platform,
        embedId: video.embedId ?? null,
        caption: video.caption ?? null,
        sortOrder: 100 + index,
      })),
    ];

    if (mediaRows.length > 0) {
      await db.insert(vehicleMedia).values(mediaRows);
    }
  }
}

/**
 * Idempotent seeding so a fresh database is populated on first request.
 * Failures are swallowed (and logged) so the storefront still renders.
 */
export async function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runSeed().catch((error) => {
      console.error("[dashlink] seed failed", error);
      seedPromise = null;
    });
  }
  await seedPromise;
}
