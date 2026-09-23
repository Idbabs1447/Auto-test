"use client";

import Link from "next/link";
import {
  CheckIcon,
  CompareIcon,
  FuelIcon,
  GaugeIcon,
  GearIcon,
  HeartIcon,
  InfoIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { COMPARE_LIMIT, useSavedVehicles } from "@/components/saved-provider";
import { formatMileage } from "@/lib/site";
import type { Vehicle } from "@/lib/types";

function statusBadge(vehicle: Vehicle) {
  if (vehicle.status === "reserved") return { label: "Reserved", className: "badge-navy" };
  if (vehicle.status === "sold") return { label: "Sold", className: "badge-navy" };
  if (vehicle.badge) return { label: vehicle.badge, className: "badge-red" };
  if (vehicle.isDemo) return { label: "Sample listing", className: "badge-soft" };
  if (vehicle.clearance) return { label: vehicle.clearance, className: "badge-green" };
  return null;
}

export function VehicleCard({
  vehicle,
  compact = false,
}: {
  vehicle: Vehicle;
  compact?: boolean;
}) {
  const { isSaved, toggleSaved, isComparing, toggleCompare, compareLimitReached } =
    useSavedVehicles();
  const saved = isSaved(vehicle.slug);
  const comparing = isComparing(vehicle.slug);
  const badge = statusBadge(vehicle);
  const mileage = formatMileage(vehicle.mileageKm);

  const meta = [
    { icon: GearIcon, value: vehicle.transmission ?? "Gearbox: ask us" },
    { icon: FuelIcon, value: vehicle.fuelType ?? "Fuel: ask us" },
    { icon: GaugeIcon, value: mileage ?? "Mileage: ask us" },
  ];

  return (
    <article className="panel group flex h-full flex-col overflow-hidden transition hover:border-navy-200 hover:shadow-[0_10px_30px_-16px_rgba(9,23,48,0.35)]">
      <div className="relative">
        <Link href={`/vehicles/${vehicle.slug}`} className="block">
          <div className={`relative overflow-hidden bg-slate-100 ${compact ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
            {vehicle.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={vehicle.coverImage}
                alt={vehicle.title}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                Photo coming soon
              </div>
            )}
          </div>
        </Link>

        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
          {badge ? <span className={`badge ${badge.className}`}>{badge.label}</span> : null}
          {vehicle.arrivalNote && !vehicle.isDemo ? (
            <span className="badge badge-navy">Arrival {vehicle.arrivalNote}</span>
          ) : null}
        </div>

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => toggleSaved(vehicle.slug)}
            aria-label={saved ? `Remove ${vehicle.title} from saved` : `Save ${vehicle.title}`}
            aria-pressed={saved}
            className={`flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition ${
              saved
                ? "border-dash-red bg-dash-red text-white"
                : "border-white/70 bg-white/95 text-navy-800 hover:border-dash-red hover:text-dash-red"
            }`}
          >
            <HeartIcon className="h-4 w-4" filled={saved} />
          </button>
          <button
            type="button"
            onClick={() => toggleCompare(vehicle.slug)}
            aria-label={comparing ? `Remove ${vehicle.title} from comparison` : `Compare ${vehicle.title}`}
            aria-pressed={comparing}
            disabled={!comparing && compareLimitReached}
            title={!comparing && compareLimitReached ? `Comparison is limited to ${COMPARE_LIMIT} cars` : "Add to comparison"}
            className={`flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
              comparing
                ? "border-navy-900 bg-navy-900 text-white"
                : "border-white/70 bg-white/95 text-navy-800 hover:border-navy-800"
            }`}
          >
            <CompareIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
          {vehicle.year} · {vehicle.condition}
          {vehicle.bodyType ? ` · ${vehicle.bodyType}` : ""}
        </p>
        <h3 className="mt-1 text-base font-semibold leading-snug">
          <Link href={`/vehicles/${vehicle.slug}`} className="transition hover:text-dash-red">
            {vehicle.title}
          </Link>
        </h3>

        <div className="mt-3 flex items-baseline justify-between gap-2">
          <p
            className={`font-bold ${
              vehicle.priceOnRequest ? "text-[15px] text-navy-700" : "text-lg text-navy-900"
            }`}
          >
            {vehicle.priceLabel}
          </p>
          {vehicle.titleStatus ? (
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              {vehicle.titleStatus}
            </span>
          ) : null}
        </div>

        <ul className="mt-3 space-y-1.5 text-xs text-slate-500">
          {meta.map((item) => (
            <li key={item.value} className="flex items-center gap-2">
              <item.icon className="h-3.5 w-3.5 text-navy-400" />
              <span>{item.value}</span>
            </li>
          ))}
        </ul>

        {vehicle.isDemo ? (
          <p className="mt-3 flex items-start gap-1.5 rounded bg-slate-50 p-2 text-[11px] leading-relaxed text-slate-500">
            <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
            Prototype listing shown to demonstrate the full inventory layout.
          </p>
        ) : null}

        <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
          <Link href={`/vehicles/${vehicle.slug}`} className="btn btn-outline btn-sm">
            View details
          </Link>
          <a
            href={vehicle.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-whatsapp btn-sm"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}

export function CompareToggleHint() {
  return (
    <p className="inline-flex items-center gap-2 text-xs text-slate-400">
      <CheckIcon className="h-3.5 w-3.5" />
      Tick the compare icon on up to {COMPARE_LIMIT} cars to place them side by side.
    </p>
  );
}
