import type { SortKey, VehicleFilters, VehicleStatus } from "@/lib/types";

export type RawParams = Record<string, string | string[] | undefined>;

export const PRICE_PRESETS = [
  { label: "Any price", min: undefined, max: undefined },
  { label: "Under ₦20m", min: undefined, max: 20_000_000 },
  { label: "₦20m – ₦30m", min: 20_000_000, max: 30_000_000 },
  { label: "₦30m – ₦45m", min: 30_000_000, max: 45_000_000 },
  { label: "₦45m – ₦60m", min: 45_000_000, max: 60_000_000 },
  { label: "Above ₦60m", min: 60_000_000, max: undefined },
] as const;

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recent", label: "Latest arrivals first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "year_desc", label: "Year: newest first" },
  { value: "year_asc", label: "Year: oldest first" },
];

export function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const list = Array.isArray(value) ? value : value.split(",");
  return list.map((item) => item.trim()).filter(Boolean);
}

function toNumber(value: string | string[] | undefined): number | undefined {
  const raw = firstValue(value);
  if (!raw) return undefined;
  const parsed = Number(raw.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseInventoryFilters(params: RawParams): VehicleFilters {
  const statusRaw = firstValue(params.status);
  const demoRaw = firstValue(params.inventory);
  const sortRaw = firstValue(params.sort) as SortKey | undefined;

  return {
    q: firstValue(params.q)?.trim() || undefined,
    makes: toArray(params.make),
    models: toArray(params.model),
    bodyTypes: toArray(params.bodyType),
    conditions: toArray(params.condition),
    transmissions: toArray(params.transmission),
    driveTypes: toArray(params.drive),
    yearMin: toNumber(params.yearMin),
    yearMax: toNumber(params.yearMax),
    priceMin: toNumber(params.priceMin),
    priceMax: toNumber(params.priceMax),
    status:
      statusRaw === "available" || statusRaw === "reserved" || statusRaw === "sold"
        ? (statusRaw as VehicleStatus)
        : "all",
    includeDemo: demoRaw === "all" ? true : demoRaw === "real" ? false : true,
    demoOnly: demoRaw === "samples",
    sort: sortRaw ?? "recent",
    page: toNumber(params.page) ?? 1,
    perPage: toNumber(params.perPage) ?? 12,
  };
}

export function buildInventoryQuery(filters: Partial<VehicleFilters> & { page?: number }): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  filters.makes?.forEach((value) => params.append("make", value));
  filters.models?.forEach((value) => params.append("model", value));
  filters.bodyTypes?.forEach((value) => params.append("bodyType", value));
  filters.conditions?.forEach((value) => params.append("condition", value));
  filters.transmissions?.forEach((value) => params.append("transmission", value));
  filters.driveTypes?.forEach((value) => params.append("drive", value));
  if (filters.yearMin) params.set("yearMin", String(filters.yearMin));
  if (filters.yearMax) params.set("yearMax", String(filters.yearMax));
  if (filters.priceMin) params.set("priceMin", String(filters.priceMin));
  if (filters.priceMax) params.set("priceMax", String(filters.priceMax));
  if (filters.status && filters.status !== "all") params.set("status", filters.status);
  if (filters.demoOnly) params.set("inventory", "samples");
  else if (filters.includeDemo === false) params.set("inventory", "real");
  if (filters.sort && filters.sort !== "recent") params.set("sort", filters.sort);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));
  return params.toString();
}

export function inventoryHref(filters: Partial<VehicleFilters> & { page?: number }): string {
  const query = buildInventoryQuery(filters);
  return query ? `/inventory?${query}` : "/inventory";
}

export type ActiveFilter = { key: string; label: string; value: string; removeHref: string };

export function activeFilters(filters: VehicleFilters): ActiveFilter[] {
  const list: ActiveFilter[] = [];
  const without = (patch: Partial<VehicleFilters>): string =>
    inventoryHref({ ...filters, ...patch, page: 1 });

  if (filters.q) {
    list.push({ key: "q", label: "Keyword", value: filters.q, removeHref: without({ q: undefined }) });
  }
  filters.makes?.forEach((make) =>
    list.push({
      key: `make-${make}`,
      label: "Make",
      value: make,
      removeHref: without({ makes: filters.makes?.filter((item) => item !== make) }),
    }),
  );
  filters.models?.forEach((model) =>
    list.push({
      key: `model-${model}`,
      label: "Model",
      value: model,
      removeHref: without({ models: filters.models?.filter((item) => item !== model) }),
    }),
  );
  filters.bodyTypes?.forEach((body) =>
    list.push({
      key: `body-${body}`,
      label: "Body",
      value: body,
      removeHref: without({ bodyTypes: filters.bodyTypes?.filter((item) => item !== body) }),
    }),
  );
  filters.conditions?.forEach((condition) =>
    list.push({
      key: `condition-${condition}`,
      label: "Condition",
      value: condition,
      removeHref: without({ conditions: filters.conditions?.filter((item) => item !== condition) }),
    }),
  );
  filters.transmissions?.forEach((transmission) =>
    list.push({
      key: `transmission-${transmission}`,
      label: "Transmission",
      value: transmission,
      removeHref: without({
        transmissions: filters.transmissions?.filter((item) => item !== transmission),
      }),
    }),
  );
  if (filters.yearMin || filters.yearMax) {
    list.push({
      key: "year",
      label: "Year",
      value: `${filters.yearMin ?? "Any"} – ${filters.yearMax ?? "Any"}`,
      removeHref: without({ yearMin: undefined, yearMax: undefined }),
    });
  }
  if (filters.priceMin || filters.priceMax) {
    const format = (value: number) => `₦${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}m`;
    list.push({
      key: "price",
      label: "Price",
      value: `${filters.priceMin ? format(filters.priceMin) : "Any"} – ${
        filters.priceMax ? format(filters.priceMax) : "Any"
      }`,
      removeHref: without({ priceMin: undefined, priceMax: undefined }),
    });
  }
  if (filters.status && filters.status !== "all") {
    list.push({
      key: "status",
      label: "Availability",
      value: filters.status,
      removeHref: without({ status: "all" }),
    });
  }
  if (filters.demoOnly) {
    list.push({
      key: "inventory",
      label: "Inventory",
      value: "Samples only",
      removeHref: without({ demoOnly: false }),
    });
  } else if (filters.includeDemo === false) {
    list.push({
      key: "inventory",
      label: "Inventory",
      value: "In-stock units only",
      removeHref: without({ includeDemo: undefined }),
    });
  }

  return list;
}
