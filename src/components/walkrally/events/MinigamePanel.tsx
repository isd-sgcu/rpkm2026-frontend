import { useState, useSyncExternalStore } from "react";
import { Check, ChevronRight, Users } from "lucide-react";
import { useStore } from "@nanostores/react";
import { cn } from "@lib/utils";
import { useT } from "@lib/i18n/useT";
import { $locale } from "@lib/i18n/locale";
import { getImageUrl } from "@lib/function";
import { ConfirmActionDialog } from "@components/walkrally/ConfirmActionDialog";
import { rounds, type Round } from "@components/walkrally/events/rounds";
import events from "@components/walkrally/events/events.json";
// TODO: fetch the user's registrations from API (e.g. via TanStack Query) instead of static JSON
import registrationsData from "@components/walkrally/registrations.json";
import {
  clearStoredMinigameId,
  getStoredMinigameId,
} from "@components/walkrally/events/minigameSelection";

const ACCENT_MINIGAME = "#8b688d";
const MINIGAME_IDS = events.minigame.map((game) => game.id);

interface Registration {
  activityId: string;
  round: number;
  ticketNumber: string;
}

const registrations = registrationsData as Registration[];

function subscribeNoop() {
  return () => {};
}

function getServerPendingGameId(): string | undefined {
  return undefined;
}

export function MinigamePanel() {
  const t = useT();
  const locale = useStore($locale);
  const [selectedRound, setSelectedRound] = useState<Round | null>(null);
  const pendingGameId = useSyncExternalStore(
    subscribeNoop,
    getStoredMinigameId,
    getServerPendingGameId,
  );

  const registration = registrations.find((r) =>
    MINIGAME_IDS.includes(r.activityId),
  );
  const chosenGameId = registration?.activityId ?? pendingGameId;
  const chosenGame = chosenGameId
    ? events.minigame.find((game) => game.id === chosenGameId)
    : undefined;
  const chosenGameName = chosenGame
    ? locale === "th"
      ? chosenGame.nameTh
      : chosenGame.nameEn
    : undefined;
  const chosenGameImage =
    chosenGame && "imageName" in chosenGame
      ? getImageUrl(chosenGame.imageName as string)
      : undefined;
  const chosenGameDescription = chosenGame
    ? locale === "th"
      ? chosenGame.descriptionTh
      : chosenGame.descriptionEn
    : undefined;

  function closeDialog() {
    setSelectedRound(null);
  }

  async function handleConfirm() {
    if (!selectedRound) return;
    // TODO: call registration API (e.g. via a TanStack Query mutation)

    clearStoredMinigameId();
  }

  return (
    <div className="flex flex-col gap-4">
      {chosenGame ? (
        <a
          href="/walkrally/events/minigames"
          style={{ backgroundColor: ACCENT_MINIGAME }}
          className="relative isolate overflow-hidden rounded-3xl border border-black p-1"
        >
          <div className="relative flex flex-col items-center gap-3 rounded-[1.15rem] border border-black bg-white p-2 pr-10 sm:gap-4 sm:p-3 min-[360px]:flex-row">
            <div
              style={{ backgroundColor: ACCENT_MINIGAME }}
              className="relative isolate shrink-0 overflow-hidden rounded-2xl border border-black p-1"
            >
              {chosenGameImage ? (
                <img
                  src={chosenGameImage}
                  alt=""
                  className="size-24 rounded-xl border border-black object-cover sm:size-28"
                />
              ) : (
                <div className="size-24 rounded-xl border border-black bg-muted sm:size-28" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-base font-bold sm:text-lg">
                {chosenGameName}
              </div>
              {chosenGameDescription && (
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {chosenGameDescription}
                </p>
              )}
            </div>
            <ChevronRight className="absolute right-2 bottom-2 size-6 shrink-0 text-black" />
          </div>
        </a>
      ) : (
        <a
          href="/walkrally/events/minigames"
          style={{ backgroundColor: ACCENT_MINIGAME }}
          className="flex items-center gap-3 rounded-2xl border border-black p-3 text-background"
        >
          <p className="flex-1 text-sm whitespace-pre-line">
            {t("walkrally.events.minigameSummary")}
          </p>
          <ChevronRight className="size-5 shrink-0" />
        </a>
      )}

      <div className="rounded-3xl bg-rpkm-red p-4 text-background">
        <h2 className="text-center text-lg font-bold">
          {t("walkrally.events.rounds")}
        </h2>
        <p className="mb-3 text-center text-xs">
          {t("walkrally.events.roundsNote")}
        </p>
        <div className="flex flex-col gap-4">
          {rounds.map((round) => {
            const isSelected = registration?.round === round.index;
            const sameActivityLocked = Boolean(registration) && !isSelected;
            const crossActivityConflict =
              !registration &&
              registrations.some((r) => r.round === round.index);
            return (
              <button
                key={round.index}
                type="button"
                disabled={
                  !chosenGameId ||
                  Boolean(registration) ||
                  crossActivityConflict ||
                  round.status !== "available"
                }
                onClick={() => setSelectedRound(round)}
                className={cn(
                  "flex flex-col rounded-xl border border-black p-2 text-left text-foreground disabled:cursor-not-allowed",
                  isSelected
                    ? "border-2 border-black bg-rpkm-yellow"
                    : crossActivityConflict || round.status === "full"
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
                          index: String(round.index),
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
                      round.status === "full" ? "text-rpkm-red" : "text-black",
                    )}
                  >
                    <Users className="size-3.5" />
                    {round.booked}/{round.capacity}
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
                name: chosenGameName ?? t("walkrally.events.tabs.minigame"),
                index: String(selectedRound.index),
              })
            : ""
        }
        confirmLabel={t("walkrally.events.confirm")}
        cancelLabel={t("walkrally.events.cancel")}
        successTitle={t("walkrally.events.successTitle")}
        successMessage={
          selectedRound
            ? t("walkrally.events.successMessage", {
                name: chosenGameName ?? t("walkrally.events.tabs.minigame"),
                index: String(selectedRound.index),
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
