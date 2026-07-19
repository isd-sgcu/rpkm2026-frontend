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
import type { PieceId } from "./jigsawState";
import { useT } from "@lib/i18n/useT";

/**
 * Collected artwork for each jigsaw piece (jigsaw_<n>.png), keyed by piece
 * number (1..10). `import.meta.glob` needs a literal relative pattern, so the
 * "@assets" alias can't be used here.
 */
const pieceImageModules = import.meta.glob<{ default: ImageMetadata }>(
  "../../assets/images/jigsaw_*.png",
  { eager: true },
);

const pieceImageByNumber: Record<number, ImageMetadata> = {};
for (const [path, module] of Object.entries(pieceImageModules)) {
  const pieceNumber = Number(path.match(/jigsaw_(\d+)\.png$/)?.[1]);
  if (pieceNumber) pieceImageByNumber[pieceNumber] = module.default;
}

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
  | { status: "success"; pieceId: PieceId; receivedAt: Date }
  | { status: "fail"; title?: string; message?: string };

interface JigsawScanResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: JigsawScanResult | null;
}

/**
 * Pop-up shown after a scan. On success it presents the freshly collected
 * piece's artwork (jigsaw_<n>.png, falling back to a pink placeholder) with the
 * shared {@link JigsawProgress} bar and the collected date; on failure it shows
 * a red alert. The "ตกลง" button closes the pop-up in both cases.
 */
export function JigsawScanResultDialog({
  open,
  onOpenChange,
  result,
}: JigsawScanResultDialogProps) {
  const t = useT();

  const sizeClass =
    result?.status === "fail" ? "h-[222px] overflow-hidden p-0" : "h-[423px]";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("w-82.5 rounded-2xl border border-black", sizeClass)}
        showCloseButton={false}
      >
        {result?.status === "success" && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <DialogTitle className="text-2xl font-bold">
              {t("jigsaw.successPopup.title")}
            </DialogTitle>

            <JigsawProgress />

            <div className="relative w-full max-w-60 py-4">
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
              {pieceImageByNumber[result.pieceId] ? (
                <img
                  src={pieceImageByNumber[result.pieceId].src}
                  alt="ชิ้นส่วนจิกซอร์"
                  className="relative mx-auto h-40 w-auto"
                />
              ) : (
                <JigsawPiecePlaceholder className="relative mx-auto w-3/4" />
              )}
            </div>

            <DialogDescription className="text-base text-[#372F32]">
              {t("jigsaw.successPopup.collectedAt", {
                datetime: formatReceivedAt(result.receivedAt),
              })}
            </DialogDescription>

            <Button
              className="rounded-r-lg w-18 h-8 bg-[#6ABF73] text-[#FEFDF5] font-base border top-22 shadow-none focus-visible:ring-0 border-foreground"
              onClick={() => onOpenChange(false)}
            >
              {t("jigsaw.successPopup.confirmButton")}
            </Button>
          </div>
        )}

        {result?.status === "fail" && (
          <>
            <div className="flex flex-col items-center justify-center rounded-b-2xl border-b border-b-black bg-[#D33D3D] p-1 text-white">
              <CircleAlert className="size-11" />
            </div>

            <div className="flex flex-col items-center gap-4 px-6 pb-6 text-center">
              <div className="flex flex-col items-center gap-1">
                <DialogTitle className="text-2xl font-bold">
                  {result.title ?? t("jigsaw.failedPopup.title")}
                </DialogTitle>
                <DialogDescription className="text-foreground">
                  {result.message ?? t("jigsaw.failedPopup.description")}
                </DialogDescription>
              </div>

              <Button
                className="rounded-r-lg w-18 h-8 border border-foreground bg-[#D33D3D] text-white shadow-none focus-visible:ring-0"
                onClick={() => onOpenChange(false)}
              >
                {t("jigsaw.failedPopup.confirmButton")}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
