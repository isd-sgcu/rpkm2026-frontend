export const FRESHY_STORY_UNLOCK_AT = new Date(
  "2026-07-22T00:00:00+07:00",
).getTime();

export function isFreshyStoryUnlocked(): boolean {
  return Date.now() >= FRESHY_STORY_UNLOCK_AT;
}
