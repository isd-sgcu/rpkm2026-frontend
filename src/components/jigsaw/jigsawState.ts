import { atom } from "nanostores";

/** Total number of jigsaw pieces the user can collect. */
export const TOTAL_PIECES = 10;

/** Piece ids run from 1..TOTAL_PIECES, matching the board slots. */
export type PieceId = number;

const STORAGE_KEY = "jigsaw-found-pieces";

function readStoredPieces(): PieceId[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (id): id is number =>
          typeof id === "number" && id >= 1 && id <= TOTAL_PIECES,
      )
      .sort((a, b) => a - b);
  } catch {
    return [];
  }
}

/** Ids of the pieces the user has already found, sorted ascending. */
export const $foundPieces = atom<PieceId[]>([]);

function persist(pieces: PieceId[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pieces));
}

/** Load persisted progress into the store (call once on mount). */
export function syncStoredPieces() {
  const stored = readStoredPieces();
  const current = $foundPieces.get();
  if (
    stored.length !== current.length ||
    stored.some((id, i) => id !== current[i])
  ) {
    $foundPieces.set(stored);
  }
}

/**
 * Mark a piece as found. Called after the user successfully scans the QR code
 * for that specific piece. No-op if the id is out of range or already found.
 */
export function markPieceFound(id: PieceId) {
  if (id < 1 || id > TOTAL_PIECES) return;
  const current = $foundPieces.get();
  if (current.includes(id)) return;
  const next = [...current, id].sort((a, b) => a - b);
  $foundPieces.set(next);
  persist(next);
}

/** Clear all collected pieces (useful for testing the flow). */
export function resetPieces() {
  $foundPieces.set([]);
  persist([]);
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
  | {
      // The scan found a piece, but the user must log in before it can be saved.
      status: "login-required";
      pieceId: PieceId;
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
      (parsed?.status === "success" || parsed?.status === "login-required") &&
      typeof parsed.pieceId === "number" &&
      typeof parsed.receivedAt === "string"
    ) {
      return {
        status: parsed.status,
        pieceId: parsed.pieceId,
        receivedAt: parsed.receivedAt,
      };
    }
  } catch {
    // fall through to null
  }
  return null;
}

const PENDING_CLAIM_KEY = "jigsaw-pending-claim";

export interface PendingClaim {
  pieceId: PieceId;
  receivedAt: string;
}

/**
 * Remember a piece the user found but could not yet save because they needed to
 * log in. Uses localStorage (not sessionStorage) so it survives the round-trip
 * out to the Google login page and back. The jigsaw page awards it once the
 * user is authenticated.
 */
export function setPendingClaim(claim: PendingClaim) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PENDING_CLAIM_KEY, JSON.stringify(claim));
}

/** Read and clear the pending claim. Returns null when there is none or it is malformed. */
export function takePendingClaim(): PendingClaim | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PENDING_CLAIM_KEY);
  if (!raw) return null;
  localStorage.removeItem(PENDING_CLAIM_KEY);
  try {
    const parsed = JSON.parse(raw) as Partial<PendingClaim>;
    if (
      typeof parsed?.pieceId === "number" &&
      typeof parsed?.receivedAt === "string"
    ) {
      return { pieceId: parsed.pieceId, receivedAt: parsed.receivedAt };
    }
  } catch {
    // fall through to null
  }
  return null;
}
