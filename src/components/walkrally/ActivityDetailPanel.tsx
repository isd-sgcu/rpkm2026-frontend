import { useState } from "react";
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
import { rounds, type Round } from "@components/walkrally/rounds";

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
      <div className="pointer-events-none absolute inset-x-0 top-[4.5cqw] flex h-10 items-center justify-center px-14 text-center text-2xl leading-[1.4] font-bold text-foreground sm:top-4.5 ">
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
          {t("walkrally.rounds")}
        </h2>
        <p className="mb-3 text-center text-xs">{t("walkrally.roundsNote")}</p>
        <div className="flex flex-col gap-4">
          {rounds.map((round) => (
            <button
              key={round.index}
              type="button"
              disabled={round.status !== "available"}
              onClick={() => {
                setSelectedRound(round);
                setStep("confirm");
              }}
              className={cn(
                "flex flex-col rounded-xl p-2 text-left text-foreground disabled:cursor-not-allowed border border-black",
                round.status === "available" ? "bg-background" : "bg-[#f4c3ab]",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-baseline gap-2">
                  <span className="font-bold">
                    {t("walkrally.roundLabel", {
                      index: String(round.index),
                    })}
                  </span>
                  <span className="text-sm">
                    {round.start}-{round.end}
                  </span>
                </span>
                {round.status === "full" ? (
                  <span className="text-sm font-bold text-rpkm-red">
                    {t("walkrally.full")}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs">
                    <Users className="size-3.5" />
                    {round.booked}/{round.capacity}
                  </span>
                )}
              </div>
              {round.status === "conflict" && (
                <p className="text-xs text-rpkm-red">
                  {t("walkrally.conflictMessage")}
                </p>
              )}
            </button>
          ))}
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
                    {t("walkrally.confirmTitle")}
                  </DialogTitle>
                  {selectedRound && (
                    <DialogDescription className="text-foreground">
                      {t("walkrally.confirmMessage", {
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
                    {t("walkrally.confirm")}
                  </Button>
                  <Button variant="outline" onClick={closeDialog}>
                    {t("walkrally.cancel")}
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
                    {t("walkrally.successTitle")}
                  </DialogTitle>
                  {selectedRound && (
                    <DialogDescription className="text-foreground">
                      {t("walkrally.successMessage", {
                        name,
                        index: String(selectedRound.index),
                      })}
                    </DialogDescription>
                  )}
                </div>
                <Button variant="green" onClick={closeDialog}>
                  {t("walkrally.ok")}
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
                    {t("walkrally.failTitle")}
                  </DialogTitle>
                  <DialogDescription className="text-foreground">
                    {t("walkrally.failMessage")}
                  </DialogDescription>
                </div>
                <Button
                  variant="outline"
                  className="border-[#d33d3d] text-[#d33d3d]"
                  onClick={() => setStep("confirm")}
                >
                  {t("walkrally.retry")}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
