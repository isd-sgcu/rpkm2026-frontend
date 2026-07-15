import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { ScanLine, CircleAlert, LogIn } from "lucide-react";

import { Button } from "@components/ui/button";
import { Toaster } from "@components/ui/sonner";
import { CameraTroubleshoot } from "@components/shared/CameraTroubleshootDialog";
import { MonotoneNoise } from "@components/shared/MonotoneNoise";
import { QrScanner } from "@components/shared/QrCodeScanner";
import {
  $foundPieces,
  markPieceFound,
  setPendingScan,
  syncStoredPieces,
  TOTAL_PIECES,
} from "./jigsawState";

/**
 * Scan page panel. Shows the live QR scanner; a successful scan just logs its
 * contents for now (the collection flow isn't wired to it yet). The buttons
 * below are placeholder tests for the scan outcomes: a success awards the next
 * uncollected piece; a login-required scan finds a piece but defers saving it
 * until the user logs in; a failure awards nothing. Each records the result and
 * navigates to the jigsaw page, which shows the matching pop-up on arrival.
 * TODO: route the real QR scan result into the collection flow.
 */
export function JigsawScanPanel() {
  const found = useStore($foundPieces);

  useEffect(() => {
    syncStoredPieces();
  }, []);

  const allFound = found.length >= TOTAL_PIECES;

  function handleQrScan(code: string) {
    // No collection flow yet — just surface the scanned contents.
    console.log("Jigsaw QR scanned:", code);
  }

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
      {/* Live QR scanner (replicated from the staff ScanEntryForm). */}
      <div className="relative isolate w-full overflow-hidden rounded-[1.8rem] border border-black bg-rpkm-light-green p-4">
        <MonotoneNoise
          noiseSize={4}
          noiseDensity={12}
          className="pointer-events-none absolute inset-0 -z-1"
        />
        <QrScanner className="rounded-2xl" onScan={handleQrScan} />
      </div>
      <CameraTroubleshoot className="-mt-1 text-foreground" />

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

      <Toaster />
    </div>
  );
}
