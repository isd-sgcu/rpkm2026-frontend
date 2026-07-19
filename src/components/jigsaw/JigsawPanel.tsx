import { useEffect, useState } from "react";

import { JigsawBoard } from "./JigsawBoard";
import { JigsawProgress } from "./JigsawProgress";
import {
  JigsawScanResultDialog,
  type JigsawScanResult,
} from "./JigsawScanResultDialog";
import { syncProgress, takePendingScan } from "./jigsawState";

/**
 * Interactive jigsaw collection panel: the board of slots plus the progress
 * bar, both driven by the shared jigsaw store so they stay in sync as pieces
 * are found. Collected pieces are synced from the backend on mount.
 */
export function JigsawPanel() {
  const [scanResult, setScanResult] = useState<JigsawScanResult | null>(null);

  useEffect(() => {
    syncProgress();
    // If we just arrived from a scan, show the matching pop-up. This reads
    // client-only navigation state, so it must happen after mount (not in a
    // render-time initializer) to keep the SSR'd markup and hydration in sync.
    const pending = takePendingScan();
    if (pending?.status === "success") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time post-mount read of a client-only scan handoff
      setScanResult({
        status: "success",
        pieceId: pending.pieceId,
        receivedAt: new Date(pending.receivedAt),
      });
    } else if (pending?.status === "fail") {
      setScanResult({ status: "fail" });
    }
  }, []);

  return (
    <div className="flex items-center w-full flex-col gap-6">
      <JigsawBoard />
      <JigsawProgress />

      <JigsawScanResultDialog
        open={scanResult !== null}
        onOpenChange={(open) => {
          if (!open) setScanResult(null);
        }}
        result={scanResult}
      />
    </div>
  );
}
