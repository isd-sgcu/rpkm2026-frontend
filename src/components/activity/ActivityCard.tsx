import { CalendarDays } from "lucide-react";

import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";

export type FieldTripActivity = {
  id: string;
  title: string;
  description: string;
  registrationText?: string;
  activityText?: string;
  detailsUrl?: string;
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
  const { title, description, registrationText, activityText, detailsUrl } =
    activity;

  // TODO: the two action buttons are placeholders — drop the real links in here.
  const openLink = (url?: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <article
      className={cn(
        "w-[328px] rounded-xl border border-rpkm-black bg-rpkm-blue p-[5px]",
        className,
      )}
    >
      {/* Title lives in the blue header. Placeholder blue — change later. */}
      <h2 className="py-1 px-1 mx-3 text-2xl font-bold text-white">{title}</h2>

      {/* White info panel nested inside the blue card. */}
      <div className="rounded-xl border border-rpkm-black bg-white p-1">
        {/* Description. */}
        <p className="mt-2 mx-1 text-xs leading-relaxed text-[#46545b] whitespace-pre-wrap">
          {description}
        </p>

        {/* Registration period + activity period. */}
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

        {/* Action — placeholder link; wire the real URL later. */}
        <div className="mt-5 mb-3 flex justify-center">
          <Button
            type="button"
            className="rounded-full px-6"
            disabled={disabled}
            onClick={() => openLink(detailsUrl)}
          >
            รายละเอียด
          </Button>
        </div>
      </div>
    </article>
  );
}
