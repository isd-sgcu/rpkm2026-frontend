import { CircleAlert } from "lucide-react";

import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@components/ui/dialog";

/** Red used for the alert header and the confirm button. */
const FAIL_RED = "#d64541";

interface JigsawScanFailedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Pop-up shown when a scan fails. The "ตกลง" button closes it. Mirrors the
 * jigsaw reward pop-up flow: the scan page records the failure and redirects
 * here, where this dialog is opened on arrival.
 */
export function JigsawScanFailedDialog({
  open,
  onOpenChange,
}: JigsawScanFailedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[330px] max-w-[330px] h-[222px] overflow-hidden rounded-2xl border border-black p-0"
        showCloseButton={false}
      >
        <div
          className="flex flex-col items-center rounded-b-2xl border-b border-b-black p-5 text-white"
          style={{ backgroundColor: FAIL_RED }}
        >
          <CircleAlert className="size-[44px]" />
        </div>

        <div className="flex flex-col items-center gap-4 px-6 pb-6 text-center">
          <div className="flex flex-col items-center gap-1">
            <DialogTitle className="text-2xl font-bold">
              สแกนไม่สำเร็จ
            </DialogTitle>
            <DialogDescription className="text-foreground">
              กรุณาลองใหม่อีกครั้ง
            </DialogDescription>
          </div>

          <Button
            variant="outline"
            className="rounded-full border border-black text-white hover:text-white"
            style={{ backgroundColor: FAIL_RED }}
            onClick={() => onOpenChange(false)}
          >
            ตกลง
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
