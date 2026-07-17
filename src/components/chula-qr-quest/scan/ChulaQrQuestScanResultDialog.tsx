import { useStore } from "@nanostores/react";
import { AlertCircle } from "lucide-react";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@components/ui/dialog";
import { MonotoneNoise } from "@components/shared/MonotoneNoise";
import { $locale, type LocaleType } from "@lib/i18n/locale";
import { useT } from "@lib/i18n/useT";
import stampIcon from "@assets/images/stamp_button.svg";

const MONTH_SHORT_TH = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

function formatCollectedAt(date: Date, locale: LocaleType) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  if (locale === "th") {
    const day = date.getDate();
    const month = MONTH_SHORT_TH[date.getMonth()];
    const buddhistYear = String(date.getFullYear() + 543).slice(-2);
    return `${day} ${month} ${buddhistYear} เวลา ${hours}.${minutes} น.`;
  }

  const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });
  return `${monthFormatter.format(date)} ${date.getDate()}, ${date.getFullYear()}, ${hours}:${minutes}`;
}

export type ScanResult =
  | {
      status: "success";
      shopName: string;
      collectedCount: number;
      totalCount: number;
      collectedAt: Date;
    }
  | { status: "fail"; title?: string; message?: string };

interface ChulaQrQuestScanResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: ScanResult | null;
}

export function ChulaQrQuestScanResultDialog({
  open,
  onOpenChange,
  result,
}: ChulaQrQuestScanResultDialogProps) {
  const t = useT();
  const locale = useStore($locale);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="overflow-hidden rounded-2xl border border-black p-0"
        showCloseButton={false}
      >
        {result?.status === "success" && (
          <div className="flex flex-col items-center gap-4 pb-6 text-center">
            <div className="flex w-full flex-col items-center gap-3 px-6 pt-6">
              <DialogTitle className="text-xl font-bold">
                {t("chulaQrQuest.scan.successTitle")}
              </DialogTitle>
              <span className="rounded-full border border-foreground bg-rpkm-yellow px-4 py-1 text-sm font-bold">
                {t("chulaQrQuest.reward.collectedProgress", {
                  collected: String(result.collectedCount),
                  total: String(result.totalCount),
                })}
              </span>
            </div>

            <div className="relative flex w-full flex-col items-center justify-center gap-3 overflow-hidden bg-rpkm-green px-6 py-8">
              <MonotoneNoise className="pointer-events-none absolute inset-0" />
              <div className="relative flex size-28 items-center justify-center rounded-2xl border-2 border-foreground bg-background shadow-lg">
                <img src={stampIcon.src} alt="" className="size-16" />
              </div>
              <p className="relative text-2xl font-bold text-foreground text-wrap whitespace-normal">
                {result.shopName}
              </p>
            </div>

            <DialogDescription className="rounded-full border border-foreground bg-background px-4 py-1.5 text-xs font-bold text-foreground">
              {t("chulaQrQuest.scan.collectedAt", {
                datetime: formatCollectedAt(result.collectedAt, locale),
              })}
            </DialogDescription>

            <Button
              variant="default"
              className="rounded-full"
              onClick={() => onOpenChange(false)}
            >
              {t("chulaQrQuest.scan.ok")}
            </Button>
          </div>
        )}

        {result?.status === "fail" && (
          <>
            <div className="flex flex-col items-center gap-1 rounded-b-2xl border-b border-b-black bg-[#d33d3d] p-4 text-background">
              <AlertCircle className="size-11" />
            </div>
            <div className="flex flex-col items-center gap-4 px-4 pb-6 text-center">
              <div className="flex flex-col items-center gap-1">
                <DialogTitle className="text-2xl font-bold">
                  {result.title ?? t("chulaQrQuest.scan.failTitle")}
                </DialogTitle>
                <DialogDescription className="text-foreground">
                  {result.message ?? t("chulaQrQuest.scan.failMessage")}
                </DialogDescription>
              </div>
              <Button
                variant="outline"
                className="border border-black bg-rpkm-red text-white"
                onClick={() => onOpenChange(false)}
              >
                {t("chulaQrQuest.scan.ok")}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
