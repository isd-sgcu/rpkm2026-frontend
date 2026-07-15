import { CircleAlert } from "lucide-react";

import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@components/ui/dialog";

import { JigsawProgress } from "./JigsawProgress";
import { JigsawPiecePlaceholder } from "./JigsawPiecePlaceholder";

/** Red used for the failure alert header and its confirm button. */
const FAIL_RED = "#d64541";

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

/** Thai date + time, e.g. "31 ก.ค. 69 เวลา 23.59 น." */
function formatReceivedAt(date: Date): string {
  const day = date.getDate();
  const month = MONTH_SHORT_TH[date.getMonth()];
  const buddhistYear = String(date.getFullYear() + 543).slice(-2);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${buddhistYear} เวลา ${hours}.${minutes} น.`;
}

/** Small decorative flower built from rotated petals around a centre dot. */
function Flower({
  petals,
  petalColor,
  centerColor,
  className,
}: {
  petals: number;
  petalColor: string;
  centerColor: string;
  className?: string;
}) {
  return (
    <svg viewBox="-50 -50 100 100" className={className} aria-hidden="true">
      {Array.from({ length: petals }).map((_, i) => (
        <ellipse
          key={i}
          cx="0"
          cy="-27"
          rx="11"
          ry="21"
          fill={petalColor}
          transform={`rotate(${(360 / petals) * i})`}
        />
      ))}
      <circle r="15" fill={centerColor} />
    </svg>
  );
}

/** Outcome shown by the dialog: a collected piece, or a failed scan. */
export type JigsawScanResult =
  { status: "success"; receivedAt: Date } | { status: "fail" };

interface JigsawScanResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: JigsawScanResult | null;
}

/**
 * Pop-up shown after a scan. On success it presents the freshly collected piece
 * (a pink placeholder standing in for the real artwork) with the shared
 * {@link JigsawProgress} bar and the collected date; on failure it shows a red
 * alert. The "ตกลง" button closes the pop-up in both cases.
 */
export function JigsawScanResultDialog({
  open,
  onOpenChange,
  result,
}: JigsawScanResultDialogProps) {
  const isFail = result?.status === "fail";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "w-[330px] max-w-[330px] rounded-2xl border border-black",
          isFail ? "h-[222px] overflow-hidden p-0" : "h-[423px]",
        )}
        showCloseButton={false}
      >
        {result?.status === "success" && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <DialogTitle className="text-xl font-bold">
              ได้รับจิกซอร์ชิ้นใหม่ !
            </DialogTitle>

            <JigsawProgress />

            <div className="relative w-full max-w-[240px] py-4">
              <Flower
                petals={8}
                petalColor="#fbe200"
                centerColor="#f0a500"
                className="absolute top-0 right-1 w-12"
              />
              <Flower
                petals={6}
                petalColor="#80cae8"
                centerColor="#ffffff"
                className="absolute bottom-1 left-1 w-11"
              />
              <JigsawPiecePlaceholder className="relative mx-auto w-3/4" />
            </div>

            <DialogDescription className="text-sm text-foreground">
              ได้รับเมื่อวันที่ {formatReceivedAt(result.receivedAt)}
            </DialogDescription>

            <Button
              variant="green"
              className="rounded-full px-8"
              onClick={() => onOpenChange(false)}
            >
              ตกลง
            </Button>
          </div>
        )}

        {result?.status === "fail" && (
          <>
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
