import { API } from "@lib/client";
import type { HouseRecord, HouseStatRecord } from "./houses";

type SuccessResponse<T> = {
  success: true;
  data: T;
};

/**
 * First-choice-only counts (same semantics as round-1's `HouseStatRecord`),
 * scoped to the round-2 groups table only. Round-1-assigned students can
 * never have a round-2 group row, so this is inherently limited to round-2
 * participants without any extra frontend filtering.
 */
export async function getHouseStats2() {
  return API.get<HouseStatRecord[]>("/v1/rpkm/round2/houses/stats");
}

/**
 * The caller's round-2 group's assigned house, once round-2 results are
 * announced. `null` means the round-2 group never got one. Throws
 * `ROUND2_RESULT_NOT_ANNOUNCED` before 2026-07-30T19:00:00+07:00.
 */
export async function getHouseResult2() {
  const res = await API.get<SuccessResponse<HouseRecord | null>>(
    "/v1/rpkm/round2/houses/result",
  );
  return res.data;
}
