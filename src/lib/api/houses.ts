import { API } from "@lib/client";

export type HouseRecord = {
  id: string;
  code: string;
  capacity: number | null;
  info: unknown | null;
  createdAt: string;
  updatedAt: string;
  /** Whether this house is in the round-2 whitelist (hardcoded server-side). */
  availableInRound2: boolean;
};

export async function getHouses() {
  return API.get<HouseRecord[]>("/v1/rpkm/houses/");
}

export async function getHouseDetail(id: string) {
  return API.get<HouseRecord>(`/v1/rpkm/houses/${id}`);
}

export type HouseStatRecord = {
  houseId: string;
  code: string;
  /** Students whose group ranked this house first (whole roster counted). */
  count: number;
};

/** `round` defaults to 1 server-side when omitted. */
export async function getHouseStats(round?: 1 | 2) {
  const query = round === 2 ? "?round=2" : "";
  return API.get<HouseStatRecord[]>(`/v1/rpkm/houses/stats${query}`);
}

type SuccessResponse<T> = {
  success: true;
  data: T;
};

/**
 * The caller's group's assigned house, once results are announced. `null`
 * means the group never got one (never picked houses, or picked too late).
 * Throws `RESULT_NOT_ANNOUNCED` before the announcement window opens.
 */
export async function getHouseResult() {
  const res = await API.get<SuccessResponse<HouseRecord | null>>(
    "/v1/rpkm/houses/result",
  );
  return res.data;
}
