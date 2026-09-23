import { site } from "@/lib/site";

export function MapEmbed({ className = "h-72 w-full" }: { className?: string }) {
  const query = encodeURIComponent(
    `${site.address.line1}, ${site.address.line2}, ${site.address.city}, ${site.address.country}`,
  );

  return (
    <div className={`overflow-hidden rounded-lg border border-slate-200 ${className}`}>
      <iframe
        title="Dashlink Integrated Autos location map"
        src={`https://www.google.com/maps?q=${query}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full"
      />
    </div>
  );
}
