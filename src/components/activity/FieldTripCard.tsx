import { CalendarDays, Clock, MapPin } from "lucide-react";

import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";

/** One sub-route within a field trip, e.g. "Plant Walk". */
export type FieldTripRoute = {
  name: string;
  /** Free text, e.g. "22-23 กรกฎาคม 69". */
  date: string;
  /** Free text, e.g. "8:30-11:00 น.". */
  time: string;
  /** Free text; use "\n" to split onto multiple lines. */
  location: string;
};

export type FieldTrip = {
  id: string;
  title: string;
  description: string;
  routes: FieldTripRoute[];
  /** Placeholder — insert the real registration link here later. */
  registerUrl: string;
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

  const handleRegister = () => {
    // TODO: replace the placeholder registerUrl with the real link.
    if (!registerUrl) return;
    window.open(registerUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <article
      className={cn(
        "w-full max-w-[370px] overflow-hidden rounded-2xl border border-black",
        className,
      )}
      // Coloured (outer) layer — swap the colour per card.
      style={{ backgroundColor: color }}
    >
      {/* Title strip — the only part where the coloured layer shows. */}
      <h2 className="px-4 pt-3 pb-2 text-xl font-bold text-white">{title}</h2>

      {/* White info panel — reaches both sides and the bottom of the card. */}
      <div className="rounded-t-2xl border-t border-black bg-white p-4">
        {/* Description. */}
        <p className="text-xs leading-relaxed text-[#46545b]">{description}</p>

        {/* Sub-routes, laid out in columns. */}
        {routes.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            {routes.map((route) => (
              <div
                key={route.name}
                className="grid content-start gap-2 text-xs text-[#46545b]"
              >
                <h3 className="text-sm font-bold text-black">{route.name}</h3>
                <span className="flex items-start gap-1.5">
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
              </div>
            ))}
          </div>
        )}

        {/* Register — placeholder link; wire the real URL later. */}
        <div className="mt-5 flex justify-end">
          <Button
            type="button"
            className="rounded-full px-6"
            disabled={disabled}
            onClick={handleRegister}
          >
            ลงทะเบียน
          </Button>
        </div>
      </div>
    </article>
  );
}
