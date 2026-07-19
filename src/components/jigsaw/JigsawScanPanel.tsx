import { useRef, useState } from "react";
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
import { setPendingScan } from "./jigsawState";
import {
  collectJigsawCode,
  describeJigsawCollectError,
  extractJigsawCode,
} from "./jigsawScanFlow";
import { useT } from "@lib/i18n/useT";

/**
 * Scan page panel. Shows the live QR scanner and an image-upload fallback; a
 * successful scan runs the shared collect flow and redirects to the jigsaw
 * page, which shows the matching pop-up on arrival.
 */
export function JigsawScanPanel() {
  const t = useT();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  // Result of the last scan, driving the fail pop-up (success redirects away).
  const [scanResult, setScanResult] = useState<JigsawScanResult | null>(null);
  // Guards against the camera re-emitting the same code every scanDelay.
  const lastCameraCodeRef = useRef<string | null>(null);

  async function handleQrScan(rawUrl: string) {
    if (busy) return;
    const code = extractJigsawCode(rawUrl);
    if (!code) {
      setScanResult({ status: "fail" });
      return;
    }

    setBusy(true);
    const outcome = await collectJigsawCode(code);
    setBusy(false);

    if (outcome.status === "success") {
      setPendingScan({
        status: "success",
        pieceId: outcome.pieceId,
        receivedAt: outcome.receivedAt,
      });
      window.location.href = "/jigsaw";
      return;
    }
    // Location errors surface as a toast (matches the Chula QR Quest scanner)
    // so the camera view stays visible instead of being covered by a dialog.
    if (
      outcome.error === "location-unsupported" ||
      outcome.error === "location-denied"
    ) {
      toast.error(t("jigsaw.scan.locationRequired"));
      return;
    }
    setScanResult({
      status: "fail",
      ...describeJigsawCollectError(outcome.error, t),
    });
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

    setBusy(true);
    try {
      const { BarcodeDetector } = await import("barcode-detector/ponyfill");
      const detector = new BarcodeDetector({ formats: ["qr_code"] });
      const [barcode] = await detector.detect(file);
      if (barcode?.rawValue) {
        setBusy(false);
        await handleQrScan(barcode.rawValue);
      } else {
        setBusy(false);
        toast.error(t("jigsaw.scan.uploadNoQrFound"));
      }
    } catch {
      setBusy(false);
      toast.error(t("jigsaw.scan.uploadReadError"));
    }
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <h1 className="text-3xl font-bold text-center">
        {t("jigsaw.scan.title")}
      </h1>

      {/* Live QR scanner (replicated from the staff ScanEntryForm). */}
      <div className="relative isolate w-full overflow-hidden rounded-[1.8rem] border border-black bg-rpkm-light-green p-4">
        <MonotoneNoise
          noiseSize={4}
          noiseDensity={12}
          className="pointer-events-none absolute inset-0 -z-1"
        />
        <QrScanner
          className="rounded-2xl"
          paused={scanResult !== null || busy}
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
        className="rounded-r-lg w-41.75 h-8.25 text-base font-bold border bg-[#FBE200]"
        onClick={() => fileInputRef.current?.click()}
        disabled={busy}
        iconStart={
          busy ? <Loader2 className="animate-spin" /> : <CloudUpload />
        }
      >
        {t("jigsaw.scan.uploadButton")}
      </Button>

      {/* Cancel: return to the jigsaw page. */}
      <Button
        variant="outline"
        size="lg"
        className="rounded-r-lg w-18 h-8 text-base font-bold border"
        onClick={() => {
          window.location.href = "/jigsaw";
        }}
      >
        {t("jigsaw.scan.cancelButton")}
      </Button>

      {/* Fail pop-up for the scan result (success redirects to /jigsaw instead). */}
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
