import { API } from "@lib/client";
import type { GroupMember, GroupWithMembers, HousePreference } from "./groups";

type SuccessResponse<T> = {
  success: true;
  data: T;
};

/**
 * Round-2 group cap, kept as its own const (not imported from groups.ts)
 * since the round-1 and round-2 group lifecycles are entirely independent.
 */
export const GROUP2_MAX_MEMBERS = 4;

export type Group2Member = GroupMember;
export type Group2WithMembers = GroupWithMembers;

/**
 * The authenticated freshman's round-2 group with its members and join
 * code. Lazily provisions a fresh round-2 solo group on first call, exactly
 * like round 1's implicit per-student solo group — there is no separate
 * "create" endpoint.
 *
 * Throws (APIError.code):
 * - `ALREADY_HAS_HOUSE` — caller's round-1 group already has an
 *   `assignedHouseId`, making them ineligible for round 2 entirely.
 * - `ROUND2_NOT_OPEN` — before 2026-07-28T00:00:00+07:00.
 * - `ROUND2_CLOSED` — after 2026-07-30T12:00:00+07:00. The group stays
 *   readable read-only past close; only mutating endpoints below hard-fail.
 */
export async function getMyGroup2() {
  const res = await API.get<SuccessResponse<Group2WithMembers>>(
    "/v1/rpkm/round2/groups/me",
  );
  return res.data;
}

/**
 * Moves the caller into the round-2 group behind `joinCode`. Fails (409)
 * when the target group is full/confirmed, or when the caller leads a
 * round-2 group that still has other members (`LEADER_HAS_MEMBERS`,
 * mirroring round 1's `joinGroup`). Also fails (403) with `ALREADY_HAS_HOUSE`,
 * `ROUND2_NOT_OPEN`, or `ROUND2_CLOSED`.
 */
export async function joinGroup2(joinCode: string) {
  const res = await API.post<SuccessResponse<Group2WithMembers>>(
    "/v1/rpkm/round2/groups/join",
    { joinCode },
  );
  return res.data;
}

/** Leader only. Invalidates the old round-2 join code and returns a fresh one. */
export async function regenerateJoinCode2() {
  const res = await API.post<SuccessResponse<{ joinCode: string }>>(
    "/v1/rpkm/round2/groups/me/join-code/regenerate",
  );
  return res.data;
}

/** Leaves the current round-2 group and lands the caller back in a fresh round-2 solo group. */
export async function leaveGroup2() {
  const res = await API.del<SuccessResponse<Group2WithMembers>>(
    "/v1/rpkm/round2/groups/me",
  );
  return res.data;
}

/** Leader only. Removes the member, who lands in a fresh round-2 solo group. */
export async function kickMember2(userId: string) {
  const res = await API.del<SuccessResponse<Group2WithMembers>>(
    `/v1/rpkm/round2/groups/me/members/${userId}`,
  );
  return res.data;
}

/** The caller's round-2 group's ranked house choices, most preferred (rank 1) first. */
export async function getHousePreferences2() {
  const res = await API.get<
    SuccessResponse<{ housePreferences: HousePreference[] }>
  >("/v1/rpkm/round2/groups/me/house-preferences");
  return res.data.housePreferences;
}

/**
 * Leader only. Replaces the round-2 group's whole ranked house-choice set.
 * Throws `HOUSE_NOT_AVAILABLE_ROUND2` (400) if any houseId isn't in the
 * backend's own round-2-eligible set — this must be validated server-side,
 * not just enforced via the UI's grayed-out list.
 */
export async function setHousePreferences2(houseIds: string[]) {
  const res = await API.put<
    SuccessResponse<{ housePreferences: HousePreference[] }>
  >("/v1/rpkm/round2/groups/me/house-preferences", { houseIds });
  return res.data.housePreferences;
}
