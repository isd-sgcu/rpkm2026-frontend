import { useEffect, useRef, useState } from "react";
import { CloudUpload, Loader2 } from "lucide-react";
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
import { syncStoredPieces } from "./jigsawState";
import { collectScannedJigsaw } from "./jigsawScanFlow";
import { useT } from "@lib/i18n/useT";

/**
 * Scan page panel. Shows the live QR scanner and an image-upload fallback; a
 * successful scan runs the shared collect flow and redirects to the jigsaw
 * page, which shows the matching pop-up on arrival.
 */
export function JigsawScanPanel() {
  const t = useT();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [decoding, setDecoding] = useState(false);
  // Result of the last scan, driving the success/fail pop-up.
  const [scanResult, setScanResult] = useState<JigsawScanResult | null>(null);
  // Guards against the camera re-emitting the same code every scanDelay.
  const lastCameraCodeRef = useRef<string | null>(null);

  useEffect(() => {
    syncStoredPieces();
  }, []);

  function handleQrScan(code: string) {
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
        className="rounded-r-lg w-18 h-8 text-base font-bold border-1"
        onClick={() => {
          window.location.href = "/jigsaw";
        }}
      >
        {t("jigsaw.scan.cancelButton")}
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
