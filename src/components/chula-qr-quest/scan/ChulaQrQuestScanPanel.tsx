import { useRef, useState } from "react";
import { CloudUpload } from "lucide-react";
import { BarcodeDetector } from "barcode-detector/ponyfill";
import { Button, buttonVariants } from "@components/ui/button";
import { cn } from "@lib/utils";
import { useT } from "@lib/i18n/useT";
import { QrScanner } from "@components/shared/QrCodeScanner";
import { CameraTroubleshoot } from "@components/shared/CameraTroubleshootDialog";
import positions from "@components/chula-qr-quest/position.json";
import {
  ChulaQrQuestScanResultDialog,
  type ScanResult,
} from "@components/chula-qr-quest/scan/ChulaQrQuestScanResultDialog";

interface StampPosition {
  id: string;
  name: string;
  lat: number;
  lng: number;
  collected: boolean;
}

const stampPositions = positions as StampPosition[];

const ChulaQrQuestScanPanel = () => {
  const t = useT();
  const [result, setResult] = useState<ScanResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // TODO: replace with a real API call that validates the scanned code and
  // reports which stamp (if any) was collected.
  function handleCode(_code: string) {
    console.log(_code);
    if (result) return;
    const target =
      stampPositions.find((p) => !p.collected) ?? stampPositions[0];
    const collectedCount = stampPositions.filter((p) => p.collected).length + 1;
    setResult({
      status: "success",
      shopName: target.name,
      collectedCount,
      totalCount: stampPositions.length,
      collectedAt: new Date(),
    });
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const detector = new BarcodeDetector({ formats: ["qr_code"] });
    const codes = await detector.detect(file).catch(() => []);
    const code = codes[0]?.rawValue;

    if (!code) {
      setResult({ status: "fail" });
      return;
    }
    handleCode(code);
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
          paused={result !== null}
          onScan={handleCode}
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
        onClick={() => fileInputRef.current?.click()}
        iconStart={<CloudUpload className="size-4" />}
      >
        {t("chulaQrQuest.scan.uploadImage")}
      </Button>

      <a
        href="/chula-qr-quest"
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
