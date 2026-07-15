import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { ScanLine } from "lucide-react";

import { Button } from "@components/ui/button";
import {
  $foundPieces,
  markPieceFound,
  setPendingReward,
  syncStoredPieces,
  TOTAL_PIECES,
} from "./jigsawState";

/**
 * Scan page panel. Real QR scanning is not wired up yet, so the button
 * simulates a successful scan by awarding the next uncollected piece, then
 * navigates to the jigsaw page where the reward pop-up is shown. Collected
 * pieces persist via the shared jigsaw store.
 * TODO: replace the simulated scan with the result of a real QR scan.
 */
export function JigsawScanPanel() {
  const found = useStore($foundPieces);

  useEffect(() => {
    syncStoredPieces();
  }, []);

  const allFound = found.length >= TOTAL_PIECES;

  function handleScan() {
    const nextPiece = Array.from(
      { length: TOTAL_PIECES },
      (_, i) => i + 1,
    ).find((id) => !found.includes(id));
    if (nextPiece === undefined) return;

    markPieceFound(nextPiece);
    setPendingReward({
      pieceId: nextPiece,
      receivedAt: new Date().toISOString(),
    });
    // Redirect to the jigsaw page, which shows the reward pop-up on arrival.
    window.location.href = "/jigsaw";
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <Button
        variant="green"
        size="xl"
        onClick={handleScan}
        disabled={allFound}
        iconStart={<ScanLine />}
      >
        {allFound ? "เก็บครบทุกชิ้นแล้ว" : "สแกนเพื่อรับชิ้นส่วน (จำลอง)"}
      </Button>
    </div>
  );
}
