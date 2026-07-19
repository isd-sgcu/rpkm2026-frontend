import { atom } from "nanostores";

import { getGameProgress } from "@lib/api/games";

/** Total number of jigsaw pieces the user can collect. */
export const TOTAL_PIECES = 10;

/** Piece ids run from 1..TOTAL_PIECES, matching the board slots. */
export type PieceId = number;

/**
 * Backend `checkpoints.id` for each board slot (1..TOTAL_PIECES, index 0 ->
 * piece 1), fixed by seeding the checkpoints with these exact UUIDs. Safe to
 * ship in the client bundle — unlike the QR `code`, a checkpoint's id alone
 * can't be used to fake a scan (the backend still requires the matching code
 * and a device position inside its geofence).
 */
const PIECE_CHECKPOINT_IDS: readonly string[] = [
  "a0000000-0000-0000-0000-000000000001",
  "a0000000-0000-0000-0000-000000000002",
  "a0000000-0000-0000-0000-000000000003",
  "a0000000-0000-0000-0000-000000000004",
  "a0000000-0000-0000-0000-000000000005",
  "a0000000-0000-0000-0000-000000000006",
  "a0000000-0000-0000-0000-000000000007",
  "a0000000-0000-0000-0000-000000000008",
  "a0000000-0000-0000-0000-000000000009",
  "a0000000-0000-0000-0000-00000000000a",
];

/** Maps a backend checkpoint id to its board slot (1..TOTAL_PIECES); null if unrecognized. */
export function pieceIdFromCheckpointId(checkpointId: string): PieceId | null {
  const index = PIECE_CHECKPOINT_IDS.indexOf(checkpointId);
  return index === -1 ? null : index + 1;
}

/** Ids of the pieces the user has already found, sorted ascending. */
export const $foundPieces = atom<PieceId[]>([]);

/** ISO timestamp of when each found piece was collected, keyed by piece id. */
export const $collectedAt = atom<Record<PieceId, string>>({});

/** Load the authenticated user's collected pieces from the backend (call once on mount). */
export async function syncProgress(): Promise<void> {
  const progress = await getGameProgress("jigsaw");
  const found: PieceId[] = [];
  const times: Record<PieceId, string> = {};
  for (const checkpoint of progress.collected) {
    const id = pieceIdFromCheckpointId(checkpoint.checkpointId);
    if (id === null) continue;
    found.push(id);
    times[id] = checkpoint.scannedAt;
  }
  found.sort((a, b) => a - b);
  $foundPieces.set(found);
  $collectedAt.set(times);
}

/**
 * Mark a piece as found, e.g. right after a successful scan, so the UI updates
 * without waiting on a fresh {@link syncProgress} round-trip. No-op if the id
 * is out of range or already found.
 */
export function markPieceFound(
  id: PieceId,
  collectedAt: string = new Date().toISOString(),
) {
  if (id < 1 || id > TOTAL_PIECES) return;
  const current = $foundPieces.get();
  if (current.includes(id)) return;
  $foundPieces.set([...current, id].sort((a, b) => a - b));
  $collectedAt.set({ ...$collectedAt.get(), [id]: collectedAt });
}

const PENDING_SCAN_KEY = "jigsaw-pending-scan";

/**
 * Outcome of a scan, handed from the scan page to the jigsaw page so the latter
 * can show the matching pop-up after the redirect.
 */
export type PendingScan =
  | {
      status: "success";
      pieceId: PieceId;
      /** ISO timestamp of when the piece was collected. */
      receivedAt: string;
    }
  | { status: "fail" };

/**
 * Remember the result of a scan so the jigsaw page can show its pop-up once the
 * scan flow navigates there. Uses sessionStorage so it survives the redirect
 * but not a fresh visit.
 */
export function setPendingScan(scan: PendingScan) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_SCAN_KEY, JSON.stringify(scan));
}

/**
 * Read and clear the pending scan result. Returns null when there is none or
 * the stored value is malformed.
 */
export function takePendingScan(): PendingScan | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(PENDING_SCAN_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(PENDING_SCAN_KEY);
  try {
    const parsed = JSON.parse(raw) as PendingScan;
    if (parsed?.status === "fail") return { status: "fail" };
    if (
      parsed?.status === "success" &&
      typeof parsed.pieceId === "number" &&
      typeof parsed.receivedAt === "string"
    ) {
      return {
        status: "success",
        pieceId: parsed.pieceId,
        receivedAt: parsed.receivedAt,
      };
    }
  } catch {
    // fall through to null
  }
  return null;
}
