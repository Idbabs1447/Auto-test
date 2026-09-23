"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CompareIcon, CloseIcon, TrashIcon, WhatsAppIcon } from "@/components/icons";
import { useSavedVehicles } from "@/components/saved-provider";
import { formatMileage, site, whatsappLink } from "@/lib/site";
import type { Vehicle } from "@/lib/types";

const ROWS: { label: string; render: (vehicle: Vehicle) => string }[] = [
  { label: "Price", render: (v) => v.priceLabel },
  { label: "Year", render: (v) => String(v.year) },
  { label: "Make", render: (v) => v.make },
  { label: "Model", render: (v) => `${v.model}${v.trim ? ` ${v.trim}` : ""}` },
  { label: "Condition", render: (v) => v.condition },
  { label: "Body type", render: (v) => v.bodyType ?? "Contact for details" },
  { label: "Transmission", render: (v) => v.transmission ?? "Contact for details" },
  { label: "Fuel", render: (v) => v.fuelType ?? "Contact for details" },
  { label: "Drivetrain", render: (v) => v.drivetrain ?? "Contact for details" },
  { label: "Engine", render: (v) => v.engine ?? "Contact for details" },
  { label: "Mileage", render: (v) => formatMileage(v.mileageKm) ?? "Contact for details" },
  { label: "Exterior colour", render: (v) => v.exteriorColor ?? "Contact for details" },
  { label: "Interior", render: (v) => v.interiorColor ?? "Contact for details" },
  { label: "Duty / papers", render: (v) => v.titleStatus ?? v.clearance ?? "Contact for details" },
  { label: "Availability", render: (v) => (v.status === "available" ? "Available" : v.status) },
  { label: "Location", render: (v) => v.location },
  {
    label: "Key features",
    render: (v) => (v.features.length > 0 ? v.features.slice(0, 6).join(", ") : "Contact for details"),
  },
];

export function CompareTable() {
  const { compare, hydrated, removeCompare, clearCompare } = useSavedVehicles();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [hideMatching, setHideMatching] = useState(false);

  useEffect(() => {
    if (!hydrated || compare.length === 0) {
      setVehicles([]);
      return;
    }
    let active = true;
    setLoading(true);
    fetch(`/api/vehicles?slugs=${encodeURIComponent(compare.join(","))}`)
      .then((response) => response.json())
      .then((payload: { items?: Vehicle[] }) => {
        if (active) setVehicles(payload.items ?? []);
      })
      .catch(() => {
        if (active) setVehicles([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [compare, hydrated]);

  const rows = useMemo(() => {
    if (!hideMatching || vehicles.length < 2) return ROWS;
    return ROWS.filter((row) => {
      const values = new Set(vehicles.map((vehicle) => row.render(vehicle).toLowerCase()));
      return values.size > 1;
    });
  }, [hideMatching, vehicles]);

  const overviewLink = whatsappLink(
    `Hello ${site.shortName}, I'm comparing these vehicles on your website and would like details:\n\n${vehicles
      .map((vehicle) => `• ${vehicle.title} (${vehicle.priceLabel})`)
      .join("\n")}\n\nPlease advise.`,
  );

  if (!hydrated) {
    return <div className="panel p-8 text-center text-sm text-slate-400">Loading comparison…</div>;
  }

  if (compare.length === 0) {
    return (
      <div className="panel p-8 text-center md:p-12">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy-50 text-navy-800">
          <CompareIcon className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-xl font-bold">Nothing to compare yet</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
          Add up to four cars using the compare icon on any listing and we will lay the specs side by
          side — including the details you still need to confirm with us.
        </p>
        <Link href="/inventory" className="btn btn-navy mt-5">
          Browse inventory
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={hideMatching}
            onChange={(event) => setHideMatching(event.target.checked)}
            className="h-4 w-4 accent-[#e01b24]"
          />
          Show only rows that differ
        </label>
        <div className="flex gap-2">
          <a href={overviewLink} target="_blank" rel="noreferrer" className="btn btn-whatsapp btn-sm">
            <WhatsAppIcon className="h-4 w-4" />
            Ask about all {vehicles.length}
          </a>
          <button type="button" onClick={clearCompare} className="btn btn-outline btn-sm">
            <TrashIcon className="h-4 w-4" />
            Clear
          </button>
        </div>
      </div>

      {loading ? <p className="mb-3 text-sm text-slate-400">Loading vehicles…</p> : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-40 bg-white p-3 text-left align-bottom text-xs font-bold uppercase tracking-wider text-slate-400">
                Specification
              </th>
              {vehicles.map((vehicle) => (
                <th key={vehicle.slug} className="min-w-[220px] border-l border-slate-100 p-3 align-top text-left">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={vehicle.coverImage}
                      alt={vehicle.title}
                      className="aspect-[4/3] w-full rounded object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeCompare(vehicle.slug)}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-navy-900 shadow"
                      aria-label={`Remove ${vehicle.title} from comparison`}
                    >
                      <CloseIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <Link
                    href={`/vehicles/${vehicle.slug}`}
                    className="mt-2 block font-semibold text-navy-900 hover:text-dash-red"
                  >
                    {vehicle.title}
                  </Link>
                  <p className="mt-1 text-xs font-bold text-dash-red">{vehicle.priceLabel}</p>
                  {vehicle.isDemo ? (
                    <p className="mt-1 text-[11px] text-slate-400">Sample listing</p>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.label} className={index % 2 === 0 ? "bg-slate-50/70" : ""}>
                <th className="sticky left-0 z-10 bg-inherit p-3 text-left font-medium text-slate-500">
                  {row.label}
                </th>
                {vehicles.map((vehicle) => (
                  <td key={vehicle.slug} className="border-l border-slate-100 p-3 text-slate-700">
                    {row.render(vehicle)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-400">
        “Contact for details” means we do not publish that figure for the unit — ask us and we will
        confirm it directly. Specs for sample listings are prototype content.
      </p>
    </div>
  );
}
