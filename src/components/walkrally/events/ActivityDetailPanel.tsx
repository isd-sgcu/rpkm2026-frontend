import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Users } from "lucide-react";
import { useStore } from "@nanostores/react";
import { cn } from "@lib/utils";
import { getImageUrl } from "@lib/function";
import { useT } from "@lib/i18n/useT";
import { $locale } from "@lib/i18n/locale";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@components/ui/dialog";
import { rounds, type Round } from "@components/walkrally/events/rounds";
import registrations from "@components/walkrally/registrations.json";

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

type Step = "confirm" | "success" | "fail";

export function ActivityDetailPanel({ entry }: ActivityDetailPanelProps) {
  const t = useT();
  const locale = useStore($locale);
  const [selectedRound, setSelectedRound] = useState<Round | null>(null);
  const [step, setStep] = useState<Step>("confirm");

  const name = locale === "th" ? entry.nameTh : entry.nameEn;
  const description =
    locale === "th" ? entry.descriptionTh : entry.descriptionEn;
  const imageUrl = getImageUrl(entry.imageName ?? "");
  const registration = registrations.find((r) => r.activityId === entry.id);

  useEffect(() => {
    document.title = name;
  }, [name]);

  function closeDialog() {
    setSelectedRound(null);
  }

  async function handleConfirm() {
    try {
      // TODO: call registration API
      setStep("success");
    } catch {
      setStep("fail");
    }
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
            const isSelected = registration?.round === round.index;
            return (
              <button
                key={round.index}
                type="button"
                disabled={Boolean(registration) || round.status !== "available"}
                onClick={() => {
                  setSelectedRound(round);
                  setStep("confirm");
                }}
                className={cn(
                  "flex flex-col rounded-xl p-2 text-left text-foreground disabled:cursor-not-allowed border border-black",
                  isSelected
                    ? "border-2 border-rpkm-green bg-background"
                    : round.status === "available"
                      ? "bg-background"
                      : "bg-[#f4c3ab]",
                )}
              >
                <div className="flex items-center justify-between gap-2">
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
                  {isSelected ? (
                    <span className="text-sm font-bold text-rpkm-green">
                      {t("walkrally.events.alreadySelected")}
                    </span>
                  ) : round.status === "full" ? (
                    <span className="text-sm font-bold text-rpkm-red">
                      {t("walkrally.events.full")}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs">
                      <Users className="size-3.5" />
                      {round.booked}/{round.capacity}
                    </span>
                  )}
                </div>
                {!isSelected && round.status === "conflict" && (
                  <p className="text-xs text-rpkm-red">
                    {t("walkrally.events.conflictMessage")}
                  </p>
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
              <div className="flex flex-col items-center gap-1 bg-[#d33d3d] p-4 text-background rounded-2xl border-b border-b-black">
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
                        name,
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
                        name,
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
                  className="border-destructive text-destructive"
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
