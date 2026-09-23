import Link from "next/link";
import { CarIcon, PhoneIcon, SearchIcon, WhatsAppIcon } from "@/components/icons";
import { generalWhatsAppLink, site } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-page max-w-2xl text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy-50 text-navy-800">
          <SearchIcon className="h-6 w-6" />
        </span>
        <h1 className="mt-5 text-3xl font-bold">We couldn&apos;t find that vehicle</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          The listing may have been sold, reserved or renamed. Browse what is available now, or ask us
          directly — the car you want can often be sourced.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/inventory" className="btn btn-navy">
            <CarIcon className="h-4 w-4" />
            Browse available cars
          </Link>
          <a href={generalWhatsAppLink()} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
            <WhatsAppIcon className="h-4 w-4" />
            Chat on WhatsApp
          </a>
          <a href={`tel:${site.phones[0].raw}`} className="btn btn-outline">
            <PhoneIcon className="h-4 w-4" />
            {site.phones[0].label}
          </a>
        </div>
      </div>
    </section>
  );
}
