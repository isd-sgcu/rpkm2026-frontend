import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Users } from "lucide-react";
import { cn } from "@lib/utils";
import { getImageUrl } from "@lib/function";
import { useT } from "@lib/i18n/useT";
import { $locale } from "@lib/i18n/locale";
import { ConfirmActionDialog } from "@components/walkrally/ConfirmActionDialog";
import { QueryProvider } from "@components/shared/QueryProvider";
import {
  getActivityRounds,
  registerForActivity,
  type WalkRallyRound,
} from "@lib/api/walkrally";

const ROUND_CAPACITY = 30;

export interface WalkRallyEntry {
  id: string;
  nameTh: string;
  nameEn: string;
  descriptionTh?: string;
  descriptionEn?: string;
  imageName?: string;
}

interface ActivityDetailPanelProps {
  entry: WalkRallyEntry;
}

export function ActivityDetailPanel(props: ActivityDetailPanelProps) {
  return (
    <QueryProvider>
      <ActivityDetailPanelContent {...props} />
    </QueryProvider>
  );
}

function ActivityDetailPanelContent({ entry }: ActivityDetailPanelProps) {
  const t = useT();
  const locale = useStore($locale);
  const queryClient = useQueryClient();
  const [selectedRound, setSelectedRound] = useState<WalkRallyRound | null>(
    null,
  );

  const name = locale === "th" ? entry.nameTh : entry.nameEn;
  const description =
    locale === "th" ? entry.descriptionTh : entry.descriptionEn;
  const imageUrl = getImageUrl(entry.imageName ?? "");

  const roundsQueryKey = ["walkrally-activity-rounds", entry.id];
  const { data } = useQuery({
    queryKey: roundsQueryKey,
    queryFn: () => getActivityRounds(entry.id),
  });
  const rounds = data?.rounds ?? [];
  const registeredRound = data?.registeredRound ?? null;

  useEffect(() => {
    document.title = name;
  }, [name]);

  function closeDialog() {
    setSelectedRound(null);
  }

  async function handleConfirm() {
    if (!selectedRound) return;
    await registerForActivity({ code: entry.id, round: selectedRound.round });
    await queryClient.invalidateQueries({ queryKey: roundsQueryKey });
    await queryClient.invalidateQueries({ queryKey: ["walkrally-me"] });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="pointer-events-none absolute inset-x-0 top-[4.5cqw] flex min-h-10 items-center justify-center px-14 text-center text-2xl leading-[1.4] font-bold text-foreground sm:top-4.5 ">
        {name}
      </div>

      <div className="flex flex-col items-center gap-3 px-6 pt-10">
        {entry.imageName && (
          <img
            src={imageUrl}
            alt=""
            className="-mt-12 size-40 rounded-2xl border-2 border-black object-cover"
          />
        )}
        {description && (
          <p className="text-center text-base leading-[1.4] font-normal text-foreground">
            {description}
          </p>
        )}
      </div>

      <div className="rounded-3xl bg-rpkm-red p-4 text-background mx-4">
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
                  "flex flex-col rounded-xl p-2 text-left text-foreground disabled:cursor-not-allowed border border-black",
                  isSelected
                    ? "border border-black bg-rpkm-yellow"
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
                name,
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
                name,
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
