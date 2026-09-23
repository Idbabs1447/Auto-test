import type { Metadata } from "next";
import Link from "next/link";
import {
  CarIcon,
  CheckIcon,
  ClockIcon,
  PhoneIcon,
  ShipIcon,
  ShieldIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { PreOrderForm } from "@/components/preorder-form";
import { LOTS_IMAGERY } from "@/db/seed-data";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pre-Order / Find Me A Car",
  description:
    "Tell Dashlink Integrated Autos the vehicle you want. We source and import cars to order — share the make, model, year range and budget and we will come back with options.",
};

const STEPS = [
  {
    icon: CarIcon,
    title: "1. Share the specification",
    body: "Send the make, model or trim, year range, budget and anything that matters (colour, mileage ceiling, family size).",
  },
  {
    icon: ShipIcon,
    title: "2. We source and verify",
    body: "We search units on ground and abroad, check condition and send you photos or video of the actual car before you commit.",
  },
  {
    icon: ShieldIcon,
    title: "3. Agree the landed price",
    body: "You get the full figure in writing — vehicle, shipping where applicable, clearing and any agreed extras. No hidden add-ons.",
  },
  {
    icon: CheckIcon,
    title: "4. Ship, clear, deliver",
    body: "Once payment is confirmed we handle shipping and clearing, then hand over the car with its documents.",
  },
];

const FAQ = [
  {
    q: "How long does an import take?",
    a: "It depends on the port, shipping schedule and clearing time. We give you an expected timeline in writing for your specific unit, and update you as it moves.",
  },
  {
    q: "Can I inspect the car before paying?",
    a: "Yes. For units on ground in Ogba you inspect in person, optionally with your mechanic. For imports we send photos and video before shipping, then you inspect on arrival before final hand-over.",
  },
  {
    q: "What do I need ready?",
    a: "A clear budget, your valid ID for paperwork, and your preferred delivery city. If you are paying by transfer, your bank details for the confirmation trail.",
  },
  {
    q: "Do you buy my current car too?",
    a: "We can discuss part-exchange against a unit in stock. Send us photos, the year and the documents status and we will advise.",
  },
];

export default function PreOrderPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy-950 py-12 md:py-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOTS_IMAGERY.portRoRo}
          alt="Vehicles arriving by ship"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="container-page relative max-w-3xl">
          <nav className="flex items-center gap-2 text-xs text-navy-200">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">Pre-Order</span>
          </nav>
          <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Pre-Order or Find Me A Car
          </h1>
          <p className="mt-4 text-base leading-relaxed text-navy-100">
            The car you want may not be on the website yet. Tell us exactly what you need and Dashlink
            will find it, price it and bring it in — or hold a matching unit from current stock.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={whatsappLink(
                "Hello Dashlink Autos, I want to pre-order a vehicle. Here is what I'm looking for:",
              )}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp btn-lg"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Send specs on WhatsApp
            </a>
            <a href={`tel:${site.phones[0].raw}`} className="btn btn-outline-light btn-lg">
              <PhoneIcon className="h-4 w-4" />
              {site.phones[0].label}
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-8 lg:grid-cols-[1.35fr_1fr]">
          <PreOrderForm />

          <div className="space-y-6">
            <div className="panel p-5">
              <h2 className="text-lg font-bold">How a Dashlink pre-order works</h2>
              <ul className="mt-4 space-y-4">
                {STEPS.map((step) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-navy-900 text-white">
                      <step.icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-navy-900">{step.title}</span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-slate-500">
                        {step.body}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="panel overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={LOTS_IMAGERY.portShip}
                alt="Imported vehicles waiting at the port"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-5">
                <h2 className="text-base font-bold">Local stock or import?</h2>
                <div className="mt-3 space-y-3 text-sm text-slate-600">
                  <p>
                    <span className="font-semibold text-navy-900">Units on ground</span> — inspect
                    today, drive away once payment clears. Best when you need a car quickly.
                  </p>
                  <p>
                    <span className="font-semibold text-navy-900">Pre-order / import</span> — best
                    when you want a specific year, trim or colour that is not in the market right now.
                  </p>
                </div>
                <Link href="/inventory" className="btn btn-outline btn-sm mt-4">
                  Check what is on ground now
                </Link>
              </div>
            </div>

            <div className="panel bg-navy-950 p-5 text-white">
              <h2 className="text-base font-bold text-white">What to have ready</h2>
              <ul className="mt-3 space-y-2 text-sm text-navy-200">
                {[
                  "Budget ceiling in naira",
                  "Year range and acceptable mileage",
                  "Must-have features",
                  "Delivery city and timeline",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-dash-green" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section border-t border-slate-100 bg-slate-50">
        <div className="container-page">
          <span className="eyebrow">Questions we get every week</span>
          <h2 className="mt-3 text-2xl font-bold md:text-3xl">Pre-order questions</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {FAQ.map((item) => (
              <details key={item.q} className="panel p-4">
                <summary className="cursor-pointer text-sm font-semibold text-navy-900">
                  {item.q}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.a}</p>
              </details>
            ))}
          </div>

          <div className="panel mt-8 flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              <ClockIcon className="h-5 w-5 text-dash-red" />
              <p className="text-sm text-slate-600">
                Prefer to talk it through? Call either line and we will walk you through your options.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {site.phones.map((phone) => (
                <a key={phone.raw} href={`tel:${phone.raw}`} className="btn btn-outline btn-sm">
                  <PhoneIcon className="h-4 w-4" />
                  {phone.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
