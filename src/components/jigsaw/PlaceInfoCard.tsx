import { MapPin } from "lucide-react";

import { cn } from "@lib/utils";

interface PlaceInfoCardProps {
  image: string;
  title: string;
  mapUrl: string;
  imageAlt?: string;
  className?: string;
}

/**
 * A place card built from two stacked backgrounds: a green plate behind and a
 * cream (#FFFAC9) plate in front. The front holds a green-framed square with the
 * place photo on the left and the title in the middle, plus a map pin in the
 * bottom-right corner that links out to Google Maps.
 */
export function PlaceInfoCard({
  image,
  title,
  mapUrl,
  imageAlt = "",
  className,
}: PlaceInfoCardProps) {
  return (
    /* Back plate: green, peeks out around the front as a frame. */
    <div className={cn("rounded-3xl bg-rpkm-green p-2.5", className)}>
      {/* Front plate: cream, holds the photo, title and map pin. */}
      <div className="relative flex items-center gap-4 rounded-3xl bg-[#FFFAC9] p-4">
        {/* Green square framing the photo, centred inside. */}
        <div className="aspect-square w-2/5 shrink-0 rounded-2xl bg-rpkm-green p-1.5">
          <img
            src={image}
            alt={imageAlt}
            className="h-full w-full rounded-xl object-cover"
          />
        </div>

        {/* Title, centred in the remaining space. */}
        <h2 className="flex-1 pr-6 pb-6 text-lg leading-snug font-normal text-foreground">
          {title}
        </h2>

        {/* Map pin: taps through to Google Maps. */}
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`เปิด ${title} ใน Google Maps`}
          className="absolute right-4 bottom-4 grid place-items-center rounded-full p-1 transition-opacity hover:opacity-70"
        >
          <MapPin className="size-7 fill-foreground text-[#FFFAC9]" />
        </a>
      </div>
    </div>
  );
}
