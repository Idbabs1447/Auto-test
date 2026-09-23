import type { Metadata } from "next";
import Link from "next/link";
import {
  ClockIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { EnquiryForm } from "@/components/enquiry-form";
import { MapEmbed } from "@/components/map-embed";
import { generalWhatsAppLink, site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Dashlink Integrated Autos",
  description:
    "Call 0803 712 2549 or 0809 555 0003, chat on WhatsApp, or visit Dashlink Integrated Autos at 47 Ogunnusi Road, Ogba, Ikeja, Lagos.",
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-slate-200 bg-navy-950 py-10 md:py-12">
        <div className="container-page">
          <nav className="flex items-center gap-2 text-xs text-navy-200">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">Contact</span>
          </nav>
          <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">Contact Dashlink</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-navy-200 md:text-base">
            WhatsApp is the fastest way to reach us — send the car you are interested in and we will
            reply with price, availability and viewing times.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_1.15fr]">
          <div className="space-y-5">
            <a
              href={generalWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              className="panel flex items-center gap-4 p-5 transition hover:border-dash-green"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-[#e9fbf0] text-dash-green-dark">
                <WhatsAppIcon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-base font-bold text-navy-900">Chat on WhatsApp</span>
                <span className="mt-0.5 block text-sm text-slate-500">
                  Price, photos, video and inspections
                </span>
              </span>
            </a>

            <div className="panel p-5">
              <h2 className="text-base font-bold">Call the dealership</h2>
              <div className="mt-3 grid gap-2">
                {site.phones.map((phone) => (
                  <a
                    key={phone.raw}
                    href={`tel:${phone.raw}`}
                    className="flex items-center justify-between rounded border border-slate-200 px-4 py-3 transition hover:border-navy-800"
                  >
                    <span className="flex items-center gap-3 text-sm font-semibold text-navy-900">
                      <PhoneIcon className="h-4 w-4 text-dash-red" />
                      {phone.label}
                    </span>
                    <span className="text-xs text-slate-400">Tap to call</span>
                  </a>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                If a line is busy, please try the second number or send a WhatsApp message.
              </p>
            </div>

            <div className="panel p-5">
              <h2 className="flex items-center gap-2 text-base font-bold">
                <MapPinIcon className="h-4 w-4 text-dash-red" />
                Visit the yard
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {site.address.line1},
                <br />
                {site.address.line2},
                <br />
                {site.address.city}, {site.address.country}.
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${site.address.line1}, ${site.address.line2}, ${site.address.city}`,
                )}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm mt-3"
              >
                Open in Google Maps
              </a>

              <h3 className="mt-5 flex items-center gap-2 text-sm font-bold text-navy-900">
                <ClockIcon className="h-4 w-4 text-dash-red" />
                Opening hours
              </h3>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                {site.hours.map((entry) => (
                  <li key={entry.day} className="flex justify-between gap-4">
                    <span>{entry.day}</span>
                    <span className="font-medium text-navy-800">{entry.time}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-slate-400">
                Public holidays may differ — call ahead before travelling.
              </p>
            </div>

            <div className="panel p-5">
              <h2 className="text-base font-bold">Follow the stock</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                New arrivals and walkaround clips are posted on Instagram.
              </p>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm mt-3"
              >
                <InstagramIcon className="h-4 w-4" />
                {site.instagram.handle}
              </a>
              <p className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <MailIcon className="h-4 w-4" />
                Prefer a written request? Use the form on this page instead.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <EnquiryForm
              heading="Send an enquiry"
              description="Tell us the car you are interested in, your budget, or your question. We reply from the yard during working hours."
            />

            <div>
              <h2 className="mb-3 text-base font-bold">Find us on the map</h2>
              <MapEmbed className="h-80 w-full md:h-96" />
            </div>

            <div className="panel flex flex-wrap items-center justify-between gap-3 p-5">
              <p className="text-sm text-slate-600">
                Want a car we do not have in stock? Send a sourcing request.
              </p>
              <div className="flex gap-2">
                <Link href="/pre-order" className="btn btn-red btn-sm">
                  Pre-order
                </Link>
                <a
                  href={whatsappLink("Hello Dashlink Autos, I'd like to book a viewing.")}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-whatsapp btn-sm"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Book a viewing
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
