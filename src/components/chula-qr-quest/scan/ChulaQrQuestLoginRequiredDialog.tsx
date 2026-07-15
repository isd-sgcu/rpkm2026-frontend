import { LockKeyhole } from "lucide-react";
import { buttonVariants } from "@components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@components/ui/dialog";
import { MonotoneNoise } from "@components/shared/MonotoneNoise";
import { useT } from "@lib/i18n/useT";
import { cn } from "@lib/utils";

interface ChulaQrQuestLoginRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChulaQrQuestLoginRequiredDialog({
  open,
  onOpenChange,
}: ChulaQrQuestLoginRequiredDialogProps) {
  const t = useT();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="overflow-hidden rounded-2xl border border-black p-0"
        showCloseButton={false}
      >
        <div className="flex flex-col items-center gap-4 pb-6 text-center">
          <div className="flex w-full flex-col items-center gap-3 px-6 pt-6">
            <DialogTitle className="text-xl font-bold whitespace-pre-line">
              {t("chulaQrQuest.scan.loginRequiredTitle")}
            </DialogTitle>
          </div>

          <div className="relative flex w-full items-center justify-center overflow-hidden bg-rpkm-green py-8">
            <MonotoneNoise className="pointer-events-none absolute inset-0" />
            <div className="relative flex size-28 items-center justify-center rounded-2xl border-2 border-foreground bg-background shadow-lg">
              <LockKeyhole className="size-16" />
            </div>
          </div>

          <a
            href="/landing"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "w-fit rounded-full",
            )}
          >
            {t("chulaQrQuest.scan.loginRequiredButton")}
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
