import type { Metadata } from "next";
import Link from "next/link";
import {
  CarIcon,
  CheckIcon,
  InstagramIcon,
  MapPinIcon,
  PhoneIcon,
  ShipIcon,
  ShieldIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { MapEmbed } from "@/components/map-embed";
import { LOTS_IMAGERY } from "@/db/seed-data";
import { generalWhatsAppLink, site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Dashlink Integrated Autos",
  description:
    "Dashlink Integrated Autos is an automobile dealership at 47 Ogunnusi Road, Ogba, Ikeja, Lagos, offering foreign-used vehicles, importation, sales and vehicle sourcing.",
};

const PRINCIPLES = [
  {
    title: "Inspect before you commit",
    body: "Every unit is available for physical inspection at the Ogba yard. Bring your mechanic, ask for the paperwork, take your time.",
  },
  {
    title: "Straight answers",
    body: "If we do not know a figure, we do not guess it. We confirm with the vehicle in front of us and come back to you.",
  },
  {
    title: "One conversation, on WhatsApp",
    body: "Photos, video, price and next steps in a single thread you can refer back to — easier than juggling calls.",
  },
  {
    title: "Cars that suit Lagos",
    body: "We stock high-grade foreign-used units chosen for Nigerian roads, spare parts availability and resale value.",
  },
];

const BUYER_TIPS = [
  "Match the chassis/VIN on the vehicle to the documents before payment.",
  "Ask about customs duty status — duty-paid units keep you out of trouble later.",
  "Check tyres, suspension and air conditioning during your inspection; budget for what needs replacing.",
  "Get the final price and everything included confirmed in writing on WhatsApp.",
  "Only pay into the dealership account name. Never pay an individual who cannot show authority.",
];

export default function AboutPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy-950 py-12 md:py-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOTS_IMAGERY.heroLot}
          alt="Vehicles at the Dashlink yard"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="container-page relative max-w-3xl">
          <nav className="flex items-center gap-2 text-xs text-navy-200">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">About</span>
          </nav>
          <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            A Lagos dealership built on inspection, not pressure
          </h1>
          <p className="mt-4 text-base leading-relaxed text-navy-100">
            Dashlink Integrated Autos trades from 47 Ogunnusi Road, Ogba, Ikeja — selling high-grade
            foreign-used vehicles, importing to order and helping customers find the exact car they
            want.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <span className="eyebrow">Who we are</span>
            <h2 className="mt-3 text-2xl font-bold md:text-3xl">
              Cars on ground in Ikeja, and cars sourced to order
            </h2>
            <div className="prose-body mt-4 text-sm text-slate-600">
              <p>
                Dashlink Integrated Autos is an automobile dealership based in Ogba, Ikeja, Lagos. We
                sell foreign-used (Tokunbo) vehicles from our yard, import vehicles on request, and
                source specific models for customers who cannot find what they want in the local
                market.
              </p>
              <p>
                Our customers are families replacing a car, professionals buying their first decent
                vehicle, and business owners who need dependable units. Because of that, the way we
                work is simple: the car is available to inspect, the condition is described honestly,
                and the price is confirmed directly with you before any money moves.
              </p>
              <p>
                We publish the details we have verified for each unit. Where a figure is still being
                confirmed — mileage, full trim specifics, paperwork status — the website says
                “Contact for details” rather than filling the gap with guesswork.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {PRINCIPLES.map((item) => (
                <div key={item.title} className="panel p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded bg-navy-50 text-navy-800">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  <h3 className="mt-3 text-base font-semibold">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="panel overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={LOTS_IMAGERY.lotAerial}
                alt="Vehicle storage lot"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>

            <div className="panel p-5">
              <h2 className="text-base font-bold">Services</h2>
              <ul className="mt-3 space-y-3 text-sm text-slate-600">
                {site.services.map((service) => (
                  <li key={service.title}>
                    <span className="block font-semibold text-navy-900">{service.title}</span>
                    <span className="mt-0.5 block leading-relaxed text-slate-500">
                      {service.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="panel p-5">
              <h2 className="flex items-center gap-2 text-base font-bold">
                <MapPinIcon className="h-4 w-4 text-dash-red" />
                Find the yard
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {site.address.line1}, {site.address.line2}, {site.address.city}, Nigeria.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href={`tel:${site.phones[0].raw}`} className="btn btn-outline btn-sm">
                  <PhoneIcon className="h-4 w-4" />
                  Call ahead
                </a>
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  <InstagramIcon className="h-4 w-4" />
                  {site.instagram.handle}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section border-y border-slate-100 bg-slate-50">
        <div className="container-page grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <span className="eyebrow">Buying guidance</span>
            <h2 className="mt-3 text-2xl font-bold md:text-3xl">
              Five things to do before you pay for any car in Lagos
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              This applies to us as much as to any other dealer. We would rather you buy with your
              eyes open.
            </p>
            <ol className="mt-5 space-y-3">
              {BUYER_TIPS.map((tip, index) => (
                <li key={tip} className="flex gap-3 text-sm text-slate-600">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ol>
          </div>

          <div className="grid gap-4">
            <div className="panel p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded bg-navy-50 text-navy-800">
                <ShipIcon className="h-4 w-4" />
              </span>
              <h3 className="mt-3 text-base font-semibold">Importation, handled properly</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                We buy abroad, verify condition, ship and clear. You get the landed price and the
                documents, without chasing agents yourself.
              </p>
            </div>
            <div className="panel p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded bg-navy-50 text-navy-800">
                <ShieldIcon className="h-4 w-4" />
              </span>
              <h3 className="mt-3 text-base font-semibold">High-grade foreign-used only</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                We concentrate on clean, accident-screened units that will hold value and stay
                serviceable in Nigeria.
              </p>
            </div>
            <div className="panel p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded bg-navy-50 text-navy-800">
                <CarIcon className="h-4 w-4" />
              </span>
              <h3 className="mt-3 text-base font-semibold">Stock you can see today</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                Take a look at{" "}
                <Link href="/inventory" className="font-semibold text-navy-800 underline">
                  what is on ground now
                </Link>{" "}
                — sedans, hatchbacks and SUVs across the makes Lagos buys most.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-8 lg:grid-cols-2 lg:items-center">
          <MapEmbed className="h-80 w-full" />
          <div>
            <span className="eyebrow">Talk to us</span>
            <h2 className="mt-3 text-2xl font-bold md:text-3xl">
              Ready to buy, import or just ask a question?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Send a WhatsApp message with the car you have in mind. If you would rather see it in
              person, call ahead and we will arrange a time at the yard.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={generalWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Chat on WhatsApp
              </a>
              <Link href="/pre-order" className="btn btn-red">
                Pre-order a vehicle
              </Link>
              <Link href="/contact" className="btn btn-outline">
                Contact &amp; directions
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              Office enquiries:{" "}
              <a
                href={whatsappLink("Hello Dashlink Autos, I have an enquiry.")}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-navy-700"
              >
                WhatsApp
              </a>{" "}
              · {site.phones.map((phone) => phone.label).join(" · ")}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
