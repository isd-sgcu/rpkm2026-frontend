import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { RotateCcw } from "lucide-react";

import { JigsawBoard } from "./JigsawBoard";
import { JigsawProgress } from "./JigsawProgress";
import {
  $foundPieces,
  resetPieces,
  syncStoredPieces,
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

  useEffect(() => {
    syncStoredPieces();
  }, []);

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
    </div>
  );
}
