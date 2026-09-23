"use client";

import Link from "next/link";
import { CloseIcon, CompareIcon } from "@/components/icons";
import { COMPARE_LIMIT, useSavedVehicles } from "@/components/saved-provider";

export function CompareBar() {
  const { compare, clearCompare } = useSavedVehicles();

  if (compare.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-[4.25rem] z-40 px-3 lg:bottom-5 lg:px-0">
      <div className="container-page">
        <div className="flex items-center justify-between gap-3 rounded-lg border border-navy-900/10 bg-navy-900 px-3 py-2.5 text-white shadow-xl lg:max-w-2xl lg:px-4">
          <div className="flex items-center gap-2 text-sm">
            <CompareIcon className="h-4 w-4 text-dash-red" />
            <span className="font-semibold">
              {compare.length} of {COMPARE_LIMIT} selected
            </span>
            <span className="hidden text-navy-200 sm:inline">for comparison</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={clearCompare} className="btn btn-sm btn-outline-light">
              <CloseIcon className="h-3.5 w-3.5" />
              Clear
            </button>
            <Link href="/compare" className="btn btn-sm btn-red">
              Compare
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
