import { useState } from "react";

import { CalendarDays } from "lucide-react";

import { Button } from "@components/ui/button";
import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";
import artboard22 from "@assets/images/artboard_22.svg";
import { cn } from "@lib/utils";
import { useT } from "@lib/i18n/useT";

export type FieldTripActivity = {
  id: string;
  title: string;
  description: string;
  registrationText?: string;
  activityText?: string;
  detailsUrl?: string;
  /**
   * Absolute UTC instant (ms, from Date.UTC) before which the "รายละเอียด"
   * button stays disabled. Leave unset for no gating.
   */
  detailsUnlockUtc?: number;
};

type FieldTripCardProps = {
  activity: FieldTripActivity;
  disabled?: boolean;
  className?: string;
};

export function FieldTripCard({
  activity,
  disabled = false,
  className,
}: FieldTripCardProps) {
  const t = useT();
  const {
    title,
    description,
    registrationText,
    activityText,
    detailsUrl,
    detailsUnlockUtc,
  } = activity;

  const [now] = useState(() => Date.now());
  const detailsLocked =
    detailsUnlockUtc !== undefined && now < detailsUnlockUtc;
  const detailsDisabled = disabled || detailsLocked;

  const openLink = (url?: string) => {
    if (!url) return;
    window.location.href = url;
  };

  return (
    <article
      className={cn(
        "relative w-82 rounded-xl border border-rpkm-black bg-rpkm-blue p-1.25",
        className,
      )}
    >
      {/* Decorative plant peeking out from the bottom-right of the card. */}
      <img
        src={artboard22.src}
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-[-58px] right-10 z-20 w-18 max-w-none"
      />

      <h2 className="py-1 px-1 mx-3 text-2xl font-bold text-white">{title}</h2>

      <MonotoneNoiseContainer
        noise={{ noiseColor: "#80CBE8" }}
        className="rounded-xl border border-rpkm-black bg-background p-1"
      >
        <p className="mt-2 mx-1 text-xs leading-relaxed text-[#46545b] whitespace-pre-wrap">
          {description}
        </p>

        <div className="mt-4 mx-1 grid gap-2 text-xs text-[#46545b]">
          <span className="flex items-start gap-2 whitespace-pre-wrap">
            <CalendarDays className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{registrationText}</span>
          </span>
          <span className="flex items-start gap-2 whitespace-pre-wrap">
            <CalendarDays className="mt-0.5 size-4 shrink-0 " aria-hidden />
            <span>{activityText}</span>
          </span>
        </div>

        <div className="mt-5 mb-3 flex justify-center">
          <Button
            type="button"
            className={cn("rounded-full px-6", detailsLocked && "bg-rpkm-grey")}
            disabled={detailsDisabled}
            onClick={() => openLink(detailsUrl)}
          >
            {t("activity.button")}
          </Button>
        </div>
      </MonotoneNoiseContainer>
    </article>
  );
}
