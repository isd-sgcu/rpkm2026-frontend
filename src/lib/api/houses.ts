import { API } from "@lib/client";

export type HouseRecord = {
  id: string;
  code: string;
  capacity: number | null;
  info: unknown | null;
  createdAt: string;
  updatedAt: string;
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

export async function getHouseStats() {
  return API.get<HouseStatRecord[]>("/v1/rpkm/houses/stats");
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
