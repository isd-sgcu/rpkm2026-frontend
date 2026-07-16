import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronRight, Users } from "lucide-react";
import { cn } from "@lib/utils";
import { useT } from "@lib/i18n/useT";
import { ConfirmActionDialog } from "@components/walkrally/ConfirmActionDialog";
import {
  getActivityRounds,
  registerForActivity,
  type WalkRallyRound,
} from "@lib/api/walkrally";
import { MINIGAME_ACTIVITY_CODE } from "@components/walkrally/events/minigameActivity";

const ROUND_CAPACITY = 30;

export function MinigamePanel() {
  const t = useT();
  const queryClient = useQueryClient();
  const [selectedRound, setSelectedRound] = useState<WalkRallyRound | null>(
    null,
  );

  const roundsQueryKey = ["walkrally-activity-rounds", MINIGAME_ACTIVITY_CODE];
  const { data } = useQuery({
    queryKey: roundsQueryKey,
    queryFn: () => getActivityRounds(MINIGAME_ACTIVITY_CODE),
  });
  const rounds = data?.rounds ?? [];
  const registeredRound = data?.registeredRound ?? null;

  function closeDialog() {
    setSelectedRound(null);
  }

  async function handleConfirm() {
    if (!selectedRound) return;
    await registerForActivity({
      code: MINIGAME_ACTIVITY_CODE,
      round: selectedRound.round,
    });
    await queryClient.invalidateQueries({ queryKey: roundsQueryKey });
    await queryClient.invalidateQueries({ queryKey: ["walkrally-me"] });
  }

  return (
    <div className="flex flex-col gap-4">
      <a
        href="/walkrally/events/minigames"
        style={{ backgroundColor: "#8b688d" }}
        className="flex items-center gap-3 rounded-2xl border border-black p-3 text-background"
      >
        <p className="flex-1 text-sm whitespace-pre-line">
          {t("walkrally.events.minigameSummary")}
        </p>
        <ChevronRight className="size-5 shrink-0" />
      </a>

      <div className="rounded-3xl bg-rpkm-red p-4 text-background">
        <h2 className="text-center text-lg font-bold">
          {t("walkrally.events.rounds")}
        </h2>
        <p className="mb-3 text-center text-xs">
          {t("walkrally.events.roundsNote")}
        </p>
        <div className="flex flex-col gap-4">
          {rounds.map((round) => {
            const isSelected = registeredRound === round.round;
            const sameActivityLocked = registeredRound !== null && !isSelected;
            const isFull = round.count >= ROUND_CAPACITY;
            const crossActivityConflict =
              registeredRound === null && Boolean(round.conflict);
            return (
              <button
                key={round.round}
                type="button"
                disabled={
                  registeredRound !== null || crossActivityConflict || isFull
                }
                onClick={() => setSelectedRound(round)}
                className={cn(
                  "flex flex-col rounded-xl border border-black p-2 text-left text-foreground disabled:cursor-not-allowed",
                  isSelected
                    ? "border-2 border-black bg-rpkm-yellow"
                    : crossActivityConflict || isFull
                      ? "bg-[#f4c3ab]"
                      : "bg-background",
                  sameActivityLocked && "opacity-50",
                )}
              >
                <div className="flex flex-col gap-1 min-[360px]:flex-row min-[360px]:items-center min-[360px]:justify-between min-[360px]:gap-2">
                  <span className="flex items-center gap-2">
                    {isSelected && (
                      <Check className="size-4 shrink-0 text-black" />
                    )}
                    <span className="flex items-baseline gap-2">
                      <span className="font-bold whitespace-nowrap">
                        {t("walkrally.events.roundLabel", {
                          index: String(round.round),
                        })}
                      </span>
                      <span className="text-sm whitespace-nowrap">
                        {round.start}-{round.end}
                      </span>
                    </span>
                  </span>
                  <span
                    className={cn(
                      "flex items-center gap-1 text-xs",
                      isFull ? "text-rpkm-red" : "text-black",
                    )}
                  >
                    <Users className="size-3.5" />
                    {round.count}/{ROUND_CAPACITY}
                  </span>
                </div>
                {sameActivityLocked ? (
                  <p className="text-xs text-rpkm-red">
                    {t("walkrally.events.roundLockedMessage")}
                  </p>
                ) : (
                  crossActivityConflict && (
                    <p className="text-xs text-rpkm-red">
                      {t("walkrally.events.conflictMessage")}
                    </p>
                  )
                )}
              </button>
            );
          })}
        </div>
      </div>

      <ConfirmActionDialog
        open={selectedRound !== null}
        onOpenChange={(open) => !open && closeDialog()}
        onConfirm={handleConfirm}
        confirmTitle={t("walkrally.events.confirmTitle")}
        confirmMessage={
          selectedRound
            ? t("walkrally.events.confirmMessage", {
                name: t("walkrally.events.tabs.minigame"),
                index: String(selectedRound.round),
              })
            : ""
        }
        confirmLabel={t("walkrally.events.confirm")}
        cancelLabel={t("walkrally.events.cancel")}
        successTitle={t("walkrally.events.successTitle")}
        successMessage={
          selectedRound
            ? t("walkrally.events.successMessage", {
                name: t("walkrally.events.tabs.minigame"),
                index: String(selectedRound.round),
              })
            : ""
        }
        okLabel={t("walkrally.events.ok")}
        failTitle={t("walkrally.events.failTitle")}
        failMessage={t("walkrally.events.failMessage")}
        retryLabel={t("walkrally.events.retry")}
      />
    </div>
  );
}
