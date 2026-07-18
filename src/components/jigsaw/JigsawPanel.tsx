import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { RotateCcw } from "lucide-react";

import { useSession } from "@lib/auth/useSession";
import { JigsawBoard } from "./JigsawBoard";
import { JigsawProgress } from "./JigsawProgress";
import {
  JigsawScanResultDialog,
  type JigsawScanResult,
} from "./JigsawScanResultDialog";
import {
  $foundPieces,
  markPieceFound,
  resetPieces,
  syncStoredPieces,
  takePendingClaim,
  takePendingScan,
  // TOTAL_PIECES,
} from "./jigsawState";

/**
 * Interactive jigsaw collection panel: the board of slots plus the progress
 * bar, both driven by the shared jigsaw store so they stay in sync as pieces
 * are found. Collected pieces persist in localStorage across visits (including
 * the scan page).
 */
export function JigsawPanel() {
  const found = useStore($foundPieces);
  // const isComplete = found.length >= TOTAL_PIECES;
  const [scanResult, setScanResult] = useState<JigsawScanResult | null>(null);
  const session = useSession();

  useEffect(() => {
    syncStoredPieces();
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
    } else if (pending?.status === "login-required") {
      setScanResult({
        status: "login-required",
        pieceId: pending.pieceId,
        receivedAt: new Date(pending.receivedAt),
      });
    } else if (pending?.status === "fail") {
      setScanResult({ status: "fail" });
    }
  }, []);

  // After returning from login, save the piece the user found beforehand and
  // show its reward pop-up.
  useEffect(() => {
    if (session.status !== "authenticated") return;
    const claim = takePendingClaim();
    if (!claim) return;
    markPieceFound(claim.pieceId, claim.receivedAt);
    // TODO: also persist the collected piece to the backend once a jigsaw API exists.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time post-login award of a client-only claim
    setScanResult({
      status: "success",
      pieceId: claim.pieceId,
      receivedAt: new Date(claim.receivedAt),
    });
  }, [session.status]);

  return (
    <div className="flex w-full flex-col gap-6">
      <JigsawBoard />
      <JigsawProgress />

      {found.length > 0 && (
        <button
          type="button"
          onClick={resetPieces}
          className="flex items-center justify-center gap-1 self-center text-sm text-gray-400 hover:text-gray-600"
        >
          <RotateCcw className="size-3.5" />
          รีเซ็ต
        </button>
      )}

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
