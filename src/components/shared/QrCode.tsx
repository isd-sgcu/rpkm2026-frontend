import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { toCanvas } from "@bwip-js/browser";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { useT } from "@lib/i18n/useT";
import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";

export interface QrCodeProps {
  contents: string;
  renderScale?: number;
}

export function QrCode({
  contents,
  renderScale,
  ...props
}: QrCodeProps & ComponentPropsWithoutRef<"canvas">) {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvas.current) {
      return;
    }

    toCanvas(canvas.current, {
      text: contents,
      bcid: "qrcode",
      scale: renderScale ?? 4,
    });
  }, [contents, renderScale]);

  return <canvas ref={canvas} {...props} />;
}

interface QrCodeDialogProps {
  contents: string;
  // Controlled open state (e.g. opened from the nav menu). Omit when using
  // `renderTrigger` for the uncontrolled, trigger-driven case.
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  // Element that opens the dialog when clicked (e.g. the ID card's QR).
  renderTrigger?: DialogPrimitive.Trigger.Props["render"];
}

// A big, scannable version of the student's QR with their id underneath.
// Opened either from a trigger (ID card) or controlled (nav menu).
export function QrCodeDialog({
  contents,
  open,
  onOpenChange,
  renderTrigger,
}: QrCodeDialogProps) {
  const t = useT();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {renderTrigger && <DialogTrigger render={renderTrigger} />}
      <DialogContent
        showCloseButton={false}
        className="border-2 border-black sm:max-w-xs"
      >
        <div className="flex flex-col items-center gap-4 p-2">
          <DialogTitle className="text-center text-xl font-bold">
            {t("qrcode.myQrTitle")}
          </DialogTitle>
          {contents && (
            <QrCode
              contents={contents}
              renderScale={6}
              className="size-56 max-w-full"
            />
          )}
          <span className="text-center text-lg font-bold">{contents}</span>
          <DialogClose
            render={
              <Button size="lg" className="w-full">
                {t("qrcode.close")}
              </Button>
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
