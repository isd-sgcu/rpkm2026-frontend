export type GatedEventKey =
  "freshyStory" | "walkRally" | "chulaQrQuest" | "jigsaw";

interface GatedEvent {
  unlockAt: number;
  lockAt?: number;
  allowedRoles?: string[];
  matches: (path: string) => boolean;
}

const GATED_EVENTS: Record<GatedEventKey, GatedEvent> = {
  freshyStory: {
    unlockAt: new Date("2026-07-22T00:00:00+07:00").getTime(),
    lockAt: new Date("2026-08-03T23:59:59+07:00").getTime(),
    allowedRoles: ["student"],
    matches: (path) => path === "/freshy-story",
  },
  walkRally: {
    unlockAt: new Date("2026-07-22T00:00:00+07:00").getTime(),
    allowedRoles: ["student"],
    matches: (path) => path === "/walkrally" || path.startsWith("/walkrally/"),
  },
  chulaQrQuest: {
    unlockAt: new Date("2026-07-20T00:00:00+07:00").getTime(),
    lockAt: new Date("2026-08-07T23:59:59+07:00").getTime(),
    allowedRoles: ["student"],
    matches: (path) => path === "/qrquest" || path.startsWith("/qrquest/"),
  },
  jigsaw: {
    unlockAt: new Date("2026-07-20T00:00:00+07:00").getTime(),
    lockAt: new Date("2026-08-03T23:59:59+07:00").getTime(),
    allowedRoles: ["student"],
    matches: (path) => path === "/jigsaw" || path.startsWith("/jigsaw/"),
  },
};

export function isUnlocked(key: GatedEventKey): boolean {
  const event = GATED_EVENTS[key];
  const now = Date.now();
  if (event.lockAt !== undefined && now > event.lockAt) return false;
  return now >= event.unlockAt;
}

export function findGatedEvent(
  path: string,
): [GatedEventKey, GatedEvent] | null {
  for (const key of Object.keys(GATED_EVENTS) as GatedEventKey[]) {
    if (GATED_EVENTS[key].matches(path)) return [key, GATED_EVENTS[key]];
  }
  return null;
}
