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
    <div className="flex w-full items-center gap-2 rounded-full border-2 border-dashed border-gray-400 px-4 py-2 text-sm">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-rpkm-green transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={TOTAL_PIECES}
        />
      </div>
      <span className="text-base font-normal whitespace-nowrap">
        {count}/{TOTAL_PIECES} ชิ้น
      </span>
    </div>
  );
}
