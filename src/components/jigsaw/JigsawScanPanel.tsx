import { useEffect, useRef, useState } from "react";
import { useStore } from "@nanostores/react";
import {
  ScanLine,
  CircleAlert,
  LogIn,
  CloudUpload,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@components/ui/button";
import { Toaster } from "@components/ui/sonner";
import { CameraTroubleshoot } from "@components/shared/CameraTroubleshootDialog";
import { MonotoneNoise } from "@components/shared/MonotoneNoise";
import { QrScanner } from "@components/shared/QrCodeScanner";
import {
  JigsawScanResultDialog,
  type JigsawScanResult,
} from "./JigsawScanResultDialog";
import {
  $foundPieces,
  markPieceFound,
  setPendingScan,
  syncStoredPieces,
  TOTAL_PIECES,
} from "./jigsawState";
import { collectScannedJigsaw } from "./jigsawScanFlow";
import { useT } from "@lib/i18n/useT";

/**
 * Scan page panel. Shows the live QR scanner; a successful scan just logs its
 * contents for now (the collection flow isn't wired to it yet). The buttons
 * below are placeholder tests for the scan outcomes: a success awards the next
 * uncollected piece; a login-required scan finds a piece but defers saving it
 * until the user logs in; a failure awards nothing. Each records the result and
 * navigates to the jigsaw page, which shows the matching pop-up on arrival.
 * TODO: route the real QR scan result into the collection flow.
 */
export function JigsawScanPanel() {
  const t = useT();
  const found = useStore($foundPieces);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [decoding, setDecoding] = useState(false);
  // Result of the last scan, driving the success/fail pop-up.
  const [scanResult, setScanResult] = useState<JigsawScanResult | null>(null);
  // Guards against the camera re-emitting the same code every scanDelay.
  const lastCameraCodeRef = useRef<string | null>(null);

  useEffect(() => {
    syncStoredPieces();
  }, []);

  const allFound = found.length >= TOTAL_PIECES;

  function handleQrScan(code: string) {
    console.log("Jigsaw QR scanned:", code);
    // Same shared collect flow the /jigsaw/<pointId> deep link uses.
    if (collectScannedJigsaw(code)) {
      // Valid — show the success pop-up on the jigsaw page.
      window.location.href = "/jigsaw";
    } else {
      // Invalid QR — show the fail pop-up in place so the user can retry.
      setScanResult({ status: "fail" });
    }
  }

  function handleCameraScan(code: string) {
    if (code === lastCameraCodeRef.current) return;
    lastCameraCodeRef.current = code;
    handleQrScan(code);
  }

  function closeScanResult() {
    setScanResult(null);
    // Allow the same QR to be scanned again after dismissing.
    lastCameraCodeRef.current = null;
  }

  // Decode a QR code from an uploaded image file (same result as a live scan).
  async function handleImageFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Reset so re-selecting the same file still fires onChange.
    event.target.value = "";
    if (!file) return;

    setDecoding(true);
    try {
      const { BarcodeDetector } = await import("barcode-detector/ponyfill");
      const detector = new BarcodeDetector({ formats: ["qr_code"] });
      const [barcode] = await detector.detect(file);
      if (barcode?.rawValue) {
        handleQrScan(barcode.rawValue);
      } else {
        toast.error("ไม่พบ QR code ในรูปภาพ");
      }
    } catch {
      toast.error("ไม่สามารถอ่านรูปภาพได้");
    } finally {
      setDecoding(false);
    }
  }

  function handleScanSuccess() {
    const nextPiece = Array.from(
      { length: TOTAL_PIECES },
      (_, i) => i + 1,
    ).find((id) => !found.includes(id));
    if (nextPiece === undefined) return;

    markPieceFound(nextPiece);
    setPendingScan({
      status: "success",
      pieceId: nextPiece,
      receivedAt: new Date().toISOString(),
    });
    // Redirect to the jigsaw page, which shows the reward pop-up on arrival.
    window.location.href = "/jigsaw";
  }

  function handleScanLoginRequired() {
    const nextPiece = Array.from(
      { length: TOTAL_PIECES },
      (_, i) => i + 1,
    ).find((id) => !found.includes(id));
    if (nextPiece === undefined) return;

    // Do not award yet — the piece is saved only after the user logs in.
    setPendingScan({
      status: "login-required",
      pieceId: nextPiece,
      receivedAt: new Date().toISOString(),
    });
    // Redirect to the jigsaw page, which shows the login-required pop-up.
    window.location.href = "/jigsaw";
  }

  function handleScanFail() {
    setPendingScan({ status: "fail" });
    // Redirect to the jigsaw page, which shows the failure pop-up on arrival.
    window.location.href = "/jigsaw";
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      {/* Live QR scanner (replicated from the staff ScanEntryForm). */}
      <div className="relative isolate w-full overflow-hidden rounded-[1.8rem] border border-black bg-rpkm-light-green p-4">
        <MonotoneNoise
          noiseSize={4}
          noiseDensity={12}
          className="pointer-events-none absolute inset-0 -z-1"
        />
        <QrScanner
          className="rounded-2xl"
          paused={scanResult !== null}
          onScan={handleCameraScan}
        />
      </div>
      <CameraTroubleshoot className="-mt-1 text-foreground" />

      {/* Upload an image and scan the QR code inside it. */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFile}
      />
      <Button
        variant="default"
        // size="xl"
        className="rounded-r-lg w-[167px] h-[33px] text-base font-bold border-1 bg-[#FBE200]"
        onClick={() => fileInputRef.current?.click()}
        disabled={decoding}
        iconStart={
          decoding ? <Loader2 className="animate-spin" /> : <CloudUpload />
        }
      >
        {t("jigsaw.scan.uploadButton")}
      </Button>

      {/* Cancel: return to the jigsaw page. */}
      <Button
        variant="outline"
        size="lg"
        className="rounded-r-lg w-[72px] h-[32px] text-base font-bold border-1"
        onClick={() => {
          window.location.href = "/jigsaw";
        }}
      >
        {t("jigsaw.scan.cancelButton")}
      </Button>

      <Button
        variant="green"
        size="xl"
        onClick={handleScanSuccess}
        disabled={allFound}
        iconStart={<ScanLine />}
      >
        {allFound ? "เก็บครบทุกชิ้นแล้ว" : "สแกนเพื่อรับชิ้นส่วน (จำลอง)"}
      </Button>

      <Button
        variant="outline"
        size="xl"
        onClick={handleScanLoginRequired}
        disabled={allFound}
        iconStart={<LogIn />}
      >
        จำลองสแกน (ต้องเข้าสู่ระบบ)
      </Button>

      <Button
        variant="outline"
        size="xl"
        onClick={handleScanFail}
        iconStart={<CircleAlert />}
      >
        จำลองสแกนไม่สำเร็จ
      </Button>

      {/* Success / fail pop-up for the scan result. */}
      <JigsawScanResultDialog
        open={scanResult !== null}
        onOpenChange={(open) => {
          if (!open) closeScanResult();
        }}
        result={scanResult}
      />

      <Toaster />
    </div>
  );
}
