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

const PENDING_REWARD_KEY = "jigsaw-pending-reward";

export interface PendingReward {
  pieceId: PieceId;
  /** ISO timestamp of when the piece was collected. */
  receivedAt: string;
}

/**
 * Remember a freshly-scanned piece so the jigsaw page can show its reward
 * pop-up once the scan flow navigates there. Uses sessionStorage so it survives
 * the redirect but not a fresh visit.
 */
export function setPendingReward(reward: PendingReward) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_REWARD_KEY, JSON.stringify(reward));
}

/**
 * Read and clear the pending reward. Returns null when there is none or the
 * stored value is malformed.
 */
export function takePendingReward(): PendingReward | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(PENDING_REWARD_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(PENDING_REWARD_KEY);
  try {
    const parsed = JSON.parse(raw) as Partial<PendingReward>;
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
