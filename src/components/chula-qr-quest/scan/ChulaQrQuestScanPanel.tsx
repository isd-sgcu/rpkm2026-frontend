import { useState } from "react";
import { ScanLine } from "lucide-react";
import { Button } from "@components/ui/button";
import { useT } from "@lib/i18n/useT";
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

  // TODO: replace with a real camera/QR scanning integration that calls the API
  function simulateScanSuccess() {
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

  function simulateScanFail() {
    setResult({ status: "fail" });
  }

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold text-center">
        {t("chulaQrQuest.scan.title")}
      </h1>

      <div className="flex aspect-square w-full max-w-70 items-center justify-center rounded-3xl border border-foreground bg-muted">
        <ScanLine className="size-16 text-muted-foreground" />
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="green" onClick={simulateScanSuccess}>
          Simulate success
        </Button>
        <Button type="button" variant="destructive" onClick={simulateScanFail}>
          Simulate fail
        </Button>
      </div>

      <ChulaQrQuestScanResultDialog
        open={result !== null}
        onOpenChange={(open) => !open && setResult(null)}
        result={result}
      />
    </div>
  );
};

export default ChulaQrQuestScanPanel;
