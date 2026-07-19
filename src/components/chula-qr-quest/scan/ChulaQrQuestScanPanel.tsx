import positions from "@components/chula-qr-quest/position.json";
import {
  ChulaQrQuestScanResultDialog,
  type ScanResult,
} from "@components/chula-qr-quest/scan/ChulaQrQuestScanResultDialog";
import { CameraTroubleshoot } from "@components/shared/CameraTroubleshootDialog";
import { QrScanner } from "@components/shared/QrCodeScanner";
import { Button, buttonVariants } from "@components/ui/button";
import { collectCheckpoint, getGameProgress } from "@lib/api/games";
import { APIError } from "@lib/client";
import { $locale } from "@lib/i18n/locale";
import { useT } from "@lib/i18n/useT";
import { cn } from "@lib/utils";
import { useStore } from "@nanostores/react";
import { BarcodeDetector } from "barcode-detector/ponyfill";
import { CloudUpload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface StampPosition {
  id: string;
  nameTh: string;
  nameEn: string;
  lat: number;
  lng: number;
}

const stampPositions = positions as StampPosition[];

const QR_URL_PATTERN =
  /^(?:https:\/\/rpkm2026\.com|http:\/\/localhost:4321)\/qrquest\/quest\d+(?:\?|$)/;

function extractCode(scanned: string): string | null {
  if (!QR_URL_PATTERN.test(scanned)) return null;
  try {
    return new URL(scanned).searchParams.get("code");
  } catch {
    return null;
  }
}

function extractCodeFromLocation(search: string): string | null {
  return new URLSearchParams(search).get("code");
}

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("unsupported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
    });
  });
}

const ChulaQrQuestScanPanel = () => {
  const t = useT();
  const locale = useStore($locale);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const code = extractCodeFromLocation(window.location.search);
    if (code) {
      // Drop ?code=... so a refresh or back-nav does not re-submit it.
      window.history.replaceState(null, "", window.location.pathname);
      submitScan(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submitScan(code: string) {
    if (result || busy) return;
    setBusy(true);
    try {
      const devicePosition = await getCurrentPosition();
      const collected = await collectCheckpoint("csr", {
        code,
        lat: devicePosition.coords.latitude,
        lng: devicePosition.coords.longitude,
      });
      const progress = await getGameProgress("csr");
      const place = stampPositions.find((p) => p.id === collected.checkpointId);

      setResult({
        status: "success",
        shopName: place
          ? locale === "th"
            ? place.nameTh
            : place.nameEn
          : collected.code,
        collectedCount: progress.collected.length,
        totalCount: stampPositions.length,
        collectedAt: new Date(collected.scannedAt),
      });
    } catch (err) {
      if (err instanceof Error && err.message === "unsupported") {
        toast.error(t("chulaQrQuest.scan.locationRequired"));
      } else if (
        err &&
        typeof err === "object" &&
        "code" in err &&
        typeof (err as { code: unknown }).code === "number"
      ) {
        // GeolocationPositionError
        toast.error(t("chulaQrQuest.scan.locationRequired"));
      } else if (err instanceof APIError) {
        switch (err.code) {
          case "ALREADY_COLLECTED":
            setResult({
              status: "fail",
              title: t("chulaQrQuest.scan.alreadyCollectedTitle"),
              message: t("chulaQrQuest.scan.alreadyCollectedMessage"),
            });
            break;
          case "GAME_CLOSED":
            setResult({
              status: "fail",
              message: t("chulaQrQuest.scan.errorGameClosed"),
            });
            break;
          case "OUT_OF_GEOFENCE":
            setResult({
              status: "fail",
              message: t("chulaQrQuest.scan.errorOutOfGeofence"),
            });
            break;
          case "INVALID_CHECKPOINT":
            setResult({
              status: "fail",
              message: t("chulaQrQuest.scan.errorInvalidCheckpoint"),
            });
            break;
          case "NOT_FRESHMEN":
            setResult({
              status: "fail",
              message: t("chulaQrQuest.scan.errorNotFreshmen"),
            });
            break;
          default:
            setResult({ status: "fail" });
        }
      } else {
        setResult({ status: "fail" });
      }
    } finally {
      setBusy(false);
    }
  }

  function handleScan(scanned: string) {
    if (busy || result) return;
    const code = extractCode(scanned);
    if (!code) {
      setResult({ status: "fail" });
      return;
    }
    submitScan(code);
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const detector = new BarcodeDetector({ formats: ["qr_code"] });
    const codes = await detector.detect(file).catch(() => []);
    const scanned = codes[0]?.rawValue;

    if (!scanned) {
      setResult({ status: "fail" });
      return;
    }
    handleScan(scanned);
  }

  function closeResult() {
    setResult(null);
  }

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold text-center">
        {t("chulaQrQuest.scan.title")}
      </h1>

      <div className="relative isolate w-full max-w-70 overflow-hidden rounded-3xl border border-foreground p-4 mb-8">
        <QrScanner
          className="rounded-2xl"
          paused={result !== null || busy}
          loading={busy}
          onScan={handleScan}
        />
      </div>
      <CameraTroubleshoot />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />
      <Button
        type="button"
        variant="default"
        className="rounded-full"
        disabled={busy}
        onClick={() => fileInputRef.current?.click()}
        iconStart={<CloudUpload className="size-4" />}
      >
        {t("chulaQrQuest.scan.uploadImage")}
      </Button>

      <a
        href="/qrquest"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "rounded-full",
        )}
      >
        {t("chulaQrQuest.scan.cancel")}
      </a>

      <ChulaQrQuestScanResultDialog
        open={result !== null}
        onOpenChange={(open) => !open && closeResult()}
        result={result}
      />
    </div>
  );
};

export default ChulaQrQuestScanPanel;
