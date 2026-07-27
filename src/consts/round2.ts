/**
 * House codes selectable in round 2 — the houses that want more freshmen:
 * บ้านดัง, บ้านเยิ้ม, บ้านรุม, บ้านหลายใจ, บ้านอะอึ๋ม, บ้านคิดส์,
 * บ้านโจ๊ะเด๊ะ ฮือซา, บ้านเอช้วน, บ้านโจ๋, บ้านยิ้ม.
 *
 * Hardcoded for now — no backend concept of "round-2 eligible" on the
 * houses table yet. Must stay in sync with whatever the backend uses to
 * validate PUT .../round2/groups/me/house-preferences
 * (HOUSE_NOT_AVAILABLE_ROUND2) — this duplication should be flagged to
 * backend devs explicitly. If this needs to change without a redeploy
 * later, move it to a real backend-owned flag on GET /v1/rpkm/round2/houses
 * instead.
 */
export const ROUND2_AVAILABLE_HOUSE_CODES = [
  "house03",
  "house04",
  "house05",
  "house07",
  "house10",
  "house11",
  "house13",
  "house14",
  "house18",
  "house21",
];
