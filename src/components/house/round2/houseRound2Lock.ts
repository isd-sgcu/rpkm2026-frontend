// Round 2 opens 28 Jul 2026 00:00 (+07), closes 30 Jul 2026 12:00 (+07),
// results announce 30 Jul 2026 19:00 (+07).
export const ROUND2_OPEN_UTC = new Date("2026-07-28T00:00:00+07:00");
export const ROUND2_CLOSE_UTC = new Date("2026-07-30T12:00:00+07:00");
export const ROUND2_RESULT_ANNOUNCE_UTC = new Date("2026-07-30T19:00:00+07:00");

export function isRound2NotYetOpen(now: number = Date.now()): boolean {
  return now < ROUND2_OPEN_UTC.getTime();
}

export function isRound2Open(now: number = Date.now()): boolean {
  return now >= ROUND2_OPEN_UTC.getTime() && now < ROUND2_CLOSE_UTC.getTime();
}

export function isRound2Closed(now: number = Date.now()): boolean {
  return now >= ROUND2_CLOSE_UTC.getTime();
}

export function isRound2ResultAnnounced(now: number = Date.now()): boolean {
  return now >= ROUND2_RESULT_ANNOUNCE_UTC.getTime();
}
