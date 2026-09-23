import Link from "next/link";
import { EnquiryForm } from "@/components/enquiry-form";
import {
  ArrowRightIcon,
  CarIcon,
  CheckIcon,
  ClockIcon,
  InstagramIcon,
  MapPinIcon,
  PhoneIcon,
  PlayIcon,
  ShipIcon,
  ShieldIcon,
  TikTokIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from "@/components/icons";
import { MapEmbed } from "@/components/map-embed";
import { VehicleCard } from "@/components/vehicle-card";
import { VehicleSearchPanel } from "@/components/vehicle-search-panel";
import { LOTS_IMAGERY } from "@/db/seed-data";
import { formatNaira, generalWhatsAppLink, site, whatsappLink } from "@/lib/site";
import {
  getDemoVehicles,
  getFeaturedVehicles,
  getInventory,
  getInventorySummary,
  getMakeShowcase,
} from "@/lib/vehicles";

export const dynamic = "force-dynamic";

const TRUST_POINTS = [
  { icon: CarIcon, label: "Foreign-used stock on ground" },
  { icon: ShipIcon, label: "Importation & sourcing" },
  { icon: ShieldIcon, label: "Inspect before you pay" },
  { icon: WhatsAppIcon, label: "Fast WhatsApp responses" },
];

export default async function HomePage() {
  const [featured, demoVehicles, makeShowcase, summary, inventory] = await Promise.all([
    getFeaturedVehicles(6),
    getDemoVehicles(3),
    getMakeShowcase(),
    getInventorySummary(),
    getInventory({ perPage: 1 }),
  ]);

  const facets = inventory.facets;
  const heroMinis = featured.slice(0, 3);

  return (
    <>
      {/* ------------------------------------------------------------- hero */}
      <section className="relative isolate overflow-hidden bg-navy-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOTS_IMAGERY.heroSuv}
          alt="Vehicle available at Dashlink Integrated Autos, Lagos"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="hero-overlay absolute inset-0" />

        <div className="container-page relative py-12 md:py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-center">
            <div className="animate-fade-up">
              <p className="inline-flex items-center gap-2 rounded border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-white">
                <MapPinIcon className="h-3.5 w-3.5 text-dash-red" />
                47 Ogunnusi Road, Ogba · Ikeja · Lagos
              </p>

              <h1 className="mt-5 text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-[3.4rem]">
                Your Next Car
                <br />
                <span className="text-white">Starts Here.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy-100 sm:text-lg">
                Explore quality imported vehicles available in Lagos, or let Dashlink help you source
                exactly what you&apos;re looking for.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/inventory" className="btn btn-white btn-lg">
                  <CarIcon className="h-4 w-4" />
                  Browse Available Cars
                </Link>
                <Link href="/pre-order" className="btn btn-outline-light btn-lg">
                  Pre-Order a Vehicle
                </Link>
                <a
                  href={generalWhatsAppLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-whatsapp btn-lg"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
              </div>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {TRUST_POINTS.map((point) => (
                  <li key={point.label} className="flex items-center gap-2.5 text-sm text-navy-100">
                    <span className="flex h-7 w-7 items-center justify-center rounded bg-white/10 text-white">
                      <point.icon className="h-4 w-4" />
                    </span>
                    {point.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden lg:block">
              <div className="rounded-lg border border-white/15 bg-navy-950/70 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-200">
                    In stock right now
                  </p>
                  <Link href="/inventory" className="text-xs font-medium text-white underline">
                    See all {summary.realCount}
                  </Link>
                </div>
                <ul className="mt-3 space-y-2.5">
                  {heroMinis.map((vehicle) => (
                    <li key={vehicle.slug}>
                      <Link
                        href={`/vehicles/${vehicle.slug}`}
                        className="flex items-center gap-3 rounded border border-white/10 bg-white/5 p-2 transition hover:border-white/30 hover:bg-white/10"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={vehicle.coverImage}
                          alt={vehicle.title}
                          loading="lazy"
                          className="h-14 w-20 shrink-0 rounded object-cover"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-white">
                            {vehicle.title}
                          </span>
                          <span className="block text-xs text-navy-200">
                            {vehicle.condition}
                            {vehicle.bodyType ? ` · ${vehicle.bodyType}` : ""}
                          </span>
                        </span>
                        <ArrowRightIcon className="h-4 w-4 shrink-0 text-navy-200" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs leading-relaxed text-navy-300">
                  Prices on request for units still being cleared. Ask on WhatsApp for the current
                  figure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- search interface */}
      <div className="container-page">
        <VehicleSearchPanel facets={facets} />
      </div>

      {/* ------------------------------------------------------ browse by make */}
      <section className="section">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Inventory filters</span>
              <h2 className="mt-3 text-2xl font-bold md:text-3xl">Browse by Make</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
                These are inventory filters — Dashlink is an independent dealership and is not
                affiliated with any manufacturer.
              </p>
            </div>
            <Link href="/inventory" className="link-arrow">
              View all vehicles
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {makeShowcase.slice(0, 6).map((item) => (
              <Link
                key={item.make}
                href={`/inventory?make=${encodeURIComponent(item.make)}`}
                className="panel group overflow-hidden transition hover:border-navy-300 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={`${item.make} vehicles in stock`}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : null}
                </div>
                <div className="flex items-center justify-between gap-2 px-3 py-3">
                  <span className="text-sm font-semibold text-navy-900">{item.make}</span>
                  <span className="text-xs text-slate-400">{item.count}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- recently added */}
      <section className="border-y border-slate-100 bg-slate-50 section">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">New stock</span>
              <h2 className="mt-3 text-2xl font-bold md:text-3xl">Recently Added</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
                Fresh arrivals and newly listed vehicles — units currently with Dashlink at Ogba,
                Ikeja. Enquire on WhatsApp for the specific car you are looking at and we will confirm
                availability, price and inspection.
              </p>
            </div>
            <Link href="/inventory" className="btn btn-outline">
              All {summary.realCount} cars in stock
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((vehicle) => (
              <VehicleCard key={vehicle.slug} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ pre-order band */}
      <section className="section">
        <div className="container-page">
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="grid lg:grid-cols-2">
              <div className="relative min-h-64">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={LOTS_IMAGERY.portShip}
                  alt="Vehicles shipped for importation"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-navy-950/35" />
              </div>
              <div className="bg-white p-6 md:p-8">
                <span className="eyebrow">Pre-order &amp; sourcing</span>
                <h2 className="mt-3 text-2xl font-bold md:text-3xl">
                  Can&apos;t find the exact car? Tell us what you want.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  Dashlink imports and sources vehicles to order. Share the make, model, year range
                  and budget, and we will come back with matching units and a clear landed price —
                  including shipping and clearing where applicable.
                </p>

                <ol className="mt-5 space-y-3">
                  {[
                    "Tell us the car, budget and timeline.",
                    "We source and inspect matching units, locally or abroad.",
                    "You approve, we ship, clear and hand over the keys.",
                  ].map((step, index) => (
                    <li key={step} className="flex gap-3 text-sm text-slate-600">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-dash-red text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/pre-order" className="btn btn-red">
                    Start a pre-order
                  </Link>
                  <a
                    href={whatsappLink(
                      "Hello Dashlink Autos, I want to import/source a specific vehicle. Here are the details:",
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Send specs on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- why us */}
      <section className="section bg-navy-950">
        <div className="container-page">
          <div className="max-w-2xl">
            <span className="eyebrow">What we do</span>
            <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">
              A dealership set up around how Nigerians actually buy cars
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-navy-200">
              You inspect the car first, ask your questions, bring your mechanic, then decide. We keep
              the paperwork side straightforward and the conversation on WhatsApp where it is easy to
              trace.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {site.services.map((service) => (
              <div key={service.title} className="rounded-lg border border-white/10 bg-white/5 p-5">
                <h3 className="text-base font-semibold text-white">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-200">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/about" className="btn btn-white">
              About Dashlink
            </Link>
            <Link href="/contact" className="btn btn-outline-light">
              Visit the yard
            </Link>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- prototype preview */}
      {demoVehicles.length > 0 ? (
        <section className="section">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="eyebrow">Prototype inventory</span>
                <h2 className="mt-3 text-2xl font-bold md:text-3xl">
                  See how a full Dashlink inventory will look
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
                  These are clearly-labelled sample listings created for this prototype, with
                  realistic pricing, spec sheets and video slots. Real Dashlink units replace them as
                  stock is photographed and published.
                </p>
              </div>
              <Link href="/inventory?inventory=samples" className="btn btn-outline">
                Browse sample listings
              </Link>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {demoVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.slug} vehicle={vehicle} />
              ))}
            </div>

            <p className="mt-5 rounded border border-dashed border-slate-300 bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">
              Sample listings exist only to demonstrate filtering, comparison and vehicle detail
              layouts. They are not confirmed Dashlink stock. Prices shown are illustrative
              ({formatNaira(demoVehicles[0]?.priceNgn ?? 0)} for the first sample).
            </p>
          </div>
        </section>
      ) : null}

      {/* -------------------------------------------------------- video & social */}
      <section className="section border-y border-slate-100 bg-slate-50">
        <div className="container-page grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <span className="eyebrow">Watch before you come</span>
            <h2 className="mt-3 text-2xl font-bold md:text-3xl">
              Vehicle videos, walkarounds and reels
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Every listing page supports YouTube, TikTok and Instagram video links. Ask for a
              walkaround clip of the exact unit you like — engine start, interior, tyres and body
              close-ups — then come and inspect it in person.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { icon: YouTubeIcon, label: "YouTube", note: "Walkaround clips" },
                { icon: TikTokIcon, label: "TikTok", note: "Short reels" },
                { icon: InstagramIcon, label: "Instagram", note: site.instagram.handle },
              ].map((item) => (
                <div key={item.label} className="panel flex items-center gap-3 p-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded bg-navy-900 text-white">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-navy-900">{item.label}</span>
                    <span className="block text-xs text-slate-500">{item.note}</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={whatsappLink(
                  "Hello Dashlink Autos, please send me a video of a car I'm interested in.",
                )}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp"
              >
                <PlayIcon className="h-4 w-4" />
                Request a video
              </a>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
              >
                <InstagramIcon className="h-4 w-4" />
                Follow {site.instagram.handle}
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOTS_IMAGERY.lotLine}
              alt="Vehicles lined up at the dealership"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- visit us */}
      <section className="section">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <span className="eyebrow">Visit the yard</span>
            <h2 className="mt-3 text-2xl font-bold md:text-3xl">
              Come and inspect the car yourself
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              We are on Ogunnusi Road in Ogba, Ikeja — easy to reach from Agege, Oba Akran, Allen
              Avenue and the Ikeja axis. Call ahead and we will have the unit ready for you.
            </p>

            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-dash-red" />
                <span className="text-slate-600">
                  {site.address.line1}, {site.address.line2}, {site.address.city}, Nigeria.
                </span>
              </li>
              {site.phones.map((phone) => (
                <li key={phone.raw} className="flex gap-3">
                  <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-dash-red" />
                  <a href={`tel:${phone.raw}`} className="font-medium text-navy-800">
                    {phone.label}
                  </a>
                </li>
              ))}
              <li className="flex gap-3">
                <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-dash-red" />
                <span className="text-slate-600">
                  {site.hours.map((entry) => `${entry.day}: ${entry.time}`).join(" · ")}
                </span>
              </li>
            </ul>

            <div className="mt-5 flex flex-wrap gap-3">
              <a href={`tel:${site.phones[0].raw}`} className="btn btn-navy">
                <PhoneIcon className="h-4 w-4" />
                Call the dealership
              </a>
              <a
                href={whatsappLink(
                  "Hello Dashlink Autos, I'd like to book a viewing at the Ogba yard. When can I come?",
                )}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Book a viewing
              </a>
            </div>

            <ul className="mt-6 space-y-2 text-sm text-slate-600">
              {[
                "Bring your mechanic if you want a second opinion.",
                "Ask for the papers and customs documents before payment.",
                "Payment is confirmed in person or by bank transfer only.",
              ].map((tip) => (
                <li key={tip} className="flex gap-2.5">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-dash-red" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <MapEmbed className="h-72 w-full md:h-80" />
            <EnquiryForm
              heading="Send us a quick message"
              description="Tell us the car, your budget or your question — we reply from the yard."
              compact
            />
          </div>
        </div>
      </section>
    </>
  );
}
