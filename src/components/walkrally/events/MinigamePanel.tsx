import { useState, useSyncExternalStore } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronRight,
  Users,
} from "lucide-react";
import { useStore } from "@nanostores/react";
import { cn } from "@lib/utils";
import { useT } from "@lib/i18n/useT";
import { $locale } from "@lib/i18n/locale";
import { getImageUrl } from "@lib/function";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@components/ui/dialog";
import { rounds, type Round } from "@components/walkrally/events/rounds";
import events from "@components/walkrally/events/events.json";
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

type Step = "confirm" | "success" | "fail";

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
  const [step, setStep] = useState<Step>("confirm");
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

  function closeDialog() {
    setSelectedRound(null);
  }

  async function handleConfirm() {
    if (!selectedRound) return;
    try {
      // TODO: call registration API with { activityId: chosenGameId, round: selectedRound.index }
      // once the API confirms the registration, it becomes the source of truth for chosenGameId,
      // so the locally-cached in-progress pick is no longer needed
      clearStoredMinigameId();
      setStep("success");
    } catch {
      setStep("fail");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <a
        href="/walkrally/events/minigames"
        style={{ backgroundColor: ACCENT_MINIGAME }}
        className="flex items-center gap-3 rounded-2xl border border-black p-3 text-background"
      >
        {chosenGame ? (
          <>
            {chosenGameImage ? (
              <img
                src={chosenGameImage}
                alt=""
                className="size-10 shrink-0 rounded-lg border border-black object-cover"
              />
            ) : (
              <div className="size-10 shrink-0 rounded-lg border border-black bg-muted" />
            )}
            <p className="flex-1 text-sm font-bold">{chosenGameName}</p>
          </>
        ) : (
          <p className="flex-1 text-sm whitespace-pre-line">
            {t("walkrally.events.minigameSummary")}
          </p>
        )}
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
                onClick={() => {
                  setSelectedRound(round);
                  setStep("confirm");
                }}
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
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    {isSelected && (
                      <Check className="size-4 shrink-0 text-black" />
                    )}
                    <span className="flex items-baseline gap-2">
                      <span className="font-bold">
                        {t("walkrally.events.roundLabel", {
                          index: String(round.index),
                        })}
                      </span>
                      <span className="text-sm">
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

      <Dialog
        open={selectedRound !== null}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent className="overflow-hidden p-0" showCloseButton={false}>
          {step === "confirm" && (
            <>
              <div className="flex flex-col items-center gap-1 rounded-2xl border-b border-b-black bg-[#d33d3d] p-4 text-background">
                <AlertCircle className="size-11" />
              </div>
              <div className="flex flex-col items-center gap-4 px-4 pb-6 text-center">
                <div className="flex flex-col items-center gap-1">
                  <DialogTitle className="text-2xl font-bold">
                    {t("walkrally.events.confirmTitle")}
                  </DialogTitle>
                  {selectedRound && (
                    <DialogDescription className="text-foreground">
                      {t("walkrally.events.confirmMessage", {
                        name:
                          chosenGameName ?? t("walkrally.events.tabs.minigame"),
                        index: String(selectedRound.index),
                      })}
                    </DialogDescription>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    className="bg-[#d33d3d] hover:bg-[#d33d3d]/85"
                    onClick={handleConfirm}
                  >
                    {t("walkrally.events.confirm")}
                  </Button>
                  <Button variant="outline" onClick={closeDialog}>
                    {t("walkrally.events.cancel")}
                  </Button>
                </div>
              </div>
            </>
          )}

          {step === "success" && (
            <>
              <div className="flex flex-col items-center gap-1 rounded-b-2xl border-b border-b-black bg-rpkm-green p-4 text-background">
                <CheckCircle2 className="size-11" />
              </div>
              <div className="flex flex-col items-center gap-4 px-4 pb-6 text-center">
                <div className="flex flex-col items-center gap-1">
                  <DialogTitle className="text-2xl font-bold">
                    {t("walkrally.events.successTitle")}
                  </DialogTitle>
                  {selectedRound && (
                    <DialogDescription className="text-foreground">
                      {t("walkrally.events.successMessage", {
                        name:
                          chosenGameName ?? t("walkrally.events.tabs.minigame"),
                        index: String(selectedRound.index),
                      })}
                    </DialogDescription>
                  )}
                </div>
                <Button variant="green" onClick={closeDialog}>
                  {t("walkrally.events.ok")}
                </Button>
              </div>
            </>
          )}

          {step === "fail" && (
            <>
              <div className="flex flex-col items-center gap-1 rounded-b-2xl border-b border-b-black bg-[#d33d3d] p-4 text-background">
                <AlertCircle className="size-11" />
              </div>
              <div className="flex flex-col items-center gap-4 px-4 pb-6 text-center">
                <div className="flex flex-col items-center gap-1">
                  <DialogTitle className="text-2xl font-bold">
                    {t("walkrally.events.failTitle")}
                  </DialogTitle>
                  <DialogDescription className="text-foreground">
                    {t("walkrally.events.failMessage")}
                  </DialogDescription>
                </div>
                <Button
                  variant="outline"
                  className="border-[#d33d3d] text-[#d33d3d]"
                  onClick={() => setStep("confirm")}
                >
                  {t("walkrally.events.retry")}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
