import { Clock, Link as LinkIcon, MapPin } from "lucide-react";

import pot1Image from "@assets/images/artboard_15.svg";
import pot2Image from "@assets/images/artboard_16.svg";
import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";
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

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
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
    location,
    registerStartDate,
    registerEndDate,
    formUrl,
  } = activity;

  const today = startOfToday();
  const registerEnd = parseLocalDate(registerEndDate);
  const registerStart = parseLocalDate(registerStartDate);

  // Registration is closed once today is past the end date.
  const registrationClosed = today > registerEnd;
  const registrationOpen = today >= registerStart && today <= registerEnd;

  const dateRangeText = registrationOpen
    ? `วันนี้ - ${formatThaiDate(registerEnd)}`
    : `${formatThaiDate(registerStart)} - ${formatThaiDate(registerEnd)}`;

  const handleRegister = () => {
    // TODO: replace the placeholder formUrl with the real Google Form link.
    if (!formUrl) return;
    window.open(formUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <article
      className={cn("relative w-[301px] rounded-xl border bg-white", className)}
    >
      <div className="grid gap-4 p-6">
        <div className="grid gap-2">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-xs leading-relaxed text-[#46545b]">
            {description}
          </p>
        </div>

        <div className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-xs">
              <Clock className="size-4 shrink-0" aria-hidden />
              {time}
            </span>
            {registrationClosed ? (
              <Button
                type="button"
                size="sm"
                disabled
                className="bg-[#D9D9D9] text-foreground hover:bg-[#D9D9D9] disabled:opacity-100"
              >
                ปิดลงทะเบียน
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                disabled={disabled}
                onClick={handleRegister}
                iconEnd={<LinkIcon />}
              >
                ลงทะเบียน
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-xs">
              <MapPin className="size-4 shrink-0" aria-hidden />
              {location}
            </span>
            <span className="text-xs text-[#46545b]">{dateRangeText}</span>
          </div>
        </div>
      </div>

      {/* Decorative plant shelf. Sits in front of the card; the pots overflow
          above the band and must not be clipped by it. */}
      <div className="relative z-10 mt-10" aria-hidden>
        <MonotoneNoiseContainer className="h-[15px] rounded-[25px] border border-black bg-rpkm-blue" />
        <img
          src={pot1Image.src}
          alt=""
          className="pointer-events-none absolute bottom-0 left-6 z-20 w-16"
        />
        <img
          src={pot2Image.src}
          alt=""
          className="pointer-events-none absolute bottom-0 right-6 z-20 w-16"
        />
      </div>
    </article>
  );
}
