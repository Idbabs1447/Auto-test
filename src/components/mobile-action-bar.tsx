"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CarIcon,
  HeartIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { useSavedVehicles } from "@/components/saved-provider";
import { generalWhatsAppLink, site } from "@/lib/site";

export function MobileActionBar() {
  const pathname = usePathname();
  const { saved } = useSavedVehicles();

  const hiddenOn = pathname.startsWith("/vehicles/");
  if (hiddenOn) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden">
      <div className="grid grid-cols-4">
        <Link href="/inventory" className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-navy-800">
          <CarIcon className="h-5 w-5" />
          Shop cars
        </Link>
        <Link href="/saved" className="relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-navy-800">
          <HeartIcon className="h-5 w-5" filled={saved.length > 0} />
          Saved
          {saved.length > 0 ? (
            <span className="absolute right-3 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-dash-red px-1 text-[10px] font-bold text-white">
              {saved.length}
            </span>
          ) : null}
        </Link>
        <a
          href={`tel:${site.phones[0].raw}`}
          className="flex flex-col items-center gap-1 border-l border-slate-100 py-2.5 text-[11px] font-medium text-navy-800"
        >
          <PhoneIcon className="h-5 w-5" />
          Call us
        </a>
        <a
          href={generalWhatsAppLink()}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-1 bg-dash-green py-2.5 text-[11px] font-semibold text-[#06331b]"
        >
          <WhatsAppIcon className="h-5 w-5" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
