import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnquiryForm } from "@/components/enquiry-form";
import {
  ArrowRightIcon,
  CalendarIcon,
  CarIcon,
  CheckIcon,
  ClockIcon,
  FuelIcon,
  GaugeIcon,
  GearIcon,
  InfoIcon,
  InstagramIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldIcon,
  SparkIcon,
  UsersIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { ReserveButton } from "@/components/reserve-dialog";
import { VehicleActions } from "@/components/vehicle-actions";
import { VehicleCard } from "@/components/vehicle-card";
import { VehicleGallery } from "@/components/vehicle-gallery";
import { VehicleVideos } from "@/components/vehicle-videos";
import { formatMileage, site } from "@/lib/site";
import { getSimilarVehicles, getVehicleBySlug } from "@/lib/vehicles";
import type { Vehicle } from "@/lib/types";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return { title: "Vehicle not found" };

  const description = `${vehicle.title} — ${vehicle.condition}, available at Dashlink Integrated Autos, Ogba, Ikeja, Lagos. ${vehicle.priceLabel}. Enquire on WhatsApp.`;

  return {
    title: vehicle.title,
    description,
    openGraph: {
      title: `${vehicle.title} | Dashlink Integrated Autos`,
      description,
      images: vehicle.coverImage ? [{ url: vehicle.coverImage }] : undefined,
    },
  };
}

function specRows(vehicle: Vehicle) {
  return [
    { label: "Condition", value: vehicle.condition, icon: ShieldIcon },
    { label: "Body type", value: vehicle.bodyType, icon: CarIcon },
    { label: "Transmission", value: vehicle.transmission, icon: GearIcon },
    { label: "Fuel", value: vehicle.fuelType, icon: FuelIcon },
    { label: "Drivetrain", value: vehicle.drivetrain, icon: CarIcon },
    { label: "Engine", value: vehicle.engine, icon: SparkIcon },
    { label: "Mileage", value: formatMileage(vehicle.mileageKm), icon: GaugeIcon },
    { label: "Exterior colour", value: vehicle.exteriorColor, icon: CarIcon },
    { label: "Interior", value: vehicle.interiorColor, icon: UsersIcon },
    {
      label: "Duty / papers",
      value: vehicle.titleStatus ?? vehicle.clearance,
      icon: ShieldIcon,
    },
    { label: "Arrival", value: vehicle.arrivalNote, icon: CalendarIcon },
    { label: "Location", value: vehicle.location, icon: MapPinIcon },
  ];
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) notFound();

  const similar = await getSimilarVehicles(vehicle, 3);
  const rows = specRows(vehicle);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: vehicle.title,
    brand: { "@type": "Brand", name: vehicle.make },
    model: vehicle.model,
    vehicleModelDate: String(vehicle.year),
    itemCondition: "https://schema.org/UsedCondition",
    bodyType: vehicle.bodyType ?? undefined,
    color: vehicle.exteriorColor ?? undefined,
    mileageFromOdometer: vehicle.mileageKm
      ? { "@type": "QuantitativeValue", value: vehicle.mileageKm, unitCode: "KMT" }
      : undefined,
    image: vehicle.images.map((image) => image.url),
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      price: vehicle.priceOnRequest ? undefined : vehicle.priceNgn,
      availability:
        vehicle.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/LimitedAvailability",
      seller: { "@type": "AutoDealer", name: site.name },
    },
  };

  return (
    <>
      <div className="border-b border-slate-200 bg-slate-50 py-4">
        <div className="container-page">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-navy-900">
              Home
            </Link>
            <span>/</span>
            <Link href="/inventory" className="hover:text-navy-900">
              Shop Cars
            </Link>
            <span>/</span>
            <span className="font-medium text-navy-900">{vehicle.title}</span>
          </nav>
        </div>
      </div>

      <section className="section !pt-8 !pb-10">
        <div className="container-page grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <VehicleGallery
              images={vehicle.images}
              title={vehicle.title}
              slug={vehicle.slug}
              isDemo={vehicle.isDemo}
            />
          </div>

          <aside>
            <div className="panel p-5 lg:sticky lg:top-28">
              <div className="flex flex-wrap items-center gap-2">
                {vehicle.badge ? <span className="badge badge-red">{vehicle.badge}</span> : null}
                {vehicle.clearance ? (
                  <span className="badge badge-green">{vehicle.clearance}</span>
                ) : null}
                {vehicle.isDemo ? <span className="badge badge-soft">Sample listing</span> : null}
                {vehicle.status === "reserved" ? (
                  <span className="badge badge-navy">Reserved</span>
                ) : null}
                {!vehicle.isDemo && vehicle.status === "available" ? (
                  <span className="badge badge-soft">In stock</span>
                ) : null}
              </div>

              <h1 className="mt-3 text-2xl font-bold leading-tight md:text-[1.75rem]">
                {vehicle.title}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {vehicle.condition}
                {vehicle.bodyType ? ` · ${vehicle.bodyType}` : ""}
                {vehicle.exteriorColor ? ` · ${vehicle.exteriorColor}` : ""}
              </p>

              <div className="mt-4 border-y border-slate-100 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  {vehicle.priceOnRequest ? "Price" : "Asking price"}
                </p>
                <p className="mt-1 text-2xl font-bold text-navy-900">{vehicle.priceLabel}</p>
                {vehicle.priceOnRequest ? (
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    We confirm prices directly so you always get the current figure. Ask on WhatsApp
                    and we will respond with the numbers for this unit.
                  </p>
                ) : null}
              </div>

              <div className="mt-4 space-y-2.5">
                <a
                  href={vehicle.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-whatsapp w-full btn-lg"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Enquire about this {vehicle.make} on WhatsApp
                </a>
                <div className="grid grid-cols-2 gap-2">
                  {site.phones.map((phone) => (
                    <a
                      key={phone.raw}
                      href={`tel:${phone.raw}`}
                      className="btn btn-outline btn-sm justify-center"
                    >
                      <PhoneIcon className="h-4 w-4" />
                      {phone.label}
                    </a>
                  ))}
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <ReserveButton
                    vehicleSlug={vehicle.slug}
                    vehicleTitle={vehicle.title}
                    className="btn btn-red w-full"
                  />
                  <a href="#enquire" className="btn btn-navy w-full">
                    Send an enquiry
                  </a>
                </div>
              </div>

              <div className="mt-4">
                <VehicleActions
                  slug={vehicle.slug}
                  title={vehicle.title}
                  priceLabel={vehicle.priceLabel}
                  whatsappUrl={vehicle.whatsappUrl}
                />
              </div>

              <ul className="mt-5 space-y-2 text-xs text-slate-500">
                <li className="flex gap-2">
                  <MapPinIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-dash-red" />
                  {vehicle.location}
                </li>
                <li className="flex gap-2">
                  <ClockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-dash-red" />
                  Viewing by appointment — call ahead and we will have it ready.
                </li>
                <li className="flex gap-2">
                  <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-dash-red" />
                  Payment is completed in person or by bank transfer. No online payment on this site
                  yet.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="pb-12">
        <div className="container-page grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-8">
            <div className="panel p-5 md:p-6">
              <h2 className="text-xl font-bold">About this vehicle</h2>
              <div className="prose-body mt-3 text-sm text-slate-600">
                <p>{vehicle.description}</p>
                {vehicle.isDemo ? (
                  <p className="rounded border border-dashed border-slate-300 bg-slate-50 p-3 text-xs text-slate-500">
                    This is a sample listing created for the prototype. The specification below shows
                    the level of detail Dashlink will publish for every priced unit.
                  </p>
                ) : (
                  <p className="rounded border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
                    Only details confirmed for this unit are published. Anything we have not verified
                    is marked “Contact for details” — ask us and we will check it before you travel.
                  </p>
                )}
              </div>
            </div>

            <div className="panel p-5 md:p-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <h2 className="text-xl font-bold">Specification</h2>
                <a
                  href={vehicle.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="link-arrow"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Confirm a missing detail
                </a>
              </div>

              <dl className="mt-4 grid gap-x-8 sm:grid-cols-2">
                {rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-3 border-b border-slate-100 py-2.5 text-sm"
                  >
                    <dt className="flex items-center gap-2 text-slate-500">
                      <row.icon className="h-4 w-4 text-navy-300" />
                      {row.label}
                    </dt>
                    <dd
                      className={`text-right font-medium ${
                        row.value ? "text-navy-900" : "italic text-slate-400"
                      }`}
                    >
                      {row.value ?? "Contact for details"}
                    </dd>
                  </div>
                ))}
              </dl>

              {vehicle.features.length > 0 ? (
                <>
                  <h3 className="mt-6 text-sm font-bold uppercase tracking-[0.12em] text-navy-900">
                    Features &amp; highlights
                  </h3>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {vehicle.features.map((feature) => (
                      <li key={feature} className="flex gap-2 text-sm text-slate-600">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-dash-red" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="mt-6 rounded border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  <p className="font-semibold text-navy-900">Full feature list on request</p>
                  <p className="mt-1 leading-relaxed">
                    We publish only verified features for this unit. Ask on WhatsApp and we will send
                    the trim details, interior condition notes and any extra photos you need.
                  </p>
                </div>
              )}

              {vehicle.specs.length > 0 ? (
                <div className="mt-5">
                  <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-navy-900">
                    Confirmed notes
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                    {vehicle.specs.map((spec) => (
                      <li key={spec.label}>
                        <span className="font-medium text-navy-800">{spec.label}:</span> {spec.value}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="panel p-5 md:p-6">
              <h2 className="text-xl font-bold">Photos &amp; video</h2>
              <p className="mt-1 text-sm text-slate-500">
                Walkaround clips and reels play or open from this section.
              </p>
              <div className="mt-4">
                <VehicleVideos videos={vehicle.videos} title={vehicle.title} slug={vehicle.slug} />
              </div>
            </div>

            <div className="panel p-5 md:p-6">
              <h2 className="text-xl font-bold">Inspection, paperwork and payment</h2>
              <ul className="mt-3 space-y-3 text-sm text-slate-600">
                {[
                  "Inspect the vehicle in person at 47 Ogunnusi Road, Ogba, Ikeja. You can bring your mechanic.",
                  "Ask for the customs and registration papers before you pay anything.",
                  "Confirm your final price in writing on WhatsApp before transfer.",
                  "Vehicle documents are handed over on completion of payment.",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <ShieldIcon className="mt-0.5 h-4 w-4 shrink-0 text-dash-red" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={vehicle.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-whatsapp btn-sm"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Chat about this car
                </a>
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  <InstagramIcon className="h-4 w-4" />
                  More photos on Instagram
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div id="enquire">
              <EnquiryForm
                vehicleSlug={vehicle.slug}
                vehicleTitle={vehicle.title}
                heading="Enquire about this vehicle"
                description={`Send your details and we will reply with price, availability and inspection times for the ${vehicle.title}.`}
                compact
              />
            </div>

            <div className="panel p-5">
              <h2 className="text-base font-bold">Not quite what you need?</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                Pre-order the exact specification you want and Dashlink will source it for you.
              </p>
              <Link href="/pre-order" className="btn btn-outline btn-sm mt-3">
                Pre-order a vehicle
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>

            <div className="panel p-5">
              <h2 className="text-base font-bold">Dashlink Integrated Autos</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                {site.address.line1}, {site.address.line2}, {site.address.city}.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href={`tel:${site.phones[0].raw}`} className="btn btn-outline btn-sm">
                  <PhoneIcon className="h-4 w-4" />
                  {site.phones[0].label}
                </a>
                <Link href="/contact" className="btn btn-outline btn-sm">
                  Contact &amp; directions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {similar.length > 0 ? (
        <section className="border-t border-slate-100 bg-slate-50 py-12">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <span className="eyebrow">You may also like</span>
                <h2 className="mt-3 text-2xl font-bold">Similar vehicles available now</h2>
              </div>
              <Link href="/inventory" className="link-arrow">
                Browse all cars
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((item) => (
                <VehicleCard key={item.slug} vehicle={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
