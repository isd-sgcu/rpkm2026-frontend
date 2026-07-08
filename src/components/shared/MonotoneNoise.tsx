import { cn } from "@lib/utils";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";

function useResizeObserver(ref: RefObject<Element | null>) {
  const [size, setSize] = useState({ w: 1000, h: 1000 });
  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      setSize({
        w: entries[0].contentRect.width,
        h: entries[0].contentRect.height,
      });
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return size;
}

// Same as monotone noise configuration in figma. Please see the design.
export interface MonotoneNoiseConfiguration {
  noiseSize?: number;
  noiseDensity?: number;
  noiseColor?: string;
  noiseSeed?: number;
}

export function MonotoneNoise({
  noiseSize = 1,
  noiseDensity = 20,
  noiseColor = "rgb(0 0 0 / 0.5)",
  noiseSeed = 25_5444,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & MonotoneNoiseConfiguration) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const size = useResizeObserver(containerRef);

  const tableValues = useMemo(() => {
    const radius = Math.round(noiseDensity / 4) * 2;
    // center at 25,26
    return (
      "0 ".repeat(25 - radius / 2) +
      "1 ".repeat(radius) +
      "0 ".repeat(75 - radius / 2)
    );
  }, [noiseDensity]);

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden isolate", className)}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mix-blend-multiply absolute -z-1"
        width={size.w}
        height={size.h}
        viewBox={`0 0 ${size.w} ${size.h}`}
        fill="none"
      >
        <g filter="url(#_uMDEIPgmFI)">
          <rect width={size.w} height={size.h} fill="#ffffff" />
        </g>
        <defs>
          <filter
            id="_uMDEIPgmFI"
            x="0"
            y="0"
            width={size.w}
            height={size.h}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
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
            <feComposite
              operator="in"
              in2="shape"
              in="coloredNoise1"
              result="noise1Clipped"
            />
            <feFlood floodColor={noiseColor} result="color1Flood" />
            <feComposite
              operator="in"
              in2="noise1Clipped"
              in="color1Flood"
              result="color1"
            />
            <feMerge result="effect1_noise_780_13613">
              <feMergeNode in="shape" />
              <feMergeNode in="color1" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      {children}
    </div>
  );
}
