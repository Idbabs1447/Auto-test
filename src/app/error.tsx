"use client";

import Link from "next/link";
import { CarIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { generalWhatsAppLink, site } from "@/lib/site";

export default function ErrorBoundary({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="section">
      <div className="container-page max-w-2xl text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-dash-red-soft text-dash-red-dark">
          <CarIcon className="h-6 w-6" />
        </span>
        <h1 className="mt-5 text-3xl font-bold">This page hit a pothole</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          Our inventory feed did not load properly. Try again, or reach us directly — the yard is open
          and the cars are on ground.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn btn-navy">
            Try again
          </button>
          <a href={generalWhatsAppLink()} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
            <WhatsAppIcon className="h-4 w-4" />
            Chat on WhatsApp
          </a>
          <a href={`tel:${site.phones[0].raw}`} className="btn btn-outline">
            <PhoneIcon className="h-4 w-4" />
            {site.phones[0].label}
          </a>
          <Link href="/" className="btn btn-outline">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
