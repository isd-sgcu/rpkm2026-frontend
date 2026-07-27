import { useQuery } from "@tanstack/react-query";
import { useT } from "@lib/i18n/useT";
import { QueryProvider } from "@components/shared/QueryProvider";
import Ranking from "./Ranking";
import Group from "./Group";
import HouseAnnounce from "./HouseAnnounce";
import { getHouseByCode } from "../../consts/house";
import { getHouseResult } from "@lib/api/houses";
import { isHouseResultAnnounced } from "./houseResultLock";
import { isRound2NotYetOpen } from "./round2/houseRound2Lock";
import { useTimeTick } from "./useTimeTick";
import Ranking2 from "./round2/Ranking2";
import Group2 from "./round2/Group2";

function Round2OpeningSoon() {
  const t = useT();
  return (
    <p className="mt-10 text-center text-lg text-foreground">
      {t("house.round2.openingSoon")}
    </p>
  );
}

function HouseRoundGateInner() {
  const t = useT();
  // Re-render periodically so the branches below (all keyed off wall-clock
  // boundaries) advance on their own while the page stays open, instead of
  // only re-evaluating on the next unrelated render or a full reload.
  const now = useTimeTick();

  // Same query/gate as round-1's own RankingOrAnnounce (Ranking.tsx) — reused
  // here purely to learn whether the viewer already has a round-1 house,
  // before deciding whether round 1 or round 2 UI applies.
  const {
    data: houseResult,
    isSuccess,
    isFetched,
  } = useQuery({
    queryKey: ["rpkm-house-result"],
    queryFn: getHouseResult,
    enabled: isHouseResultAnnounced(now),
    retry: false,
  });

  // Round-1 result not confirmed yet (still loading, not announced yet, or
  // errored) — fall back to the untouched round-1 flow. This is the
  // defensive/out-of-scope path; round 1 is expected to already be fully
  // closed and announced before round 2 opens.
  if (!isHouseResultAnnounced(now) || !isFetched || !isSuccess) {
    return (
      <>
        <Ranking />
        <Group />
      </>
    );
  }

  // Confirmed: the viewer's round-1 group got a house. Round 2 doesn't apply.
  if (houseResult) {
    return (
      <>
        <HouseAnnounce house={getHouseByCode(houseResult.code) ?? null} />
        <p className="mt-4 text-center text-sm text-foreground">
          {t("house.round2.notApplicable")}
        </p>
      </>
    );
  }

  // Confirmed round-1-house-less. Round 2 applies.
  if (isRound2NotYetOpen(now)) {
    return <Round2OpeningSoon />;
  }

  return (
    <>
      <Ranking2 />
      <Group2 />
    </>
  );
}

export default function HouseRoundGate() {
  return (
    <QueryProvider>
      <HouseRoundGateInner />
    </QueryProvider>
  );
}
