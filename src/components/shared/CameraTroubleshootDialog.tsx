import { useState } from "react";
import { useT } from "@lib/i18n/useT";
import { cn } from "@lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@components/ui/dialog";

const sections = ["chrome", "safari", "generic"] as const;

interface CameraTroubleshootProps {
  className?: string;
}

// Underlined "how to fix camera problems" link + the troubleshooting dialog it
// opens. Drop next to any QR scanner.
export function CameraTroubleshoot({ className }: CameraTroubleshootProps) {
  const t = useT();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "self-center font-bold underline underline-offset-4",
          className,
        )}
      >
        {t("qrcode.troubleshoot.link")}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto border-2 border-black">
          <DialogTitle className="text-xl font-bold">
            {t("qrcode.troubleshoot.title")}
          </DialogTitle>
          <DialogDescription className="text-foreground">
            {t("qrcode.troubleshoot.intro")}
          </DialogDescription>

          <div className="flex flex-col gap-4">
            {sections.map((section) => (
              <div key={section} className="flex flex-col gap-1">
                <h3 className="font-bold">
                  {t(`qrcode.troubleshoot.${section}Title`)}
                </h3>
                <p className="text-sm whitespace-pre-line text-foreground">
                  {t(`qrcode.troubleshoot.${section}Steps`)}
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
