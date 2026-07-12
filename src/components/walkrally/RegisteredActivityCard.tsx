import { useState } from "react";
import { AlertCircle, CheckCircle2, XIcon } from "lucide-react";
import { getImageUrl } from "@lib/function";
import { useT } from "@lib/i18n/useT";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@components/ui/dialog";
import rounds from "@components/walkrally/rounds.json";

export interface RegisteredActivity {
  id: string;
  name: string;
  description?: string;
  round: number;
  ticketNumber: string;
  imageName?: string;
  accentColor: string;
}

interface RegisteredActivityCardProps {
  activity: RegisteredActivity;
}

type Step = "confirm" | "success" | "fail";

export function RegisteredActivityCard({
  activity,
}: RegisteredActivityCardProps) {
  const t = useT();
  const imageUrl = getImageUrl(activity.imageName ?? "");
  const frameStyle = { backgroundColor: activity.accentColor };
  const round = rounds.find((r) => r.index === activity.round);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("confirm");

  async function handleConfirmCancel() {
    try {
      // TODO: call cancellation API
      setStep("success");
    } catch {
      setStep("fail");
    }
  }

  return (
    <>
      <a
        href={`/walkrally/events/${activity.id}`}
        style={frameStyle}
        className="relative isolate block overflow-hidden rounded-3xl border border-black p-1"
      >
        <div className="relative flex gap-3 rounded-[1.15rem] border border-black bg-rpkm-beige p-3 pr-4">
          <div
            style={frameStyle}
            className="relative isolate size-24 shrink-0 overflow-hidden rounded-2xl border border-black p-1"
          >
            {activity.imageName ? (
              <img
                src={imageUrl}
                alt=""
                className="size-full rounded-xl border border-black object-cover"
              />
            ) : (
              <div className="size-full rounded-xl border border-black bg-muted" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-lg font-bold text-foreground">
              {activity.name}
            </div>
            {activity.description && (
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {activity.description}
              </p>
            )}

            <div className="mt-2 flex items-end justify-between gap-2">
              <div>
                <div className="text-base font-bold text-foreground">
                  {t("walkrally.events.roundLabel", {
                    index: String(activity.round),
                  })}
                </div>
                {round && (
                  <div className="text-xs text-muted-foreground">
                    {round.start} - {round.end}
                  </div>
                )}
              </div>
              <span className="shrink-0 text-xs font-bold text-muted-foreground">
                #{activity.ticketNumber}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setStep("confirm");
              setOpen(true);
            }}
            className="absolute top-2 right-2 flex size-6 items-center justify-center"
          >
            <XIcon className="size-4 fill-destructive text-destructive" />
          </button>
        </div>
      </a>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0" showCloseButton={false}>
          {step === "confirm" && (
            <>
              <div className="flex flex-col items-center gap-1 rounded-2xl border-b border-b-black bg-[#d33d3d] p-4 text-background">
                <AlertCircle className="size-11" />
              </div>
              <div className="flex flex-col items-center gap-4 px-4 pb-6 text-center">
                <div className="flex flex-col items-center gap-1">
                  <DialogTitle className="text-2xl font-bold">
                    {t("walkrally.home.cancelTitle")}
                  </DialogTitle>
                  <DialogDescription className="text-foreground">
                    {t("walkrally.home.cancelMessage", {
                      name: activity.name,
                      index: String(activity.round),
                    })}
                  </DialogDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    className="bg-[#d33d3d] hover:bg-[#d33d3d]/85"
                    onClick={handleConfirmCancel}
                  >
                    {t("walkrally.home.cancelConfirm")}
                  </Button>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    {t("walkrally.home.cancelDismiss")}
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
                    {t("walkrally.home.cancelSuccessTitle")}
                  </DialogTitle>
                  <DialogDescription className="text-foreground">
                    {t("walkrally.home.cancelSuccessMessage", {
                      name: activity.name,
                      index: String(activity.round),
                    })}
                  </DialogDescription>
                </div>
                <Button variant="green" onClick={() => setOpen(false)}>
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
                    {t("walkrally.home.cancelFailTitle")}
                  </DialogTitle>
                  <DialogDescription className="text-foreground">
                    {t("walkrally.home.cancelFailMessage")}
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
    </>
  );
}
