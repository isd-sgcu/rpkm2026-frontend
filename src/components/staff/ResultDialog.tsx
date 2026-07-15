import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@components/ui/dialog";

interface ResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: "success" | "error";
  successTitle: string;
  successMessage: string;
  okLabel: string;
  failTitle: string;
  failMessage: string;
  retryLabel: string;
}

export function ResultDialog({
  open,
  onOpenChange,
  status,
  successTitle,
  successMessage,
  okLabel,
  failTitle,
  failMessage,
  retryLabel,
}: ResultDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="overflow-hidden border-2 border-black p-0"
        showCloseButton={false}
      >
        {status === "success" ? (
          <>
            <div className="flex flex-col items-center gap-1 rounded-b-2xl border-b border-b-black bg-rpkm-green p-4 text-background">
              <CheckCircle2 className="size-11" />
            </div>
            <div className="flex flex-col items-center gap-4 px-4 pb-6 text-center">
              <div className="flex flex-col items-center gap-1">
                <DialogTitle className="text-2xl font-bold">
                  {successTitle}
                </DialogTitle>
                <DialogDescription className="whitespace-pre-line text-foreground">
                  {successMessage}
                </DialogDescription>
              </div>
              <Button variant="green" onClick={() => onOpenChange(false)}>
                {okLabel}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center gap-1 rounded-b-2xl border-b border-b-black bg-[#d33d3d] p-4 text-background">
              <AlertCircle className="size-11" />
            </div>
            <div className="flex flex-col items-center gap-4 px-4 pb-6 text-center">
              <div className="flex flex-col items-center gap-1">
                <DialogTitle className="text-2xl font-bold">
                  {failTitle}
                </DialogTitle>
                <DialogDescription className="whitespace-pre-line text-foreground">
                  {failMessage}
                </DialogDescription>
              </div>
              <Button
                variant="outline"
                className="border-[#d33d3d] text-[#d33d3d]"
                onClick={() => onOpenChange(false)}
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
