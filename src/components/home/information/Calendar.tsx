import { useMemo, useRef, useState } from "react";
import { useStore } from "@nanostores/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useT } from "@lib/i18n/useT";
import { $locale } from "@lib/i18n/locale";
import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import calendarEvents from "./calendarEvents.json";

interface CalendarEvent {
  startDate: string;
  endDate: string;
  nameTh: string;
  nameEn: string;
  color: string;
  statusTh: string;
  statusEn: string;
}

const events = calendarEvents as CalendarEvent[];

const START_DATE = new Date(2026, 6, 18);
const END_DATE = parseDateKey(
  events.reduce(
    (latest, event) => (event.endDate > latest ? event.endDate : latest),
    toDateKey(START_DATE),
  ),
);

const DAY_SHORT_TH = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
const DAY_FULL_TH = [
  "อาทิตย์",
  "จันทร์",
  "อังคาร",
  "พุธ",
  "พฤหัสบดี",
  "ศุกร์",
  "เสาร์",
];
const MONTH_SHORT_TH = [
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

function buildDateRange(start: Date, end: Date) {
  const dates: Date[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDateKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function isSameDay(a: Date, b: Date) {
  return toDateKey(a) === toDateKey(b);
}

const DATE_RANGE = buildDateRange(START_DATE, END_DATE);

const Calendar = () => {
  const t = useT();
  const locale = useStore($locale);
  const isTh = locale === "th";

  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollByAmount(direction: 1 | -1) {
    scrollRef.current?.scrollBy({ left: direction * 240, behavior: "smooth" });
  }

  const today = useMemo(() => new Date(), []);
  const defaultDate =
    DATE_RANGE.find((date) => isSameDay(date, today)) ?? DATE_RANGE[0];
  const [selectedDate, setSelectedDate] = useState(defaultDate);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const date of DATE_RANGE) {
      const key = toDateKey(date);
      const dayEvents = events.filter(
        (event) => key >= event.startDate && key <= event.endDate,
      );
      map.set(key, dayEvents);
    }
    return map;
  }, []);

  const selectedEvents = eventsByDate.get(toDateKey(selectedDate)) ?? [];

  const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  });
  const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });

  const headerLabel = isTh
    ? `${DAY_FULL_TH[selectedDate.getDay()]}ที่ ${selectedDate.getDate()} ${MONTH_SHORT_TH[selectedDate.getMonth()]}`
    : `${weekdayFormatter.format(selectedDate)}, ${monthFormatter.format(selectedDate)} ${selectedDate.getDate()}`;

  return (
    <div className="flex w-full flex-col gap-4" id="rpkm-calendar">
      <h2 className="text-xl text-foreground">{t("home.calendar.title")}</h2>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          className="shrink-0 rounded-full border-foreground bg-background"
          onClick={() => scrollByAmount(-1)}
          iconStart={<ChevronLeft className="text-foreground" />}
        />
        <div
          ref={scrollRef}
          className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          {DATE_RANGE.map((date) => {
            const isToday = isSameDay(date, today);
            const isSelected = isSameDay(date, selectedDate);
            const dayEvents = eventsByDate.get(toDateKey(date)) ?? [];

            return (
              <button
                key={toDateKey(date)}
                type="button"
                onClick={() => setSelectedDate(date)}
                className={cn(
                  "flex shrink-0 flex-col items-center gap-1 rounded-2xl border px-2.5 py-2",
                  isToday
                    ? "border-rpkm-red bg-rpkm-red text-background"
                    : "border-foreground bg-background text-foreground",
                  isSelected && !isToday && "border-2",
                )}
              >
                <span className="text-xs font-bold">
                  {isTh
                    ? DAY_SHORT_TH[date.getDay()]
                    : weekdayFormatter.format(date).slice(0, 3)}
                </span>
                <span className="text-lg leading-none font-bold">
                  {date.getDate()}
                </span>
                <span className="text-[0.65rem]">
                  {isTh
                    ? MONTH_SHORT_TH[date.getMonth()]
                    : monthFormatter.format(date)}
                </span>
                <span className="grid min-h-1.5 grid-cols-4 gap-0.5">
                  {dayEvents.map((event, index) => (
                    <span
                      key={index}
                      className="size-1.5 rounded-full border border-black/20"
                      style={{ backgroundColor: event.color }}
                    />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          className="shrink-0 rounded-full border-foreground bg-background"
          onClick={() => scrollByAmount(1)}
          iconStart={<ChevronRight className="text-foreground" />}
        />
      </div>

      <h3 className="text-lg font-bold text-foreground">{headerLabel}</h3>

      <div className="flex flex-col">
        {selectedEvents.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">
            {t("home.calendar.empty")}
          </p>
        ) : (
          selectedEvents.map((event, index) => (
            <div
              key={index}
              className="flex items-center gap-3 border-b border-foreground/20 py-3 last:border-b-0"
            >
              <span
                className="size-3 shrink-0 rounded-full"
                style={{ backgroundColor: event.color }}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate font-bold text-foreground">
                  {isTh ? event.nameTh : event.nameEn}
                </div>
                <div className="truncate text-sm text-muted-foreground">
                  {isTh ? event.statusTh : event.statusEn}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div></div>
    </div>
  );
};

export default Calendar;
