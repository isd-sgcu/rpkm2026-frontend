// Adding or cancelling a registered activity closes 30 Jul 2026 00:00 (+07)
// === 29 Jul 2026 17:00 UTC.
export const WALK_RALLY_ACTIVITY_LOCK_UTC = new Date(
  "2026-07-29T23:59:59+07:00",
);

export function isWalkRallyActivityLocked(now: number = Date.now()): boolean {
  return now >= WALK_RALLY_ACTIVITY_LOCK_UTC.getTime();
}
