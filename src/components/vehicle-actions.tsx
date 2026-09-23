"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CompareIcon,
  HeartIcon,
  PhoneIcon,
  ShareIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { useSavedVehicles } from "@/components/saved-provider";
import { site } from "@/lib/site";

export function VehicleActions({
  slug,
  title,
  priceLabel,
  whatsappUrl,
}: {
  slug: string;
  title: string;
  priceLabel: string;
  whatsappUrl: string;
}) {
  const { isSaved, toggleSaved, isComparing, toggleCompare } = useSavedVehicles();
  const [shareLabel, setShareLabel] = useState("Share");
  const saved = isSaved(slug);
  const comparing = isComparing(slug);

  async function share() {
    const url = `${window.location.origin}/vehicles/${slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, url, text: `${title} — Dashlink Integrated Autos` });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareLabel("Link copied");
      setTimeout(() => setShareLabel("Share"), 2200);
    } catch {
      setShareLabel("Copy failed");
      setTimeout(() => setShareLabel("Share"), 2200);
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => toggleSaved(slug)}
          aria-pressed={saved}
          className={`btn ${saved ? "btn-red" : "btn-outline"}`}
        >
          <HeartIcon className="h-4 w-4" filled={saved} />
          {saved ? "Saved" : "Save vehicle"}
        </button>
        <button
          type="button"
          onClick={() => toggleCompare(slug)}
          aria-pressed={comparing}
          className={`btn ${comparing ? "btn-navy" : "btn-outline"}`}
        >
          <CompareIcon className="h-4 w-4" />
          {comparing ? "In comparison" : "Compare"}
        </button>
        <button type="button" onClick={share} className="btn btn-outline">
          <ShareIcon className="h-4 w-4" />
          {shareLabel}
        </button>
      </div>

      {/* Sticky conversion bar for small screens */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 py-2.5 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-medium uppercase tracking-wide text-slate-400">
              {title}
            </p>
            <p className="truncate text-sm font-bold text-navy-900">{priceLabel}</p>
          </div>
          <a href={`tel:${site.phones[0].raw}`} className="btn btn-outline btn-sm">
            <PhoneIcon className="h-4 w-4" />
            Call
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-whatsapp btn-sm"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}

export function SavedCountLink() {
  const { saved } = useSavedVehicles();
  if (saved.length === 0) return null;
  return (
    <Link href="/saved" className="link-arrow">
      <HeartIcon className="h-4 w-4" filled />
      View my {saved.length} saved {saved.length === 1 ? "car" : "cars"}
    </Link>
  );
}
