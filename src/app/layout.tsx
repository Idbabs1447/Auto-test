import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CompareBar } from "@/components/compare-bar";
import { MobileActionBar } from "@/components/mobile-action-bar";
import { SavedProvider } from "@/components/saved-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";
import "./fonts.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Dashlink Integrated Autos — Quality Foreign-Used Cars in Lagos",
    template: "%s | Dashlink Integrated Autos",
  },
  description:
    "Browse foreign-used cars available at Dashlink Integrated Autos, 47 Ogunnusi Road, Ogba, Ikeja, Lagos. Importation, sales, pre-order and vehicle sourcing. Enquire on WhatsApp.",
  keywords: [
    "Dashlink Autos",
    "Tokunbo cars Lagos",
    "foreign used cars Nigeria",
    "car dealership Ogba Ikeja",
    "vehicle importation Lagos",
    "pre-order car Nigeria",
  ],
  openGraph: {
    title: "Dashlink Integrated Autos — Your Next Car Starts Here",
    description:
      "Explore quality imported vehicles available in Lagos, or let Dashlink source exactly what you're looking for.",
    type: "website",
    locale: "en_NG",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: site.name,
    description:
      "Automobile dealership, vehicle importation and sales of high-grade foreign-used vehicles.",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address.line1}, ${site.address.line2}`,
      addressLocality: "Ikeja",
      addressRegion: "Lagos",
      addressCountry: "NG",
    },
    telephone: site.phones.map((phone) => phone.raw),
    sameAs: [site.instagram.url],
    areaServed: "Lagos, Nigeria",
    knowsLanguage: ["en"],
  };

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white">
        <SavedProvider>
          <SiteHeader />
          <main className="flex-1 pb-16 lg:pb-0">{children}</main>
          <SiteFooter />
          <MobileActionBar />
          <CompareBar />
        </SavedProvider>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
