export interface Round {
  index: number;
  start: string;
  end: string;
}

// Every activity runs on the default schedule except CU Museum, which runs on
// its own times — mirrors WALK_RALLY.rounds in the backend
// (fdrpkm2026-backend/src/constants.ts).
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
