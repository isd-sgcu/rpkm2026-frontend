export type RoundStatus = "available" | "full" | "conflict";

export interface Round {
  index: number;
  start: string;
  end: string;
  capacity: number;
  booked: number;
  status: RoundStatus;
}

// TODO: Replace booked with real data from API
export const rounds: Round[] = [
  {
    index: 1,
    start: "12:00",
    end: "12:30",
    capacity: 30,
    booked: 20,
    status: "available",
  },
  {
    index: 2,
    start: "12:35",
    end: "13:05",
    capacity: 30,
    booked: 19,
    status: "available",
  },
  {
    index: 3,
    start: "13:10",
    end: "13:40",
    capacity: 30,
    booked: 30,
    status: "full",
  },
  {
    index: 4,
    start: "14:20",
    end: "14:50",
    capacity: 30,
    booked: 25,
    status: "available",
  },
  {
    index: 5,
    start: "14:55",
    end: "15:25",
    capacity: 30,
    booked: 23,
    status: "conflict",
  },
  {
    index: 6,
    start: "15:30",
    end: "16:00",
    capacity: 30,
    booked: 5,
    status: "available",
  },
];
