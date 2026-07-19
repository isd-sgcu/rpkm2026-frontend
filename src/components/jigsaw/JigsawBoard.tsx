import type { CSSProperties } from "react";
import { useStore } from "@nanostores/react";

import jigsawImage from "@assets/images/jigsaw.png";
import { $collectedAt, $foundPieces, TOTAL_PIECES } from "./jigsawState";

/**
 * Position of each cover's top-left corner, as percentages of the board. Each
 * cover renders at its SVG's intrinsic size, so only its position is set here;
 * nudge these by hand to cover every pixel of the picture underneath. Order:
 * 1..5 top row, 6..10 bottom row.
 */
interface CoverBox {
  left: number;
  top: number;
}

const COVER_POSITIONS: Record<number, CoverBox> = {
  1: { left: 0, top: 0 },
  2: { left: 15, top: 0 },
  3: { left: 39.75, top: 0 },
  4: { left: 59.7, top: 0 },
  5: { left: 74.95, top: 0 },
  6: { left: 0, top: 36.5 },
  7: { left: 19.7, top: 36.5 },
  8: { left: 39.8, top: 48.4 },
  9: { left: 59.8, top: 36.65 },
  10: { left: 79.8, top: 36.65 },
};

/**
 * All mask artwork SVGs, eagerly imported and keyed by the number in their
 * filename (jigsaw_cover_<n>.svg). These are the empty piece-shaped outlines
 * shown for slots the user hasn't collected yet. `import.meta.glob` needs a
 * literal relative pattern, so the "@assets" alias can't be used here.
 */
const maskImageModules = import.meta.glob<{ default: ImageMetadata }>(
  "../../assets/images/jigsaw_cover_*.svg",
  { eager: true },
);

const maskByNumber: Record<number, ImageMetadata> = {};
for (const [path, module] of Object.entries(maskImageModules)) {
  const pieceNumber = Number(path.match(/jigsaw_cover_(\d+)\.svg$/)?.[1]);
  if (pieceNumber) maskByNumber[pieceNumber] = module.default;
}

/**
 * The collected artwork for each piece (jigsaw_<n>.png). Once a piece is found,
 * its mask is replaced by this coloured piece, which shares the mask's shape and
 * aspect ratio so it drops into the same box.
 */
const pieceImageModules = import.meta.glob<{ default: ImageMetadata }>(
  "../../assets/images/jigsaw_*.png",
  { eager: true },
);

const pieceByNumber: Record<number, ImageMetadata> = {};
for (const [path, module] of Object.entries(pieceImageModules)) {
  const pieceNumber = Number(path.match(/jigsaw_(\d+)\.png$/)?.[1]);
  if (pieceNumber) pieceByNumber[pieceNumber] = module.default;
}

/**
 * Piece point ids, in board order (1..5 top row, 6..10 bottom). Kept here
 * rather than imported from jigsaw.json so no sensitive fields from that file
 * (e.g. pointCode, qrCodePayload) get bundled into the client.
 */
const PIECE_POINT_IDS = [
  "jigsaw01",
  "jigsaw02",
  "jigsaw03",
  "jigsaw04",
  "jigsaw05",
  "jigsaw06",
  "jigsaw07",
  "jigsaw08",
  "jigsaw09",
  "jigsaw10",
];

/**
 * Piece id (1..10) -> mask artwork: each pointId (e.g. "jigsaw01") selects the
 * matching jigsaw_cover_<n>.svg. Row-major: 1..5 top row, 6..10 bottom.
 */
const MASK_IMAGES: Record<number, ImageMetadata> = {};
/** Piece id (1..10) -> collected artwork (jigsaw_<n>.png). */
const PIECE_IMAGES: Record<number, ImageMetadata> = {};
for (const pointId of PIECE_POINT_IDS) {
  const pieceNumber = Number(pointId.replace(/\D/g, ""));
  MASK_IMAGES[pieceNumber] = maskByNumber[pieceNumber];
  PIECE_IMAGES[pieceNumber] = pieceByNumber[pieceNumber];
}

/**
 * Box for a piece's slot: top-left corner from the editable {@link
 * COVER_POSITIONS} table (as CSS percentages) and size from the mask's intrinsic
 * dimensions. The mask and its collected piece share this box, so swapping one
 * for the other never shifts anything.
 */
function pieceBoxStyle(pieceId: number): CSSProperties {
  const box = COVER_POSITIONS[pieceId];
  const mask = MASK_IMAGES[pieceId];
  return {
    left: `${box.left}%`,
    top: `${box.top}%`,
    width: mask.width,
    height: mask.height,
  };
}

const MONTH_SHORT_TH = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

/** Display name for a piece, e.g. 1 -> "jigsaw01", 10 -> "jigsaw10". */
function pieceName(pieceId: number): string {
  return `jigsaw${String(pieceId).padStart(2, "0")}`;
}

/** Thai "received on" line for the tooltip; null if the time is unknown. */
function formatCollectedAt(iso: string | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const day = date.getDate();
  const month = MONTH_SHORT_TH[date.getMonth()];
  const year = String(date.getFullYear() + 543).slice(-2);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `ได้รับเมื่อวันที่ ${day} ${month} ${year} เวลา ${hours}.${minutes} น.`;
}

/**
 * The puzzle board. Each of the ten slots shows one of two things: an empty
 * mask outline (jigsaw_cover_<n>.svg) while the piece is missing, or the
 * collected artwork (jigsaw_<n>.png) once it's found. The slots tile together to
 * build up the picture one piece at a time. When all ten are collected the
 * individual masks and pieces are dropped in favour of the seamless full
 * picture (jigsaw.png).
 */
export function JigsawBoard() {
  const found = useStore($foundPieces);
  const collectedAt = useStore($collectedAt);
  const foundSet = new Set(found);
  const complete = found.length >= TOTAL_PIECES;

  return (
    <div className="relative mx-auto h-57.5 w-86.5">
      {/* Board artwork, clipped so piece knobs never spill past the board. */}
      <div className="absolute inset-0 overflow-hidden">
        {complete ? (
          /* Every piece found: show the seamless full picture on its own. */
          <img
            src={jigsawImage.src}
            alt="ภาพจิกซอร์"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          /* In progress: an empty mask for each missing slot, the collected
             piece for each found one. */
          Array.from({ length: TOTAL_PIECES }).map((_, i) => {
            const pieceId = i + 1;
            if (foundSet.has(pieceId)) {
              return (
                <img
                  key={pieceId}
                  src={PIECE_IMAGES[pieceId].src}
                  alt=""
                  data-piece={pieceId}
                  style={pieceBoxStyle(pieceId)}
                  className="absolute block max-w-none"
                />
              );
            }
            return (
              <div
                key={pieceId}
                data-piece={pieceId}
                style={pieceBoxStyle(pieceId)}
                className="absolute block max-w-none"
                aria-label={`ชิ้นที่ ${pieceId} (ยังไม่พบ)`}
              >
                <img
                  src={MASK_IMAGES[pieceId].src}
                  alt=""
                  className="block h-full w-full max-w-none"
                />
              </div>
            );
          })
        )}
      </div>

      {/* Tooltip layer: not clipped, so the hover box can extend outside the
          board. Each entry is an invisible box over a found piece; hovering it
          reveals the piece name and when it was collected. Hidden once the board
          is complete and the individual pieces are gone. */}
      {!complete &&
        found.map((pieceId) => {
          const collected = formatCollectedAt(collectedAt[pieceId]);
          return (
            <div
              key={pieceId}
              className="group absolute hover:z-30"
              style={pieceBoxStyle(pieceId)}
            >
              <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1 hidden -translate-x-1/2 rounded-md border border-black/70 bg-white/95 px-2 py-1 text-center whitespace-nowrap shadow-md group-hover:block">
                <p className="text-[12px] leading-tight font-bold text-black">
                  {pieceName(pieceId)}
                </p>
                <p className="text-[12px] leading-tight text-gray-600">
                  {collected ?? "ได้รับแล้ว"}
                </p>
              </div>
            </div>
          );
        })}
    </div>
  );
}
