import type { CSSProperties } from "react";
import { useStore } from "@nanostores/react";

import { $foundPieces, markPieceFound, TOTAL_PIECES } from "./jigsawState";

import jigsaw1 from "@assets/images/jigsaw_1.png";
import jigsaw2 from "@assets/images/jigsaw_2.png";
import jigsaw3 from "@assets/images/jigsaw_3.png";
import jigsaw4 from "@assets/images/jigsaw_4.png";
import jigsaw5 from "@assets/images/jigsaw_5.png";
import jigsaw6 from "@assets/images/jigsaw_6.png";
import jigsaw7 from "@assets/images/jigsaw_7.png";
import jigsaw8 from "@assets/images/jigsaw_8.png";
import jigsaw9 from "@assets/images/jigsaw_9.png";
import jigsaw10 from "@assets/images/jigsaw_10.png";

const COLS = 5;
const ROWS = 2;

/**
 * Native size of one puzzle cell (a piece body, without its interlocking knobs)
 * in the source artwork, in px. Each piece PNG is tightly cropped to its own
 * content, so its intrinsic width/height already includes whatever knobs stick
 * out past this cell; we position it by mapping those native pixels onto the
 * board via the reference board size below.
 */
const CELL_WIDTH = 2250;
const CELL_HEIGHT = 3750;

/** Full board in source px: COLS x ROWS cells. Both piece dimensions map through this. */
const BOARD_WIDTH = COLS * CELL_WIDTH; // 11250
const BOARD_HEIGHT = ROWS * CELL_HEIGHT; // 7500

/** Piece id (1..10) -> artwork, laid out row-major: 1..5 top row, 6..10 bottom. */
const PIECE_IMAGES: Record<number, ImageMetadata> = {
  1: jigsaw1,
  2: jigsaw2,
  3: jigsaw3,
  4: jigsaw4,
  5: jigsaw5,
  6: jigsaw6,
  7: jigsaw7,
  8: jigsaw8,
  9: jigsaw9,
  10: jigsaw10,
};

/**
 * Absolute position that centres a piece image on its grid cell. The image is
 * tightly cropped to the piece, so its own width/height (mapped through the
 * reference board size) determine how far its knobs reach into neighbouring
 * cells. Centring the crop on the cell centre lands each piece body on its cell
 * and lets the knobs overlap the neighbours' sockets.
 */
function pieceStyle(pieceId: number): CSSProperties {
  const img = PIECE_IMAGES[pieceId];
  const idx = pieceId - 1;
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const centerX = (col + 0.5) / COLS;
  const centerY = (row + 0.5) / ROWS;
  const widthFrac = img.width / BOARD_WIDTH;
  const heightFrac = img.height / BOARD_HEIGHT;
  return {
    width: `${widthFrac * 100}%`,
    left: `${(centerX - widthFrac / 2) * 100}%`,
    top: `${(centerY - heightFrac / 2) * 100}%`,
  };
}

/**
 * The puzzle board. Missing pieces show as numbered dashed slots (5x2). Each
 * found piece is drawn as its real artwork placed in its own slot; the artwork
 * is scaled so the knobs overlap into neighbouring slots and the pieces fit
 * together to build up the full picture.
 *
 * Until the QR scan flow is wired up, tapping an empty slot simulates scanning
 * that piece so the fill + progress behaviour can be demonstrated.
 * TODO: replace the onClick simulation with the result of a real QR scan.
 */
export function JigsawBoard() {
  const found = useStore($foundPieces);
  const foundSet = new Set(found);

  return (
    <div className="relative w-full aspect-[3/2] overflow-hidden">
      {/* Empty-slot grid (bottom layer) */}
      <div className="absolute inset-0 grid grid-cols-5 grid-rows-2">
        {Array.from({ length: TOTAL_PIECES }).map((_, i) => {
          const pieceId = i + 1;
          if (foundSet.has(pieceId)) {
            // Transparent cell so the artwork placed on top shows through.
            return <div key={pieceId} data-piece={pieceId} />;
          }
          return (
            <button
              key={pieceId}
              type="button"
              data-piece={pieceId}
              onClick={() => markPieceFound(pieceId)}
              className="flex items-center justify-center border-2 border-dashed border-gray-400 text-xs text-gray-400 transition-colors hover:border-rpkm-green hover:text-rpkm-green"
              aria-label={`ชิ้นที่ ${pieceId} (ยังไม่พบ)`}
            >
              {pieceId}
            </button>
          );
        })}
      </div>

      {/* Found-piece artwork, each placed in its own slot (ascending so higher
          pieces overlap lower ones at the seams). */}
      {found.map((pieceId) => (
        <img
          key={pieceId}
          src={PIECE_IMAGES[pieceId].src}
          alt={`ชิ้นส่วนจิกซอร์ที่ ${pieceId}`}
          style={pieceStyle(pieceId)}
          className="pointer-events-none absolute h-auto"
        />
      ))}
    </div>
  );
}
