import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@components/ui/dialog";

import { JigsawProgress } from "./JigsawProgress";
import { JigsawPiecePlaceholder } from "./JigsawPiecePlaceholder";

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

interface JigsawRewardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When the piece was collected; null renders no date line. */
  receivedAt: Date | null;
}

/**
 * Reward pop-up shown after a successful scan. The pink piece is a placeholder
 * standing in for the real artwork of the piece just found; the progress bar is
 * the shared {@link JigsawProgress} so it reflects the live collected count. The
 * "ตกลง" button closes the pop-up.
 */
export function JigsawRewardDialog({
  open,
  onOpenChange,
  receivedAt,
}: JigsawRewardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="h-[423px] w-[330px] max-w-[330px] rounded-2xl border border-black"
        showCloseButton={false}
      >
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

          {receivedAt && (
            <DialogDescription className="text-sm text-foreground">
              ได้รับเมื่อวันที่ {formatReceivedAt(receivedAt)}
            </DialogDescription>
          )}

          <Button
            variant="green"
            className="rounded-full px-8"
            onClick={() => onOpenChange(false)}
          >
            ตกลง
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
