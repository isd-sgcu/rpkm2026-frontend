import { CalendarDays, Clock, MapPin } from "lucide-react";

import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";

/** One sub-route within a field trip, e.g. "Plant Walk". */
export type FieldTripRoute = {
  name?: string;
  /** Free text, e.g. "22-23 กรกฎาคม 69". */
  date: string;
  /** Free text, e.g. "8:30-11:00 น.". */
  time: string;
  /** Free text; use "\n" to split onto multiple lines. */
  location: string;
  /**
   * Optional per-route registration link. When set, this route shows its own
   * register button (e.g. eco's Plant Walk + Trashvenger). Leave it out to use a
   * single card-level button instead (see FieldTrip.registerUrl).
   */
  registerUrl?: string;
};

export type FieldTrip = {
  id: string;
  title: string;
  description: string;
  routes: FieldTripRoute[];
  /** Optional single registration link, when the routes have no own links. */
  registerUrl?: string;
};

type FieldTripCardProps = {
  fieldTrip: FieldTrip;
  /**
   * Background colour of the card's coloured (outer) layer. Set this per card —
   * each of the three cards uses a different colour. Any CSS colour works.
   */
  color?: string;
  disabled?: boolean;
  className?: string;
};

export function FieldTripCard({
  fieldTrip,
  color = "#6ABF73",
  disabled = false,
  className,
}: FieldTripCardProps) {
  const { title, description, routes, registerUrl } = fieldTrip;

  const openLink = (url?: string) => {
    // TODO: replace the placeholder registerUrl values with the real links.
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <article
      className={cn(
        "w-full max-w-[370px] overflow-hidden rounded-2xl border border-rpkm-black",
        className,
      )}
      // Coloured (outer) layer — swap the colour per card.
      style={{ backgroundColor: color }}
    >
      {/* Title strip — the only part where the coloured layer shows. */}
      <h2 className="px-4 pt-3 pb-2 text-xl font-bold text-white">{title}</h2>

      {/* White info panel — reaches both sides and the bottom of the card. */}
      <div className="rounded-t-2xl border-t border-rpkm-black bg-white p-4">
        {/* Description. `whitespace-pre-line` makes "\n" in the text break lines. */}
        <p className="text-xs leading-relaxed whitespace-pre-line text-[#46545b]">
          {description}
        </p>

        {/* Sub-routes, laid out in columns. Each route has its own register
            button, pushed to the bottom so the buttons line up across columns. */}
        {routes.length > 0 && (
          <div
            className={cn(
              "mt-4 grid gap-4",
              // A lone route fills the whole width; two routes sit side by side.
              routes.length === 1 ? "grid-cols-1" : "grid-cols-2",
            )}
          >
            {routes.map((route) => (
              <div
                key={route.name}
                className="flex flex-col gap-2 text-xs text-[#46545b]"
              >
                <h3 className="text-sm font-bold text-rpkm-black">
                  {route.name}
                </h3>
                <span className="flex items-start gap-1.5 whitespace-pre-line">
                  <CalendarDays
                    className="mt-0.5 size-3.5 shrink-0"
                    aria-hidden
                  />
                  <span>{route.date}</span>
                </span>
                <span className="flex items-start gap-1.5">
                  <Clock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                  <span>{route.time}</span>
                </span>
                <span className="flex items-start gap-1.5">
                  <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                  <span className="whitespace-pre-line">{route.location}</span>
                </span>

                {/* Per-route register button — only when this route has a link. */}
                {route.registerUrl !== undefined && (
                  <Button
                    type="button"
                    className="mt-auto self-center rounded-full px-6"
                    disabled={disabled}
                    onClick={() => openLink(route.registerUrl)}
                  >
                    ลงทะเบียน
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Single card-level register button — used when the routes don't have
            their own per-route links. */}
        {registerUrl !== undefined && (
          <div className="mt-5 flex justify-end">
            <Button
              type="button"
              className="rounded-full px-6"
              disabled={disabled}
              onClick={() => openLink(registerUrl)}
            >
              ลงทะเบียน
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
