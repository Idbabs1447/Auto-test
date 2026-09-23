import {
  InstagramIcon,
  PlayIcon,
  TikTokIcon,
  WhatsAppIcon,
  YouTubeIcon,
  platformIcon,
} from "@/components/icons";
import { site, whatsappLink } from "@/lib/site";
import type { VehicleVideo } from "@/lib/types";

const PLATFORM_META: Record<string, { label: string; className: string }> = {
  youtube: { label: "YouTube", className: "bg-[#ff0000]/10 text-[#c00]" },
  tiktok: { label: "TikTok", className: "bg-slate-900/5 text-slate-900" },
  instagram: { label: "Instagram", className: "bg-[#c13584]/10 text-[#a02c6d]" },
};

export function VehicleVideos({
  videos,
  title,
  slug,
}: {
  videos: VehicleVideo[];
  title: string;
  slug: string;
}) {
  const requestLink = whatsappLink(
    `Hello ${site.shortName}, please send me a video walkaround of the ${title} (${site.url.replace(/\/$/, "")}/vehicles/${slug}).`,
  );

  const embeddable = videos.find(
    (video) => video.platform === "youtube" && video.embedId,
  );

  return (
    <div className="space-y-4">
      {embeddable ? (
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <div className="relative aspect-video bg-navy-950">
            <iframe
              src={`https://www.youtube.com/embed/${embeddable.embedId}`}
              title={`${title} — video`}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      ) : null}

      {videos.length > 0 ? (
        <ul className="space-y-2.5">
          {videos.map((video) => {
            const Icon = platformIcon(video.platform);
            const meta = PLATFORM_META[video.platform] ?? PLATFORM_META.instagram;
            return (
              <li key={`${video.platform}-${video.url}`}>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 transition hover:border-navy-300"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-navy-900 text-white">
                    <PlayIcon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className={`badge ${meta.className}`}>
                        <Icon className="h-3 w-3" />
                        {meta.label}
                      </span>
                    </span>
                    <span className="mt-1 block truncate text-sm text-slate-600">
                      {video.caption ?? `Watch the ${title} on ${meta.label}`}
                    </span>
                  </span>
                  <span className="hidden text-xs font-semibold text-navy-700 sm:block">Open</span>
                </a>
              </li>
            );
          })}
        </ul>
      ) : null}

      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-navy-900">Want to see this car on video?</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">
          Ask for a walkaround clip filmed at the yard — engine start, interior and body close-ups.
          Video links from YouTube, TikTok and Instagram display on this page for every unit we
          publish.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a href={requestLink} target="_blank" rel="noreferrer" className="btn btn-whatsapp btn-sm">
            <WhatsAppIcon className="h-4 w-4" />
            Request a video
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
          <span className="btn btn-outline btn-sm pointer-events-none opacity-70">
            <YouTubeIcon className="h-4 w-4" />
            YouTube
          </span>
          <span className="btn btn-outline btn-sm pointer-events-none opacity-70">
            <TikTokIcon className="h-4 w-4" />
            TikTok
          </span>
        </div>
      </div>
    </div>
  );
}
