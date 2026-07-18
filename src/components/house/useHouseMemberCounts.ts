import { useQuery } from "@tanstack/react-query";

import { getHouseStats } from "@lib/api/houses";
import { getHouseCode, type House } from "../../consts/house";

/**
 * Live per-house member counts from `/houses/stats`, as a lookup by local
 * house. Returns undefined for a house until the stats have loaded (the
 * endpoint is freshman-only, so staff previews simply stay countless).
 * Must be used under a QueryProvider.
 */
export function useHouseMemberCounts(): (house: House) => number | undefined {
  const { data: stats } = useQuery({
    queryKey: ["rpkm-house-stats"],
    queryFn: getHouseStats,
  });

  const countByCode = new Map(stats?.map((stat) => [stat.code, stat.count]));
  return (house) => countByCode.get(getHouseCode(house));
}
