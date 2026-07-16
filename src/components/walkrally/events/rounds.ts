export interface Round {
  index: number;
  start: string;
  end: string;
}

const defaultSchedule: Round[] = [
  { index: 1, start: "09:00", end: "09:30" },
  { index: 2, start: "10:00", end: "10:30" },
  { index: 3, start: "11:00", end: "11:30" },
  { index: 4, start: "13:00", end: "13:30" },
  { index: 5, start: "14:00", end: "14:30" },
  { index: 6, start: "15:00", end: "15:30" },
];

const cuMuseumSchedule: Round[] = [
  { index: 1, start: "12:00", end: "12:30" },
  { index: 2, start: "12:35", end: "13:05" },
  { index: 3, start: "13:10", end: "13:40" },
  { index: 4, start: "14:20", end: "14:50" },
  { index: 5, start: "14:55", end: "15:25" },
  { index: 6, start: "15:30", end: "16:00" },
];

export function getRoundSchedule(activityId?: string): Round[] {
  return activityId === "cu-museum" ? cuMuseumSchedule : defaultSchedule;
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** End-exclusive overlap: touching slots (one's end == other's start) don't conflict. */
export function timesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return (
    toMinutes(aStart) < toMinutes(bEnd) && toMinutes(bStart) < toMinutes(aEnd)
  );
}
