import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import {
  InstagramIcon,
  MapPinIcon,
  PhoneIcon,
  TikTokIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from "@/components/icons";
import { generalWhatsAppLink, site } from "@/lib/site";

const inventoryLinks = [
  { label: "All vehicles", href: "/inventory" },
  { label: "SUVs", href: "/inventory?bodyType=SUV" },
  { label: "Sedans", href: "/inventory?bodyType=Sedan" },
  { label: "Toyota in stock", href: "/inventory?make=Toyota" },
  { label: "Just arrived", href: "/inventory?sort=recent" },
];

const companyLinks = [
  { label: "About Dashlink", href: "/about" },
  { label: "Pre-order a vehicle", href: "/pre-order" },
  { label: "Contact & location", href: "/contact" },
  { label: "Saved vehicles", href: "/saved" },
  { label: "Compare vehicles", href: "/compare" },
];

export function SiteFooter() {
  return (
    <footer className="bg-navy-950 text-navy-200">
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div>
          <BrandLogo variant="dark" showTagline />
          <p className="mt-4 text-sm leading-relaxed text-navy-200">
            Automobile dealership, vehicle importation and sourcing. High-grade foreign-used cars
            available at our Ogba, Ikeja yard.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noreferrer"
              aria-label="Dashlink on Instagram"
              className="flex h-9 w-9 items-center justify-center rounded border border-white/20 text-white transition hover:border-white/60"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <span
              title="Dealer video channel — send your YouTube link on WhatsApp"
              className="flex h-9 w-9 cursor-default items-center justify-center rounded border border-white/10 text-white/40"
            >
              <YouTubeIcon className="h-4 w-4" />
            </span>
            <span
              title="Dealer video channel — send your TikTok link on WhatsApp"
              className="flex h-9 w-9 cursor-default items-center justify-center rounded border border-white/10 text-white/40"
            >
              <TikTokIcon className="h-4 w-4" />
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">Inventory</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {inventoryLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">Visit us</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2.5">
              <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-dash-red" />
              <span>
                {site.address.line1},<br />
                {site.address.line2}, {site.address.city}, Nigeria.
              </span>
            </li>
            {site.phones.map((phone) => (
              <li key={phone.raw} className="flex gap-2.5">
                <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-dash-red" />
                <a href={`tel:${phone.raw}`} className="transition hover:text-white">
                  {phone.label}
                </a>
              </li>
            ))}
            <li className="flex gap-2.5">
              <WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0 text-dash-green" />
              <a
                href={generalWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-white"
              >
                WhatsApp enquiries
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-navy-300 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Dashlink Integrated Autos. All rights reserved.</p>
          <p className="max-w-xl leading-relaxed">
            Prototype website: listing photographs are illustrative. Confirm price, condition and
            paperwork on WhatsApp before you travel to the yard.
          </p>
        </div>
      </div>
    </footer>
  );
}
