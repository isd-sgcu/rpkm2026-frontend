import { useEffect, useState } from "react";
import { CircleAlert, Loader2 } from "lucide-react";

import { cn } from "@lib/utils";
import { signInWithGoogle } from "@lib/api/auth";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@components/ui/dialog";

import { JigsawProgress } from "./JigsawProgress";
import { JigsawPiecePlaceholder } from "./JigsawPiecePlaceholder";
import { setPendingClaim, type PieceId } from "./jigsawState";

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

/**
 * Outcome shown by the dialog: a collected piece, a piece that needs login
 * before it can be saved, or a failed scan.
 */
export type JigsawScanResult =
  | { status: "success"; pieceId: PieceId; receivedAt: Date }
  | { status: "login-required"; pieceId: PieceId; receivedAt: Date }
  | { status: "fail" };

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
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Redirecting to Google navigates away; if the browser restores this page
  // from the bfcache (e.g. the user hits back), reset so the button is usable.
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setIsSigningIn(false);
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  async function handleLogin() {
    if (result?.status !== "login-required") return;
    // Remember the found piece so the jigsaw page can save it after login.
    setPendingClaim({
      pieceId: result.pieceId,
      receivedAt: result.receivedAt.toISOString(),
    });
    setIsSigningIn(true);
    try {
      const { url } = await signInWithGoogle(
        `${window.location.origin}/jigsaw`,
      );
      window.location.href = url;
    } catch {
      setIsSigningIn(false);
    }
  }

  const sizeClass =
    result?.status === "fail"
      ? "h-[222px] overflow-hidden p-0"
      : result?.status === "login-required"
        ? "h-[423px] overflow-hidden p-0"
        : "h-[423px]";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "w-[330px] max-w-[330px] rounded-2xl border border-black",
          sizeClass,
        )}
        showCloseButton={false}
      >
        {result?.status === "success" && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <DialogTitle className="text-2xl font-bold">
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
              ได้รับเมื่อวันที่ {formatReceivedAt(result.receivedAt)}
            </DialogDescription>

            <Button
              className="rounded-r-lg w-[72px] h-[32px] bg-[#6ABF73] text-[#FEFDF5] font-base border-1 top-22 shadow-none focus-visible:ring-0 border-foreground"
              onClick={() => onOpenChange(false)}
            >
              ตกลง
            </Button>
          </div>
        )}

        {result?.status === "login-required" && (
          <div className="relative h-full text-center">
            <DialogTitle className="absolute inset-x-0 top-[85px] px-6 text-2xl leading-snug font-bold">
              โปรดล็อกอิน / ลงทะเบียน
              <br />
              เพื่อเก็บสแตมป์นี้…
            </DialogTitle>
            <DialogDescription className="sr-only">
              เข้าสู่ระบบเพื่อบันทึกชิ้นส่วนจิกซอร์ที่คุณเพิ่งพบ
            </DialogDescription>

            <Button
              variant="default"
              className="absolute top-[175px] left-1/2 -translate-x-1/2 rounded-r-lg px-[16px] shadow-none focus-visible:ring-0"
              disabled={isSigningIn}
              onClick={handleLogin}
              iconStart={
                isSigningIn ? <Loader2 className="animate-spin" /> : undefined
              }
            >
              เข้าสู่ระบบ / ลงทะเบียน
            </Button>

            {/* Green hill: an ellipse wider than the card so its top edge reads
                as a gentle curve; the sides are clipped by the card. */}
            <div className="pointer-events-none absolute top-[270px] left-1/2 h-[192px] w-[471px] -translate-x-1/2 rounded-[50%] bg-rpkm-green" />
          </div>
        )}

        {result?.status === "fail" && (
          <>
            <div className="flex flex-col items-center justify-center rounded-b-2xl border-b border-b-black bg-[#D33D3D] p-1 text-white">
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
                className="rounded-r-lg w-[72px] h-[32px] border-1 border-foreground bg-[#D33D3D] text-white shadow-none focus-visible:ring-0"
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
