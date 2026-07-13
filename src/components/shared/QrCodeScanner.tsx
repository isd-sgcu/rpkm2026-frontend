import { useT } from "@lib/i18n/useT";
import { cn } from "@lib/utils";
import { Scanner, type IScannerError } from "@yudiel/react-qr-scanner";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";

interface QrScannerProps {
  className?: string;
  onScan: (contents: string) => void;

  // Should pause when you get a scan result while you are showing dialog
  paused?: boolean;

  // Corner brackets + scanning-beam chrome drawn over the camera feed
  overlay?: boolean;

  // Surface a spinner over the camera once a request is slow enough to notice,
  // so fast responses don't flash it
  loading?: boolean;
}

export function QrScanner({
  className,
  paused = false,
  onScan,
  overlay = true,
  loading = false,
}: QrScannerProps) {
  const t = useT();

  // TODO: permission flow
  return (
    <div
      className={cn("relative aspect-square w-full overflow-hidden", className)}
    >
      <Scanner
        onScan={(codes) => {
          const code = codes[0]?.rawValue;
          if (code) {
            onScan(code);
          }
        }}
        onError={(error) => displayQrScannerError(error, t)}
        paused={paused}
        constraints={{
          facingMode: {
            ideal: "environment",
          },
        }}
        components={{ finder: false }}
        sound={false}
        styles={{
          container: { width: "100%", height: "100%" },
          video: { width: "100%", height: "100%", objectFit: "cover" },
        }}
      />

      {overlay && <QrScannerOverlay />}

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <LoaderCircleIcon className="size-10 animate-spin text-white" />
        </div>
      )}
    </div>
  );
}

function QrScannerOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* corner brackets */}
      <span className="absolute top-[8%] left-[8%] size-8 rounded-tl-md border-t-4 border-l-4 border-foreground" />
      <span className="absolute top-[8%] right-[8%] size-8 rounded-tr-md border-t-4 border-r-4 border-foreground" />
      <span className="absolute bottom-[8%] left-[8%] size-8 rounded-bl-md border-b-4 border-l-4 border-foreground" />
      <span className="absolute right-[8%] bottom-[8%] size-8 rounded-br-md border-r-4 border-b-4 border-foreground" />
    </div>
  );
}

const qrScannerErrorKeys = {
  "permission-denied": "qrcode.scannerError.permissionDenied",
  "no-camera": "qrcode.scannerError.noCamera",
  "in-use": "qrcode.scannerError.inUse",
  overconstrained: "qrcode.scannerError.overconstrained",
  "insecure-context": "qrcode.scannerError.insecureContext",
  unsupported: "qrcode.scannerError.unsupported",
  aborted: "qrcode.scannerError.aborted",
  security: "qrcode.scannerError.security",
  "type-error": "qrcode.scannerError.typeError",
  unknown: "qrcode.scannerError.unknown",
} as const satisfies Record<IScannerError["kind"], string>;

const refreshableErrors: Set<IScannerError["kind"]> = new Set([
  "aborted",
  "in-use",
  "overconstrained",
  "permission-denied",
  "security",
  "unknown",
  "type-error",
]);

function displayQrScannerError(
  error: IScannerError,
  t: ReturnType<typeof useT>,
) {
  toast.error(t(qrScannerErrorKeys[error.kind]), {
    duration: 60 * 1000,
    action: refreshableErrors.has(error.kind)
      ? {
          label: t("qrcode.refresh"),
          onClick: () => {
            location.reload();
          },
        }
      : undefined,
  });
}
