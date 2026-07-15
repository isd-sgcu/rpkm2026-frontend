import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { RotateCcw } from "lucide-react";

import { JigsawBoard } from "./JigsawBoard";
import { JigsawProgress } from "./JigsawProgress";
import { JigsawRewardDialog } from "./JigsawRewardDialog";
import {
  $foundPieces,
  resetPieces,
  syncStoredPieces,
  takePendingReward,
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
  const [rewardAt, setRewardAt] = useState<Date | null>(null);

  useEffect(() => {
    syncStoredPieces();
    // If we just arrived from a successful scan, show the reward pop-up. This
    // reads client-only navigation state, so it must happen after mount (not in
    // a render-time initializer) to keep the SSR'd markup and hydration in sync.
    const pending = takePendingReward();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time post-mount read of a client-only reward handoff
    if (pending) setRewardAt(new Date(pending.receivedAt));
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

      <JigsawRewardDialog
        open={rewardAt !== null}
        onOpenChange={(open) => {
          if (!open) setRewardAt(null);
        }}
        receivedAt={rewardAt}
      />
    </div>
  );
}
