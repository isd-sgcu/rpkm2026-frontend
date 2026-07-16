import { validateTestJigsawQr } from "./jigsawTestScan";
import { $collectedAt, markPieceFound, setPendingScan } from "./jigsawState";

/**
 * Shared collect flow used by both the in-app QR scanner and the
 * `/jigsaw/<pointId>?code=<code>` deep link (the URL an external scanner — the
 * phone's camera app — opens).
 *
 * Validates a scanned jigsaw QR URL and, when valid, collects the piece and
 * queues the success pop-up for the jigsaw page. `markPieceFound` is a no-op
 * when the piece is already collected, so the stored time stays the FIRST-scan
 * time. Returns true on success, false when the QR is invalid.
 *
 * ⚠️ TESTING ONLY: verification runs on the client via {@link validateTestJigsawQr}.
 * Before production, replace that single step with a backend call (which makes
 * this function async) so codes are validated server-side and the piece is
 * stored in the database instead of localStorage.
 */
export function collectScannedJigsaw(rawUrl: string): boolean {
  // ⚠️ TESTING ONLY — swap for the backend verify + collect call.
  const scan = validateTestJigsawQr(rawUrl);
  if (!scan) return false;

  const pieceId = Number(scan.pointId.replace(/\D/g, ""));
  markPieceFound(pieceId, new Date().toISOString());
  const receivedAt = $collectedAt.get()[pieceId] ?? new Date().toISOString();
  setPendingScan({ status: "success", pieceId, receivedAt });
  return true;
}
