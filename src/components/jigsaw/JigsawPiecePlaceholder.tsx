import { cn } from "@lib/utils";

/**
 * A single classic jigsaw-piece silhouette: knobs on the top and right edges,
 * sockets on the bottom and left. Drawn in a -8..108 viewBox so the knobs that
 * bulge past the 15..85 body still fit.
 */
const PIECE_PATH =
  "M15,15 H39 C39,-3 61,-3 61,15 H85 V39 C103,39 103,61 85,61 V85 H61 C61,67 39,67 39,85 H15 V61 C33,61 33,39 15,39 V15 Z";

/**
 * Pink jigsaw-piece placeholder shown in the reward pop-up. It stands in for the
 * real artwork of the piece the user just found until per-piece reward images
 * exist, so it is purely decorative. The faint grain matches the design mockup.
 */
export function JigsawPiecePlaceholder({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-8 -8 116 116"
      className={cn("h-auto w-full", className)}
      role="img"
      aria-label="ชิ้นส่วนจิกซอร์"
    >
      <defs>
        <clipPath id="jigsaw-piece-clip">
          <path d={PIECE_PATH} />
        </clipPath>
        <filter id="jigsaw-piece-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
            result="noise"
          />
          {/* Keep only a soft, dark speckle from the noise's alpha channel. */}
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
          />
        </filter>
      </defs>

      <path d={PIECE_PATH} className="fill-rpkm-pink" />
      <rect
        x="-8"
        y="-8"
        width="116"
        height="116"
        filter="url(#jigsaw-piece-grain)"
        clipPath="url(#jigsaw-piece-clip)"
        opacity="0.25"
      />
    </svg>
  );
}
