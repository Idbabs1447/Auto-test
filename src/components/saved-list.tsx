"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CarIcon, HeartIcon, TrashIcon } from "@/components/icons";
import { useSavedVehicles } from "@/components/saved-provider";
import { VehicleCard } from "@/components/vehicle-card";
import type { Vehicle } from "@/lib/types";

export function SavedList() {
  const { saved, hydrated, removeSaved } = useSavedVehicles();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hydrated || saved.length === 0) {
      setVehicles([]);
      return;
    }
    let active = true;
    setLoading(true);
    fetch(`/api/vehicles?slugs=${encodeURIComponent(saved.join(","))}`)
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
  }, [saved, hydrated]);

  if (!hydrated) {
    return (
      <div className="panel p-8 text-center text-sm text-slate-400">Loading your saved cars…</div>
    );
  }

  if (saved.length === 0) {
    return (
      <div className="panel p-8 text-center md:p-12">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy-50 text-navy-800">
          <HeartIcon className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-xl font-bold">No saved vehicles yet</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
          Tap the heart on any car and it will be waiting here — handy when you are comparing a few
          options or want to come back after speaking with family.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link href="/inventory" className="btn btn-navy">
            <CarIcon className="h-4 w-4" />
            Browse available cars
          </Link>
          <Link href="/pre-order" className="btn btn-outline">
            Request a specific car
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          <span className="font-bold text-navy-900">{saved.length}</span>{" "}
          {saved.length === 1 ? "vehicle" : "vehicles"} saved on this device
        </p>
        <div className="flex gap-2">
          <Link href="/compare" className="btn btn-outline btn-sm">
            Compare selection
          </Link>
          <button
            type="button"
            onClick={() => saved.forEach((slug) => removeSaved(slug))}
            className="btn btn-outline btn-sm"
          >
            <TrashIcon className="h-4 w-4" />
            Clear all
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Refreshing saved vehicles…</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.slug} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}
