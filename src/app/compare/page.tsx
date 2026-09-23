import type { Metadata } from "next";
import Link from "next/link";
import { CompareTable } from "@/components/compare-table";

export const metadata: Metadata = {
  title: "Compare Vehicles",
  description:
    "Compare up to four Dashlink vehicles side by side — price, year, body type, transmission and availability.",
};

export default function ComparePage() {
  return (
    <section className="section">
      <div className="container-page">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-navy-900">
            Home
          </Link>
          <span>/</span>
          <Link href="/inventory" className="hover:text-navy-900">
            Shop Cars
          </Link>
          <span>/</span>
          <span className="font-medium text-navy-900">Compare</span>
        </nav>
        <div className="mt-3 max-w-3xl">
          <span className="eyebrow">Side by side</span>
          <h1 className="mt-3 text-3xl font-bold">Compare vehicles</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Put up to four cars next to each other and see exactly where they differ. Unknown details
            are shown as “Contact for details” instead of being guessed — ask us and we will fill them
            in.
          </p>
        </div>

        <div className="mt-8">
          <CompareTable />
        </div>
      </div>
    </section>
  );
}
