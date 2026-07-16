import { API } from "@lib/client";

type SuccessResponse<T> = {
  success: true;
  data: T;
};

export type WalkRallyRound = {
  round: number;
  start: string;
  end: string;
  count: number;
  conflict?: { code: string };
};

export type ActivityRoundsResult = {
  rounds: WalkRallyRound[];
  registeredRound: number | null;
};

/** Round schedule + capacity for one activity, annotated with the caller's own registration/conflicts. */
export async function getActivityRounds(code: string) {
  const res = await API.get<SuccessResponse<ActivityRoundsResult>>(
    `/v1/rpkm/walkrally/activities/${code}/rounds`,
  );
  return res.data;
}

export type MyWalkRallyRegistration = {
  code: string;
  round: number;
  start: string;
  end: string;
  place: number;
};

export type WalkRallyMeResult = {
  points: number;
  registrations: MyWalkRallyRegistration[];
};

/** The authenticated freshman's walk-rally points and registrations. */
export async function getWalkRallyMe() {
  const res = await API.get<SuccessResponse<WalkRallyMeResult>>(
    "/v1/rpkm/walkrally/me",
  );
  return res.data;
}

export type RegisterActivityResult = {
  code: string;
  round: number;
};

/** Books a slot in one of the 6 shared rounds for an activity. */
export async function registerForActivity(body: {
  code: string;
  round: number;
}) {
  const res = await API.post<SuccessResponse<RegisterActivityResult>>(
    "/v1/rpkm/walkrally/registrations",
    body,
  );
  return res.data;
}

/** Cancels the caller's registration for an activity. */
export async function unregisterFromActivity(code: string) {
  const res = await API.del<SuccessResponse<{ code: string }>>(
    `/v1/rpkm/walkrally/registrations/${code}`,
  );
  return res.data;
}

/** Moves an existing registration to a different round. */
export async function changeRound(code: string, round: number) {
  const res = await API.patch<SuccessResponse<RegisterActivityResult>>(
    `/v1/rpkm/walkrally/registrations/${code}`,
    { round },
  );
  return res.data;
}
