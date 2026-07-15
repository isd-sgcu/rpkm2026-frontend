import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { ScanLine, CircleAlert, LogIn } from "lucide-react";

import { Button } from "@components/ui/button";
import {
  $foundPieces,
  markPieceFound,
  setPendingScan,
  syncStoredPieces,
  TOTAL_PIECES,
} from "./jigsawState";

/**
 * Scan page panel. Real QR scanning is not wired up yet, so these buttons are
 * placeholder tests for the scan outcomes: a success awards the next uncollected
 * piece; a login-required scan finds a piece but defers saving it until the user
 * logs in; a failure awards nothing. Each records the result and navigates to
 * the jigsaw page, which shows the matching pop-up on arrival.
 * TODO: replace the simulated scans with the result of a real QR scan.
 */
export function JigsawScanPanel() {
  const found = useStore($foundPieces);

  useEffect(() => {
    syncStoredPieces();
  }, []);

  const allFound = found.length >= TOTAL_PIECES;

  function handleScanSuccess() {
    const nextPiece = Array.from(
      { length: TOTAL_PIECES },
      (_, i) => i + 1,
    ).find((id) => !found.includes(id));
    if (nextPiece === undefined) return;

    markPieceFound(nextPiece);
    setPendingScan({
      status: "success",
      pieceId: nextPiece,
      receivedAt: new Date().toISOString(),
    });
    // Redirect to the jigsaw page, which shows the reward pop-up on arrival.
    window.location.href = "/jigsaw";
  }

  function handleScanLoginRequired() {
    const nextPiece = Array.from(
      { length: TOTAL_PIECES },
      (_, i) => i + 1,
    ).find((id) => !found.includes(id));
    if (nextPiece === undefined) return;

    // Do not award yet — the piece is saved only after the user logs in.
    setPendingScan({
      status: "login-required",
      pieceId: nextPiece,
      receivedAt: new Date().toISOString(),
    });
    // Redirect to the jigsaw page, which shows the login-required pop-up.
    window.location.href = "/jigsaw";
  }

  function handleScanFail() {
    setPendingScan({ status: "fail" });
    // Redirect to the jigsaw page, which shows the failure pop-up on arrival.
    window.location.href = "/jigsaw";
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <Button
        variant="green"
        size="xl"
        onClick={handleScanSuccess}
        disabled={allFound}
        iconStart={<ScanLine />}
      >
        {allFound ? "เก็บครบทุกชิ้นแล้ว" : "สแกนเพื่อรับชิ้นส่วน (จำลอง)"}
      </Button>

      <Button
        variant="outline"
        size="xl"
        onClick={handleScanLoginRequired}
        disabled={allFound}
        iconStart={<LogIn />}
      >
        จำลองสแกน (ต้องเข้าสู่ระบบ)
      </Button>

      <Button
        variant="outline"
        size="xl"
        onClick={handleScanFail}
        iconStart={<CircleAlert />}
      >
        จำลองสแกนไม่สำเร็จ
      </Button>
    </div>
  );
}
