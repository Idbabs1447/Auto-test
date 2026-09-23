"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import {
  CloseIcon,
  CompareIcon,
  HeartIcon,
  InstagramIcon,
  MapPinIcon,
  MenuIcon,
  PhoneIcon,
  SearchIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { useSavedVehicles } from "@/components/saved-provider";
import { generalWhatsAppLink, site } from "@/lib/site";

const QUICK_LINKS = [
  { label: "Toyota", href: "/inventory?make=Toyota" },
  { label: "Lexus", href: "/inventory?make=Lexus" },
  { label: "SUVs", href: "/inventory?bodyType=SUV" },
  { label: "Sedans", href: "/inventory?bodyType=Sedan" },
  { label: "Under ₦25m", href: "/inventory?priceMax=25000000" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { saved, compare } = useSavedVehicles();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) searchInput.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_1px_0_rgba(15,23,42,0.07)]">
      {/* Utility strip — collapses once the user scrolls */}
      <div
        className={`hidden overflow-hidden bg-navy-900 text-white transition-all duration-300 lg:block ${
          scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
        }`}
      >
        <div className="container-page flex items-center justify-between py-2 text-xs">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-navy-100">
              <MapPinIcon className="h-3.5 w-3.5" />
              {site.address.line1}, {site.address.line2}, {site.address.city}
            </span>
            <span className="inline-flex items-center gap-1.5 text-navy-100">
              <InstagramIcon className="h-3.5 w-3.5" />
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                {site.instagram.handle}
              </a>
            </span>
          </div>
          <div className="flex items-center gap-5">
            {site.phones.map((phone) => (
              <a
                key={phone.raw}
                href={`tel:${phone.raw}`}
                className="inline-flex items-center gap-1.5 font-medium text-navy-100 hover:text-white"
              >
                <PhoneIcon className="h-3.5 w-3.5" />
                {phone.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container-page">
        <div
          className={`flex items-center justify-between gap-4 transition-all duration-300 ${
            scrolled ? "py-2.5" : "py-3.5"
          }`}
        >
          <BrandLogo
            showTagline={false}
            className={scrolled ? "scale-95 origin-left" : ""}
          />

          <nav className="hidden items-center gap-1 lg:flex">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-navy-900"
                    : "text-slate-600 hover:text-navy-900"
                }`}
              >
                {item.label}
                <span
                  className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-dash-red transition-opacity ${
                    isActive(item.href) ? "opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              aria-label="Search inventory"
              aria-expanded={searchOpen}
              className="btn-icon"
            >
              {searchOpen ? <CloseIcon className="h-4 w-4" /> : <SearchIcon className="h-4 w-4" />}
            </button>

            <Link
              href="/saved"
              aria-label="Saved vehicles"
              className="btn-icon relative hidden sm:inline-flex"
            >
              <HeartIcon className="h-4 w-4" filled={saved.length > 0} />
              {saved.length > 0 ? (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-dash-red px-1 text-[10px] font-bold text-white">
                  {saved.length}
                </span>
              ) : null}
            </Link>

            {compare.length > 0 ? (
              <Link
                href="/compare"
                aria-label="Compare vehicles"
                className="btn-icon relative hidden sm:inline-flex"
              >
                <CompareIcon className="h-4 w-4" />
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-navy-800 px-1 text-[10px] font-bold text-white">
                  {compare.length}
                </span>
              </Link>
            ) : null}

            <a
              href={generalWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp hidden lg:inline-flex"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Chat on WhatsApp
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="btn-icon lg:hidden"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {searchOpen ? (
        <div className="border-t border-slate-100 bg-white">
          <div className="container-page py-4">
            <form action="/inventory" className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  ref={searchInput}
                  name="q"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search Toyota Camry, Lexus RX 350, Tucson..."
                  className="input pl-9"
                  aria-label="Search vehicles"
                />
              </div>
              <button type="submit" className="btn btn-navy">
                Search Cars
              </button>
            </form>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Popular
              </span>
              {QUICK_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="chip !py-1.5 !text-xs">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${menuOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          tabIndex={menuOpen ? 0 : -1}
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-navy-950/60 transition-opacity ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[86%] max-w-sm overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <BrandLogo />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="btn-icon"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <nav className="px-2 py-3">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded px-3 py-3 text-sm font-semibold ${
                  isActive(item.href)
                    ? "bg-navy-50 text-navy-900"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {item.label}
                {isActive(item.href) ? (
                  <span className="h-2 w-2 rounded-full bg-dash-red" />
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="grid grid-cols-2 gap-2 px-4 py-2">
            <Link href="/saved" className="btn btn-outline">
              <HeartIcon className="h-4 w-4" filled={saved.length > 0} />
              Saved ({saved.length})
            </Link>
            <Link href="/compare" className="btn btn-outline">
              <CompareIcon className="h-4 w-4" />
              Compare ({compare.length})
            </Link>
          </div>

          <div className="space-y-2 px-4 py-4">
            <a
              href={generalWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp w-full"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Chat on WhatsApp
            </a>
            {site.phones.map((phone) => (
              <a key={phone.raw} href={`tel:${phone.raw}`} className="btn btn-outline w-full">
                <PhoneIcon className="h-4 w-4" />
                Call {phone.label}
              </a>
            ))}
          </div>

          <div className="border-t border-slate-100 px-4 py-4 text-sm text-slate-500">
            <p className="font-semibold text-navy-900">Visit the yard</p>
            <p className="mt-1 leading-relaxed">
              {site.address.line1},<br />
              {site.address.line2},<br />
              {site.address.city}, {site.address.country}.
            </p>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 font-medium text-navy-800"
            >
              <InstagramIcon className="h-4 w-4" />
              {site.instagram.handle}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
