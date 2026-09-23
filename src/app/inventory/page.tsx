import type { Metadata } from "next";
import Link from "next/link";
import { CarIcon, ChevronLeftIcon, ChevronRightIcon, WhatsAppIcon } from "@/components/icons";
import { InventoryControls } from "@/components/inventory-controls";
import { VehicleCard } from "@/components/vehicle-card";
import { inventoryHref, parseInventoryFilters } from "@/lib/filters";
import { generalWhatsAppLink, site } from "@/lib/site";
import { getInventory } from "@/lib/vehicles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop Cars — Available Vehicles in Lagos",
  description:
    "Search and filter foreign-used cars in stock at Dashlink Integrated Autos, Ogba, Ikeja. Filter by make, model, body type, year and price.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function InventoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = parseInventoryFilters(params);
  const result = await getInventory(filters);

  const { items, facets, total, page, pageCount } = result;

  const pagination = Array.from({ length: pageCount }, (_, index) => index + 1).filter(
    (value) => value === 1 || value === pageCount || Math.abs(value - page) <= 1,
  );

  const searchLine = [
    filters.q ? `“${filters.q}”` : null,
    filters.makes?.length ? filters.makes.join(", ") : null,
    filters.bodyTypes?.length ? filters.bodyTypes.join(", ") : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <section className="border-b border-slate-200 bg-navy-950 py-8 md:py-10">
        <div className="container-page">
          <nav className="flex items-center gap-2 text-xs text-navy-300">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">Shop Cars</span>
          </nav>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white md:text-3xl">Shop Cars</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-200">
                {searchLine ? `${searchLine} — ` : ""}
                {total} {total === 1 ? "vehicle" : "vehicles"} matching your search. Real Dashlink
                units are listed first; sample listings are clearly marked.
              </p>
            </div>
            <a
              href={generalWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Ask about a car
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <InventoryControls
            facets={facets}
            total={total}
            page={page}
            pageCount={pageCount}
            sort={filters.sort ?? "recent"}
          >
            {items.length === 0 ? (
              <div className="panel p-8 text-center md:p-12">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy-50 text-navy-800">
                  <CarIcon className="h-6 w-6" />
                </span>
                <h2 className="mt-4 text-xl font-bold">No vehicles match those filters</h2>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-slate-500">
                  Relax the filters, or tell us what you are looking for and Dashlink will source it —
                  locally or by import. Not every car we can get is listed on the website.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <Link href="/inventory" className="btn btn-outline">
                    Clear all filters
                  </Link>
                  <Link href="/pre-order" className="btn btn-red">
                    Request this vehicle
                  </Link>
                  <a
                    href={generalWhatsAppLink()}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-whatsapp"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    WhatsApp us
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((vehicle) => (
                  <VehicleCard key={vehicle.slug} vehicle={vehicle} />
                ))}
              </div>
            )}

            {pageCount > 1 ? (
              <nav className="mt-8 flex items-center justify-between gap-3">
                <Link
                  href={inventoryHref({ ...filters, page: Math.max(1, page - 1) })}
                  aria-disabled={page === 1}
                  className={`btn btn-outline btn-sm ${page === 1 ? "pointer-events-none opacity-50" : ""}`}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  Previous
                </Link>

                <div className="flex items-center gap-1">
                  {pagination.map((value, index) => (
                    <span key={value} className="flex items-center gap-1">
                      {index > 0 && value - pagination[index - 1] > 1 ? (
                        <span className="px-1 text-slate-400">…</span>
                      ) : null}
                      <Link
                        href={inventoryHref({ ...filters, page: value })}
                        className={`flex h-9 w-9 items-center justify-center rounded text-sm font-semibold ${
                          value === page
                            ? "bg-navy-900 text-white"
                            : "border border-slate-200 text-navy-800 hover:border-navy-800"
                        }`}
                      >
                        {value}
                      </Link>
                    </span>
                  ))}
                </div>

                <Link
                  href={inventoryHref({ ...filters, page: Math.min(pageCount, page + 1) })}
                  aria-disabled={page === pageCount}
                  className={`btn btn-outline btn-sm ${
                    page === pageCount ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  Next
                  <ChevronRightIcon className="h-4 w-4" />
                </Link>
              </nav>
            ) : null}

            <div className="panel mt-8 grid gap-4 p-5 md:grid-cols-[1.4fr_1fr] md:items-center">
              <div>
                <h2 className="text-lg font-bold">Looking for something not listed?</h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  Our stock changes weekly. Send us the exact model, year and budget — we will match
                  it from what is on ground or import it for you.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                <Link href="/pre-order" className="btn btn-red">
                  Pre-order a car
                </Link>
                <a href={`tel:${site.phones[0].raw}`} className="btn btn-outline">
                  Call {site.phones[0].label}
                </a>
              </div>
            </div>
          </InventoryControls>
        </div>
      </section>
    </>
  );
}
