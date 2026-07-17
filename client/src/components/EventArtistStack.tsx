import type { ScheduledEvent } from "@shared/events/types";
import ResponsiveImage from "@/components/ResponsiveImage";
import { cn } from "@/lib/utils";

export default function EventArtistStack({
  artistImages,
  className,
}: {
  artistImages?: ScheduledEvent["artistImages"];
  className?: string;
}) {
  if (!artistImages?.length) return null;

  return (
    <div
      className={cn("flex shrink-0 -space-x-3", className)}
      aria-label="Confirmed artist photos"
    >
      {artistImages.map((image, index) => (
        <span
          key={`${image.artist}-${image.src}`}
          className="relative block h-12 w-12 overflow-hidden rounded-full border-2 border-black bg-black shadow-[0_8px_24px_rgba(0,0,0,0.35)] md:h-14 md:w-14"
          style={{ zIndex: artistImages.length - index }}
          title={image.artist}
        >
          <ResponsiveImage
            src={image.src}
            alt={image.alt}
            sizes="56px"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center saturate-[0.88] transition duration-500 group-hover:saturate-100"
          />
        </span>
      ))}
    </div>
  );
}
