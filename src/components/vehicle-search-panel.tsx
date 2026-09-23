"use client";

import { useMemo, useState } from "react";
import { SearchIcon } from "@/components/icons";
import { PRICE_PRESETS } from "@/lib/filters";
import type { InventoryFacets } from "@/lib/types";

type SearchPanelProps = {
  facets: InventoryFacets;
  heading?: string;
  subheading?: string;
};

export function VehicleSearchPanel({
  facets,
  heading = "Find Your Car",
  subheading = "Filter by make, model, year and budget — or type what you're looking for.",
}: SearchPanelProps) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("0");

  const modelsForMake = useMemo(() => {
    if (!make) return facets.models;
    const known: Record<string, string[]> = {
      Toyota: ["Camry", "Corolla", "RAV4", "Highlander", "Sienna"],
      Lexus: ["ES 350", "RX 350"],
      "Mercedes-Benz": ["GLA 250", "C 300"],
      Honda: ["Accord", "CR-V"],
      Hyundai: ["Elantra GT", "Tucson", "Santa Fe"],
      Ford: ["Explorer"],
    };
    const allowed = known[make];
    if (!allowed) return facets.models;
    const filtered = facets.models.filter((option) => allowed.includes(option.value));
    return filtered.length > 0 ? filtered : facets.models;
  }, [facets.models, make]);

  const years = useMemo(() => {
    const list: number[] = [];
    for (let value = facets.yearRange.max; value >= facets.yearRange.min; value -= 1) {
      list.push(value);
    }
    return list;
  }, [facets.yearRange.max, facets.yearRange.min]);

  const preset = PRICE_PRESETS[Number(price)] ?? PRICE_PRESETS[0];

  return (
    <section className="panel -mt-10 p-5 shadow-[0_18px_45px_-28px_rgba(9,23,48,0.55)] md:-mt-14 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold md:text-2xl">{heading}</h2>
          <p className="mt-1 text-sm text-slate-500">{subheading}</p>
        </div>
        <p className="hidden text-xs font-medium uppercase tracking-[0.12em] text-slate-400 md:block">
          {facets.realCount} units on ground · {facets.makes.length} makes
        </p>
      </div>

      <form action="/inventory" className="mt-5">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
          <input
            name="q"
            placeholder="Search Toyota Camry, Lexus RX 350, Tucson 1.6T..."
            aria-label="Search vehicles by keyword"
            className="input h-12 pl-10 text-[15px]"
          />
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="label" htmlFor="hero-make">
              Make
            </label>
            <select
              id="hero-make"
              name="make"
              className="select"
              value={make}
              onChange={(event) => {
                setMake(event.target.value);
                setModel("");
              }}
            >
              <option value="">All makes</option>
              {facets.makes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value} ({option.count})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="hero-model">
              Model
            </label>
            <select
              id="hero-model"
              name="model"
              className="select"
              value={model}
              onChange={(event) => setModel(event.target.value)}
            >
              <option value="">All models</option>
              {modelsForMake.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="hero-year">
              Year
            </label>
            <select
              id="hero-year"
              name="yearMin"
              className="select"
              value={year}
              onChange={(event) => setYear(event.target.value)}
            >
              <option value="">Any year</option>
              {years.map((value) => (
                <option key={value} value={value}>
                  {value} and newer
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="hero-price">
              Price range
            </label>
            <select
              id="hero-price"
              name="priceKey"
              className="select"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
            >
              {PRICE_PRESETS.map((option, index) => (
                <option key={option.label} value={index}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {preset.min ? <input type="hidden" name="priceMin" value={preset.min} /> : null}
        {preset.max ? <input type="hidden" name="priceMax" value={preset.max} /> : null}

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Price filters show priced units only — contact-for-price cars stay visible when no price
            range is selected. We can also source a car that isn&apos;t listed yet.
          </p>
          <button type="submit" className="btn btn-red btn-lg sm:w-auto">
            <SearchIcon className="h-4 w-4" />
            Search Cars
          </button>
        </div>
      </form>
    </section>
  );
}
