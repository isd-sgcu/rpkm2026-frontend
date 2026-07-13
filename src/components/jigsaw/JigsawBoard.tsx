import { useStore } from "@nanostores/react";
import { Check } from "lucide-react";

import { $foundPieces, markPieceFound, TOTAL_PIECES } from "./jigsawState";

/**
 * The 5x2 board of jigsaw slots. A found piece is shown as a filled placeholder
 * (the real artwork image is not available yet); empty slots stay dashed.
 *
 * Until the QR scan flow is wired up, tapping an empty slot simulates scanning
 * that piece so the fill + progress behaviour can be demonstrated.
 * TODO: replace the onClick simulation with the result of a real QR scan.
 */
export function JigsawBoard() {
  const found = useStore($foundPieces);
  const foundSet = new Set(found);

  return (
    <div className="grid w-full grid-cols-5 grid-rows-2 gap-3">
      {Array.from({ length: TOTAL_PIECES }).map((_, i) => {
        const pieceId = i + 1;
        const isFound = foundSet.has(pieceId);

        if (isFound) {
          return (
            <div
              key={pieceId}
              data-piece={pieceId}
              className="relative flex aspect-[3/2] items-center justify-center rounded-sm border-2 border-solid border-rpkm-green bg-rpkm-green/80 text-white"
              aria-label={`ชิ้นที่ ${pieceId} (พบแล้ว)`}
            >
              <Check className="size-5" strokeWidth={3} />
              <span className="absolute bottom-0.5 right-1 text-[0.6rem] font-bold leading-none">
                {pieceId}
              </span>
            </div>
          );
        }

        return (
          <button
            key={pieceId}
            type="button"
            data-piece={pieceId}
            onClick={() => markPieceFound(pieceId)}
            className="flex aspect-[3/2] items-center justify-center rounded-sm border-2 border-dashed border-gray-400 text-xs text-gray-400 transition-colors hover:border-rpkm-green hover:text-rpkm-green"
            aria-label={`ชิ้นที่ ${pieceId} (ยังไม่พบ)`}
          >
            {pieceId}
          </button>
        );
      })}
    </div>
  );
}
