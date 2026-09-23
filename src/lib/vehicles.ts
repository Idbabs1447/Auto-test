import { and, asc, desc, eq, gte, ilike, inArray, lte, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { ensureSeeded } from "@/db/seed";
import { vehicleMedia, vehicles, type VehicleTableRow } from "@/db/schema";
import { formatNaira, vehicleTitle, vehicleWhatsAppLink } from "@/lib/site";
import type {
  FacetOption,
  InventoryFacets,
  InventoryResult,
  SortKey,
  Vehicle,
  VehicleFilters,
  VehicleStatus,
} from "@/lib/types";

export const DEFAULT_PER_PAGE = 12;

function toVehicle(
  row: VehicleTableRow,
  media: { kind: string; url: string; platform: string | null; embedId: string | null; caption: string | null; sortOrder: number }[],
): Vehicle {
  const sorted = [...media].sort((a, b) => a.sortOrder - b.sortOrder);
  const images = sorted
    .filter((item) => item.kind === "image")
    .map((item) => ({ url: item.url, caption: item.caption }));

  const videos = sorted
    .filter((item) => item.kind === "video")
    .map((item) => ({
      platform: (item.platform ?? "instagram") as "youtube" | "tiktok" | "instagram",
      url: item.url,
      caption: item.caption,
      embedId: item.embedId,
    }));

  const priceNgn = row.priceNgn === null ? null : Number(row.priceNgn);
  const priceOnRequest = row.priceOnRequest || priceNgn === null;
  const title = vehicleTitle({
    year: row.year,
    make: row.make,
    model: row.model,
    trim: row.trim,
  });

  return {
    id: row.id,
    slug: row.slug,
    make: row.make,
    model: row.model,
    trim: row.trim,
    title,
    year: row.year,
    condition: row.condition,
    bodyType: row.bodyType,
    transmission: row.transmission,
    fuelType: row.fuelType,
    drivetrain: row.drivetrain,
    engine: row.engine,
    exteriorColor: row.exteriorColor,
    interiorColor: row.interiorColor,
    mileageKm: row.mileageKm,
    priceNgn,
    priceOnRequest,
    priceLabel: priceOnRequest ? "Contact for Price" : formatNaira(priceNgn),
    status: (row.status as VehicleStatus) ?? "available",
    clearance: row.clearance,
    arrivalNote: row.arrivalNote,
    badge: row.badge,
    titleStatus: row.titleStatus,
    location: row.location,
    description: row.description,
    features: row.features ?? [],
    specs: row.specs ?? [],
    isDemo: row.isDemo,
    featured: row.featured,
    createdAt: row.createdAt.toISOString(),
    images,
    coverImage: images[0]?.url ?? "",
    videos,
    whatsappUrl: vehicleWhatsAppLink({
      title,
      slug: row.slug,
      priceLabel: priceOnRequest ? "Price on request" : formatNaira(priceNgn),
    }),
  };
}

function buildWhere(filters: VehicleFilters): SQL | undefined {
  const clauses: SQL[] = [];

  if (filters.demoOnly) {
    clauses.push(eq(vehicles.isDemo, true));
  } else if (filters.includeDemo === false) {
    clauses.push(eq(vehicles.isDemo, false));
  }

  if (filters.status && filters.status !== "all") {
    clauses.push(eq(vehicles.status, filters.status));
  }

  if (filters.makes?.length) clauses.push(inArray(vehicles.make, filters.makes));
  if (filters.models?.length) clauses.push(inArray(vehicles.model, filters.models));
  if (filters.bodyTypes?.length) clauses.push(inArray(vehicles.bodyType, filters.bodyTypes));
  if (filters.conditions?.length) clauses.push(inArray(vehicles.condition, filters.conditions));
  if (filters.transmissions?.length)
    clauses.push(inArray(vehicles.transmission, filters.transmissions));
  if (filters.driveTypes?.length) clauses.push(inArray(vehicles.drivetrain, filters.driveTypes));

  if (filters.yearMin) clauses.push(gte(vehicles.year, filters.yearMin));
  if (filters.yearMax) clauses.push(lte(vehicles.year, filters.yearMax));

  if (filters.priceMin) clauses.push(gte(vehicles.priceNgn, String(filters.priceMin)));
  if (filters.priceMax) clauses.push(lte(vehicles.priceNgn, String(filters.priceMax)));

  const q = filters.q?.trim();
  if (q) {
    const term = `%${q}%`;
    const search = or(
      ilike(vehicles.make, term),
      ilike(vehicles.model, term),
      ilike(vehicles.trim, term),
      ilike(vehicles.bodyType, term),
      ilike(vehicles.condition, term),
      ilike(vehicles.description, term),
      sql`cast(${vehicles.year} as text) ilike ${term}`,
      sql`concat(${vehicles.year}, ' ', ${vehicles.make}, ' ', ${vehicles.model}) ilike ${term}`,
    );
    if (search) clauses.push(search);
  }

  if (clauses.length === 0) return undefined;
  return and(...clauses);
}

function orderBy(sort: SortKey | undefined) {
  switch (sort) {
    case "price_asc":
      return [sql`${vehicles.priceNgn} asc nulls last`, asc(vehicles.listingRank)];
    case "price_desc":
      return [sql`${vehicles.priceNgn} desc nulls last`, asc(vehicles.listingRank)];
    case "year_desc":
      return [desc(vehicles.year), asc(vehicles.listingRank)];
    case "year_asc":
      return [asc(vehicles.year), asc(vehicles.listingRank)];
    default:
      return [asc(vehicles.isDemo), asc(vehicles.listingRank), desc(vehicles.createdAt)];
  }
}

async function attachMedia(rows: VehicleTableRow[]): Promise<Vehicle[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((row) => row.id);
  const media = await db
    .select()
    .from(vehicleMedia)
    .where(inArray(vehicleMedia.vehicleId, ids))
    .orderBy(asc(vehicleMedia.sortOrder));

  return rows.map((row) => toVehicle(row, media.filter((item) => item.vehicleId === row.id)));
}

async function facetsFrom(where: SQL | undefined): Promise<InventoryFacets> {
  const base = <T extends SQL | undefined>(extra?: T) =>
    extra ? (where ? and(where, extra) : extra) : where;

  const [makeRows, modelRows, bodyRows, conditionRows, transmissionRows, bounds, countRows] =
    await Promise.all([
      db
        .select({ value: vehicles.make, count: sql<number>`count(*)::int` })
        .from(vehicles)
        .where(base())
        .groupBy(vehicles.make)
        .orderBy(asc(vehicles.make)),
      db
        .select({ value: vehicles.model, count: sql<number>`count(*)::int` })
        .from(vehicles)
        .where(base())
        .groupBy(vehicles.model)
        .orderBy(asc(vehicles.model)),
      db
        .select({ value: vehicles.bodyType, count: sql<number>`count(*)::int` })
        .from(vehicles)
        .where(base())
        .groupBy(vehicles.bodyType)
        .orderBy(asc(vehicles.bodyType)),
      db
        .select({ value: vehicles.condition, count: sql<number>`count(*)::int` })
        .from(vehicles)
        .where(base())
        .groupBy(vehicles.condition)
        .orderBy(asc(vehicles.condition)),
      db
        .select({ value: vehicles.transmission, count: sql<number>`count(*)::int` })
        .from(vehicles)
        .where(base())
        .groupBy(vehicles.transmission)
        .orderBy(asc(vehicles.transmission)),
      db
        .select({
          minYear: sql<number | null>`min(${vehicles.year})`,
          maxYear: sql<number | null>`max(${vehicles.year})`,
          minPrice: sql<number | null>`min(${vehicles.priceNgn})`,
          maxPrice: sql<number | null>`max(${vehicles.priceNgn})`,
        })
        .from(vehicles)
        .where(base()),
      db
        .select({
          total: sql<number>`count(*)::int`,
          realCount: sql<number>`count(*) filter (where ${vehicles.isDemo} = false)::int`,
          demoCount: sql<number>`count(*) filter (where ${vehicles.isDemo} = true)::int`,
          availableCount: sql<number>`count(*) filter (where ${vehicles.status} = 'available')::int`,
        })
        .from(vehicles)
        .where(base()),
    ]);

  const toOptions = (rows: { value: string | null; count: number }[]): FacetOption[] =>
    rows
      .filter((row): row is { value: string; count: number } => Boolean(row.value))
      .map((row) => ({ value: row.value, count: row.count }));

  const boundsRow = bounds[0];
  const countRow = countRows[0];

  return {
    makes: toOptions(makeRows),
    models: toOptions(modelRows),
    bodyTypes: toOptions(bodyRows),
    conditions: toOptions(conditionRows),
    transmissions: toOptions(transmissionRows),
    yearRange: {
      min: boundsRow?.minYear ?? 2005,
      max: boundsRow?.maxYear ?? new Date().getFullYear(),
    },
    priceRange: {
      min: boundsRow?.minPrice ? Math.floor(boundsRow.minPrice) : 0,
      max: boundsRow?.maxPrice ?? 0,
    },
    total: countRow?.total ?? 0,
    realCount: countRow?.realCount ?? 0,
    demoCount: countRow?.demoCount ?? 0,
    availableCount: countRow?.availableCount ?? 0,
  };
}

export async function getInventory(filters: VehicleFilters = {}): Promise<InventoryResult> {
  await ensureSeeded();

  const page = Math.max(1, filters.page ?? 1);
  const perPage = filters.perPage ?? DEFAULT_PER_PAGE;
  const where = buildWhere(filters);

  const [rows, countRows, facets] = await Promise.all([
    db
      .select()
      .from(vehicles)
      .where(where)
      .orderBy(...orderBy(filters.sort))
      .limit(perPage)
      .offset((page - 1) * perPage),
    db.select({ count: sql<number>`count(*)::int` }).from(vehicles).where(where),
    facetsFrom(
      filters.demoOnly
        ? eq(vehicles.isDemo, true)
        : filters.includeDemo === false
          ? eq(vehicles.isDemo, false)
          : undefined,
    ),
  ]);

  const total = countRows[0]?.count ?? 0;

  return {
    items: await attachMedia(rows),
    total,
    page,
    perPage,
    pageCount: Math.max(1, Math.ceil(total / perPage)),
    facets,
  };
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  await ensureSeeded();
  const rows = await db.select().from(vehicles).where(eq(vehicles.slug, slug)).limit(1);
  if (rows.length === 0) return null;
  const [vehicle] = await attachMedia(rows);
  return vehicle ?? null;
}

export async function getVehiclesBySlugs(slugs: string[]): Promise<Vehicle[]> {
  await ensureSeeded();
  if (slugs.length === 0) return [];
  const rows = await db.select().from(vehicles).where(inArray(vehicles.slug, slugs));
  const items = await attachMedia(rows);
  return slugs
    .map((slug) => items.find((item) => item.slug === slug))
    .filter((item): item is Vehicle => Boolean(item));
}

export async function getFeaturedVehicles(limit = 6): Promise<Vehicle[]> {
  await ensureSeeded();
  const rows = await db
    .select()
    .from(vehicles)
    .where(and(eq(vehicles.isDemo, false), eq(vehicles.status, "available")))
    .orderBy(asc(vehicles.listingRank))
    .limit(limit);
  return attachMedia(rows);
}

export async function getDemoVehicles(limit = 4): Promise<Vehicle[]> {
  await ensureSeeded();
  const rows = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.isDemo, true))
    .orderBy(asc(vehicles.listingRank))
    .limit(limit);
  return attachMedia(rows);
}

export async function getSimilarVehicles(vehicle: Vehicle, limit = 4): Promise<Vehicle[]> {
  await ensureSeeded();
  const rows = await db
    .select()
    .from(vehicles)
    .where(
      and(
        eq(vehicles.status, "available"),
        sql`${vehicles.id} <> ${vehicle.id}`,
        or(
          eq(vehicles.bodyType, vehicle.bodyType ?? vehicle.model),
          eq(vehicles.make, vehicle.make),
        )!,
      ),
    )
    .orderBy(asc(vehicles.isDemo), asc(vehicles.listingRank))
    .limit(limit);

  const items = await attachMedia(rows);
  if (items.length >= limit) return items;

  const fallbackRows = await db
    .select()
    .from(vehicles)
    .where(and(eq(vehicles.status, "available"), sql`${vehicles.id} <> ${vehicle.id}`))
    .orderBy(asc(vehicles.isDemo), asc(vehicles.listingRank))
    .limit(limit);

  const fallback = await attachMedia(fallbackRows);
  const merged = [...items];
  for (const item of fallback) {
    if (merged.length >= limit) break;
    if (!merged.some((existing) => existing.slug === item.slug)) merged.push(item);
  }
  return merged;
}

export async function getInventorySummary() {
  await ensureSeeded();
  const [row] = await db
    .select({
      total: sql<number>`count(*)::int`,
      realCount: sql<number>`count(*) filter (where ${vehicles.isDemo} = false)::int`,
      availableCount: sql<number>`count(*) filter (where ${vehicles.status} = 'available')::int`,
      makeCount: sql<number>`count(distinct ${vehicles.make})::int`,
      arrivals: sql<number>`count(*) filter (where ${vehicles.badge} is not null)::int`,
    })
    .from(vehicles);

  return {
    total: row?.total ?? 0,
    realCount: row?.realCount ?? 0,
    availableCount: row?.availableCount ?? 0,
    makeCount: row?.makeCount ?? 0,
    arrivals: row?.arrivals ?? 0,
  };
}

export async function getMakeShowcase() {
  await ensureSeeded();
  const rows = await db
    .select({
      make: vehicles.make,
      count: sql<number>`count(*)::int`,
      image: sql<string | null>`min(${vehicleMedia.url})`,
    })
    .from(vehicles)
    .leftJoin(vehicleMedia, eq(vehicleMedia.vehicleId, vehicles.id))
    .where(and(eq(vehicleMedia.kind, "image"), eq(vehicleMedia.sortOrder, 0)))
    .groupBy(vehicles.make)
    .orderBy(desc(sql`count(*)`));

  const priority = ["Toyota", "Lexus", "Mercedes-Benz", "Honda", "Hyundai", "Ford", "Kia"];
  return rows.sort((a, b) => {
    const ai = priority.indexOf(a.make);
    const bi = priority.indexOf(b.make);
    if (ai === -1 && bi === -1) return b.count - a.count;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}
