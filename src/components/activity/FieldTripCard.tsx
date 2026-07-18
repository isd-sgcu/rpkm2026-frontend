import { useState } from "react";

import { CalendarDays, Clock, MapPin } from "lucide-react";

import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";
import { useT } from "@lib/i18n/useT";
import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";

// Registration is only open from 18 Jul 19:00 to 21 Jul 00:00 2026 (UTC+7).
// Expressed as absolute UTC instants so it's correct in any viewer timezone:
//   18 Jul 2026 19:00 (+07) === 18 Jul 2026 12:00 UTC
//   21 Jul 2026 00:00 (+07) === 20 Jul 2026 17:00 UTC
const REGISTER_OPEN_UTC = Date.UTC(2026, 6, 18, 12, 0, 0);
const REGISTER_CLOSE_UTC = Date.UTC(2026, 6, 20, 17, 0, 0);

/** One sub-route within a field trip, e.g. "Plant Walk". */
export type FieldTripRoute = {
  name?: string;
  /** Free text, e.g. "22-23 กรกฎาคม 69". */
  date: string;
  time: string;
  location: string;
  registerUrl?: string;
};

export type FieldTrip = {
  id: string;
  title: string;
  description: string;
  routes: FieldTripRoute[];
  registerUrl?: string;
};

type FieldTripCardProps = {
  fieldTrip: FieldTrip;
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
  const t = useT();
  const { title, description, routes, registerUrl } = fieldTrip;

  // Registration link is clickable only inside the 18–20 Jul 2026 (UTC+7)
  // window (the backend may enforce this too). Whenever you can't register —
  // before or after the window, or when disabled — the button turns grey and
  // reads "ปิดลงทะเบียน".
  const [now] = useState(() => Date.now());
  const registrationOpen = now >= REGISTER_OPEN_UTC && now < REGISTER_CLOSE_UTC;
  const canRegister = registrationOpen && !disabled;
  const registerLabel = canRegister
    ? t("activity.fieldTrip.button")
    : t("activity.fieldTrip.buttonClosed");

  const openLink = (url?: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <article
      className={cn(
        "w-full max-w-92.5 overflow-hidden rounded-2xl border border-rpkm-black",
        className,
      )}
      // Coloured (outer) layer — swap the colour per card.
      style={{ backgroundColor: color }}
    >
      {/* Title strip — the only part where the coloured layer shows. */}
      <MonotoneNoiseContainer noise={{ noiseColor: "#80CBE8" }}>
        <h2 className="px-3 pt-1 pb-1 text-xl font-bold text-white">{title}</h2>

        {/* White info panel — reaches both sides and the bottom of the card.
            Its own noise layer sits behind the content, above the opaque bg. */}
        <MonotoneNoiseContainer
          noise={{ noiseColor: "#80CBE8" }}
          className="rounded-t-2xl border-t border-rpkm-black bg-background p-3"
        >
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
                    <span className="whitespace-pre-line">
                      {route.location}
                    </span>
                  </span>

                  {/* Per-route register button — only when this route has a link. */}
                  {route.registerUrl !== undefined && (
                    <Button
                      type="button"
                      className={cn(
                        "mt-auto self-center rounded-full px-6",
                        !canRegister && "bg-rpkm-grey",
                      )}
                      disabled={!canRegister}
                      onClick={() => openLink(route.registerUrl)}
                    >
                      {registerLabel}
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
                className={cn(
                  "rounded-full px-6",
                  !canRegister && "bg-rpkm-grey",
                )}
                disabled={!canRegister}
                onClick={() => openLink(registerUrl)}
              >
                {registerLabel}
              </Button>
            </div>
          )}
        </MonotoneNoiseContainer>
      </MonotoneNoiseContainer>
    </article>
  );
}
