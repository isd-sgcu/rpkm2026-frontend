import { toCanvas } from "@bwip-js/browser";
import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";

export interface QrCodeProps {
  contents: string;
  renderScale?: number;
}

export function QrCode({
  contents,
  renderScale,
  ...props
}: QrCodeProps & ComponentPropsWithoutRef<"canvas">) {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvas.current) {
      return;
    }

    toCanvas(canvas.current, {
      text: contents,
      bcid: "qrcode",
      scale: renderScale ?? 4,
    });
  }, [contents, renderScale]);

  return <canvas ref={canvas} {...props} />;
}
