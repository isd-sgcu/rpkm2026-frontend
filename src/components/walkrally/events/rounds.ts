import roundSchedule from "@components/walkrally/rounds.json";

export type RoundStatus = "available" | "full";

export interface Round {
  index: number;
  start: string;
  end: string;
  capacity: number;
  booked: number;
  status: RoundStatus;
}

interface RoundState {
  index: number;
  capacity: number;
  booked: number;
  status: RoundStatus;
}

// TODO: Replace booked with real data from API
const roundStates: RoundState[] = [
  { index: 1, capacity: 30, booked: 20, status: "available" },
  { index: 2, capacity: 30, booked: 19, status: "available" },
  { index: 3, capacity: 30, booked: 30, status: "full" },
  { index: 4, capacity: 30, booked: 25, status: "available" },
  { index: 5, capacity: 30, booked: 23, status: "available" },
  { index: 6, capacity: 30, booked: 5, status: "available" },
];

export const rounds: Round[] = roundStates.map((state) => {
  const schedule = roundSchedule.find((r) => r.index === state.index)!;
  return { ...schedule, ...state };
});
