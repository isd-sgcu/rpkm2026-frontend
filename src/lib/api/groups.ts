import { API } from "@lib/client";

type SuccessResponse<T> = {
  success: true;
  data: T;
};

export const GROUP_MAX_MEMBERS = 4;

export type GroupMember = {
  userId: string;
  firstName: string;
  lastName: string;
  nickname: string | null;
  isLeader: boolean;
};

export type GroupWithMembers = {
  id: string;
  createdAt: string;
  updatedAt: string;
  leaderId: string;
  joinCode: string;
  assignedHouseId: string | null;
  assignedAt: string | null;
  confirmedAt: string | null;
  members: GroupMember[];
};

/** The authenticated freshman's group with its members and join code. */
export async function getMyGroup() {
  const res =
    await API.get<SuccessResponse<GroupWithMembers>>("/v1/rpkm/groups/me");
  return res.data;
}

/**
 * Moves the caller into the group behind `joinCode`. Fails (409) when the
 * target group is full/confirmed, or when the caller leads a group that
 * still has other members (`LEADER_HAS_MEMBERS`).
 */
export async function joinGroup(joinCode: string) {
  const res = await API.post<SuccessResponse<GroupWithMembers>>(
    "/v1/rpkm/groups/join",
    { joinCode },
  );
  return res.data;
}

/** Leader only. Invalidates the old join code and returns a fresh one. */
export async function regenerateJoinCode() {
  const res = await API.post<SuccessResponse<{ joinCode: string }>>(
    "/v1/rpkm/groups/me/join-code/regenerate",
  );
  return res.data;
}

/** Leaves the current group and lands the caller back in a fresh solo group. */
export async function leaveGroup() {
  const res =
    await API.del<SuccessResponse<GroupWithMembers>>("/v1/rpkm/groups/me");
  return res.data;
}

/** Leader only. Removes the member, who lands in a fresh solo group. */
export async function kickMember(userId: string) {
  const res = await API.del<SuccessResponse<GroupWithMembers>>(
    `/v1/rpkm/groups/me/members/${userId}`,
  );
  return res.data;
}
