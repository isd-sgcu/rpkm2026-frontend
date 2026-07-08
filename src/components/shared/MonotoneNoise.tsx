import { cn } from "@lib/utils";
import React, { useMemo } from "react";

// Same as monotone noise configuration in figma. Please see the design.
export interface MonotoneNoiseConfiguration {
  noiseSize?: number;
  noiseDensity?: number;
  noiseColor?: string;
  noiseSeed?: number;
}

export function MonotoneNoise({
  noiseSize = 3.9,
  noiseDensity = 15,
  noiseColor = "rgba(0 0 0 / 0.3)",
  noiseSeed = 25_5444,
  className,
}: MonotoneNoiseConfiguration & { className?: string }) {
  const tableValues = useMemo(() => {
    const radius = Math.round(noiseDensity / 4) * 2;
    // center at 25,26
    return (
      "0 ".repeat(Math.max(0, 25 - radius / 2)) +
      "1 ".repeat(Math.min(100, radius)) +
      "0 ".repeat(Math.max(0, 75 - radius / 2))
    );
  }, [noiseDensity]);

  return (
    <div className={cn("overflow-hidden", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        fill="none"
      >
        <g filter="url(#_uMDEIPgmFI)">
          <rect width="100%" height="100%" fill="#ffffff" />
        </g>

        <defs>
          <filter
            id="_uMDEIPgmFI"
            x="0"
            y="0"
            width="100%"
            height="100%"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency={`${1 / noiseSize} ${1 / noiseSize}`}
              stitchTiles="stitch"
              numOctaves="3"
              result="noise"
              seed={noiseSeed}
            />
            <feColorMatrix
              in="noise"
              type="luminanceToAlpha"
              result="alphaNoise"
            />
            <feComponentTransfer in="alphaNoise" result="coloredNoise1">
              <feFuncA type="discrete" tableValues={tableValues} />
            </feComponentTransfer>
            <feFlood floodColor={noiseColor} result="color1Flood" />
            <feComposite
              operator="in"
              in2="coloredNoise1"
              in="color1Flood"
              result="D7-lYDOpA50"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

export function MonotoneNoiseContainer({
  noise,
  className,
  children,
  ...props
}: { noise?: MonotoneNoiseConfiguration } & React.ComponentProps<"div">) {
  return (
    <div
      className={cn("overflow-hidden relative isolate", className)}
      {...props}
    >
      <MonotoneNoise {...noise} className="absolute inset-0 -z-1" />
      {children}
    </div>
  );
}
