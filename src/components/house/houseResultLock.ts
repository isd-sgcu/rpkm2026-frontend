// House result announcement opens 23 Jul 2026 19:00 (+07) === 23 Jul 2026 12:00 UTC.
export const HOUSE_RESULT_ANNOUNCE_UTC = new Date("2026-07-23T19:00:00+07:00");

export function isHouseResultAnnounced(now: number = Date.now()): boolean {
  return now >= HOUSE_RESULT_ANNOUNCE_UTC.getTime();
}
