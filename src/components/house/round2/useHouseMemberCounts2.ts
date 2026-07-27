import { useQuery } from "@tanstack/react-query";

import { getHouseStats } from "@lib/api/houses";
import { getHouseCode, type House } from "../../../consts/house";

/**
 * Live per-house first-choice counts from round 2's `/houses/stats?round=2`,
 * as a lookup by local house. Returns undefined for a house until the stats
 * have loaded. Must be used under a QueryProvider.
 */
export function useHouseMemberCounts2(): (house: House) => number | undefined {
  const { data: stats } = useQuery({
    queryKey: ["rpkm-house-stats", 2],
    queryFn: () => getHouseStats(2),
  });

  const countByCode = new Map(stats?.map((stat) => [stat.code, stat.count]));
  return (house) => countByCode.get(getHouseCode(house));
}
