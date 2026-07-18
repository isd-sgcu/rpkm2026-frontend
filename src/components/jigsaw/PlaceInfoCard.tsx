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
    <div className={cn("rounded-3xl border bg-rpkm-green p-2.5", className)}>
      {/* Front plate: cream, holds the title and map pin. */}
      <div className="relative flex items-stretch rounded-[29px] border border-foreground bg-[#FFFAC9]">
        {/* Image card: sits in front of both plates with its own border,
            reaching out over the green frame on the top, bottom and left. */}
        <div className="relative z-10 -my-3 -ml-3 w-2/5 shrink-0 overflow-hidden rounded-3xl border border-foreground bg-rpkm-green p-3">
          <img
            src={image}
            alt={imageAlt}
            className="h-full w-full rounded-2xl object-cover"
          />
        </div>

        {/* Title box, centred in the remaining space. */}
        <div className="flex flex-1 items-center p-4 pr-6 pb-8">
          <h2 className="text-lg leading-snug font-normal text-foreground">
            {title}
          </h2>
        </div>

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
