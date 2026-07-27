import { useQuery } from "@tanstack/react-query";
import { useT } from "@lib/i18n/useT";
import { QueryProvider } from "@components/shared/QueryProvider";
import Ranking from "./Ranking";
import Group from "./Group";
import HouseAnnounce from "./HouseAnnounce";
import { getHouseByCode } from "../../consts/house";
import { getHouseResult } from "@lib/api/houses";
import { isHouseResultAnnounced } from "./houseResultLock";
import {
  isRound2Closed,
  isRound2NotYetOpen,
  isRound2Open,
  isRound2ResultAnnounced,
} from "./round2/houseRound2Lock";
import { useTimeTick } from "./useTimeTick";
import Ranking2 from "./round2/Ranking2";

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

  // Round 2 reuses round 1's exact /groups/* and /houses/* endpoints — a
  // still-houseless group's result can only change at a fixed clock event
  // (round-2 announce), not something the user triggers, so this query
  // can't rely on the usual refetch triggers (refocus, remount, mutation).
  // Poll lightly only while that's a live possibility (round 2 open, or
  // closed but not yet announced) so the switch to HouseAnnounce below
  // happens without a reload.
  const {
    data: houseResult,
    isSuccess,
    isFetched,
  } = useQuery({
    queryKey: ["rpkm-house-result"],
    queryFn: getHouseResult,
    enabled: isHouseResultAnnounced(now),
    retry: false,
    refetchInterval: () =>
      !isRound2ResultAnnounced(Date.now()) &&
      (isRound2Open(Date.now()) || isRound2Closed(Date.now()))
        ? 30_000
        : false,
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

  // Confirmed: the viewer's group got a house (round 1 or round 2 — the
  // backend resolves which announce window applies per group automatically).
  // Round 2 never applies to a group that already has one.
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

  // Confirmed still houseless. Round 2 applies. Group actions are gated
  // server-side to the round-2 window too (a stale round-1 lock reapplies
  // outside it), so there's nothing useful to show before it opens.
  if (isRound2NotYetOpen(now)) {
    return <Round2OpeningSoon />;
  }

  return (
    <>
      <Ranking2 />
      <Group />
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
