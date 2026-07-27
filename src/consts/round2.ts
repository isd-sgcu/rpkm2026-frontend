/**
 * House codes selectable in round 2. Hardcoded for now — no backend concept
 * of "round-2 eligible" on the houses table yet. Must stay in sync with
 * whatever the backend uses to validate PUT .../round2/groups/me/house-preferences
 * (HOUSE_NOT_AVAILABLE_ROUND2) — this duplication should be flagged to
 * backend devs explicitly. If this needs to change without a redeploy
 * later, move it to a real backend-owned flag on GET /v1/rpkm/round2/houses
 * instead.
 */
export const ROUND2_AVAILABLE_HOUSE_CODES = ["house01", "house02"];
