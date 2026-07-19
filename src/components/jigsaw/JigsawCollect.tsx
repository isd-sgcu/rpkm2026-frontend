import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import {
  JigsawScanResultDialog,
  type JigsawScanResult,
} from "./JigsawScanResultDialog";
import { setPendingScan } from "./jigsawState";
import {
  collectJigsawCode,
  describeJigsawCollectError,
} from "./jigsawScanFlow";
import { useT } from "@lib/i18n/useT";

/**
 * Landing component for the `/jigsaw/<pointId>?code=<code>` deep link — the URL
 * an external scanner (the phone's camera app) opens. Reads the code from the
 * query, collects the piece, and sends the user to the jigsaw page with the
 * reward pop-up; an invalid code shows the fail pop-up instead.
 */
export function JigsawCollect({ pointId }: { pointId: string }) {
  const t = useT();
  const [result, setResult] = useState<JigsawScanResult | null>(null);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time deep-link collect on mount
      setResult({ status: "fail" });
      return;
    }

    collectJigsawCode(code).then((outcome) => {
      if (outcome.status === "success") {
        setPendingScan({
          status: "success",
          pieceId: outcome.pieceId,
          receivedAt: outcome.receivedAt,
        });
        window.location.href = "/jigsaw";
        return;
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time deep-link collect on mount
      setResult({
        status: "fail",
        ...describeJigsawCollectError(outcome.error, t),
      });
    });
  }, [pointId, t]);

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
