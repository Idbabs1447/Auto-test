import type { Metadata } from "next";
import Link from "next/link";
import { SavedList } from "@/components/saved-list";

export const metadata: Metadata = {
  title: "Saved Vehicles",
  description: "Your shortlisted Dashlink vehicles, kept on this device for quick comparison.",
};

export default function SavedPage() {
  return (
    <section className="section">
      <div className="container-page">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-navy-900">
            Home
          </Link>
          <span>/</span>
          <span className="font-medium text-navy-900">Saved vehicles</span>
        </nav>
        <div className="mt-3 max-w-2xl">
          <span className="eyebrow">Your shortlist</span>
          <h1 className="mt-3 text-3xl font-bold">Saved vehicles</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Saved cars live in this browser, so you can close the site and come back. When you are
            ready, send the shortlist to us on WhatsApp and we will confirm what is still available.
          </p>
        </div>

        <div className="mt-8">
          <SavedList />
        </div>
      </div>
    </section>
  );
}
