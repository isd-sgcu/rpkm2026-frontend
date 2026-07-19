import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import {
  JigsawScanResultDialog,
  type JigsawScanResult,
} from "./JigsawScanResultDialog";
import { syncStoredPieces } from "./jigsawState";
import { collectScannedJigsaw } from "./jigsawScanFlow";

/**
 * Landing component for the `/jigsaw/<pointId>?code=<code>` deep link — the URL
 * an external scanner (the phone's camera app) opens. Reads the code from the
 * query, collects the piece, and sends the user to the jigsaw page with the
 * reward pop-up; an invalid code shows the fail pop-up instead.
 */
export function JigsawCollect({ pointId }: { pointId: string }) {
  const [result, setResult] = useState<JigsawScanResult | null>(null);

  useEffect(() => {
    syncStoredPieces();
    const code = new URLSearchParams(window.location.search).get("code") ?? "";
    // Rebuild the canonical QR URL so the validator works regardless of which
    // host actually served this page (e.g. localhost while testing).
    const url = `https://rpkm2026.com/jigsaw/${pointId}?code=${encodeURIComponent(code)}`;
    if (collectScannedJigsaw(url)) {
      window.location.href = "/jigsaw";
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time deep-link collect on mount
      setResult({ status: "fail" });
    }
  }, [pointId]);

  return (
    <div className="grid min-h-[60vh] w-full place-items-center">
      <Loader2 className="size-8 animate-spin text-foreground" />
      <JigsawScanResultDialog
        open={result !== null}
        onOpenChange={(open) => {
          if (!open) window.location.href = "/jigsaw";
        }}
        result={result}
      />
    </div>
  );
}
