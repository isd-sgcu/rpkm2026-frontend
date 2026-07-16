// The walk-rally backend seeds a single shared "minigame" activity/round slot
// (see fdrpkm2026-backend/src/db/schema/walk-rally.schema.ts) — the specific
// board game (Dixit, The Mind, ...) is display-only and isn't sent to the API.
// This must match that activity's `walk_rally_activities.code`.
export const MINIGAME_ACTIVITY_CODE = "minigame_1";
