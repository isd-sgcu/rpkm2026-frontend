import { CalendarDays } from "lucide-react";

import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";

export type FieldTripActivity = {
  id: string;
  title: string;
  description: string;
  time: string;
  location: string;
  /** When registration opens, as a local ISO date, e.g. "2026-02-25". */
  registerStartDate: string;
  /** When registration closes (inclusive), as a local ISO date. */
  registerEndDate: string;
  formUrl: string;
  /** Optional activity-period text (e.g. "22-29 ก.ค. 69 …"); falls back to `time`. */
  activityPeriod?: string;
  detailsUrl?: string;
};

const THAI_MONTHS_SHORT = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

/** Parse a "YYYY-MM-DD" string into a local midnight Date (no timezone shift). */
function parseLocalDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** Format as Thai short date with Buddhist-era year, e.g. "29 ก.พ. 69". */
function formatThaiDate(date: Date): string {
  const day = date.getDate();
  const month = THAI_MONTHS_SHORT[date.getMonth()];
  const buddhistYear = String((date.getFullYear() + 543) % 100).padStart(
    2,
    "0",
  );
  return `${day} ${month} ${buddhistYear}`;
}

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
  const {
    title,
    description,
    time,
    registerStartDate,
    registerEndDate,
    activityPeriod,
    detailsUrl,
  } = activity;

  const registerStart = parseLocalDate(registerStartDate);
  const registerEnd = parseLocalDate(registerEndDate);

  const registrationText = `เปิดลงทะเบียน ${formatThaiDate(registerStart)} - ${formatThaiDate(registerEnd)} หรือจนกว่าจะเต็ม`;
  const activityText = activityPeriod ?? time;

  // TODO: the two action buttons are placeholders — drop the real links in here.
  const openLink = (url?: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <article
      className={cn(
        "w-[328px] rounded-2xl border border-black bg-rpkm-blue p-3",
        className,
      )}
    >
      {/* Title lives in the blue header. Placeholder blue — change later. */}
      <h2 className="mb-2 px-1 text-2xl font-bold text-white">{title}</h2>

      {/* White info panel nested inside the blue card. */}
      <div className="rounded-xl border border-black bg-white p-4">
        {/* Description. */}
        <p className="text-xs leading-relaxed text-[#46545b]">{description}</p>

        {/* Registration period + activity period. */}
        <div className="mt-4 grid gap-2 text-xs text-[#46545b]">
          <span className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{registrationText}</span>
          </span>
          <span className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{activityText}</span>
          </span>
        </div>

        {/* Action — placeholder link; wire the real URL later. */}
        <div className="mt-5 flex justify-center">
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
