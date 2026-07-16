export type GatedEventKey = "freshyStory" | "walkRally";

interface GatedEvent {
  unlockAt: number;
  allowedRoles?: string[];
  matches: (path: string) => boolean;
}

const GATED_EVENTS: Record<GatedEventKey, GatedEvent> = {
  freshyStory: {
    unlockAt: new Date("2026-07-22T00:00:00+07:00").getTime(),
    allowedRoles: ["student"],
    matches: (path) => path === "/freshy-story",
  },
  walkRally: {
    unlockAt: new Date("2026-07-22T00:00:00+07:00").getTime(),
    allowedRoles: ["student"],
    matches: (path) => path === "/walkrally" || path.startsWith("/walkrally/"),
  },
};

export function isUnlocked(key: GatedEventKey): boolean {
  return Date.now() >= GATED_EVENTS[key].unlockAt;
}

export function findGatedEvent(
  path: string,
): [GatedEventKey, GatedEvent] | null {
  for (const key of Object.keys(GATED_EVENTS) as GatedEventKey[]) {
    if (GATED_EVENTS[key].matches(path)) return [key, GATED_EVENTS[key]];
  }
  return null;
}
