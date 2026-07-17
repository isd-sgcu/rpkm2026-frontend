// Adding or cancelling a registered activity closes 30 Jul 2026 00:00 (+07)
// === 29 Jul 2026 17:00 UTC.
export const WALK_RALLY_ACTIVITY_LOCK_UTC = Date.UTC(2026, 6, 15, 17, 0, 0);

export function isWalkRallyActivityLocked(now: number = Date.now()): boolean {
  return now >= WALK_RALLY_ACTIVITY_LOCK_UTC;
}
