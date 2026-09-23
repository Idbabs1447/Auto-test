export const site = {
  name: "Dashlink Integrated Autos",
  shortName: "Dashlink Autos",
  tagline: "Foreign-used vehicles, importation and vehicle sourcing — Ogba, Ikeja, Lagos.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  address: {
    line1: "47 Ogunnusi Road",
    line2: "Ogba, Ikeja",
    city: "Lagos",
    country: "Nigeria",
  },
  phones: [
    { label: "0803 712 2549", raw: "08037122549", intl: "2348037122549" },
    { label: "0809 555 0003", raw: "08095550003", intl: "2348095550003" },
  ],
  whatsappNumber: "2348037122549",
  instagram: {
    handle: "@dashlinkautos889",
    url: "https://www.instagram.com/dashlinkautos889/",
  },
  hours: [
    { day: "Monday – Friday", time: "8:00am – 6:00pm" },
    { day: "Saturday", time: "9:00am – 5:00pm" },
    { day: "Sunday", time: "By appointment" },
  ],
  services: [
    {
      title: "Vehicle Importation",
      description:
        "Orders placed, inspected abroad and shipped to Nigeria, with clearing handled through to delivery.",
    },
    {
      title: "Vehicle Sales",
      description:
        "High-grade foreign-used (Tokunbo) cars on ground at our Ogba, Ikeja lot and ready for inspection.",
    },
    {
      title: "Pre-Order & Sourcing",
      description:
        "Tell us the exact make, model, year and budget. We source matching units and send you options.",
    },
    {
      title: "Swap & Upgrade Support",
      description:
        "Trading in your current car? Talk to us about part-exchange options against a unit in stock.",
    },
  ],
  nav: [
    { label: "Home", href: "/" },
    { label: "Shop Cars", href: "/inventory" },
    { label: "Pre-Order", href: "/pre-order" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export const WHATSAPP_GREEN = "#25D366";

export function whatsappLink(message: string, number: string = site.whatsappNumber) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function generalWhatsAppLink() {
  return whatsappLink(
    `Hello ${site.shortName}, I would like to enquire about a vehicle.`,
  );
}

export function vehicleWhatsAppLink(input: {
  title: string;
  slug: string;
  priceLabel?: string;
}) {
  const listingUrl = `${site.url.replace(/\/$/, "")}/vehicles/${input.slug}`;
  const price = input.priceLabel ? ` Listed price/details: ${input.priceLabel}.` : "";
  return whatsappLink(
    `Hello ${site.shortName}, I'm interested in the ${input.title} I saw on your website.${price} Please confirm availability and share the details.\n\nListing: ${listingUrl}`,
  );
}

export function preorderWhatsAppLink(details: string[]) {
  const body = details.filter(Boolean).join("\n");
  return whatsappLink(
    `Hello ${site.shortName}, I'd like to pre-order / source a vehicle.\n\n${body}\n\nPlease advise on next steps.`,
  );
}

export function formatNaira(value: number | null | undefined) {
  if (value === null || value === undefined) return "Contact for Price";
  return `₦${value.toLocaleString("en-NG")}`;
}

export function formatMileage(km: number | null | undefined) {
  if (km === null || km === undefined) return null;
  return `${km.toLocaleString("en-NG")} km`;
}

export function vehicleTitle(input: {
  year: number;
  make: string;
  model: string;
  trim?: string | null;
}) {
  const base = `${input.year} ${input.make} ${input.model}`;
  const trim = input.trim?.trim();
  if (!trim || input.model.toLowerCase().includes(trim.toLowerCase())) return base;
  return `${base} ${trim}`;
}

export const DEMO_NOTE =
  "Sample listing for demonstration. Prototype inventory — not a confirmed Dashlink unit.";
