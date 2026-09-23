"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { CloseIcon, FilterIcon, SearchIcon, TrashIcon } from "@/components/icons";
import {
  PRICE_PRESETS,
  SORT_OPTIONS,
  activeFilters,
  parseInventoryFilters,
  toArray,
} from "@/lib/filters";
import type { FacetOption, InventoryFacets, SortKey } from "@/lib/types";

type InventoryControlsProps = {
  facets: InventoryFacets;
  total: number;
  page: number;
  pageCount: number;
  sort: SortKey;
  children: ReactNode;
};

function CheckboxRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 py-1.5 text-sm text-slate-600">
      <span className="flex items-center gap-2.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 rounded border-slate-300 accent-[#e01b24]"
        />
        <span className={checked ? "font-semibold text-navy-900" : ""}>{label}</span>
      </span>
      {count !== undefined ? <span className="text-xs text-slate-400">{count}</span> : null}
    </label>
  );
}

function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-b border-slate-100 py-4 last:border-b-0">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-navy-900">{title}</h3>
      {children}
    </div>
  );
}

export function InventoryControls({
  facets,
  total,
  page,
  pageCount,
  sort,
  children,
}: InventoryControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showAllMakes, setShowAllMakes] = useState(false);

  const raw = useMemo<Record<string, string | string[] | undefined>>(() => {
    const result: Record<string, string | string[]> = {};
    searchParams.forEach((value, key) => {
      const existing = result[key];
      if (existing === undefined) result[key] = value;
      else if (Array.isArray(existing)) existing.push(value);
      else result[key] = [existing, value];
    });
    return result;
  }, [searchParams]);

  const filters = useMemo(() => parseInventoryFilters(raw), [raw]);
  const chips = useMemo(() => activeFilters(filters), [filters]);

  const push = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      params.delete("page");
      const query = params.toString();
      router.push(query ? `/inventory?${query}` : "/inventory", { scroll: false });
      setDrawerOpen(false);
    },
    [router, searchParams],
  );

  const toggleMulti = useCallback(
    (key: string, value: string) => {
      push((params) => {
        const current = toArray(params.getAll(key));
        params.delete(key);
        const next = current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value];
        next.forEach((item) => params.append(key, item));
      });
    },
    [push],
  );

  const setSingle = useCallback(
    (key: string, value: string | undefined) => {
      push((params) => {
        if (!value || value === "all" || value === "") params.delete(key);
        else params.set(key, value);
      });
    },
    [push],
  );

  const setSortValue = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "recent") params.delete("sort");
      else params.set("sort", value);
      const query = params.toString();
      router.push(query ? `/inventory?${query}` : "/inventory", { scroll: false });
    },
    [router, searchParams],
  );

  const currentPricePreset = useMemo(() => {
    if (!filters.priceMin && !filters.priceMax) return "0";
    const index = PRICE_PRESETS.findIndex(
      (preset) => preset.min === filters.priceMin && preset.max === filters.priceMax,
    );
    return index >= 0 ? String(index) : "0";
  }, [filters.priceMax, filters.priceMin]);

  const makeOptions = showAllMakes ? facets.makes : facets.makes.slice(0, 8);

  const sidebar = (
    <div>
      <FilterSection title="Search">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const value = String(formData.get("q") ?? "");
            push((params) => {
              if (value.trim()) params.set("q", value.trim());
              else params.delete("q");
            });
          }}
          className="relative"
        >
          <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="q"
            defaultValue={filters.q ?? ""}
            placeholder="Camry, RX 350, Tucson..."
            className="input pl-8"
            aria-label="Filter by keyword"
          />
        </form>
      </FilterSection>

      <FilterSection title="Inventory">
        <div className="flex flex-wrap gap-2">
          {[
            { value: "all", label: "Everything" },
            { value: "real", label: "Dashlink stock" },
            { value: "samples", label: "Samples only" },
          ].map((option) => {
            const isActive =
              (option.value === "all" && filters.includeDemo !== false && !filters.demoOnly) ||
              (option.value === "real" && filters.includeDemo === false) ||
              (option.value === "samples" && Boolean(filters.demoOnly));
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSingle("inventory", option.value === "all" ? undefined : option.value)}
                className={`chip !py-1.5 !text-xs ${isActive ? "chip-active" : ""}`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          Dashlink stock = real units. Samples are prototype listings for layout review.
        </p>
      </FilterSection>

      <FilterSection title="Availability">
        <div className="flex flex-wrap gap-2">
          {[
            { value: "all", label: "All" },
            { value: "available", label: "Available" },
            { value: "reserved", label: "Reserved" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSingle("status", option.value)}
              className={`chip !py-1.5 !text-xs ${
                (filters.status ?? "all") === option.value ? "chip-active" : ""
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Make">
        {makeOptions.map((option: FacetOption) => (
          <CheckboxRow
            key={option.value}
            label={option.value}
            count={option.count}
            checked={filters.makes?.includes(option.value) ?? false}
            onChange={() => toggleMulti("make", option.value)}
          />
        ))}
        {facets.makes.length > 8 ? (
          <button
            type="button"
            onClick={() => setShowAllMakes((value) => !value)}
            className="link-arrow mt-1"
          >
            {showAllMakes ? "Show fewer makes" : `Show all ${facets.makes.length} makes`}
          </button>
        ) : null}
      </FilterSection>

      <FilterSection title="Body type">
        {facets.bodyTypes.map((option) => (
          <CheckboxRow
            key={option.value}
            label={option.value}
            count={option.count}
            checked={filters.bodyTypes?.includes(option.value) ?? false}
            onChange={() => toggleMulti("bodyType", option.value)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Transmission">
        {facets.transmissions.length > 0 ? (
          facets.transmissions.map((option) => (
            <CheckboxRow
              key={option.value}
              label={option.value}
              count={option.count}
              checked={filters.transmissions?.includes(option.value) ?? false}
              onChange={() => toggleMulti("transmission", option.value)}
            />
          ))
        ) : (
          <p className="text-xs text-slate-400">Gearbox details are confirmed on WhatsApp.</p>
        )}
      </FilterSection>

      <FilterSection title="Year">
        <div className="grid grid-cols-2 gap-2">
          <select
            aria-label="Minimum year"
            className="select !text-sm"
            value={filters.yearMin ? String(filters.yearMin) : ""}
            onChange={(event) => setSingle("yearMin", event.target.value || undefined)}
          >
            <option value="">From</option>
            {Array.from({ length: facets.yearRange.max - facets.yearRange.min + 1 }, (_, index) => {
              const year = facets.yearRange.min + index;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
          <select
            aria-label="Maximum year"
            className="select !text-sm"
            value={filters.yearMax ? String(filters.yearMax) : ""}
            onChange={(event) => setSingle("yearMax", event.target.value || undefined)}
          >
            <option value="">To</option>
            {Array.from(
              { length: facets.yearRange.max - facets.yearRange.min + 1 },
              (_, index) => facets.yearRange.max - index,
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </FilterSection>

      <FilterSection title="Price">
        <div className="space-y-1">
          {PRICE_PRESETS.map((preset, index) => (
            <label
              key={preset.label}
              className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm text-slate-600"
            >
              <input
                type="radio"
                name="price-preset"
                className="h-4 w-4 accent-[#e01b24]"
                checked={currentPricePreset === String(index)}
                onChange={() =>
                  push((params) => {
                    params.delete("priceMin");
                    params.delete("priceMax");
                    if (preset.min) params.set("priceMin", String(preset.min));
                    if (preset.max) params.set("priceMax", String(preset.max));
                  })
                }
              />
              <span className={currentPricePreset === String(index) ? "font-semibold text-navy-900" : ""}>
                {preset.label}
              </span>
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          Contact-for-price units remain in results until a price filter is applied.
        </p>
      </FilterSection>

      <div className="pt-4">
        <a href="/inventory" className="btn btn-outline btn-sm w-full">
          <TrashIcon className="h-4 w-4" />
          Clear all filters
        </a>
      </div>
    </div>
  );

  return (
    <div className="lg:flex lg:gap-8">
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="panel sticky top-28 max-h-[calc(100vh-9rem)] overflow-y-auto p-4">
          {sidebar}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="panel mb-5 flex flex-wrap items-center justify-between gap-3 p-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="btn btn-outline btn-sm lg:hidden"
            >
              <FilterIcon className="h-4 w-4" />
              Filters
            </button>
            <p className="text-sm text-slate-500">
              <span className="font-bold text-navy-900">{total}</span>{" "}
              {total === 1 ? "vehicle" : "vehicles"} found
              {pageCount > 1 ? (
                <span className="hidden sm:inline">
                  {" "}
                  · page {page} of {pageCount}
                </span>
              ) : null}
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Sort</span>
            <select
              className="select !w-auto !py-1.5 !text-sm"
              value={sort}
              onChange={(event) => setSortValue(event.target.value)}
              aria-label="Sort vehicles"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {chips.length > 0 ? (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
              <a key={chip.key} href={chip.removeHref} className="chip chip-active !text-xs">
                {chip.label}: {chip.value}
                <CloseIcon className="h-3 w-3" />
              </a>
            ))}
            <a href="/inventory" className="text-xs font-medium text-slate-500 underline">
              Reset
            </a>
          </div>
        ) : null}

        {children}
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-navy-950/60"
          />
          <div className="absolute inset-y-0 left-0 w-[88%] max-w-sm overflow-y-auto bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <p className="font-semibold text-navy-900">Filter vehicles</p>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="btn-icon"
                aria-label="Close filters"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="px-4 pb-8">{sidebar}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}


