import { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@components/ui/dialog";

type Step = "confirm" | "success" | "fail";

interface ConfirmActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
  confirmTitle: string;
  confirmMessage: string;
  confirmLabel: string;
  cancelLabel: string;
  successTitle: string;
  successMessage: string;
  okLabel: string;
  failTitle: string;
  failMessage: string;
  retryLabel: string;
}

export function ConfirmActionDialog({
  open,
  onOpenChange,
  onConfirm,
  confirmTitle,
  confirmMessage,
  confirmLabel,
  cancelLabel,
  successTitle,
  successMessage,
  okLabel,
  failTitle,
  failMessage,
  retryLabel,
}: ConfirmActionDialogProps) {
  const [step, setStep] = useState<Step>("confirm");

  function close() {
    setStep("confirm");
    onOpenChange(false);
  }

  async function handleConfirm() {
    try {
      await onConfirm();
      setStep("success");
    } catch {
      setStep("fail");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setStep("confirm");
        onOpenChange(next);
      }}
    >
      <DialogContent
        className="overflow-hidden border-2 border-black p-0"
        showCloseButton={false}
      >
        {step === "confirm" && (
          <>
            <div className="flex flex-col items-center gap-1 rounded-2xl border-b border-b-black bg-[#d33d3d] p-4 text-background">
              <AlertCircle className="size-11" />
            </div>
            <div className="flex flex-col items-center gap-4 px-4 pb-6 text-center">
              <div className="flex flex-col items-center gap-1">
                <DialogTitle className="text-2xl font-bold">
                  {confirmTitle}
                </DialogTitle>
                <DialogDescription className="text-foreground">
                  {confirmMessage}
                </DialogDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  className="bg-[#d33d3d] hover:bg-[#d33d3d]/85"
                  onClick={handleConfirm}
                >
                  {confirmLabel}
                </Button>
                <Button variant="outline" onClick={close}>
                  {cancelLabel}
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
                  {successTitle}
                </DialogTitle>
                <DialogDescription className="text-foreground">
                  {successMessage}
                </DialogDescription>
              </div>
              <Button variant="green" onClick={close}>
                {okLabel}
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
                  {failTitle}
                </DialogTitle>
                <DialogDescription className="text-foreground">
                  {failMessage}
                </DialogDescription>
              </div>
              <Button
                variant="outline"
                className="border-[#d33d3d] text-[#d33d3d]"
                onClick={() => setStep("confirm")}
              >
                {retryLabel}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
