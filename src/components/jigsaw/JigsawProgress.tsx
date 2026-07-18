import { useStore } from "@nanostores/react";

import { $foundPieces, TOTAL_PIECES } from "./jigsawState";

/**
 * Progress bar that fills dynamically according to how many jigsaw pieces the
 * user has collected.
 */
export function JigsawProgress() {
  const found = useStore($foundPieces);
  const count = found.length;
  const percent = Math.round((count / TOTAL_PIECES) * 100);

  return (
    <div className="relative w-[268px] h-[25px] overflow-hidden rounded-2xl border-1 border-foreground text-sm">
      {/* Yellow fill: grows left-to-right with progress. The container owns the
          outer border; the fill only draws a border on its right edge (the
          moving cap), so nothing doubles up on the left/top/bottom. */}
      <div
        className="absolute inset-y-0 left-0 rounded-r-2xl border-r border-foreground bg-rpkm-yellow transition-[width]"
        style={{ width: `${percent}%` }}
        role="progressbar"
        aria-valuenow={count}
        aria-valuemin={0}
        aria-valuemax={TOTAL_PIECES}
      />
      {/* Label centred over the whole bar. */}
      <span className="absolute inset-0 flex items-center justify-center text-base font-normal whitespace-nowrap">
        คุณเก็บได้แล้ว {count}/{TOTAL_PIECES} ชิ้น
      </span>
    </div>
  );
}
