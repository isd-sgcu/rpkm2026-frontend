import { useQuery } from "@tanstack/react-query";

import { getHouseStats2 } from "@lib/api/houses2";
import { getHouseCode, type House } from "../../../consts/house";

/**
 * Live per-house member counts from round 2's `/houses/stats`, as a lookup
 * by local house. Returns undefined for a house until the stats have
 * loaded. Must be used under a QueryProvider.
 */
export function useHouseMemberCounts2(): (house: House) => number | undefined {
  const { data: stats } = useQuery({
    queryKey: ["rpkm-house2-stats"],
    queryFn: getHouseStats2,
  });

  const countByCode = new Map(stats?.map((stat) => [stat.code, stat.count]));
  return (house) => countByCode.get(getHouseCode(house));
}
