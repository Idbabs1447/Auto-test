"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { site, whatsappLink } from "@/lib/site";
import type { VehicleImage } from "@/lib/types";

export function VehicleGallery({
  images,
  title,
  slug,
  isDemo,
}: {
  images: VehicleImage[];
  title: string;
  slug: string;
  isDemo: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const total = images.length;

  const go = (direction: number) => {
    setIndex((current) => {
      if (total === 0) return 0;
      return (current + direction + total) % total;
    });
  };

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(false);
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, total]);

  if (total === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-400">
        Photography coming soon
      </div>
    );
  }

  const active = images[index];

  return (
    <div>
      <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={active.url}
          alt={`${title} — photo ${index + 1}`}
          className="aspect-[4/3] w-full cursor-zoom-in object-cover"
          onClick={() => setLightbox(true)}
        />

        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy-900 transition hover:bg-white"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy-900 transition hover:bg-white"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </>
        ) : null}

        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="rounded bg-navy-950/80 px-2 py-1 text-xs font-medium text-white">
            {index + 1} / {total}
          </span>
          {active.caption ? (
            <span className="rounded bg-navy-950/80 px-2 py-1 text-xs font-medium text-white">
              {active.caption}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="absolute bottom-3 right-3 rounded bg-white/90 px-2.5 py-1 text-xs font-semibold text-navy-900"
        >
          View full size
        </button>
      </div>

      {total > 1 ? (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {images.map((image, imageIndex) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setIndex(imageIndex)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded border-2 transition ${
                imageIndex === index ? "border-dash-red" : "border-transparent opacity-80 hover:opacity-100"
              }`}
              aria-label={`Show photo ${imageIndex + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={`${title} thumbnail ${imageIndex + 1}`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
        <span>
          {isDemo
            ? "Sample photographs used to demonstrate the gallery layout."
            : "Yard photographs — ask for the latest live photos and a walkaround video."}
        </span>
        <a
          href={whatsappLink(
            `Hello ${site.shortName}, please send me the latest live photos and a walkaround video of the ${title} (${site.url.replace(/\/$/, "")}/vehicles/${slug}).`,
          )}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-semibold text-dash-green-dark"
        >
          <WhatsAppIcon className="h-3.5 w-3.5" />
          Request live photos
        </a>
      </div>

      {lightbox ? (
        <div className="fixed inset-0 z-[60] flex flex-col bg-navy-950/95 p-4">
          <div className="flex items-center justify-between text-white">
            <p className="text-sm font-medium">
              {title} — photo {index + 1} of {total}
            </p>
            <button
              type="button"
              onClick={() => setLightbox(false)}
              className="flex h-9 w-9 items-center justify-center rounded border border-white/30"
              aria-label="Close photo viewer"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[index].url}
              alt={`${title} full view ${index + 1}`}
              className="max-h-full max-w-full rounded object-contain"
            />
            {total > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous photo"
                  className="absolute left-0 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next photo"
                  className="absolute right-0 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
